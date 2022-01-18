from flask import Flask, request, jsonify
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from datetime import datetime, timedelta, timezone
from flask_sqlalchemy import SQLAlchemy
from subprocess import call
import config

app = Flask(__name__, static_folder="./build/static", template_folder="./build")

# DB related
app.config["SQLALCHEMY_DATABASE_URI"] = config.CONNECTION_STRING
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# JWT configuration
app.config["JWT_SECRET_KEY"] = "236369_secret_token"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)


# In case we redfined that table we should execute this before
# db.drop_all()
# from models import *