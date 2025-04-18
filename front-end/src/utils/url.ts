export const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const apiBaseUrl =
    import.meta.env.REACT_APP_API_URL || "http://localhost:8000";
  return `${apiBaseUrl}/storage/${imagePath}`;
};
