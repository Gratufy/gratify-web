'use client';
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,

  // DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import CheckIcon from '@/assets/icons/general/icon-check.svg';
type Checked = DropdownMenuCheckboxItemProps['checked'];
import { SpecialOffer } from '@/types';
import { Input } from '../ui/input';

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
  const [showOwnPanel, setShowOwnPanel] = useState<boolean>(false);
  const [ownOfferLocal, setOwnOfferLocal] = useState<string>([]);
  const [ownOfferLocalArr, setOwnOfferLocalArr] = useState<string[]>([]);
  if (!offers || offers.length === 0) return <p>No special offers found</p>;
  return (
    <div className={`w-[70%] shrink-0`}>
      {/* choosed offers */}

      {!showOwnPanel && (
        <div className="mb-2 flex flex-col gap-2">
          {/* choosed common offers */}
          {localSelectedOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-background-grey-50 standart justify-between px-4"
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
          {/* choosed own offers */}
          {ownOfferLocalArr.length > 0 && (
            <>
              {ownOfferLocalArr.map((ownOffer, ind) => (
                <div
                  key={ind}
                  className="bg-background-grey-50 border-elements-grey-400 flex items-center justify-between border-[0.5px] px-4 py-1"
                >
                  <p className="placeholder-sm">{ownOffer}</p>
                  <button
                    onClick={() => {
                      setOwnOfferLocalArr((prev) =>
                        prev.filter((o) => o !== ownOffer)
                      );
                      //onChange(offer.id, false);
                    }}
                    className="cursor-pointer border-none outline-none"
                  >
                    <CrossIcon className="size-4" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
      {/* Own offer pannel */}
      {showOwnPanel && (
        <div className="mb-5 flex flex-col gap-3">
          <div className="bg-background-grey-50 standart justify-between px-4">
            <p className="placeholder-sm">свій вариант</p>
            <button
              onClick={() => {
                //setOwnOfferLocalArr((prev)=>[...prev,ownOfferLocal]);
                // onChange(offer.id, false);
                setShowOwnPanel(false);
              }}
              className="cursor-pointer border-none outline-none"
            >
              <CrossIcon className="size-4" />
            </button>
          </div>
          <Label htmlFor="own-offer" className="sr-only">
            власну пропозиція
          </Label>
          <Input
            id="own-offer"
            className="input-custom px-4"
            placeholder="Напишить власну пропозицію"
          />
          <div className="flex justify-between">
            <button type="button" className="btn-reject px-3">
              Скасувати
            </button>
            <button type="button" className="btn-aprove px-3">
              Зберегти
            </button>
          </div>
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger className="placeholder-sm standart w-full cursor-pointer justify-between px-4">
          <span>Спеціальні пропозиції</span>
          <ChevronDownIcon className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="max-h-60 w-[var(--radix-dropdown-menu-trigger-width)] space-y-4 overflow-y-auto rounded-none p-2"
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
                className="xl:placeholder-base placeholder-sm flex-1 cursor-pointer"
              >
                {offer.title.toLowerCase()}
              </Label>
              <Checkbox
                className="data-[state=checked]:text-text-950-grey data-[state=checked]:bg-background-white cursor-pointer border-none"
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
          <button
            onClick={() => {
              setShowOwnPanel(true);
            }}
            className="placeholder-sm flex w-full cursor-pointer justify-start"
          >
            <span>cвій вариант</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default OffersMultiSelect;
