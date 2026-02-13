export interface UploadFileQueryModel {
  bucket: string;
  file: File;
  userId: string;
}

export interface GetSignedUrlQueryModel {
  bucket: string;
  path: string;
}
