import { useState } from "react";

// Renders an image with a fallback placeholder if the image fails to load or the src is missing.
const ImageWithFallback = ({ src, alt, imageClassName, fallbackClassName }) => {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  // Determines whether to show the image or the fallback based on the src and load failure state.
  return showImage ? (
    // Renders the image if the src is valid and it hasn't failed to load.
    <img src={src} alt={alt} className={imageClassName} onError={() => setFailed(true)} />
  ) : (
    // Renders the fallback placeholder if the image failed to load or the src is missing.
    <div className={fallbackClassName} aria-hidden="true" />
  );
};

export default ImageWithFallback;
