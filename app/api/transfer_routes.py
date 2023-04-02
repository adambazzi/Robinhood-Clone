from flask import Blueprint, jsonify, request
from app.models import Transfer, db
from flask_login import login_required
from sqlalchemy import func

transfer_routes = Blueprint('transfers', __name__)

@transfer_routes.route('/')
@login_required
def get_current_user_transfers():
    """
    Get all current user's transfers and returns them in a list of transfer dictionaries
    """
    # Get portfolioId from query parameter
    portfolio_id = int(request.args.get('portfolioId'))

    # Query for all transfers associated with the current user
    current_user_transfers = Transfer.query.filter_by(portfolio_id=portfolio_id).all()

    if not current_user_transfers:
        return jsonify({'message': 'No transfers available'}), 404

    transfer_data = [transfer.to_dict() for transfer in current_user_transfers]

    return jsonify(transfer_data), 200

@transfer_routes.route('', methods=['POST'])
@login_required
def create_transfer():
    """
    Creates a new transfer for the current user
    """
    print('---------- please see this ---------')
    # Parse request data
    data = request.get_json()
    portfolio_id = data.get('portfolioId')
    amount = data.get('amount')

    # Create new transfer
    new_transfer = Transfer(
        portfolio_id = portfolio_id,
        amount = amount
    )

    db.session.add(new_transfer)
    db.session.commit()

    # Return newly created transfer
    return jsonify(new_transfer.to_dict()), 201
