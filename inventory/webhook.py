import requests
import logging
from decouple import config

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

TOKEN = config("TELEGRAM_TOKEN")
CHAT_ID = "-1002084597891"


def telebot_send_text(text, photo, topic):
    TOPICS = {
        "Deletion": "2",
        "Expiry/Low qty": "13",
        "Orders": "15",
        "Loans & Returns": "8",
    }

    if topic in TOPICS:
        if photo is not None:
            message = f"https://api.telegram.org/bot{TOKEN}/sendPhoto?chat_id={CHAT_ID}&parse_mode=HTML&caption={text}&photo={photo}&reply_to_message_id={TOPICS[topic]}"
        else:
            message = f"https://api.telegram.org/bot{TOKEN}/sendMessage?chat_id={CHAT_ID}&parse_mode=HTML&text={text}&reply_to_message_id={TOPICS[topic]}"

    if topic not in topics:
        raise ValueError(
            f"Invalid topic: {topic}. Topic must be one of {list(TOPICS.keys())}"
        )

        logger.debug(f"Sending request: {message}")

        response = requests.get(message)
        logger.debug(f"Response status code: {response.status_code}")
        logger.debug(f"Response content: {response.text}")

        return response.json()
