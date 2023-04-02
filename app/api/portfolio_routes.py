from flask import Blueprint, jsonify, request
from app.models import Portfolio, db
from flask_login import current_user
from sqlalchemy import func
import pdb

portfolio_routes = Blueprint('portfolio', __name__)


# @portfolio_routes.route('', methods=['POST'])
# def create_portfolio():
#     """
#     Create portfolio
#     """

#     # user = current_user.to_dict()
#     # print(user, '----------- please work ---------')
#     # Parse request data
#     data = request.get_json()

#     # Query for the portfolio to be updated
#     user_id = data..get(user_id)

#     # Create new portfolio
#     new_porfolio = Portfolio(
#         user_id = int(user['id']),
#         buying_power=0,
#     )

#     db.session.add(new_porfolio)
#     db.session.commit()

#     # Return newly created portfolio
#     return jsonify(new_porfolio.to_dict()), 201


@portfolio_routes.route('/<int:portfolioId>', methods=['PUT'])
def edit_portfolio(portfolioId):
    """
    Edit portfolio investment
    """

    # Parse request data
    data = request.get_json()

    # Query for the portfolio to be updated
    portfolio = Portfolio.query.get(portfolioId)

    # Check if the portfolio exists
    if not portfolio:
        return jsonify({'message': 'Portfolio not found'}), 404

    # Update the portfolio with new data
    portfolio.buying_power = data.get('buyingPower')

    db.session.commit()

    # Return updated portfolio
    return jsonify(portfolio.to_dict())

@portfolio_routes.route('/', methods=['GET'])
def get_portfolio():
    """
    Get protfolio for user
    """

    user_id = int(request.args.get('userId'))

    # Query for the portfolio with the given ID
    portfolio = Portfolio.query.filter_by(user_id=int(user_id)).first()

    # Check if the portfolio exists
    if not portfolio:
        return jsonify({'message': 'Portfolio not found'}), 404

    # Return the portfolio data
    return jsonify(portfolio.to_dict())
