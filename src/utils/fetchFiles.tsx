const api = import.meta.env.VITE_API_URL;

export const fetchFile = async (
  fileName: string | null | undefined
): Promise<File | null> => {
  // Check if fileName is a valid string
  if (typeof fileName !== "string" || !fileName.trim()) {
    return null;
  }

  try {
    const res = await fetch(`${api}/files/${fileName}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch file: ${fileName}`);
    }
    const blob = await res.blob();
    const contentType = blob.type || "application/octet-stream";
    return new File([blob], fileName, { type: contentType });
  } catch (error) {
    console.error("Error fetching file:", error);
    return null;
  }
};
