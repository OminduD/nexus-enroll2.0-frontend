import React from 'react';

// GradientBackground — "Jade Sky", made with the 21st.dev Gradient
// Builder and exported as live CSS (the builder's own Copy-CSS background,
// plus its soften-blur and grain passes). Zero dependencies: one <div> that
// fills its parent. Drop it behind your content:
// <div className="relative h-96"><GradientBackground className="absolute inset-0" /></div>
export function GradientBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        containerType: 'size',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-0.8cqmin',
          filter: 'blur(0.4cqmin)',
          backgroundColor: '#CFE9F0',
          backgroundImage:
            'radial-gradient(circle at 65.34% 44.62%, rgba(238, 246, 227, 0.9) 0%, rgba(238, 246, 227, 0) 34.1%), radial-gradient(circle at 28.07% 74.48%, rgba(183, 217, 142, 0.7) 0%, rgba(183, 217, 142, 0) 45.65%), radial-gradient(circle at 52.42% 19.94%, rgba(127, 191, 154, 0.8) 0%, rgba(127, 191, 154, 0) 57.55%), radial-gradient(circle at 80.31% 84.47%, rgba(207, 233, 240, 0.9) 0%, rgba(207, 233, 240, 0) 69.1%)',
        }}
      />
    </div>
  );
}

export const JadeSky = GradientBackground;
export default GradientBackground;
