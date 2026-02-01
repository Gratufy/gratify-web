import { createClient } from '@/utils/supabase/client';
import { PreviewImage } from '@/types/images';
import { MAX_FILE_SIZE } from '@/const/images';

export async function uploadImagesAndReturnUrls(
  businessId: string,
  newFiles: PreviewImage[]
  // userId: string
) {
  const supabase = createClient();

  // only new photos/files
  if (!newFiles.length) return [];

  const uploaded: {
    url: string;
    isCover: boolean;
  }[] = [];

  for (const img of newFiles) {
    const file = img.file!;

    // 🔴 SERVER-SIDE GUARD
    if (file.size > MAX_FILE_SIZE) {
      console.error('File too large:', file.name, file.size);
      throw new Error('FILE_TOO_LARGE');
    }
    const filePath = `${businessId}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from('business-images')
      .upload(filePath, file);

    if (error) {
      console.error('Upload error:', error);

      throw new Error('UPLOAD_FAILED');
    }

    const { data } = supabase.storage
      .from('business-images')
      .getPublicUrl(filePath);

    uploaded.push({
      url: data.publicUrl,
      isCover: img.isCover,
    });
  }

  return uploaded;
}

// export function buildClientPayload(
//   images: (PreviewImage & { id?: string })[]
// ): ImageClientPayload[] {
//   return images
//     .filter((img) => img.file || img.url)
//     .map((img) => ({
//       id: img.id, // будет undefined для новых фото
//       url: img.url || undefined,
//       file: img.file || undefined,
//       isCover: img.isCover,
//     }));
// }
