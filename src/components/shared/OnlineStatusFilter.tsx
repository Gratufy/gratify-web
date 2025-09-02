import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OnlineFilter } from '@/types';

function OnlineStatusFilter({
  value,
  onChange,
}: {
  value: OnlineFilter;
  onChange: (val: OnlineFilter) => void;
}) {
  return (
    <div className="placeholder-xs px-3 py-3">
      <Label htmlFor="online-status" className="sr-only">
        Online Status
      </Label>
      <RadioGroup
        id="online-status"
        value={value}
        onValueChange={onChange}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="online" id="online" />
          <Label htmlFor="online" className="placeholder-xs">
            Тільки он-лайн
          </Label>
        </div>
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="offline" id="offline" />
          <Label htmlFor="offline" className="placeholder-xs">
            Тільки з фізичною адресою
          </Label>
        </div>
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="all" id="all" />
          <Label htmlFor="all" className="placeholder-xs">
            Всі
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}

export default OnlineStatusFilter;
