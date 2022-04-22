import { Rect } from './types';

export const getRect = (el: HTMLElement): Rect => ({
  x: el.offsetLeft,
  y: el.offsetTop,
  width: el.offsetWidth,
  height: el.offsetHeight,
});

export class LayoutSection {
  private container: Rect;
  private x: number;
  private y: number;
  height: number;
  width: number;

  constructor(section: Rect, container: Rect) {
    this.x = section.x;
    this.y = section.y;
    this.width = section.width;
    this.height = section.height;
    this.container = container;
  }

  topAt(position: 'container-top' | 'container-center' | 'container-bottom') {
    if (position === 'container-top') {
      return this.y;
    } else if (position === 'container-center') {
      return this.y - this.container.height / 2;
    } else {
      return this.y - this.container.height;
    }
  }

  bottomAt(
    position: 'container-top' | 'container-center' | 'container-bottom'
  ) {
    if (position === 'container-top') {
      return this.y + this.height;
    } else if (position === 'container-center') {
      return this.y + this.height - this.container.height / 2;
    } else {
      return this.y + this.height - this.container.height;
    }
  }

  leftAt(position: 'container-left' | 'container-center' | 'container-right') {
    if (position === 'container-left') {
      return this.x;
    } else if (position === 'container-center') {
      return this.x - this.container.width / 2;
    } else {
      return this.x - this.container.width;
    }
  }

  rightAt(position: 'container-left' | 'container-center' | 'container-right') {
    if (position === 'container-left') {
      return this.x + this.width;
    } else if (position === 'container-center') {
      return this.x + this.width - this.container.width / 2;
    } else {
      return this.x + this.width - this.container.width;
    }
  }
}

export class LayoutContainer {
  private x: number;
  private y: number;
  width: number;
  height: number;

  constructor(container: Rect) {
    this.x = container.x;
    this.y = container.y;
    this.width = container.width;
    this.height = container.height;
  }
}
