from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, User, Watchlist, Watchlist_Stock
from app.forms import WatchlistForm, WatchlistStockForm
from .auth_routes import validation_errors_to_error_messages

watchlist_routes = Blueprint("watchlists", __name__)

@watchlist_routes.route("/current")
@login_required
def get_current_watchlists():
    """
    Query for all watchlists that user owns
    """

    user_id = current_user.id
    user = User.query.get(user_id)

    watchlistArr = [watchlist.to_dict() for watchlist in user.watchlists]

    response = {"watchlists": watchlistArr}

    return response


@watchlist_routes.route("/<int:watchlist_id>/stocks", methods=["POST"])
@login_required
def post_watchlist_stock(watchlist_id):
    """
    Adds stock to watchlist
    """
    data = request.get_json()
    data["csrf_token"] = request.cookies["csrf_token"]

    form = WatchlistStockForm(**data)

    if form.validate_on_submit():
        # print(data)
        # print((watchlist_id))

        create_watchlist_stock = Watchlist_Stock(watchlist_id=watchlist_id, ticker=data["ticker"])
        db.session.add(create_watchlist_stock)
        db.session.commit()

        return create_watchlist_stock.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


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


@watchlist_routes.route("/<int:watchlist_id>", methods=["PUT"])
@login_required
def update_watchlist(watchlist_id):
    """
    Update a Watchlist name only if user owns watchlist
    """
    data = request.get_json()
    data["csrf_token"] = request.cookies["csrf_token"]
    user_id = current_user.id

    form = WatchlistForm(**data)
    watchlist = Watchlist.query.get(watchlist_id)
    # print(watchlist)

    if not watchlist:
        return {"errors": "This watchlist does not exist"}, 401

    watchlist_info = watchlist.to_dict()
    if watchlist_info["ownerId"] is not user_id:
        return {"errors": "You do not own this watchlist"}, 401

    if watchlist and form.validate_on_submit():
        watchlist.name = data["name"]
        db.session.commit()
        return watchlist.to_dict()

    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


@watchlist_routes.route("/<int:watchlist_id>", methods=["DELETE"])
@login_required
def delete_watchlist(watchlist_id):
    """
    Delete a Watchlist only if user owns watchlist
    """

    watchlist = Watchlist.query.get(watchlist_id)
    user_id = current_user.id

    if not watchlist:
        return {"message": "Watchlist couldn't be found"}, 404

    watchlist_info = watchlist.to_dict()

    if watchlist_info["ownerId"] is not user_id:
        return {"errors": "You do not own this watchlist"}, 401

    db.session.delete(watchlist)
    db.session.commit()
    return {"message": "Successfully deleted"}
