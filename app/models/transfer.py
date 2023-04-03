from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from sqlalchemy.orm import validates

class Transfer(db.Model):
    __tablename__ = 'transfers'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('portfolios.id')), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    executed_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Define Relationships
    # Define One-to-Many relationship with Portfolio table
    portfolio = db.relationship('Portfolio', back_populates='transfers')


    def to_dict(self):
        return {
            'id': self.id,
            'portfolio_id': self.portfolio_id,
            'amount': self.amount,
            'executed_at': self.executed_at
        }
