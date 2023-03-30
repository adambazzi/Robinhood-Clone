
from flask import Blueprint, jsonify, request
from app.models import Watchlist_Stock, db
from flask_login import login_required
from sqlalchemy import func, delete, insert, and_

watchlist_stocks_routes = Blueprint('watchlist_stocks', __name__)

@watchlist_stocks_routes.route('', methods=['POST'])
@login_required
def create_watchlist_stocks():
    """
    Creates a new watchlist stock join table entry for the current user
    """
    # Parse request data
    data = request.get_json()
    watchlistStocksList = data.get('addTo')
    stockId = data.get('stockId')

    # Error handler 1: Check if required data was provided
    if not watchlistStocksList or not stockId:
        return jsonify({'message': 'Watchlist stocks and stock ID are required'}), 400

    # Create new watchlist stock join entries
    for id in watchlistStocksList:

        # Create new watchlist stock entry
        stock = insert(Watchlist_Stock).values(
            watchlist_id=int(id),
            ticker=stockId
        )
        db.session.execute(stock)


    db.session.commit()


    # Return success message
    return jsonify({'message': 'Watchlist stocks created successfully'}), 201





@watchlist_stocks_routes.route('', methods=['DELETE'])
@login_required
def delete_watchlist_stocks():
    """
    Delete a watchlist stock join table entry by ID
    """
    # Parse request data
    data = request.get_json()
    watchlistStocksList = data.get('remove')
    stockId = data.get('stockId')

    # Error handler 1: Check if required data was provided
    if not watchlistStocksList or not stockId:
        return jsonify({'message': 'Watchlist stocks and stock ID are required'}), 400


    for id in watchlistStocksList:
        # Check if watchlist stock entry exists
        watchlist_stock = delete(Watchlist_Stock).where(and_(Watchlist_Stock.c.watchlist_id == int(id), Watchlist_Stock.c.ticker == stockId))

        db.session.execute(watchlist_stock)

    db.session.commit()

    # Return success message
    return jsonify({'message': 'Watchlist stocks deleted successfully'}), 200
