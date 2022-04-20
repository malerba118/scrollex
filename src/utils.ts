import { Rect } from './types';

export const getRect = (el: HTMLElement): Rect => ({
  x: el.offsetLeft,
  y: el.offsetTop,
  width: el.offsetWidth,
  height: el.offsetHeight,
});
