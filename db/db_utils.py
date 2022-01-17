from tkinter.tix import ExFileSelectBox
from db.models import *
from init import db
import hashlib
from sqlalchemy import func

SALT = "236369_secret_salt"

# commands to execute
# the service start should be executed on every computer reboot
'''
sudo service postgresql start
sudo -i -u postgres psql
ALTER USER postgres WITH ENCRYPTED PASSWORD 'password';
CREATE DATABASE projectdb;
DROP DATABASE projectdb;
'''


def authenticate_admin(username, password):
    m = hashlib.sha256()
    m.update((password + SALT).encode('utf-8'))
    hashed_password = m.hexdigest()
    admin = Admin.query.filter_by(username=username, password=hashed_password).first()
    if admin:
        return True
    else:
        return False


def db_get_all_admins():
    admins = Admin.query.all()
    result = []
    for curr_admin in admins:
        result.append(curr_admin.username)
    return result


def register_admin(username, password):
    admin = Admin.query.filter_by(username=username).first()
    if admin is None:
        m = hashlib.sha256()
        m.update((password + SALT).encode('utf-8'))
        hashed_password = m.hexdigest()
        admin = Admin(username=username, password=hashed_password)
        db.session.add(admin)
        db.session.commit()
        return True
    else:
        return False
    #


def db_delete_admins(admins):
    for admin in admins:
        curr_admin = Admin.query.filter_by(username=admin).first()
        if not curr_admin is None:
            db.session.delete(curr_admin)
    db.session.commit()
    return True


def register_user_if_not_registered(chat_id, username):
    user = User.query.filter_by(chat_id=chat_id).first()
    if user is None:
        user = User(chat_id=chat_id, username=username)
        db.session.add_all([user])
        db.session.commit()
    else:
        if user.username is None:
            user.username = username
            db.session.commit()
        else:
            return False
    return True


def remove_user_if_registered(chat_id, username):
    user = User.query.filter_by(chat_id=chat_id).first()
    if user is not None:
        if user.username is None:
            return False
        elif user.username == username:
            user.username = None
            db.session.commit()
            return True
    return False


def add_tree_poll_inner(tree_poll, max_poll_id, father, branch):
    if tree_poll is None:
        return [], max_poll_id, None
    poll_id = max_poll_id + 1
    max_poll_id = max_poll_id + 1
    question = tree_poll["question"]
    poll = Poll(poll_id=poll_id, desc=question, root_poll_id=poll_id, father_poll_id=father,
                branch_answer_number=branch)
    answers_to_add = []
    for i, answer in enumerate(tree_poll["answers"]):
        answers_to_add.append(Answer(poll_id=poll_id, answer_number=i, desc=answer["desc"]))
    elements_to_add = [poll] + answers_to_add

    for i, answer in enumerate(tree_poll["answers"]):
        new_elements_to_add, new_max_poll_id, son_poll_id = add_tree_poll_inner(answer["poll"], max_poll_id, poll_id, i)
        max_poll_id = new_max_poll_id
        elements_to_add += new_elements_to_add
        answers_to_add[i].son_pol_id = son_poll_id
    return elements_to_add, max_poll_id, poll_id


def add_followup_poll(poll):
    new_poll_id = db.session.query(func.max(Poll.poll_id)).scalar() + 1
    father_answer = Answer.query.filter_by(answer_number=poll["answer_number"], poll_id=poll["father_poll_id"]).first()
    if father_answer is None:
        return False, "Parent answer was not found."
    if father_answer.son_pol_id is not None:
        return False, "Parent answer already have followup poll."
    elements_to_add = []
    new_poll = Poll(poll_id=new_poll_id, desc=poll["question"], root_poll_id=poll["root_poll_id"],
                    father_poll_id=poll["father_poll_id"],
                    branch_answer_number=poll["answer_number"])
    elements_to_add.append(new_poll)
    for i, answer in enumerate(poll["answers"]):
        elements_to_add.append(Answer(poll_id=new_poll_id, answer_number=i, desc=answer))
    db.session.add_all(elements_to_add)
    db.session.commit()
    father_answer.son_pol_id = new_poll_id
    db.session.commit()
    return new_poll_id, ""


def add_tree_poll(tree_poll):
    max_poll_id = db.session.query(func.max(Poll.poll_id)).scalar()
    max_poll_id = 0 if max_poll_id is None else max_poll_id
    elements_to_add, _, _ = add_tree_poll_inner(tree_poll, max_poll_id, None, None)
    db.session.add_all(elements_to_add)
    db.session.commit()
    return max_poll_id + 1


def get_all_registered_users():
    users = User.query.with_entities(User.chat_id).filter(User.username is not None).all()
    return [user[0] for user in users]


def add_poll_message(t_poll_id, message_id, chat_id, poll_id):
    message = PollMessage(t_poll_id=t_poll_id, message_id=message_id, chat_id=chat_id, poll_id=poll_id)
    db.session.add_all([message])
    db.session.commit()


def add_vote_and_get_son(chat_id, t_poll_id, answer_number):
    poll_message = PollMessage.query.filter_by(t_poll_id=t_poll_id).first()
    if poll_message is not None:
        poll = Poll.query.filter_by(poll_id=poll_message.poll_id).first()
        answer = None
        for p_answer in poll.answers:
            if p_answer.answer_number == answer_number:
                answer = p_answer
                break
        if answer is not None:
            vote = Vote(chat_id=chat_id, poll_id=poll.poll_id, answer_number=answer_number)
            db.session.add_all([vote])
            db.session.commit()
            if answer.son_pol_id is not None:
                son_poll = Poll.query.filter_by(poll_id=answer.son_pol_id).first()
                if son_poll is not None:
                    answers = [(a.answer_number, a.desc) for a in son_poll.answers]
                    answers.sort()
                    return True, son_poll.poll_id, son_poll.desc, [desc for _, desc in answers]
    return True, None, None, None


def get_all_registered_users_answered(poll_id, answer_number):
    registererd_users = list(User.query.filter(User.username is not None).all())
    registered_users_answered = []
    for i in range(len(registererd_users)):
        for j in range(len(registererd_users[i].votes)):
            if registererd_users[i].votes[j].poll_id == poll_id and registererd_users[i].votes[
                j].answer_number == answer_number:
                registered_users_answered.append(registererd_users[i].chat_id)
                break
    print(registered_users_answered)
    return registered_users_answered


def get_all_polls():
    polls = Poll.query.all()
    polls = [{"poll_id": p.poll_id,
              "root_poll_id": p.root_poll_id,
              "father_poll_id": p.father_poll_id,
              "question": p.desc,
              "answers": [
                  a.desc
                  for a in p.answers],
              }
             for p in polls]
    return polls

def db_get_all_votes(poll_id):
    votes = Vote.query.filter_by(poll_id = poll_id).all()
    chat_ids = [ vote.chat_id for vote in votes]
    users = User.query.filter(User.chat_id.in_(chat_ids)).all()
    result = [{"chat_id": vote.chat_id,
                "username": (next(item for item in users if item["chat_id"] == vote.chat_id)).username ,
                "answer_number": vote.answer_number}
             for vote in votes]
    return result




def clean_db():
    Admin.query.delete()
    Vote.query.delete()
    Answer.query.delete()
    PollMessage.query.delete()
    Poll.query.delete()
    User.query.delete()


def get_root_polls_from_db():
    polls = Poll.query.filter_by(father_poll_id=None).all()
    polls = [{"poll_id": p.poll_id,
              "root_poll_id": p.root_poll_id,
              "father_poll_id": p.father_poll_id,
              "question": p.desc,
              "answers": [
                  a.desc
                  for a in p.answers],
              }
             for p in polls]
    return polls


def get_followuppoll_from_db(father_poll_id, branch_answer_number):
    return Poll.query.filter_by(father_poll_id=father_poll_id,
                                branch_answer_number=branch_answer_number).first()

##############################################################################
# add all feature related to querying the DB ith polls
##############################################################################
