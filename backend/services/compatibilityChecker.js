

// Compatability Checker Service

class CompatibilityChecker {

  constructor() {
    this.errors = [];   // Hard incompatibilities (build won't work)
    this.warnings = []; // Soft issues (will work but not ideal)
  }


  validateBuild(build) {
    // Clear previous results
    this.errors = [];
    this.warnings = [];

    // TODO: Implement actual validation logic

    // Parts extraction -
    const cpu = build.CPU || build.cpu;
    const motherboard = build.MOTHERBOARD || build.motherboard;
    const memory = build.RAM || build.memory;
    const gpu = build.GPU || build['video-card'];
    const psu = build.PSU || build.powersupply;
    const pcCase = build.CASE || build.case;
    const cooler = build.COOLING || build['cpu-cooler'];


    // Run all compatibility checks
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

  // Motherboard socket CPU verify.

  checkCpuMotherboardSocket(cpu, motherboard) {
    if (!cpu || !motherboard) return;  // Can't check if either part is missing

    // Try to get socket from specs (spread onto part from Supabase)
    const cpuSocket = cpu.socket || null;
    const moboSocket = motherboard.socket || null;

    // If either socket is unknown, warn instead of error
    if (!cpuSocket || !moboSocket) {
      this.warnings.push({
        type: 'socket',
        message: 'Could not verify CPU/motherboard socket compatibility'
      });
      return;
    }

    // Normalize for comparison (e.g. "LGA 1700" vs "LGA1700")
    const normalize = (s) => s.toString().toUpperCase().replace(/\s/g, '');

    if (normalize(cpuSocket) !== normalize(moboSocket)) {
      this.errors.push({
        type: 'socket',
        message: `CPU socket (${cpuSocket}) is incompatible with motherboard socket (${moboSocket})`,
        parts: { cpu: cpu.name, motherboard: motherboard.name }
      });
    }
  }

  // RAM type verify. DDR5 vs DDR4 + Motherboard RAM slot support

  checkRAMCompatibility(memory, motherboard) {

    if (!memory || !motherboard) return;

    const ramType = memory.memory_type || null;          // e.g. "DDR5", "DDR4"
    const moboMemType = motherboard.memory_type || null; // e.g. "DDR5", "DDR4"

    if (!ramType || !moboMemType) {
      this.warnings.push({
        type: 'ram',
        message: 'Could not verify RAM compatibility'
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



  // Check Ram Speed / MHz
  checkRamSpeed(memory, motherboard) {

    const ramSpeed = memory.speed || null;
    const moboMaxSpeed = motherboard.max_memory_speed || null;

    // Edgecase

    if (!memory || !motherboard) return;

    if (!ramSpeed || !moboMaxSpeed) {
      this.warnings.push({
        type: 'ram',
        message: 'Could not verify RAM speed compatibility'
      });
      return;
    }

    if (ramSpeed > moboMaxSpeed) {
      this.errors.push({
        type: 'ram',
        message: `RAM speed (${ramSpeed}MHz) exceeds motherboard maximum (${moboMaxSpeed}MHz) — it will downclock`,
        parts: { memory: memory.name, motherboard: motherboard.name }
      });
    }

  };


  checkRAMCapacity(memory, motherboard) {
    if (!memory || !motherboard) return;

    const ramSlots = motherboard.ram_slots || null;       // e.g. 2 or 4
    const moboMaxRam = motherboard.max_ram_gb || null;    // e.g. 64 or 128
    const ramModules = memory.modules || 1;                  // how many sticks in the kit
    const ramTotalGb = memory.capacity_gb || null;

    if (ramSlots && ramModules > ramSlots) {
      this.errors.push({
        type: 'ram_slots',
        message: `RAM kit has ${ramModules} sticks but motherboard only has ${ramSlots} slots`,
        parts: { memory: memory.name, motherboard: motherboard.name }
      });
    }

    if (moboMaxRam && ramTotalGb > moboMaxRam) {
      this.errors.push({
        type: 'ram_capacity',
        message: `RAM total (${ramTotalGb}GB) exceeds motherboard maximum (${moboMaxRam}GB)`,
        parts: { memory: memory.name, motherboard: motherboard.name }
      });
    }
  }


  // PowerSupply

  checkPSUWattage(cpu, gpu, psu) {
    if (!psu) return;

    // Get TDP values with defaults
    const cpuTdp = cpu?.tdp || 65;  // Default 65W if missing
    const gpuTdp = gpu?.tdp || 150; // Default 150W if missing
    const systemOverhead = 100;     // Mobo, RAM, storage, fans

    const estimatedDraw = cpuTdp + gpuTdp + systemOverhead;

    const psuWattage = psu.wattage || null;

    if (!psuWattage) {
      this.warnings.push({
        type: 'psu',
        message: 'Could not verify PSU wattage — check manually'
      });
      return;
    }

    // Recommend 20% headroom
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

  // Case Form Factor

  checkCaseFormFactor(pcCase, motherboard) {
    if (!pcCase || !motherboard) return;

    const caseType = pcCase.type || null;           // "Mid Tower", "Full Tower"


    const moboFormFactor = motherboard.form_factor || null; // "ATX", "Micro ATX"


    // string verification:

    // function normalizeFormFactor(str) {
    //   return str?.toLowerCase().replace(/[\s\-\/]+/g, '') ?? '';
    // }

    // if (!caseType || !moboFormFactor) {
    //   this.warnings.push({
    //     type: 'case',
    //     message: 'Could not verify case/motherboard compatibility'
    //   });
    //   return;
    // }

    // // Compatibility map
    // const fits = {
    //   'Full Tower': ['E-ATX', 'ATX', 'Micro ATX', 'Mini-ITX'],
    //   'ATX Full Tower': ['E-ATX', 'ATX', 'Micro ATX', 'Mini-ITX'],
    //   'Mid Tower': ['ATX', 'Micro ATX', 'Mini-ITX'],
    //   'ATX Mid Tower': ['ATX', 'Micro ATX', 'Mini-ITX'],
    //   'Mini Tower': ['Micro ATX', 'Mini-ITX'],
    //   'MicroATX Mini Tower': ['Micro ATX', 'Mini-ITX'],
    //   'MicroATX': ['Micro ATX', 'Mini-ITX'],
    //   'Mini-ITX': ['Mini-ITX']
    // };



    // const compatible = fits[caseType]?.includes(moboFormFactor);

    // New compatible check

    // if (!compatible) {
    //   this.errors.push({
    //     type: 'case',
    //     message: `Case type (${caseType}) may not fit motherboard form factor (${moboFormFactor})`,
    //     parts: { case: pcCase.name, motherboard: motherboard.name }
    //   });
    // }
  }

}

module.exports = { CompatibilityChecker };
