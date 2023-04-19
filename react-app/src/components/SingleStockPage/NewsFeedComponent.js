import React from 'react';
import './NewsFeedComponent.css'

function NewsFeedComponent ({ article }) {
    const title = article.title
    const description = article.description ? article.description.substring(0, 40) : "";
    const imageURL = article.image_url
    const articleURL = article.article_url
    const date = new Date(article.published_utc)
    const formattedDate = date.toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"});
    const name = article.publisher.name


    return (
        <a href={articleURL} target="_blank" rel="noopener noreferrer" className='articleItem'>
            <div className='articleItem-header'>
                <div className='articleItem-source'>{name}</div>
                <div className='articleItem-date'>{formattedDate}</div>
            </div>
            <div className='articleItem-title'>{title}</div>
            <div className='articleItem-description'>{description}...</div>
        </a>
    )
}
export default NewsFeedComponent
