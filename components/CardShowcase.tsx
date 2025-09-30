"use client";
import Image from "next/image";
import "./CardShowcase.css"; // CSS alag file me daalna

export default function CardShowcase() {
  return (
    <div className="reader">
      <div className="reader__bar"></div>
      <div className="reader__placeholder"></div>
      <div className="reader__cc-shadow"></div>
      <div className="cc">
        <div className="cc__chip"></div>
      </div>

      {/* 🔥 Apni card wali image */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <Image
          src="/card_linkist_black_png.png" // apni card wali image public/ me daalni hai
          alt="Card"
          width={500}
          height={320}
          className="rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
}