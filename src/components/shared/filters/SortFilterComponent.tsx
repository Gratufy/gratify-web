import React from 'react';

import { SortBy } from '@/types';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

function SortFilterComponent({
  value,
  onChange,
  classNameDiv,
}: {
  value: SortBy;
  onChange: (val: SortBy) => void;
  classNameDiv?: string;
}) {
  return (
    // p-3 xl:p-4 placeholder-xs xl:placeholder-sm
    <div className={`w-full ${classNameDiv}`}>
      <label htmlFor="sortby-status" className="sr-only">
        SORT BY
      </label>
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
          <Label htmlFor="newest">Нові</Label>
        </div>
        <div className="flex items-center gap-1 xl:gap-2">
          <RadioGroupItem
            value="mostKarma"
            id="mostKarma"
            className="h-3 w-3 xl:h-4 xl:w-4"
          />
          <Label htmlFor="mostKarma">Популярні</Label>
        </div>
        <div className="flex items-center gap-1 xl:gap-2">
          <RadioGroupItem
            value="hot"
            id="hot"
            className="h-3 w-3 xl:h-4 xl:w-4"
          />
          <Label htmlFor="hot">Стрімкий ріст</Label>
        </div>
      </RadioGroup>
    </div>
  );
}

export default SortFilterComponent;
