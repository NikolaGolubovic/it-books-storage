import React from "react";
import Slider from "./Slider";
import TopCarousel from "./TopCarousel";

const Homepage = () => {
  return (
    <div>
      <TopCarousel />
      <Slider sliderType={"newBooks"} title={"New Books"} />
      <Slider sliderType={"javascript"} title={"Javascript Books"} />
      <Slider sliderType={"python"} title={"Python Books"} />
    </div>
  );
};

export default Homepage;
