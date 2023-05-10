import { useMemo } from 'react';
import { note, Scale } from 'tonal';
import { fromFreqSharps } from '@tonaljs/note';
import { octaveCountAtom, practiceTypeAtom, startNoteAtom } from '@/lib/atoms';
import { useAtomValue } from 'jotai';
import { OctaveCount } from '@/lib/consts';

export function useGenerateNotes() {
  const octaveCount = useAtomValue(octaveCountAtom);
  const startNote = useAtomValue(startNoteAtom);
  const practiceType = useAtomValue(practiceTypeAtom);

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

    if (typeof octaveCount !== 'number' || !startNote || !practiceType) {
      return chromaticData;
    }

    let baseNote = startNote;

    if (!startNote.oct || !baseNote.oct) {
      return chromaticData;
    }

    for (
      let o = startNote.oct;
      o < startNote.oct + (octaveCount === 0 ? 1 : octaveCount);
      o++
    ) {
      const baseNotes = Scale.get([baseNote.name, 'chromatic']);

      const octaveNotes = baseNotes.notes.map((scaleNote) => {
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
      });

      const allNotes = baseNotes.notes
        .filter((scaleNote) => {
          if (practiceType === 'all_keys') {
            return true;
          } else if (practiceType === 'only_natural') {
            return !scaleNote.includes('b');
          } else if (practiceType === 'only_sharps') {
            return scaleNote.includes('b');
          }
        })
        .map((scaleNote) => {
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
        });

      chromaticData.notes = [...chromaticData.notes, ...allNotes];
      chromaticData.octaves.push(octaveNotes);

      baseNote = note(baseNote.pc + (o + 1));
    }

    return chromaticData;
  }, [octaveCount, practiceType, startNote]);
}
