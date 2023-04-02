from app.models import Investment, Portfolio_History, Portfolio, db
from dotenv import load_dotenv
import os
import requests
from flask import current_app
from app import app

def calculate_net_worth():
    with current_app.app_context():
        def fetch_closing_cost(stock_id):
            with current_app.app_context():
                api_key = os.environ.get('REACT_APP_POLYGON_API_KEY')
                url = f'https://api.polygon.io/v1/open-close/{stock_id}/2023-01-09?adjusted=true&apiKey={api_key}'
                with requests.get(url) as response:
                    data = response.json()
                return data['close']

        with app.app_context():
            portfolios = Portfolio.query.all()

            for portfolio in portfolios:
                investments = Investment.query.filter_by(portfolio_id=int(portfolio['id'])).all()
                net_worth = 0.0

                for investment in investments:
                    closing_cost = float(fetch_closing_cost(int(investment.stock_id)))
                    investment_value = closing_cost * float(investment.num_shares)
                    net_worth += investment_value

                portfolio_history = Portfolio_History(portfolio_id=int(portfolio['id']), value=net_worth)

                db.session.add(portfolio_history)

            db.session.commit()
