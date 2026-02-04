
/**
 * Get phases sorted by order from case/activity type.
 * @param {Object} activity - Case or activity with type.phases
 * @returns {Array} Sorted phases
 */
const getSortedPhases = (activity) => {
  const phases = activity?.type?.phases ?? [];
  return [...phases].sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
};

/**
 * Find current status phase: matches activity.status to type.phases and returns name + colors.
 * @param {Object} activity - Case/activity with status and type.phases
 * @returns {{ name: string, bgColor: string, color: string }}
 */
export const findCurrentStatusPhase = (activity) => {
  const currentStatus = activity?.status;
  const sortedPhases = getSortedPhases(activity);
  const matchingPhase = sortedPhases.find((phase) => phase.name === currentStatus);

  return {
    name: currentStatus ?? "—",
    bgColor: matchingPhase?.bgColor ?? "#ffffff",
    color: matchingPhase?.color ?? "#000000",
  };
};

/**
 * Find next phase: the phase that comes after the current status in type.phases order.
 * @param {Object} activity - Case/activity with status and type.phases
 * @returns {{ name: string, bgColor: string, color: string } | null} Next phase info, or null if none
 */
export const findNextPhase = (activity) => {
  const currentStatus = activity?.status;
  const sortedPhases = getSortedPhases(activity);
  const currentIndex = sortedPhases.findIndex((p) => p.name === currentStatus);

  if (currentIndex < 0 || currentIndex >= sortedPhases.length - 1) {
    return null;
  }

  const nextPhase = sortedPhases[currentIndex + 1];
  return {
    name: nextPhase?.name ?? "—",
    bgColor: nextPhase?.bgColor ?? "#f5f5f5",
    color: nextPhase?.color ?? "#000000",
  };
};



/**
 * Calculate case progress based on case type phases and current status
 * @param {Object} caseData - Case data object containing type, status, and phases
 * @returns {number} Progress percentage (0-100)
 * 
 * Logic:
 * 1. Match caseData.status with phase.name in type.phases array
 * 2. Find the current phase order
 * 3. Calculate progress: (current order / total phases) * 100
 * 4. If current status matches the last phase (highest order), return 100% (completed)
 * 
 * @example
 * // For a case with 5 phases:
 * // Phase 1 (order 1): 1/5 * 100 = 20%
 * // Phase 2 (order 2): 2/5 * 100 = 40%
 * // Phase 3 (order 3): 3/5 * 100 = 60%
 * // Phase 4 (order 4): 4/5 * 100 = 80%
 * // Phase 5 (order 5): 5/5 * 100 = 100% (completed - last phase)
 */
export const calculateProgress = (caseData) => {
  if (!caseData || !caseData.status) {
    return 0;
  }

  // Handle type as object or ID string
  const typeData = typeof caseData.type === 'object' ? caseData.type : null;
  
  if (!typeData || !typeData.phases || !Array.isArray(typeData.phases) || typeData.phases.length === 0) {
    return 0;
  }

  const phases = typeData.phases;
  const currentStatus = caseData.status;

  // Find the current phase by matching status with phase.name
  const currentPhase = phases.find(phase => phase.name === currentStatus);

  if (!currentPhase) {
    return 0;
  }

  // Find the last phase (highest order)
  const lastPhase = phases.reduce((max, phase) => 
    phase.order > max.order ? phase : max
  );

  // If current status matches the last phase, consider it completed (100%)
  if (currentPhase.order === lastPhase.order) {
    return 100;
  }

  // Calculate progress: (current phase order / total phases) * 100
  // Example: 4 phases, at order 1: 1/4 * 100 = 25%
  //         4 phases, at order 2: 2/4 * 100 = 50%
  //         4 phases, at order 3: 3/4 * 100 = 75%
  //         4 phases, at order 4: 100% (handled above)
  const progress = (currentPhase.order / phases.length) * 100;
  return Math.round(progress);
};

