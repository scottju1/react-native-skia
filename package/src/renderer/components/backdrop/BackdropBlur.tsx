import React from "react";

import { Blur } from "../imageFilters";
import type { AnimatedProps, Radius } from "../../processors";

import type { BackdropFilterProps } from "./BackdropFilter";
import { BackdropFilter } from "./BackdropFilter";

interface BackdropBlurProps extends Omit<BackdropFilterProps, "filter"> {
  blur: Radius;
}

export const BackdropBlur = ({
  blur,
  children,
  ...props
}: AnimatedProps<BackdropBlurProps>) => {
  return (
    <BackdropFilter filter={<Blur blur={blur} mode="clamp" />} {...props}>
      {children}
    </BackdropFilter>
  );
};
