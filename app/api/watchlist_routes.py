from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, Watchlist, Watchlist_Stock
from app.forms import WatchlistForm
from .auth_routes import validation_errors_to_error_messages

watchlist_routes = Blueprint("watchlists", __name__)


@watchlist_routes.route("", methods=["POST"])
@login_required
def create_watchlist():
    """
    Create new watchlist
    """
    data = request.get_json()
    data["csrf_token"] = request.cookies["csrf_token"]
    user_id = current_user.id

    form = WatchlistForm(**data)

    if form.validate_on_submit():
        create_watchlist = Watchlist(name=data["name"], user_id=user_id)

        db.session.add(create_watchlist)
        db.session.commit()

        return create_watchlist.to_dict()

    return {"errors": validation_errors_to_error_messages(form.errors)}, 401
