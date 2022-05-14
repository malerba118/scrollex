import { HTMLMotionProps, motion, MotionValue, useSpring } from 'framer-motion';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { useScrollContainer } from './Container';
import { useSection } from './Section';
import { useScroll } from '../hooks/useScroll';
import { Layout } from '../hooks/useScrollLayoutManager';
import {
  keyframes as animation,
  SpringOptions,
  Animation as PopmotionAnimation,
} from 'popmotion';
import throttle from 'lodash.throttle';
import { LayoutSection, LayoutContainer, assignRef } from '../utils';

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
  opacity?: number | string;
  backgroundColor?: string;
  color?: string;
};

export type KeyframesContext = {
  section: LayoutSection;
  container: LayoutContainer;
  maxScrollPosition: number;
  data?: any;
};

export type KeyframesObj = Record<number, StyleObj>;
export type KeyframesFn = (context: KeyframesContext) => KeyframesObj;
export type Keyframes = KeyframesFn | KeyframesObj;
export type KeyframesMap = Map<number, StyleObj>;

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
  const maxScrollPosition = layout.maxScrollPosition;

  return {
    section,
    container,
    maxScrollPosition,
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
    map.set(Number(offset) / layout.maxScrollPosition, keyframesObj[offset]);
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
  backgroundColor?: SpringOptions;
  color?: SpringOptions;
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
  backgroundColor: {
    mass: 0.05,
    damping: 7.5,
    stiffness: 100,
  },
  color: {
    mass: 0.05,
    damping: 7.5,
    stiffness: 100,
  },
};

const Springs = ({ keyframes, springConfigs, data, onSprings }: any) => {
  const container = useScrollContainer();
  const section = useSection();
  const scroll = useScroll();

  if (!section) {
    throw new Error('Springs can only be used inside of a Scroll.Section');
  }

  if (container === null) {
    throw new Error('Springs can only be used within a Scroll.Container');
  }

  const { layoutManager, scrollAxis, throttleAmount } = container;

  // section dependencies include section and container rects
  const animations = useMemo(() => {
    const keyframesMap = processKeyframes(
      keyframes,
      layoutManager.layout,
      section.sectionId,
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
      backgroundColor: getAnimationForProperty('backgroundColor', keyframesMap),
      color: getAnimationForProperty('color', keyframesMap),
    };
  }, [layoutManager.layout, keyframes, JSON.stringify(data)]);

  const mergedSpringConfigs = {
    ...DEFAULT_SPRING_CONFIGS,
    ...springConfigs,
  };

  const springs = {
    translateX: useSpring(
      animations.translateX?.get(0) ?? '0',
      mergedSpringConfigs.translateX
    ),
    translateY: useSpring(
      animations.translateY?.get(0) ?? '0',
      mergedSpringConfigs.translateY
    ),
    translateZ: useSpring(
      animations.translateZ?.get(0) ?? '0',
      mergedSpringConfigs.translateZ
    ),
    scale: useSpring(
      animations.scale?.get(0) ?? '1',
      mergedSpringConfigs.scale
    ),
    scaleX: useSpring(
      animations.scaleX?.get(0) ?? '1',
      mergedSpringConfigs.scaleX
    ),
    scaleY: useSpring(
      animations.scaleY?.get(0) ?? '1',
      mergedSpringConfigs.scaleY
    ),
    scaleZ: useSpring(
      animations.scaleZ?.get(0) ?? '1',
      mergedSpringConfigs.scaleZ
    ),
    skewX: useSpring(
      animations.skewX?.get(0) ?? '0',
      mergedSpringConfigs.skewX
    ),
    skewY: useSpring(
      animations.skewY?.get(0) ?? '0',
      mergedSpringConfigs.skewY
    ),
    rotateX: useSpring(
      animations.rotateX?.get(0) ?? '0',
      mergedSpringConfigs.rotateX
    ),
    rotateY: useSpring(
      animations.rotateY?.get(0) ?? '0',
      mergedSpringConfigs.rotateY
    ),
    rotateZ: useSpring(
      animations.rotateZ?.get(0) ?? '0',
      mergedSpringConfigs.rotateZ
    ),
    opacity: useSpring(
      animations.opacity?.get(0) ?? '1',
      mergedSpringConfigs.opacity
    ),
    backgroundColor: useSpring(
      animations.backgroundColor?.get(0) ?? undefined,
      mergedSpringConfigs.backgroundColor
    ),
    color: useSpring(
      animations.color?.get(0) ?? undefined,
      mergedSpringConfigs.color
    ),
  };

  useEffect(() => {
    const updateSprings = throttle(
      (scrollOffset: number) => {
        const progress = scrollOffset / layoutManager.layout.maxScrollPosition;
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
        springs.backgroundColor.set(
          animations.backgroundColor?.get(progress) ?? undefined
        );
        springs.color.set(animations.color?.get(progress) ?? undefined);
      },
      throttleAmount,
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
    throttleAmount,
    scroll.position.y,
    scroll.position.x,
    animations,
    layoutManager.layout.maxScrollPosition,
  ]);

  useEffect(() => {
    onSprings(springs);
  }, []);

  return null;
};

export interface ScrollItemProps extends HTMLMotionProps<'div'> {
  keyframes?: Keyframes;
  springs?: SpringConfigs;
  data?: any;
}

const Item = forwardRef<HTMLDivElement, ScrollItemProps>(
  (
    { keyframes = {}, springs: springConfigs = {}, data, ...otherProps },
    forwardedRef
  ) => {
    const [springs, setSprings] = useState<Record<string, MotionValue>>({});
    const section = useSection();

    if (!section) {
      throw new Error('Scroll.Item can only be used within a Scroll.Section');
    }

    return (
      <>
        {section.isReady && (
          <Springs
            keyframes={keyframes}
            springConfigs={springConfigs}
            data={data}
            onSprings={setSprings}
          />
        )}
        <motion.div
          {...otherProps}
          ref={(el) => {
            assignRef(forwardedRef, el);
          }}
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
            backgroundColor: springs.backgroundColor,
            color: springs.color,
          }}
        />
      </>
    );
  }
);

export default Item;
