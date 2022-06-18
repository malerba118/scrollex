import React, {
  useMemo,
  createContext,
  useContext,
  forwardRef,
  useEffect,
  useLayoutEffect,
} from 'react';
import {
  HTMLMotionProps,
  motion,
  motionValue,
  MotionValue,
  useElementScroll,
  useSpring,
  // useVelocity,
} from 'framer-motion';
import useConst from './useConst';

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

/**
 * Creates a `MotionValue` that updates when the velocity of the provided `MotionValue` changes.
 *
 * ```javascript
 * const x = useMotionValue(0)
 * const xVelocity = useVelocity(x)
 * const xAcceleration = useVelocity(xVelocity)
 * ```
 *
 * @public
 */
export function useVelocity(value: MotionValue<number>): MotionValue<number> {
  const velocity = useConst(() => motionValue(value.getVelocity()));

  useEffect(() => {
    return value.velocityUpdateSubscribers.add((newVelocity) => {
      velocity.set(newVelocity);
    });
  }, [value]);

  return velocity;
}

export const ScrollProvider = forwardRef<HTMLDivElement, ScrollProviderProps>(
  ({ children, style, ...otherProps }: ScrollProviderProps, ref) => {
    const { scrollX, scrollY } = useElementScroll(ref as any);
    const rawVelocityX = useVelocity(scrollX);
    const rawVelocityY = useVelocity(scrollY);
    const velocityX = useSpring(rawVelocityX, {
      stiffness: 100,
      damping: 10,
      mass: 0.05,
    });
    const velocityY = useSpring(rawVelocityY, {
      stiffness: 100,
      damping: 10,
      mass: 0.05,
    });

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
        <motion.div style={{ display: 'none', x: velocityX, y: velocityY }} />
        <motion.div
          {...otherProps}
          ref={ref}
          style={{
            scrollBehavior: 'smooth',
            overflow: 'auto',
            ...style,
          }}
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
    throw new Error('useScroll must be used within a ScrollProvider');
  } else {
    return context;
  }
};
