'use client';

import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';
import { Midi, note } from 'tonal';
import { cn } from '@/lib/utils';
import { useAtom, useAtomValue } from 'jotai';
import { gameStateAtom, midiInputAtom } from '@/lib/atoms';
import { Octave } from '@/app/practice/components/PracticeGame/Octave';
import { useGenerateNotes } from '@/app/practice/hooks/useGenerateNotes';

// For testing
const easyMode = true;

export function PracticeGame() {
  const canAcceptNote = useRef(true);
  const midiInput = useAtomValue(midiInputAtom);
  const { octaveCount, notes, octaves } = useGenerateNotes();

  const generateNewNoteTarget = useCallback(() => {
    if (notes) {
      const randomNoteIndex = Math.floor(Math.random() * notes.length);

      if (easyMode) {
        return notes[0];
      } else {
        return notes[randomNoteIndex];
      }
    }

    return null;
  }, [notes]);

  const [gameState, setGameState] = useAtom(gameStateAtom);

  useEffect(() => {
    if (typeof midiInput === 'object' && midiInput && notes) {
      setGameState((gameState) => {
        if (!gameState.awaitingNote) {
          gameState.awaitingNote = generateNewNoteTarget();
        }

        return {
          ...gameState,
        };
      });

      midiInput.addListener('noteon', (e) => {
        if (!canAcceptNote.current) {
          return;
        }

        setGameState((gameState) => {
          canAcceptNote.current = false;
          const newGameState = { ...gameState };
          const wasAwaitingNote = gameState.awaitingNote;
          const previousBestStreak = gameState.bestStreak;

          const playedNoteName = Midi.midiToNoteName(e.note.number);
          const playedNote = note(playedNoteName);
          const playedCorrectNote = wasAwaitingNote === playedNote.name;

          newGameState.playedNotes++;

          console.log(`🎹 (${gameState.playedNotes}) ${playedNoteName}`);

          if (playedCorrectNote) {
            console.log(`✅ ${playedNoteName} is ${wasAwaitingNote}`);
            newGameState.streak++;
            newGameState.lastCorrectNote = playedNoteName;
            newGameState.lastIncorrectNote = null;

            if (newGameState.streak > previousBestStreak) {
              newGameState.bestStreak = newGameState.streak;
            }
          } else {
            console.log(`❌️ ${playedNoteName} is not ${wasAwaitingNote}`);
            newGameState.streak = 0;
            newGameState.lastCorrectNote = null;
            newGameState.lastIncorrectNote = playedNoteName;
          }

          newGameState.awaitingNote = generateNewNoteTarget();

          return newGameState;
        });

        setTimeout(() => {
          canAcceptNote.current = true;
        }, 400);
      });
    }

    return () => {
      if (typeof midiInput === 'object') {
        midiInput?.removeListener('noteon');
      }
    };
  }, [midiInput, notes, setGameState, generateNewNoteTarget]);

  return (
    <div>
      <div className="mb-8 flex justify-center gap-8 text-center">
        <div>
          <div className="mb-2 uppercase">Next</div>
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl text-black">
            <AnimatePresence>
              <motion.span
                key={`${gameState.playedNotes}${gameState.awaitingNote}`}
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.1 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
              >
                {gameState.awaitingNote}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <div>
          <div className="mb-2 uppercase">Streak</div>
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl text-black">
            <AnimatePresence initial={false}>
              <motion.span
                key={`${gameState.playedNotes}${gameState.streak}`}
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.1 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
              >
                {gameState.streak}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <div>
          <div className="mb-2 uppercase">Best</div>
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl text-black">
            <AnimatePresence initial={false}>
              <motion.span
                key={`${gameState.bestStreak}`}
                initial={{ opacity: 0, scale: 3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.1 }}
                transition={{ type: 'spring', damping: 6, mass: 0.4 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
              >
                {gameState.bestStreak}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="relative mx-auto h-[400px] w-[860px] perspective-500">
        <div
          className={cn([
            'absolute left-0 flex w-fit origin-top perspective-500 rotate-x-12 perspective-origin-top-left',
            octaveCount === 1 && 'translate-x-[150px] -translate-z-[80px]',
            octaveCount === 2 && '-translate-x-[130px] -translate-z-[230px]',
            octaveCount === 3 && '-translate-x-[410px] -translate-z-[470px]',
          ])}
        >
          <MotionConfig transition={{ duration: 0.1 }}>
            {octaves.map((octaveNotes, octaveIndex) => (
              <Octave key={octaveIndex} notes={octaveNotes} />
            ))}
          </MotionConfig>
        </div>
      </div>
    </div>
  );
}
