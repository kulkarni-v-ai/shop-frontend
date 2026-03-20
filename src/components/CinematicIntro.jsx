import React, { useEffect, useRef, useState } from 'react';
import '../styles/LandingPage.css'; // Assuming styles might be here

const CinematicIntro = ({ onComplete }) => {
    const canvasRef = useRef(null);
    const [isPopping, setIsPopping] = useState(false);
    const isPoppingRef = useRef(false); // For synchronous access in loops
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const pupilRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let startTime;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
        };
        window.addEventListener('resize', resize);
        resize();

        const triggerPop = () => {
            if (isPoppingRef.current) return;
            isPoppingRef.current = true;
            setIsPopping(true);

            // Generate "pop" particles
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const newParticles = [];
            for (let i = 0; i < 150; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 5 + Math.random() * 15;
                const size = 1 + Math.random() * 4;
                const colors = ['#ffffff', '#d4af37', '#8b6508'];
                newParticles.push({
                    x: cx,
                    y: cy,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: size,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    life: 1.0,
                    decay: 0.01 + Math.random() * 0.02
                });
            }
            particlesRef.current = newParticles;

            // Trigger completion after the pop effect finishes (e.g. 1.2s)
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 1200);
        };

        const handleInteraction = (e) => {
            // Prevent default scroll during intro if possible, but trigger pop
            triggerPop();
        };

        const handleMouseMove = (e) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        // Listen for scroll/wheel, touchmove, or click
        window.addEventListener('wheel', handleInteraction, { once: true });
        window.addEventListener('touchmove', handleInteraction, { once: true });
        window.addEventListener('click', handleInteraction, { once: true });
        window.addEventListener('mousemove', handleMouseMove);

        const drawEye = (cx, cy, elapsed) => {
            // Inner Breathing Scale
            const scale = 1 + Math.sin(elapsed * 0.002) * 0.02;

            ctx.save();
            
            // 1. Draw Almond Shape (White Outline)
            ctx.beginPath();
            ctx.moveTo(cx - 200 * scale, cy);
            ctx.quadraticCurveTo(cx, cy - 150 * scale, cx + 200 * scale, cy);
            ctx.quadraticCurveTo(cx, cy + 150 * scale, cx - 200 * scale, cy);
            
            // Stroke the almond
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Clip inner region for iris
            ctx.clip();

            // 2. Iris Base (Gold Radial Gradient)
            const irisRadius = 80 * scale;
            const irisGrad = ctx.createRadialGradient(cx, cy, irisRadius * 0.2, cx, cy, irisRadius);
            irisGrad.addColorStop(0, '#ffd700');
            irisGrad.addColorStop(0.7, '#b8860b');
            irisGrad.addColorStop(1, '#553c00');
            
            ctx.fillStyle = irisGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, irisRadius, 0, Math.PI * 2);
            ctx.fill();

            // Radial Spokes for Iris Texture
            ctx.strokeStyle = 'rgba(0,0,0,0.3)';
            ctx.lineWidth = 1;
            for(let i = 0; i < 80; i++) {
                const angle = (i / 80) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(cx + Math.cos(angle) * (irisRadius * 0.3), cy + Math.sin(angle) * (irisRadius * 0.3));
                ctx.lineTo(cx + Math.cos(angle) * irisRadius, cy + Math.sin(angle) * irisRadius);
                ctx.stroke();
            }

            // Smooth Pupil Tracking Logic
            const dx = mouseRef.current.x - cx;
            const dy = mouseRef.current.y - cy;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            
            const maxOffset = 25 * scale; // Limit tracking within iris
            const targetOffset = Math.min(distance * 0.05, maxOffset);
            
            const targetX = Math.cos(angle) * targetOffset;
            const targetY = Math.sin(angle) * targetOffset;
            
            // Lerp for smooth tracking
            pupilRef.current.x += (targetX - pupilRef.current.x) * 0.15;
            pupilRef.current.y += (targetY - pupilRef.current.y) * 0.15;

            const pupilCx = cx + pupilRef.current.x;
            const pupilCy = cy + pupilRef.current.y;

            // 3. Pupil
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(pupilCx, pupilCy, 25 * scale, 0, Math.PI * 2);
            ctx.fill();

            // 4. Catchlight (Highlight) tracks with pupil
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(pupilCx - 8 * scale, pupilCy - 8 * scale, 6 * scale, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        };

        const drawTypographyAndScroll = (cx, cy, elapsed) => {
            // HOUSE OF VISUALS
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 48px "Inter", sans-serif';
            ctx.letterSpacing = '14px'; // Native canvas letterSpacing support (modern browsers)
            // Polyfill spacing if native not fully perfect, but modern canvas supports it
            ctx.fillText('HOUSE OF VISUALS', cx, cy + 160);
            
            // We see what brands miss.
            ctx.fillStyle = '#d4af37';
            ctx.font = '400 16px "Inter", sans-serif';
            ctx.letterSpacing = '2px';
            ctx.fillText('We see what brands miss.', cx, cy + 220);

            // Scroll indicator (Mouse rounded rect + dot)
            ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(cx - 15, cy + 280, 30, 50, 15);
            } else {
                ctx.rect(cx - 15, cy + 280, 30, 50); // Fallback
            }
            ctx.stroke();

            // Oscillating Dot
            const dotY = cy + 295 + Math.sin(elapsed * 0.005) * 8;
            ctx.fillStyle = '#d4af37';
            ctx.beginPath();
            ctx.arc(cx, dotY, 3, 0, Math.PI * 2);
            ctx.fill();
        };

        const drawParticles = () => {
            particlesRef.current.forEach(p => {
                if (p.life > 0) {
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.life;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vx *= 0.96; // Friction
                    p.vy *= 0.96;
                    p.life -= p.decay;
                }
            });
            ctx.globalAlpha = 1.0;
        };

        const render = (time) => {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const cx = canvas.width / 2;
            const cy = canvas.height / 2 - 50; // Shifted up slightly for visual balance

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#05020a'; // Deep black
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (!isPoppingRef.current) {
                // Stable Idle State
                drawEye(cx, cy, elapsed);
                drawTypographyAndScroll(cx, cy, elapsed);
            } else {
                // Popping State
                // Optional: draw fading typography
                drawParticles();
                
                // Fade out whole canvas container opacity is handled via state/styles
            }
            
            animationFrameId = requestAnimationFrame(render);
        };
        
        requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('wheel', handleInteraction);
            window.removeEventListener('touchmove', handleInteraction);
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [onComplete]);

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            zIndex: 10000,
            background: '#05020a',
            pointerEvents: 'auto', // Important so wheel/click works on the overlay
            transition: 'opacity 0.8s ease',
            opacity: isPopping ? 0 : 1 // Trigger CSS fade while JS particles render
        }}
        onClick={() => setIsPopping(true)}
        onWheel={() => setIsPopping(true)}
        onTouchMove={() => setIsPopping(true)}>
            {/* The CSS opacity fades the whole container over 0.8s while particles pop */}
            <canvas 
                ref={canvasRef} 
                className="cinematic-canvas-intro"
                style={{ display: 'block', width: '100%', height: '100%' }} 
            />
        </div>
    );
};

export default CinematicIntro;
