from flask import Blueprint, jsonify, request
from app.models import Watchlist, db
from flask_login import login_required, current_user
from sqlalchemy import func

watchlist_routes = Blueprint('watchlists', __name__)

@watchlist_routes.route('')
@login_required
def get_current_user_watchlists():
    """
    Get all current user's watchlists and returns them in a list of watchlist dictionaries
    """
    # Query for all watchlists associated with the current user
    current_user_watchlists = Watchlist.query.filter_by(user_id=current_user.id).all()

    if not current_user_watchlists:
        return jsonify({'message': 'Unable to locate watchlists'}), 404

    watchlist_data = [watchlist.to_dict() for watchlist in current_user_watchlists]

    return jsonify(watchlist_data), 200

@watchlist_routes.route('', methods=['POST'])
@login_required
def create_watchlist():
    """
    Creates a new watchlist for the current user
    """
    # Parse request data
    data = request.get_json()
    name = data.get('name')

    # Error handler 1: Check if name was provided
    if not name:
        return jsonify({'message': 'Watchlist name is required'}), 400

    # Create new watchlist
    new_watchlist = Watchlist(
        name=name,
        user_id=current_user.id
    )

    db.session.add(new_watchlist)
    db.session.commit()

    # Return newly created watchlist
    return jsonify(new_watchlist.to_dict()), 201

@watchlist_routes.route('/<int:watchlistId>', methods=['PUT'])
def edit_watchlist(watchlistId):
    """
    Edit watchlist
    """

    # Parse request data
    data = request.get_json()

    # Query for the portfolio to be updated
    watchlist = Watchlist.query.get(int(watchlistId))

    # Check if the portfolio exists
    if not watchlist:
        return jsonify({'message': 'Watchlist not found'}), 404

    # Update the portfolio with new data
    watchlist.name = data.get('name')

    db.session.commit()

    # Return updated portfolio
    return jsonify(watchlist.to_dict())

@watchlist_routes.route('/<int:watchlistId>', methods=['DELETE'])
def deleteWatchlist(watchlistId):
    """
    Delete a watchlist by ID
    """
    # Query for the watchlist to be deleted
    watchlist = Watchlist.query.get(watchlistId)

    # Check if the watchlist exists
    if not watchlist:
        # Return a 404 error if the watchlist does not exist
        return jsonify({'message': 'Watchlist not found'}), 404

    # Delete the watchlist from the database
    db.session.delete(watchlist)
    db.session.commit()

    # Return a JSON response with the deleted watchlist data
    return jsonify(watchlist.to_dict())
