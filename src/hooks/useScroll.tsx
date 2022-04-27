import React, { useMemo, createContext, useContext, forwardRef } from 'react';
import {
  HTMLMotionProps,
  motion,
  MotionValue,
  useElementScroll,
  useVelocity,
} from 'framer-motion';

const ScrollContext = createContext<ScrollValues | null>(null);

interface ScrollProviderProps extends HTMLMotionProps<'div'> {}

interface ScrollValues {
  position: {
    x: MotionValue<number>;
    y: MotionValue<number>;
  };
  velocity: {
    x: MotionValue<number>;
    y: MotionValue<number>;
  };
}

export const ScrollProvider = forwardRef<HTMLDivElement, ScrollProviderProps>(
  ({ children, style, ...otherProps }: ScrollProviderProps, ref) => {
    const { scrollX, scrollY } = useElementScroll(ref as any);
    const velocityX = useVelocity(scrollX);
    const velocityY = useVelocity(scrollY);

    const scroll = useMemo(
      () => ({
        position: {
          x: scrollX,
          y: scrollY,
        },
        velocity: {
          x: velocityX,
          y: velocityY,
        },
      }),
      [scrollX, scrollY, velocityX, velocityY]
    );

    return (
      <ScrollContext.Provider value={scroll}>
        <motion.div
          {...otherProps}
          ref={ref}
          style={{ scrollBehavior: 'smooth', overflow: 'auto', ...style }}
        >
          {children}
        </motion.div>
      </ScrollContext.Provider>
    );
  }
);

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (context === null) {
    throw new Error('useScroll must be used inside of a ScrollProvider');
  } else {
    return context;
  }
};
