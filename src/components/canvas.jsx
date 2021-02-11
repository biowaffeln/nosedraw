import { useRef, useCallback } from "react";
import { circle, clear, lerp, line } from "./canvas/util";
import usePose from "./canvas/usePose";

export default function Canvas({
  canvasRef = useRef(null),
  lineWidth = 2,
  strokeColor = "#000",
  showWebcam = false,
  shouldDraw,
}) {
  const noseCanvasRef = useRef(null);
  let prevX, prevY;

  const [videoRef, { status }, dimensions] = usePose(
    useCallback(
      (pose) => {
        /* should never actually be undefined, but who knows */
        if (!noseCanvasRef.current || !canvasRef.current) return;

        const noseCtx = noseCanvasRef.current.getContext("2d");
        const drawCtx = canvasRef.current.getContext("2d");
        clear(noseCtx);

        if (pose.keypoints[0].score < 0.2) return;

        let { x, y } = pose.keypoints[0].position;
        if (prevX && prevY) {
          x = lerp(prevX, x, 0.5);
          y = lerp(prevY, y, 0.5);
        }
        circle(noseCtx, x, y, Math.max(lineWidth * 0.7, 4), strokeColor);
        if (prevX && shouldDraw) {
          line(drawCtx, prevX, prevY, x, y, lineWidth, strokeColor);
        }
        prevX = x;
        prevY = y;
      },
      [shouldDraw, lineWidth, strokeColor]
    )
  );

  const width = dimensions.width || 640;
  const height = dimensions.height || 480;

  return (
    <div className="canvas-container rounded overflow-hidden shadow-lg">
      <div className="flex flex-col justify-center items-center">
        {status === "loading" && (
          <p className="font-semibold text-2xl">loading posenet...</p>
        )}
        {status === "error" && (
          <>
            <p className="font-semibold text-2xl">error loading posenet :(</p>
            <p className="text-lg">please enable your camera</p>
          </>
        )}
      </div>
      <canvas ref={canvasRef} width={width} height={height} />
      <canvas ref={noseCanvasRef} width={width} height={height} />
      <video
        style={{ visibility: showWebcam ? "visible" : "hidden" }}
        ref={videoRef}
        width={width}
        height={height}
        autoPlay
      />
    </div>
  );
}
