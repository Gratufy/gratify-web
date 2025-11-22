import { PreviewImage } from '@/types/images';

export function ensureOneCover(images: PreviewImage[]) {
  const hasCover = images.some((img) => img.isCover);

  if (!hasCover) {
    const firstFilled = images.findIndex((img) => img.file || img.url);
    if (firstFilled !== -1) {
      images.forEach((img, i) => {
        img.isCover = i === firstFilled;
      });
    }
  }

  return images;
}
