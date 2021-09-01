import React, { useState, useEffect } from "react";
import { carouselArr } from "../data/images";

const TopCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [buttons, setButtons] = useState(Array(carouselArr.length).fill([]));
  useEffect(() => {
    const timer = setInterval(() => {
      if (current + 1 === carouselArr.length) {
        return setCurrent(0);
      }
      setCurrent(current + 1);
    }, 5000);
    return () => clearInterval(timer);
  });

  return (
    <>
      <div className="top-carousel-container">
        <div
          className="top-carousel"
          style={{ transform: `translateX(-${55 * current}vw)` }}
        >
          {carouselArr.map((imgUrl) => {
            return (
              <span key={imgUrl}>
                <img src={imgUrl} alt="" />
              </span>
            );
          })}
        </div>
        <div className="top-carousel-buttons">
          {buttons.map((btn, index) => {
            return (
              <button
                className="top-carousel-btn"
                style={{
                  background: index === current ? "white" : "transparent",
                }}
                onClick={() => setCurrent(index)}
                key={index}
              ></button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TopCarousel;
