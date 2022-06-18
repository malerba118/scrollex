import Container from './components/Container';
import Section from './components/Section';
import Item from './components/Item';
import { useScrollState } from './hooks/useScrollState';
import { useScrollValue } from './hooks/useScrollValue';
export type { ScrollStateFn, ScrollStateContext } from './hooks/useScrollState';
export type { ScrollValueFn, ScrollValueContext } from './hooks/useScrollValue';
export type { ScrollContainerProps } from './components/Container';
export type { ScrollSectionProps } from './components/Section';
export type {
  ScrollItemProps,
  Keyframes,
  KeyframesFn,
  KeyframesObj,
  KeyframesContext,
  SpringConfigs,
} from './components/Item';

export const Scroll = {
  Container,
  Section,
  Item,
};
export { useScrollState, useScrollValue };
