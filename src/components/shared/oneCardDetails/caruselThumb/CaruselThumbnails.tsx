'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import IconLeft from '@/assets/icons/general/icon-arrow-left.svg';

interface EmblaCarouselProps {
  slides: string[];
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
    <div className="flex w-[343px] flex-col items-center lg:w-[450px] xl:w-[461px]">
      {/* Главная карусель h-[317px] lg:h-[414px]*/}
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
          className="embla__viewport mb-4 h-[317px] overflow-hidden lg:mb-5 lg:h-[414px]"
          ref={emblaMainRef}
        >
          <div className="embla__container flex h-[317px] lg:h-[414px]">
            {slides.map((src, index) => (
              <div
                //
                className="embla__slide relative flex-[0_0_100%]"
                key={index}
              >
                <div className="relative mx-auto h-[317px] w-[343px] lg:h-[414px] lg:w-[450px] xl:h-[424px] xl:w-[461px]">
                  <Image
                    src={src}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 343px, (max-width: 1440px) 450px, 461px"
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
          <div className="embla-thumbs__container lg:h-18 xl:h-21 h-21 flex items-center gap-4 lg:gap-8">
            {slides.map((src, index) => (
              <button
                key={index}
                onClick={() => onThumbClick(index)}
                className={`h-18 w-18 lg:w-15 lg:h-15 xl:w-18 xl:h-18 relative shrink-0 overflow-hidden border-[3px] transition ${
                  selectedIndex === index
                    ? 'border-elements-main-600 lg:w-17 lg:h-17 h-20 w-20 xl:h-20 xl:w-20'
                    : 'border-transparent opacity-60'
                }`}
              >
                <Image
                  src={src}
                  alt={`Thumb ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:w-30 mx-auto hidden lg:flex lg:justify-between">
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
    </div>
  );
}

export default CaruselThumbnails;
