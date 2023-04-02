from flask import Blueprint, jsonify, request
from app.models import Portfolio_History, db
from flask_login import login_required

portfolio_history_routes = Blueprint('portfolio_histories', __name__)


@portfolio_history_routes.route('/', methods=['GET'])
@login_required
def get_portfolio_history():
    """
    Get protfolio histories for user
    """

    portfolio_id = int(request.args.get('portfolioId'))

    # Query for the history with the given ID
    portfolio_histories = Portfolio_History.query.filter_by(portfolio_id=int(portfolio_id)).all()

    # Check if the history exists
    if not portfolio_histories:
        return jsonify({'message': 'Portfolio not found'}), 404

    # Return the history data
    histories_data = [item.to_dict() for item in portfolio_histories]

    return jsonify(histories_data), 200

@portfolio_history_routes.route('', methods=['POST'])
@login_required
def create_portfolio_history():
    """
    Creates a new portfolio history for the current user
    """
    # Parse request data
    data = request.get_json()
    portfolio_id = data.get('portfolioId')
    value = data.get('value')


    # Create new portfolio history
    portfolio_history = Portfolio_History(
        portfolio_id=portfolio_id,
        value=value
    )

    db.session.add(portfolio_history)
    db.session.commit()

    # Return newly created watchlist
    return jsonify(portfolio_history.to_dict()), 201
