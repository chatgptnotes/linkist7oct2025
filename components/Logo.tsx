'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  href?: string;
  className?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  noLink?: boolean; // Add flag to disable Link wrapper
  variant?: 'light' | 'dark'; // light = logo1.png (for white bg), dark = logo2.png (for dark bg)
}

export default function Logo({
  href = '/',
  className = '',
  imageClassName = '',
  width = 120,
  height = 40,
  noLink = false,
  variant = 'light' // Default to light (logo1.png)
}: LogoProps) {
  // Select logo based on variant
  const logoSrc = variant === 'dark' ? '/logo2.png' : '/logo1.png';

  const imageElement = (
    <Image
      src={logoSrc}
      alt="Linkist"
      width={width}
      height={height}
      className={imageClassName}
      style={{ width: 'auto', height: 'auto' }}
      priority
    />
  );

  if (noLink) {
    return (
      <div className={`flex items-center ${className}`}>
        {imageElement}
      </div>
    );
  }

  return (
    <Link href={href} className={`flex items-center ${className}`}>
      {imageElement}
    </Link>
  );
}
