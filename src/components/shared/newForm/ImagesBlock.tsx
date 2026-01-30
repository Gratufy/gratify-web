'use client';
import React from 'react';

import Image from 'next/image';

import { PreviewImage } from '@/types/images';

import ImageFolder from '@/assets/icons/form/image-folder.svg';
import PhotoMainIcon from '@/assets/icons/form/photo-main.svg';
import PhotoChooseIcon from '@/assets/icons/form/icon-choose.svg';
import CrossIcon from '@/assets/icons/form/x-cross.svg';
import { Plus } from 'lucide-react';

import { CustomToast } from '@/components/ui/custom-ui/CustomToast';
import { Label } from '@/components/ui/label';

interface ImagesBlockProps {
  imagesState: PreviewImage[];
  setImagesState: React.Dispatch<React.SetStateAction<PreviewImage[]>>;
}

function ImagesBlock({ imagesState, setImagesState }: ImagesBlockProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // slot is considered filled if there is a file or url
    const isFilled = (img: PreviewImage) => !!(img.file || img.url);

    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setImagesState((prev) => {
      const updated = [...prev];

      //check if there is already a cover set
      const hasCover = updated.some((img) => img.isCover);

      // look for first empty slot
      for (const file of files) {
        const emptySlot = updated.findIndex((img) => !isFilled(img));
        if (emptySlot === -1) {
          CustomToast({
            type: 'warning',
            content: (
              <>
                <p className="font-semibold">
                  Досягнуто максимальну кількість фото
                </p>
              </>
            ),
          });

          break;
        }

        updated[emptySlot] = {
          file,
          url: URL.createObjectURL(file),
          isCover: false,
        };
      }
      if (!hasCover) {
        const firstFilled = updated.findIndex((img) => isFilled(img));
        if (firstFilled !== -1) {
          updated.forEach((img, i) => (img.isCover = i === firstFilled));
        }
      }
      return updated;
    });

    //input reset (otherwise you can't select the same photo again)
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    setImagesState((prev) => {
      const updated = [...prev];
      const removed = updated[index];
      if (removed.url) URL.revokeObjectURL(removed.url);
      updated[index] = { file: null, url: null, isCover: false };
      return updated;
    });
  };

  const handleSetCover = (index: number) => {
    setImagesState((prev) =>
      prev.map((img, i) => ({
        ...img,
        isCover: i === index && (img.file || img.url) ? true : false,
      }))
    );
  };

  return (
    <div className="bg-background-grey-50 dark:bg-background-main-200 container mb-10 w-full py-10">
      <div className="mx-auto flex w-full flex-col items-center gap-6 max-[1024px]:px-4">
        <div className="flex justify-center gap-3">
          <Label
            htmlFor="images-file"
            className="btn-reject h-8 gap-[6px] border px-3 xl:px-5"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span>Додати фото</span>

            <input
              aria-describedby="image-rules"
              id="images-file"
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFileChange}
            />
          </Label>

          <div
            className="caption flex flex-col items-start justify-between"
            id="image-rules"
          >
            <p>максимальний розмір 5Мб</p>
            <p>максимальна кількість 10 шт</p>
          </div>
        </div>
        <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-5 lg:gap-x-5 lg:gap-y-5 xl:gap-y-4">
          {imagesState.map((img, index) => (
            <li
              key={index}
              className="bg-background-grey-100 relative flex aspect-square min-w-[164px] items-center justify-center overflow-hidden"
            >
              {img.url ? (
                <>
                  <Image
                    src={img.url}
                    alt={
                      img.isCover
                        ? 'Фото обкладинки'
                        : `Завантажене фото ${index + 1}`
                    }
                    sizes="
    (max-width: 1024px) 276px,
    (max-width: 1440px) 169px,
    212px
  "
                    fill
                    className="object-cover"
                  />

                  <div className="absolute right-0 top-0 flex gap-2 p-2 max-[1024px]:left-0 max-[1024px]:justify-between">
                    {/* btn toggle cover photo */}
                    <button
                      aria-label={
                        img.isCover
                          ? 'Зняти з обкладинки'
                          : 'Встановити обкладинкою'
                      }
                      type="button"
                      onClick={() => handleSetCover(index)}
                      className="cursor-pointer hover:opacity-90 focus-visible:outline focus-visible:outline-offset-2"
                    >
                      {img.isCover ? (
                        <PhotoMainIcon
                          className="text-icons-grey-950 size-5 xl:size-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <PhotoChooseIcon
                          className="text-background-white size-5 hover:opacity-90 xl:size-6"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                    {/* remove btn */}
                    <button
                      type="button"
                      aria-label={`Видалити фото ${index + 1}`}
                      onClick={() => handleRemove(index)}
                      className="bg-background-white flex size-5 cursor-pointer items-center justify-center hover:opacity-90 focus-visible:outline focus-visible:outline-offset-2 xl:size-6"
                    >
                      <CrossIcon
                        className="size-3 xl:size-4"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </>
              ) : (
                <ImageFolder
                  className="text-icons-grey-300 size-10"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ImagesBlock;
