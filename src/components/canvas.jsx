import usePose from "../hooks/usePose";

export default function Canvas() {
  const [videoRef, { status, error }] = usePose((pose) => {
    console.log(pose.keypoints[0].position);
  });

  return (
    <div>
      <video ref={videoRef} width={640} height={480} autoPlay />
      <canvas width={640} height={480} />
    </div>
  );
}
