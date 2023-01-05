from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import db, User, Group
from app.forms import GroupForm
from .auth_routes import validation_errors_to_error_messages

group_routes = Blueprint("groups", __name__)


@group_routes.route("/current")
@login_required
def get_current_groups():
    """
    Query for all groups that member is in
    """
    user_id = current_user.id
    user = User.query.get(user_id)

    groupArr = [group.to_dict() for group in user.groups]

    response = {"groups": groupArr}
    return response


@group_routes.route("/<int:group_id>")
@login_required
def get_group_details(group_id):
    """
    Query for details of a group by group id
    """

    group = Group.query.get(group_id)

    if not group:
        return {"message": "Group couldn't be found"}, 404

    return group.to_dict()


@group_routes.route("/<int:group_id>/users", methods=["POST"])
@login_required
def post_group_member(group_id):
    """
    Adds current user to group id
    """

    data = request.get_json()
    data["csrf_token"] = request.cookies["csrf_token"]
    user_id = current_user.id

    user = User.query.get(user_id)
    group = Group.query.get(group_id)

    if not group:
        return {"error": "Group couldn't be found"}, 404

    group_info = group.to_dict()

    if group_info["name"] != data["name"]:
        return {"error": "Group couldn't be found"}, 404

    group.members.append(user)
    db.session.commit()

    return group.to_dict()


@group_routes.route("", methods=["POST"])
@login_required
def create_group():
    """
    Create new group
    """

    data = request.get_json()
    data["csrf_token"] = request.cookies["csrf_token"]
    user_id = current_user.id

    form = GroupForm(**data)

    if form.validate_on_submit():
        # Creating new group instance
        create_group = Group(name=data["name"], owner_id=user_id)

        user = User.query.get(user_id)
        create_group.members.append(user)

        db.session.add(create_group)
        db.session.commit()

        return create_group.to_dict()

    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


@group_routes.route("/<int:group_id>", methods=["PUT"])
@login_required
def update_group(group_id):
    """
    Update a Group name only if user owns group
    """
    data = request.get_json()
    data["csrf_token"] = request.cookies["csrf_token"]
    user_id = current_user.id

    form = GroupForm(**data)
    group = Group.query.get(group_id)
    # print(group.name)

    group_info = group.to_dict()

    if group_info["ownerId"] is not user_id:
        return {"errors": "You do not own this group"}, 401

    if group and form.validate_on_submit():
        group.name = data["name"]  # Using group['name'] will not work
        db.session.commit()
        return group.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


@group_routes.route("/<int:group_id>/users", methods=["DELETE"])
@login_required
def delete_group_member(group_id):
    """
    Delete a User from Group
    """

    group = Group.query.get(group_id)
    user_id = current_user.id

    if not group:
        return {"message": "Group couldn't be found"}, 404

    group_members = group.members

    print(group_members)

    for member in group_members:
        if member.to_dict()["id"] == user_id:
            group_members.remove(member)
            db.session.commit()
            return {"message": "Successfully deleted"}

    return {"message": "You are not a member in this server"}, 401


@group_routes.route("/<int:group_id>", methods=["DELETE"])
@login_required
def delete_group(group_id):
    """
    Delete a Group only if user owns group
    """

    group = Group.query.get(group_id)
    user_id = current_user.id

    if not group:
        return {"message": "Group couldn't be found"}, 404

    group_info = group.to_dict()

    if group_info["ownerId"] is not user_id:
        return {"errors": "You do not own this group"}, 401

    db.session.delete(group)
    db.session.commit()
    return {"message": "Successfully deleted"}
