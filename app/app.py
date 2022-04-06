import os
from functools import wraps

import simplejson
from flask import (
    Flask,
    render_template,
    redirect,
    url_for,
    flash,
    request,
    jsonify, g,
)
from flask_security import (
    Security,
    SQLAlchemyUserDatastore,
    login_required,
    logout_user,
)
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.fields.choices import SelectMultipleField
from wtforms.fields.datetime import DateField
from wtforms.fields.simple import BooleanField
from wtforms.validators import DataRequired

from config import env
from models import User, Role, Contest, Question, Answer

UPLOAD_FOLDER = "/uploads"
# ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "docx"}


app = Flask(__name__)
app.config.from_object("config.DevConfig" if os.environ.get("ENVIRONMENT") == "development" else "config.ProdConfig")
db = SQLAlchemy(app)
db.autoflush = True

user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore)


@app.route("/uploadfile", methods=["POST", "GET"])
def align():
    if request.method == "POST":
        f = request.files.get("file")
        if not f:
            return "File not sent", 400
        f.save(os.path.join(UPLOAD_FOLDER, f.filename))
        return "File saved successfully"
    if request.method == "GET":
        return "ERROR!"


class ContestForm(FlaskForm):
    code = StringField("Codigo Concurso", validators=[DataRequired()])
    name = StringField("Nome Concurso", validators=[DataRequired()])
    area = StringField("Area", validators=[DataRequired()])
    date_start = DateField("Data Inicio", format="%Y-%m-%d", validators=[DataRequired()])
    date_end = DateField("Data Fim", format="%Y-%m-%d", validators=[DataRequired()])
    juri = SelectMultipleField("Juri", choices=[], validators=[DataRequired()])
    active = BooleanField("Ativo ", false_values=None)
    submit = SubmitField(label="Submeter")


# Flask views
@app.route("/")
@login_required
def index():
    return render_template("index.html")


@app.route("/utilizadores")
@login_required
def users():
    users = User.query.all()
    return render_template("users.html", users=users)


@app.route("/concursos")
@login_required
def contests():
    contests = Contest.query.order_by(Contest.id.desc()).all()
    return render_template("contests.html", contests=contests)


@app.route("/concursos/criar", methods=["GET", "POST"])
@login_required
def create_contests():
    form = ContestForm()
    code = None
    name = None
    area = None
    date_start = None
    date_end = None
    juri = None
    active = None

    GetjuriQuery = User.query.filter(User.roles.any(id=2))
    form.juri.choices = [(user.id, user.nome) for user in GetjuriQuery]

    if request.method == "POST":

        contest_to_add = Contest(
            code=form.code.data,
            name=form.name.data,
            area=form.area.data,
            dateStart=form.date_start.data,
            dateEnd=form.date_end.data,
            active=form.active.data,
        )

        jurisList = form.juri.data
        for juri in jurisList:
            j = db.session.query(User).get(juri)
            contest_to_add.juri.append(j)

        db.session.add(contest_to_add)
        db.session.commit()

        flash("Concurso adicionado com sucesso")
        return redirect(url_for("contests"))
    else:
        return render_template(
            "contest_create.html",
            code=code,
            name=name,
            area=area,
            date_start=date_start,
            date_end=date_end,
            juri=juri,
            active=active,
            form=form,
        )


@app.route("/editar/<int:id>", methods=["GET", "POST"])
@login_required
def edit_contest(id):
    contest_to_update = db.session.query(Contest).filter((Contest.id == id)).first()
    GetjuriQuery = User.query.filter(User.roles.any(id=2))
    form = ContestForm()

    if request.method == "POST":

        contest_to_update.code = form.code.data
        contest_to_update.name = form.name.data
        contest_to_update.area = form.area.data
        contest_to_update.dateStart = form.date_start.data
        contest_to_update.dateEnd = form.date_end.data
        contest_to_update.active = form.active.data

        contest_to_update.juri = []

        jurisList = form.juri.data
        for juri in jurisList:
            j = db.session.query(User).get(juri)
            contest_to_update.juri.append(j)

        db.session.commit()

        flash("Concurso editado com sucesso")
        return redirect(url_for("contests"))
    else:
        form.code.data = contest_to_update.code
        form.name.data = contest_to_update.name
        form.area.data = contest_to_update.area
        form.date_start.data = contest_to_update.dateStart
        form.date_end.data = contest_to_update.dateEnd
        form.juri.choices = [(user.id, user.nome) for user in contest_to_update.juri] + [
            (user.id, user.nome) for user in GetjuriQuery if user not in contest_to_update.juri
        ]
        form.active.data = contest_to_update.active
        return render_template("contest_edit.html", form=form, contest_to_update=contest_to_update)


@app.route("/visualizar/<int:id>")
@login_required
def view_contest(id):
    contest_to_view = db.session.query(Contest).filter((Contest.id == id)).first()
    form = ContestForm()
    form.code.data = contest_to_view.code
    form.name.data = contest_to_view.name
    form.area.data = contest_to_view.area
    form.date_start.data = contest_to_view.dateStart
    form.date_end.data = contest_to_view.dateEnd
    form.juri.choices = [(user.id, user.nome) for user in contest_to_view.juri]
    form.active.data = contest_to_view.active
    return render_template("contest_view.html", form=form, contest_to_view=contest_to_view)


@app.route("/apagar/<int:id>")
@login_required
def delete_contest(id):
    contest_to_delete = db.session.query(Contest).filter((Contest.id == id)).first()
    db.session.delete(contest_to_delete)
    try:
        db.session.commit()
        flash("Concurso apagado com sucesso.")
        return redirect("/concursos")
    except Exception as e:
        db.session.rollback()
        flash("Concurso não pode ser apagado.")
        return redirect("/concursos")


def any_roles_required(roles):
    if isinstance(roles, str):
        roles = [roles]

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user: User = g.identity.user
            if not user or not user.has_any_roles(roles):
                return "no role", 400
            else:
                return func(*args, **kwargs)

        return wrapper

    return decorator


@app.route("/formularios/criar/<int:id>", methods=["GET", "POST"])
@login_required
@any_roles_required(["juri", "admin"])
def forms_create(id):
    contest = db.session.query(Contest).filter((Contest.id == id)).first()
    if contest.active:
        return "cannot edit active contest", 400
    user = g.identity.user
    if user not in contest.juri and not user.has_role('admin'):
        return "this juri cannot edit this contest", 400
    return render_template("forms_create.html")


@app.route("/formularios/<int:id>")
@login_required
def forms(id):
    # todo lista de formularios, so está a ir buscar o 1º
    chosen_contest = db.session.query(Contest).filter((Contest.id == id)).first()
    numero_perguntas = db.session.query(Question).filter(Question.contest_id == id).count()
    return render_template("forms.html", chosen_contest=chosen_contest, numero_perguntas=numero_perguntas)


@app.route("/insert_form_guardar", methods=["GET", "POST"])
@login_required
def insert_form_guardar():
    if request.method == "POST":

        questions = request.get_json()  # silent=True, force=True
        questons_to_delete = db.session.query(Question).filter(Question.contest_id == questions[0]["contest_id"]).all()
        for q in questons_to_delete:
            db.session.delete(q)
        db.session.flush()

        for line in questions:
            lineq = Question(
                contest_id=line.get("contest_id"),
                type=line.get("type"),
                description=line.get("description"),
                options=line.get("options"),
                scores=line.get("scores"),
            )
            db.session.add(lineq)

        contest_id = lineq.contest_id
        chosen_contest = db.session.query(Contest).filter((Contest.id == contest_id)).first()
        chosen_contest.questions_state = "Criado"
        db.session.add(chosen_contest)
        db.session.commit()
        print(questions)
        flash("Formulario criado e guardado com sucesso")
        return jsonify(questions)
    else:
        return jsonify(message="Bad method", category="error", status=404)


@app.route("/insert_form_submeter", methods=["GET", "POST"])
@login_required
def insert_form_submeter():
    if request.method == "POST":

        question = request.get_json()  # silent=True, force=True
        questons_to_delete = db.session.query(Question).filter(Question.contest_id == question[0]["contest_id"]).all()
        for q in questons_to_delete:
            db.session.delete(q)
            db.session.flush()

        for line in question:
            lineq = Question(
                contest_id=line.get("contest_id"),
                type=line.get("type"),
                description=line.get("description"),
                options=line.get("options"),
                scores=line.get("scores"),
            )
            db.session.add(lineq)

        contest_id = lineq.contest_id
        chosen_contest = db.session.query(Contest).filter((Contest.id == contest_id)).first()
        chosen_contest.questions_state = "Submetido"
        db.session.add(chosen_contest)
        db.session.commit()
        print(question)
        flash("Formulario submetido com sucesso")
        return jsonify(question)
    else:
        return jsonify(message="Bad method", category="error", status=404)


######## Data fetch ############
@app.route("/formularios/editar/", methods=["POST"])
def getId():
    formId = request.get_json()
    for line in formId:
        print(line)
    return line


@app.route("/formularios/editar/<int:id>", methods=["GET"])
def getData(id):
    chosen_contest = db.session.query(Question).filter((Question.contest_id == id))

    objects_list = []
    for line in chosen_contest:
        dict = {
            "id": line.id,
            "type": line.type,
            "description": line.description,
            "options": line.options,
            "scores": line.scores,
        }
        objects_list.append(dict)
        print(objects_list)

    return render_template("forms_edit.html", objects_list=simplejson.dumps(objects_list))


@app.route("/formularios/respondForm/", methods=["POST"])
def respondId():
    formId = request.get_json()
    for line in formId:
        print(line)
    return line


@app.route("/formularios/respondForm/<int:id>", methods=["GET"])
def respondData(id):
    chosen_contest = db.session.query(Question).filter((Question.contest_id == id))

    objects_list = []
    for line in chosen_contest:
        dict = {
            "id": line.id,
            "type": line.type,
            "description": line.description,
            "options": line.options,
            "scores": line.scores,
        }
        objects_list.append(dict)
        print(objects_list)

    return render_template("forms_view.html", objects_list=simplejson.dumps(objects_list))


@app.route("/respondForm_submeter", methods=["GET", "POST"])
# @login_required
def respondForm_submeter():
    if request.method == "POST":

        answers = request.get_json()  # silent=True, force=True
        for line in answers:
            anws = Answer(
                user_id=line.get("user_id"),
                contest_id=line.get("contest_id"),
                question_id=line.get("question_id"),
                text=line.get("text"),
                option=line.get("option"),
                score=line.get("score"),
                validated=line.get("validated"),
                juri_id=line.get("juri_id"),
            )
            print("DENTRO FOR :: ", line)
            db.session.add(anws)

        db.session.commit()
        flash("Respostas ao formulario submetidas com sucesso")
        return jsonify(answers)
    else:
        return jsonify(message="Bad method", category="error", status=404)


@app.route("/candidaturas")
# @login_required
def candidatures():
    return render_template("candidatures.html")


@app.route("/resultados")
# @login_required
def results():
    return render_template("results.html")


@app.route("/logout", methods=["GET"])
def logout():
    logout_user()
    return redirect(url_for("security.login"))


"""
@app.errorhandler(403)
def access_forbidden(error):
    return render_template("errors/403.html"), 403

@app.errorhandler(404)
def not_found_error(error):
    return render_template("errors/404.html"), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template("errors/500.html"), 500
"""

if __name__ == "__main__":
    app.run(host=env("HOST", "0.0.0.0"), port=env("PORT", "80"), debug=True)
