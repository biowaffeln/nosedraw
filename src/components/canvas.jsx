import usePose from "../hooks/usePose";
import { useRef, useState, useCallback } from "react";
import { circle, clear, lerp, line } from "../util";

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

const strokes = [2, 4, 8, 12, 16, 22, 30, 40];

export default function Canvas() {
  const noseCanvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  const [pointerDown, setPointerDown] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
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
        circle(noseCtx, x, y, 30);
        if (prevX && pointerDown) {
          line(drawCtx, prevX, prevY, x, y);
        }
        prevX = x;
        prevY = y;
      },
      [pointerDown]
    )
  );

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="canvas-container rounded overflow-hidden shadow-lg w-full lg:w-1/2">
        <canvas ref={drawCanvasRef} width={640} height={480} />
        <video
          style={{ visibility: showVideo ? "visible" : "hidden" }}
          ref={videoRef}
          width={640}
          height={480}
          autoPlay
        />
        <canvas ref={noseCanvasRef} width={640} height={480} />
      </div>
      <div className="flex flex-col justify-between w-full lg:w-1/2 lg:px-8 text-lg">
        <div>
          <h2 className="font-semibold text-2xl text-center mb-3">
            Select a Color
          </h2>
          <div className="flex flex-wrap justify-center mb-6">
            {colors.map((color) => (
              <div
                key={color}
                style={{ backgroundColor: color }}
                className="w-10 h-10 mr-3 mb-2 rounded-full"
              />
            ))}
          </div>
          <h2 className="font-semibold text-2xl text-center mb-3">
            Select a Stroke Width
          </h2>
          <div className="flex flex-wrap justify-center mb-6">
            {strokes.map((stroke) => (
              <div key={stroke}>
                <div className="w-10 h-10 mr-3 mb-2 flex flex-col items-center justify-center">
                  <div
                    style={{ width: stroke, height: stroke }}
                    className="bg-gray-900 rounded-full"
                  />
                </div>
                <p className="text-sm text-center">{stroke}px</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <button
            onClick={() => setShowVideo((s) => !s)}
            className="py-3 px-4 font-semibold text-center mb-2"
          >
            {showVideo ? "hide" : "show"} video
          </button>
          <button
            className="py-3 px-4 shadow-md bg-indigo-600 font-semibold text-gray-100 rounded"
            onPointerDown={() => setPointerDown(true)}
            onPointerUp={() => setPointerDown(false)}
          >
            tap here to draw!
          </button>
        </div>
      </div>
    </div>
  );
}
