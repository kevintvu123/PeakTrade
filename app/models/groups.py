from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

group_members = db.Table(
    "group_members",
    db.Model.metadata,
    db.Column(
        "user_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("users.id")),
        primary_key=True,
    ),
    db.Column(
        "group_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("groups.id")),
        primary_key=True,
    ),
)

if environment == "production":
    group_members.schema = SCHEMA


class Group(db.Model):
    __tablename__ = "groups"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    owner_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    members = db.relationship("User", secondary=group_members, back_populates="groups")

    @property
    def _name(self):
        return self.name

    @_name.setter
    def _name(self, name):
        self.name = name

    def to_dict(self):
        return {
            "id": self.id,
            "ownerId": self.owner_id,
            "members": [member.to_dict() for member in self.members],
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
        }
