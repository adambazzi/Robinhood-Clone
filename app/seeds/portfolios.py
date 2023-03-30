from app import db
from app.models import Portfolio, SCHEMA, environment
from sqlalchemy.sql import text

# Seed the database with 4 stocks
def seed_portfolios():
    # Create watchlists

    portfolio1 = Portfolio(id=1, user_id=1, buying_power=1000)
    portfolio2 = Portfolio(id=2, user_id=2, buying_power=1000)
    portfolio3 = Portfolio(id=3, user_id=3, buying_power=1000)

    # Add the watchlists to the database
    db.session.add_all([portfolio1, portfolio2, portfolio3])
    db.session.commit()


def undo_porfolios():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.portfolios RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM portfolios"))

    db.session.commit()
