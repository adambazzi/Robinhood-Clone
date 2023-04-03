from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from sqlalchemy.orm import validates

class Portfolio(db.Model):
    __tablename__ = 'portfolios'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    buying_power = db.Column(db.Float(2), default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    # Define Relationships
    # Define One-to-Many relationship with PortfolioHistory table
    portfolio_histories = db.relationship('Portfolio_History', back_populates='portfolio')
    # Define One-to-Many relationship with Notification table
    notifications = db.relationship('Notification', back_populates='portfolio')
    # Define One-to-Many relationship with Notification table
    transactions = db.relationship('Transaction', back_populates='portfolio')
    # Define a One-to-Many relationship between portfolio and investments
    investments = db.relationship('Investment', back_populates='portfolio')
    # Define a one-to-one relationship between portfolio and user
    user = db.relationship('User', uselist=False, back_populates='portfolio')
    # Define One-to-Many relationship with Transfer table
    transfers = db.relationship('Transfer', back_populates='portfolio')

    # Validations
    @validates('buying_power')
    def validate_buying_power(self, key, value):
        if value is not None and value < 0:
            raise ValueError('Buying power must be a positive integer or null.')
        return value

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'buying_power': self.buying_power,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
