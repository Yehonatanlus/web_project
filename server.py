from flask import Flask, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, \
    JWTManager

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta, timezone
from db.db_utils import *
from bot.bot_pol import *
from init import db, app, jwt
import config


@app.route("/api/users", methods=["DELETE"])
def delete_user():
    username = request.get_json()["username"]
    chat_id = request.get_json()["chat_id"]
    status = remove_user_if_registered(chat_id, username)
    return jsonify({"success": status})


@app.route("/api/users", methods=["POST"])
def create_user():
    chat_id = request.get_json()["chat_id"]
    username = request.get_json()["username"]
    status = register_user_if_not_registered(chat_id, username)
    return jsonify({"success": status})


@app.route("/api/admins", methods=["POST"])
@jwt_required()
def create_admin():
    username = request.get_json()["username"]
    password = request.get_json()["password"]
    status = register_admin(username, password)
    return jsonify({"success": status})


@app.route("/api/admins", methods=["DELETE"])
@jwt_required()
def remove_admin():
    identity = get_jwt_identity()
    username = request.get_json()["username"]
    if (identity == config.ADMIN_DEFAULT_USERNAME and username != config.ADMIN_DEFAULT_USERNAME and delete_admin(
            username)):
        status = True
    else:
        status = False
    return jsonify({"success": status, "delete_root_admin": username == config.ADMIN_DEFAULT_USERNAME})


@app.route("/api/token", methods=["POST"])
@jwt_required()
def check_token():
    identity = get_jwt_identity()
    is_root_identity = 0
    if (identity == config.ADMIN_DEFAULT_USERNAME):
        is_root_identity = 1
    return jsonify({"status": "1", "is_root_admin": is_root_identity})


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
        return response
    except (RuntimeError, KeyError):
        return response


@app.route('/api/login', methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    if authenticate_admin(username, password):
        access_token = create_access_token(identity=username)
        response = {"access_token": access_token}
        return response
    else:
        return {"msg": "Wrong email or password"}, 401


@app.route("/api/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.route("/api/polls", methods=["POST"])
def create_poll():
    tree_poll = request.get_json()["tree_poll"]
    poll_id = add_tree_poll(tree_poll)
    registered_users = get_all_registered_users()
    for chat_id in registered_users:
        t_poll_id, message_id = send_poll(chat_id, tree_poll["question"], [a["desc"] for a in tree_poll["answers"]])
        add_poll_message(t_poll_id, message_id, chat_id, poll_id)
    return jsonify({"success": True})


@app.route("/api/followuppolls", methods=["POST"])
def create_followuppoll():
    poll = request.get_json()["poll"]
    poll_id, message = add_followup_poll(poll)
    if not poll_id:
        return jsonify({"success": False, "error_description": message})
    registered_users = get_all_registered_users_answered(poll["father_poll_id"], poll["answer_number"])
    for chat_id in registered_users:
        t_poll_id, message_id = send_poll(chat_id, poll["question"], [a for a in poll["answers"]])
        add_poll_message(t_poll_id, message_id, chat_id, poll_id)
    return jsonify({"success": True})


@app.route("/api/polls", methods=["GET"])
def get_polls():
    return jsonify({"success": True, "polls": get_all_polls()})


@app.route("/api/rootpolls")
def get_root_polls():
    return jsonify({"success": True, "polls": get_root_polls_from_db()})


@app.route("/api/followuppoll")
def get_followuppoll():
    father_poll_id = request.args.get('father_poll_id')
    branch_answer_number = request.args.get('branch_answer_number')
    followuppoll = get_followuppoll_from_db(father_poll_id, branch_answer_number)
    if followuppoll is None:
        return jsonify({"success": True, "poll": None})
    else:
        poll = {
            "poll_id": followuppoll.poll_id,
            "question": followuppoll.desc,
            "answers": [followuppoll.answers[i].desc for i in range(len(followuppoll.answers))]
        }
        return jsonify({"success": True, "poll": poll})


@app.route("/api/votes", methods=["POST"])
# Once you finih I simply need to add this decorator to make it authenticated required api
# @jwt_required()
def create_vote():
    chat_id = request.get_json()["chat_id"]
    t_poll_id = request.get_json()["t_poll_id"]
    answer_number = request.get_json()["answer_number"]
    res, poll_id, question, answers = add_vote_and_get_son(chat_id, t_poll_id, answer_number)
    if question is not None:
        t_poll_id, message_id = send_poll(chat_id, question, answers)
        add_poll_message(t_poll_id, message_id, chat_id, poll_id)
    return jsonify({"success": True})


# Serve react UI
@app.route('/')
def root():
    return app.send_static_file('index.html')


######################################################################################
# add here all routes related to creating/querying polls
######################################################################################


if __name__ == "__main__":
    # create_all should creates only tables that do not exist
    db.create_all()
    # In case we need to clean the db
    clean_db()
    register_admin(username = config.ADMIN_DEFAULT_USERNAME, password = config.ADMIN_DEFAULT_PASSWORD)
    app.run(debug=True)
