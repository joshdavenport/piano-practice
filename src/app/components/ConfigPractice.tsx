'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { octaveCounts, practiceTypes } from '@/lib/consts';
import { Button } from '@/components/ui/button';
import { FormEventHandler, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIsomorphicLayoutEffect } from 'react-use';
import { Input, WebMidi } from 'webmidi';
import { cn } from '@/lib/utils';
import { SelectProps } from '@radix-ui/react-select';

export function ConfigPractice() {
  const router = useRouter();
  const [midiInputs, setMidiInputs] = useState<Input[]>();
  const [practicingAny, setPracticingAny] = useState(true);

  /**
   * Events
   */

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const octaveCount = formData.get('octaveCount');
    const practiceType = formData.get('practiceType');
    const startNote = octaveCount === '0' ? 'none' : formData.get('startNote');
    const midiInputId = formData.get('midiInputId');

    router.push(
      `/practice/octaves/${octaveCount}/start/${startNote}/type/${practiceType}/?device=${midiInputId}`
    );
  };

  const handleOctaveCountValueChange: SelectProps['onValueChange'] = (
    value
  ) => {
    if (value === '0') {
      setPracticingAny(true);
    } else {
      setPracticingAny(false);
    }
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
      className="flex flex-col items-center justify-center gap-4"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center gap-4">
        <div>Practice</div>
        <Select
          name="octaveCount"
          defaultValue={octaveCounts[0].toString()}
          onValueChange={handleOctaveCountValueChange}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="?" />
          </SelectTrigger>
          <SelectContent>
            {octaveCounts.map((count) => (
              <SelectItem key={count} value={count.toString()}>
                {count === 0 ? 'Any' : count}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div>octaves</div>
        <div
          className={cn('flex items-center gap-4', practicingAny && 'hidden')}
        >
          <div> starting at</div>
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
        </div>
        <div>in</div>
        <Select name="practiceType" defaultValue="all_keys">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select a practice mode" />
          </SelectTrigger>
          <SelectContent>
            {practiceTypes?.map((type) => (
              <SelectItem value={type} key={type}>
                {type === 'all_keys' && 'All Keys'}
                {type === 'only_natural' && 'Only Natural'}
                {type === 'only_sharps' && 'Only Sharps'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div>practice mode</div>
      </div>
      <div className="flex items-center gap-4">
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
      </div>
      <div>
        <Button>Start</Button>
      </div>
    </form>
  );
}
