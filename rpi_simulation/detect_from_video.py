# python3
#
# Copyright 2019 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Example using TF Lite to detect objects with the Raspberry Pi camera."""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import argparse
import io
import re
import json
import time
import base64
from http.server import BaseHTTPRequestHandler, HTTPServer
from multiprocessing import Process, Pipe, Queue

import numpy as np
import tensorflow as tf
from six import BytesIO
import six
from PIL import Image
import cv2
import matplotlib.pyplot as plt
import requests

from annotation import Annotator
from object_detection.utils import visualization_utils as viz_utils


VIDEO_SOURCE_PATH = '../footage/20160619 to 20160621 San Diego Border Fire (trimmed to fire).mp4'
MODEL_PATH = '../model/sample_saved_model'
API_EVENTS_ENDPOINT = 'http://localhost:8000/api/camera-events'
# MODEL_PATH = '../model/trained_model_efficientdet_d0_5000_steps'

# Load the Smoke Label Map
category_index = {
    1: {'id': 1, 'name': 'humo'},
}


def load_image_into_numpy_array(path):
    """Load an image from file into a numpy array.

    Puts image into numpy array to feed into tensorflow graph.
    Note that by convention we put it into a numpy array with shape
    (height, width, channels), where channels=3 for RGB.

    Args:
      path: a file path (this can be local or on colossus)

    Returns:
      uint8 numpy array with shape (img_height, img_width, 3)
    """
    img_data = tf.io.gfile.GFile(path, 'rb').read()
    image = Image.open(BytesIO(img_data))
    (im_width, im_height) = image.size
    return np.array(image.getdata()).reshape(
        (im_height, im_width, 3)).astype(np.uint8)


def single_image_inference(image_path: str):
    detect_fn = tf.saved_model.load(MODEL_PATH)
    image_np = load_image_into_numpy_array(image_path)
    input_tensor = np.expand_dims(image_np, 0)
    start_time = time.time()
    detections = detect_fn(input_tensor)
    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f'running inference, took: {elapsed_time} ms')

    plt.rcParams['figure.figsize'] = [42, 21]
    label_id_offset = 1
    image_np_with_detections = image_np.copy()

    plot_detections(
        image_np_with_detections,
        detections['detection_boxes'][0].numpy(),
        detections['detection_classes'][0].numpy().astype(np.uint32),
        detections['detection_scores'][0].numpy(),
        category_index,
        figsize=(15, 20),
        image_name="test_result.jpg",
        render_image=True
    )


def plot_detections(image_np,
                    boxes,
                    classes,
                    scores,
                    category_index,
                    figsize=(12, 16),
                    image_name=None,
                    render_image=False
                    ):
    """Wrapper function to visualize detections.

    Args:
      image_np: uint8 numpy array with shape (img_height, img_width, 3)
      boxes: a numpy array of shape [N, 4]
      classes: a numpy array of shape [N]. Note that class indices are 1-based,
        and match the keys in the label map.
      scores: a numpy array of shape [N] or None.  If scores=None, then
        this function assumes that the boxes to be plotted are groundtruth
        boxes and plot all boxes as black with no classes or scores.
      category_index: a dict containing category dictionaries (each holding
        category index `id` and category name `name`) keyed by category indices.
      figsize: size for the figure.
      image_name: a name for the image file.
    """
    image_np_with_annotations = image_np.copy()
    viz_utils.visualize_boxes_and_labels_on_image_array(
        image_np_with_annotations,
        boxes,
        classes,
        scores,
        category_index,
        use_normalized_coordinates=True,
        min_score_thresh=0.3)

    if render_image:
        if image_name:
            plt.imsave(image_name, image_np_with_annotations)
        else:
            plt.imshow(image_np_with_annotations)

    return image_np_with_annotations


def get_camera_event_payload(score, image_np_with_detections):
    alerting_threshold = 50
    if score < alerting_threshold:
        return json.dumps({
            'camera_id': 1,
            'status': 'ok'
        })

    image_capture = numpy_image_to_base64_string(image_np_with_detections)
    with open("test_base64.txt", "w+") as f:
        f.write(image_capture)

    return json.dumps({
        'camera_id': 1,
        'status': 'smoke_detected',
        'score': score,
        'image_capture': image_capture
    })


def get_smoke_detection_score(boxes, classes, scores):
    for i in range(boxes.shape[0]):
        if scores is not None and classes[i] in six.viewkeys(category_index):
            class_name = category_index[classes[i]]['name']
            score = round(100*scores[i])
            return score

    return 0


def numpy_image_to_base64_string(image_np):
    print('about to encode image')
    # image_np = cv2.resize(image_np, (300, 300))
    # print('1')
    image_np = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)
    success, image_bytes = cv2.imencode('.jpg', image_np)

    return base64.b64encode(image_bytes).decode('utf-8')

# def get_smoke_detection_score(boxes, classes, scores):
#     min_score_threshold = .2

#     for i in range(boxes.shape[0]):
#         if scores is None or scores[i] > min_score_threshold:
#             display_str = ''
#             if classes[i] in six.viewkeys(category_index):
#                 class_name = category_index[classes[i]]['name']
#                 score = round(100*scores[i])
#                 return score


def run_tensorflow_inference(queue: Queue):
    detect_fn = tf.saved_model.load(MODEL_PATH)
    cap = cv2.VideoCapture(VIDEO_SOURCE_PATH)
    fps = 50
    out = cv2.VideoWriter('output.avi', cv2.VideoWriter_fourcc(
        *'mp4v'), fps, (640, 480), True)

    elapsed = []
    while cap.isOpened():
        # Reads frame
        ret, image_np = cap.read()
        # Transform frame from BGR to RBG!
        image_np = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)

        if ret == True:
            input_tensor = np.expand_dims(image_np, 0)
            start_time = time.time()
            detections = detect_fn(input_tensor)
            end_time = time.time()
            elapsed_time = end_time - start_time
            print(f'running inference, took: {elapsed_time} ms')
            elapsed.append(elapsed_time)

            plt.rcParams['figure.figsize'] = [42, 21]
            label_id_offset = 1

            image_np_with_detections = plot_detections(
                image_np.copy(),
                detections['detection_boxes'][0].numpy(),
                detections['detection_classes'][0].numpy().astype(np.uint32),
                detections['detection_scores'][0].numpy(),
                category_index,
                figsize=(15, 20),
                image_name="detection.jpg"
            )
            score = get_smoke_detection_score(
                detections['detection_boxes'][0].numpy(),
                detections['detection_classes'][0].numpy().astype(np.uint32),
                detections['detection_scores'][0].numpy()
            )

            # TODO prevent flooding server with OK messages. Send one per minute.
            payload = get_camera_event_payload(score, image_np_with_detections)

            print('about to send req')
            response = requests.post(API_EVENTS_ENDPOINT, data=payload)
            print('req sent')
            print(response.text)

            queue.put(image_np_with_detections)
            out.write(image_np_with_detections)
            cv2.imshow('Output', image_np_with_detections)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                cv2.destroyAllWindows()
                break
        else:
            break

    cap.release()
    out.release()
    cv2.destroyAllWindows()


def run_video_stream(queue: Queue):
    class CamHandler(BaseHTTPRequestHandler):
        def do_GET(self):
            if self.path.endswith('.mjpg'):
                self.send_response(200)
                self.send_header(
                    'Content-type', 'multipart/x-mixed-replace; boundary=--jpgboundary')
                self.end_headers()
                stream = io.BytesIO()
                try:
                    start = time.time()
                    while True:
                        image_np = queue.get()
                        image_np = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)
                        success, encoded_image = cv2.imencode('.jpg', image_np)
                        bytes_stream = encoded_image.tobytes()

                        self.wfile.write(bytes("--jpgboundary", "utf8"))
                        self.send_header('Content-type', 'image/jpeg')
                        self.send_header('Content-length',
                                         len(bytes_stream))
                        self.end_headers()
                        self.wfile.write(bytes_stream)
                except KeyboardInterrupt:
                    pass
                return
            else:
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(
                    bytes("<html><head></head><body><img src='/cam.mjpg'/></body></html>", "utf8"))
                return

    try:
        server = HTTPServer(('', 8080), CamHandler)
        print("server started")
        server.serve_forever()
    except KeyboardInterrupt:
        server.socket.close()


if __name__ == '__main__':
    queue = Queue()
    # Producer
    tf_proc = Process(target=run_tensorflow_inference, args=[queue])
    tf_proc.start()

    # Consumer
    video_stream_proc = Process(target=run_video_stream, args=[queue])
    video_stream_proc.start()

    tf_proc.join()
