import { Dimensions } from "react-native";
import { Skia, PaintStyle } from "@shopify/react-native-skia";
import type { Canvas } from "@shopify/react-native-skia";

const { width } = Dimensions.get("window");

const aspectRatio = 757 / 492;
const center = { x: 492 / 2, y: 757 / 2 };
export const CARD_WIDTH = width * 0.75;
export const CARD_HEIGHT = CARD_WIDTH * aspectRatio;
const scale = 0.6;
const strokeWidth = 10;

const c1 = Skia.Color("#204E71");
const c2 = Skia.Color("#4A759B");

const whitePaint = Skia.Paint();
whitePaint.setAntiAlias(true);
whitePaint.setColor(Skia.Color("white"));

const c1Paint = Skia.Paint();
whitePaint.setAntiAlias(true);
c1Paint.setColor(c1);

const c2Paint = Skia.Paint();
whitePaint.setAntiAlias(true);
c2Paint.setColor(c2);

const strokePaint = Skia.Paint();
whitePaint.setAntiAlias(true);
strokePaint.setStyle(PaintStyle.Stroke);
strokePaint.setStrokeWidth(strokeWidth);

const drawCircles = (canvas: Canvas) => {
  const c = 12;
  const delta = 100 / c;
  new Array(c).fill(0).forEach((_, i) => {
    const r2 = i * delta;
    const path = Skia.Path.Make();
    path.addCircle(0, 0, r2);
    strokePaint.setColor(Skia.Color(i % 2 === 0 ? "#204E71" : "#4A759B"));
    canvas.drawPath(path, strokePaint);
  });
};

const drawPattern1 = (canvas: Canvas) => {
  strokePaint.setColor(c2);
  new Array(4).fill(0).forEach((_, i) => {
    const delta = i * strokeWidth;
    const rect = Skia.XYWHRect(
      -delta,
      -delta,
      center.x * 2 + delta * 2,
      center.y * 2 + delta * 2
    );
    const path = Skia.Path.Make();
    path.addArc(rect, 0, 360);
    canvas.save();
    canvas.translate(center.x / 2, center.y / 2);
    canvas.scale(0.5, 0.5);
    strokePaint.setColor(Skia.Color(i % 2 === 0 ? "#4A759B" : "#204E71"));
    canvas.drawRect(rect, strokePaint);
    canvas.drawPath(path, strokePaint);
    canvas.translate(-center.x / 2, -center.y / 2);
    canvas.restore();
  });
};

const borders = Skia.Path.MakeFromSVGString(
  // eslint-disable-next-line max-len
  "M447.955 756.37H44.699C20.5664 756.37 0.820374 736.624 0.820374 712.492V44.8242C0.820374 20.6898 20.5664 0.945557 44.699 0.945557H447.955C472.088 0.945557 491.834 20.6898 491.834 44.8242V712.492C491.834 736.624 472.088 756.37 447.955 756.37Z"
)!;

const bg = Skia.Path.MakeFromSVGString(
  // eslint-disable-next-line max-len
  "M423.554 40.0679H69.3443C51.3334 40.0679 36.6796 54.7199 36.6796 72.7307V685.881C36.6796 703.892 51.3334 718.546 69.3443 718.546H423.554C441.565 718.546 456.219 703.892 456.219 685.881V72.7307C456.219 54.7199 441.565 40.0679 423.554 40.0679Z"
)!;

export const backface = (canvas: Canvas) => {
  canvas.save();
  canvas.scale(scale, scale);
  canvas.drawPath(borders, whitePaint);
  canvas.drawPath(bg, c1Paint);
  drawPattern1(canvas);
  canvas.save();
  canvas.translate(center.x, center.y);
  //
  canvas.save();
  canvas.translate(0, -200);
  drawCircles(canvas);
  canvas.restore();
  //
  canvas.save();
  canvas.translate(0, 200);
  drawCircles(canvas);
  canvas.restore();
  //
  canvas.save();
  canvas.translate(-100, 0);
  drawCircles(canvas);
  canvas.restore();
  //
  canvas.save();
  canvas.translate(100, 0);
  drawCircles(canvas);
  canvas.restore();
  //
  drawCircles(canvas);
  canvas.restore();
  canvas.restore();
};
