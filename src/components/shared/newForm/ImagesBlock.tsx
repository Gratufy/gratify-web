'use client';
import React from 'react';
import { X, Star, StarOff } from 'lucide-react';

import PhotoMainIcon from '@/assets/icons/form/photo-main.svg';
import PhotoChooseIcon from '@/assets/icons/form/icon-choose.svg';
import CrossIcon from '@/assets/icons/form/x-cross.svg';
import { Plus } from 'lucide-react';
import ImageFolder from '@/assets/icons/form/image-folder.svg';

import Image from 'next/image';
import { PreviewImage } from '@/types/images';
import { CustomToast } from '@/components/ui/CustomToast';

type ImagesBlockProps = {
  imagesState: PreviewImage[];
  setImagesState: React.Dispatch<React.SetStateAction<PreviewImage[]>>;
};

function ImagesBlock({ imagesState, setImagesState }: ImagesBlockProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // считаем слот заполненным, если есть file или url
    const isFilled = (img: PreviewImage) => !!(img.file || img.url);

    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setImagesState((prev) => {
      const updated = [...prev];

      // Проверяем: есть ли уже установленная обложка?
      const hasCover = updated.some((img) => img.isCover);
      // найти первую пустую ячейку

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

    // сброс input (иначе нельзя выбрать то же фото снова)
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
    <div className="bg-background-grey-50 mb-10 w-full py-10">
      <div className="container mx-auto flex w-full flex-col items-center gap-6 max-[1024px]:px-4">
        <div className="flex justify-center gap-3 px-7">
          <label className="btn-reject gap-[6px] border px-3 xl:px-5">
            <Plus className="size-4" />
            <p>Додати фото</p>
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFileChange}
            />
          </label>

          <div className="caption flex flex-col items-start justify-between">
            <p>максимальний розмір 5Мб</p>
            <p>максимальна кількість 10 шт</p>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-5 lg:gap-x-5 lg:gap-y-5 xl:gap-y-4">
          {imagesState.map((img, index) => (
            <div
              key={index}
              className="bg-background-grey-100 relative flex aspect-square min-w-[164px] items-center justify-center overflow-hidden"
            >
              {img.url ? (
                <>
                  <Image
                    src={img.url}
                    alt={`preview-${index}`}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute right-0 top-0 flex gap-2 p-2 max-[1024px]:left-0 max-[1024px]:justify-between">
                    {/* Кнопка удаления */}

                    {/* Кнопка выбора главного */}
                    <button
                      type="button"
                      onClick={() => handleSetCover(index)}
                      className="cursor-pointer"
                    >
                      {img.isCover ? (
                        <PhotoMainIcon className="text-icons-grey-950 size-5 xl:size-6" />
                      ) : (
                        <PhotoChooseIcon className="text-background-white size-5 xl:size-6" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="bg-background-white flex size-5 cursor-pointer items-center justify-center xl:size-6"
                    >
                      <CrossIcon className="size-3 xl:size-4" />
                    </button>
                  </div>
                </>
              ) : (
                <ImageFolder className="size-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImagesBlock;
