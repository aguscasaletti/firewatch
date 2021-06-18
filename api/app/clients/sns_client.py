
import logging
import boto3
import os
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)


def publish_text_message(phone_number, message):
    """
    Publishes a text message directly to a phone number without need for a
    subscription.

    :param phone_number: The phone number that receives the message. This must be
                            in E.164 format. For example, a United States phone
                            number might be +12065550101.
    :param message: The message to send.
    :return: The ID of the message.
    """
    try:
        logging.basicConfig(level=logging.INFO,
                            format='%(levelname)s: %(message)s')
        aws_access_key_id = os.getenv('SNS_USER_ACCESS_KEY_ID')
        aws_secret_access_key = os.getenv('SNS_USER_SECRET_KEY')

        resource = boto3.resource(
            'sns', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)
        response = resource.meta.client.publish(
            PhoneNumber=phone_number, Message=message)
        message_id = response['MessageId']
    except ClientError:
        logger.exception("Couldn't publish message to %s.", phone_number)
        raise
    else:
        return message_id
