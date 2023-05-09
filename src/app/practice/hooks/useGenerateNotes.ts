import { useMemo } from 'react';
import { note, Scale } from 'tonal';
import { fromFreqSharps } from '@tonaljs/note';
import { octaveCountAtom, startNoteAtom } from '@/lib/atoms';
import { useAtomValue } from 'jotai';
import { OctaveCount } from '@/lib/consts';

export function useGenerateNotes() {
  const octaveCount = useAtomValue(octaveCountAtom);
  const startNote = useAtomValue(startNoteAtom);

  return useMemo(() => {
    const chromaticData: {
      octaveCount: OctaveCount | null;
      notes: string[];
      octaves: Array<string[]>;
    } = {
      octaveCount,
      notes: [],
      octaves: [],
    };

    if (!octaveCount || !startNote) {
      return chromaticData;
    }

    let baseNote = startNote;

    if (!startNote.oct || !baseNote.oct) {
      return chromaticData;
    }

    for (let o = startNote.oct; o < startNote.oct + octaveCount; o++) {
      const octaveNotes = Scale.get([baseNote.name, 'chromatic']).notes.map(
        (scaleNote) => {
          if (scaleNote.includes('b')) {
            const parsedNote = note(scaleNote);

            if (parsedNote && parsedNote.freq) {
              return fromFreqSharps(parsedNote.freq);
            } else {
              return scaleNote;
            }
          } else {
            return scaleNote;
          }
        }
      );
      chromaticData.notes = [...chromaticData.notes, ...octaveNotes];
      chromaticData.octaves.push(octaveNotes);

      baseNote = note(baseNote.pc + (o + 1));
    }

    return chromaticData;
  }, [octaveCount, startNote]);
}
