from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from sqlalchemy.orm import validates

class Portfolio(db.Model):
    __tablename__ = 'portfolios'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', index=True), nullable=False)
    buying_power = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    # Define Relationships
    # Define One-to-Many relationship with PortfolioHistory table
    portfolio_histories = db.relationship('PortfolioHistory', back_populates='portfolio', cascade='all, delete-orphan')
    # Define One-to-Many relationship with Notification table
    notifications = db.relationship('Notification', back_populates='portfolio', cascade='all, delete-orphan')
    # Define a one-to-one relationship between portfolio and user
    user = db.relationship('User', uselist=False, back_populates='portfolio')

    # Validations
    @validates('buying_power')
    def validate_buying_power(self, key, value):
        if value is not None and value < 0:
            raise ValueError('Buying power must be a positive integer or null.')
        return value

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'buyingPower': self.buying_power,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }
