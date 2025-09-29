"use client";
import Image from "next/image";

export default function ThreeDCard() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="card-3d-container">
        <div className="card-3d">
          <Image
            src="/card_linkist_black_png.png"
            alt="Linkist Card"
            width={600}
            height={375}
            className="card-image"
          />
        </div>
      </div>

      <style jsx>{`
        .card-3d-container {
          perspective: 1000px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .card-3d {
          width: 600px;
          height: 375px;
          position: relative;
          transform-style: preserve-3d;
          animation: autoRotate3D 8s infinite ease-in-out;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .card-3d:hover {
          animation-play-state: paused;
          transform: rotateY(20deg) rotateX(-10deg) scale(1.1);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 20px;
        }

        @keyframes autoRotate3D {
          0% {
            transform: rotateY(-15deg) rotateX(-5deg) scale(1);
          }
          25% {
            transform: rotateY(15deg) rotateX(-10deg) scale(1.02);
          }
          50% {
            transform: rotateY(20deg) rotateX(5deg) scale(1.05);
          }
          75% {
            transform: rotateY(-10deg) rotateX(8deg) scale(1.02);
          }
          100% {
            transform: rotateY(-15deg) rotateX(-5deg) scale(1);
          }
        }

        @media (max-width: 768px) {
          .card-3d {
            width: 320px;
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
}