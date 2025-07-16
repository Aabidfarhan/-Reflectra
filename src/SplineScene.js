import React, { useEffect, useState } from 'react';
import './SplineScene.css';

const SplineScene = () => {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroDone(true);
    }, 2500); // shrink after 6 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`spline-wrapper ${introDone ? 'shrink' : 'full'}`}>
      <iframe
        src="https://my.spline.design/claritystream-e30hS8MiysEW5m4B5qSw6Imh/"
        frameBorder="0"
        width="100%"
        height="100%"
        title="Spline Scene"
        allow="fullscreen"
      />
    </div>
  );
};

export default SplineScene;
