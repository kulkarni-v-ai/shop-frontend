import React, { useRef } from 'react';

const MagneticButton = ({ children, className, onClick }) => {
    const btnRef = useRef(null);
    const handleMove = (e) => {
        const btn = btnRef.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    };
    const handleLeave = () => {
        if (btnRef.current) btnRef.current.style.transform = 'translate(0, 0)';
    };
    return (
        <button
            ref={btnRef}
            className={className}
            onClick={onClick}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
        >
            {children}
        </button>
    );
};

export default MagneticButton;
