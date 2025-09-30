'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import CardShowcase from '@/components/CardShowcase';
import PremiumCardSection from '@/components/PremiumCardSection';
import ZoomCard from '@/components/ZoomCard';

// Types and Interfaces
interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BagOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PremiumCardProps {
  className?: string;
}


// Search Overlay Component
const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isOpen || !inputRef.current) return;
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, mounted]);

  return (
    <div className={`search-overlay ${isOpen ? 'active' : ''}`}>
      <div className="search-container">
        <div className="search-input-wrapper">
          <svg className="search-input-icon" viewBox="0 0 15 44" width="15" height="44">
            <path fill="rgba(255,255,255,0.6)" d="M14.298 27.202l-3.87-3.87c0.701-0.929 1.122-2.081 1.122-3.332 0-3.06-2.489-5.55-5.55-5.55s-5.55 2.49-5.55 5.55 2.49 5.55 5.55 5.55c1.251 0 2.403-0.421 3.332-1.122l3.87 3.87c0.151 0.151 0.35 0.228 0.549 0.228s0.398-0.077 0.549-0.228c0.301-0.301 0.301-0.787-0.002-1.096zM1.55 20c0-2.454 1.997-4.45 4.45-4.45s4.45 1.996 4.45 4.45-1.997 4.45-4.45 4.45-4.45-1.996-4.45-4.45z"/>
          </svg>
          <input 
            ref={inputRef}
            type="text" 
            className="search-input" 
            placeholder="Search apple.com"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-close" onClick={onClose}>
            <svg viewBox="0 0 14 44" width="14" height="44">
              <path fill="rgba(255,255,255,0.6)" d="M12.31 12.31l-1.41-1.41L7 14.79l-3.9-3.89-1.41 1.41L5.59 16.2l-3.9 3.9 1.41 1.41L7 17.61l3.9 3.9 1.41-1.41L8.41 16.2z"/>
            </svg>
          </button>
        </div>
        
        <div className="search-content">
          <div className="quick-links">
            <h3 className="quick-links-title">Quick Links</h3>
            <div className="quick-links-list">
              <Link href="#" className="quick-link">
                <svg className="quick-link-icon" viewBox="0 0 16 16">
                  <path fill="currentColor" d="M8 0L0 8l8 8 8-8L8 0zm0 14.5L1.5 8 8 1.5 14.5 8 8 14.5z"/>
                </svg>
                Find a Store
              </Link>
              <Link href="#" className="quick-link">
                <svg className="quick-link-icon" viewBox="0 0 16 16">
                  <path fill="currentColor" d="M8 0L0 8l8 8 8-8L8 0zm0 14.5L1.5 8 8 1.5 14.5 8 8 14.5z"/>
                </svg>
                Linkist Vision Pro
              </Link>
              <Link href="#" className="quick-link">
                <svg className="quick-link-icon" viewBox="0 0 16 16">
                  <path fill="currentColor" d="M8 0L0 8l8 8 8-8L8 0zm0 14.5L1.5 8 8 1.5 14.5 8 8 14.5z"/>
                </svg>
                Card Holders
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(20px);
          z-index: 10000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
        }

        .search-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .search-container {
          max-width: 692px;
          margin: 0 auto;
          padding: 64px 32px 32px;
        }

        .search-input-wrapper {
          position: relative;
          margin-bottom: 40px;
        }

        .search-input-icon {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 24px;
          height: 24px;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          color: rgba(255, 255, 255, 0.92);
          font-size: 40px;
          font-weight: 400;
          padding: 16px 60px 16px 40px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .search-input:focus {
          border-bottom-color: rgba(255, 255, 255, 0.6);
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .search-close {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }

        .search-close:hover {
          opacity: 0.7;
        }

        .search-close svg {
          width: 20px;
          height: 20px;
        }

        .search-content {
          margin-top: 60px;
        }

        .quick-links-title {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 24px;
          margin-top: 0;
        }

        .quick-links-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .quick-link {
          display: flex;
          align-items: center;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 14px;
          font-weight: 400;
          padding: 8px 0;
          transition: color 0.3s ease;
        }

        .quick-link:hover {
          color: rgba(255, 255, 255, 1);
        }

        .quick-link-icon {
          width: 6px;
          height: 6px;
          margin-right: 12px;
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

// Bag Overlay Component
const BagOverlay: React.FC<BagOverlayProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, mounted]);

  return (
    <div className={`bag-overlay ${isOpen ? 'active' : ''}`} onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="bag-container">
        <div className="bag-header">
          <h2 className="bag-title">Your Bag is empty.</h2>
          <button className="bag-close" onClick={onClose}>
            <svg viewBox="0 0 14 44" width="14" height="44">
              <path fill="rgba(255,255,255,0.6)" d="M12.31 12.31l-1.41-1.41L7 14.79l-3.9-3.89-1.41 1.41L5.59 16.2l-3.9 3.9 1.41 1.41L7 17.61l3.9 3.9 1.41-1.41L8.41 16.2z"/>
            </svg>
          </button>
        </div>
        
        <div className="bag-content">
          <p className="bag-signin-text">
            <Link href="#" className="bag-signin-link">Sign in</Link> to see if you have any saved items
          </p>
          
          <div className="bag-profile-section">
            <h3 className="bag-profile-title">My Profile</h3>
            <div className="bag-profile-links">
              <Link href="#" className="bag-profile-link">
                <svg className="bag-profile-icon" viewBox="0 0 16 16" width="16" height="16">
                  <path fill="currentColor" d="M8 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM2 13a6 6 0 1 1 12 0v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z"/>
                </svg>
                Orders
              </Link>
              <Link href="#" className="bag-profile-link">
                <svg className="bag-profile-icon" viewBox="0 0 16 16" width="16" height="16">
                  <path fill="currentColor" d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 6L8 9.5 4.5 6 8 2.5 11.5 6z"/>
                </svg>
                Your Saves
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .bag-overlay {
          position: fixed;
          top: 0;
          right: 0;
          width: 375px;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(20px);
          z-index: 10000;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.6, 1);
        }

        .bag-overlay.active {
          transform: translateX(0);
        }

        .bag-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 44px 24px 24px;
        }

        .bag-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          padding-top: 20px;
        }

        .bag-title {
          color: rgba(255, 255, 255, 0.92);
          font-size: 32px;
          font-weight: 600;
          margin: 0;
          line-height: 1.125;
        }

        .bag-close {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          margin-top: -8px;
          margin-right: -8px;
          transition: opacity 0.3s ease;
        }

        .bag-close:hover {
          opacity: 0.7;
        }

        .bag-close svg {
          width: 20px;
          height: 20px;
        }

        .bag-content {
          flex: 1;
        }

        .bag-signin-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-weight: 400;
          margin-bottom: 48px;
          line-height: 1.42857;
        }

        .bag-signin-link {
          color: #0071e3;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .bag-signin-link:hover {
          color: #0077ed;
        }

        .bag-profile-section {
          margin-top: 48px;
        }

        .bag-profile-title {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 24px;
          margin-top: 0;
        }

        .bag-profile-links {
          display: flex;
          flex-direction: column;
        }

        .bag-profile-link {
          display: flex;
          align-items: center;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 14px;
          font-weight: 400;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: color 0.3s ease;
        }

        .bag-profile-link:hover {
          color: rgba(255, 255, 255, 1);
        }

        .bag-profile-link:last-child {
          border-bottom: none;
        }

        .bag-profile-icon {
          width: 16px;
          height: 16px;
          margin-right: 12px;
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};


// Premium Card Component
const PremiumCard: React.FC<PremiumCardProps> = ({ className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateY = mouseX / 10;
    const rotateX = -mouseY / 10;
    
    cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  }, []);

  const handleClick = useCallback(() => {
    if (!cardRef.current) return;
    
    // Trigger premium card animation
    cardRef.current.style.animation = 'none';
    cardRef.current.offsetHeight; // Trigger reflow
    cardRef.current.style.animation = 'cardActivation 1.5s ease-out';
    
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.style.animation = '';
      }
    }, 1500);
  }, []);

  return (
    <div className={`premium-card ${className}`}>
      <div 
        ref={cardRef}
        className="premium-card-inner"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {}}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="card-layer card-layer-1"></div>
        <div className="card-layer card-layer-2"></div>
        <div className="card-layer card-layer-3"></div>
        <div className="card-chip"></div>
        <div className="card-bank">DOSH</div>
        <div className="card-number">0000 0000 0000 0000</div>
        <div className="card-expiry">Expiry: 01/22</div>
        <div className="card-cvv">CVV: 000</div>
        <div className="card-name">Mr Luke Bailey</div>
      </div>

      <style jsx>{`
        .premium-card {
          display: flex;
          position: relative;
          flex-direction: column;
          width: 400px;
          height: 250px;
          border-radius: 15px;
          background: linear-gradient(135deg, 
            #d4af37 0%, 
            #f4d03f 15%, 
            #e8c547 30%,
            #cd853f 50%,
            #b8860b 70%,
            #daa520 85%,
            #cd853f 100%);
          margin: 0;
          padding: 40px;
          transition: all 2s ease;
          transform-style: preserve-3d;
          animation: card-isometric 10s infinite;
          cursor: pointer;
          box-shadow: 
            0 25px 50px rgba(205, 133, 63, 0.3),
            0 15px 25px rgba(212, 175, 55, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .premium-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .card-layer {
          position: absolute;
          border-radius: 15px;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }

        .card-layer-1 {
          transform: translateX(0px) translateY(0) translateZ(30px);
          background: rgba(212, 175, 55, 0.6);
          border: 2px solid rgba(218, 165, 32, 0.5);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
        }

        .card-layer-2 {
          transform: translateX(0px) translateY(0) translateZ(60px);
          background: rgba(205, 133, 63, 0.4);
          border: 2px solid rgba(218, 165, 32, 0.5);
          box-shadow: 0 0 15px rgba(205, 133, 63, 0.2);
        }

        .card-layer-3 {
          transform: translateX(0px) translateY(0) translateZ(90px);
          background: rgba(184, 134, 11, 0.2);
          border: 2px solid rgba(218, 165, 32, 0.5);
          box-shadow: 0 0 10px rgba(184, 134, 11, 0.1);
        }

        .card-bank {
          position: absolute;
          top: 40px;
          right: 40px;
          text-align: right;
          font-size: 3em;
          font-weight: bold;
          line-height: 1em;
          color: #2c1810;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
          transform: translateX(0px) translateY(0px) translateZ(65px);
        }

        .card-chip {
          position: absolute;
          left: 40px;
          top: 40px;
          width: 60px;
          height: 40px;
          border-radius: 15px;
          border: none;
          background-image: url('data:image/svg+xml,%3Csvg%20id%3D%22Layer_1%22%20data-name%3D%22Layer%201%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2082.6%2054.2%22%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill%3A%23f9e75e%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Ctitle%3Ecardchip%3C%2Ftitle%3E%3Cpath%20class%3D%22cls-1%22%20d%3D%22M82.6%2011.7V3.5A3.54%203.54%200%200%200%2079.1%200H56l-4.4%204.4a1.49%201.49%200%200%201-.9.4%201.22%201.22%200%200%201-.9-.4%201.27%201.27%200%200%201%200-1.8L52.4%200H30.2l11.1%2011.2%203.8-3.8a1.27%201.27%200%200%201%201.8%201.8l-4.4%204.4v6.6a1.32%201.32%200%200%201-1.3%201.3H33v11.7h16.4V17.7a1.22%201.22%200%200%201%20.4-.9l4.7-4.7a1.49%201.49%200%200%201%20.9-.4z%22%2F%3E%3Cpath%20class%3D%22cls-1%22%20d%3D%22M82.6%2025.9V14.2H56l-4%204v7.7h30.6zM82.6%2040V28.4H52V36l4%204h26.6z%22%2F%3E%3Cpath%20class%3D%22cls-1%22%20d%3D%22M55.5%2042.5a1.22%201.22%200%200%201-.9-.4l-4.7-4.7a1.49%201.49%200%200%201-.4-.9v-1.1h-6.9v5.3L56%2054.1h23.1a3.54%203.54%200%200%200%203.5-3.5v-8.2H55.5z%22%2F%3E%3Cpath%20class%3D%22cls-1%22%20d%3D%22M30.2%2054.2h22.3L41.3%2043l-3.8%203.8a1.49%201.49%200%200%201-.9.4%201.22%201.22%200%200%201-.9-.4%201.27%201.27%200%200%201%200-1.8l4.4-4.4v-5.3h-6.9v1.1a1.22%201.22%200%200%201-.4.9L28.1%2042a1.49%201.49%200%200%201-.9.4H.1v8.2a3.54%203.54%200%200%200%203.5%203.5h23.1l4.4-4.4a1.27%201.27%200%200%201%201.8%201.8z%22%2F%3E%3Cpath%20class%3D%22cls-1%22%20d%3D%22M.1%2028.4V40h26.5l4-4v-7.6H.1zM26.6%2014.2H.1v11.7h30.5v-7.7l-4-4z%22%2F%3E%3Cpath%20class%3D%22cls-1%22%20d%3D%22M26.6%200H3.5A3.54%203.54%200%200%200%200%203.5v8.2h27.1a1.22%201.22%200%200%201%20.9.4l4.7%204.7a1.49%201.49%200%200%201%20.4.9v1.1H40v-5.3z%22%2F%3E%3C%2Fsvg%3E');
          transform: translateX(0px) translateY(0px) translateZ(65px);
        }

        .card-number {
          color: #2c1810;
          width: 100%;
          text-align: left;
          font-size: 2.19em;
          margin: auto;
          font-family: 'Courier New', monospace;
          font-weight: 500;
          letter-spacing: 2px;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
          transform: translateX(0px) translateY(0px) translateZ(95px);
        }

        .card-name {
          position: absolute;
          bottom: 40px;
          left: 40px;
          text-transform: uppercase;
          font-size: 1.5em;
          margin-top: 20px;
          color: #2c1810;
          font-family: 'Courier New', monospace;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
          transform: translateX(0px) translateY(0px) translateZ(35px);
        }

        .card-expiry {
          position: absolute;
          bottom: 90px;
          left: 40px;
          text-transform: uppercase;
          color: #2c1810;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
          transform: translateX(0px) translateY(0px) translateZ(35px);
        }

        .card-cvv {
          position: absolute;
          bottom: 90px;
          left: 240px;
          text-transform: uppercase;
          color: #2c1810;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
          transform: translateX(0px) translateY(0px) translateZ(35px);
        }

        @keyframes card-isometric {
          0% {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
          50% {
            transform: rotateX(60deg) rotateY(0deg) rotateZ(-45deg);
          }
          100% {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
        }

        @keyframes cardActivation {
          0% { 
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1); 
            filter: brightness(1);
          }
          25% { 
            transform: rotateX(30deg) rotateY(15deg) rotateZ(-10deg) scale(1.1); 
            filter: brightness(1.3);
          }
          50% { 
            transform: rotateX(60deg) rotateY(0deg) rotateZ(-45deg) scale(1.05); 
            filter: brightness(1.5);
          }
          75% { 
            transform: rotateX(30deg) rotateY(-15deg) rotateZ(-10deg) scale(1.1); 
            filter: brightness(1.3);
          }
          100% { 
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1); 
            filter: brightness(1);
          }
        }

        @media (max-width: 768px) {
          .premium-card {
            width: 350px;
            height: 220px;
            padding: 30px;
          }

          .card-bank {
            font-size: 2.5em;
          }

          .card-number {
            font-size: 1.8em;
          }
        }

        @media (max-width: 480px) {
          .premium-card {
            width: 300px;
            height: 190px;
            padding: 25px;
          }

          .card-bank {
            font-size: 2em;
          }


          .card-number {
            font-size: 1.5em;
          }
        }
      `}</style>
    </div>
  );
};

// Highlights Section Component
const HighlightsSection: React.FC = () => {

  return (
    <section className="highlights-section reveal">
      
      {/* Animated Background Logo */}
      <div className="background-logo">
        <img src="/logo_linkist.png" alt="" className="floating-logo" />
      </div>

      {/* Shower Animation */}
      <div className="shower-container">
        <div className="rain-drop" style={{left: '5%', animationDelay: '0s', animationDuration: '4s'}}></div>
        <div className="rain-drop" style={{left: '12%', animationDelay: '1s', animationDuration: '5s'}}></div>
        <div className="rain-drop" style={{left: '18%', animationDelay: '0.5s', animationDuration: '3.5s'}}></div>
        <div className="rain-drop" style={{left: '25%', animationDelay: '2s', animationDuration: '4.5s'}}></div>
        <div className="rain-drop" style={{left: '32%', animationDelay: '0.8s', animationDuration: '3.8s'}}></div>
        <div className="rain-drop" style={{left: '38%', animationDelay: '1.5s', animationDuration: '5.2s'}}></div>
        <div className="rain-drop" style={{left: '45%', animationDelay: '0.3s', animationDuration: '4.2s'}}></div>
        <div className="rain-drop" style={{left: '52%', animationDelay: '2.2s', animationDuration: '3.7s'}}></div>
        <div className="rain-drop" style={{left: '58%', animationDelay: '1.2s', animationDuration: '4.8s'}}></div>
        <div className="rain-drop" style={{left: '65%', animationDelay: '0.7s', animationDuration: '5.5s'}}></div>
        <div className="rain-drop" style={{left: '72%', animationDelay: '1.8s', animationDuration: '3.9s'}}></div>
        <div className="rain-drop" style={{left: '78%', animationDelay: '0.4s', animationDuration: '4.6s'}}></div>
        <div className="rain-drop" style={{left: '85%', animationDelay: '2.5s', animationDuration: '4.1s'}}></div>
        <div className="rain-drop" style={{left: '92%', animationDelay: '1.1s', animationDuration: '5.3s'}}></div>
        <div className="rain-drop" style={{left: '15%', animationDelay: '3s', animationDuration: '4.4s'}}></div>
        <div className="rain-drop" style={{left: '35%', animationDelay: '2.8s', animationDuration: '3.6s'}}></div>
        <div className="rain-drop" style={{left: '55%', animationDelay: '1.9s', animationDuration: '5.1s'}}></div>
        <div className="rain-drop" style={{left: '75%', animationDelay: '0.6s', animationDuration: '4.3s'}}></div>
        <div className="rain-drop" style={{left: '88%', animationDelay: '2.7s', animationDuration: '3.4s'}}></div>
        <div className="rain-drop" style={{left: '8%', animationDelay: '1.4s', animationDuration: '4.9s'}}></div>
      </div>
      
      <div className="section-header">
        <h2 className="section-title">
          Tap. Connect.<br />
          Be remembered.
        </h2>
        <p className="section-subtitle floating-subtitle">Your smart NFC business card for the digital era. The last business card you'll ever need.</p>
      </div>
      
      {/* Clean NFC Card */}
      <div className="nfc-card-container">
        <div className="nfc-card">
          <img 
            src="/card_flip.gif" 
            alt="Linkist NFC Card" 
            className="card-video"
          />
          <div className="card-glow"></div>
        </div>
      </div>


      <style jsx>{`
        .highlights-section {
          min-height: 60vh;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          position: relative;
          border-bottom-left-radius: 50px;
          border-bottom-right-radius: 50px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
          z-index: 10;
          position: relative;
        }

        .section-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          color: #000000;
          margin-bottom: 20px;
          line-height: 1.1;
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: #666666;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .floating-subtitle {
          animation: floatAnimation 3s ease-in-out infinite;
        }

        @keyframes floatAnimation {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .nfc-card-container {
          position: relative;
          z-index: 10;
          margin: 60px 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .nfc-card {
          position: relative;
          width: 1000px;
          height: 630px;
          border-radius: 25px;
          overflow: hidden;
          background: transparent;
          box-shadow: 
            0 30px 60px rgba(0,0,0,0.15),
            0 15px 25px rgba(0,0,0,0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: cardFloat 6s ease-in-out infinite;
          cursor: pointer;
          padding: 0px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nfc-card:hover {
          transform: translateY(-15px) scale(1.02) rotateY(5deg);
          box-shadow: 
            0 40px 80px rgba(0,0,0,0.3),
            0 25px 35px rgba(0,0,0,0.2);
        }

        .card-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.4s ease;
          border-radius: 25px;
          background: transparent;
          display: block;
        }

        .card-video::-webkit-media-controls {
          display: none !important;
        }

        .card-video::-moz-media-controls {
          display: none !important;
        }

        .card-glow {
          position: absolute;
          top: -50px;
          left: -50px;
          right: -50px;
          bottom: -50px;
          background: linear-gradient(
            45deg,
            rgba(66, 165, 245, 0.1) 0%,
            rgba(129, 199, 132, 0.1) 25%,
            rgba(255, 193, 7, 0.1) 50%,
            rgba(240, 98, 146, 0.1) 75%,
            rgba(156, 39, 176, 0.1) 100%
          );
          border-radius: 35px;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: -1;
        }

        .nfc-card:hover .card-glow {
          opacity: 1;
        }

        @keyframes cardFloat {
          0%, 100% {
            transform: translateY(0px) rotateX(0deg);
          }
          50% {
            transform: translateY(-8px) rotateX(2deg);
          }
        }

        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1) rotate(0deg);
            opacity: 0.1;
          }
          25% {
            transform: translateY(-20px) translateX(10px) scale(1.05) rotate(1deg);
            opacity: 0.15;
          }
          50% {
            transform: translateY(-10px) translateX(-15px) scale(0.95) rotate(-1deg);
            opacity: 0.12;
          }
          75% {
            transform: translateY(-30px) translateX(5px) scale(1.02) rotate(0.5deg);
            opacity: 0.18;
          }
        }

        .background-logo {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          pointer-events: none;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .floating-logo {
          width: 600px;
          height: auto;
          opacity: 0.1;
          animation: logoFloat 15s ease-in-out infinite;
          filter: grayscale(30%) brightness(0.8);
          mix-blend-mode: multiply;
        }

        @keyframes rainFall {
          0% {
            transform: translateY(-50px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100vh + 50px));
            opacity: 0;
          }
        }

        .shower-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
          overflow: hidden;
        }

        .rain-drop {
          position: absolute;
          top: -50px;
          width: 16px;
          height: 16px;
          background-image: url('/favicon-16x16.png');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          animation: rainFall linear infinite;
          will-change: transform;
          opacity: 0.8;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
        }

        .rain-drop:nth-child(odd) {
          filter: hue-rotate(180deg) brightness(1.2);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
        }

        .rain-drop:nth-child(3n) {
          width: 12px;
          height: 12px;
        }

        .rain-drop:nth-child(5n) {
          width: 20px;
          height: 20px;
        }

        .features-list {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin: 40px 0;
          flex-wrap: wrap;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #333333;
          font-size: 1rem;
          font-weight: 500;
        }

        .feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background: #10B981;
          color: white;
          border-radius: 50%;
          font-size: 12px;
          font-weight: bold;
        }

        .cta-container {
          margin-top: 40px;
          display: flex;
          gap: 15px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          text-align: center;
        }

        .cta-button {
          border: none;
          padding: 16px 32px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 160px;
        }

        .cta-button.primary {
          background: #DC2626;
          color: white;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
        }

        .cta-button.primary:hover {
          background: #B91C1C;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
        }

        .cta-button.secondary {
          background: transparent;
          color: #333333;
          border: 2px solid #E5E7EB;
        }

        .cta-button.secondary:hover {
          background: #F9FAFB;
          border-color: #9CA3AF;
          transform: translateY(-2px);
        }

        .cta-button:active {
          transform: translateY(0px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nfc-card {
            width: 800px;
            height: 504px;
            padding: 0px;
          }
          
          .card-video {
            max-width: 800px;
          }
          
          .section-title {
            font-size: 2.5rem;
          }

          .highlights-section {
            padding: 80px 20px;
            border-bottom-left-radius: 40px;
            border-bottom-right-radius: 40px;
          }

          .features-list {
            gap: 30px;
            margin: 30px 0;
          }

          .cta-button {
            padding: 14px 28px;
            font-size: 1rem;
            min-width: 140px;
          }

          .cta-container {
            gap: 12px;
          }

          .floating-logo {
            width: 400px;
            opacity: 0.08;
          }

          .rain-drop:nth-child(n+16) {
            display: none;
          }

          .rain-drop {
            width: 12px;
            height: 12px;
          }

          .rain-drop:nth-child(3n) {
            width: 10px;
            height: 10px;
          }

          .rain-drop:nth-child(5n) {
            width: 16px;
            height: 16px;
          }
        }

        @media (max-width: 480px) {
          .nfc-card {
            width: 600px;
            height: 378px;
            padding: 0px;
          }

          .card-video {
            max-width: 600px;
          }

          .nfc-card:hover {
            transform: translateY(-10px) scale(1.01);
          }
          
          .section-title {
            font-size: 2rem;
            line-height: 1.2;
          }

          .highlights-section {
            padding: 60px 15px;
            border-bottom-left-radius: 30px;
            border-bottom-right-radius: 30px;
          }

          .section-subtitle {
            font-size: 1rem;
          }

          .features-list {
            flex-direction: column;
            gap: 20px;
            margin: 25px 0;
            align-items: center;
          }

          .feature-item {
            font-size: 0.9rem;
          }

          .cta-container {
            flex-direction: column;
            gap: 10px;
          }

          .cta-button {
            width: 100%;
            max-width: 280px;
            padding: 12px 24px;
            font-size: 0.95rem;
          }

          .floating-logo {
            width: 300px;
            opacity: 0.06;
          }

          .rain-drop:nth-child(n+11) {
            display: none;
          }

          .rain-drop {
            width: 10px;
            height: 10px;
          }

          .rain-drop:nth-child(3n) {
            width: 8px;
            height: 8px;
          }

          .rain-drop:nth-child(5n) {
            width: 14px;
            height: 14px;
          }

        }
      `}</style>
    </section>
  );
};

// Simple Design Section Component
const SimpleDesignSection: React.FC = () => {
  return (
    <section className="design-section reveal">
      {/* Floating Logo Icons */}
      <div className="floating-logos">
        <div className="floating-logo" style={{left: '10%', top: '20%', animationDelay: '0s'}}>
          <img src="/favicon-16x16.png" alt="Linkist" />
        </div>
        <div className="floating-logo" style={{left: '85%', top: '15%', animationDelay: '2s'}}>
          <img src="/favicon-16x16.png" alt="Linkist" />
        </div>
        <div className="floating-logo" style={{left: '20%', top: '70%', animationDelay: '4s'}}>
          <img src="/favicon-16x16.png" alt="Linkist" />
        </div>
        <div className="floating-logo" style={{left: '90%', top: '75%', animationDelay: '1s'}}>
          <img src="/favicon-16x16.png" alt="Linkist" />
        </div>
        <div className="floating-logo" style={{left: '15%', top: '45%', animationDelay: '3s'}}>
          <img src="/favicon-16x16.png" alt="Linkist" />
        </div>
        <div className="floating-logo" style={{left: '80%', top: '40%', animationDelay: '5s'}}>
          <img src="/favicon-16x16.png" alt="Linkist" />
        </div>
      </div>

      {/* Rain Effect */}
      <div className="rain-container">
        <div className="rain-drop" style={{left: '5%', animationDelay: '0s', animationDuration: '4s'}}></div>
        <div className="rain-drop" style={{left: '12%', animationDelay: '1s', animationDuration: '3.5s'}}></div>
        <div className="rain-drop" style={{left: '18%', animationDelay: '0.5s', animationDuration: '4.2s'}}></div>
        <div className="rain-drop" style={{left: '25%', animationDelay: '2s', animationDuration: '3.8s'}}></div>
        <div className="rain-drop" style={{left: '32%', animationDelay: '0.8s', animationDuration: '4.5s'}}></div>
        <div className="rain-drop" style={{left: '38%', animationDelay: '1.5s', animationDuration: '3.2s'}}></div>
        <div className="rain-drop" style={{left: '45%', animationDelay: '0.3s', animationDuration: '4.8s'}}></div>
        <div className="rain-drop" style={{left: '52%', animationDelay: '2.2s', animationDuration: '3.6s'}}></div>
        <div className="rain-drop" style={{left: '58%', animationDelay: '1.2s', animationDuration: '4.1s'}}></div>
        <div className="rain-drop" style={{left: '65%', animationDelay: '0.7s', animationDuration: '3.9s'}}></div>
        <div className="rain-drop" style={{left: '72%', animationDelay: '1.8s', animationDuration: '4.3s'}}></div>
        <div className="rain-drop" style={{left: '78%', animationDelay: '0.4s', animationDuration: '3.7s'}}></div>
        <div className="rain-drop" style={{left: '85%', animationDelay: '2.5s', animationDuration: '4.6s'}}></div>
        <div className="rain-drop" style={{left: '92%', animationDelay: '1.1s', animationDuration: '3.3s'}}></div>
        <div className="rain-drop" style={{left: '15%', animationDelay: '3s', animationDuration: '4.4s'}}></div>
        <div className="rain-drop" style={{left: '35%', animationDelay: '2.8s', animationDuration: '3.6s'}}></div>
        <div className="rain-drop" style={{left: '55%', animationDelay: '1.9s', animationDuration: '4.7s'}}></div>
        <div className="rain-drop" style={{left: '75%', animationDelay: '0.6s', animationDuration: '3.4s'}}></div>
        <div className="rain-drop" style={{left: '88%', animationDelay: '2.7s', animationDuration: '4.0s'}}></div>
        <div className="rain-drop" style={{left: '8%', animationDelay: '1.4s', animationDuration: '3.1s'}}></div>
      </div>
      
      <div className="design-content">
        <div className="design-header">
          <p className="design-label">Design</p>
          <h2 className="design-title">Linkist Card.<br />Makes a strong case for itself.</h2>
          <p className="design-description">
            Introducing Linkist Card, designed from the inside out to be the most powerful payment card ever made. 
            At the core of the new design is a premium aluminum construction that maximizes security, durability, and style.
          </p>
        </div>
        
        <div className="linkist-card-display">
          <CardShowcase />
        </div>
      </div>

      <style jsx>{`
        .design-section {
          min-height: 70vh;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          position: relative;
          border-bottom-left-radius: 50px;
          border-bottom-right-radius: 50px;
        }

        .design-content {
          max-width: 1200px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .design-header {
          color: #000000;
        }

        .design-label {
          font-size: 1rem;
          color: #007aff;
          font-weight: 500;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .design-title {
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 700;
          margin-bottom: 30px;
          line-height: 1.2;
          background: linear-gradient(135deg, #000000 0%, #007aff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .design-description {
          font-size: 1.2rem;
          line-height: 1.7;
          color: #666666;
          max-width: 500px;
        }

        .linkist-card-display {
          position: relative;
          width: 500px;
          height: 312px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: visible;
        }

        .linkist-glow {
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          background: radial-gradient(circle, rgba(0, 122, 255, 0.3) 0%, transparent 70%);
          border-radius: 30px;
          animation: glowPulse 3s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        .linkist-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          animation: cardFloat 4s ease-in-out infinite;
        }

        @keyframes cardFloat {
          0%, 100% {
            transform: rotateY(5deg) rotateX(5deg) translateY(0px);
          }
          50% {
            transform: rotateY(-5deg) rotateX(-5deg) translateY(-10px);
          }
        }

        .linkist-card-front,
        .linkist-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 15px;
          background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 25px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .linkist-card-back {
          transform: rotateY(180deg);
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: #ffffff;
          font-weight: 500;
        }

        .linkist-chip {
          width: 40px;
          height: 30px;
          background: linear-gradient(145deg, #ffd700, #ffed4e);
          border-radius: 5px;
          position: relative;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .linkist-chip::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 20px;
          background: repeating-linear-gradient(
            90deg,
            #daa520 0px,
            #daa520 2px,
            #ffd700 2px,
            #ffd700 4px
          );
          border-radius: 2px;
        }

        .linkist-logo {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: auto;
        }

        .logo-icon {
          display: flex;
          gap: 5px;
        }

        .link-circle {
          width: 20px;
          height: 20px;
          border: 2px solid #007aff;
          border-radius: 50%;
          animation: linkPulse 2s ease-in-out infinite;
        }

        .link-circle:nth-child(2) {
          animation-delay: 0.5s;
        }

        @keyframes linkPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 1px;
        }

        @media (max-width: 768px) {
          .design-content {
            grid-template-columns: 1fr;
            gap: 60px;
            text-align: center;
          }

          .linkist-card-display {
            width: 400px;
            height: 250px;
          }

          .design-section {
            padding: 80px 15px;
          }
        }

        /* Rain Effect Styles */
        .rain-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .rain-drop {
          position: absolute;
          bottom: 0;
          width: 3px;
          height: 40px;
          background: linear-gradient(to top, 
            rgba(255, 0, 0, 0.8) 0%,
            rgba(255, 69, 0, 0.7) 25%,
            rgba(255, 140, 0, 0.6) 50%,
            rgba(255, 215, 0, 0.4) 75%,
            transparent 100%
          );
          border-radius: 2px;
          animation: flowUpward linear infinite;
          filter: blur(0.5px);
        }

        .rain-drop:nth-child(odd) {
          background: linear-gradient(to top, 
            rgba(255, 20, 20, 0.7) 0%,
            rgba(255, 100, 20, 0.6) 30%,
            rgba(255, 180, 50, 0.5) 60%,
            rgba(255, 220, 100, 0.3) 80%,
            transparent 100%
          );
          animation-delay: 0.5s;
        }

        .rain-drop:nth-child(even) {
          background: linear-gradient(to top, 
            rgba(255, 40, 0, 0.8) 0%,
            rgba(255, 120, 30, 0.7) 25%,
            rgba(255, 200, 80, 0.5) 50%,
            rgba(255, 240, 150, 0.3) 75%,
            transparent 100%
          );
          animation-delay: 1s;
        }

        @keyframes flowUpward {
          0% {
            transform: translateY(0) scaleY(0.5);
            opacity: 0;
          }
          20% {
            opacity: 1;
            transform: translateY(-20vh) scaleY(1);
          }
          80% {
            opacity: 0.8;
            transform: translateY(-80vh) scaleY(1.2);
          }
          100% {
            transform: translateY(-120vh) scaleY(0.3);
            opacity: 0;
          }
        }

        /* Floating Logo Icons */
        .floating-logos {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .floating-logo {
          position: absolute;
          opacity: 0.6;
          animation: float 8s ease-in-out infinite;
        }

        .floating-logo img {
          width: 24px;
          height: 24px;
          display: block;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-10px) rotate(-3deg);
            opacity: 1;
          }
          75% {
            transform: translateY(-15px) rotate(2deg);
            opacity: 0.7;
          }
        }
      `}</style>
    </section>
  );
};

// How It Works Section Component
const HowItWorksSection: React.FC = () => {
  return (
    <section className="how-it-works-section">
      <div className="how-it-works-content">
        <h2 className="how-it-works-title">How It Works</h2>
        <p className="how-it-works-subtitle">Three simple steps to elevate your networking game.</p>
        
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon">🎨</div>
            <h3 className="step-title">1. Design Your Card</h3>
           
          </div>
          
          <div className="step-card">
            <div className="step-icon">💳</div>
            <h3 className="step-title">2. Place Your Order</h3>
            <p className="step-description">
              Complete your purchase through our checkout. We accept all major cards and Apple Pay.
            </p>
          </div>
          
          <div className="step-card">
            <div className="step-icon">🚀</div>
            <h3 className="step-title">3. Tap & Connect</h3>
            <p className="step-description">
              Receive your card and start networking. A simple tap to a smartphone shares your profile.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .how-it-works-section {
          padding: 100px 20px;
          background: #000000;
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .how-it-works-content {
          max-width: 1200px;
          width: 100%;
          text-align: center;
        }

        .how-it-works-title {
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 700;
          margin-bottom: 15px;
          color: #ffffff;
        }

        .how-it-works-subtitle {
          font-size: 1.2rem;
          color: #cccccc;
          margin-bottom: 60px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          margin-top: 60px;
        }

        .step-card {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          padding: 40px 30px;
          border-radius: 25px;
          text-align: center;
          transition: all 0.4s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .step-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 0, 0, 0.1) 0%, rgba(255, 100, 0, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          border-radius: 25px;
        }

        .step-card:hover::before {
          opacity: 1;
        }

        .step-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 25px 50px rgba(255, 0, 0, 0.2);
          border: 1px solid rgba(255, 0, 0, 0.3);
        }

        .step-icon {
          font-size: 2.5rem;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #ff0000 0%, #ff3333 50%, #ff6666 100%);
          border-radius: 20px;
          margin: 0 auto 20px;
          position: relative;
          z-index: 2;
          box-shadow: 0 10px 25px rgba(255, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .step-card:hover .step-icon {
          transform: scale(1.1) rotateY(10deg);
          box-shadow: 0 15px 35px rgba(255, 0, 0, 0.5);
        }

        .step-title {
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 15px;
          color: #ffffff;
          position: relative;
          z-index: 2;
        }

        .step-description {
          color: #cccccc;
          line-height: 1.6;
          font-size: 1rem;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 768px) {
          .how-it-works-section {
            padding: 80px 15px;
          }

          .steps-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .step-card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </section>
  );
};

// What You Get Section Component
const WhatYouGetSection: React.FC = () => {
  return (
    <section className="what-you-get-section">
      <div className="what-you-get-content">
        {/* 3D Animated Card */}
        <div className="what-you-get-image">
          <div className="card-3d-container">
            <img src="/card_flip.gif" alt="NFC Card Demo" />
          </div>
        </div>

        {/* Text Section */}
        <div className="what-you-get-text">
          <h2 className="what-you-get-title">What You Get</h2>
          <p className="what-you-get-subtitle">
            Pro results down to the pixel.
          </p>

          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon"></div>
              <div className="feature-content">
                <h3>Premium NFC Card</h3>
                <p>
                  A durable, high-quality card with your custom design and
                  embedded NFC technology.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon"></div>
              <div className="feature-content">
                <h3>Personal Linkist Profile</h3>
                <p>
                  A customizable online profile to host all your links, contact
                  info, and social media.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon"></div>
              <div className="feature-content">
                <h3>Real-time Analytics</h3>
                <p>
                  Track how many taps your card gets and see which links are
                  performing best.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon"></div>
              <div className="feature-content">
                <h3>Global Compatibility</h3>
                <p>
                  Works with all modern iOS and Android smartphones, no app
                  required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .what-you-get-section {
          padding: 80px 20px;
          background: #f8f9fa;
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .what-you-get-content {
          max-width: 1200px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .card-3d-container {
          perspective: 1000px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .what-you-get-image img {
          width: 100%;
          max-width: 500px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          transform-style: preserve-3d;
          animation: cardFloat 6s infinite ease-in-out;
          transition: transform 0.3s ease;
        }

        .what-you-get-image:hover img {
          animation-play-state: paused;
          transform: rotateY(15deg) rotateX(-10deg) scale(1.05);
        }

        @keyframes cardFloat {
          0% {
            transform: rotateY(-5deg) rotateX(-2deg) scale(1);
          }
          25% {
            transform: rotateY(5deg) rotateX(-5deg) scale(1.02);
          }
          50% {
            transform: rotateY(10deg) rotateX(2deg) scale(1.03);
          }
          75% {
            transform: rotateY(-3deg) rotateX(4deg) scale(1.02);
          }
          100% {
            transform: rotateY(-5deg) rotateX(-2deg) scale(1);
          }
        }

        .what-you-get-title {
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 700;
          margin-bottom: 10px;
          color: #1a1a1a;
        }

        .what-you-get-subtitle {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 40px;
          font-weight: 500;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .feature-item {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .feature-icon {
          width: 12px;
          height: 12px;
          background: #ff0000;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .feature-content h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 5px;
          color: #1a1a1a;
        }

        .feature-content p {
          color: #666;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .what-you-get-content {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }

          .what-you-get-section {
            padding: 60px 15px;
          }
        }
      `}</style>
    </section>
  );
};

// Design Section Component
const DesignSection: React.FC = () => {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Auto flip card every 5 seconds
    const flipInterval = setInterval(() => {
      setIsCardFlipped(prev => !prev);
    }, 5000);



    return () => {
      clearInterval(flipInterval);
    };
  }, [mounted]);

  const handleCardClick = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateY = (mouseX / rect.width) * 25;
    const rotateX = -(mouseY / rect.height) * 25;
    
    // Enhanced 3D tilt with shadow
    cardRef.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`;
    cardRef.current.style.filter = 'brightness(1.1) contrast(1.1)';
    cardRef.current.style.boxShadow = `
      ${mouseX * 0.1}px ${mouseY * 0.1}px 40px rgba(0, 122, 255, 0.4),
      ${mouseX * 0.05}px ${mouseY * 0.05}px 80px rgba(0, 122, 255, 0.2),
      0 0 100px rgba(0, 122, 255, 0.15)
    `;
    
    // Parallax effect for different layers
    const cardImage = cardRef.current.querySelector('.card-image') as HTMLElement;
    const reflectionSweep = cardRef.current.querySelector('.card-reflection-sweep') as HTMLElement;
    const holographicPattern = cardRef.current.querySelector('.holographic-pattern') as HTMLElement;
    
    if (cardImage) {
      cardImage.style.transform = `translateX(${mouseX * 0.02}px) translateY(${mouseY * 0.02}px) scale(1.02)`;
    }
    
    if (reflectionSweep) {
      reflectionSweep.style.opacity = '0.8';
      reflectionSweep.style.transform = `translateX(${mouseX * 0.05}px) translateY(${mouseY * 0.05}px)`;
    }
    
    if (holographicPattern) {
      holographicPattern.style.opacity = '0.6';
      holographicPattern.style.transform = `translateX(${mouseX * -0.03}px) translateY(${mouseY * -0.03}px)`;
    }
  };

  const handleCardLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      cardRef.current.style.filter = 'brightness(1) contrast(1)';
      cardRef.current.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
      
      // Reset parallax layers
      const cardImage = cardRef.current.querySelector('.card-image') as HTMLElement;
      const reflectionSweep = cardRef.current.querySelector('.card-reflection-sweep') as HTMLElement;
      const holographicPattern = cardRef.current.querySelector('.holographic-pattern') as HTMLElement;
      
      if (cardImage) {
        cardImage.style.transform = '';
      }
      
      if (reflectionSweep) {
        reflectionSweep.style.opacity = '';
        reflectionSweep.style.transform = '';
      }
      
      if (holographicPattern) {
        holographicPattern.style.opacity = '';
        holographicPattern.style.transform = '';
      }
    }
  };

  return (
    <section className="design-section reveal">
      
      {/* Geometric Background Elements */}
      <div className="geometric-bg">
        <div className="geo-shape geo-circle"></div>
        <div className="geo-shape geo-triangle"></div>
        <div className="geo-shape geo-square"></div>
      </div>


      <div className="design-content">
        <div className="linkist-card-3d-container">
          
          {/* Enhanced 3D Card */}
          <div 
            ref={cardRef}
            className="linkist-card-3d"
            onMouseMove={handleCardHover}
            onMouseLeave={handleCardLeave}
            onClick={handleCardClick}
          >
            {/* Video Background */}
            <video className="linkist-video" autoPlay muted loop playsInline>
              <source src="/video_linkist.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Multiple Glow Layers */}
            <div className="linkist-glow primary-glow"></div>
            <div className="linkist-glow secondary-glow"></div>
            <div className="linkist-glow accent-glow"></div>
            
            {/* Card Reflection */}
            <div className="card-reflection"></div>
          </div>
          
        </div>
        
        <div className="design-header">
          <p className="design-label">🎨 Revolutionary Design</p>
          <h2 className="design-title">
            Linkist Card.<br />
            <span className="title-highlight">Redefining Premium Banking</span>
          </h2>
          <p className="design-description">
            Experience the future of financial technology with Linkist Card. Crafted with aerospace-grade aluminum and 
            featuring quantum-encrypted security, this isn't just a payment card—it's a statement of innovation and sophistication.
          </p>
          

          {/* Interactive Controls */}
        </div>
      </div>

      <style jsx>{`
        .design-section {
          min-height: 100vh;
          background: radial-gradient(ellipse at top, #0a0a0f 0%, #000000 50%, #0a0a0a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 20px;
          position: relative;
          overflow: hidden;
        }


        .geometric-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
        }

        .geo-shape {
          position: absolute;
          opacity: 0.1;
          animation: geometricFloat 8s ease-in-out infinite;
        }

        .geo-circle {
          width: 200px;
          height: 200px;
          border: 2px solid #007aff;
          border-radius: 50%;
          top: 20%;
          right: 10%;
        }

        .geo-triangle {
          width: 0;
          height: 0;
          border-left: 75px solid transparent;
          border-right: 75px solid transparent;
          border-bottom: 130px solid #00ff87;
          top: 60%;
          left: 5%;
          animation-delay: 2s;
        }

        .geo-square {
          width: 100px;
          height: 100px;
          background: linear-gradient(45deg, #ff0080, #ff8c00);
          transform: rotate(45deg);
          bottom: 20%;
          right: 20%;
          animation-delay: 4s;
        }

        @keyframes geometricFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }

        .design-content {
          max-width: 1400px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 100px;
          align-items: center;
          z-index: 10;
          position: relative;
        }

        .design-header {
          color: #ffffff;
        }

        .design-label {
          font-size: 1.1rem;
          color: #007aff;
          font-weight: 600;
          margin-bottom: 25px;
          text-transform: uppercase;
          letter-spacing: 3px;
          animation: labelGlow 2s ease-in-out infinite alternate;
        }

        @keyframes labelGlow {
          0% {
            text-shadow: 0 0 10px rgba(0, 122, 255, 0.5);
          }
          100% {
            text-shadow: 0 0 20px rgba(0, 122, 255, 0.8);
          }
        }

        .design-title {
          font-size: clamp(2.8rem, 5vw, 4.2rem);
          font-weight: 800;
          margin-bottom: 40px;
          line-height: 1.1;
          background: linear-gradient(135deg, #ffffff 0%, #007aff 50%, #00ff87 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: titleShimmer 3s ease-in-out infinite;
        }

        .title-highlight {
          display: block;
          background: linear-gradient(135deg, #ff0080 0%, #ff8c00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 0.8em;
          margin-top: 10px;
        }

        @keyframes titleShimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .design-description {
          font-size: 1.25rem;
          line-height: 1.8;
          color: #b8b8b8;
          max-width: 550px;
          margin-bottom: 40px;
        }



        .linkist-card-3d-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .linkist-card-3d {
          position: relative;
          width: 800px;
          height: 500px;
          perspective: 1200px;
          margin: 0 auto;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 25px;
          border: 2px solid rgba(0, 122, 255, 0.3);
          overflow: hidden;
          box-shadow: 0 0 30px rgba(0, 122, 255, 0.2);
        }


        .primary-glow {
          position: absolute;
          top: -30px;
          left: -30px;
          right: -30px;
          bottom: -30px;
          background: radial-gradient(circle, rgba(0, 122, 255, 0.4) 0%, transparent 70%);
          border-radius: 35px;
          animation: primaryGlow 3s ease-in-out infinite;
        }

        .secondary-glow {
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          background: radial-gradient(circle, rgba(0, 255, 135, 0.3) 0%, transparent 60%);
          border-radius: 30px;
          animation: secondaryGlow 2s ease-in-out infinite reverse;
        }

        .accent-glow {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: radial-gradient(circle, rgba(255, 0, 128, 0.2) 0%, transparent 50%);
          border-radius: 25px;
          animation: accentGlow 4s ease-in-out infinite;
        }

        @keyframes primaryGlow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1) rotate(180deg);
          }
        }

        @keyframes secondaryGlow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1.05) rotate(0deg);
          }
          50% {
            opacity: 0.6;
            transform: scale(0.95) rotate(-180deg);
          }
        }

        @keyframes accentGlow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.9) rotate(0deg);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.15) rotate(360deg);
          }
        }

        .linkist-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.23, 1, 0.320, 1);
          transform-style: preserve-3d;
        }

        .linkist-card-inner.flipped {
          transform: rotateY(180deg);
        }

        .linkist-card-front,
        .linkist-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 20px;
          background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 50%, #1a1a2e 100%);
          border: 2px solid rgba(0, 122, 255, 0.3);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 30px;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        .linkist-card-back {
          transform: rotateY(180deg);
          background: linear-gradient(135deg, #2a2a3e 0%, #1e1e2e 50%, #2a2a3e 100%);
        }

        .linkist-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 18px;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          will-change: transform, filter, opacity;
          transform: translateZ(0) translate3d(0, 0, 0);
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 18px;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          will-change: transform, filter, opacity;
          transform: translateZ(0) translate3d(0, 0, 0);
          backface-visibility: hidden;
          transform-style: preserve-3d;
          animation: cardFloatBreath 4s ease-in-out infinite,
                     cardShimmer 6s linear infinite;
        }

        .card-reflection-sweep {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 25%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0.1) 75%,
            transparent 100%
          );
          border-radius: 18px;
          animation: reflectionSweep 8s ease-in-out infinite;
          z-index: 3;
        }

        .card-ambient-glow {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: radial-gradient(
            ellipse at center,
            rgba(0, 122, 255, 0.2) 0%,
            rgba(0, 122, 255, 0.1) 30%,
            transparent 70%
          );
          border-radius: 28px;
          animation: ambientPulse 5s ease-in-out infinite;
          z-index: 0;
        }

        .linkist-chip {
          width: 50px;
          height: 38px;
          background: linear-gradient(145deg, #ffd700, #ffed4e, #daa520);
          border-radius: 8px;
          position: relative;
          box-shadow: 
            inset 0 2px 4px rgba(0, 0, 0, 0.3),
            0 4px 8px rgba(255, 215, 0, 0.3);
          animation: chipGlow 3s ease-in-out infinite;
        }

        @keyframes chipGlow {
          0%, 100% {
            box-shadow: 
              inset 0 2px 4px rgba(0, 0, 0, 0.3),
              0 4px 8px rgba(255, 215, 0, 0.3);
          }
          50% {
            box-shadow: 
              inset 0 2px 4px rgba(0, 0, 0, 0.3),
              0 4px 15px rgba(255, 215, 0, 0.6);
          }
        }

        .chip-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 35px;
          height: 25px;
          background: repeating-linear-gradient(
            90deg,
            #daa520 0px,
            #daa520 2px,
            #ffd700 2px,
            #ffd700 4px
          );
          border-radius: 3px;
        }

        .chip-contacts {
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 2px;
          background: #b8860b;
          border-radius: 1px;
        }

        .nfc-symbol {
          position: absolute;
          top: 30px;
          right: 30px;
          width: 40px;
          height: 40px;
        }

        .nfc-wave {
          position: absolute;
          border: 2px solid #007aff;
          border-radius: 50%;
          animation: nfcPulse 2s ease-in-out infinite;
        }

        .nfc-wave:nth-child(1) {
          width: 15px;
          height: 15px;
          top: 12px;
          left: 12px;
        }

        .nfc-wave:nth-child(2) {
          width: 25px;
          height: 25px;
          top: 7px;
          left: 7px;
          animation-delay: 0.3s;
        }

        .nfc-wave:nth-child(3) {
          width: 35px;
          height: 35px;
          top: 2px;
          left: 2px;
          animation-delay: 0.6s;
        }

        @keyframes nfcPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.2);
          }
        }

        .linkist-logo {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: auto;
        }

        .logo-icon {
          display: flex;
          gap: 8px;
          position: relative;
        }

        .link-circle {
          width: 25px;
          height: 25px;
          border: 3px solid #007aff;
          border-radius: 50%;
          animation: linkPulse 2s ease-in-out infinite;
        }

        .link-circle.primary {
          border-color: #007aff;
        }

        .link-circle.secondary {
          border-color: #00ff87;
          animation-delay: 0.5s;
        }

        .connecting-line {
          position: absolute;
          top: 50%;
          left: 15px;
          width: 25px;
          height: 3px;
          background: linear-gradient(90deg, #007aff, #00ff87);
          transform: translateY(-50%);
          animation: lineGlow 2s ease-in-out infinite;
        }

        @keyframes lineGlow {
          0%, 100% {
            opacity: 0.6;
            transform: translateY(-50%) scaleX(1);
          }
          50% {
            opacity: 1;
            transform: translateY(-50%) scaleX(1.2);
          }
        }

        @keyframes linkPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
        }

        .logo-text {
          font-size: 1.8rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 2px;
          text-shadow: 0 0 10px rgba(0, 122, 255, 0.5);
        }

        .logo-tagline {
          font-size: 0.9rem;
          color: #007aff;
          font-weight: 600;
          margin-left: -15px;
          opacity: 0.8;
        }

        .card-number {
          display: flex;
          justify-content: space-between;
          font-family: 'Courier New', monospace;
          font-size: 1.4rem;
          font-weight: 600;
          color: #ffffff;
          margin: 20px 0;
          letter-spacing: 2px;
        }

        .number-group {
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
        }

        .holographic-pattern {
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(0, 122, 255, 0.1) 50%,
            transparent 70%
          );
          animation: holographicShift 4s ease-in-out infinite;
          z-index: 2;
        }

        @keyframes holographicShift {
          0%, 100% {
            transform: translateX(100px);
            opacity: 0;
          }
          50% {
            transform: translateX(-100px);
            opacity: 1;
          }
        }

        @keyframes cardFloatBreath {
          0%, 100% {
            transform: translate3d(0, 0px, 0) scale(1) rotateZ(0deg);
          }
          25% {
            transform: translate3d(0, -8px, 0) scale(1.02) rotateZ(0.5deg);
          }
          50% {
            transform: translate3d(0, 0px, 0) scale(1.03) rotateZ(0deg);
          }
          75% {
            transform: translate3d(0, -4px, 0) scale(1.01) rotateZ(-0.5deg);
          }
        }

        @keyframes cardShimmer {
          0% {
            filter: brightness(1) saturate(1) hue-rotate(0deg);
          }
          25% {
            filter: brightness(1.1) saturate(1.1) hue-rotate(5deg);
          }
          50% {
            filter: brightness(1.05) saturate(1.05) hue-rotate(10deg);
          }
          75% {
            filter: brightness(1.15) saturate(1.2) hue-rotate(5deg);
          }
          100% {
            filter: brightness(1) saturate(1) hue-rotate(0deg);
          }
        }

        @keyframes reflectionSweep {
          0%, 20% {
            left: -100%;
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          80%, 100% {
            left: 100%;
            opacity: 0;
          }
        }

        @keyframes ambientPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        @keyframes fieldRotation {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.02);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes magneticFieldPulse {
          0%, 100% {
            opacity: 0.2;
            stroke-width: 1;
          }
          50% {
            opacity: 0.6;
            stroke-width: 2;
          }
        }

        .magnetic-stripe {
          width: 100%;
          height: 40px;
          background: linear-gradient(90deg, #333, #111, #333);
          margin-bottom: 20px;
          border-radius: 3px;
        }

        .signature-panel {
          background: #f5f5f5;
          color: #333;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 20px;
          font-size: 0.9rem;
          text-align: center;
        }

        .security-features {
          display: flex;
          justify-content: space-between;
          align-items: end;
        }

        .cvv-section {
          text-align: right;
        }

        .cvv-label {
          display: block;
          font-size: 0.8rem;
          color: #999;
          margin-bottom: 5px;
        }

        .cvv-number {
          font-family: 'Courier New', monospace;
          font-size: 1.2rem;
          font-weight: bold;
          color: #fff;
        }

        .bank-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
          font-size: 0.9rem;
          color: #ccc;
        }

        .back-pattern {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 122, 255, 0.1),
            transparent
          );
        }

        .card-reflection {
          position: absolute;
          bottom: -100%;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(30, 30, 46, 0.3) 0%,
            transparent 70%
          );
          transform: scaleY(-1);
          border-radius: 20px;
          opacity: 0.6;
        }

        
        
        
        
        
        
        
        
        
        
        
        



        @media (max-width: 768px) {
          .design-content {
            grid-template-columns: 1fr;
            gap: 80px;
            text-align: center;
          }


          .linkist-card-3d {
            width: 640px;
            height: 400px;
          }

          .design-section {
            padding: 80px 15px;
          }




          .animated-card-container {
            padding: 60px 20px;
            min-height: 350px;
            perspective: 1200px;
          }

          .animated-card {
            width: 320px;
            height: 200px;
          }

          .animated-card .bank {
            font-size: 20px;
            top: 25px;
            right: 25px;
          }

          .animated-card .number {
            font-size: 16px;
            bottom: 25px;
            left: 25px;
            letter-spacing: 2px;
          }

          .animated-card .chip {
            width: 45px;
            height: 35px;
            top: 25px;
            left: 25px;
          }

          .animated-card .chip::before {
            width: 32px;
            height: 22px;
          }

          @keyframes card-isometric {
            0% {
              transform: rotateX(-8deg) rotateY(-12deg) rotateZ(0deg);
            }
            25% {
              transform: rotateX(-12deg) rotateY(20deg) rotateZ(-2deg);
            }
            50% {
              transform: rotateX(12deg) rotateY(-8deg) rotateZ(2deg);
            }
            75% {
              transform: rotateX(-8deg) rotateY(-20deg) rotateZ(-1deg);
            }
            100% {
              transform: rotateX(-8deg) rotateY(-12deg) rotateZ(0deg);
            }
          }
        }

        /* 3D Animated Credit Card Styles */
        .animated-card-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 500px;
          perspective: 1500px;
          perspective-origin: center center;
          margin: 80px 0;
          will-change: transform;
          transform: translateZ(0);
        }

        .animated-card {
          position: relative;
          width: 400px;
          height: 250px;
          transform-style: preserve-3d;
          animation: card-isometric 8s ease-in-out infinite;
          cursor: pointer;
          transition: all 0.4s ease;
          transform-origin: center center;
        }

        .animated-card:hover {
          animation-play-state: paused;
          transform: rotateX(-15deg) rotateY(25deg) rotateZ(5deg) scale(1.1);
        }

        .animated-card .card-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 25px;
          box-sizing: border-box;
          backdrop-filter: blur(10px);
          transition: all 0.4s ease;
        }

        .animated-card .card-layer-1 {
          transform: translateZ(5px);
          background: linear-gradient(135deg, 
            #ffd700 0%, 
            #ffed4e 15%, 
            #f4d03f 30%,
            #e8c547 50%,
            #cd853f 70%,
            #b8860b 85%,
            #daa520 100%);
          border: 3px solid rgba(218, 165, 32, 0.8);
          box-shadow: 
            0 30px 60px rgba(205, 133, 63, 0.5),
            0 20px 35px rgba(212, 175, 55, 0.4),
            0 10px 20px rgba(184, 134, 11, 0.3),
            inset 0 3px 6px rgba(255, 255, 255, 0.5),
            inset 0 -3px 6px rgba(0, 0, 0, 0.3);
        }

        .animated-card .card-layer-2 {
          transform: translateZ(25px);
          background: linear-gradient(135deg, 
            #ffd700 0%, 
            #ffed4e 20%, 
            #f4d03f 40%,
            #cd853f 60%,
            #b8860b 80%,
            #daa520 100%);
          border: 3px solid rgba(218, 165, 32, 0.7);
          box-shadow: 
            0 25px 50px rgba(205, 133, 63, 0.4),
            0 15px 30px rgba(212, 175, 55, 0.3),
            0 8px 15px rgba(184, 134, 11, 0.2),
            inset 0 3px 6px rgba(255, 255, 255, 0.4),
            inset 0 -3px 6px rgba(0, 0, 0, 0.2);
        }

        .animated-card .card-layer-3 {
          transform: translateZ(45px);
          background: linear-gradient(135deg, 
            #ffd700 0%, 
            #ffed4e 25%, 
            #f4d03f 50%,
            #cd853f 75%,
            #daa520 100%);
          border: 3px solid rgba(218, 165, 32, 0.6);
          box-shadow: 
            0 20px 40px rgba(205, 133, 63, 0.3),
            0 12px 25px rgba(212, 175, 55, 0.25),
            0 6px 12px rgba(184, 134, 11, 0.15),
            inset 0 3px 6px rgba(255, 255, 255, 0.3),
            inset 0 -3px 6px rgba(0, 0, 0, 0.1);
        }

        .animated-card .chip {
          position: absolute;
          top: 35px;
          left: 35px;
          width: 55px;
          height: 42px;
          background: linear-gradient(145deg, 
            #ffd700 0%, 
            #ffed4e 20%, 
            #f4d03f 40%,
            #daa520 60%,
            #b8860b 80%,
            #cd853f 100%);
          border-radius: 10px;
          z-index: 50;
          box-shadow: 
            0 8px 16px rgba(255, 215, 0, 0.4),
            0 4px 8px rgba(218, 165, 32, 0.3),
            inset 0 3px 6px rgba(255, 255, 255, 0.4),
            inset 0 -3px 6px rgba(0, 0, 0, 0.3);
          transform: translateZ(60px);
        }

        .animated-card .chip::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 28px;
          background: repeating-linear-gradient(
            90deg,
            #b8860b 0px,
            #b8860b 3px,
            #daa520 3px,
            #daa520 6px,
            #ffd700 6px,
            #ffd700 9px
          );
          border-radius: 4px;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .animated-card .bank {
          position: absolute;
          top: 35px;
          right: 35px;
          color: #2c1810;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 3px;
          text-shadow: 
            0 2px 4px rgba(255, 255, 255, 0.3),
            0 1px 2px rgba(0, 0, 0, 0.5);
          z-index: 50;
          transform: translateZ(60px);
          background: linear-gradient(45deg, 
            #8b4513 0%,
            #a0522d 25%,
            #cd853f 50%,
            #d2691e 75%,
            #8b4513 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .animated-card .number {
          position: absolute;
          bottom: 35px;
          left: 35px;
          color: #2c1810;
          font-family: 'Courier New', monospace;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 4px;
          text-shadow: 
            0 2px 4px rgba(255, 255, 255, 0.3),
            0 1px 2px rgba(0, 0, 0, 0.4);
          z-index: 50;
          transform: translateZ(60px);
        }

        /* Add metallic shine overlay */
        .animated-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0.1) 25%,
            rgba(255, 255, 255, 0) 50%,
            rgba(255, 255, 255, 0.1) 75%,
            rgba(255, 255, 255, 0.2) 100%
          );
          border-radius: 20px;
          pointer-events: none;
          z-index: 100;
          transform: translateZ(70px);
          animation: metallic-shine 3s ease-in-out infinite;
        }

        @keyframes metallic-shine {
          0%, 100% {
            opacity: 0.6;
            transform: translateZ(70px) translateX(0%) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: translateZ(70px) translateX(10%) rotate(2deg);
          }
        }

        @keyframes card-isometric {
          0% {
            transform: rotateX(-10deg) rotateY(-15deg) rotateZ(0deg);
          }
          12.5% {
            transform: rotateX(-15deg) rotateY(10deg) rotateZ(3deg);
          }
          25% {
            transform: rotateX(-5deg) rotateY(25deg) rotateZ(-2deg);
          }
          37.5% {
            transform: rotateX(10deg) rotateY(20deg) rotateZ(1deg);
          }
          50% {
            transform: rotateX(15deg) rotateY(-5deg) rotateZ(-3deg);
          }
          62.5% {
            transform: rotateX(5deg) rotateY(-20deg) rotateZ(2deg);
          }
          75% {
            transform: rotateX(-10deg) rotateY(-25deg) rotateZ(-1deg);
          }
          87.5% {
            transform: rotateX(-20deg) rotateY(-10deg) rotateZ(3deg);
          }
          100% {
            transform: rotateX(-10deg) rotateY(-15deg) rotateZ(0deg);
          }
        }
      `}</style>
    </section>
  );
};

// Pro Camera Results Section Component
const ProResultsSection: React.FC = () => {
  return (
    <section className="pro-results-section reveal">
      <div className="pro-results-content">
        <h2 className="pro-results-title">Pro results down to the pixel.</h2>
        
        <ZoomCard />
      </div>

      <style jsx>{`
        .pro-results-section {
          min-height: 60vh;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 20px;
          position: relative;
        }

        .pro-results-content {
          max-width: 1200px;
          width: 100%;
          text-align: center;
        }

        .pro-results-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 80px;
          background: linear-gradient(135deg, #ffffff 0%, #007aff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .results-showcase {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          margin-bottom: 80px;
        }

        .result-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 30px;
          border: 1px solid rgba(0, 122, 255, 0.2);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .result-card:hover {
          transform: translateY(-10px);
          border-color: rgba(0, 122, 255, 0.5);
          box-shadow: 0 20px 40px rgba(0, 122, 255, 0.2);
        }

        .result-image {
          width: 100%;
          height: 300px;
          border-radius: 15px;
          margin-bottom: 30px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .purple-gradient {
          background: linear-gradient(135deg, #6a0dad 0%, #4b0082 50%, #1e1e2e 100%);
        }

        .demo-scene {
          position: relative;
          width: 200px;
          height: 200px;
        }

        .staircase {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 80px;
          background: linear-gradient(135deg, #333 0%, #555 100%);
          clip-path: polygon(0% 100%, 25% 75%, 50% 50%, 75% 25%, 100% 0%, 100% 100%);
          animation: staircaseGlow 3s ease-in-out infinite;
        }

        @keyframes staircaseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(106, 13, 173, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(106, 13, 173, 0.6);
          }
        }

        .person {
          position: absolute;
          top: 30px;
          right: 40px;
          width: 30px;
          height: 60px;
          background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
          border-radius: 15px 15px 5px 5px;
          animation: personGlow 2s ease-in-out infinite alternate;
        }

        .person::before {
          content: '';
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 20px;
          background: #ffffff;
          border-radius: 50%;
        }

        @keyframes personGlow {
          0% {
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
          }
          100% {
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
          }
        }

        .portrait-demo {
          position: relative;
          width: 150px;
          height: 200px;
        }

        .model-silhouette {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #2a2a3e 0%, #1e1e2e 100%);
          border-radius: 10px;
          position: relative;
          border: 2px solid rgba(0, 122, 255, 0.3);
          animation: silhouetteGlow 3s ease-in-out infinite;
        }

        @keyframes silhouetteGlow {
          0%, 100% {
            border-color: rgba(0, 122, 255, 0.3);
            box-shadow: 0 0 20px rgba(0, 122, 255, 0.2);
          }
          50% {
            border-color: rgba(0, 122, 255, 0.6);
            box-shadow: 0 0 40px rgba(0, 122, 255, 0.4);
          }
        }

        .hair-detail {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          height: 40px;
          background: linear-gradient(135deg, #007aff 0%, #00ff87 100%);
          border-radius: 20px 20px 0 0;
          animation: hairDetailShine 2s ease-in-out infinite alternate;
        }

        @keyframes hairDetailShine {
          0% {
            opacity: 0.6;
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        .result-description {
          text-align: left;
        }

        .result-description h4 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 15px;
          background: linear-gradient(135deg, #ffffff 0%, #007aff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .result-description p {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #a1a1aa;
        }

        .compare-cameras-results {
          background: linear-gradient(135deg, #007aff 0%, #00ff87 100%);
          border: none;
          color: #ffffff;
          padding: 18px 40px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 122, 255, 0.3);
        }

        .compare-cameras-results:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 122, 255, 0.5);
          background: linear-gradient(135deg, #0056d6 0%, #00cc6a 100%);
        }

        .compare-cameras-results:active {
          transform: translateY(0px);
        }

        @media (max-width: 768px) {
          .results-showcase {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .result-image {
            height: 250px;
          }

          .demo-scene,
          .portrait-demo {
            transform: scale(0.8);
          }

          .pro-results-section {
            padding: 80px 15px;
          }

          .result-description {
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
};

// Center Stage Section Component
const CenterStageSection: React.FC = () => {
  return (
    <section className="center-stage-section reveal">
      {/* Backend Technology Flowing Curves Background */}
      <div className="backend-curves-bg">
        <svg className="backend-curve-svg backend-curve-1" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,350 C250,150 550,550 850,300 C1000,200 1200,400 1200,250 L1200,0 L0,0 Z" 
                fill="url(#backendGradient1)" opacity="0.25"/>
          <defs>
            <linearGradient id="backendGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#007AFF" stopOpacity="0.5"/>
              <stop offset="50%" stopColor="#0056CC" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#003D99" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
        </svg>
        
        <svg className="backend-curve-svg backend-curve-2" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
          <path d="M200,650 C400,450 700,750 1000,550 C1150,450 1200,650 1200,500 L1200,800 L200,800 Z" 
                fill="url(#backendGradient2)" opacity="0.2"/>
          <defs>
            <linearGradient id="backendGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0080FF" stopOpacity="0.4"/>
              <stop offset="50%" stopColor="#0066DD" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="#004AAA" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="backend-curve-svg backend-curve-3" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,450 C180,250 480,600 780,400 C930,300 1200,500 1200,350 L1200,800 L0,800 Z" 
                fill="url(#backendGradient3)" opacity="0.18"/>
          <defs>
            <linearGradient id="backendGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00AAFF" stopOpacity="0.35"/>
              <stop offset="50%" stopColor="#0088EE" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#0055BB" stopOpacity="0.08"/>
            </linearGradient>
          </defs>
        </svg>
        
        <svg className="backend-curve-svg backend-curve-4" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
          <path d="M300,280 C500,80 700,480 900,230 C1050,130 1200,330 1200,180 L1200,0 L300,0 Z" 
                fill="url(#backendGradient4)" opacity="0.15"/>
          <defs>
            <linearGradient id="backendGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0099FF" stopOpacity="0.3"/>
              <stop offset="50%" stopColor="#0077EE" stopOpacity="0.18"/>
              <stop offset="100%" stopColor="#0044AA" stopOpacity="0.08"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="center-stage-content">
        <div className="center-stage-text">
          <h2 className="center-stage-title">Advanced Security Technology.<br />It's a total game changer.</h2>
          
          <p className="center-stage-description">
            The new Linkist Card gives you flexible ways to manage your finances — and so 
            much more. Tap to expand your spending limits and switch from savings to checking <strong>without 
            changing your card.</strong> And when family joins your account, the benefits expand so you get 
            more rewards in your transactions.
          </p>
        </div>
        
        <div className="center-stage-demo">
          <div className="phone-demo-container">
            <div className="demo-phone">
              <div className="phone-screen">
                <div className="camera-viewfinder">
                  <div className="demo-people">
                    <div className="person person-1"></div>
                    <div className="person person-2"></div>
                  </div>
                  <div className="expand-indicator"></div>
                </div>
              </div>
              <div className="home-indicator"></div>
            </div>
          </div>
          
          <button className="compare-cameras-front">Compare Linkist Cards +</button>
        </div>
      </div>

      <style jsx>{`
        .center-stage-section {
          min-height: 100vh;
          background: radial-gradient(ellipse at bottom, #0a0a0f 0%, #000000 40%, #0a0a0a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 20px;
          position: relative;
          overflow: hidden;
        }

        /* Backend Flowing Curves Styles */
        .backend-curves-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .backend-curve-svg {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .backend-curve-1 {
          animation: backendFlow1 24s ease-in-out infinite;
          transform-origin: center;
        }

        .backend-curve-2 {
          animation: backendFlow2 28s ease-in-out infinite;
          transform-origin: center;
        }

        .backend-curve-3 {
          animation: backendFlow3 20s ease-in-out infinite;
          transform-origin: center;
        }

        .backend-curve-4 {
          animation: backendFlow4 26s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes backendFlow1 {
          0%, 100% {
            transform: translateX(0) translateY(0) scale(1) rotate(0deg);
            opacity: 0.25;
          }
          25% {
            transform: translateX(-30px) translateY(15px) scale(1.08) rotate(1deg);
            opacity: 0.35;
          }
          50% {
            transform: translateX(25px) translateY(-20px) scale(0.92) rotate(-0.5deg);
            opacity: 0.3;
          }
          75% {
            transform: translateX(-15px) translateY(10px) scale(1.05) rotate(0.8deg);
            opacity: 0.32;
          }
        }

        @keyframes backendFlow2 {
          0%, 100% {
            transform: translateX(0) translateY(0) scale(1) rotate(0deg);
            opacity: 0.2;
          }
          30% {
            transform: translateX(35px) translateY(-25px) scale(1.1) rotate(-1.2deg);
            opacity: 0.28;
          }
          60% {
            transform: translateX(-28px) translateY(18px) scale(0.88) rotate(0.9deg);
            opacity: 0.24;
          }
          85% {
            transform: translateX(20px) translateY(-8px) scale(1.06) rotate(-0.6deg);
            opacity: 0.26;
          }
        }

        @keyframes backendFlow3 {
          0%, 100% {
            transform: translateX(0) translateY(0) scale(1) rotate(0deg);
            opacity: 0.18;
          }
          20% {
            transform: translateX(-22px) translateY(30px) scale(1.12) rotate(1.5deg);
            opacity: 0.25;
          }
          50% {
            transform: translateX(32px) translateY(-15px) scale(0.85) rotate(-1deg);
            opacity: 0.22;
          }
          80% {
            transform: translateX(-18px) translateY(12px) scale(1.08) rotate(0.7deg);
            opacity: 0.24;
          }
        }

        @keyframes backendFlow4 {
          0%, 100% {
            transform: translateX(0) translateY(0) scale(1) rotate(0deg);
            opacity: 0.15;
          }
          35% {
            transform: translateX(28px) translateY(22px) scale(1.09) rotate(-1.3deg);
            opacity: 0.22;
          }
          70% {
            transform: translateX(-35px) translateY(-18px) scale(0.91) rotate(1.1deg);
            opacity: 0.19;
          }
        }

        .center-stage-content {
          max-width: 1400px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 100px;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .center-stage-text {
          color: #ffffff;
        }

        .center-stage-title {
          font-size: clamp(2.5rem, 4vw, 3.8rem);
          font-weight: 700;
          margin-bottom: 40px;
          line-height: 1.2;
          background: linear-gradient(135deg, #ffffff 0%, #007aff 50%, #00ff87 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .center-stage-description {
          font-size: 1.25rem;
          line-height: 1.7;
          color: #b8b8b8;
          max-width: 600px;
        }

        .center-stage-description strong {
          color: #ffffff;
          font-weight: 600;
        }

        .center-stage-demo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
        }

        .phone-demo-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .demo-phone {
          width: 280px;
          height: 570px;
          background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
          border-radius: 45px;
          padding: 12px;
          box-shadow: 
            0 0 0 8px rgba(0, 122, 255, 0.1),
            0 25px 50px rgba(0, 0, 0, 0.4);
          position: relative;
          animation: phoneFloat 4s ease-in-out infinite;
        }

        @keyframes phoneFloat {
          0%, 100% {
            transform: translateY(0px) rotateY(5deg);
          }
          50% {
            transform: translateY(-15px) rotateY(-5deg);
          }
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #000000 0%, #0a0a0a 100%);
          border-radius: 35px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .camera-viewfinder {
          width: 90%;
          height: 70%;
          background: linear-gradient(135deg, #1a1a2e 0%, #2a2a3e 100%);
          border-radius: 20px;
          border: 2px solid rgba(0, 122, 255, 0.3);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: viewfinderGlow 3s ease-in-out infinite;
        }

        @keyframes viewfinderGlow {
          0%, 100% {
            border-color: rgba(0, 122, 255, 0.3);
            box-shadow: 0 0 20px rgba(0, 122, 255, 0.2);
          }
          50% {
            border-color: rgba(0, 122, 255, 0.6);
            box-shadow: 0 0 40px rgba(0, 122, 255, 0.4);
          }
        }

        .demo-people {
          position: relative;
          width: 200px;
          height: 150px;
        }

        .person {
          position: absolute;
          width: 60px;
          height: 100px;
          background: linear-gradient(135deg, #007aff 0%, #00ff87 100%);
          border-radius: 30px 30px 10px 10px;
          animation: personPulse 2s ease-in-out infinite;
        }

        .person::before {
          content: '';
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          width: 35px;
          height: 35px;
          background: linear-gradient(135deg, #007aff 0%, #00ff87 100%);
          border-radius: 50%;
        }

        .person-1 {
          left: 40px;
          animation-delay: 0s;
        }

        .person-2 {
          right: 40px;
          animation-delay: 1s;
        }

        @keyframes personPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        .expand-indicator {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          border: 3px solid #00ff87;
          border-radius: 8px;
          animation: expandPulse 3s ease-in-out infinite;
        }

        .expand-indicator::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          background: #00ff87;
          border-radius: 3px;
          animation: indicatorGlow 2s ease-in-out infinite alternate;
        }

        @keyframes expandPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes indicatorGlow {
          0% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }

        .home-indicator {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 140px;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }

        .demo-phone::before {
          content: '';
          position: absolute;
          top: 25px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }

        .demo-phone::after {
          content: '';
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 15px;
          height: 15px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }

        .compare-cameras-front {
          background: linear-gradient(135deg, #007aff 0%, #00ff87 100%);
          border: none;
          color: #ffffff;
          padding: 18px 40px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 122, 255, 0.3);
        }

        .compare-cameras-front:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 122, 255, 0.5);
          background: linear-gradient(135deg, #0056d6 0%, #00cc6a 100%);
        }

        .compare-cameras-front:active {
          transform: translateY(0px);
        }

        @media (max-width: 768px) {
          .center-stage-content {
            grid-template-columns: 1fr;
            gap: 60px;
            text-align: center;
          }

          .demo-phone {
            width: 240px;
            height: 490px;
          }

          .demo-people {
            width: 160px;
            height: 120px;
          }

          .person {
            width: 45px;
            height: 75px;
          }

          .person::before {
            width: 25px;
            height: 25px;
            top: -20px;
          }

          .center-stage-section {
            padding: 80px 15px;
          }

          /* Responsive Backend Curves - Tablet */
          .backend-curves-bg {
            opacity: 0.8;
          }

          .backend-curve-svg {
            transform: scale(0.85);
          }

          .backend-curve-1, .backend-curve-2, .backend-curve-3, .backend-curve-4 {
            animation-duration: 18s;
          }
        }

        @media (max-width: 480px) {
          /* Mobile Backend Curves */
          .backend-curves-bg {
            opacity: 0.6;
          }

          .backend-curve-svg {
            transform: scale(0.7);
          }

          .backend-curve-1, .backend-curve-2, .backend-curve-3, .backend-curve-4 {
            animation-duration: 15s;
          }
        }
      `}</style>
    </section>
  );
};

// Camera Section Component
const CameraSection: React.FC = () => {
  return (
    <section className="camera-section reveal">
      <div className="camera-content">
        <div className="camera-info">
          <p className="camera-label">Cameras</p>
          <h2 className="camera-title">A big zoom forward.</h2>
          
          <div className="camera-specs">
            <div className="spec-item">
              <span className="spec-label">Up to</span>
              <span className="spec-value">8x</span>
              <span className="spec-description">optical-quality zoom</span>
            </div>
            
            <div className="spec-item">
              <span className="spec-label">All</span>
              <span className="spec-value">48MP</span>
              <span className="spec-description">rear cameras</span>
            </div>
          </div>
        </div>
        
        <div className="camera-visual">
          <div className="camera-module-large">
            <div className="large-camera-lens"></div>
            <div className="large-camera-lens"></div>
            <div className="large-camera-lens"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .camera-section {
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 20px;
          position: relative;
          overflow: hidden;
        }

        .camera-content {
          max-width: 1200px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 100px;
          align-items: center;
        }

        .camera-info {
          color: #ffffff;
        }

        .camera-label {
          font-size: 1rem;
          color: #007aff;
          font-weight: 500;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .camera-title {
          font-size: clamp(2.5rem, 4vw, 4rem);
          font-weight: 700;
          margin-bottom: 60px;
          line-height: 1.1;
          background: linear-gradient(135deg, #ffffff 0%, #007aff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .camera-specs {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .spec-item {
          display: flex;
          align-items: baseline;
          gap: 15px;
          flex-wrap: wrap;
        }

        .spec-label {
          font-size: 1.2rem;
          color: #a1a1aa;
          font-weight: 400;
        }

        .spec-value {
          font-size: clamp(3rem, 5vw, 4.5rem);
          font-weight: 700;
          color: #ffffff;
          line-height: 1;
          background: linear-gradient(135deg, #ffffff 0%, #007aff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .spec-description {
          font-size: 1.2rem;
          color: #a1a1aa;
          font-weight: 400;
        }

        .camera-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .camera-module-large {
          position: relative;
          width: 350px;
          height: 350px;
          background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
          border-radius: 50px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 20px;
          padding: 40px;
          box-shadow: 
            0 0 0 1px rgba(255, 255, 255, 0.1),
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 0 50px rgba(0, 122, 255, 0.2);
          animation: cameraFloat 4s ease-in-out infinite;
        }

        @keyframes cameraFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(2deg);
          }
        }

        .camera-module-large::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: linear-gradient(45deg, transparent, rgba(0, 122, 255, 0.3), transparent);
          border-radius: 60px;
          z-index: -1;
          animation: cameraGlow 3s ease-in-out infinite;
        }

        @keyframes cameraGlow {
          0%, 100% {
            opacity: 0.3;
            transform: rotate(0deg);
          }
          50% {
            opacity: 0.8;
            transform: rotate(180deg);
          }
        }

        .large-camera-lens {
          width: 80px;
          height: 80px;
          background: radial-gradient(circle at 30% 30%, #4a4a4a, #1a1a1a);
          border-radius: 50%;
          position: relative;
          border: 3px solid #333333;
          animation: lensRotate 6s linear infinite;
        }

        .large-camera-lens:nth-child(1) {
          animation-delay: 0s;
          width: 100px;
          height: 100px;
        }

        .large-camera-lens:nth-child(2) {
          animation-delay: 2s;
        }

        .large-camera-lens:nth-child(3) {
          animation-delay: 4s;
        }

        @keyframes lensRotate {
          0% {
            transform: rotate(0deg);
            box-shadow: 0 0 20px rgba(0, 122, 255, 0.3);
          }
          50% {
            transform: rotate(180deg);
            box-shadow: 0 0 30px rgba(0, 122, 255, 0.6);
          }
          100% {
            transform: rotate(360deg);
            box-shadow: 0 0 20px rgba(0, 122, 255, 0.3);
          }
        }

        .large-camera-lens::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40%;
          height: 40%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent);
          border-radius: 50%;
        }

        .large-camera-lens::after {
          content: '';
          position: absolute;
          top: 20%;
          left: 20%;
          width: 25%;
          height: 25%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent);
          border-radius: 50%;
          animation: lensFlare 3s ease-in-out infinite;
        }

        @keyframes lensFlare {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }

        @media (max-width: 768px) {
          .camera-content {
            grid-template-columns: 1fr;
            gap: 60px;
            text-align: center;
          }

          .camera-module-large {
            width: 280px;
            height: 280px;
            padding: 30px;
          }

          .large-camera-lens {
            width: 60px;
            height: 60px;
          }

          .large-camera-lens:nth-child(1) {
            width: 80px;
            height: 80px;
          }

          .camera-section {
            padding: 80px 15px;
          }

          .spec-item {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

// Hero Section Component
const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !videoRef.current) return;
    
    const video = videoRef.current;
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    
    const handleLoadedData = () => {
      video.play().catch(console.error);
    };
    
    video.addEventListener('loadeddata', handleLoadedData);
    
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [mounted]);


  return (
    <section className="hero-section">
      <div className="hero-content">
        <video 
          ref={videoRef}
          autoPlay
          muted 
          loop 
          playsInline
          preload="auto"
          className="full-hero-video"
        >
          <source src="/video_linkist2.mp4" type="video/mp4" />
        </video>
      </div>
      
      <style jsx>{`
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding-top: 80px;
          background: radial-gradient(ellipse at center, rgba(20, 20, 20, 0.8) 0%, rgba(0, 0, 0, 0.95) 70%);
        }

        .hero-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 20;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .full-hero-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }


        @media (max-width: 768px) {
          .full-hero-video {
            object-position: center center;
          }
        }
      `}</style>
    </section>
  );
};

// Main HomePage Component
export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / documentHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  if (!mounted) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Scroll Progress */}
      <div 
        className="scroll-progress" 
        style={{ width: `${scrollProgress}%` }}
      />


      {/* Hero Section */}
      <HeroSection />

      {/* Highlights Section */}
      <HighlightsSection />

      {/* Design Section */}
      <DesignSection />

      {/* Simple Design Section */}
      <SimpleDesignSection />

      {/* Pro Camera Results Section */}
      <ProResultsSection />

      {/* Premium Linkist Card Section */}
      <PremiumCardSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* What You Get Section */}
      <WhatYouGetSection />

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-section">
              <h3>Products</h3>
              <ul>
                <li><Link href="#">Linkist Card</Link></li>
                <li><Link href="#">Premium Card</Link></li>
                <li><Link href="#">Business Card</Link></li>
                <li><Link href="#">Student Card</Link></li>
                <li><Link href="#">Family Cards</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Services</h3>
              <ul>
                <li><Link href="#">Banking</Link></li>
                <li><Link href="#">Investments</Link></li>
                <li><Link href="#">Loans</Link></li>
                <li><Link href="#">Insurance</Link></li>
                <li><Link href="#">Rewards Program</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Support</h3>
              <ul>
                <li><Link href="#">Help Center</Link></li>
                <li><Link href="#">Contact Us</Link></li>
                <li><Link href="#">Security</Link></li>
                <li><Link href="#">Card Activation</Link></li>
                <li><Link href="#">Report Fraud</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Company</h3>
              <ul>
                <li><Link href="#">About Linkist</Link></li>
                <li><Link href="#">Careers</Link></li>
                <li><Link href="#">Press</Link></li>
                <li><Link href="#">Investors</Link></li>
                <li><Link href="#">Sustainability</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-logo">Linkist</div>
            <div className="footer-legal">
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
              <Link href="#">Security</Link>
              <Link href="#">Accessibility</Link>
            </div>
            <div className="footer-copyright">
              © 2025 Linkist Inc. All rights reserved. FDIC Insured.
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        /* Linkist Design System Variables */
        :root {
          --apple-orange: #FF8B00;
          --apple-orange-dark: #E67700;
          --apple-blue: #007AFF;
          --apple-purple: #5856D6;
          --apple-green: #34C759;
          --apple-red: #FF3B30;
          --apple-yellow: #FFCC00;
          --apple-pink: #FF2D92;
          --apple-gray: #8E8E93;
          --apple-gray-light: #F2F2F7;
          --apple-gray-dark: #1C1C1E;
          --apple-black: #000000;
          --apple-white: #FFFFFF;
          
          /* Typography */
          --font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          --font-weight-regular: 400;
          --font-weight-medium: 500;
          --font-weight-semibold: 600;
          --font-weight-bold: 700;
          --font-weight-heavy: 800;
          --font-weight-black: 900;
          
          /* Spacing */
          --spacing-xs: 4px;
          --spacing-sm: 8px;
          --spacing-md: 16px;
          --spacing-lg: 24px;
          --spacing-xl: 32px;
          --spacing-xxl: 48px;
          --spacing-xxxl: 64px;
          --spacing-huge: 96px;
          --spacing-massive: 128px;
          
          /* Border Radius */
          --radius-sm: 6px;
          --radius-md: 12px;
          --radius-lg: 18px;
          --radius-xl: 24px;
          --radius-xxl: 32px;
          
          /* Shadows */
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
          --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
          --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
          --shadow-2xl: 0 40px 80px rgba(0, 0, 0, 0.2);
          
          /* Animation */
          --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          --transition-slower: 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Reset and Base Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          overflow-x: hidden;
        }

        body {
          font-family: var(--font-family);
          background: var(--apple-black);
          color: var(--apple-white);
          line-height: 1.6;
          overflow-x: hidden;
        }

        /* Scroll Progress */
        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--apple-orange), var(--apple-blue));
          z-index: 10000;
          transition: width var(--transition-fast);
        }

        /* Premium Card Section */
        .premium-card-section {
          padding: var(--spacing-massive) 0;
          background: linear-gradient(to bottom, #414345, #232526);
          position: relative;
          overflow: hidden;
          font-family: 'Roboto Mono', monospace;
        }

        .card-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-xl);
          display: flex;
          align-items: center;
          gap: var(--spacing-massive);
          position: relative;
        }

        .card-content {
          flex: 1;
          max-width: 600px;
        }

        .card-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: var(--font-weight-heavy);
          color: var(--apple-white);
          line-height: 1.1;
          margin-bottom: var(--spacing-md);
          background: linear-gradient(135deg, 
            var(--apple-white) 0%, 
            var(--apple-orange) 50%, 
            var(--apple-white) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
        }

        .card-subtitle {
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          color: var(--apple-gray);
          margin-bottom: var(--spacing-xl);
          font-weight: var(--font-weight-medium);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
          margin-top: var(--spacing-xl);
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          border: 1px solid rgba(255, 139, 0, 0.2);
          transition: all var(--transition-normal);
          backdrop-filter: blur(10px);
        }

        .feature-item:hover {
          background: rgba(255, 139, 0, 0.1);
          border-color: rgba(255, 139, 0, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 139, 0, 0.2);
        }

        .feature-icon {
          font-size: 24px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--apple-orange) 0%, var(--apple-orange-dark) 100%);
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(255, 139, 0, 0.3);
        }

        .feature-item span {
          font-weight: var(--font-weight-medium);
          color: var(--apple-white);
        }

        /* Footer */
        .footer {
          background: var(--apple-black);
          padding: 60px 0 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 100px;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-lg);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-section h3 {
          color: var(--apple-white);
          font-size: 1.1rem;
          font-weight: var(--font-weight-semibold);
          margin-bottom: 20px;
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-section ul li {
          margin-bottom: 12px;
        }

        .footer-section ul li a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 0.95rem;
          transition: color 0.3s ease;
        }

        .footer-section ul li a:hover {
          color: var(--apple-orange);
        }

        .footer-bottom {
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .footer-logo {
          color: var(--apple-white);
          font-size: 1.5rem;
          font-weight: bold;
        }

        .footer-legal {
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
        }

        .footer-legal a {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .footer-legal a:hover {
          color: var(--apple-orange);
        }

        .footer-copyright {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
          text-align: center;
          width: 100%;
          margin-top: 20px;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .card-container {
            flex-direction: column;
            gap: var(--spacing-xxxl);
            text-align: center;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .premium-card-section {
            padding: var(--spacing-xxxl) 0;
          }

          .card-container {
            padding: 0 var(--spacing-lg);
          }

          .feature-item {
            padding: var(--spacing-md);
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
          
          .footer-legal {
            justify-content: center;
          }
        }

        /* Performance Optimizations */
        .premium-card,
        .premium-card-inner {
          will-change: transform;
          transform: translateZ(0);
        }

        /* High Contrast Mode Support */
        @media (prefers-contrast: high) {
          .feature-icon {
            border: 2px solid currentColor;
          }
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          .premium-card {
            animation: none !important;
          }
          
          .premium-card-inner {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}