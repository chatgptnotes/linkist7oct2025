"use client";
import { useState } from "react";
import Image from "next/image";

export default function AnimatedCard() {
  const [style, setStyle] = useState({ transform: "rotateX(0deg) rotateY(0deg)" });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Calculate tilt angles
    const rotateY = ((x - width / 2) / width) * 30; // -30° to +30°
    const rotateX = ((y - height / 2) / height) * -30; // -30° to +30°

    setStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
    });
  };

  const resetRotation = () => {
    setStyle({ transform: "rotateX(0deg) rotateY(0deg)" });
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className="w-[500px] h-[320px] rounded-2xl"
        style={{ perspective: "1000px" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetRotation}
      >
        <div
          className="w-full h-full rounded-2xl shadow-2xl transition-transform duration-200 ease-out"
          style={style}
        >
          <Image
            src="/card_linkist_black_png.png"
            alt="3D Card"
            width={500}
            height={320}
            className="object-contain rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}