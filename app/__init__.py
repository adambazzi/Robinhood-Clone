import os
######
from apscheduler.schedulers.background import BackgroundScheduler
from app.models import Investment, Portfolio_History, Portfolio, db, User
import requests

########
from flask import Flask, request, redirect, current_app
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import generate_csrf
from flask_login import LoginManager
# from .models import db, User
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.watchlist_routes import watchlist_routes
from .api.stock_routes import stock_routes
from .api.transaction_routes import transaction_routes
from .api.portfolio_routes import portfolio_routes
from .api.investment_routes import investment_routes
from .api.watchlist_stocks_routes import watchlist_stocks_routes
from .api.transfer_routes import transfer_routes
from .api.portfolio_history_routes import portfolio_history_routes
from .seeds import seed_commands
from .config import Config

app = Flask(__name__, static_folder='../react-app/build', static_url_path='/')

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(watchlist_routes, url_prefix='/api/watchlists')
app.register_blueprint(stock_routes, url_prefix='/api/stocks')
app.register_blueprint(investment_routes, url_prefix='/api/investments')
app.register_blueprint(portfolio_routes, url_prefix='/api/portfolio')
app.register_blueprint(watchlist_stocks_routes, url_prefix='/api/watchlist_stocks')
app.register_blueprint(transfer_routes, url_prefix='/api/transfers')
app.register_blueprint(portfolio_history_routes, url_prefix='/api/portfolio_histories')

app.register_blueprint(transaction_routes, url_prefix='/api/transactions')
db.init_app(app)
Migrate(app, db)

# Application Security
CORS(app)


# Since we are deploying with Docker and Flask,
# we won't be using a buildpack when we deploy to Heroku.
# Therefore, we need to make sure that in production any
# request made over http is redirected to https.
# Well.........
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response


@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
                    app.view_functions[rule.endpoint].__doc__ ]
                    for rule in app.url_map.iter_rules() if rule.endpoint != 'static' }
    return route_list


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


def calculate_net_worth():
    with app.app_context():
        print('------- i just ran -------------')
        def fetch_closing_cost(stock_id):
            with current_app.app_context():
                api_key = 'Tm5shHTsQ1xTD2yX5jesV303MwMB1Esb'
                url = f'https://api.polygon.io/v1/open-close/{stock_id}/2023-01-09?adjusted=true&apiKey={api_key}'
                with requests.get(url) as response:
                    data = response.json()
                return data['close']

        with app.app_context():
            portfolios = Portfolio.query.all()

            for portfolio in portfolios:
                investments = Investment.query.filter_by(portfolio_id=portfolio.id).all()
                net_worth = 0.0

                for investment in investments:
                    closing_cost = int(fetch_closing_cost(investment.stock_id))
                    investment_value = closing_cost * investment.num_shares
                    net_worth += investment_value

                portfolio_history = Portfolio_History(portfolio_id=portfolio.id, value=net_worth)

                db.session.add(portfolio_history)

            db.session.commit()

scheduler = BackgroundScheduler()
scheduler.add_job(calculate_net_worth, 'interval', days=1)
scheduler.start()
if __name__ == '__main__':
    app.run()
