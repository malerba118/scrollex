import { useMotionValue } from 'framer-motion';
import { useEffect } from 'react';
import { useScrollContainer } from '../components/Container';
import { useSection } from '../components/Section';
import { LayoutContainer, LayoutSection } from '../utils';
import useLatestRef from './useLatestRef';
import { useScroll } from './useScroll';
import { Layout } from './useScrollLayoutManager';

export type ScrollValueContext = {
  section: LayoutSection;
  container: LayoutContainer;
  maxScrollPosition: number;
  position: number;
  velocity: number;
};
export type ScrollValueFn<T extends number | string> = (
  context: ScrollValueContext
) => T;

const getScrollValueContext = (
  layout: Layout,
  sectionId: string,
  position: number,
  velocity: number
): ScrollValueContext => {
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

export const useScrollValue = <T extends number | string>(
  callback: ScrollValueFn<T>
) => {
  const value = useMotionValue<T | undefined>(undefined);
  const container = useScrollContainer();
  const section = useSection();
  const scroll = useScroll();

  if (section === null) {
    throw new Error('useScrollValue can only be used within a Scroll.Section');
  }

  if (container === null) {
    throw new Error(
      'useScrollValue can only be used within a Scroll.Container'
    );
  }

  const { layoutManager, scrollAxis } = container;

  const maybeUpdateValue = useLatestRef(() => {
    if (!section.isReady) {
      return;
    }
    const position =
      scrollAxis === 'x' ? scroll.position.x.get() : scroll.position.y.get();
    const velocity =
      scrollAxis === 'x' ? scroll.velocity.x.get() : scroll.velocity.y.get();
    const nextValue = callback(
      getScrollValueContext(
        layoutManager.layout,
        section.sectionId,
        position,
        velocity
      )
    );
    value.set(nextValue);
  });

  useEffect(() => {
    maybeUpdateValue.current();
  }, [layoutManager.layout, section.sectionId, section.isReady, scrollAxis]);

  useEffect(() => {
    if (scrollAxis === 'x') {
      return scroll.position.x.onChange(() => {
        maybeUpdateValue.current();
      });
    } else {
      return scroll.position.y.onChange(() => {
        maybeUpdateValue.current();
      });
    }
  }, [scrollAxis]);

  useEffect(() => {
    if (scrollAxis === 'x') {
      return scroll.velocity.x.onChange(() => {
        maybeUpdateValue.current();
      });
    } else {
      return scroll.velocity.y.onChange(() => {
        maybeUpdateValue.current();
      });
    }
  }, [scrollAxis]);

  return value;
};
