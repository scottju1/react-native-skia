#pragma once

#include <JsiSkCanvas.h>
#include <RNSkPlatformContext.h>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdocumentation"

#include "include/gpu/GrDirectContext.h"
#include "include/gpu/gl/GrGLInterface.h"
#include <SkSurface.h>

#pragma clang diagnostic pop

namespace RNSkia {

using RNSkDrawCallback = std::function<void(
    std::shared_ptr<JsiSkCanvas>, int, int, double, RNSkPlatformContext *)>;

#define LAST_DURATION_COUNT 100
using RNSkTimingInfo = struct {
  double lastTimeStamp;
  long lastDurations[LAST_DURATION_COUNT];
  int lastDurationIndex;
  int lastDurationsCount;
};

enum RNSkDrawingMode { Default, Continuous };

class RNSkDrawView {
public:
  /**
   * Constructor
   */
  RNSkDrawView(RNSkPlatformContext *context)
      : _jsiCanvas(std::make_shared<JsiSkCanvas>(context)),
        _platformContext(context) {}

  ~RNSkDrawView() { RNSkLogger::logToConsole("Deleting draw view"); }

  /**
   * Repaints the Skia view using the underlying context and the drawcallback.
   * This method schedules a draw request that will be run on the correct
   * thread and js runtime.
   */
  void requestRedraw();

  /**
   * Installs the draw callback for the view
   */
  void setDrawCallback(std::shared_ptr<jsi::Function> callback);

  /**
   * Call this method with a valid Skia surface to let the draw callback do
   * its thing.
   * It is important that the height and width parameters are not resolved
   * against the scale factor - this is done by the drawing code itself.
   */
  void drawInSurface(sk_sp<SkSurface>, int, int, double, RNSkPlatformContext *);

  /**
   Sets the drawing mode for the view
   */
  void setDrawingMode(RNSkDrawingMode mode);

  /**
   * Set to true to show the debug overlays on render
   */
  void setShowDebugOverlays(bool show) { _showDebugOverlay = show; }

  /**
   returns the drawing mode for the view
   */
  RNSkDrawingMode getDrawingMode() { return _drawingMode; }

protected:
  /**
   * Setup and draw the frame
   */
  virtual void drawFrame(double time) = 0;

  /**
   * @return True if this draw view is backed by a worklet drawing callback
   */
  bool isWorklet() { return _isWorklet; }

private:
  /**
   * Checks preconditions for drawing
   */
  bool isReadyToDraw();

  /**
   Starts update loop if the drawing mode is continuous
   */
  void beginDrawingLoop();

  /**
   Ends an ongoing update loop for this view
   */
  void endDrawingLoop();

  /**
   * Subscribe to shared values
   */
  void subscribeToSharedValues();

  /***
   * Unsubscribe to shared values
   */
  void unsubscribeToSharedValues();

  /**
   * List of active subscriptions
   */
  std::vector<std::function<void()>> _sharedValueSubscriptions;

  /**
   * Stores the draw callback
   */
  std::shared_ptr<RNSkDrawCallback> _callback;

  /**
   * Original callback
   */
  std::shared_ptr<jsi::Function> _originalCallback;

  /**
   * Stores a pointer to the jsi wrapper for the canvas. The reason for
   * storing this pointer and not recreate it is that it creates a set of
   * functions that we don't want to recreate on each render
   */
  std::shared_ptr<JsiSkCanvas> _jsiCanvas;

  /**
   * is drawing flag
   */
  std::atomic<bool> _isDrawing{false};

  /**
   * True if the callback is a worklet
   */
  bool _isWorklet;

  /**
   * Pointer to the platform context
   */
  RNSkPlatformContext *_platformContext;

  /**
   Drawing mode
   */
  RNSkDrawingMode _drawingMode;

  /**
   * Show debug overlays
   */
  bool _showDebugOverlay = false;

  /**
   * True if the drawing loop has been requested
   */
  size_t _drawingLoopIdentifier = -1;
};

} // namespace RNSkia
