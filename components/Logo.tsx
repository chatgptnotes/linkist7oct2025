'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  href?: string;
  className?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
}

export default function Logo({
  href = '/landing',
  className = '',
  imageClassName = '',
  width = 120,
  height = 40
}: LogoProps) {
  return (
    <Link href={href} className={`flex items-center ${className}`}>
      <Image
        src="/logo_linkist.png"
        alt="Linkist"
        width={width}
        height={height}
        className={imageClassName}
        priority
      />
    </Link>
  );
}
