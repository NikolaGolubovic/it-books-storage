import React, { useContext } from "react";
import { fieldsArr } from "../data/images";

const Fields = () => {
  return (
    <div className="fields">
      {fieldsArr.map((field) => {
        return (
          <div key={field.name} className="fields__field-card">
            <img src={field.image} alt={field.name} />
            <a href={`/field/${field.name}`}>{field.name}</a>
          </div>
        );
      })}
    </div>
  );
};

export default Fields;
