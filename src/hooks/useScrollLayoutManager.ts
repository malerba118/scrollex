import { useCallback, useMemo, useState } from 'react';
import { Rect } from '../utils';

interface UseScrollLayoutManagerParams {
  scrollAxis: 'x' | 'y';
}

export interface Layout {
  sections: Record<string, Rect>;
  container: Rect;
  content: Rect;
  maxScrollPosition: number;
}

export interface LayoutManager {
  layout: Layout;
  setContainerRect: (rect: Rect) => void;
  setContentRect: (rect: Rect) => void;
  setSectionRect: (sectionId: string, rect: Rect) => void;
}

const useScrollLayoutManager = ({
  scrollAxis,
}: UseScrollLayoutManagerParams): LayoutManager => {
  let [container, setContainer] = useState<Rect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  let [content, setContent] = useState<Rect>({
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

  const setContentRect = useCallback(
    (rect: Rect) => {
      setContent(rect);
    },
    [setContent]
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

  const maxScrollPosition = useMemo(() => {
    if (scrollAxis === 'y') {
      return content.height - container.height;
    } else {
      return content.width - container.width;
    }
  }, [container, content, scrollAxis]);

  return useMemo(
    () => ({
      layout: {
        sections,
        container,
        content,
        maxScrollPosition,
      },
      setContainerRect,
      setContentRect,
      setSectionRect,
    }),
    [
      setContainerRect,
      setSectionRect,
      sections,
      container,
      content,
      maxScrollPosition,
    ]
  );
};

export default useScrollLayoutManager;
