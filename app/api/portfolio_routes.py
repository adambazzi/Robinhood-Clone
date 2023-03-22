from flask import Blueprint, jsonify, request
from app.models import Portfolio, db
from flask_login import login_required, current_user
from sqlalchemy import func

portfolio_routes = Blueprint('portfolio', __name__)


@portfolio_routes.route('', methods=['POST'])
@login_required
def create_portfolio():
    """
    Create portfolio
    """

    # Parse request data
    data = request.get_json()

    # Create new portfolio
    new_porfolio = Portfolio(
        user_id= current_user.id,
        buying_power=0,
    )

    db.session.add(new_porfolio)
    db.session.commit()

    # Return newly created portfolio
    return jsonify({'portfolio': new_porfolio.to_dict()}), 201


@portfolio_routes.route('', methods=['PUT'])
@login_required
def edit_portfolio(ticker):
    """
    Edit portfolio investment
    """

    # Parse request data
    data = request.get_json()

    # Query for the portfolio to be updated
    portfolio = Portfolio.query.filter_by(
        user_id=current_user.id
    ).first()

    # Check if the portfolio exists
    if not portfolio:
        return jsonify({'message': 'Portfolio not found'}), 404

    # Update the portfolio with new data
    portfolio.buying_power = data.get('buying_power')

    db.session.commit()

    # Return updated portfolio
    return jsonify({'porfolio': portfolio.to_dict()})
