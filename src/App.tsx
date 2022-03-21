import React, { useState } from "react";
import {
  AppMain,
  AppHeader,
  Input,
  AppButton,
  SettingsButton,
} from "./App.style";
import BarVisualizer from "./components/bar/BarVisualizer";
import SettingsDialog from "./components/settings/SettingsDialog";
import SettingsIcon from "@mui/icons-material/Settings";

export interface VisualizerSettings {
  h: {
    0: string;
    50: string;
    100: string;
    150: string;
    200: string;
    250: string;
  };
  loop: boolean;
  fftSize: number;
}

function App() {
  const [audioBuffer, setAudioBuffer] = useState<ArrayBuffer>();
  const [fileSelected, setFileSelected] = useState(false);
  const [file, setFile] = useState<File>();
  const [isStop, setIsStop] = useState(true);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<VisualizerSettings>({
    h: {
      0: "#880afc",
      50: "#880afc",
      100: "#880afc",
      150: "#b975ff",
      200: "#b975ff",
      250: "#b975ff",
    },
    loop: true,
    fftSize: 256,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleStop = () => {
    setIsStop((prev) => !prev);
  };

  const handles = { handleClose, handleStop, handleClickOpen };
  const handleFile = (e: any) => {
    if (!e.target) return;
    const content = e.target.result;
    setAudioBuffer(content);
    setFileSelected(true);
    handleStop();
  };

  const handleAudioSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    let file = e.target.files[0],
      reader = new FileReader();
    if (file.type.includes("audio")) {
      setFile(file);
      reader.onloadend = handleFile;
      reader.readAsArrayBuffer(file);
    } else {
      e.target.value = "";
      alert("File must be audio");
    }
  };
  return (
    <AppMain className="App">
      <AppHeader>Audio Visualizer</AppHeader>
      <div className="App">
        {fileSelected && !isStop ? null : (
          <label htmlFor="contained-button-file">
            <Input
              id="contained-button-file"
              type="file"
              hidden
              onChange={handleAudioSelected}
            />
            <AppButton>Upload Audio</AppButton>
            <SettingsButton onClick={handleClickOpen}>
              <SettingsIcon />
            </SettingsButton>
          </label>
        )}
        <div>
          {audioBuffer && !isStop ? (
            <BarVisualizer
              audioBuffer={audioBuffer}
              {...handles}
              settings={settings}
            />
          ) : null}
        </div>
      </div>
      <SettingsDialog
        open={open}
        handleClose={handleClose}
        setSettings={setSettings}
        settings={settings}
      />
    </AppMain>
  );
}

export default App;
