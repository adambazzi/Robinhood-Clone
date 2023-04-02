import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import './ProfileButton.css'
import { NavLink, useHistory } from "react-router-dom";
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingColumns } from '@fortawesome/free-solid-svg-icons';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());

    history.push('/login')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <button onClick={openMenu} className="profile-button">
        Account
      </button>
      <div className={ulClassName} ref={ulRef}>
        <div className="user-name">{user.first_name} {user.last_name}</div>
        <div>
          <NavLink className="transfers-button" to="/transfers" onClick={() => closeMenu()}><div className="transfers-button1"><FontAwesomeIcon icon={faBuildingColumns} /></div><div className="transfers-button2">Transfers</div></NavLink>
        </div>
        <div>
          <button onClick={handleLogout} className="logout-button"><div className="logout-button1"><FontAwesomeIcon icon={faArrowRightFromBracket} /></div><div className="logout-button2">Log out</div></button>
        </div>
      </div>

    </>
  );
}

export default ProfileButton;
