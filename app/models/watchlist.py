from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    # Define Relationships
    # Define Many-to-One relationship with users table
    user = db.relationship("User", back_populates="watchlists")
    # Define Many-to-Many relationship with stocks table through the join table watchlist_stocks
    stocks = db.relationship('Stock', secondary='watchlist_stocks', back_populates='watchlists')


    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'name': self.name,
            'stocks': [stock.to_dict() for stock in self.stocks],
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
        }
