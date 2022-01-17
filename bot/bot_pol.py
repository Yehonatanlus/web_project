from telegram import Bot

import sys
sys.path.append('..')
import config

bot = Bot(token=config.TOKEN)

def send_poll(chat_id, question, answers):
    res = bot.sendPoll(chat_id, question, answers, is_anonymous=False)
    return res.poll.id, res.message_id


def stop_poll(chat_ids, message_ids):
    for chat_id, message_id in zip(chat_ids, message_ids):
        bot.stopPoll(chat_id, message_id)


def remove_poll(chat_ids, message_ids):
    for chat_id, message_id in zip(chat_ids, message_ids):
        bot.deleteMessage(chat_id, message_id)
