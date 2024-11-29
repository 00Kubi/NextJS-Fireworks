'use client';
import { useEffect, useState, useRef } from 'react';

interface FireworkParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  speed: number;
  explosionHeight: number;
  trailLength: number;
  isRocket: boolean;
}

const Firework = () => {
  const [particles, setParticles] = useState<FireworkParticle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = [
    '#ff0000', '#ffa500', '#ffff00', '#00ff00', '#00ffff', 
    '#ff00ff', '#ff4444', '#ff8844', '#ffff44', '#44ff44',
    '#ff88ff', '#ffaa00', '#ff00aa', '#00ffaa', '#aa00ff'
  ];

  const createFirework = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const startX = Math.random() * rect.width;
    const startY = rect.height; // Dolna krawędź widocznego kontenera
    const explosionHeight = Math.random() * (rect.height * 0.6) + rect.height * 0.2;
    
    // Tworzymy rakietę
    const rocket: FireworkParticle = {
      id: Date.now(),
      x: startX,
      y: startY,
      color: '#ffdd44',
      size: 3,
      angle: 0,
      speed: 1,
      explosionHeight,
      trailLength: 1,
      isRocket: true
    };

    setParticles(prev => [...prev, rocket]);

    // Po osiągnięciu wysokości eksplozji, tworzymy cząsteczki
    setTimeout(() => {
      const particleCount = Math.floor(Math.random() * 30) + 40;
      const explosionParticles: FireworkParticle[] = [];
      const mainColor = colors[Math.floor(Math.random() * colors.length)];

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.2);
        const speed = Math.random() * 3 + 1;
        const size = Math.random() * 3 + 1;
        const trailLength = Math.random() * 0.5 + 0.5;

        explosionParticles.push({
          id: Date.now() + i,
          x: startX,
          y: explosionHeight,
          color: mainColor,
          size,
          angle,
          speed,
          explosionHeight,
          trailLength,
          isRocket: false
        });
      }

      setParticles(prev => [...prev.filter(p => p.id !== rocket.id), ...explosionParticles]);

      setTimeout(() => {
        setParticles(prev => prev.filter(p => !explosionParticles.includes(p)));
      }, 2500);
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        createFirework();
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none">
      {particles.map((particle) => {
        if (particle.isRocket) {
          return (
            <div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: particle.color,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}px`,
                bottom: '0px', // Startujemy od dołu
                '--explosion-height': `${particle.explosionHeight}px`,
                animation: 'rocketUp 1s ease-out forwards',
                boxShadow: `0 0 ${particle.size * 4}px ${particle.color}, 0 0 ${particle.size * 8}px ${particle.color}`,
              } as any}
            />
          );
        }

        const spreadX = Math.cos(particle.angle) * (150 * particle.speed);
        const spreadY = Math.sin(particle.angle) * (150 * particle.speed);
        
        return (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: particle.color,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              '--spread-x': `${spreadX}px`,
              '--spread-y': `${spreadY}px`,
              animation: 'explosion 2.5s ease-out forwards',
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}, 0 0 ${particle.size * 4}px ${particle.color}`,
            } as any}
          />
        );
      })}
    </div>
  );
};

export default Firework; 