
import React from "react";
import './AboutComponent.css'

export default function AboutComponent ({details}) {

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    if (!details) return null

    return (
        <section className='about-section'>
            <div className="about-heading">About</div>
            <p className="about-description">{ details.description }</p>
            <ul className="about-list">
                <li className="about-list-item"><div><strong>CEO</strong></div><div>{details.ceo}</div></li>
                <li className="about-list-item"><div><strong>Headquarters</strong></div><div><span className="about-hq-state">{ details.hq_state }</span></div></li>
                <li className="about-list-item"><div><strong>Number of employees</strong></div><div className="about-employees">{ numberWithCommas(details.employees) }</div></li>
                <li className="about-list-item"><div><strong>Founded</strong></div><div className="about-list-date">{ details.listdate.slice(0,4) }</div></li>
            </ul>
        </section>
    )
}
