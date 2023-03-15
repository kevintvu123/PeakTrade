import os
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from .models import db, User
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.transaction_routes import transaction_routes
from .api.group_routes import group_routes
from .api.watchlist_routes import watchlist_routes
from .seeds import seed_commands
from .config import Config

# Creating instance of Flask class 
app = Flask(__name__, static_folder="../react-app/build", static_url_path="/")

# Setup login manager
login = LoginManager(app)
# Users are sent to login_view (found in auth_routes) when they are unauthorized
login.login_view = "auth.unauthorized"

# Load user into session storage (stored in flask_login) under current_user variable for access anywhere in app
@login.user_loader
def load_user(id):
    return User.query.get(int(id))


# Tells Flask about our seed commands (for "flask seed all" and "flask seed undo" commands)
app.cli.add_command(seed_commands)

## Registering Blueprint (Flask built-in), groups routes that handles specific HTTP requests. Also defines base path for all routes
# Sets config of Flask app from config.py
app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix="/api/users")
app.register_blueprint(auth_routes, url_prefix="/api/auth")
app.register_blueprint(transaction_routes, url_prefix="/api/transactions")
app.register_blueprint(group_routes, url_prefix="/api/groups")
app.register_blueprint(watchlist_routes, url_prefix="/api/watchlists")
# Initializing database by binding to Flask app
db.init_app(app)
# Migrate() integrates Alembic into Flask app. Creates migration script to update db schema
Migrate(app, db)

## Cross-Origin Resource Sharing (CORS)
# adds the appropriate CORS headers to responses from Flask app
# CORS protects against unauthorized cross-domain requests and helps prevent CSRF attacks.
CORS(app)

# Render (deployment) doesn't allow unsecure HTTP request
# In production any request made over http is redirected to https to make secure requests.
@app.before_request
def https_redirect():
    if os.environ.get("FLASK_ENV") == "production":
        if request.headers.get("X-Forwarded-Proto") == "http":
            url = request.url.replace("http://", "https://", 1)
            code = 301
            return redirect(url, code=code)

# Adds CSRF protection by adding CSRF token into cookie after every requests
# When submitting form or request, server checks CSRF token stored
@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        "csrf_token",
        generate_csrf(),
        secure=True if os.environ.get("FLASK_ENV") == "production" else False,
        samesite="Strict" if os.environ.get("FLASK_ENV") == "production" else None,
        httponly=True,
    )
    return response

# Not necessary but Flask is able to make back-end documentation
@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ["GET", "POST", "PUT", "PATCH", "DELETE"]
    route_list = {
        rule.rule: [
            [method for method in rule.methods if method in acceptable_methods],
            app.view_functions[rule.endpoint].__doc__,
        ]
        for rule in app.url_map.iter_rules()
        if rule.endpoint != "static"
    }
    return route_list


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    #Favicon isn't stored in server, it is stored in react public folder
    if path == "favicon.ico":
        return app.send_from_directory("public", "favicon.ico")
    return app.send_static_file("index.html")

# No routes are hit, user is redirected to index landing page ('/')
@app.errorhandler(404)
def not_found(e):
    return app.send_static_file("index.html")
