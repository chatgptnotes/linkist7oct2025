"use client";
import { useEffect } from "react";
import "./PremiumCard.css";

export default function PremiumCardSection() {
  useEffect(() => {
    // Import and initialize card controller
    import("./premiumCardController").then((module) => {
      new module.default();
    });
  }, []);

  return (
    <section className="premium-card-section reveal">
      {/* Background Effects */}
      <div className="background-effects">
        <div className="floating-particles" id="cardParticles"></div>
        <div className="animated-waves">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
        <div className="golden-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      <div className="card-container">
        <div className="premium-card" id="linkistCard">
          <div className="card-layer card-layer-1"></div>
          <div className="card-layer card-layer-2"></div>
          <div className="card-layer card-layer-3"></div>
          <div className="linkist-card-image">
            <img src="/card_linkist_black_png.png" alt="Linkist Premium Card" />
          </div>
        </div>

        <div className="card-content">
          <h2 className="card-title">Premium aluminum card construction</h2>
          <p className="card-subtitle">for exceptional NFC capability</p>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🔥</div>
              <span>Thermal Management</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💎</div>
              <span>Premium Materials</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <span>Lightning Performance</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📡</div>
              <span>NFC Technology</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}