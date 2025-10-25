const api = import.meta.env.VITE_API_URL;

export const fetchImageFiles = async (
  imageNames: string[]
): Promise<File[]> => {
  if (imageNames?.length) {
    const files = await Promise.all(
      imageNames.map(async (imageName) => {
        const res = await fetch(`${api}/images/${imageName}`);
        const blob = await res.blob();
        const contentType = blob.type || "image/jpeg";
        return new File([blob], imageName, { type: contentType });
      })
    );
    return files;
  }
  return [];
};
