from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, Watchlist, Watchlist_Stock
from .auth_routes import validation_errors_to_error_messages

watchlist_routes = Blueprint("watchlists", __name__)


@watchlist_routes.route("", methods=["POST"])
@login_required
def create_watchlist():
    """
    Create new watchlist
    """

    return "SUCCESS"
