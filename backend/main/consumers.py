import json

from channels.generic.websocket import WebsocketConsumer

class VideoStreamConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        data = json.loads(text_data)
        jpeg_base64 = data.get('jpeg_base64', None)
        counter = data.get('counter')

        if jpeg_base64:
            self.send(text_data=json.dumps({"message": "Frame received"}))
            print(counter)