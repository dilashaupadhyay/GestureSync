import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import io from 'socket.io-client';

const WebcamComponent = () => {
    const webcamRef = useRef(null);
    const webcamSocket = new WebSocket(
        'ws://'
        + 'localhost:8000'
        + '/ws/main/'
    )

    return (
        <Webcam
            audio={false}
            ref={webcamRef}
            style={{width:640, height:480}}
        />
    );
}

export default WebcamComponent;