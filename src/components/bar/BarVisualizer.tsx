import React, { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import gradient from "chartjs-plugin-gradient";
import { PlayButton, BarMain } from "./BarVisualizer.style";
import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { Box, Slider, Stack } from "@mui/material";
import { VisualizerSettings } from "../../App";
import { VolumeDown, VolumeUp } from "@mui/icons-material";
Chart.register(CategoryScale);
Chart.register(gradient);

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export default function BarVisualizer({
  audioBuffer,
  handleClose,
  handleClickOpen,
  handleStop,
  settings,
}: {
  audioBuffer: ArrayBuffer;
  handleClose: any;
  handleClickOpen: any;
  handleStop: any;
  settings: VisualizerSettings;
}) {
  const [musicArray, setMusicArray] = useState<number[]>();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = React.useState<number>(-1);
  const [gainNode, setGainNode] = React.useState<GainNode>();
  let hook = true;

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
    if (gainNode) {
      gainNode.gain.value = volume;
    }
  };

  const audioVisualizerLogic = () => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const source = audioContext.createBufferSource();

    audioContext.decodeAudioData(audioBuffer, (buffer) => {
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.loop = settings.loop;
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

    //config audio sound
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    source.connect(gainNode).connect(audioContext.destination);
    setGainNode(gainNode);

    //config audio analyzer
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = settings.fftSize;
    const bufferLength = analyser.frequencyBinCount,
      dataArray = new Uint8Array(bufferLength);

    //core logic for the visualizer
    const renderFrame = () => {
      if (
        source.buffer &&
        audioContext.currentTime >= source.buffer.duration &&
        !settings.loop
      ) {
        handleStop();
        source.buffer = null;
      }
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
      duration: 50,
    },
    easing: "linear",
    responsive: true,
    scales: {
      x: {
        display: false,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
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
  const emptyArray = new Array(settings.fftSize / 2);
  const labels = emptyArray.fill(" ", 0, settings.fftSize / 2);
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
              0: settings.h0,
              50: settings.h50,
              100: settings.h100,
              150: settings.h150,
              200: settings.h200,
              250: settings.h250,
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
    <BarMain>
      <Stack direction={"row"}>
        <PlayButton
          variant="contained"
          startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          ref={buttonRef}
        >
          {isPlaying ? "Pause" : "Play"}
        </PlayButton>
        <PlayButton
          variant="contained"
          startIcon={<StopIcon />}
          onClick={() => {
            handleStop();
          }}
        >
          Stop
        </PlayButton>
      </Stack>
      <Box sx={{ width: 200, marginTop: "1em" }}>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          <VolumeDown />
          <Slider
            aria-label="Volume"
            value={volume}
            min={-2}
            max={-1}
            step={0.01}
            onChange={handleVolumeChange}
          />
          <VolumeUp />
        </Stack>
      </Box>
      <Bar
        style={{ maxHeight: "85vh", maxWidth: "100vw" }}
        data={data}
        options={options}
      />
    </BarMain>
  );
}
