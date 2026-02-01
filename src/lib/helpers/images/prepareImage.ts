import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from '@/const/images';
import imageCompression from 'browser-image-compression';

export async function prepareImage(file: File) {
  console.log('Blob', file.size);
  const options = {
    maxSizeMB: MAX_FILE_SIZE_MB * 0.8, // goal size
    maxWidthOrHeight: 2000, // size
    useWebWorker: true,
  };

  // if file is already under the limit, return as is
  if (file.size <= MAX_FILE_SIZE) {
    return file;
  }
  try {
    const compressedFile = await imageCompression(file, options);

    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`);
    return compressedFile;
  } catch (error) {
    console.log('image optimisatiom error', error);
    throw new Error('IMAGE_COMPRESSION_FAILED');
  }
}
