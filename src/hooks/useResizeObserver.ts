import { useEffect } from 'react';
import { ObservableRef } from './useObservableRef';
import useLatestRef from './useLatestRef';

const useResizeObserver = (
  ref: ObservableRef<any>,
  callback: (entry: ResizeObserverEntry) => void
) => {
  const callbackRef = useLatestRef(callback);

  useEffect(() => {
    return ref.subscribe((el) => {
      if (el) {
        const observer = new ResizeObserver((entries) => {
          callbackRef.current(entries[0]);
        });
        observer.observe(el);
        return () => {
          observer.unobserve(el);
          observer.disconnect();
        };
      }
      return;
    });
  }, [callbackRef, ref]);
};

export default useResizeObserver;
