import Webcam from "react-webcam";
import React, { useState, useRef, useEffect } from "react";

const WebcamComponent = () => {
  const [count, setCount] = useState(0);
  const [canChangeKeyword, setCanChangeKeyword] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [sampleNo, setSampleNo] = useState(0);
  const webcamRef = useRef(null);
  const webcamSocket = useRef(null);

  useEffect(() => {
    // Initialize the WebSocket connection
    webcamSocket.current = new WebSocket("ws://localhost:8000/ws/main/");

    // Set up an event listener for when the WebSocket connection is open
    webcamSocket.current.onopen = () => {
      console.log("WebSocket connection is open");
    };
  }, []);

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleButtonClick = () => {
    if (count < 10) {
      setCanChangeKeyword(false);
      setCount(count + 1);

      if (count === 9) {
        setCount(0);
        setCanChangeKeyword(true);
      }
    }
  };

  const startStream = async (event) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    webcamRef.current.video.srcObject = stream;

    const captureFrames = (frameCount = 0) => {
      const canvas = document.createElement("canvas");
      const video = webcamRef.current.video;

      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/jpeg");

      const data = {
        sampleNo: sampleNo,
        frameCount: frameCount,
        keyword: keyword,
        event: event,
        jpeg_base64: imageData,
      };

      // Check if the WebSocket connection is open before sending data
      if (webcamSocket.current.readyState === WebSocket.OPEN) {
        webcamSocket.current.send(JSON.stringify(data));
        console.log(event);
      } else {
        console.log("WebSocket connection is not open");
      }
    };

    if (event === "record") {
      for (let i = 0; i < 10; i++) {
        captureFrames(i);
      }
    }
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        style={{ width: 640, height: 480 }}
      />
      <br />
      <button onClick={() => startStream("translate")}>Translate</button>
      <input
        type="text"
        onChange={handleKeywordChange}
        value={keyword}
        disabled={!canChangeKeyword}
      />
      <button
        onClick={() => {
          startStream("record");
          handleButtonClick();
          if (sampleNo !== 10) setSampleNo(sampleNo + 1);
          else setSampleNo(0);
        }}
      >
        Record
      </button>
    </div>
  );
};

export default WebcamComponent;
