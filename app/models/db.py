from flask_sqlalchemy import SQLAlchemy

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# SQLAlchemy class instantiated (ORM used to interact with a databse, define classes to represent db tables, and the instances of those classes rep. rows in the table)
# Use OOP language instead of SQL 
db = SQLAlchemy()

# helper function for adding prefix to foreign key column references in production
def add_prefix_for_prod(attr):
    if environment == "production":
        return f"{SCHEMA}.{attr}"
    else:
        return attr