'use client';
// small card fo List of businesses
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { BusinessWithCategoryName } from '@/types';

import { useFavorites } from '@/providers/UserFavoritesProvider';
import { useAddFavorite, useRemoveFavorite } from '@/hooks/useFavorites';

import IconUser from '@/assets/icons/general/icon-user.svg';
import CheckIcon from '@/assets/icons/general/icon-check.svg';
import ReviewIcon from '@/assets/icons/general/icon-bubble.svg';
import IconFavoriteNo from '@/assets/icons/general/icon-favorite-no.svg';
import IconFavoriteYes from '@/assets/icons/general/icon-favorite-yes.svg';

import Karma from '@/components/shared/Karma';

interface BusinessCardShotProps {
  business: BusinessWithCategoryName;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  setAlertTitle: React.Dispatch<React.SetStateAction<string>>;
  setActionContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setOnConfirm: React.Dispatch<React.SetStateAction<() => void>>;
}

function BusinessCardShot({
  business,

  setOpen,
  isLoggedIn,
  setAlertTitle,
  setActionContent,
  setOnConfirm,
}: BusinessCardShotProps) {
  const router = useRouter();
  const favoritesSet = useFavorites();
  const isFavorite = favoritesSet.has(business.id);

  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to business detail page
    e.stopPropagation(); // Stop event from bubbling up
    if (!isLoggedIn) {
      setAlertTitle('Для додавання в обране, авторизуйтесь будь ласка');
      setActionContent(
        <>
          <IconUser className="mr-2 inline size-4 xl:size-5" />
          Вхід
        </>
      );
      setOnConfirm(() => () => router.push('/login'));
      setOpen(true);
      return;
    }

    if (isFavorite) {
      setAlertTitle('Видалити бізнес з обраного?');
      setActionContent('Видалити');
      setOpen(true);
      setOnConfirm(() => () => removeFavorite.mutate(business.id));
    } else {
      addFavorite.mutate(business.id);
    }
  };

  return (
    <>
      {/* header */}
      <div className="lg:h-22 relative mb-4 flex h-16 items-center">
        <div
          className="absolute right-2 top-0 z-10"
          onClick={(e) => e.stopPropagation()} // block click on Link
        >
          <button
            aria-label={
              isFavorite
                ? `Видалити з обраного ${business.name}`
                : `Додати в обране ${business.name}`
            }
            aria-pressed={isFavorite ? 'true' : 'false'}
            onClick={handleToggleFavorite}
            className="cursor-pointer border-none bg-transparent px-2 pb-1 outline-none lg:right-9"
          >
            {isFavorite ? (
              <IconFavoriteYes
                className="h-7 w-6 lg:h-10 lg:w-8"
                aria-hidden="true"
              />
            ) : (
              <IconFavoriteNo
                className="h-7 w-6 lg:h-10 lg:w-8"
                aria-hidden="true"
              />
            )}
          </button>
        </div>

        {/* block with image */}

        <div className="relative flex h-full flex-1 justify-end">
          <div className="xl:w-7/10 w-6/7 relative h-16 overflow-hidden lg:h-[88px]">
            {business.coverImageUrl ? (
              <>
                <Image
                  src={business.coverImageUrl}
                  alt={`Зображення бізнесу ${business.name}`}
                  fill
                  loading="lazy"
                  fetchPriority="low"
                  sizes="(min-width: 1024px) 586px, 515px"
                  className="relative z-0 object-cover"
                />
              </>
            ) : (
              <>
                <Image
                  src="/images/default-header-img.png"
                  alt="Дефолтне зображення бізнесу"
                  fill
                  loading="lazy"
                  fetchPriority="low"
                  sizes="(min-width: 1024px) 586px, 515px"
                  className="relative z-0 object-cover"
                />
              </>
            )}
            <div className="z-5 bg-linear-to-l to-background-white pointer-events-none absolute inset-0 from-white/0"></div>
            <div className="z-5 bg-linear-to-l to-gradient-card from-gradient-card/0 pointer-events-none absolute inset-0"></div>
          </div>
        </div>

        {/* Gradient over the image from-white/70 to-[rgb(217,217,217)/70*/}

        {/* name */}
        <div className="absolute z-10 bg-transparent py-2 pl-4 lg:pl-2">
          <h2 className="title-h3">{business.name}</h2>
          <p className="title-h4">{business.categoryName}</p>
        </div>
      </div>

      <div className="h-19 lg:h-17 xl:h-19 mb-4 flex gap-4 px-4 lg:mb-5 lg:gap-6 lg:px-2 xl:mb-3">
        <div className="flex w-[calc(50%-0.5rem)] flex-col gap-1 overflow-hidden">
          {business?.allOffersRows.length > 0 &&
            business.allOffersRows.map((offer) => (
              <div
                key={offer.offerId}
                className="flex items-center gap-3 overflow-hidden"
              >
                <CheckIcon
                  className="h-3 w-3 flex-shrink-0 lg:h-4 lg:w-4 xl:h-5 xl:w-5"
                  aria-hidden="true"
                />
                <span className="placeholder-xs lg:placeholder-sm xl:placeholder-base block truncate">
                  {offer.title?.toLowerCase()}
                </span>
              </div>
            ))}
        </div>
        <div className="flex-1">
          <p className="placeholder-xs text-text-700-grey lg:placeholder-sm">
            {business.description}
          </p>
        </div>
      </div>
      {/* hot */}
      <div className="flex gap-4 px-4 lg:gap-6 lg:px-2">
        <div className="flex flex-1 items-center gap-4 py-1 lg:gap-3 xl:py-2">
          <Karma
            businessId={business.id}
            initialKarma={business.karma}
            setOpen={setOpen}
            isLoggedIn={isLoggedIn}
            setAlertTitle={setAlertTitle}
            setActionContent={setActionContent}
            setOnConfirm={setOnConfirm}
          />

          <div
            className="flex items-center gap-0.5"
            aria-label={`Кількість відгуків: ${business.reviewCount}`}
          >
            <ReviewIcon className="h-4 w-4 xl:h-5 xl:w-5" aria-hidden="true" />
            <span className="placeholder-sm xl:placeholder-base font-medium">
              {business.reviewCount}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default BusinessCardShot;
