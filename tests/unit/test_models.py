import pytest
from app.models import db, User
from app import create_test_app
#run "pipenv run pytest" in terminal even in pipenv shell to run the test

@pytest.fixture
def test_app():
    app = create_test_app('test')
    with app.app_context():
        # db.create_all() -> SQLAlchemy looks for all models defined in app and creates necessary tables
        db.create_all()
        # yield app passes the app instance to the test function
        # Once the test is finished, the code after the yield statement is executed to tear down the fixture by removing the database session and dropping all of the tables
        yield app
        db.session.remove()
        db.drop_all()

def test_user_creation(test_app):
    user = User(
        email='testuser@example.com',
        first_name='Test',
        last_name='User',
        password='password'
    )

    with test_app.app_context():
        db.session.add(user)
        db.session.commit()

        assert user.id is not None
        assert user in db.session
