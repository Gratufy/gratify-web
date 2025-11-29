export type PreviewImage = {
  file: File | null;
  url: string | null;
  isCover: boolean;
};

//in buildClientPayload.ts
// export type ImageClientPayload = {
//   id?: string; // old +, new -
//   url?: string; //  old +, new -
//   file?: File; // old -, new +
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
  id?: string; // only old
  url: string; // all
  isCover: boolean;
};
