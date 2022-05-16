import type {
  ISkiaValueApi,
  SkiaValue,
  SkiaReadonlyValue,
  SkiaClockValue,
  AnimationState,
  SkiaAnimation,
} from "../types";

import { RNSkAnimation } from "./RNSkAnimation";
import { RNSkClockValue } from "./RNSkClockValue";
import { RNSkDerivedValue } from "./RNSkDerivedValue";
import { RNSkValue } from "./RNSkValue";

export const ValueApi: ISkiaValueApi = {
  createValue: function <T>(initialValue: T): SkiaValue<T> {
    return new RNSkValue(initialValue);
  },
  createDerivedValue: function <R>(
    cb: () => R,
    values: SkiaReadonlyValue<unknown>[]
  ): SkiaReadonlyValue<R> {
    return new RNSkDerivedValue(cb, values);
  },
  createClockValue: function (): SkiaClockValue {
    return new RNSkClockValue(requestAnimationFrame);
  },
  createAnimation: function <S extends AnimationState = AnimationState>(
    cb: (t: number, state: S | undefined) => S
  ): SkiaAnimation {
    return new RNSkAnimation(cb, requestAnimationFrame);
  },
};
