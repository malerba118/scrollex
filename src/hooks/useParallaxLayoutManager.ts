import { useCallback, useMemo, useState } from 'react';
import { Rect } from '../types';

interface UseParallaxLayoutManagerParams {
  scrollAxis: 'x' | 'y';
}

export interface Layout {
  sections: Record<string, Rect>;
  container: Rect;
  scrollMax: number;
}

export interface LayoutManager {
  layout: Layout;
  setContainerRect: (rect: Rect) => void;
  setSectionRect: (sectionId: string, rect: Rect) => void;
}

const useParallaxLayoutManager = ({
  scrollAxis,
}: UseParallaxLayoutManagerParams): LayoutManager => {
  let [container, setContainer] = useState<Rect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  let [sections, setSections] = useState<Record<string, Rect>>({});

  const setContainerRect = useCallback(
    (rect: Rect) => {
      setContainer(rect);
    },
    [setContainer]
  );

  const setSectionRect = useCallback(
    (sectionId: string, rect: Rect) => {
      setSections((prev) => ({
        ...prev,
        [sectionId]: rect,
      }));
    },
    [setSections]
  );

  const scrollMax = useMemo(() => {
    let total = 0;
    if (scrollAxis === 'y') {
      Object.values(sections).forEach((rect) => {
        total += rect.height;
      });
      total -= container.height;
    } else {
      Object.values(sections).forEach((rect) => {
        total += rect.width;
      });
      total -= container.width;
    }
    return total;
  }, [container, sections, scrollAxis]);

  return useMemo(
    () => ({
      layout: {
        sections,
        container,
        scrollMax,
      },
      setContainerRect,
      setSectionRect,
    }),
    [setContainerRect, setSectionRect, sections, container, scrollMax]
  );
};

export default useParallaxLayoutManager;
