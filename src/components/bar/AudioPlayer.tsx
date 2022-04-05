import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import gradient from "chartjs-plugin-gradient";
import { PlayButton, BarMain, TinyText } from "./AudioPlayer.style";
import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { Box, Slider, Stack } from "@mui/material";
import { VisualizerSettings } from "../../pages/App";
import { VolumeDown, VolumeUp } from "@mui/icons-material";
Chart.register(CategoryScale);
Chart.register(gradient);

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

if (!localStorage.getItem("volume")) {
  localStorage.setItem("volume", "0.5");
}

export default function AudioPlayer({
  file,
  handleClose,
  handleClickOpen,
  handleStop,
  settings,
}: {
  file: File;
  handleClose: any;
  handleClickOpen: any;
  handleStop: any;
  settings: VisualizerSettings;
}) {
  const [musicArray, setMusicArray] = useState<number[]>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState<number>(
    Number(localStorage.getItem("volume"))
  );
  const [position, setPosition] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [audioCtx] = useState<AudioContext>(new AudioContext());
  const [analyserNode] = useState<AnalyserNode>(audioCtx.createAnalyser());
  const [gainNode] = useState<GainNode>(audioCtx.createGain());
  const [dataArray, setDataArray] = useState(new Uint8Array());

  function formatDuration(value: number) {
    const minute = Math.floor(value / 60);
    const secondLeft = Math.floor(value - minute * 60);
    return `${minute}:${secondLeft < 9 ? `0${secondLeft}` : secondLeft}`;
  }

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
    localStorage.setItem("volume", newValue.toString());
    if (gainNode) {
      gainNode.gain.value = newValue as number;
    }
  };
  function initializeAudio() {
    audioRef.current!.src = URL.createObjectURL(file);
    gainNode.gain.value = volume;
    const track = audioCtx.createMediaElementSource(audioRef.current!);
    analyserNode.fftSize = settings.fftSize;
    const bufferLength = analyserNode.frequencyBinCount;
    setDataArray(new Uint8Array(bufferLength));
    analyserNode.getByteFrequencyData(dataArray);

    track.connect(gainNode).connect(analyserNode).connect(audioCtx.destination);
  }

  const attachHandlers = () => {
    if (audioRef.current) {
      const audio = audioRef.current;

      audio.addEventListener(
        "loadedmetadata",
        () => {
          setDuration(audio.duration);
          audio.loop = settings.loop;
        },
        false
      );

      audio.addEventListener(
        "ended",
        () => {
          if (!audio.loop) setPlaying(false);
        },
        false
      );

      audio.addEventListener(
        "timeupdate",
        () => {
          setPosition(audio.currentTime);
        },
        false
      );

      audio.addEventListener(
        "play",
        () => {
          setPlaying(true);
        },
        false
      );
      audio.addEventListener(
        "pause",
        () => {
          setPlaying(false);
        },
        false
      );
    }
  };

  const seekTo = (value: any) => {
    audioRef.current!.currentTime = value;
  };

  const togglePlay = async () => {
    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }
    if (audioRef.current) {
      const audio = audioRef.current;
      if (playing) {
        setPlaying(false);
        return audio.pause();
      }
      setPlaying(true);
      return audio.play();
    }
  };

  const options = {
    animation: {
      duration: 100,
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
        max: settings.floating ? 150 : 300,
        min: settings.floating ? -20 : 0,
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
  const labels = new Array(
    settings.floating ? +settings.fftSize : settings.fftSize / 2
  ).fill(" ");

  const data = {
    labels,
    datasets: [
      {
        data:
          musicArray && settings.floating
            ? musicArray
                .slice()
                .reverse()
                .concat(musicArray)
                .map((data) => {
                  return [0, data * 0.5];
                })
            : musicArray,
        fill: 1,
        borderRadius: settings.floating ? Number.MAX_VALUE : 0,
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

  const fps = settings.fps;

  useLayoutEffect(() => {
    if (playing) {
      let timerId: any;

      setInterval(() => {
        analyserNode.getByteFrequencyData(dataArray);
      }, 1000 / fps);

      const updateFrequency = () => {
        if (audioCtx.state === "suspended") return;
        // analyserNode.getByteFrequencyData(dataArray);
        setMusicArray(Array.from(dataArray));

        timerId = requestAnimationFrame(updateFrequency);
      };

      timerId = requestAnimationFrame(updateFrequency);
      return () => cancelAnimationFrame(timerId);
    }
  }, [playing]);

  useEffect(() => {
    initializeAudio();
    attachHandlers();
    return () => {
      setPlaying(false);
    };
  }, []);
  return (
    <BarMain>
      <audio style={{ display: "none" }} ref={audioRef} controls={true} />
      <Stack direction={"row"}>
        <PlayButton size={"large"} onClick={togglePlay}>
          {playing ? <PauseIcon /> : <PlayArrowIcon />}
        </PlayButton>
        <Box sx={{ width: "17em", paddingTop: "10px" }}>
          <Slider
            aria-label="time-indicator"
            size="small"
            value={position}
            min={0}
            step={0.001}
            max={duration}
            ref={progressRef}
            onChange={(_, value) => {
              setPosition(value as number);
              seekTo(value as number);
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: -2,
            }}
          >
            <TinyText>{formatDuration(position)}</TinyText>
            <TinyText>-{formatDuration(duration - position)}</TinyText>
          </Box>
        </Box>
        <PlayButton
          size={"large"}
          onClick={() => {
            handleStop();
          }}
        >
          <StopIcon />
        </PlayButton>
      </Stack>
      <Box sx={{ width: 200, marginTop: "1em" }}>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          <VolumeDown />
          <Slider
            aria-label="Volume"
            value={volume}
            min={0}
            max={1}
            step={0.01}
            onChange={handleVolumeChange}
          />
          <VolumeUp />
        </Stack>
      </Box>
      <Bar
        style={{ maxHeight: "80vh", maxWidth: "100vw" }}
        data={data}
        options={options}
      />
    </BarMain>
  );
}
