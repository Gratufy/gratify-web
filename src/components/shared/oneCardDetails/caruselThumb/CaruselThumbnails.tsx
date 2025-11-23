'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

import IconLeft from '@/assets/icons/general/icon-arrow-left.svg';
import { BusinessImages } from '@/types';

interface EmblaCarouselProps {
  slides: BusinessImages;
  options?: object;
}

function CaruselThumbnails({ slides, options }: EmblaCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    const snap = emblaMainApi.selectedScrollSnap();
    setSelectedIndex(snap);
    emblaThumbsApi.scrollTo(snap);
  }, [emblaMainApi, emblaThumbsApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on('select', onSelect).on('reInit', onSelect);
  }, [emblaMainApi, onSelect]);

  return (
    <div className="mx-auto flex w-[343px] flex-col items-center lg:w-[450px] xl:w-[461px]">
      {/* Главная карусель h-[317px] lg:h-[414px]*/}
      {slides.length > 0 && (
        <>
          <div className="embla w-full">
            {/* buttons only for mobile */}
            <div className="w-30 mx-auto mb-4 flex justify-between lg:hidden">
              <button
                // variant="outline"
                className="hover:bg-background-grey-50 flex items-center justify-center bg-white"
                onClick={() => emblaMainApi?.scrollPrev()}
              >
                <IconLeft className="size-5" />
              </button>
              <button
                className="hover:bg-background-grey-50 flex items-center justify-center bg-white"
                onClick={() => emblaMainApi?.scrollNext()}
              >
                <IconLeft className="size-5 rotate-180" />
              </button>
            </div>
            {/* main photo */}
            <div
              className="embla__viewport mb-4 h-[317px] overflow-hidden lg:mb-5 lg:h-[414px] xl:h-[424px]"
              ref={emblaMainRef}
            >
              <div className="embla__container flex h-[317px] lg:h-[414px] xl:h-[424px]">
                {slides.map((image, index) => (
                  <div
                    //
                    className="embla__slide relative flex-[0_0_100%]"
                    key={index}
                  >
                    <div className="relative mx-auto h-[317px] w-[343px] lg:h-[414px] lg:w-[450px] xl:h-[424px] xl:w-[461px]">
                      <Image
                        src={image.url}
                        alt={`Image ${index + 1}`}
                        fill
                        //unoptimized
                        priority={index === 0}
                        className="object-cover"
                        sizes="(max-width: 1024px) 343px, (max-width: 1440px) 450px, 462px"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Превью max-w-xl*/}
          <div className="embla-thumbs w-full lg:mb-5">
            <div
              className="embla-thumbs__viewport xl:h-21 h-21 lg:h-18 overflow-hidden"
              ref={emblaThumbsRef}
            >
              <div className="embla-thumbs__container lg:h-18 xl:h-21 h-21 flex items-center gap-4 lg:justify-center lg:gap-8 xl:gap-5">
                {slides.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => onThumbClick(index)}
                    className={`h-18 w-18 lg:w-15 lg:h-15 xl:w-18 xl:h-18 relative shrink-0 cursor-pointer overflow-hidden transition ${
                      selectedIndex === index
                        ? 'border-elements-main-600 lg:w-17 lg:h-17 h-20 w-20 border-[3px] xl:h-20 xl:w-20'
                        : 'opacity-60'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`Thumb ${index + 1}`}
                      width={80}
                      height={80}
                      // fill
                      sizes="80px"
                      // unoptimized
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:w-30 xl:w-34 mx-auto hidden lg:flex lg:justify-between">
            <button
              // variant="outline"
              className="hover:bg-background-grey-50 flex cursor-pointer items-center justify-center bg-white"
              onClick={() => emblaMainApi?.scrollPrev()}
            >
              <IconLeft className="lg:size-5 xl:size-6" />
            </button>
            <button
              className="hover:bg-background-grey-50 flex cursor-pointer items-center justify-center bg-white"
              onClick={() => emblaMainApi?.scrollNext()}
            >
              <IconLeft className="rotate-180 lg:size-5 xl:size-6" />
            </button>
          </div>
        </>
      )}
      {slides.length === 0 && (
        <div className="bg-default-photo mx-auto h-[317px] w-[343px] lg:h-[414px] lg:w-[450px] xl:h-[424px] xl:w-[461px]">
          <div className="h-[236px] w-full lg:h-[309px] xl:h-[316px]">
            <Image
              className="h-auto"
              width={460}
              height={316}
              src="/images/default-image.png"
              alt="Фото ще не завантажені — але ми впевнені, що тут гарно"
              // fill
              // className="object-cover"
              // sizes="(max-width: 1024px) 343px, (max-width: 1440px) 460px, 462px"
            />
          </div>
          <div className="title-h5 text-text-800-grey px-15 lg:px-18 xl:px-20">
            <p>Фото ще не завантажені —</p>
            <p>але ми впевнені, що тут гарно</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CaruselThumbnails;
