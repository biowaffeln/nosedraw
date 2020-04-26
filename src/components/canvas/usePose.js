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
  let intervalId;

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
    /* only run when model is loaded */
    if (state.status !== "success") return;
    async function loop() {
      const pose = await estimatePoseOnVideo(
        posenetRef.current,
        videoRef.current
      );
      callback(pose);
    }
    intervalId = setInterval(loop, 100);
    /* clear animation */
    return () => {
      console.log("cancel");
      intervalId && clearInterval(intervalId);
    };
  }, [callback, state]);

  return [videoRef, state];
}
