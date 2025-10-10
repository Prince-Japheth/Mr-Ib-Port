"use client";

import { useEffect, useState } from "react";

export function Preloader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide preloader after a short delay to ensure everything is loaded
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="mil-preloader-frame" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      zIndex: 9999
    }}>
      <div className="mil-preloader-content" style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        transform: 'translateY(-200px) scale(0.6)'
      }}>
        <div className="mil-preloader" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '60px',
          height: '30px',
          margin: '0 auto 15px'
        }}>
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className={`mil-circ-${i}`}
              style={{
                backgroundColor: 'rgb(76, 175, 80)',
                height: '10px',
                width: '10px',
                margin: '0 3px',
                borderRadius: '50%',
                display: 'inline-block',
                animation: `stretchdelay 1.1s infinite ease-in-out ${i * 0.15}s`,
                animationFillMode: 'both'
              }}
            />
          ))}
        </div>
        <div className="mil-upper" style={{
          fontSize: '14px',
          fontWeight: 500,
          color: '#333',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>Loading</div>
      </div>
      
      <style jsx global>{`
        @keyframes stretchdelay {
          0%, 40%, 100% { transform: scaleY(0.4) }  
          20% { transform: scaleY(1.0) }
        }
      `}</style>
    </div>
  )
}
