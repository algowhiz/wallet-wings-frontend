import { useState, useEffect } from 'react';

const useWindowResize = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 522);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 522);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isLargeScreen;
};

export default useWindowResize;
