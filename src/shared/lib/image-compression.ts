import imageCompression from "browser-image-compression";

const DEFAULT_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
  initialQuality: 0.8,
};

export const compressImage = async (file: File): Promise<File> => {
  return await imageCompression(file, DEFAULT_OPTIONS);
};
