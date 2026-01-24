'use client';
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { BusinessFormValues } from '@/types';

import { ChevronDownIcon } from 'lucide-react';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  //DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SpecialOffer } from '@/types/db';

type CustomCheckBoxProps = {
  offers: SpecialOffer[]; // all offers
  selectedOfferIds: string[]; // currently selected
  onChange: (offerId: string, checked: boolean) => void; // change handler

  className?: string;
  form: UseFormReturn<BusinessFormValues>;
};

function OffersMultiSelect({
  offers,
  selectedOfferIds,
  onChange,

  className,
  form,
}: CustomCheckBoxProps) {
  ///////////////////////////////////////////////
  const ownOffers = form.watch('ownOffers') || [];
  const specialOffers = form.watch('specialOffers') || [];

  ///////////////////////////////////////////

  const [ownOfferLocal, setOwnOfferLocal] = useState<string>('');

  if (!offers || offers.length === 0) return <p>No special offers found</p>;

  const addOwnOffer = () => {
    if (!ownOfferLocal.trim()) return;
    form.setValue('ownOffers', [
      ownOfferLocal.trim(),
      ...(form.watch('ownOffers') ?? []),
    ]);
    setOwnOfferLocal('');
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
      {(specialOffers.length > 0 || ownOffers.length > 0) && (
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
                    aria-label={`видалити власну пропозицію ${ownOffer}`}
                    type="button"
                    onClick={() => removeOwnOffer(ownOffer)}
                    className="btn-custom border-none p-1"
                  >
                    <CrossIcon className="size-4" aria-hidden="true" />
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
                  aria-label={`видалити пропозицію ${offer.title}`}
                  onClick={() => {
                    form.setValue(
                      'specialOffers',
                      specialOffers.filter((i) => i !== offer.id)
                    );
                  }}
                  className="btn-custom border-none p-1"
                >
                  <CrossIcon className="size-4" aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Own offer input */}
      <div className="mb-5 flex flex-col gap-3">
        <Label htmlFor="own-offer" className="sr-only">
          Додайте власну пропозицію
        </Label>
        <Input
          id="own-offer"
          className="input-custom px-4"
          placeholder="Напишить власну пропозицію"
          minLength={5}
          maxLength={100}
          value={ownOfferLocal}
          onChange={(e) => setOwnOfferLocal(e.currentTarget.value)}
        />
        <div className="flex justify-between">
          <button
            type="button"
            disabled={!ownOfferLocal.trim()}
            className="btn-reject px-3"
            onClick={() => setOwnOfferLocal('')}
          >
            Очистити
          </button>
          <button
            type="button"
            disabled={!ownOfferLocal.trim()}
            className="btn-aprove px-3"
            onClick={addOwnOffer}
          >
            Зберегти
          </button>
        </div>
      </div>
      {/* Special offer input */}
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:border-elements-grey-400 focus-visible:ring-icons-grey-300/50 border-elements-grey-400 standart dark:hover:bg-background-main-300/50 w-full cursor-pointer justify-between px-4 focus-visible:ring-[2px]">
          <span>Оберіть пропозиції</span>
          <ChevronDownIcon className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-background-white max-h-60 w-[var(--radix-dropdown-menu-trigger-width)] space-y-4 overflow-y-auto rounded-none py-2"
          align="start"
          side="bottom"
        >
          {/* <DropdownMenuLabel>Select Categories</DropdownMenuLabel> */}
          {offers.map((offer) => (
            // DropdownMenuItem if close after each click is needed
            <div
              key={offer.id}
              className="dark:hover:bg-elements-main-500/30 hover:bg-elements-grey-400/30 focus:bg-elements-grey-400/30 dark:focus:bg-elements-main-500/30 flex items-center justify-between px-4 py-1.5 transition-colors"
            >
              <Label
                htmlFor={offer.id}
                className="xl:placeholder-base placeholder-sm flex-1 cursor-pointer"
              >
                {offer.title.toLowerCase()}
              </Label>
              <Checkbox
                className="border-text-700-grey cursor-pointer"
                id={offer.id}
                checked={selectedOfferIds.includes(offer.id)}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  onChange(offer.id, isChecked);

                  const newValue = isChecked
                    ? [...specialOffers, offer.id]
                    : specialOffers.filter((id) => id !== offer.id);
                  form.setValue('specialOffers', newValue);
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
