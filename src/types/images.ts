export type PreviewImage = {
  file: File | null;
  url: string | null;
  isCover: boolean;
};

//in buildClientPayload.ts
// export type ImageClientPayload = {
//   id?: string; // есть у старых, нет у новых
//   url?: string; // есть у старых, нет у новых
//   file?: File; // есть у новых, нет у старых
//   isCover: boolean;
// };

// export type UploadedResult = {
//   file: File;
//   url: string;
//   isCover: boolean;
// };

// export type UploadImage = {
//   url: string;
//   isCover: boolean;
// };

//in updateBusinessImagesOnServer.ts
export type ServerImagePayload = {
  id?: string; // только у старых
  url: string; // есть у всех
  isCover: boolean;
};
