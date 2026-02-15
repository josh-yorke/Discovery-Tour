const api = import.meta.env.VITE_API_URL;

async function generateFileHash(file: Blob): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .substring(0, 16);
}

export const fetchImageFiles = async (
  imageNames: string[],
): Promise<File[]> => {
  if (!imageNames?.length) return [];

  const files = await Promise.all(
    imageNames.map(async (imageName) => {
      const res = await fetch(`${api}/images/${imageName}`);
      const blob = await res.blob();
      const contentType = blob.type || "image/jpeg";

      // Generate hash from content for consistent naming
      const contentHash = await generateFileHash(blob);
      const fileExtension = imageName.split(".").pop() || "jpg";
      const shortName = `${contentHash}.${fileExtension}`;

      return new File([blob], shortName, { type: contentType });
    }),
  );
  return files;
};
