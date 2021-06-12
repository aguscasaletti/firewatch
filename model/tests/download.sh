#!/bin/bash

# Install required packages
python3 -m pip install -r requirements.txt

# Get Model
wget http://download.tensorflow.org/models/object_detection/tf2/20200711/efficientdet_d0_coco17_tpu-32.tar.gz -O /tmp/model.tar.gz
tar xvf /tmp/model.tar.gz
rm /tmp/model.tar.gz


# Get a labels file with corrected indices, delete the other one
(cd ${DATA_DIR} && curl -O  https://dl.google.com/coral/canned_models/coco_labels.txt)
rm ${DATA_DIR}/labelmap.txt

# Get version compiled for Edge TPU
(cd ${DATA_DIR} && curl -O  https://dl.google.com/coral/canned_models/mobilenet_ssd_v2_coco_quant_postprocess_edgetpu.tflite)

echo -e "Files downloaded to ${DATA_DIR}"
