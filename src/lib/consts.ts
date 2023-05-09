export const octaveCounts = [1, 2, 3] as const;
export type OctaveCount = (typeof octaveCounts)[number];
