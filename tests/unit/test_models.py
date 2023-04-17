import pytest
from app.models import db, User, Stock, Transaction, Group
from app import create_test_app
# run "pipenv run pytest" in terminal even in pipenv shell to run the test


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
    with test_app.app_context():
        user = User(
            email='testuser@example.com',
            first_name='Test',
            last_name='User',
            password='password'
        )

        db.session.add(user)
        db.session.commit()

        assert user.id is not None
        assert user in db.session
        assert user.buying_power == 10000.00
        assert user.password != 'password'
        assert user.check_password('password')


def test_stock_creation(test_app):
    with test_app.app_context():
        user = User(
            email="testuser@example.com",
            first_name="Test",
            last_name="User",
            password="password"
        )
        db.session.add(user)
        db.session.commit()

        stock = Stock(
            user_id=user.id,
            name="Test Stock",
            ticker="TEST",
            amount=10,
            avg_stock_value=20.5
        )

        db.session.add(stock)
        db.session.commit()

        # Assert that the stock has been added to the database with the correct values
        assert stock.id is not None
        assert user.id is not None
        assert user in db.session
        assert stock in db.session
        assert stock.user_id == user.id
        assert stock.name == "Test Stock"
        assert stock.ticker == "TEST"
        assert stock.amount == 10
        assert stock.avg_stock_value == 20.5

        # Assert that the to_dict method returns the correct values
        assert stock.to_dict() == {
            "id": stock.id,
            "name": "Test Stock",
            "ticker": "TEST",
            "amount": 10,
            "avgStockValue": 20.5
        }


def test_transaction_creation(test_app):
    with test_app.app_context():
        user = User(
            email="testuser@example.com",
            first_name="Test",
            last_name="User",
            password="password"
        )
        db.session.add(user)
        db.session.commit()

        transaction = Transaction(
            user_id=user.id,
            name="Test Stock",
            ticker="TEST",
            price=20.5,
            quantity=10,
            order_type='buy'
        )

        db.session.add(transaction)
        db.session.commit()

        assert user.id is not None
        assert transaction.id is not None
        assert user in db.session
        assert transaction in db.session
        assert transaction.user_id == user.id

def test_group_creation_with_members(test_app):
    with test_app.app_context():
        # create two users
        user1 = User(
            email="testuser1@example.com",
            first_name="Test",
            last_name="User1",
            password="password1"
        )
        db.session.add(user1)

        user2 = User(
            email="testuser2@example.com",
            first_name="Test",
            last_name="User2",
            password="password2"
        )
        db.session.add(user2)

        db.session.commit()

        # create a group and add members
        group = Group(
            name="Test Group",
            owner_id=user1.id,
            members=[user1, user2]  # add both users as members
        )

        db.session.add(group)
        db.session.commit()

        # check that the users and group have ids and are in the session
        assert user1.id is not None
        assert user2.id is not None
        assert group.id is not None
        assert user1 in db.session
        assert user2 in db.session
        assert group in db.session

        # check that the group has the correct owner
        assert group.owner_id == user1.id

        # check that the group has the correct members
        assert len(group.members) == 2
        assert group.members[0].id == user1.id
        assert group.members[1].id == user2.id

        # check the output of to_dict_base() method
        assert group.to_dict_base() == {
            "id": group.id,
            "name": "Test Group",
            "ownerId": user1.id,
            "createdAt": group.created_at,
            "updatedAt": group.updated_at,
        }

        # check the output of to_dict() method
        assert group.to_dict() == {
            "id": group.id,
            "name": "Test Group",
            "ownerId": user1.id,
            "members": [user1.to_dict(), user2.to_dict()],
            "createdAt": group.created_at,
            "updatedAt": group.updated_at,
        }
