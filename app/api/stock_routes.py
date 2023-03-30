from flask import Blueprint, jsonify, request, redirect
from app.models import Stock, db
from flask_login import login_required, current_user
from sqlalchemy import func

stock_routes = Blueprint('stocks', __name__)

@stock_routes.route('/', methods=['GET'])
@login_required
def get_filtered_stocks():
    """
    Get filtered stocks based on user input
    """

    # Get user input from query parameter
    entry = request.args.get('entry').lower()

    # Query for all stocks matching the user input
    matching_stocks = Stock.query.filter(func.lower(Stock.org_name).like(f"%{entry}%")).all()

    # Convert matching stocks to list of dictionaries
    matching_stocks_dict = [stock.to_dict() for stock in matching_stocks]

    return jsonify(matching_stocks_dict)

@stock_routes.route('/<string:ticker>')
@login_required
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
