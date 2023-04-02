import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearTransfers, getTransfers } from "../../store/transfers";
import { clearPortfolios, getPortfolio } from "../../store/portfolio";
import TransferFormModal from "./TransferFormModal";
import TransferComponent from "./TransferComponent";
import OpenModalButton from "../OpenModalButton";

import './index.css'

function TransfersPage() {
    const user = useSelector(state => state.session.user);
    const portfolio = useSelector(state => state.portfolio);
    const transfers = useSelector(state => state.transfers);
    const dispatch = useDispatch();

    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();


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

    useEffect(() => {
        dispatch(getPortfolio(user.id));
        dispatch(getTransfers(portfolio.id));

    }, [dispatch, user.id, portfolio.id]);

    useEffect(() => {
        dispatch(clearPortfolios)
        dispatch(clearTransfers)
    }, [])

    const closeMenu = () => setShowMenu(false);

    return (
        <section className="transfers__main">
            <h1 className="transfers-nav">{`${user.first_name} ${user.last_name}`}</h1>
            <div className="transfers-main">
                <div className="transfer-menu-button__container">
                    <OpenModalButton
                        buttonText="Transfer Money"
                        onItemClick={closeMenu}
                        modalComponent={<TransferFormModal portfolio={portfolio} />}
                    />
                </div>
                <h2>Completed Transfers</h2>
                {Object.values(transfers).length > 0 &&
                Object.values(transfers)
                    .sort((a, b) => {
                    return new Date(b.executed_at) - new Date(a.executed_at);
                    })
                    .map((transfer) => <TransferComponent transfer={transfer} />)
                }
            </div>
        </section>
    );
}

export default TransfersPage;
