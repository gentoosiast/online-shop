import React, { useState } from 'react';

interface IImageProps {
  src: string;
  alt: string;
  className: string;
}

export const Image = ({ src, alt, className }: IImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      onLoad={() => setLoaded(true)}
      className={ `${className} ${loaded ? 'image-loaded' : ''}`}
      src={src}
      alt={loaded ? alt : ''}
    />
  );
}
