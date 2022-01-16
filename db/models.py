from init import db


class User(db.Model):
    __tablename__ = 'users'
    chat_id = db.Column(db.BigInteger, primary_key=True, nullable=False)
    username = db.Column(db.String)
    votes = db.relationship('Vote')


class Admin(db.Model):
    __tablename__ = 'admins'
    username = db.Column(db.String, unique=True, primary_key=True, nullable=False)
    password = db.Column(db.String(64), nullable=False)


class Poll(db.Model):
    __tablename__ = 'polls'
    poll_id = db.Column(db.BigInteger, unique=True, primary_key=True, nullable=False)
    desc = db.Column(db.String, nullable=False)
    root_poll_id = db.Column(db.BigInteger, nullable=False)
    father_poll_id = db.Column(db.BigInteger)
    branch_answer_number = db.Column(db.Integer)
    answers = db.relationship('Answer')
    messages = db.relationship('PollMessage')


class Answer(db.Model):
    __tablename__ = 'answers'
    poll_id = db.Column(db.BigInteger, db.ForeignKey('polls.poll_id'), primary_key=True, nullable=False)
    answer_number = db.Column(db.Integer, primary_key=True, nullable=False)
    desc = db.Column(db.String)
    son_pol_id = db.Column(db.BigInteger)
    votes = db.relationship('Vote')


class Vote(db.Model):
    __tablename__ = 'votes'
    chat_id = db.Column(db.BigInteger, db.ForeignKey('users.chat_id'), primary_key=True, nullable=False)
    poll_id = db.Column(db.BigInteger, primary_key=True, nullable=False)
    answer_number = db.Column(db.Integer, primary_key=True, nullable=False)
    __table_args__ = (db.ForeignKeyConstraint([poll_id, answer_number],
                                              [Answer.poll_id, Answer.answer_number]),)


class PollMessage(db.Model):
    __tablename__ = 'pollmessages'
    t_poll_id = db.Column(db.Numeric(precision=25, scale=0, asdecimal=False), primary_key=True, nullable=False)
    message_id = db.Column(db.BigInteger, nullable=False)
    chat_id = db.Column(db.BigInteger, db.ForeignKey('users.chat_id'), nullable=False)
    poll_id = db.Column(db.BigInteger, db.ForeignKey('polls.poll_id'), nullable=False)
