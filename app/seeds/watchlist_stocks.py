from app import db
from app.models import Watchlist_Stock, SCHEMA, environment

# Seed the database with 3 stocks for user1
def seed_watchlist_stocks():
    # Create join instance

    join1 = Watchlist_Stock(watchlist_id=1, stock_id=1)
    join2 = Watchlist_Stock(watchlist_id=1, stock_id=2)
    join3 = Watchlist_Stock(watchlist_id=1, stock_id=3)

    # Add to the database
    db.session.add_all([join1, join2, join3])
    db.session.commit()


def undo_watchlist_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlist_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlist_stocks"))

    db.session.commit()
