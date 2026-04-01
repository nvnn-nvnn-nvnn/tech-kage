
// Compatibility Checker Service

class CompatibilityChecker {

  constructor() {
    this.errors = [];   // Hard incompatibilities (build won't work)
    this.warnings = []; // Soft issues (will work but not ideal)
  }

  validateBuild(build) {
    this.errors = [];
    this.warnings = [];

    const cpu = build.CPU || build.cpu;
    const motherboard = build.MOTHERBOARD || build.motherboard;
    const memory = build.RAM || build.memory;
    const gpu = build.GPU || build['video-card'];
    const psu = build.PSU || build.powersupply;
    const pcCase = build.CASE || build.case;
    const cooler = build.COOLING || build['cpu-cooler'];

    this.checkCpuMotherboardSocket(cpu, motherboard);
    this.checkRAMCompatibility(memory, motherboard);
    this.checkRamSpeed(memory, motherboard);
    this.checkRAMCapacity(memory, motherboard);
    this.checkPSUWattage(cpu, gpu, psu);
    this.checkCaseFormFactor(pcCase, motherboard);

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  // CPU socket vs motherboard socket
  checkCpuMotherboardSocket(cpu, motherboard) {
    if (!cpu || !motherboard) return;

    const cpuSocket = cpu.socket || null;
    const moboSocket = motherboard.socket || null;

    if (!cpuSocket || !moboSocket) {
      this.warnings.push({
        type: 'socket',
        message: 'Could not verify CPU/motherboard socket compatibility'
      });
      return;
    }

    const normalize = (s) => s.toString().toUpperCase().replace(/\s/g, '');

    const intelSockets = ['LGA1700', 'LGA1851', 'LGA1200', 'LGA1151', 'LGA2066'];
    const amdSockets = ['AM5', 'AM4', 'AM3+', 'TR4', 'TRX40'];

    const normalizedCpuSocket = normalize(cpuSocket);
    const normalizedMoboSocket = normalize(moboSocket);

    const cpuIsIntel = intelSockets.some(s => normalize(s) === normalizedCpuSocket);
    const cpuIsAMD = amdSockets.some(s => normalize(s) === normalizedCpuSocket);
    const moboIsIntel = intelSockets.some(s => normalize(s) === normalizedMoboSocket);
    const moboIsAMD = amdSockets.some(s => normalize(s) === normalizedMoboSocket);

    if (cpuIsIntel && moboIsAMD) {
      this.errors.push({
        type: 'socket',
        message: `Intel CPU (${cpuSocket}) cannot be used with AMD motherboard (${moboSocket})`,
        parts: { cpu: cpu.name, motherboard: motherboard.name }
      });
      return;
    }

    if (cpuIsAMD && moboIsIntel) {
      this.errors.push({
        type: 'socket',
        message: `AMD CPU (${cpuSocket}) cannot be used with Intel motherboard (${moboSocket})`,
        parts: { cpu: cpu.name, motherboard: motherboard.name }
      });
      return;
    }

    if (normalizedCpuSocket !== normalizedMoboSocket) {
      this.errors.push({
        type: 'socket',
        message: `CPU socket (${cpuSocket}) is incompatible with motherboard socket (${moboSocket})`,
        parts: { cpu: cpu.name, motherboard: motherboard.name }
      });
    }
  }

  // RAM DDR generation vs motherboard memory type
  // speed field is [gen, mhz] array (e.g. [5, 6000] = DDR5-6000)
  checkRAMCompatibility(memory, motherboard) {
    if (!memory || !motherboard) return;

    // Try explicit memory_type field first, else derive from speed array
    let ramType = memory.memory_type || null;
    if (!ramType && Array.isArray(memory.speed)) {
      const gen = memory.speed[0];
      if (gen >= 3 && gen <= 6) ramType = `DDR${gen}`;
    }

    const moboMemType = motherboard.memory_type || null;

    if (!ramType || !moboMemType) {
      this.warnings.push({
        type: 'ram',
        message: 'Could not verify RAM DDR type compatibility — check manually'
      });
      return;
    }

    const normalize = (s) => s.toString().toUpperCase().replace(/\s/g, '');

    if (normalize(ramType) !== normalize(moboMemType)) {
      this.errors.push({
        type: 'ram',
        message: `RAM type (${ramType}) is incompatible with motherboard memory type (${moboMemType})`,
        parts: { memory: memory.name, motherboard: motherboard.name }
      });
    }
  }

  // RAM speed vs motherboard max supported speed
  // speed field is [gen, mhz] array — extract mhz from index 1
  checkRamSpeed(memory, motherboard) {
    if (!memory || !motherboard) return;

    const ramSpeed = Array.isArray(memory.speed) ? memory.speed[1] : (memory.speed || null);
    const moboMaxSpeed = motherboard.max_memory_speed || null;

    if (!ramSpeed || !moboMaxSpeed) {
      this.warnings.push({
        type: 'ram_speed',
        message: 'Could not verify RAM speed compatibility'
      });
      return;
    }

    if (ramSpeed > moboMaxSpeed) {
      // Downclocking is not a hard error — the system still boots
      this.warnings.push({
        type: 'ram_speed',
        message: `RAM speed (${ramSpeed}MHz) exceeds motherboard maximum (${moboMaxSpeed}MHz) — it will downclock`,
        parts: { memory: memory.name, motherboard: motherboard.name }
      });
    }
  }

  // RAM slot count and total capacity vs motherboard limits
  // modules field is [count, gb_per_stick] array (e.g. [2, 16] = 2x16GB)
  checkRAMCapacity(memory, motherboard) {
    if (!memory || !motherboard) return;

    const ramSlots = motherboard.memory_slots || null;   // fixed: was ram_slots
    const moboMaxRam = motherboard.max_memory || null;   // fixed: was max_ram_gb

    // Handle modules as array [count, gb_per_stick] or plain number
    const ramModules = Array.isArray(memory.modules) ? memory.modules[0] : (memory.modules || 1);
    const ramTotalGb = Array.isArray(memory.modules)
      ? memory.modules[0] * memory.modules[1]
      : (memory.capacity_gb || null);

    if (ramSlots && ramModules > ramSlots) {
      this.errors.push({
        type: 'ram_slots',
        message: `RAM kit has ${ramModules} sticks but motherboard only has ${ramSlots} slots`,
        parts: { memory: memory.name, motherboard: motherboard.name }
      });
    }

    if (moboMaxRam && ramTotalGb && ramTotalGb > moboMaxRam) {
      this.errors.push({
        type: 'ram_capacity',
        message: `RAM total (${ramTotalGb}GB) exceeds motherboard maximum (${moboMaxRam}GB)`,
        parts: { memory: memory.name, motherboard: motherboard.name }
      });
    }
  }

  // PSU wattage vs estimated system draw
  checkPSUWattage(cpu, gpu, psu) {
    if (!psu) return;

    const cpuTdp = cpu?.tdp || 65;
    const gpuTdp = gpu?.tdp || 150;
    const systemOverhead = 100;

    const estimatedDraw = cpuTdp + gpuTdp + systemOverhead;
    const psuWattage = psu.wattage || null;

    if (!psuWattage) {
      this.warnings.push({
        type: 'psu',
        message: 'Could not verify PSU wattage — check manually'
      });
      return;
    }

    const recommended = Math.ceil(estimatedDraw * 1.2);

    if (psuWattage < estimatedDraw) {
      this.errors.push({
        type: 'psu',
        message: `PSU (${psuWattage}W) is undersized for estimated system draw (${estimatedDraw}W)`,
        parts: { psu: psu.name }
      });
    } else if (psuWattage < recommended) {
      this.warnings.push({
        type: 'psu',
        message: `PSU (${psuWattage}W) has little headroom — recommended ${recommended}W for 20% buffer`,
        parts: { psu: psu.name }
      });
    }
  }

  // Case type vs motherboard form factor
  // case.type examples: "ATX Mid Tower", "MicroATX Mini Tower"
  // motherboard.form_factor examples: "ATX", "Micro ATX"
  checkCaseFormFactor(pcCase, motherboard) {
    if (!pcCase || !motherboard) return;

    const caseType = pcCase.type || null;
    const moboFormFactor = motherboard.form_factor || null;

    if (!caseType || !moboFormFactor) {
      this.warnings.push({
        type: 'case',
        message: 'Could not verify case/motherboard form factor compatibility'
      });
      return;
    }

    const caseStr = caseType.toLowerCase();
    let allowedFormFactors;

    if (caseStr.includes('full')) {
      allowedFormFactors = ['E-ATX', 'ATX', 'Micro ATX', 'Mini ITX', 'Mini-ITX'];
    } else if (caseStr.includes('mid')) {
      allowedFormFactors = ['ATX', 'Micro ATX', 'Mini ITX', 'Mini-ITX'];
    } else if (caseStr.includes('microatx') || caseStr.includes('micro atx') || caseStr.includes('mini tower')) {
      allowedFormFactors = ['Micro ATX', 'Mini ITX', 'Mini-ITX'];
    } else if (caseStr.includes('mini itx') || caseStr.includes('mini-itx')) {
      allowedFormFactors = ['Mini ITX', 'Mini-ITX'];
    } else {
      this.warnings.push({
        type: 'case',
        message: `Could not determine compatibility for case type: ${caseType}`
      });
      return;
    }

    if (!allowedFormFactors.includes(moboFormFactor)) {
      this.errors.push({
        type: 'case',
        message: `Case (${caseType}) cannot fit motherboard form factor (${moboFormFactor})`,
        parts: { case: pcCase.name, motherboard: motherboard.name }
      });
    }
  }
}

module.exports = { CompatibilityChecker };
