from telegram import (
    Update,
)


def boterr_no_user_as_param(update: Update):
    update.message.reply_text(
        "Please specify username!"
    )


def boterr_multiple_users_params(update: Update):
    update.message.reply_text(
        "Please specify a single username!"
    )


def boterr_non_existing_user(update: Update):
    update.message.reply_text(
        "You didn't register for the service!"
    )


def boterr_already_existing_user(update: Update):
    update.message.reply_text(
        "You are already registered to the service!"
    )


