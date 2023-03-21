from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Watchlist_Stock(db.Model):
    __tablename__ = 'watchlist_stock'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    stock_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('stocks.id')), nullable=False)
    watchlist_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('watchlists.id')), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Add a unique constraint to the WatchlistStock table to ensure that there is only one individual stock per watchlist.
    __table_args__ = (db.UniqueConstraint('stock_id', 'watchlist_id', name='_stock_watchlist_uc'),)

    # Define Relationships
    # Define Many-to-One relationship with stocks table
    stock = db.relationship("Stock", back_populates="watchlist_stocks")
    # Define Many-to-One relationship with watchlists table
    watchlist = db.relationship("Watchlist", back_populates="watchlist_stocks")

    def to_dict(self):
        return {
            'id': self.id,
            'stockId': self.stock_id,
            'watchlistId': self.watchlist_id,
            'createdAt': self.created_at,
        }
