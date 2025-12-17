'use client';
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { BusinessFormValues, SpecialOffer } from '@/types';

import { ChevronDownIcon } from 'lucide-react';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';

// import CheckIcon from '@/assets/icons/general/icon-check.svg';
// type Checked = DropdownMenuCheckboxItemProps['checked'];

type CustomCheckBoxProps = {
  offers: SpecialOffer[]; // all offers
  selectedOfferIds: string[]; // currently selected
  onChange: (offerId: string, checked: boolean) => void; // change handler
  error?: string;
  className?: string;
  form: UseFormReturn<BusinessFormValues>;
  // ownOfferLocalArr: string[];
  // setOwnOfferLocalArr: React.Dispatch<React.SetStateAction<string[]>>;
};

function OffersMultiSelect({
  offers,
  selectedOfferIds,
  onChange,
  error,
  className,
  form,
  // ownOfferLocalArr,
  // setOwnOfferLocalArr,
}: CustomCheckBoxProps) {
  // const [localSelectedOffers, setLocalSelectedOffers] = useState<
  //   SpecialOffer[]
  // >([]);
  ///////////////////////////////////////////////
  const ownOffers = form.watch('ownOffers') || [];
  const specialOffers = form.watch('specialOffers') || [];

  ///////////////////////////////////////////
  const [showOwnPanel, setShowOwnPanel] = useState<boolean>(false);
  const [ownOfferLocal, setOwnOfferLocal] = useState<string>('');
  //const [ownOfferLocalArr, setOwnOfferLocalArr] = useState<string[]>([]);
  if (!offers || offers.length === 0) return <p>No special offers found</p>;

  const addOwnOffer = () => {
    if (!ownOfferLocal.trim()) return;
    form.setValue('ownOffers', [
      ownOfferLocal.trim(),
      ...(form.watch('ownOffers') ?? []),
    ]);
    setOwnOfferLocal('');
    setShowOwnPanel(false);
  };

  const removeOwnOffer = (title: string) => {
    form.setValue(
      'ownOffers',
      ownOffers.filter((o) => o !== title)
    );
  };
  return (
    <div className={`w-[70%] shrink-0 ${className || ''}`}>
      {/* choosed offers */}

      {!showOwnPanel && (specialOffers.length > 0 || ownOffers.length > 0) && (
        <div className="mb-2 flex flex-col gap-2">
          {/* choosed own offers */}
          {ownOffers.length > 0 && (
            <>
              {ownOffers.map((ownOffer, ind) => (
                <div
                  key={ind + ownOffer}
                  className="bg-background-grey-50 border-elements-grey-400 flex items-center justify-between border-[0.5px] px-4 py-1"
                >
                  <p className="placeholder-sm">{ownOffer}</p>
                  <button
                    type="button"
                    onClick={() => removeOwnOffer(ownOffer)}
                    className="cursor-pointer border-none outline-none"
                  >
                    <CrossIcon className="size-4" />
                  </button>
                </div>
              ))}
            </>
          )}
          {/* choosed common offers */}
          {specialOffers.map((id) => {
            const offer = offers.find((o) => o.id === id);
            if (!offer) return null;
            return (
              <div
                key={offer.id}
                className="bg-background-grey-50 standart justify-between px-4"
              >
                <p className="placeholder-sm">{offer.title}</p>
                <button
                  type="button"
                  onClick={() => {
                    // setLocalSelectedOffers((prev) =>
                    //   prev.filter((o) => o.id !== offer.id)
                    // );
                    // onChange(offer.id, false);
                    form.setValue(
                      'specialOffers',
                      specialOffers.filter((i) => i !== offer.id)
                    );
                  }}
                  className="cursor-pointer border-none outline-none"
                >
                  <CrossIcon className="size-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {/* Own offer pannel */}
      {showOwnPanel && (
        <div className="mb-5 flex flex-col gap-3">
          <div className="bg-background-grey-50 standart justify-between px-4">
            <p className="placeholder-sm">свій вариант</p>
            <button
              type="button"
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
            minLength={5}
            maxLength={60}
            value={ownOfferLocal}
            onChange={(e) => setOwnOfferLocal(e.currentTarget.value)}
          />
          <div className="flex justify-between">
            <button
              type="button"
              className="btn-reject px-3"
              onClick={() => setOwnOfferLocal('')}
            >
              Скасувати
            </button>
            <button
              type="button"
              className="btn-aprove px-3"
              onClick={addOwnOffer}
            >
              Зберегти
            </button>
          </div>
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger className="standart w-full cursor-pointer justify-between px-4">
          <span>Спеціальні пропозиції</span>
          <ChevronDownIcon className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="max-h-60 w-[var(--radix-dropdown-menu-trigger-width)] space-y-4 overflow-y-auto rounded-none px-4 py-2"
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
                  // setLocalSelectedOffers((prev) =>
                  //   isChecked
                  //     ? [...prev, offer]
                  //     : prev.filter((id) => id !== offer)
                  // );
                  const newValue = isChecked
                    ? [...specialOffers, offer.id]
                    : specialOffers.filter((id) => id !== offer.id);
                  form.setValue('specialOffers', newValue);
                }}
              />
            </div>
          ))}
          <button
            type="button"
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
