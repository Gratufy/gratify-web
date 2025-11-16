'use client';
import React from 'react';
import { X, Star, StarOff } from 'lucide-react';
import { Plus } from 'lucide-react';
import ImageFolder from '@/assets/icons/form/image-folder.svg';

import Image from 'next/image';

interface PreviewImage {
  file: File | null;
  url: string | null;
  isCover: boolean;
}
type ImagesBlockProps = {
  imagesState: PreviewImage[];
  setImagesState: React.Dispatch<React.SetStateAction<PreviewImage[]>>;
};

function ImagesBlock({ imagesState, setImagesState }: ImagesBlockProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setImagesState((prev) => {
      const updated = [...prev];

      // Проверяем: есть ли уже установленная обложка?
      const hasCover = updated.some((img) => img.isCover);
      // найти первую пустую ячейку

      for (const file of files) {
        const emptySlot = updated.findIndex((img) => !img.file);
        if (emptySlot === -1) {
          alert('Досягнуто максимальну кількість фото');
          break;
        }

        updated[emptySlot] = {
          file,
          url: URL.createObjectURL(file),
          isCover: false,
        };
      }
      if (!hasCover) {
        const firstFilled = updated.findIndex((img) => img.file);
        if (firstFilled !== -1) updated[firstFilled].isCover = true;
      }
      return updated;
    });
    console.log('imagesState after update:', imagesState);
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
        isCover: i === index && img.file ? !img.isCover : false,
      }))
    );
  };

  return (
    <div className="bg-background-grey-50 mb-10 w-full py-10">
      <div className="container mx-auto flex w-full flex-col items-center gap-6 max-[1024px]:px-4">
        <div className="flex justify-center gap-3 px-7">
          <label className="btn-reject w-[134px] gap-[6px] border px-3">
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
        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-5 lg:gap-x-5 lg:gap-y-5">
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
                  {/* Кнопка удаления */}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute right-2 top-2 cursor-pointer rounded-full bg-white/80 p-1 hover:bg-white"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>

                  {/* Кнопка выбора главного */}
                  <button
                    type="button"
                    onClick={() => handleSetCover(index)}
                    className="absolute left-2 top-2 cursor-pointer rounded-full bg-white/80 p-1 hover:bg-white"
                  >
                    {img.isCover ? (
                      <Star className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <StarOff className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
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
