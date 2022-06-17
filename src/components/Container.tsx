import React, {
  createContext,
  forwardRef,
  useContext,
  useLayoutEffect,
  useMemo,
} from 'react';
import useScrollLayoutManager, {
  LayoutManager,
} from '../hooks/useScrollLayoutManager';
import useResizeObserver from '../hooks/useResizeObserver';
import useObservableRef from '../hooks/useObservableRef';
import { ScrollProvider } from '../hooks/useScroll';
import { assignRef, getRect } from '../utils';
import { HTMLMotionProps } from 'framer-motion';

export interface ScrollContainerApi {
  layoutManager: LayoutManager;
  scrollAxis: 'x' | 'y';
  throttleAmount: number;
}

const ScrollContainerContext = createContext<ScrollContainerApi | null>(null);

export const useScrollContainer = () => {
  return useContext(ScrollContainerContext);
};

export interface ScrollContainerProps extends HTMLMotionProps<'div'> {
  scrollAxis?: 'x' | 'y';
  throttleAmount?: number;
}

const Container = forwardRef<HTMLDivElement, ScrollContainerProps>(
  (
    { scrollAxis = 'y', throttleAmount = 90, children, ...otherProps },
    forwardedRef
  ) => {
    const containerRef = useObservableRef<HTMLDivElement | null>(null);
    const contentRef = useObservableRef<HTMLDivElement | null>(null);
    const layoutManager = useScrollLayoutManager({ scrollAxis });

    useResizeObserver(containerRef, (entry) => {
      layoutManager.setContainerRect(getRect(entry.target as HTMLElement));
    });

    useResizeObserver(contentRef, (entry) => {
      layoutManager.setContentRect(getRect(entry.target as HTMLElement));
      console.log(getRect(entry.target as HTMLElement));
    });

    useLayoutEffect(() => {
      return containerRef.subscribe((el) => {
        assignRef(forwardedRef, el);
      });
    }, []);

    const scrollContainerApi = useMemo(
      () => ({
        scrollAxis,
        layoutManager,
        throttleAmount,
      }),
      [scrollAxis, layoutManager, throttleAmount]
    );

    return (
      <ScrollContainerContext.Provider value={scrollContainerApi}>
        <ScrollProvider
          {...otherProps}
          style={{
            position: 'relative',
            whiteSpace: scrollAxis === 'x' ? 'nowrap' : 'normal',
            overflowX: scrollAxis === 'x' ? 'auto' : 'hidden',
            overflowY: scrollAxis === 'y' ? 'auto' : 'hidden',
            ...otherProps.style,
          }}
          ref={containerRef}
        >
          <div
            style={{
              position: 'relative',
              width: scrollAxis === 'x' ? 'auto' : '100%',
              height: scrollAxis === 'x' ? '100%' : 'auto',
              // required to allow fixed position content (permits scroll events to propagate to container)
              clipPath: 'inset(0 0 0 0)',
              // required to prevent actively animating content from increasing the scroll height
              overflow: 'clip',
            }}
            ref={contentRef}
          >
            {children}
          </div>
        </ScrollProvider>
      </ScrollContainerContext.Provider>
    );
  }
);

export default Container;
