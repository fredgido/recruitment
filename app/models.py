from typing import DefaultDict
import flask
import flask_sqlalchemy
from sqlalchemy.orm import backref, defaultload
from datetime import datetime
from flask_security import RoleMixin, UserMixin

app = flask.Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///chua.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = flask_sqlalchemy.SQLAlchemy(app)

roles_users_table = db.Table("role_user",
    db.Column("user_id", db.Integer(), db.ForeignKey("user.id")),
    db.Column("role_id", db.Integer(), db.ForeignKey("role.id")),
)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.Unicode(80))
    active = db.Column(db.Boolean())
    roles = db.relationship("Role", secondary=roles_users_table, backref="user", lazy=True)

    def __str__(self):
        return self.email

    def has_role(self, role):
        query = db.session.query(Role).filter(Role.name == role).first()
        if query:
            if query.name in self.roles:
                return True
        return False


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

    def __str__(self):
        return self.name


class Candidature(db.Model):
    __tablename__ = "candidature"
    id = db.Column(db.Integer, db.Sequence("seq_candidature_id"))
    user_id = db.Column("user_id", db.ForeignKey("user.id"), primary_key=True)
    user = db.relationship("User", backref="candidature")
    contest_id = db.Column("contest_id", db.ForeignKey("contest.id"), primary_key=True)
    contest = db.relationship("Contest", backref="candidature")
    active = db.Column(db.Boolean, default=True)
    answers = db.Column(db.JSON)
    score = db.Column(db.Integer())
    createdAt = db.Column(db.DateTime, default=datetime.now)
    updatedAt = db.Column(db.DateTime, default=datetime.now)


juri_contest_table = db.Table("manage", db.Model.metadata,
    db.Column("juri_id", db.Integer, db.ForeignKey("user.id")),
    db.Column("contest_id", db.Integer, db.ForeignKey("contest.id")),
)


class Contest(db.Model):
    __tablename__ = "contest"
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    area = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean)
    questions_state = db.Column(db.String(255), nullable=False, default="Por criar")
    dateStart = db.Column(db.Date, nullable=False)
    dateEnd = db.Column(db.Date, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.now)
    updatedAt = db.Column(db.DateTime, default=datetime.now)
    juri = db.relationship("User", secondary=juri_contest_table, backref=db.backref("juri", lazy="dynamic"))
    questions = db.relationship("Question", backref="question", cascade="all, delete-orphan")

    def __init__(self, code, name, area, dateStart, dateEnd, active):
        self.code = code
        self.name = name
        self.area = area
        self.dateStart = dateStart
        self.dateEnd = dateEnd
        self.active = active


class Question(db.Model):
    __tablename__ = "question"
    id = db.Column(db.Integer, primary_key=True)
    contest_id = db.Column(db.Integer, db.ForeignKey("contest.id"))
    type = db.Column(db.String)
    description = db.Column(db.String)
    options = db.Column(db.JSON, default="Null")
    scores = db.Column(db.JSON)
    order = db.Column(db.Integer, default="Null")

    def __init__(self, contest_id, type, options, description, scores):
        self.contest_id = contest_id
        self.type = type
        self.description = description
        self.options = options
        self.scores = scores


class Answer(db.Model):
    __tablename__ = "answer"
    id = db.Column(db.Integer, db.Sequence("seq_answer_id"))
    user_id = db.Column("user_id", db.ForeignKey("user.id"), primary_key=True)
    user = db.relationship("User", backref="answer")
    contest_id = db.Column("contest_id", db.ForeignKey("contest.id"), primary_key=True)
    contest = db.relationship("Contest", backref="answer")
    question_id = db.Column("question_id", db.ForeignKey("question.id"), primary_key=True)
    question = db.relationship("Question", backref="answer")
    text = db.Column(db.String)
    option = db.Column(db.JSON)
    score = db.Column(db.Float)
    validated = db.Column(db.Boolean)
    juri_id = db.Column(db.String)
    createdAt = db.Column(db.DateTime, default=datetime.now)
    updatedAt = db.Column(db.DateTime, default=datetime.now)
    
    def __init__(self, user_id, contest_id, question_id, text, option, score, validated, juri_id):
        self.user_id = user_id
        self.contest_id = contest_id
        self.question_id = question_id
        self.option = option
        self.text = text
        self.score = score
        self.validated = validated
        self.juri_id = juri_id
        

class Result(db.Model):
    __tablename__ = "result"
    user_id = db.Column("user_id", db.ForeignKey("user.id"), primary_key=True)
    user = db.relationship("User", backref=backref("result_user", uselist=False), foreign_keys=[user_id])
    contest_id = db.Column("contest_id", db.ForeignKey("contest.id"), primary_key=True)
    contest = db.relationship("Contest", backref="result")
    active = db.Column(db.Boolean, default=True)
    score = db.Column(db.Integer())
    validated = db.Column(db.Boolean)
    juri_id = db.Column("juri_id", db.ForeignKey("user.id"))
    juri = db.relationship("User", backref=backref("result_juri", uselist=False), foreign_keys=[juri_id])
    createdAt = db.Column(db.DateTime, default=datetime.now)
    updatedAt = db.Column(db.DateTime, default=datetime.now)


if __name__ == "__main__":
    pass
""" db.create_all()
 db.session.query(Question).delete()
 db.session.commit()
 
"""