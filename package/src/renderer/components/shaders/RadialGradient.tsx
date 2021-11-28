import type { Vector, AnimatedProps } from "../../processors";
import { Skia } from "../../../skia";
import { useDeclaration } from "../../nodes/Declaration";
import { materialize } from "../../processors";

import type { GradientProps } from "./Gradient";
import { processGradientProps } from "./Gradient";

export interface RadialGradientProps extends GradientProps {
  c: Vector;
  r: number;
}

export const RadialGradient = (props: AnimatedProps<RadialGradientProps>) => {
  const onDeclare = useDeclaration(
    (ctx) => {
      const { c, r, ...gradientProps } = materialize(ctx, props);
      const { colors, positions, mode, localMatrix, flags } =
        processGradientProps(gradientProps);
      return Skia.Shader.MakeRadialGradient(
        c,
        r,
        colors,
        positions,
        mode,
        localMatrix,
        flags
      );
    },
    [props]
  );
  return <skDeclaration onDeclare={onDeclare} />;
};
