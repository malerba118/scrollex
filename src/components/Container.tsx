import React, {
  createContext,
  FC,
  HTMLProps,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import useParallaxLayoutManager, {
  LayoutManager,
} from '../hooks/useParallaxLayoutManager';
import useResizeObserver from '../hooks/useResizeObserver';
import useObservableRef from '../hooks/useObservableRef';
import { ScrollProvider } from '../hooks/useScroll';
import { getRect } from '../utils';
import Section from './Section';

export interface ParallaxApi {
  layoutManager: LayoutManager;
  scrollAxis: 'x' | 'y';
}

const ParallaxContext = createContext<ParallaxApi | null>(null);

export const useParallaxApi = () => {
  const context = useContext(ParallaxContext);
  if (!context) {
    throw new Error(
      'useParallaxApi can only be used inside of a Parallax.Container'
    );
  }
  return context;
};

export interface ParallaxContainerProps extends HTMLProps<HTMLDivElement> {
  scrollAxis?: 'x' | 'y';
  height: string | number;
  width: string | number;
}

const Container: FC<ParallaxContainerProps> = ({
  scrollAxis = 'y',
  height,
  width,
  children,
  ...otherProps
}) => {
  const containerRef = useObservableRef<HTMLDivElement | null>(null);
  const layoutManager = useParallaxLayoutManager({ scrollAxis });

  useResizeObserver(containerRef, (entry) => {
    layoutManager.setContainerRect(getRect(entry.target as HTMLElement));
  });

  const parallaxApi = useMemo(
    () => ({
      scrollAxis,
      layoutManager,
    }),
    [scrollAxis, layoutManager]
  );

  return (
    <ParallaxContext.Provider value={parallaxApi}>
      <ScrollProvider
        {...otherProps}
        style={{
          position: 'relative',
          whiteSpace: 'nowrap',
          height,
          width,
          overflowX: scrollAxis === 'x' ? 'auto' : 'hidden',
          overflowY: scrollAxis === 'y' ? 'auto' : 'hidden',
        }}
        ref={containerRef}
      >
        {children}
      </ScrollProvider>
    </ParallaxContext.Provider>
  );
};

export default Container;
