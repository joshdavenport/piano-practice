import { useAnimationControls } from 'framer-motion';

export function useTwelveTetAnimationControls() {
  const controls1 = useAnimationControls();
  const controls2 = useAnimationControls();
  const controls3 = useAnimationControls();
  const controls4 = useAnimationControls();
  const controls5 = useAnimationControls();
  const controls6 = useAnimationControls();
  const controls7 = useAnimationControls();
  const controls8 = useAnimationControls();
  const controls9 = useAnimationControls();
  const controls10 = useAnimationControls();
  const controls11 = useAnimationControls();
  const controls12 = useAnimationControls();

  return [
    controls1,
    controls2,
    controls3,
    controls4,
    controls5,
    controls6,
    controls7,
    controls8,
    controls9,
    controls10,
    controls11,
    controls12,
  ] as const;
}
