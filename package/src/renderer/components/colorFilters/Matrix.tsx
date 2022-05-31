import React from "react";
import type { ReactNode } from "react";

import { createDeclaration } from "../../nodes";
import type { AnimatedProps } from "../../processors";

import { composeColorFilter } from "./Compose";

interface ColorMatrixProps {
  matrix: number[];
  children?: ReactNode | ReactNode[];
}

const onDeclare = createDeclaration<ColorMatrixProps>(
  ({ matrix }, children, { Skia }) => {
    const cf = Skia.ColorFilter.MakeMatrix(matrix);
    return composeColorFilter(Skia, cf, children);
  }
);

export const ColorMatrix = (props: AnimatedProps<ColorMatrixProps>) => {
  return <skDeclaration onDeclare={onDeclare} {...props} />;
};

export const OpacityMatrix = (opacity: number) => [
  1,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  opacity,
  0,
];
