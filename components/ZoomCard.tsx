"use client";
import Image from "next/image";

export default function ZoomCard() {
  return (
    <div className="flex items-center justify-center">
      <div className="zoom-card-container">
        <Image
          src="/zoom_in_out.gif"
          alt="Linkist Card Zoom Animation"
          width={700}
          height={450}
          className="zoom-card-image"
          priority
          unoptimized // This allows GIF animation to work properly
        />
      </div>

      <style jsx>{`
        .zoom-card-container {
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1000px;
          width: 100%;
          max-width: 800px;
          height: auto;
        }

        .zoom-card-image {
          object-fit: contain;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          width: 100%;
          height: auto;
          max-width: 700px;
        }

        @media (max-width: 768px) {
          .zoom-card-container {
            max-width: 400px;
          }
          
          .zoom-card-image {
            max-width: 350px;
          }
        }

        @media (max-width: 480px) {
          .zoom-card-container {
            max-width: 300px;
          }
          
          .zoom-card-image {
            max-width: 280px;
          }
        }
      `}</style>
    </div>
  );
}