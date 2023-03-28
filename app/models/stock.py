from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from sqlalchemy.orm import validates

class Stock(db.Model):
    __tablename__ = 'stocks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    ticker = db.Column(db.String(10), primary_key=True, nullable=False)
    org_name = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Define Relationships
    # Define Many-to-Many relationship with Watchlists table
    watchlists = db.relationship('Watchlist', secondary='watchlist_stocks', back_populates='stocks')
    # Define One-to-Many relationship with Transaction table
    transactions = db.relationship('Transaction', back_populates='stock')
    # Define One-to-Many relationship with Investment table
    investments = db.relationship('Investment', back_populates='stock')


    # Validations
    @validates('ticker')
    def validate_ticker(self, key, value):
        if not value.isalpha():
            raise ValueError('Ticker can only contain letters and numbers.')
        return value

    def to_dict(self):
        return {
            'id': self.ticker,
            'orgName': self.org_name,
            'createdAt': self.created_at
        }
