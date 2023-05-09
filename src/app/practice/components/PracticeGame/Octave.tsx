import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode, useEffect } from 'react';
import { useTwelveTetAnimationControls } from '@/app/practice/hooks/useTwelveTetAnimationControls';
import { useAtomValue } from 'jotai';
import { gameStateAtom } from '@/lib/atoms';

type OctaveProps = {
  notes: string[];
};

export function Octave({ notes }: OctaveProps) {
  const noteControls = useTwelveTetAnimationControls();
  const noteHighlightControls = useTwelveTetAnimationControls();
  const noteLabelControls = useTwelveTetAnimationControls();

  const gameState = useAtomValue(gameStateAtom);

  useEffect(() => {
    if (!notes) {
      return;
    }

    const { lastCorrectNote, lastIncorrectNote } = gameState;

    if (lastCorrectNote && notes.includes(lastCorrectNote)) {
      const animateSuccess = async () => {
        const noteIndex = notes.indexOf(lastCorrectNote);

        await Promise.all([
          noteControls[noteIndex].start({
            scaleY: 1.1,
          }),
          noteHighlightControls[noteIndex].start({
            opacity: 1,
          }),
          noteLabelControls[noteIndex].start({
            scaleY: 1.5,
            scaleX: 1.75,
            translateY: -15,
            opacity: 1,
          }),
        ]);

        await new Promise((resolve) => setTimeout(resolve, 400));

        await Promise.all([
          noteControls[noteIndex].start({
            scaleY: 1,
          }),
          noteHighlightControls[noteIndex].start({
            opacity: 0,
          }),
          noteLabelControls[noteIndex].start({
            scaleY: 1,
            scaleX: 1,
            translateY: 0,
            opacity: 0,
          }),
        ]);
      };

      animateSuccess();
    } else if (lastIncorrectNote && notes.includes(lastIncorrectNote)) {
      const animateFailure = async () => {
        const noteIndex = notes.indexOf(lastIncorrectNote);

        await Promise.all([
          noteHighlightControls[noteIndex].start({
            opacity: 1,
          }),
        ]);

        await new Promise((resolve) => setTimeout(resolve, 200));

        await Promise.all([
          noteHighlightControls[noteIndex].start({
            opacity: 0,
          }),
        ]);
      };

      animateFailure();
    }
  }, [gameState, notes, noteControls, noteLabelControls]);

  const pianoOutput: ReactNode[] = [];

  for (const [index, note] of Object.entries(notes)) {
    const isSharp = note.includes('#');

    pianoOutput.push(
      <motion.div
        key={note}
        animate={noteControls[+index]}
        className={cn([
          'relative origin-top border border-black perspective-500',
          (gameState.lastCorrectNote === note ||
            gameState.lastIncorrectNote === note) &&
            !isSharp &&
            'z-20',
          (gameState.lastCorrectNote === note ||
            gameState.lastIncorrectNote === note) &&
            isSharp &&
            'z-40',
          !isSharp && 'h-96 w-20 bg-white',
          isSharp && 'z-30 -mx-7 h-52 w-14 bg-black',
        ])}
      >
        <motion.div
          animate={noteHighlightControls[+index]}
          className={cn([
            'absolute inset-0 opacity-0',
            gameState.lastCorrectNote === note && 'bg-green-200',
            gameState.lastIncorrectNote === note && 'bg-red-200',
          ])}
        />
        <motion.div
          animate={noteLabelControls[+index]}
          className={cn([
            'absolute bottom-2 left-1/2 flex items-center justify-center rounded-full p-2 opacity-0 shadow-sm drop-shadow-xl perspective-250 -translate-x-1/2 transform',
            'bg-green-400 text-center font-bold text-green-950',
            !isSharp && 'h-16 w-16 text-xl',
            isSharp && 'h-20 w-20 text-2xl',
          ])}
        >
          {note}
        </motion.div>
      </motion.div>
    );
  }

  return <>{pianoOutput}</>;
}
