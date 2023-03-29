from app import db
from app.models import Watchlist, SCHEMA, environment
from sqlalchemy.sql import text

# Seed the database with 2 watchlists for user1
def seed_watchlists():
    # Create watchlists

    watchlist1 = Watchlist(user_id=1, name='Tech Giants')
    watchlist2 = Watchlist(user_id=1, name='Financial Stocks')

    # Add the watchlists to the database
    db.session.add_all([watchlist1, watchlist2])
    db.session.commit()


def undo_watchlists():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlists"))

    db.session.commit()
