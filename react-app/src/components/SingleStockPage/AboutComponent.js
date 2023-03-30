
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
            {details.description && <p className="about-description">{ details.description }</p>}
            <ul className="about-list">
                {details.ceo && <li className="about-list-item"><div><strong>CEO</strong></div><div>{details.ceo}</div></li>}
                {details.hq_state && <li className="about-list-item"><div><strong>Headquarters</strong></div><div><span className="about-hq-state">{ details.hq_state }</span></div></li>}
                {details.employees && <li className="about-list-item"><div><strong>Number of employees</strong></div><div className="about-employees">{ numberWithCommas(details.employees) }</div></li>}
                {details.listdate && <li className="about-list-item"><div><strong>Founded</strong></div><div className="about-list-date">{ details.listdate.slice(0,4) }</div></li>}
            </ul>
        </section>
    )
}
