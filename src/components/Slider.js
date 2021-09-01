import React, { useEffect, useContext } from "react";
import { StoreContext } from "../contexts/StoreContext";
import useWindowDimensions from "../hooks/useWindowDemensions";
import { Link } from "react-router-dom";

import ACTIONS from "../reducers/Actions";

const Slider = ({ sliderType, title }) => {
  const sliderContext = useContext(StoreContext);
  const { _height, width } = useWindowDimensions();

  function nextSlider(sliderType) {
    sliderContext.dispatch({
      type: ACTIONS.NEXT_SLIDER_NEW,
      payload: { sliderType },
    });
  }
  function backSlider(sliderType) {
    sliderContext.dispatch({
      type: ACTIONS.BACK_SLIDER_NEW,
      payload: { sliderType },
    });
  }

  function bookTemplate(book) {
    return (
      <div className="slider-elem" key={book?.title}>
        <figure className="slider-image">
          <img src={book?.image} alt={book?.title} />
          <figcaption className="slider-title">
            <Link to={`/book/${book.isbn13}`}>{book?.title}</Link>
          </figcaption>
        </figure>
      </div>
    );
  }

  useEffect(() => {
    console.log(width);
  }, [width]);

  return (
    <>
      <h4 style={{ textAlign: "center" }}>{title.toUpperCase()}</h4>
      <div className="slider">
        <button className="btn-back" onClick={() => backSlider(sliderType)}>
          Back
        </button>
        {sliderContext[sliderType].books?.map((book, index) => {
          return width < 540
            ? index === 1 && bookTemplate(book)
            : width < 850
            ? index >= 1 && index <= 2 && bookTemplate(book)
            : width < 1250
            ? index >= 1 && index <= 3 && bookTemplate(book)
            : width < 1650 && width <= 2050
            ? index >= 1 && index <= 4 && bookTemplate(book)
            : index >= 1 && index <= 5 && bookTemplate(book);
        })}
        <button className="btn-next" onClick={() => nextSlider(sliderType)}>
          Next
        </button>
      </div>
    </>
  );
};

export default Slider;
