import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import gradient from "chartjs-plugin-gradient";
Chart.register(CategoryScale);
Chart.register(gradient);

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export default function BarVisualizer({
  audioBuffer,
  handleStop,
}: {
  audioBuffer: ArrayBuffer;
  handleStop: Function;
}) {
  const [musicArray, setMusicArray] = useState<number[]>();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  let hook = true;

  const audioVisualizerLogic = () => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const source = audioContext.createBufferSource();

    audioContext.decodeAudioData(audioBuffer, (buffer) => {
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
    });

    //mute or play on click
    const mutePlay = () => {
      audioContext.state === "running"
        ? audioContext.suspend()
        : audioContext.resume();

      setIsPlaying((prev) => !prev);
    };

    let muteButton = buttonRef.current;
    if (muteButton) muteButton.onclick = () => mutePlay();

    //config audio analyzer
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount,
      dataArray = new Uint8Array(bufferLength);

    let count = 0;
    //core logic for the visualizer
    const renderFrame = () => {
      if (hook) {
        requestAnimationFrame(renderFrame);
        setMusicArray(Array.from(dataArray));
        analyser.getByteFrequencyData(dataArray);
      } else {
        audioContext.close();
      }
    };

    renderFrame();
  };

  const options = {
    animation: {
      duration: 100,
    },
    easing: "linear",
    responsive: true,
    scales: {
      x: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        max: 300,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };
  const emptyArray = new Array(128);
  const labels = emptyArray.fill(" ", 0, 128);
  const data = {
    labels,
    datasets: [
      {
        data: musicArray,
        fill: 1,

        gradient: {
          backgroundColor: {
            axis: "y",
            colors: {
              0: "#880afc",
              250: "#b975ff",
            },
          },
        },
      },
    ],
  };

  useEffect(() => {
    audioVisualizerLogic();
    return () => {
      hook = false;
    };
  }, []);
  return (
    <main className="main">
      <button className="contextButton" ref={buttonRef}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      <button
        className="stopButton"
        onClick={() => {
          handleStop();
        }}
      >
        stop
      </button>
      <Bar
        style={{ maxHeight: "80vh", maxWidth: "100vw" }}
        data={data}
        options={options}
      />
    </main>
  );
}
