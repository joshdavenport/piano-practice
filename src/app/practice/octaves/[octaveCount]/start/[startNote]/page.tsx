import { notFound } from 'next/navigation';
import { note } from 'tonal';
import { OctaveCount, octaveCounts } from '@/lib/consts';
import { Practice } from '@/app/practice/components/Practice';

type PageParams = {
  params: {
    octaveCount: string;
    startNote: string;
  };
};

export default function Page({
  params: { octaveCount, startNote },
}: PageParams) {
  if (octaveCount.match(/\d/) && startNote.match(/^c\d/)) {
    const parsedStartNote = note(startNote);
    const parsedOctaveCount = octaveCounts.find(
      (count) => count === +octaveCount
    )
      ? (+octaveCount as OctaveCount)
      : null;

    if (parsedStartNote && parsedOctaveCount) {
      return (
        <Practice octaveCount={parsedOctaveCount} startNote={parsedStartNote} />
      );
    } else {
      notFound();
    }
  } else {
    notFound();
  }
}
