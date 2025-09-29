"use client";
import Image from "next/image";

export default function CardSpin() {
  return (
    <div className="card-spin-container">
      <div className="animate-spin-slow">
        <Image
          src="/card_linkist_black_png.png"
          alt="Rotating Linkist Card"
          width={1000}
          height={625}
          className="rounded-2xl shadow-lg"
        />
      </div>
      
      <style jsx>{`
        .card-spin-container {
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1000px;
        }
        
        .animate-spin-slow {
          animation: spin 6s linear infinite;
          transform-style: preserve-3d;
        }
        
        @keyframes spin {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }
      `}</style>
    </div>
  );
}