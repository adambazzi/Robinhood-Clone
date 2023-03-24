from flask import Blueprint, jsonify, request, redirect
from app.models import Stock, Transaction, Portfolio, Investment, User, db
from flask_login import login_required, current_user

stock_routes = Blueprint('stocks', __name__)

@stock_routes.route('/')
def get_all_stocks():
    """
    Get all stocks
    """

    # Query for all stocks
    all_stocks = Stock.query.all()

    # Convert stocks to list of dictionaries
    stocks_dict = [stock.to_dict() for stock in all_stocks]

    return jsonify(stocks_dict)

@stock_routes.route('/<string:ticker>')
def get_single_stock(ticker):
    """
    Get single stock
    """

    # Query for all single stock
    single_stock = Stock.query.filter_by(ticker=ticker.upper()).first()

    # Check if the stock was found
    if not single_stock:
        return jsonify({'message': f'Stock with ticker {ticker} not found'}), 404

    return jsonify(single_stock.to_dict())
