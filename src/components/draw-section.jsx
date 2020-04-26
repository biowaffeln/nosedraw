import { useState, useRef } from "react";
import Canvas from "./canvas";

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

/* downloads an image from canvas */
const SaveImage = ({ canvas, className }) => {
  return (
    <div className={className}>
      <p className="text-xl">Done drawing?</p>
      <a
        className="inline-block text-2xl"
        download={"nosedraw.jpg"}
        href={canvas
          ?.toDataURL("image/png")
          .replace("image/png", "image/octet-stream")}
      >
        <span className="leading-relaxed border-b-2 border-indigo-600">
          Click here to download your image!
        </span>
      </a>
    </div>
  );
};

export default function DrawSection() {
  const canvasRef = useRef(null);

  const [pointerDown, setPointerDown] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [lineWidth, setLineWidth] = useState(widths[1]);
  const [strokeColor, setStrokeColor] = useState(colors[0]);

  return (
    <>
      <section className="flex flex-col xl:flex-row max-w-2xl mx-auto xl:max-w-full">
        <div className=" w-full xl:w-1/2 mb-12 xl:mb-0">
          <Canvas
            canvasRef={canvasRef}
            shouldDraw={pointerDown}
            showWebcam={showWebcam}
            lineWidth={lineWidth}
            strokeColor={strokeColor}
          />
        </div>
        <div className="flex flex-col-reverse xl:flex-col justify-between w-full xl:w-1/2 xl:px-8 text-lg">
          <div>
            <h2 className="font-semibold text-2xl text-center mb-3">
              Select a Color
            </h2>
            <div className="flex flex-wrap justify-center items-center mb-10">
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
            <div className="flex flex-wrap justify-center">
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
      </section>
      <SaveImage
        canvas={canvasRef.current}
        className="text-center pt-20 pb-32"
      />
    </>
  );
}
