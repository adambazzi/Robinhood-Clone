# VGAN

## Project Description

VGAN, a Yelp clone, is a website for users to post their restaurant businesses and leave (possibly passive aggressive) reviews about the businesses.

## Deployed Live Link

[VGAN](https://vgan.onrender.com/)

## Technologies/Frameworks Used

* [Flask](https://flask.palletsprojects.com/en/2.2.x/)

* [React](https://reactjs.org/)

* Flask Dependencies

   * alembic==1.9.2
   * click==8.1.3
   * flask==2.2.2
   * flask-cors==3.0.10
   * flask-login==0.6.2
   * flask-migrate==4.0.2
   * flask-sqlalchemy==3.0.2
   * flask-wtf==1.1.1
   * greenlet==2.0.1
   * gunicorn==20.1.0
   * itsdangerous==2.1.2
   * jinja2==3.1.2
   * mako==1.2.4
   * markupsafe==2.1.2
   * python-dateutil==2.8.2
   * python-dotenv==0.21.0
   * python-editor==1.0.4
   * six==1.16.0
   * sqlalchemy==1.4.46
   * werkzeug==2.2.2
   * wtforms==3.0.1
   * APScheduler==3.8.0
   * requests==2.25.1


* React Dependencies

   * @fortawesome/fontawesome-svg-core: ^6.4.0
   * @fortawesome/free-regular-svg-icons: ^6.4.0
   * @fortawesome/free-solid-svg-icons: ^6.4.0
   * @fortawesome/react-fontawesome: ^0.2.0
   * @testing-library/jest-dom: ^5.16.5
   * @testing-library/react: ^11.2.7
   * @testing-library/user-event: ^12.8.3
   * chart.js: ^3.9.1
   * http-proxy-middleware: ^1.3.1
   * react: ^17.0.2
   * react-chartjs-2: ^3.0.4
   * react-dom: ^17.0.2
   * react-redux: ^7.2.9
   * react-router-dom: ^5.3.4
   * react-scripts: ^4.0.3
   * redux: ^4.2.1
   * redux-logger: ^3.0.6
   * redux-thunk: ^2.4.2


## MVP Core Features

* Users

	* Create, Read

* Watchlists

	* Create, Read, Update, Delete

* Transactions + Investments + Transfers

	* Create, Read, Update, Delete

* Search/Filter

	* Read

* Portfolio History graph

   * Create, Read

* Polygon API

	* Read

## Screenshots



## Future Implementation Goals

- [ ] Notifications

- [ ] Make site responsive to phone devices

## Getting Started

After you clone this project you will need to follow the next steps:

1. Install dependencies by running pipenv install using the requirements.txt file

	```bash
	pipenv install -r requirements.txt
	```
2. Create a .env file based your environments

	This file should include:
	* A SECRET_KEY so csrf calls can be made
	* A SCHEMA unique to your database
	* The DATABASE_URL where your database is located

3. You can enter the pipenv, migrate the database, and run the flask app by running the follow commands

	```bash
	pipenv shell
	```

	```bash
	flask db upgrade
	```

	```bash
	flask seed all
	```

	```bash
	flask run
	```

4. In order to run the React App, run the following commands

	```bash
	cd react-app
	```

	```bash
	npm install
	```

	```bash
	npm start
	```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## Contact

Adam Bazzi - [LinkedIn](https://www.linkedin.com/in/adam-bazzi/) | [GitHub](https://github.com/adambazzi)

## Acknowledgments

* [Font Awesome](https://fontawesome.com/)

* [Polygon](https://polygon.io/)
