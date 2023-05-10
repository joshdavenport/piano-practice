export const octaveCounts = [0, 1, 2, 3] as const;
export type OctaveCount = (typeof octaveCounts)[number];

export const practiceTypes = [
  'all_keys',
  'only_natural',
  'only_sharps',
] as const;
export type PracticeType = (typeof practiceTypes)[number];
