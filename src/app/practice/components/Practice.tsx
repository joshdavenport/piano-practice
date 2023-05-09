'use client';

import { useHydrateAtoms } from 'jotai/utils';
import {
  midiInputAtom,
  octaveCountAtom,
  StartNote,
  startNoteAtom,
} from '@/lib/atoms';
import { OctaveCount } from '@/lib/consts';
import { PracticeGame } from '@/app/practice/components/PracticeGame';
import { WebMidi } from 'webmidi';
import { useAtom } from 'jotai';
import { useIsomorphicLayoutEffect } from 'react-use';
import { useState } from 'react';

type PracticeProps = {
  octaveCount: OctaveCount;
  startNote: StartNote;
};

export function Practice({ octaveCount, startNote }: PracticeProps) {
  /**
   * Atoms
   */

  useHydrateAtoms([
    [octaveCountAtom, octaveCount],
    [startNoteAtom, startNote],
  ]);

  const [midiInput, setMidiInput] = useAtom(midiInputAtom);

  /**
   * State
   */

  const [error, setError] = useState('');

  /**
   * Effects
   */

  useIsomorphicLayoutEffect(() => {
    const midiInputId = new URLSearchParams(window.location.search).get(
      'device'
    );

    if (midiInputId && WebMidi) {
      const startMidi = async () => {
        try {
          await WebMidi.enable();
          const input = WebMidi.getInputById(midiInputId);

          if (input) {
            setMidiInput(input);
          } else {
            setMidiInput(false);
          }
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message || 'Unknown error');
          }

          setMidiInput(false);
        }
      };

      startMidi();
    } else {
      setMidiInput(false);
    }
  }, []);

  /**
   * Render
   */

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-center border-b pb-4">
        <div>
          Practicing {octaveCount} octaves starting at {startNote.name}
        </div>
      </div>
      {midiInput && <PracticeGame />}

      <div className="flex flex-col items-center gap-4">
        {midiInput === null && <div>Loading MIDI device...</div>}
        {midiInput === false && <div>No MIDI device available.</div>}
        {!!error && <div>Error: {error}</div>}
      </div>
    </div>
  );
}
