from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from sqlalchemy.orm import validates

class Notification(db.Model):
    __tablename__ = 'notifications'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(30), nullable=False)
    read = db.Column(db.Boolean, nullable=False, default=False)
    portfolio_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('portfolios.id')), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Define Relationships
    # Define Many-to-One relationship with PortfolioHistory table
    portfolio = db.relationship('Portfolio', back_populates='notifications')


    def to_dict(self):
        return {
            'id': self.id,
            'message': self.message,
            'read': self.read,
            'portfolioId': self.portfolio_id,
            'createdAt': self.created_at
        }
