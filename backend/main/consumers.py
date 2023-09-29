import json

from channels.generic.websocket import WebsocketConsumer

class VideoStreamConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, video_data):
        video_data_json = json.loads(video_data)
        frame = video_data_json["frame"]

        self.send(video_data=json.dumps({"message": "Frame received"}))