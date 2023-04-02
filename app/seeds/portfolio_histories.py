from app import db
from app.models import Portfolio_History
from datetime import datetime, timedelta
import requests
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Seed the database with portfolio_histories
def seed_portfolio_histories():
    def fetch_stock_chart_data(ticker, range=365):
        api_key = os.environ.get('REACT_APP_POLYGON_API_KEY')
        date_to = datetime.now()
        date_from = datetime.now() - timedelta(days=range)
        to = date_to.date().isoformat()
        from_ = date_from.date().isoformat()
        url = f"https://api.polygon.io/v2/aggs/ticker/{ticker}/range/1/day/{from_}/{to}?apiKey={api_key}"
        response = requests.get(url)
        data = response.json()
        return data

    data = fetch_stock_chart_data('TSLA')
    dates = [datetime.fromtimestamp(result['t'] / 1000).strftime('%Y-%m-%d %H:%M:%S') for result in data['results']]
    values = [result['c'] for result in data['results']]

    portfolio_histories = [Portfolio_History(portfolio_id=1, value=value, created_at=datetime.strptime(date, '%Y-%m-%d %H:%M:%S')) for date, value in zip(dates, values)]


    # Add the portfolio_histories to the database
    db.session.add_all(portfolio_histories)
    # Commit the changes to the database
    db.session.commit()


def undo_portfolio_histories():
    # Delete all portfolio_histories
    Portfolio_History.query.delete()

    # Commit the changes to the database
    db.session.commit()
