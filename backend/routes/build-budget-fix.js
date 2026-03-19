// Budget enforcement section with Intel CPU filtering
// Lines 335-347 replacement

        let catalogParts = catalogPartsRaw
          .filter(p => p.name !== enrichedBuild[category].name)
          .sort((a, b) => a.priceNumeric - b.priceNumeric);

        // CRITICAL: Filter out Intel CPUs since we only have AMD motherboards
        if (category === 'CPU') {
          const intelKeywords = ['Intel', 'Core i3', 'Core i5', 'Core i7', 'Core i9', 'Pentium', 'Celeron'];
          const beforeCount = catalogParts.length;
          catalogParts = catalogParts.filter(cpu => {
            const name = cpu.name.toLowerCase();
            const hasIntel = intelKeywords.some(keyword => name.includes(keyword.toLowerCase()));
            return !hasIntel;
          });
          console.log(`[Budget Enforcement] Filtered ${beforeCount - catalogParts.length} Intel CPUs, ${catalogParts.length} AMD CPUs available for swap`);
        }

        for (const cheaper of catalogParts) {
          const saving = enrichedBuild[category].priceNumeric - cheaper.priceNumeric;
          if (saving > 0) {
            console.log(`Swapping ${category}: ${enrichedBuild[category].name} → ${cheaper.name} (saves $${saving})`);
            enrichedBuild[category] = cheaper;
            totalPrice -= saving;
            if (totalPrice <= config.budget) break;
          }
        }
