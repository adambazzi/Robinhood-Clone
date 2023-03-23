import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

	return (
		<div className="navbar_container">
			<NavLink exact to="/" className="navbar__logo">
				<img src='https://seeklogo.com/images/R/robinhood-icon-logo-ACF2820914-seeklogo.com.png'  alt='Logo' width={25}/>
			</NavLink>
			<div className="navbar__searchContainer">
				<i className="fa fa-search search-icon"></i>
				<input placeholder="Search" type="text"></input>
			</div>
			<div className="navbar__menuItems">
				<a href="/">Investing</a>
				<a href="/">PortFolio</a>
				<a href="/">Cash</a>
				<a href="/">Messages</a>
				<a href="/">Notifications</a>
				<ul className='navbar__account'>
					{isLoaded && (
					<li>
						<ProfileButton user={sessionUser} />
					</li>
					)}
				</ul>
			</div>
		</div>
	);
}

export default Navigation;
