import { Skia } from "@shopify/react-native-skia";
import type { IRect } from "@shopify/react-native-skia";
import { rect2rect } from "@shopify/react-native-skia/src/renderer/components/image/BoxFit";

import type { DrawingElements, ResizeMode } from "../types";

import { getBoundingBox } from "./getBoundingBox";

export const resizeElementsBy = (
  sx: number,
  sy: number,
  resizeMode: ResizeMode | undefined,
  elements: DrawingElements
) => {
  const source = getBoundingBox(elements);
  if (source === undefined) {
    return;
  }
  let dest: IRect;
  switch (resizeMode) {
    case "topLeft":
      dest = resizeBounds(sx, sy, -sx, -sy, source);
      break;
    case "topRight":
      dest = resizeBounds(0, sy, sx, -sy, source);
      break;
    case "bottomLeft":
      dest = resizeBounds(sx, 0, -sx, sy, source);
      break;
    case "bottomRight":
      dest = resizeBounds(0, 0, sx, sy, source);
      break;
    case undefined:
      dest = resizeBounds(sx, sy, 0, 0, source);
  }

  const matrix = Skia.Matrix();
  const m3 = rect2rect(source, dest);
  dest.width > 0 && matrix.setTranslateX(m3[0].translateX);
  dest.height > 0 && matrix.setTranslateY(m3[1].translateY);
  dest.width > 0 && matrix.setScaleX(m3[2].scaleX);
  dest.height > 0 && matrix.setScaleY(m3[3].scaleY);

  // use to scale elements
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    element.primitive.transform(matrix);
  }
};

const resizeBounds = (
  x: number,
  y: number,
  r: number,
  b: number,
  bounds: IRect
) => {
  return {
    x: bounds.x + x,
    y: bounds.y + y,
    width: bounds.width + r,
    height: bounds.height + b,
  };
};
