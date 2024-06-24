import React, { useState, useEffect, useRef } from "react";
import "./Carousel.css";
import avatarIcon from "../../icons/avatar.svg";
import ratingIcon from "../../icons/rating.svg";

const Card = ({ name, rating, date, review }) => {

  return(
    <div className="card">
      <div className="card-header">
        <img src={avatarIcon} alt={name} className="user-image" />
        <div className="card-user-info-wrap">
          <div className="card-user-info">
            <div className="card-user-name">{name}</div>
            <img
              src={ratingIcon}
              alt="별점 5점"
              className="card-user-rating"
            />
          </div>
          <div className="card-user-date">{date}</div>
        </div>
      </div>
      <div className="review-card-body">{review}</div>
    </div>
  );
};

export const Carousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
    }, 5000);

    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, totalPages]);

  const renderCards = () => {
    const startIndex = currentIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items
      .slice(startIndex, endIndex)
      .map((item, index) => <Card key={index} {...item} />);
  };

  return (
    <div className="carousel">
      <div className="cards">{renderCards()}</div>
      <div className="indicators">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={currentIndex === index ? "active" : ""}
          />
        ))}
      </div>
    </div>
  );
};
