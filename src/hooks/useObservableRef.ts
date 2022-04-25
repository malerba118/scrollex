import { useState } from 'react';
import useConst from './useConst';

type Cleanup = (() => void) | void;
type Subscriber<T> = (next: T) => Cleanup;
type Unsubscribe = () => void;
type Subscription<T> = {
  subscriber: Subscriber<T>;
  cleanup?: Cleanup;
};

export class ObservableRef<T> {
  // @ts-ignore
  private value: T;
  private subscriptions: Subscription<T>[] = [];
  public current: T;

  constructor(defaultValue: T) {
    Object.defineProperty(this, 'current', {
      enumerable: true,
      get: () => {
        return this.value;
      },
      set: (nextVal) => {
        this.value = nextVal;
        this.notify(nextVal);
      },
    });
    this.current = defaultValue;
  }

  subscribe(subscriber: Subscriber<T>): Unsubscribe {
    this.subscriptions.push({
      subscriber,
      cleanup: subscriber(this.value),
    });
    return () => {
      this.subscriptions.forEach((subscription) => {
        if (subscription.subscriber === subscriber) {
          subscription.cleanup?.();
        }
      });
      this.subscriptions = this.subscriptions.filter(
        (subscription) => subscription.subscriber !== subscriber
      );
    };
  }

  private notify(next: T) {
    this.subscriptions.forEach((subscription) => {
      subscription.cleanup?.();
      subscription.cleanup = subscription.subscriber(next);
    });
  }
}

const useObservableRef = <T>(defaultValue: T) => {
  const ref = useConst(() => new ObservableRef(defaultValue));
  return ref;
};

export default useObservableRef;
