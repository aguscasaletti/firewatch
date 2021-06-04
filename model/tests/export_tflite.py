import argparse
import tensorflow as tf


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument(
        '--model', help='File path of SavedModel directory.', required=True)
    args = parser.parse_args()

    # Convert the model
    converter = tf.lite.TFLiteConverter.from_saved_model(args.model)
    # converter.allow_custom_ops = True
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    converter.experimental_new_converter = True
    converter.target_spec.supported_ops = [
        tf.lite.OpsSet.TFLITE_BUILTINS, tf.lite.OpsSet.SELECT_TF_OPS]
    tflite_model = converter.convert()

    # Save the model.
    with open(f'models/{args.model}.tflite', 'wb') as f:
        f.write(tflite_model)
