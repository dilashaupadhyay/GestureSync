import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";

const WebcamComponent = () => {
    const [count, setCount] = useState(0);
    const [canChangeKeyword, setCanChangeKeyword] = useState(true);

    const [keyword, setKeyword] = useState('');
    const [sampleNo, setSampleNo] = useState(0);
    const webcamRef = useRef(null);

    const webcamSocket = new WebSocket(
        'ws://'
        + 'localhost:8000'
        + '/ws/main/'
    )

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
        const stream = await navigator.mediaDevices.getUserMedia({ video: true})
        webcamRef.current.video.srcObject = stream;

        const captureFrames = (frameCount=0) => {
            const canvas = document.createElement('canvas');
            const video = webcamRef.current.video;
            
            canvas.width = 640;
            canvas.height = 480;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL('image/jpeg');

            const data = {
                sampleNo: sampleNo,
                frameCount: frameCount,
                keyword: keyword,
                event: event,
                jpeg_base64: imageData,
            }
            webcamSocket.send(JSON.stringify(data))
            console.log(event)
        };

        if(event == 'record') {
            for(let i = 0; i < 10; i++) {
                captureFrames(i)
            }
        }
    };

    return (
        <div>
            <Webcam
                audio={false}
                ref={webcamRef}
                style={{width:640, height:480}}
            />
            <br/>
            <button onClick={() => startStream('translate')}>Translate</button>
            <input type='text' onChange={handleKeywordChange} value={keyword} disabled={!canChangeKeyword}></input>
            <button 
                onClick={() => {
                    startStream('record')
                    handleButtonClick()
                    if(sampleNo != 10)
                        setSampleNo(sampleNo + 1)
                    else
                        setSampleNo(0)
            }}>Record</button>
        </div>
    );
}

export default WebcamComponent;