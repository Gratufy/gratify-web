import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OnlineFilter } from '@/types/enums';

function OnlineStatusFilter({
  value,
  onChange,
  classNameDiv,
}: {
  value: OnlineFilter;
  onChange: (val: OnlineFilter) => void;
  classNameDiv?: string;
}) {
  return (
    // p-3 xl:p-4 placeholder-xs xl:placeholder-sm
    <div className={`w-full ${classNameDiv}`}>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex flex-col gap-2 xl:gap-3"
        aria-labelledby="online-status"
      >
        <span id="online-status" className="sr-only">
          Сортувати за статусом бізнесу: всі, тільки он-лайн, тільки з фізичною
          адресою
        </span>
        <div className="flex items-center gap-1 xl:gap-2">
          <RadioGroupItem
            value="all"
            id="all"
            className="h-3 w-3 xl:h-4 xl:w-4"
          />
          <Label htmlFor="all">Всі</Label>
        </div>
        <div className="flex items-center gap-1 xl:gap-2">
          <RadioGroupItem
            value="online"
            id="online"
            className="h-3 w-3 xl:h-4 xl:w-4"
          />
          <Label htmlFor="online">Тільки он-лайн</Label>
        </div>
        <div className="flex items-center gap-1 xl:gap-2">
          <RadioGroupItem
            value="offline"
            id="offline"
            className="h-3 w-3 xl:h-4 xl:w-4"
          />
          {/* className="placeholder-xs xl:placeholder-sm" */}
          <Label htmlFor="offline">Тільки з фізичною адресою</Label>
        </div>
      </RadioGroup>
    </div>
  );
}

export default OnlineStatusFilter;
