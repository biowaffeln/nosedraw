import usePose from "../hooks/usePose";
import { useRef } from "react";
import { circle, clear, lerp } from "../util";

export default function Canvas() {
  const noseCanvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  let prevX, prevY;
  let noseCtx, drawCtx;

  const [videoRef, { status, error }] = usePose((pose) => {
    if (!noseCtx) noseCtx = noseCanvasRef.current.getContext("2d");
    if (!drawCtx) drawCtx = noseCanvasRef.current.getContext("2d");

    clear(noseCtx);

    if (pose.keypoints[0].score < 0.2) return;

    let { x, y } = pose.keypoints[0].position;
    if (prevX && prevY) {
      x = lerp(prevX, x, 0.5);
      y = lerp(prevY, y, 0.5);
    }

    circle(noseCtx, x, y, 30, "tomato");
    prevX = x;
    prevY = y;
  });

  return (
    <div>
      <div className="canvas-container rounded overflow-hidden shadow-lg">
        <video ref={videoRef} width={640} height={480} autoPlay />
        <canvas ref={noseCanvasRef} width={640} height={480} />
        <canvas ref={drawCanvasRef} width={640} height={480} />
      </div>
    </div>
  );
}
