import { HTMLMotionProps, motion, MotionValue, useSpring } from 'framer-motion';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useParallaxApi } from './Container';
import { useSection } from './Section';
import { useScroll } from '../hooks/useScroll';
import { Layout } from '../hooks/useParallaxLayoutManager';
import {
  keyframes as animation,
  SpringOptions,
  Animation as PopmotionAnimation,
} from 'popmotion';
import throttle from 'lodash.throttle';
import { JSONValue, Rect } from '../types';

export type StyleObj = {
  scale?: number | string;
  scaleX?: number | string;
  scaleY?: number | string;
  scaleZ?: number | string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  skewX?: number | string;
  skewY?: number | string;
  opacity?: number;
};

export type KeyframesContext = {
  section: LayoutSection;
  container: LayoutContainer;
  scrollMax: number;
  data?: any;
};

export type KeyframesObj = Record<number, StyleObj>;
export type KeyframesFn = (context: KeyframesContext) => KeyframesObj;
export type Keyframes = KeyframesFn | KeyframesObj;
export type KeyframesMap = Map<number, StyleObj>;

class LayoutSection {
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

class LayoutContainer {
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

interface Animation {
  get(progress: number): any;
}

const getAnimationForProperty = (
  property: string,
  keyframesMap: KeyframesMap
): Animation | null => {
  const values: any[] = [];
  const offsets: number[] = [];
  for (const [offset, keyframe] of keyframesMap.entries()) {
    if (property in keyframe) {
      values.push(keyframe[property]);
      offsets.push(offset);
    }
  }
  if (!values.length) {
    return null;
  }
  let anim: PopmotionAnimation<string | number>;
  if (values.length === 1) {
    // needs at least two values to work as expected
    anim = animation({
      to: [values[0], values[0]],
      offset: [offsets[0], offsets[0] + 1],
      duration: 1,
    });
  } else {
    anim = animation({
      to: values,
      offset: offsets,
      duration: 1,
    });
  }
  return {
    get(progress: number) {
      return anim.next(progress).value;
    },
  };
};

const getKeyframesContext = (
  layout: Layout,
  sectionId: string,
  data: any
): KeyframesContext => {
  const section = new LayoutSection(
    layout.sections[sectionId],
    layout.container
  );
  const container = new LayoutContainer(layout.container);
  const scrollMax = layout.scrollMax;

  return {
    section,
    container,
    scrollMax,
    data,
  };
};

const processKeyframes = (
  keyframes: Keyframes,
  layout: Layout,
  sectionId: string,
  data: any
) => {
  let keyframesObj: KeyframesObj;
  if (typeof keyframes === 'function') {
    keyframesObj = keyframes(getKeyframesContext(layout, sectionId, data));
  } else {
    keyframesObj = keyframes;
  }
  const offsets = Object.keys(keyframesObj).sort(
    (a, b) => Number(a) - Number(b)
  );
  const map = new Map<number, StyleObj>();
  offsets.forEach((offset) => {
    map.set(Number(offset) / layout.scrollMax, keyframesObj[offset]);
  });
  return map;
};

export type SpringConfigs = {
  scale?: SpringOptions;
  scaleX?: SpringOptions;
  scaleY?: SpringOptions;
  scaleZ?: SpringOptions;
  translateX?: SpringOptions;
  translateY?: SpringOptions;
  translateZ?: SpringOptions;
  rotateX?: SpringOptions;
  rotateY?: SpringOptions;
  rotateZ?: SpringOptions;
  skewX?: SpringOptions;
  skewY?: SpringOptions;
  opacity?: SpringOptions;
};

const DEFAULT_SPRING_CONFIGS: SpringConfigs = {
  translateX: {
    mass: 0.05,
    damping: 7.5,
    stiffness: 100,
  },
  translateY: {
    mass: 0.05,
    damping: 7.5,
    stiffness: 100,
  },
  translateZ: {
    mass: 0.05,
    damping: 7.5,
    stiffness: 100,
  },
  scale: {
    restDelta: 0.000000001,
    restSpeed: 0.000000001,
    mass: 0.05,
    damping: 20,
  },
  scaleX: {
    restDelta: 0.000000001,
    restSpeed: 0.000000001,
    mass: 0.05,
    damping: 20,
  },
  scaleY: {
    restDelta: 0.000000001,
    restSpeed: 0.000000001,
    mass: 0.05,
    damping: 20,
  },
  scaleZ: {
    restDelta: 0.000000001,
    restSpeed: 0.000000001,
    mass: 0.05,
    damping: 20,
  },
  skewX: {
    mass: 0.1,
    damping: 20,
  },
  skewY: {
    mass: 0.1,
    damping: 20,
  },
  rotateX: {
    mass: 0.05,
    damping: 7.5,
    stiffness: 100,
  },
  rotateY: {
    mass: 0.05,
    damping: 7.5,
    stiffness: 100,
  },
  rotateZ: {
    mass: 0.05,
    damping: 7.5,
    stiffness: 100,
  },
  opacity: {
    mass: 0.1,
    damping: 20,
  },
};

const Springs = ({ keyframes, data, onSprings }: any) => {
  const { layoutManager, scrollAxis } = useParallaxApi();
  const { sectionId } = useSection();
  const scroll = useScroll();

  // section dependencies include section and container rects
  const animations = useMemo(() => {
    const keyframesMap = processKeyframes(
      keyframes,
      layoutManager.layout,
      sectionId,
      data
    );
    return {
      translateX: getAnimationForProperty('translateX', keyframesMap),
      translateY: getAnimationForProperty('translateY', keyframesMap),
      translateZ: getAnimationForProperty('translateZ', keyframesMap),
      scale: getAnimationForProperty('scale', keyframesMap),
      scaleX: getAnimationForProperty('scaleX', keyframesMap),
      scaleY: getAnimationForProperty('scaleY', keyframesMap),
      scaleZ: getAnimationForProperty('scaleZ', keyframesMap),
      skewX: getAnimationForProperty('skewX', keyframesMap),
      skewY: getAnimationForProperty('skewY', keyframesMap),
      rotateX: getAnimationForProperty('rotateX', keyframesMap),
      rotateY: getAnimationForProperty('rotateY', keyframesMap),
      rotateZ: getAnimationForProperty('rotateZ', keyframesMap),
      opacity: getAnimationForProperty('opacity', keyframesMap),
    };
  }, [layoutManager.layout, keyframes, JSON.stringify(data)]);
  const springs = {
    translateX: useSpring(
      animations.translateX?.get(0) ?? '0',
      DEFAULT_SPRING_CONFIGS.translateX
    ),
    translateY: useSpring(
      animations.translateY?.get(0) ?? '0',
      DEFAULT_SPRING_CONFIGS.translateY
    ),
    translateZ: useSpring(
      animations.translateZ?.get(0) ?? '0',
      DEFAULT_SPRING_CONFIGS.translateZ
    ),
    scale: useSpring(
      animations.scale?.get(0) ?? '1',
      DEFAULT_SPRING_CONFIGS.scale
    ),
    scaleX: useSpring(
      animations.scaleX?.get(0) ?? '1',
      DEFAULT_SPRING_CONFIGS.scaleX
    ),
    scaleY: useSpring(
      animations.scaleY?.get(0) ?? '1',
      DEFAULT_SPRING_CONFIGS.scaleY
    ),
    scaleZ: useSpring(
      animations.scaleZ?.get(0) ?? '1',
      DEFAULT_SPRING_CONFIGS.scaleZ
    ),
    skewX: useSpring(
      animations.skewX?.get(0) ?? '0',
      DEFAULT_SPRING_CONFIGS.skewX
    ),
    skewY: useSpring(
      animations.skewY?.get(0) ?? '0',
      DEFAULT_SPRING_CONFIGS.skewY
    ),
    rotateX: useSpring(
      animations.rotateX?.get(0) ?? '0',
      DEFAULT_SPRING_CONFIGS.rotateX
    ),
    rotateY: useSpring(
      animations.rotateY?.get(0) ?? '0',
      DEFAULT_SPRING_CONFIGS.rotateY
    ),
    rotateZ: useSpring(
      animations.rotateZ?.get(0) ?? '0',
      DEFAULT_SPRING_CONFIGS.rotateZ
    ),
    opacity: useSpring(
      animations.opacity?.get(0) ?? '1',
      DEFAULT_SPRING_CONFIGS.opacity
    ),
  };

  useEffect(() => {
    const updateSprings = throttle(
      (scrollOffset: number) => {
        const progress = scrollOffset / layoutManager.layout.scrollMax;
        springs.translateX.set(animations.translateX?.get(progress) ?? '0');
        springs.translateY.set(animations.translateY?.get(progress) ?? '0');
        springs.translateZ.set(animations.translateZ?.get(progress) ?? '0');
        springs.scale.set(animations.scale?.get(progress) ?? '1');
        springs.scaleX.set(animations.scaleX?.get(progress) ?? '1');
        springs.scaleY.set(animations.scaleY?.get(progress) ?? '1');
        springs.scaleZ.set(animations.scaleZ?.get(progress) ?? '1');
        springs.skewX.set(animations.skewX?.get(progress) ?? '0');
        springs.skewY.set(animations.skewY?.get(progress) ?? '0');
        springs.rotateX.set(animations.rotateX?.get(progress) ?? '0');
        springs.rotateY.set(animations.rotateY?.get(progress) ?? '0');
        springs.rotateZ.set(animations.rotateZ?.get(progress) ?? '0');
        springs.opacity.set(animations.opacity?.get(progress) ?? '1');
      },
      90,
      { leading: true, trailing: true }
    );
    if (scrollAxis === 'y') {
      updateSprings(scroll.position.y.get());
      return scroll.position.y.onChange(updateSprings);
    } else {
      updateSprings(scroll.position.x.get());
      return scroll.position.x.onChange(updateSprings);
    }
  }, [
    scrollAxis,
    scroll.position.y,
    scroll.position.x,
    animations,
    layoutManager.layout.scrollMax,
  ]);

  useEffect(() => {
    onSprings(springs);
  }, []);

  return null;
};

export interface ParallaxItemProps extends HTMLMotionProps<'div'> {
  keyframes?: Keyframes;
  data?: any;
}

const Item: FC<ParallaxItemProps> = ({
  keyframes = {},
  data,
  ...otherProps
}) => {
  const [springs, setSprings] = useState<Record<string, MotionValue>>({});
  const { isReady } = useSection();

  return (
    <>
      {isReady && (
        <Springs keyframes={keyframes} data={data} onSprings={setSprings} />
      )}
      <motion.div
        {...otherProps}
        style={{
          ...otherProps.style,
          translateX: springs.translateX,
          translateY: springs.translateY,
          translateZ: springs.translateZ,
          scale: springs.scale,
          scaleX: springs.scaleX,
          scaleY: springs.scaleY,
          scaleZ: springs.scaleZ,
          skewX: springs.skewX,
          skewY: springs.skewY,
          rotateX: springs.rotateX,
          rotateY: springs.rotateY,
          rotateZ: springs.rotateZ,
          opacity: springs.opacity,
        }}
      />
    </>
  );
};

export default Item;
