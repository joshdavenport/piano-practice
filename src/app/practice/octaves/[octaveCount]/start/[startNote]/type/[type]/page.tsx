import { notFound } from 'next/navigation';
import { note } from 'tonal';
import { OctaveCount, octaveCounts, practiceTypes } from '@/lib/consts';
import { Practice } from '@/app/practice/components/Practice';

export const metadata = {
  title: 'Piano Practice',
};

type PageParams = {
  params: {
    octaveCount: string;
    startNote: string;
    type: string;
  };
};

export default function Page({
  params: { octaveCount, startNote, type },
}: PageParams) {
  if (
    octaveCount.match(/\d/) &&
    (startNote === 'none' || startNote.match(/^c\d/))
  ) {
    const parsedOctaveCount =
      typeof octaveCounts.find((count) => count === +octaveCount) === 'number'
        ? (+octaveCount as OctaveCount)
        : null;

    const parsedStartNote =
      parsedOctaveCount === 0 ? note('c4') : note(startNote);

    const practiceType = practiceTypes.find((t) => t === type) || null;

    console.log({
      parsedStartNote,
      parsedOctaveCount,
      practiceType,
    });

    if (
      parsedStartNote &&
      typeof parsedOctaveCount === 'number' &&
      practiceType
    ) {
      return (
        <Practice
          octaveCount={parsedOctaveCount}
          startNote={parsedStartNote}
          practiceType={practiceType}
        />
      );
    } else {
      notFound();
    }
  } else {
    notFound();
  }
}
