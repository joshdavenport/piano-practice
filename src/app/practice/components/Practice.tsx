'use client';

import { Note, Scale } from 'tonal';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/util/tailwind';
import { motion, MotionConfig } from 'framer-motion';
import { useTwelveTetAnimationControls } from '@/app/practice/hooks/useTwelveTetAnimationControls';
import { useMIDI } from '@react-midi/hooks';

const chromaticNotes = Scale.get(['c', 'chromatic']).notes;

export function Practice() {
  const { inputs, outputs } = useMIDI();

  console.log(inputs);

  const gameLoopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const awaitingNoteRef = useRef<ReturnType<(typeof Note)['get']> | null>(null);

  const [nextNote, setNextNote] = useState<string>();
  const [gameOver, setGameOver] = useState(false);

  const noteControls = useTwelveTetAnimationControls();
  const noteLabelControls = useTwelveTetAnimationControls();

  useEffect(() => {
    const gameTimer = 100;

    const handleGameLoop = async () => {
      if (!awaitingNoteRef.current) {
        const randomNoteIndex = Math.floor(
          Math.random() * chromaticNotes.length
        );
        const randomNote = chromaticNotes[randomNoteIndex];

        awaitingNoteRef.current = Note.get(randomNote);
        setNextNote(randomNote);

        await Promise.all([
          noteControls[randomNoteIndex].start({
            scaleY: 1.1,
          }),
          noteLabelControls[randomNoteIndex].start({
            scaleY: 1.5,
            scaleX: 1.75,
            translateY: -15,
            opacity: 1,
          }),
        ]);

        await new Promise((resolve) => setTimeout(resolve, 400));

        await Promise.all([
          noteControls[randomNoteIndex].start({
            scaleY: 1,
          }),
          noteLabelControls[randomNoteIndex].start({
            scaleY: 1,
            scaleX: 1,
            translateY: 0,
            opacity: 0,
          }),
        ]);
      }

      // console.log(awaitingNoteRef.current);

      gameLoopTimerRef.current = setTimeout(handleGameLoop, gameTimer);
    };

    handleGameLoop();

    return () => {
      if (gameLoopTimerRef.current) {
        clearTimeout(gameLoopTimerRef.current);
      }
    };
  }, []);

  /**
   * Render
   */
  const pianoOutput: ReactNode[] = [];

  for (const [index, note] of Object.entries(chromaticNotes)) {
    const isFlat = note.includes('b');

    pianoOutput.push(
      <motion.div
        key={note}
        animate={noteControls[+index]}
        className={cn([
          'flex origin-top items-end justify-center border border-black pb-2 perspective-500',
          !isFlat && 'h-96 w-20 bg-white text-white',
          isFlat && 'z-20 -mx-7 h-52 w-14 bg-black text-black',
        ])}
      >
        <motion.div
          animate={noteLabelControls[+index]}
          className={cn([
            'h-10 w-10 rounded-full p-2 text-center font-bold opacity-0',
            !isFlat && 'bg-gray-500',
            isFlat && 'bg-gray-400',
          ])}
        >
          {note}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto flex w-fit flex-col gap-8">
      <div className="flex gap-2">
        <div className="font-bold">Next Note: </div>
        {!!nextNote && nextNote}
        {!nextNote && 'N/A'}
      </div>
      <div className="perspective-500">
        <div className="mx-auto flex w-fit origin-top perspective-500 -translate-z-20 rotate-x-12 perspective-origin-top ">
          <MotionConfig transition={{ duration: 0.4 }}>
            {pianoOutput}
          </MotionConfig>
        </div>
      </div>
    </div>
  );
}
