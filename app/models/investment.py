from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from sqlalchemy.orm import validates

class Investment(db.Model):
    __tablename__ = 'investments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('portfolios.id')), nullable=False)
    stock_id = db.Column(db.String, db.ForeignKey(add_prefix_for_prod('stocks.ticker')), nullable=False)
    num_shares = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    # Define Relationships
    # Define Many-to-One relationship with Portfolio table
    portfolio = db.relationship('Portfolio', back_populates='investments')
    # Define a Many-to-one relationship with Stocks
    stock = db.relationship('Stock', back_populates='investments')


    # Validations
    @validates('num_shares')
    def validate_integer_value(self, key, value):
        if value < 0:
            raise ValueError(f'{key} must be a positive integer.')
        return value

    def to_dict(self):
        return {
            'id': self.id,
            'portfolio_id': self.portfolio_id,
            'stock_id': self.stock_id,
            'num_shares': self.num_shares,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
