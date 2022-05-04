import { useCallback, useEffect, useState } from 'react';
import { useScrollContainer } from '../components/Container';
import { useSection } from '../components/Section';
import { LayoutContainer, LayoutSection } from '../utils';
import useLatestRef from './useLatestRef';
import { useScroll } from './useScroll';
import { Layout } from './useScrollLayoutManager';

type ScrollStateContext = {
  section: LayoutSection;
  container: LayoutContainer;
  maxScrollPosition: number;
  position: number;
  velocity: number;
};
type ScrollStateFn<T extends number | string | null | undefined> = (
  context: ScrollStateContext
) => T;

const getScrollStateContext = (
  layout: Layout,
  sectionId: string,
  position: number,
  velocity: number
): ScrollStateContext => {
  const section = new LayoutSection(
    layout.sections[sectionId],
    layout.container
  );
  const container = new LayoutContainer(layout.container);
  const maxScrollPosition = layout.maxScrollPosition;

  return {
    section,
    container,
    maxScrollPosition,
    position,
    velocity,
  };
};

export const useScrollState = <T extends number | string | null | undefined>(
  callback: ScrollStateFn<T>
) => {
  const [state, setState] = useState<T>();
  const container = useScrollContainer();
  const section = useSection();
  const scroll = useScroll();
  const callbackRef = useLatestRef(callback);

  if (!section) {
    throw new Error('Springs can only be used inside of a Scroll.Section');
  }

  if (container === null) {
    throw new Error('Springs can only be used within a Scroll.Container');
  }

  const { layoutManager, scrollAxis } = container;

  const maybeUpdateState = useCallback(() => {
    if (!section.isReady) {
      return;
    }
    const position =
      scrollAxis === 'x' ? scroll.position.x.get() : scroll.position.y.get();
    const velocity =
      scrollAxis === 'x' ? scroll.velocity.x.get() : scroll.velocity.y.get();
    const nextState = callbackRef.current(
      getScrollStateContext(
        layoutManager.layout,
        section.sectionId,
        position,
        velocity
      )
    );
    setState(nextState);
  }, [layoutManager.layout, section.sectionId, section.isReady, scrollAxis]);

  useEffect(() => {
    maybeUpdateState();
  }, [maybeUpdateState]);

  useEffect(() => {
    if (scrollAxis === 'x') {
      return scroll.position.x.onChange(() => {
        maybeUpdateState();
      });
    } else {
      return scroll.position.y.onChange(() => {
        maybeUpdateState();
      });
    }
  }, [scrollAxis, maybeUpdateState]);

  useEffect(() => {
    if (scrollAxis === 'x') {
      return scroll.velocity.x.onChange(() => {
        maybeUpdateState();
      });
    } else {
      return scroll.velocity.y.onChange(() => {
        maybeUpdateState();
      });
    }
  }, [scrollAxis, maybeUpdateState]);

  return state;
};
