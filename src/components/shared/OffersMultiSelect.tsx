'use client';
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
type Checked = DropdownMenuCheckboxItemProps['checked'];
import { SpecialOffer } from '@/types';

type CustomCheckBoxProps = {
  offers: SpecialOffer[]; // all offers
  selectedOfferIds: string[]; // currently selected
  onChange: (offerId: string, checked: boolean) => void; // change handler
  error?: string;
  className?: string;
};

function OffersMultiSelect({
  offers,
  selectedOfferIds,
  onChange,
  error,
  className,
}: CustomCheckBoxProps) {
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [showStatusBar, setShowStatusBar] = useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = useState<Checked>(false);
  const [showPanel, setShowPanel] = useState<Checked>(false);
  if (!offers || offers.length === 0) return <p>No special offers found</p>;
  return (
    <div className={`w-[70%] shrink-0`}>
      <DropdownMenu>
        <DropdownMenuTrigger className="border-elements-grey-400 bg-background-white xl:placeholder-base lg:placeholder-sm placeholder-xs flex w-full items-center justify-between border px-4 py-2">
          <span>Спеціальні пропозиції</span>
          <ChevronDownIcon className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="max-h-60 w-[var(--radix-dropdown-menu-trigger-width)] space-y-2 overflow-y-auto p-2"
          align="start"
          side="bottom"
        >
          {/* <DropdownMenuLabel>Select Categories</DropdownMenuLabel> */}
          {offers.map((offer) => (
            <div key={offer.id} className="flex items-center gap-4">
              <Checkbox
                id={offer.id}
                checked={selectedOfferIds.includes(offer.id)}
                onCheckedChange={(checked) =>
                  onChange(offer.id, checked === true)
                }
              />
              <Label
                htmlFor={offer.id}
                className="xl:placeholder-base lg:placeholder-sm placeholder-xs"
              >
                {offer.title}
              </Label>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default OffersMultiSelect;
