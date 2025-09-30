export default class PremiumCardController {
  private card: HTMLElement | null = null;
  private particles: HTMLElement[] = [];
  private animationId: number | null = null;

  constructor() {
    this.init();
  }

  init() {
    this.setupPremiumCardInteractions();
    this.createFloatingParticles();
    this.startParticleAnimation();
  }

  setupPremiumCardInteractions() {
    this.card = document.getElementById('linkistCard');
    
    if (!this.card) return;

    // Mouse enter effect
    this.card.addEventListener('mouseenter', () => {
      this.onCardHover();
    });

    // Mouse leave effect
    this.card.addEventListener('mouseleave', () => {
      this.onCardLeave();
    });

    // Mouse move effect for 3D tilt
    this.card.addEventListener('mousemove', (e) => {
      this.onCardMouseMove(e);
    });

    // Click effect
    this.card.addEventListener('click', () => {
      this.onCardClick();
    });
  }

  onCardHover() {
    if (!this.card) return;

    // Add glow effect
    this.card.style.boxShadow = '0 30px 60px rgba(255, 0, 0, 0.4), 0 0 50px rgba(255, 204, 0, 0.3)';
    
    // Trigger particle burst
    this.createParticleBurst();
    
    // Add shimmer effect
    this.addShimmerEffect();
  }

  onCardLeave() {
    if (!this.card) return;

    // Reset transform
    this.card.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
    this.card.style.boxShadow = '';
    
    // Remove shimmer effect
    this.removeShimmerEffect();
  }

  onCardMouseMove(e: MouseEvent) {
    if (!this.card) return;

    const rect = this.card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    this.card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.05)`;
  }

  onCardClick() {
    if (!this.card) return;

    // Click animation
    this.card.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
      if (this.card) {
        this.card.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1.05)';
      }
    }, 150);

    // Create explosion effect
    this.createClickExplosion();
    
    // Show notification
    this.showNotification('Premium Card Activated! 🔥');
  }

  createFloatingParticles() {
    const particlesContainer = document.getElementById('cardParticles');
    if (!particlesContainer) return;

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random positioning
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (3 + Math.random() * 3) + 's';
      
      // Random colors
      const colors = ['#ff0000', '#ff3333', '#ff6666', '#ffcc00'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      particlesContainer.appendChild(particle);
      this.particles.push(particle);
    }
  }

  createParticleBurst() {
    if (!this.card) return;

    const rect = this.card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      particle.style.width = '6px';
      particle.style.height = '6px';
      particle.style.background = '#ff0000';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '1000';
      
      document.body.appendChild(particle);

      const angle = (Math.PI * 2 * i) / 15;
      const velocity = 100 + Math.random() * 100;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      let x = 0;
      let y = 0;
      let opacity = 1;

      const animate = () => {
        x += vx * 0.02;
        y += vy * 0.02;
        opacity -= 0.02;

        particle.style.transform = `translate(${x}px, ${y}px)`;
        particle.style.opacity = opacity.toString();

        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          document.body.removeChild(particle);
        }
      };

      animate();
    }
  }

  createClickExplosion() {
    if (!this.card) return;

    const rect = this.card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create larger explosion particles
    for (let i = 0; i < 25; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      particle.style.width = (4 + Math.random() * 8) + 'px';
      particle.style.height = particle.style.width;
      particle.style.background = i % 2 === 0 ? '#ff0000' : '#ffcc00';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '1001';
      
      document.body.appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const velocity = 150 + Math.random() * 200;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      let x = 0;
      let y = 0;
      let opacity = 1;

      const animate = () => {
        x += vx * 0.015;
        y += vy * 0.015 + 2; // Add gravity
        opacity -= 0.015;

        particle.style.transform = `translate(${x}px, ${y}px)`;
        particle.style.opacity = opacity.toString();

        if (opacity > 0 && y < window.innerHeight) {
          requestAnimationFrame(animate);
        } else {
          if (document.body.contains(particle)) {
            document.body.removeChild(particle);
          }
        }
      };

      animate();
    }
  }

  addShimmerEffect() {
    if (!this.card) return;

    const shimmer = document.createElement('div');
    shimmer.className = 'card-shimmer';
    shimmer.style.cssText = `
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      pointer-events: none;
      z-index: 10;
      animation: shimmer-sweep 1.5s ease-in-out;
    `;

    this.card.appendChild(shimmer);

    setTimeout(() => {
      if (this.card && this.card.contains(shimmer)) {
        this.card.removeChild(shimmer);
      }
    }, 1500);
  }

  removeShimmerEffect() {
    if (!this.card) return;

    const shimmer = this.card.querySelector('.card-shimmer');
    if (shimmer) {
      this.card.removeChild(shimmer);
    }
  }

  showNotification(message: string) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 15px 30px;
      border-radius: 25px;
      border: 2px solid #ff0000;
      font-weight: 600;
      z-index: 10000;
      animation: slideDown 0.3s ease-out;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideUp 0.3s ease-in forwards';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 2000);
  }

  startParticleAnimation() {
    const animate = () => {
      // Update particle positions or any continuous animations
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Clean up particles
    this.particles.forEach(particle => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    this.particles = [];
  }
}