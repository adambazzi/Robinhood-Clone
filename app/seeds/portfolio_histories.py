from app import db
from app.models import Portfolio_History
from datetime import datetime, timedelta

# Seed the database with portfolio_histories
def seed_portfolio_histories():
    # Get today's date
    today = datetime.utcnow().date()

    # Loop through the past 90 days
    for i in range(90):
        # Calculate the date for this iteration
        date = today - timedelta(days=i)

        # Create a new portfolio_history object with a value incrementing up to 1000
        value = (i + 1) * 10
        portfolio_history = Portfolio_History(portfolio_id=1, value=value, created_at=date)

        # Add the portfolio_history to the database
        db.session.add(portfolio_history)

    # Commit the changes to the database
    db.session.commit()


def undo_portfolio_histories():
    # Delete all portfolio_histories
    Portfolio_History.query.delete()

    # Commit the changes to the database
    db.session.commit()
