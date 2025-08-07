// Simple particle fallback animation for browsers without WebGL support

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export function createParticleFallback(
  containerId: string
): (() => void) | undefined {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  // Create canvas for 2D
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("2D canvas context not available");
    return;
  }

  // Set canvas size
  const resizeCanvas = () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  };
  resizeCanvas();

  container.appendChild(canvas);

  const particles: Particle[] = [];

  const initParticles = () => {
    particles.length = 0;
    const numParticles = 50;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.2,
      });
    }
  };

  let animationId: number;
  const animate = () => {
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(128, 128, 128, ${particle.opacity})`;
      ctx.fill();
    });

    animationId = requestAnimationFrame(animate);
  };

  const handleResize = () => {
    resizeCanvas();
    initParticles();
  };

  window.addEventListener("resize", handleResize);

  initParticles();
  animate();

  return () => {
    window.removeEventListener("resize", handleResize);
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    if (container && container.contains(canvas)) {
      container.removeChild(canvas);
    }
  };
}
