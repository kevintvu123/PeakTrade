class TestConfig:
    TESTING = True
    # SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:' creates a temporary in-memory SQLite database
    # destroyed as soon as the tests finish running. Data stored will not persist!!
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SQLALCHEMY_TRACK_MODIFICATIONS = False