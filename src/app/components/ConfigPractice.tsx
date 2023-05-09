'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { octaveCounts } from '@/lib/consts';
import { Button } from '@/components/ui/button';
import { FormEventHandler, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIsomorphicLayoutEffect } from 'react-use';
import { Input, WebMidi } from 'webmidi';

export function ConfigPractice() {
  const router = useRouter();
  const [midiInputs, setMidiInputs] = useState<Input[]>();

  /**
   * Events
   */

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const octaveCount = formData.get('octaveCount');
    const startNote = formData.get('startNote');
    const midiInputId = formData.get('midiInputId');

    router.push(
      `/practice/octaves/${octaveCount}/start/${startNote}?device=${midiInputId}`
    );
  };

  /**
   * Effects
   */
  useIsomorphicLayoutEffect(() => {
    const connectMidi = async () => {
      try {
        await WebMidi.enable();
        setMidiInputs(WebMidi.inputs);
      } catch (error) {
        console.error(error);
      }
    };

    connectMidi();
  }, []);

  /**
   * Render
   */

  return (
    <form
      className="flex items-center justify-center gap-4"
      onSubmit={handleSubmit}
    >
      <div>Practice</div>
      <Select name="octaveCount" defaultValue={octaveCounts[0].toString()}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="?" />
        </SelectTrigger>
        <SelectContent>
          {octaveCounts.map((count) => (
            <SelectItem key={count} value={count.toString()}>
              {count}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div>octaves starting at</div>
      <Select name="startNote" defaultValue={'c4'}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="?" />
        </SelectTrigger>
        <SelectContent>
          {['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'].map((start) => (
            <SelectItem key={start} value={start.toLowerCase()}>
              {start}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div>using</div>
      <Select name="midiInputId">
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select MIDI Device" />
        </SelectTrigger>
        <SelectContent>
          {midiInputs?.map(({ id, name }) => (
            <SelectItem value={id} key={id}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button>Start</Button>
    </form>
  );
}
