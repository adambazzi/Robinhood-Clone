import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import { getFilteredStocks } from '../../store/stocks';
import './Navigation.css';
import SearchBarComponent from './SearchBarComponent';
import { useStockContext } from '../../context/StockContext';

function Navigation() {
  const sessionUser = useSelector(state => state.session.user);
  const [timeoutState, setTimeoutState] = useState(null)
  const { stockSearchQuery, setStockSearchQuery } = useStockContext();
  const dispatch = useDispatch();
  const searchBarRef = useRef(null);
  const history = useHistory();

  const handleSearchQueryChange = e => {
    setStockSearchQuery(e.target.value);
    if (timeoutState) {
      clearTimeout(timeoutState);
    }
    setTimeoutState(setTimeout(() => {
      dispatch(getFilteredStocks(e.target.value));
    }, 500));
  };

  const stocks = useSelector(state => state.stocks);

  useEffect(() => {
    // Add an event listener to the document object that listens for click events
    const handleDocumentClick = e => {
      // Check if the clicked element is inside the search bar container
      if (searchBarRef.current && searchBarRef.current.contains(e.target)) {
        return;
      }
      // If not, hide the search suggestions by setting the search query to an empty string
      setStockSearchQuery('');
    };
    document.addEventListener('click', handleDocumentClick);
    // Remove the event listener when the component is unmounted
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [searchBarRef, setStockSearchQuery]);

  const handleKeyDown = e => {
    // If the Enter key is pressed and there are search results, select the first one
    if (e.key === 'Enter' && Object.values(stocks).length > 0) {
      e.preventDefault(); // Prevent the form from submitting
      history.push(`/stocks/${Object.values(stocks)[0].id}`)
      setStockSearchQuery('')
    }
  };

  return (
    <div className="navbar_container">
      <NavLink exact to="/" className="navbar__logo">
        <img
          src="https://seeklogo.com/images/R/robinhood-icon-logo-ACF2820914-seeklogo.com.png"
          alt="Logo"
          width={25}
        />
      </NavLink>
      <div className="navbar__searchContainer">
        <i className="fa fa-search search-icon"></i>
        <input
          placeholder="Search"
          type="text"
          value={stockSearchQuery}
          onChange={handleSearchQueryChange}
          onKeyDown={handleKeyDown} // Add the onKeyDown event listener
        />
	  {Object.values(stocks).length > 0 && stockSearchQuery.length > 0 && (
		<div className='searchBar__results'>
			{Object.values(stocks)
			.slice(0, 6) // limit the results to the first 6 elements
			.map(stock => <SearchBarComponent stock={stock} key={stock.id}/>)}
		</div>
	   )}
      </div>

      <div className="navbar__menuItems">
        <a href="/">Investing</a>
        <a href="/">PortFolio</a>
        <a href="https://www.linkedin.com/in/adam-bazzi/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://github.com/adambazzi" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="/">Notifications</a>
        <ul className="navbar__account">
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navigation;
