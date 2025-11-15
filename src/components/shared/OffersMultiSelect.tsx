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
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import CheckIcon from '@/assets/icons/general/icon-check.svg';
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
  const [localSelectedOffers, setLocalSelectedOffers] = useState<
    SpecialOffer[]
  >([]);
  const [showStatusBar, setShowStatusBar] = useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = useState<Checked>(false);
  const [showPanel, setShowPanel] = useState<Checked>(false);
  if (!offers || offers.length === 0) return <p>No special offers found</p>;
  return (
    <div className={`w-[70%] shrink-0`}>
      <div className="mb-2 flex flex-col gap-2">
        {localSelectedOffers.map((offer) => (
          <div
            key={offer.id}
            className="border-elements-grey-400 flex items-center justify-between border-[0.5px] px-4 py-1"
          >
            <p className="placeholder-sm">{offer.title}</p>
            <button
              onClick={() => {
                setLocalSelectedOffers((prev) =>
                  prev.filter((o) => o.id !== offer.id)
                );
                onChange(offer.id, false);
              }}
              className="cursor-pointer border-none outline-none"
            >
              <CrossIcon className="size-4" />
            </button>
          </div>
        ))}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="border-elements-grey-400 bg-background-white xl:placeholder-base placeholder-sm flex w-full items-center justify-between border px-4 py-2">
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
            <div
              key={offer.id}
              className="flex items-center justify-between gap-2"
            >
              <Label
                htmlFor={offer.id}
                className="xl:placeholder-base placeholder-sm flex-1"
              >
                {offer.title}
              </Label>
              <Checkbox
                className="data-[state=checked]:text-text-950-grey border-none data-[state=checked]:bg-white"
                id={offer.id}
                checked={selectedOfferIds.includes(offer.id)}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  onChange(offer.id, isChecked);
                  setLocalSelectedOffers((prev) =>
                    isChecked
                      ? [...prev, offer]
                      : prev.filter((id) => id !== offer)
                  );
                }}
              />
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default OffersMultiSelect;
