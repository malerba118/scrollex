import React, { createContext, forwardRef, useContext, useMemo } from 'react';
import useResizeObserver from '../hooks/useResizeObserver';
import useObservableRef from '../hooks/useObservableRef';
import { assignRef, getRect } from '../utils';
import { useScrollContainer } from './Container';
import { HTMLMotionProps, motion } from 'framer-motion';
//@ts-ignore
import styles from './Section.module.css';
import { useId } from '../hooks/useId';

interface SectionContextApi {
  sectionId: string;
  isReady: boolean;
}

const SectionContext = createContext<SectionContextApi | null>(null);

export const useSection = () => {
  return useContext(SectionContext);
};

export interface ScrollSectionProps extends HTMLMotionProps<'div'> {}

const Section = forwardRef<HTMLDivElement, ScrollSectionProps>(
  ({ children, className, ...otherProps }, forwardedRef) => {
    const sectionRef = useObservableRef<HTMLDivElement | null>(null);
    const sectionId = useId();
    const container = useScrollContainer();
    const section = useSection();

    if (section !== null) {
      throw new Error(
        'Scroll.Section cannot be nested within another Scroll.Section'
      );
    }

    if (container === null) {
      throw new Error(
        'Scroll.Section can only be used within a Scroll.Container'
      );
    }

    const { layoutManager, scrollAxis } = container;

    useResizeObserver(sectionRef, (entry) => {
      layoutManager.setSectionRect(
        sectionId,
        getRect(entry.target as HTMLElement)
      );
    });

    // Definitely not the best check, but should suffice for determining
    // whether the first layout measurement has happened.
    const isReady =
      !!layoutManager.layout.sections[sectionId] &&
      layoutManager.layout.container.width !== 0 &&
      layoutManager.layout.container.height !== 0 &&
      layoutManager.layout.content.width !== 0 &&
      layoutManager.layout.content.height !== 0;

    const context = useMemo(
      () => ({
        sectionId,
        isReady,
      }),
      [sectionId, isReady]
    );

    // Using classes here to keep specificity low so user can override
    const _className = useMemo(() => {
      const classes = [styles.relative, className];
      if (scrollAxis === 'x') {
        classes.push(styles.heightFull);
      } else {
        classes.push(styles.widthFull);
      }
      return classes.join(' ');
    }, [scrollAxis, className]);

    return (
      <SectionContext.Provider value={context}>
        <motion.div
          {...otherProps}
          ref={(el) => {
            assignRef(forwardedRef, el);
            assignRef(sectionRef, el);
          }}
          className={_className}
          style={{
            visibility: isReady ? 'visible' : 'hidden',
            ...otherProps.style,
          }}
        >
          {children}
        </motion.div>
      </SectionContext.Provider>
    );
  }
);

export default Section;
