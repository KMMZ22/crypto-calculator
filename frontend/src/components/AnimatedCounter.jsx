import React, { useEffect, useState, useRef } from 'react';

const AnimatedCounter = ({ value, duration = 2000, prefix = '', suffix = '' }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    // Parse the target value (e.g., "500", "10", "99.9", "4.9")
    const target = parseFloat(value);
    const isDecimal = value.toString().includes('.');

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime = null;
        let animationFrame;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Easing function (easeOutExpo)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            const currentVal = target * easeProgress;

            if (isDecimal) {
                setCount(currentVal.toFixed(1));
            } else {
                setCount(Math.floor(currentVal));
            }

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [target, duration, isVisible, isDecimal]);

    return (
        <span ref={countRef}>
            {prefix}{count}{suffix}
        </span>
    );
};

export default AnimatedCounter;
