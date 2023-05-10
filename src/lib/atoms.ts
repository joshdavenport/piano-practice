import { note } from 'tonal';
import { Input } from 'webmidi';
import { atom } from 'jotai';
import { OctaveCount, PracticeType } from '@/lib/consts';

export const midiInputAtom = atom<Input | boolean | null>(null);

export const octaveCountAtom = atom<OctaveCount | null>(null);

export type StartNote = ReturnType<typeof note>;
export const startNoteAtom = atom<StartNote | null>(null);

export const practiceTypeAtom = atom<PracticeType | null>(null);

type GameState = {
  playedNotes: number;
  awaitingNote: string | null;
  lastCorrectNote: string | null;
  lastIncorrectNote: string | null;
  streak: number;
  bestStreak: number;
};

export const gameStateAtom = atom<GameState>({
  playedNotes: 0,
  awaitingNote: null,
  lastCorrectNote: null,
  lastIncorrectNote: null,
  streak: 0,
  bestStreak: 0,
});
