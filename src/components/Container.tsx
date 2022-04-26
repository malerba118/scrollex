import React, {
  createContext,
  forwardRef,
  HTMLProps,
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

export interface ScrollContainerApi {
  layoutManager: LayoutManager;
  scrollAxis: 'x' | 'y';
  throttleAmount: number;
}

const ScrollContainerContext = createContext<ScrollContainerApi | null>(null);

export const useScrollContainer = () => {
  return useContext(ScrollContainerContext);
};

export interface ScrollContainerProps extends HTMLProps<HTMLDivElement> {
  scrollAxis?: 'x' | 'y';
  throttleAmount?: number;
}

const Container = forwardRef<HTMLDivElement, ScrollContainerProps>(
  (
    { scrollAxis = 'y', throttleAmount = 90, children, ...otherProps },
    forwardedRef
  ) => {
    const containerRef = useObservableRef<HTMLDivElement | null>(null);
    const layoutManager = useScrollLayoutManager({ scrollAxis });

    useResizeObserver(containerRef, (entry) => {
      layoutManager.setContainerRect(getRect(entry.target as HTMLElement));
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
            whiteSpace: 'nowrap',
            overflowX: scrollAxis === 'x' ? 'auto' : 'hidden',
            overflowY: scrollAxis === 'y' ? 'auto' : 'hidden',
            ...otherProps.style,
          }}
          ref={containerRef}
        >
          {children}
        </ScrollProvider>
      </ScrollContainerContext.Provider>
    );
  }
);

export default Container;
