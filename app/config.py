import pathlib

from environs import Env

application_path = pathlib.Path(__file__).parent

if (application_path / ".env").is_file():
    env_path = application_path / ".env"
else:
    env_path = application_path.parent / ".env"

env = Env()
env.read_env(str(env_path))


class Config:
    SQLALCHEMY_DATABASE_URI = env("DATABASE_URI")

    SECRET_KEY = env("DATABASE_URI", "mysecret")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECURITY_URL_PREFIX = "/"
    SECURITY_REGISTERABLE = True

    SECURITY_REGISTER_URL = "/register"
    SECURITY_LOGIN_URL = "/login"
    SECURITY_POST_LOGIN_VIEW = "/"
    SECURITY_LOGOUT_URL = "/logout"
    SECURITY_POST_LOGOUT_VIEW = "/"
    SECURITY_RESET_URL = "/reset"
    SECURITY_CHANGE_URL = "/change"
    SECURITY_USER_IDENTITY_ATTRIBUTES = ["email"]

    SECURITY_PASSWORD_SALT = None
    SECURITY_PASSWORD_HASH = "plaintext"


class ProdConfig(Config):
    DEBUG = False
    TESTING = False


class DevConfig(Config):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_RECORD_QUERIES = True
    ENVIRONMENT = "development"