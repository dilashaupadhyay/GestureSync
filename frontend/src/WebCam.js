import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";

const WebcamComponent = () => {
    const webcamRef = useRef(null);

    const webcamSocket = new WebSocket(
        'ws://'
        + 'localhost:8000'
        + '/ws/main/'
    )

    const startStream = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true})
        webcamRef.current.video.srcObject = stream;

        const captureFrames = () => {
            const canvas = document.createElement('canvas');
            const video = webcamRef.current.video;
            
            canvas.width = 640;
            canvas.height = 480;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL('image/jpeg');

            const data = {
                jpeg_base64: imageData,
            }
            webcamSocket.send(JSON.stringify(data))
            console.log('frame sent')
        };

        for(let i = 0; i < 1000; i++) {
            captureFrames()
        }
    };

    return (
        <div>
            <Webcam
                audio={false}
                ref={webcamRef}
                style={{width:640, height:480}}
            />
            <button onClick={startStream}>Translate</button>
        </div>
    );
}

export default WebcamComponent;