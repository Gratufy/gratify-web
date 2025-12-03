'use client';
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SpecialOffer } from '@/types';

type CustomCheckBoxProps = {
  offers: SpecialOffer[]; // all offers
  selectedOfferIds: string[]; // currently selected
  onChange: (offerId: string, checked: boolean) => void; // change handler
  error?: string;
  className?: string;
};
function CustomCheckBox({
  offers,
  selectedOfferIds,
  onChange,
  error,
  className,
}: CustomCheckBoxProps) {
  if (!offers || offers.length === 0) return <p>No special offers found</p>;
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {offers.map((offer) => (
        <div key={offer.id} className="flex items-center gap-4">
          <Checkbox
            id={offer.id}
            checked={selectedOfferIds.includes(offer.id)}
            onCheckedChange={(checked) => onChange(offer.id, checked === true)}
          />
          <Label htmlFor={offer.id}>{offer.title}</Label>
        </div>
      ))}
      {/* {error && <p className="text-red-500 text-sm mt-1">{error}</p>} */}
    </div>
  );
}

export default CustomCheckBox;
