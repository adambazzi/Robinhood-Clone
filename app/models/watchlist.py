from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from sqlalchemy.orm import validates
from .user import User

class Watchlist(db.Model):
    __tablename__ = 'watchlist'

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
    stocks = db.relationship('Stock', secondary='watchlist_stock', backref=db.backref('watchlists', lazy='dynamic'), cascade='all, delete-orphan')

    @validates('user_id')
    def validate_user_id(self, key, user_id):
        # Check if the user ID corresponds to an existing user
        user = User.query.filter_by(id=user_id).first()
        if not user:
            raise ValueError('User with that ID does not exist.')
        return user_id

    @validates('name')
    def validate_name(self, key, name):
        # Check if another watchlist with the same name already exists for this user
        existing_watchlist = Watchlist.query.filter_by(user_id=self.user_id, name=name).first()
        if existing_watchlist:
            raise ValueError('Watchlist with that name already exists.')
        return name

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'name': self.name,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
        }
