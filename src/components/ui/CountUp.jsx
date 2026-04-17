import { useState, useEffect } from 'react';

export default function CountUp({ end, duration = 1500, style }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing out quint
      const easeOut = 1 - Math.pow(1 - progress, 5);
      
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    
    // Only animate if value is significantly greater than 0
    if (end > 0) {
        window.requestAnimationFrame(step);
    } else {
        setCount(end);
    }
    
  }, [end, duration]);

  return <span style={style}>{count}</span>;
}
