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
}

export default function Logo({
  href = '/',
  className = '',
  imageClassName = '',
  width = 120,
  height = 40,
  noLink = false
}: LogoProps) {
  const imageElement = (
    <Image
      src="/logo_linkist.png"
      alt="Linkist"
      width={width}
      height={height}
      className={imageClassName}
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
