const api = import.meta.env.VITE_API_URL;

export const downloadFile = async (fileName: string | null | undefined) => {
  if (typeof fileName !== "string" || !fileName.trim()) {
    console.error("Invalid file name");
    return;
  }

  try {
    const res = await fetch(`${api}/files/${fileName}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch file: ${fileName}`);
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    // Create and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error downloading file:", error);
    return false;
  }
};
