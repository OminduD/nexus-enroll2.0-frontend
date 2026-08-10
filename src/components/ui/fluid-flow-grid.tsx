'use client';

import React, { useEffect, useRef, useState } from 'react';

interface FluidFlowGridProps {
  children?: React.ReactNode;
  tag?: string;
  title?: string;
  subtitle?: string;
  showDefaultOverlay?: boolean;
  forceLightMode?: boolean;
  transparentBackground?: boolean;
}

export default function FluidFlowGrid({
  children,
  tag = '// FLUID_VECTOR_STREAM',
  title = 'CURRENT',
  subtitle = 'Smooth directional flow field rendered in calm, neutral blue tones.',
  showDefaultOverlay = true,
  forceLightMode = false,
  transparentBackground = false,
}: FluidFlowGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(!forceLightMode);

  useEffect(() => {
    if (forceLightMode) {
      setIsDarkMode(false);
      return;
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [forceLightMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: transparentBackground });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : null;

      width = rect?.width || window.innerWidth;
      height = rect?.height || window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Reset transform before applying scale to prevent infinite scale accumulation
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;

    const render = () => {
      time += 0.008;

      // Mouse smooth interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      if (transparentBackground) {
        ctx.clearRect(0, 0, width, height);
      } else {
        const bgColor = isDarkMode ? '#080d1a' : '#f8fafc';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
      }

      const lineBaseColor = isDarkMode ? '59, 130, 246' : '0, 102, 102'; // Vibrant Deep Teal
      const accentColor = isDarkMode ? '147, 197, 253' : '235, 94, 40'; // High-contrast Coral Accent

      const spacing = 32;
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;

      ctx.lineWidth = 1.4;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;

          // Trigonometric fluid turbulence angle
          let angle = Math.sin(x * 0.003 + time) + Math.cos(y * 0.003 + time);

          // Distance to mouse force field
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let isNear = false;
          if (dist < 240 && dist > 0) {
            isNear = true;
            const pushAngle = Math.atan2(dy, dx) + Math.PI;
            const force = 1 - dist / 240;
            angle = angle * (1 - force) + pushAngle * force;
          }

          const lineLen = isNear ? 24 : 15;
          const x2 = x + Math.cos(angle) * lineLen;
          const y2 = y + Math.sin(angle) * lineLen;

          const alpha = isNear
            ? 0.85
            : 0.25 + Math.sin(x * 0.01 + y * 0.01 + time) * 0.12;

          ctx.strokeStyle = isNear
            ? `rgba(${accentColor}, ${alpha})`
            : `rgba(${lineBaseColor}, ${alpha})`;

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDarkMode, transparentBackground]);

  return (
    <div className={`relative w-full h-full min-h-[600px] overflow-hidden select-none ${transparentBackground ? 'bg-transparent' : isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full cursor-default" />

      {children ? (
        <div className="relative z-10 w-full h-full">{children}</div>
      ) : showDefaultOverlay ? (
        <div className="relative z-10 flex h-full min-h-[600px] flex-col items-center justify-center text-center px-4 pointer-events-none mix-blend-difference text-white">
          <span className="font-mono text-xs tracking-widest uppercase mb-3 text-blue-400">
            {tag}
          </span>
          <h1 className="font-mono text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none">
            {title}
          </h1>
          <p className="mt-4 font-mono text-xs md:text-sm max-w-lg opacity-70">
            {subtitle}
          </p>
        </div>
      ) : null}
    </div>
  );
}
