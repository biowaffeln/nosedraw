import { useRef, useEffect, useReducer } from "react";
import * as posenet from "@tensorflow-models/posenet";

async function setupCamera(video) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: "user" },
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
      video.onloadeddata = () => {
        resolve();
      };
    });
  } catch (e) {
    return new Promise((_, reject) => {
      reject(e);
    });
  }
}
async function estimatePoseOnVideo(net, video) {
  const pose = await net.estimateSinglePose(video, {
    flipHorizontal: true,
  });
  return pose;
}

const reducer = (_, action) => {
  switch (action.type) {
    case "success":
      return { status: "success" };
    case "error":
      return { status: "error", error: action.payload };
  }
};

const defaultState = {
  status: "loading",
};

export default function usePose(callback) {
  const videoRef = useRef();
  const posenetRef = useRef();
  const [state, dispatch] = useReducer(reducer, defaultState);
  let animationId;

  /* load posenet */
  useEffect(() => {
    (async () => {
      try {
        await setupCamera(videoRef.current);
        if (!posenetRef.current) posenetRef.current = await posenet.load();
        /* net successfully loaded */
        dispatch({ type: "success" });
      } catch (e) {
        /* error loading net */
        dispatch({ type: "error", payload: e });
      }
    })();
  }, []);

  /* setup animation */
  useEffect(() => {
    if (state.status !== "success") return;

    async function loop() {
      const pose = await estimatePoseOnVideo(
        posenetRef.current,
        videoRef.current
      );
      callback(pose);
      animationId = requestAnimationFrame(loop);
    }
    animationId = requestAnimationFrame(loop);
    /* clear animation */
    return () => animationId && cancelAnimationFrame(id);
  }, [callback, state]);

  return [videoRef, state];
}
