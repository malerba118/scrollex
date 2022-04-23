import React, {
  createContext,
  FC,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { nanoid } from 'nanoid';
import useResizeObserver from '../hooks/useResizeObserver';
import useObservableRef from '../hooks/useObservableRef';
import { getRect } from '../utils';
import { useScrollContainer } from './Container';
import { HTMLMotionProps, motion } from 'framer-motion';
//@ts-ignore
import styles from './Section.module.css';

interface SectionContextApi {
  sectionId: string;
  isReady: boolean;
}

const SectionContext = createContext<SectionContextApi | null>(null);

export const useSection = () => {
  return useContext(SectionContext);
};

export interface ScrollSectionProps extends HTMLMotionProps<'div'> {
  showOverflow?: boolean;
}

const Section: FC<ScrollSectionProps> = ({
  showOverflow = false,
  children,
  className,
  ...otherProps
}) => {
  const sectionRef = useObservableRef<HTMLDivElement | null>(null);
  const [sectionId] = useState(() => nanoid());
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

  const isReady =
    !!layoutManager.layout.sections[sectionId] &&
    layoutManager.layout.container.width !== 0 &&
    layoutManager.layout.container.height !== 0;

  const context = useMemo(
    () => ({
      sectionId,
      isReady,
    }),
    [sectionId, isReady]
  );

  // Using classes here to keep specificity low so user can override
  const _className = useMemo(() => {
    const classes = [className];
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
        ref={sectionRef}
        className={_className}
        style={{
          position: 'relative',
          visibility: isReady ? 'visible' : 'hidden',
          overflow: showOverflow ? 'visible' : 'hidden',
          display: scrollAxis === 'y' ? 'block' : 'inline-block',
          whiteSpace: 'normal',
          ...otherProps.style,
        }}
      >
        {children}
      </motion.div>
    </SectionContext.Provider>
  );
};

export default Section;
