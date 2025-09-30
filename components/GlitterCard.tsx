"use client";

export default function GlitterCard() {
  return (
    <div className="flex items-center justify-center">
      <main className="glitter-main">
        
        <aside className="card-front">
          <label className="number">
            ✨ LINKIST ✨
          </label>
          <label className="name">
            Premium Card
          </label>
          <label className="expiry">
            NFC
          </label>
          
          <div className="chip">
            <svg role="img" viewBox="0 0 100 100" aria-label="Chip">
              <g id="chip-lines">
                <polyline points="0,50 35,50"></polyline>
                <polyline points="0,20 20,20 35,35"></polyline>
                <polyline points="50,0 50,35"></polyline>
                <polyline points="65,35 80,20 100,20"></polyline>
                <polyline points="100,50 65,50"></polyline>
                <polyline points="35,35 65,35 65,65 35,65 35,35"></polyline>
                <polyline points="0,80 20,80 35,65"></polyline>
                <polyline points="50,100 50,65"></polyline>
                <polyline points="65,65 80,80 100,80"></polyline>
              </g>
            </svg>
          </div>
          
          <div className="contactless">
            <svg role="img" viewBox="0 0 24 24" aria-label="Contactless">
              <g id="contactless-icon">
                <path d="M9.172 15.172a4 4 0 0 1 5.656 0"></path>
                <path d="M6.343 12.343a8 8 0 0 1 11.314 0"></path>
                <path d="M3.515 9.515c4.686 -4.687 12.284 -4.687 17 0"></path>
              </g>
            </svg>
          </div>
          
        </aside>
        
      </main>

      <style jsx>{`
        .glitter-main {
          display: grid;
          place-items: center;
          perspective: 1000px;
          overflow: hidden;
          width: 100%;
          height: 400px;
        }

        .card-front {
          display: grid;
          position: relative;
          transform: translate3d(0, 0, 0.01px);
          
          height: clamp(300px, calc(100vh - 150px), 400px);
          width: auto;
          aspect-ratio: 3/2;

          border-radius: 3.5% / 5%;

          background-image: url(/linkist_Card_Mockup.png);
          background-size: cover;
          background-position: center;

          box-shadow: 0 30px 40px -25px rgba(15, 5, 20, 1), 0 20px 50px -15px rgba(15, 5, 20, 1);
          overflow: hidden;
          animation: tilt 6.66s ease infinite;
          image-rendering: optimizequality;
        }

        .card-front:before {
          content: "";
          inset: 0;
          position: absolute;
          transform: translate3d(0, 0, 0.01px);

          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.8) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.6) 0%, transparent 50%),
            linear-gradient(120deg, black 25%, white, black 75%);
          background-size: 100% 100%, 80% 80%, 200% 200%;
          background-blend-mode: multiply, multiply, overlay;
          background-position: 50% 50%, 50% 50%, 50% 50%;

          mix-blend-mode: color-dodge;
          filter: brightness(2) contrast(0.8);

          animation: bg 6.66s ease infinite;
        }

        .card-front:after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(125deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.4) 0.1%, rgba(255,255,255,0) 60%);
          background-size: 200% 200%;
          mix-blend-mode: hard-light;
          animation: bg 6.66s ease infinite;
        }

        .card-front * {
          font-family: 'PT Mono', monospace;
        }

        .number, .name, .expiry, .chip {
          color: #ccc;
          position: absolute;
          margin: 0;
          padding: 0;
          letter-spacing: 0.075em;
          text-transform: uppercase;
          font-size: clamp(0.75rem, 2.8vw + 0.2rem, 1.1rem);
          inset: 5%;
          text-shadow: -1px -1px 0px rgba(255,255,255,0.5), 1px -1px 0px rgba(255,255,255,0.5), 1px 1px 0px rgba(0,0,0,0.5), 1px -1px 0px rgba(0,0,0,0.5);
          z-index: 5;
        }

        .name, .number, .expiry {
          background-image: 
            linear-gradient(to bottom, #ededed 20%, #bababa 70%), 
            linear-gradient(120deg, transparent 10%, white 40%, white 60%, transparent 90%);
          background-size: cover, 200%;
          background-position: 50% 50%;
          background-blend-mode: overlay;
          -webkit-text-fill-color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: bg 6.66s ease infinite;
        }

        .number {
          font-family: 'PT Mono', monospace;
          text-align: center;
          font-size: clamp(1rem, 8vw - 0.5rem, 2.5rem);
          letter-spacing: 0.025em;
          top: 60%;
          bottom: auto;
          font-weight: bold;
        }

        .expiry, .name {
          top: auto;
        }

        .name {
          right: auto;
          max-width: 180px;
          line-height: 1.2;
          text-align: left;
          font-size: clamp(0.8rem, 3vw, 1.2rem);
        }

        .expiry {
          left: auto;
          font-size: clamp(1rem, 4vw, 1.5rem);
          font-weight: bold;
        }

        .chip {
          display: grid;
          place-items: center;
          width: 14%;
          aspect-ratio: 5/4;
          left: 10%;
          top: 30%;
          border-radius: 10% 10% 10% 10% / 15% 15% 15% 15%;

          background-image: linear-gradient(120deg, #777 10%, #ddd 40%, #ddd 60%, #777 90%);
          background-size: 200% 200%;
          background-position: 50% 50%;

          overflow: hidden;
          animation: bg 6.66s ease infinite;
        }

        .chip svg {
          display: block;
          width: 90%;
          fill: none;
          stroke: #444;
          stroke-width: 2;
        }

        .contactless {
          position: absolute;
          left: 23%;
          top: 29.5%;
          width: 12%;
        }

        .contactless svg {
          transform: rotate(90deg);
          stroke-width: 1.25;
          stroke: white;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          opacity: 0.5;
        }

        @keyframes tilt {
          0%, 100% { 
            transform: translate3d(0, 0, 0.01px) rotateY(-20deg) rotateX(5deg); 
          }
          50% { 
            transform: translate3d(0, 0, 0.01px) rotateY(20deg) rotateX(5deg); 
          }
        }

        @keyframes bg {
          0%, 100% { 
            background-position: 50% 50%, calc(50% + 1px) calc(50% + 1px), 0% 50%; 
          }
          50% { 
            background-position: 50% 50%, calc(50% - 1px) calc(50% - 1px), 100% 50%; 
          }
        }
      `}</style>
    </div>
  );
}