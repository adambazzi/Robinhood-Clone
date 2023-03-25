from flask import Blueprint, jsonify, request, redirect
from app.models import Watchlist, User, db
from flask_login import login_required, current_user

watchlist_routes = Blueprint('watchlists', __name__)

@watchlist_routes.route('/')
def get_current_user_watchlists():
    """
    Get all current user's watchlists and returns them in a list of watchlist dictionaries
    """
    # Query for all watchlists associated with the current user
    current_user_watchlists = Watchlist.query.filter_by(user_id=current_user.id).all()

    watchlist_data = [watchlist.to_dict() for watchlist in current_user_watchlists]

    return jsonify(watchlist_data)

@watchlist_routes.route('/', methods=['POST'])
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
