import usePose from "../hooks/usePose";
import { useRef, useState, useCallback } from "react";
import { circle, clear, lerp, line } from "../util";

export default function Canvas() {
  const noseCanvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  const [mouseDown, setMouseDown] = useState(false);
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
        if (prevX && mouseDown) {
          line(drawCtx, prevX, prevY, x, y);
        }
        prevX = x;
        prevY = y;
      },
      [mouseDown]
    )
  );

  return (
    <div>
      <div className="canvas-container rounded overflow-hidden shadow-lg">
        <video ref={videoRef} width={640} height={480} autoPlay />
        <canvas ref={noseCanvasRef} width={640} height={480} />
        <canvas ref={drawCanvasRef} width={640} height={480} />
      </div>
      <div className="flex">
        <button
          className="py-2 px-4 font-lg bg-gray-900"
          onMouseDown={() => setMouseDown(true)}
          onMouseUp={() => setMouseDown(false)}
        >
          draw
        </button>
      </div>
    </div>
  );
}
