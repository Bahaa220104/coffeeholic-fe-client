import { useState, useRef, useEffect } from "react";

function useWidthObserver() {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create a ResizeObserver to monitor changes in the element's size
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentBoxSize) {
          // Modern browsers
          setWidth(entry.contentRect.width);
        } else {
          // Fallback for older browsers
          setWidth(element.offsetWidth);
        }
      }
    });

    // Start observing the element
    observer.observe(element);

    // Clean up when component unmounts or ref changes
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return [ref, width];
}

export default useWidthObserver;
