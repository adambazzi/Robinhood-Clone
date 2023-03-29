from .db import  SCHEMA, environment, add_prefix_for_prod, db


watchlist_stocks = db.Table(
    'watchlist_stocks',
    db.Column('watchlist_id', db.Integer, db.ForeignKey(
        add_prefix_for_prod("watchlists.id")), primary_key=True),
    db.Column('ticker', db.String, db.ForeignKey(
        add_prefix_for_prod("stocks.ticker")), primary_key=True),
    # Add a foreign key constraint with cascade delete-orphan
    db.ForeignKeyConstraint(['watchlist_id'], [add_prefix_for_prod("watchlists.id")], ondelete='CASCADE',),
    extend_existing=True,
)

if environment == "production":
    watchlist_stocks.schema = SCHEMA
