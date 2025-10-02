import React from 'react';
import Image from 'next/image';

interface SSRImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

// Server-side rendered image component with optimized loading
export default function SSRImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  quality = 85,
  sizes,
  placeholder = 'blur',
  blurDataURL
}: SSRImageProps) {
  // Generate a simple blur placeholder if none provided
  const defaultBlurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

  const imageProps = {
    src,
    alt,
    className,
    priority,
    quality,
    placeholder,
    blurDataURL: blurDataURL || defaultBlurDataURL,
    ...(fill ? { fill: true } : { width, height }),
    ...(sizes && { sizes })
  };

  return <Image {...imageProps} />;
}

// Pre-optimized hero image component for SSR
export function SSRHeroImage({ 
  src, 
  alt, 
  className = '',
  priority = true 
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <SSRImage
      src={src}
      alt={alt}
      fill
      className={className}
      priority={priority}
      quality={90}
      sizes="100vw"
      placeholder="blur"
    />
  );
}

// Pre-optimized team member image component for SSR
export function SSRTeamImage({ 
  src, 
  alt, 
  className = '' 
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <SSRImage
      src={src}
      alt={alt}
      width={200}
      height={250}
      className={className}
      quality={85}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 200px"
      placeholder="blur"
    />
  );
}

// Pre-optimized background image component for SSR
export function SSRBackgroundImage({ 
  src, 
  alt, 
  className = '' 
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <SSRImage
      src={src}
      alt={alt}
      fill
      className={className}
      quality={80}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
    />
  );
}
