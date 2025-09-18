import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SortBy } from '@/types';

function SortFilterComponent({
  value,
  onChange,
}: {
  value: SortBy;
  onChange: (val: SortBy) => void;
}) {
  return (
    <div className="placeholder-xs xl:placeholder-sm w-full p-3 xl:p-4">
      <Label htmlFor="online-status" className="sr-only">
        SORT BY
      </Label>
      <RadioGroup
        id="sortby-status"
        value={value}
        onValueChange={onChange}
        className="flex flex-col gap-2 xl:gap-3"
      >
        <div className="flex items-center gap-1 xl:gap-2">
          <RadioGroupItem
            value="newest"
            id="newest"
            className="h-3 w-3 xl:h-4 xl:w-4"
          />
          <Label htmlFor="newest" className="placeholder-xs xl:placeholder-sm">
            Нові
          </Label>
        </div>
        <div className="flex items-center gap-1 xl:gap-2">
          <RadioGroupItem
            value="mostKarma"
            id="mostKarma"
            className="h-3 w-3 xl:h-4 xl:w-4"
          />
          <Label
            htmlFor="mostKarma"
            className="placeholder-xs xl:placeholder-sm"
          >
            Популярні
          </Label>
        </div>
        <div className="flex items-center gap-1 xl:gap-2">
          <RadioGroupItem
            value="hot"
            id="hot"
            className="h-3 w-3 xl:h-4 xl:w-4"
          />
          <Label htmlFor="hot" className="placeholder-xs xl:placeholder-sm">
            Стрімкий ріст
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}

export default SortFilterComponent;
