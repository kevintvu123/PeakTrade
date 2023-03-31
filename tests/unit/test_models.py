from app.models.user import User
#run "pipenv run pytest" in terminal even in pipenv shell to run the test

def test_user_creation():
    """
    GIVEN a User model
    WHEN a new User is created
    THEN check the email, hashed_password, first_name, last_name, and buying_power are defined correctly
    """
    #Create a new user object
    #using 'password' instead of 'hashed_password' because the 'password' attribute is the one with the setter method
    user = User(
        email="test@example.com",
        first_name="John",
        last_name="Doe",
        buying_power=10000.00,
        password="password"
    )

    #Check that the user object was created

    assert isinstance(user, User)

    #Check that the user's attributes were set correctly
    assert user.email == "test@example.com"
    assert user.first_name == "John"
    assert user.last_name == "Doe"
    assert user.buying_power == 10000.00

    #Check that the password was hashed
    print(user.password)
    assert user.password != "password"
    assert user.check_password("password")  #Check that check_password function returns True for the original password


