from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Portfolio_History(db.Model):
    __tablename__ = 'portfolio_histories'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Integer, nullable=False)
    portfolio_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('portfolios.id')), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Define Relationships
    # Define Many-to-One relationship with Portfolio table
    portfolio = db.relationship('Portfolio', back_populates='portfolio_histories')

    def to_dict(self):
        return {
            'id': self.id,
            'value': self.value,
            'portfolioId': self.portfolio_id,
            'createdAt': self.created_at
        }
