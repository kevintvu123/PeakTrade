from app.models import db, User, environment, SCHEMA


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        email="demo@aa.io", first_name="Demo", last_name="Lition", password="password"
    )
    marnie = User(
        email="marnie@aa.io", first_name="Marnie", last_name="Wooo", password="password"
    )
    bobbie = User(
        email="bobbie@aa.io",
        first_name="Bobbie",
        last_name="Nguyen",
        password="password",
    )

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM users")

    db.session.commit()
