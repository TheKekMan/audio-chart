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
  h0: string;
  h50: string;
  h100: string;
  h150: string;
  h200: string;
  h250: string;
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
    h0: "#880afc",
    h50: "#880afc",
    h100: "#880afc",
    h150: "#b975ff",
    h200: "#b975ff",
    h250: "#b975ff",
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
          <>
            <label htmlFor="contained-button-file">
              <Input
                id="contained-button-file"
                type="file"
                hidden
                onChange={handleAudioSelected}
              />
              <AppButton>Upload Audio</AppButton>
            </label>
            <SettingsButton onClick={handleClickOpen}>
              <SettingsIcon />
            </SettingsButton>
          </>
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
