import logging
from bot_errors import *
from bot_utils import *

import sys
sys.path.append('..')
import config

from telegram import (
    Update,
)
from telegram.ext import (
    Updater,
    CommandHandler,
    CallbackContext,
    PollAnswerHandler,
)

server_add = '127.0.0.1:5000'
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)
logger = logging.getLogger(__name__)


def start(update: Update, context: CallbackContext) -> None:
    print(update.message.chat_id)
    update.message.reply_text(
        "Hello user\n"
        "Please use one of the following commands:\n"
        "/register <user-name>\n"
        "/remove <user-name>\n"
    )


def register(update: Update, context: CallbackContext) -> None:
    if len(context.args) < 1:
        boterr_no_user_as_param(update)
    elif len(context.args) > 1:
        boterr_multiple_users_params(update)
    else:
        success = send_register_request(server_add,
                                        {'chat_id': update.message.chat_id, 'username': context.args[0]})
        if success:
            update.message.reply_text(
                f"Hello {context.args[0]}!\n"
                f"You are registered to the polling service."
            )
        else:
            boterr_already_existing_user(update)


def remove(update: Update, context: CallbackContext) -> None:
    if len(context.args) < 1:
        boterr_no_user_as_param(update)
    elif len(context.args) > 1:
        boterr_multiple_users_params(update)
    else:
        success = send_remove_request(server_add,
                                      {'chat_id': update.message.chat_id, 'username': context.args[0]})
        if success:
            update.message.reply_text(
                f"Bye {context.args[0]}!\n"
                f"You have been removed from the polling service."
            )
        else:
            boterr_non_existing_user(update)


def vote(update: Update, context: CallbackContext) -> None:
    t_poll_id = update.poll_answer.poll_id
    chat_id = update.poll_answer.user.id
    answer_number = update.poll_answer.option_ids
    if len(answer_number) > 0:
        answer_number = answer_number[0]
        send_poll_answer(server_add, {"t_poll_id": t_poll_id, "chat_id": chat_id, "answer_number": answer_number})
        # else:
    # remove vote


def main() -> None:
    """Run bot."""
    # Create the Updater and pass it your bot's token.
    updater = Updater(token=config.TOKEN)

    dispatcher = updater.dispatcher
    dispatcher.add_handler(CommandHandler('start', start, run_async=True))
    dispatcher.add_handler(CommandHandler('register', register, run_async=True))
    dispatcher.add_handler(CommandHandler('remove', remove, run_async=True))
    dispatcher.add_handler(PollAnswerHandler(vote, run_async=True))

    # Start the Bot
    updater.start_polling()

    # Run the bot until the user presses Ctrl-C or the process receives SIGINT,
    # SIGTERM or SIGABRT
    updater.idle()


if __name__ == '__main__':
    main()
