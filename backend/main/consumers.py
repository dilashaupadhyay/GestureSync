import json
import base64
import os
import numpy as np

from channels.generic.websocket import WebsocketConsumer

dataDir = os.path.join(os.getcwd(), 'datasets')

def fileCounter(path):
    count = 0;
    for file in (os.listdir(path)):
        if os.path.isfile(os.path.join(path, file)):
            count += 1;
    return count

def folderCounter(path):
    count = 0
    for file in (os.listdir(path)):
        if not os.path.isfile(os.path.join(path, file)):
            count += 1
    return count

class VideoStreamConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        data = json.loads(text_data)
        sampleNo = data.get('sampleNo', None)
        frameNo = data.get('frameCount', None)
        keyword = data.get('keyword', None)
        event = data.get('event', None)
        jpeg_base64 = data.get('jpeg_base64', None)

        if jpeg_base64:
            if event == 'record':
                try:
                    image_data = base64.b64decode(jpeg_base64)
                except Exception as e:
                    response_data = {'error': 'Invalid base64 encoding!'}
                    self.send(text_data=json.dumps(response_data))
                    return

                try:
                    image_np = np.frombuffer(image_data, np.uint8)
                except Exception as e:
                    response_data = {'error': 'Failed to convert image to NumPy array!'}
                    self.send(text_data=json.dumps(response_data))
                    return

                directory = os.path.join(dataDir, keyword, str(sampleNo))
                os.makedirs(directory, exist_ok=True)

                filename = str(frameNo) + '.npy'

                npy_path = os.path.join(directory, filename)

                try:
                    np.save(npy_path, image_np)
                except Exception as e:
                    response_data = {'error': 'Failed to save the .npy file'}
                    self.send(text_data=json.dumps(response_data))
                    return
                
                response_data = {'message': 'NumPy .npy file saved successfully'}
                self.send(text_data=json.dumps(response_data))

        self.send(text_data=json.dumps({"message": "Frame received"}))