import React, { useState } from 'react';
import { X, Star, StarOff, Upload } from 'lucide-react';
import { Plus } from 'lucide-react';
import ImageFolder from '@/assets/icons/form/image-folder.svg';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

interface PreviewImage {
  file: File | null;
  url: string | null;
  isCover: boolean;
}

function ImagesBlock() {
  const MAX_PHOTOS = 10;
  const [images, setImages] = useState<PreviewImage[]>(
    Array.from({ length: MAX_PHOTOS }, () => ({
      file: null,
      url: null,
      isCover: false,
    }))
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleRemove = (index: number) => {};
  const handleSetCover = (index: number) => {};
  const handleUpload = async () => {};
  return (
    <div className="bg-background-grey-50 mb-10 w-full py-10">
      <div className="mx-auto flex w-full flex-col items-center gap-6 max-[1024px]:px-4">
        <div className="flex justify-center gap-3 px-7">
          <label className="shadow-menu border-background-main-300 placeholder-sm flex h-8 w-[134px] cursor-pointer items-center gap-[6px] border bg-white px-3 py-[6px]">
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
        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-6">
          {images.map((img, index) => (
            <div
              key={index}
              className="bg-background-grey-100 relative flex aspect-square min-w-[164px] items-center justify-center overflow-hidden"
            >
              {img.url ? (
                <>
                  <Image
                    src={img.url}
                    alt={`preview-${index}`}
                    className="h-full w-full object-cover"
                  />
                  {/* Кнопка удаления */}
                  <button
                    onClick={() => handleRemove(index)}
                    className="absolute right-1 top-1 rounded-full bg-white/80 p-1 hover:bg-white"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>

                  {/* Кнопка выбора главного */}
                  <button
                    onClick={() => handleSetCover(index)}
                    className="absolute bottom-1 right-1 rounded-full bg-white/80 p-1 hover:bg-white"
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
        <button
          onClick={handleUpload}
          type="submit"
          className="shadow-menu bg-background-main-300 placeholder-sm w-fit px-[6px] py-3"
        >
          Завантажити
        </button>
      </div>
    </div>
  );
}

export default ImagesBlock;
