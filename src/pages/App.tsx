import React, { useEffect, useState } from "react";
import {
  AppMain,
  AppHeader,
  Input,
  AppButton,
  SettingsButton,
} from "./App.style";
import SettingsDialog from "../components/settings/SettingsDialog";
import SettingsIcon from "@mui/icons-material/Settings";
import AudioPlayer from "../components/bar/AudioPlayer";

interface IObjectKeys {
  [key: string]: string | number | boolean;
}

export interface VisualizerSettings extends IObjectKeys {
  h0: string;
  h50: string;
  h100: string;
  h150: string;
  h200: string;
  h250: string;
  loop: boolean;
  fftSize: number;
  fps: number;
  floating: boolean;
}

const defaultSettings: VisualizerSettings = {
  h0: "#880afc",
  h50: "#880afc",
  h100: "#880afc",
  h150: "#b975ff",
  h200: "#b975ff",
  h250: "#b975ff",
  loop: true,
  fftSize: 256,
  fps: 60,
  floating: false,
};

function App() {
  if (!localStorage.getItem("settings")) {
    localStorage.setItem("settings", JSON.stringify(defaultSettings));
  }

  const [fileSelected, setFileSelected] = useState(false);
  const [file, setFile] = useState<File>();
  const [stop, setStop] = useState(false);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<VisualizerSettings>(
    JSON.parse(localStorage.getItem("settings")!)
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleStop = () => {
    setStop((prev) => !prev);
    setFileSelected(false);
  };
  const handles = { handleClose, handleStop, handleClickOpen };

  const handleAudioSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    let file = e.target.files[0],
      reader = new FileReader();
    if (file.type.includes("audio")) {
      setFile(file);
      handleStop();
      setFileSelected(true);
    } else {
      e.target.value = "";
      alert("File must be audio");
    }
  };
  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);
  return (
    <AppMain className="App">
      <AppHeader>Audio Visualizer</AppHeader>
      <div className="App">
        {fileSelected ? null : (
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
          {file && stop ? (
            <AudioPlayer file={file} {...handles} settings={settings} />
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
