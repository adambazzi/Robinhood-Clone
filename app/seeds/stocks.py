from app import db
from app.models import Stock, SCHEMA, environment

# Seed the database with 4 stocks
def seed_stocks():
    # Create watchlists

    stock1 = Stock(ticker='TSLA', org_name='Tesla, Inc.')
    stock2 = Stock(ticker='GM', org_name='General Motors Co.')
    stock3 = Stock(ticker='DOW', org_name='Dow, Inc.')
    stock4 = Stock(ticker='AAPL', org_name='Apple, Inc.')

    # Add the watchlists to the database
    db.session.add_all([stock1, stock2, stock3, stock4])
    db.session.commit()


def undo_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM stocks"))

    db.session.commit()
