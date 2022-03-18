import React, { useState } from "react";
import "./App.css";
import BarVisualizer from "./components/bar/BarVisualizer";

function App() {
  const [audioBuffer, setAudioBuffer] = useState<ArrayBuffer>();
  const [fileSelected, setFileSelected] = useState(false);
  const [isStop, setIsStop] = useState(true);

  const handleStop = () => {
    setIsStop((prev) => !prev);
  };

  const handleFile = (e: any) => {
    if (!e.target) return;
    const content = e.target.result;
    console.log(content);
    setAudioBuffer(content);
    setFileSelected(true);
    handleStop();
  };

  const handleAudioSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    let file = e.target.files[0],
      reader = new FileReader();
    if (file.type.includes("audio")) {
      reader.onloadend = handleFile;
      reader.readAsArrayBuffer(file);
    } else {
      e.target.value = "";
      alert("File must be audio");
    }
  };
  return (
    <div className="App">
      <h1>Audio Visualizer</h1>
      <div className="App">
        {fileSelected && !isStop ? null : (
          <input type={"file"} onChange={handleAudioSelected} />
        )}
        <div>
          {audioBuffer && !isStop ? (
            <BarVisualizer audioBuffer={audioBuffer} handleStop={handleStop} />
          ) : (
            <span> Choose audio</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
