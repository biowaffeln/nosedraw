import { useRef, useState, useCallback } from "react";
import { circle, clear, lerp, line } from "./canvas/util";
import usePose from "./canvas/usePose";

const colors = [
  "#1a202c",
  "#f56565",
  "#f6ad55",
  "#f6e05e",
  "#68d391",
  "#4299e1",
  "#9f7aea",
  "#f687b3",
];

const widths = [2, 4, 8, 12, 16, 22, 30, 40];

export default function Canvas() {
  const noseCanvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  const [pointerDown, setPointerDown] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [lineWidth, setLineWidth] = useState(widths[1]);
  const [strokeColor, setStrokeColor] = useState(colors[0]);
  let prevX, prevY;

  const [videoRef, { status, error }] = usePose(
    useCallback(
      (pose) => {
        /* should never actually be undefined, but who knows */
        if (!noseCanvasRef.current || !drawCanvasRef.current) return;

        const noseCtx = noseCanvasRef.current.getContext("2d");
        const drawCtx = drawCanvasRef.current.getContext("2d");
        clear(noseCtx);

        if (pose.keypoints[0].score < 0.2) return;

        let { x, y } = pose.keypoints[0].position;
        if (prevX && prevY) {
          x = lerp(prevX, x, 0.5);
          y = lerp(prevY, y, 0.5);
        }
        circle(noseCtx, x, y, Math.max(lineWidth * 0.7, 4), strokeColor);
        if (prevX && pointerDown) {
          line(drawCtx, prevX, prevY, x, y, lineWidth, strokeColor);
        }
        prevX = x;
        prevY = y;
      },
      [pointerDown, lineWidth, strokeColor]
    )
  );

  return (
    <>
      <div className="flex flex-col xl:flex-row max-w-2xl mx-auto xl:max-w-full">
        <div className="canvas-container rounded overflow-hidden shadow-lg w-full xl:w-1/2 mb-12 xl:mb-0">
          <div className="flex flex-col justify-center items-center">
            {status === "loading" && (
              <p className="font-semibold text-2xl">loading posenet...</p>
            )}
            {status === "error" && (
              <>
                <p className="font-semibold text-2xl">
                  error loading posenet :(
                </p>
                <p className="text-lg">please enable your camera</p>
              </>
            )}
          </div>
          <canvas ref={drawCanvasRef} width={640} height={480} />
          <canvas ref={noseCanvasRef} width={640} height={480} />
          <video
            style={{ visibility: showWebcam ? "visible" : "hidden" }}
            ref={videoRef}
            width={640}
            height={480}
            autoPlay
          />
        </div>
        <div className="flex flex-col-reverse xl:flex-col justify-between w-full xl:w-1/2 xl:px-8 text-lg">
          <div>
            <h2 className="font-semibold text-2xl text-center mb-3">
              Select a Color
            </h2>
            <div className="flex flex-wrap justify-center items-center mb-6">
              {colors.map((color) => (
                <button
                  key={color}
                  style={{ backgroundColor: color }}
                  className={`mr-4 mb-2 rounded-full focus:outline-none focus:shadow-outline  ${
                    color === strokeColor ? "w-13 h-13" : "w-10 h-10"
                  }`}
                  onClick={() => setStrokeColor(color)}
                />
              ))}
            </div>
            <h2 className="font-semibold text-2xl text-center mb-3">
              Select a Stroke Width
            </h2>
            <div className="flex flex-wrap justify-center mb-6">
              {widths.map((width) => (
                <button
                  key={width}
                  className="focus:outline-none group flex flex-col items-center mr-2"
                  onClick={() => setLineWidth(width)}
                >
                  <div className="w-10 h-10 mb-4 flex flex-col items-center justify-center">
                    <div
                      style={{ width: width, height: width }}
                      className="bg-gray-900 rounded-full group-focus:shadow-outline"
                    />
                  </div>
                  <span
                    className={`text-sm text-center border-2 rounded py-1 px-2 ${
                      lineWidth === width
                        ? "border-gray-600"
                        : "border-transparent"
                    }`}
                  >
                    {width}px
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col-reverse xl:flex-col mb-6 xl:mb-0">
            <button
              onClick={() => setShowWebcam((s) => !s)}
              className="py-3 px-4 font-semibold text-center mb-2 rounded focus:outline-none focus:shadow-outline"
            >
              {showWebcam ? "hide" : "show"} webcam
            </button>
            <button
              className="py-3 px-4 shadow-md bg-indigo-600 font-semibold text-gray-100 rounded focus:outline-none focus:shadow-outline"
              onPointerDown={() => setPointerDown(true)}
              onPointerUp={() => setPointerDown(false)}
            >
              press here to draw
            </button>
          </div>
        </div>
      </div>
      <div className="text-center pt-20 pb-32">
        <p className="text-xl">Done drawing?</p>
        <a
          className="inline-block text-2xl border-b-2 border-indigo-600"
          download={"nosedraw.jpg"}
          href={drawCanvasRef.current
            ?.toDataURL("image/png")
            .replace("image/png", "image/octet-stream")}
        >
          Click here to download your image!
        </a>
      </div>
    </>
  );
}
