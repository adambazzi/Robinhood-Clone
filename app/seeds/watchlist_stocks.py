from app import db
from app.models import SCHEMA, environment
from app.models.watchlist_stock import Watchlist_Stock
from sqlalchemy import insert
from sqlalchemy.sql import text

# Seed the database with 3 stocks for user1
def seed_watchlist_stocks():
    # Create join instance

    watchlist_stock_data = [
        {'watchlist_id': 1, 'ticker': 'TSLA'},
        {'watchlist_id': 1, 'ticker': 'FISV'}
    ]

    for data in watchlist_stock_data:
        stock = insert(Watchlist_Stock).values(
            watchlist_id = data['watchlist_id'],
            ticker = data['ticker']
        )
        db.session.execute(stock)

    db.session.commit()

def undo_watchlist_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlist_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlist_stocks"))

    db.session.commit()
