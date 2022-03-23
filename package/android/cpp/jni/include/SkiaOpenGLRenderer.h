#pragma once

#include <RNSkLog.h>

#include "android/native_window.h"
#include "EGL/egl.h"
#include "GLES2/gl2.h"

#include <thread>
#include <map>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdocumentation"

#include "include/gpu/GrDirectContext.h"
#include "include/gpu/gl/GrGLInterface.h"
#include <SkCanvas.h>
#include <SkSurface.h>
#include <SkPicture.h>

#pragma clang diagnostic pop

#include <mutex>
#include <condition_variable>

namespace RNSkia
{
    using DrawingContext = struct
    {
        EGLContext glContext;
        EGLDisplay glDisplay;
        EGLConfig glConfig;
        sk_sp<GrDirectContext> skContext;
    };

    static std::map<std::thread::id, std::shared_ptr<DrawingContext>> threadContexts;

    enum RenderState : int {
        Initializing,
        Rendering,
        Finishing,
        Done,
    };

    class SkiaOpenGLRenderer
    {
    public:
        SkiaOpenGLRenderer(ANativeWindow *nativeWindow, size_t renderId) :
            _nativeWindow(nativeWindow),
            _renderId(renderId) { }

        /**
         * Initializes, renders and tears down the render pipeline depending on the state of the
         * renderer. All OpenGL/Skia context operations are done on a separate thread which must
         * be the same for all calls to the render method.
         *
         * @param picture Picture to render, can be nullptr, then no rendering will be performed
         * @param width Width of surface to render if there is a picture
         * @param height Height of surface to render if there is a picture
         */
        void run(const sk_sp<SkPicture> picture, int width, int height);

        /**
         * Sets the state to finishing. Next time the renderer will be called it
         * will tear down and release its resources. It is important that this
         * is done on the same thread as the other OpenGL context stuff is handled.
         *
         * Teardown can be called fom whatever thread we want - but we must ensure that
         * at least one call to render on the render thread is done after calling
         * teardown.
         */
        void teardown();

        /**
         * Wait for teardown to finish. This means that we'll wait until the next
         * render which will handle releasing all OpenGL and Skia resources used for
         * this renderer. After tearing down the render will do nothing if the render
         * method is called again.
         */
        void waitForTeardown();

    private:
        /**
         * Initializes all required OpenGL and Skia objects
         * @return True if initialization went well.
         */
        bool ensureInitialised();

        /**
         * Initializes the static OpenGL context that is shared between
         * all instances of the renderer.
         * @return True if initialization went well
         */
        bool initStaticGLContext();

        /**
         * Initializes the static Skia context that is shared between
         * all instances of the renderer
         * @return True if initialization went well
         */
        bool initStaticSkiaContext();

        /**
         * Inititalizes the OpenGL surface from the native view pointer we
         * got on initialization. Each renderer has its own OpenGL surface to
         * render on.
         * @return True if initialization went well
         */
        bool initGLSurface();

        /**
         * Ensures that we have a valid Skia surface to draw to. The surface will
         * be recreated if the width/height change.
         * @param width Width of the underlying view
         * @param height Height of the underlying view
         * @return True if initialization went well
         */
        bool ensureSkiaSurface(int width, int height);

        /**
         * Finalizes and releases all resources used by this renderer
         */
        void finish();

        /**
         * Destroys the underlying OpenGL surface used for this renderer
         */
        void finishGL();

        /**
         * Destroys the underlying Skia surface used for this renderer
         */
        void finishSkiaSurface();

        /**
         * To be able to use static contexts (and avoid reloading the skia context for each
         * new view, we track the OpenGL and Skia drawing context per thread.
         * @return The drawing context for the current thread
         */
        static std::shared_ptr<DrawingContext> getThreadDrawingContext();

        EGLSurface _glSurface = EGL_NO_SURFACE;

        ANativeWindow *_nativeWindow = nullptr;
        GrBackendRenderTarget _skRenderTarget;
        sk_sp<SkSurface> _skSurface;

        int _prevWidth = 0;
        int _prevHeight = 0;

        size_t _renderId;

        std::mutex _lock;
        std::condition_variable _cv;

        std::atomic<RenderState> _renderState = { RenderState::Initializing };
    };

}