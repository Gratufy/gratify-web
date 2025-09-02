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
    <div className="placeholder-xs xl:placeholder-sm w-full p-3 xl:p-4">
      <Label htmlFor="online-status" className="sr-only">
        Online Status
      </Label>
      <RadioGroup
        id="online-status"
        value={value}
        onValueChange={onChange}
        className="flex flex-col gap-2 xl:gap-3"
      >
        <div className="flex items-center gap-1 xl:gap-2">
          <RadioGroupItem
            value="online"
            id="online"
            className="h-3 w-3 xl:h-4 xl:w-4"
          />
          <Label htmlFor="online" className="placeholder-xs xl:placeholder-sm">
            Тільки он-лайн
          </Label>
        </div>
        <div className="flex items-center gap-1 xl:gap-2">
          <RadioGroupItem
            value="offline"
            id="offline"
            className="h-3 w-3 xl:h-4 xl:w-4"
          />
          <Label htmlFor="offline" className="placeholder-xs xl:placeholder-sm">
            Тільки з фізичною адресою
          </Label>
        </div>
        <div className="flex items-center gap-1 xl:gap-2">
          <RadioGroupItem
            value="all"
            id="all"
            className="h-3 w-3 xl:h-4 xl:w-4"
          />
          <Label htmlFor="all" className="placeholder-xs xl:placeholder-sm">
            Всі
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}

export default OnlineStatusFilter;
