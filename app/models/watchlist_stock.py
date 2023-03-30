from .db import SCHEMA, environment, add_prefix_for_prod, db

Watchlist_Stock = db.Table(
    'watchlist_stocks',
    db.Column('watchlist_id', db.Integer, db.ForeignKey(
        add_prefix_for_prod("watchlists.id")), primary_key=True),
    db.Column('ticker', db.String, db.ForeignKey(
        add_prefix_for_prod("stocks.ticker")), primary_key=True),
    # Add a foreign key constraint with cascade delete-orphan
    db.ForeignKeyConstraint(['watchlist_id'], [add_prefix_for_prod("watchlists.id")], ondelete='CASCADE',),
    extend_existing=True
)
# Define a query attribute
# db.Model.query = db.session.query_property()


if environment == "production":
    Watchlist_Stock.schema = SCHEMA
