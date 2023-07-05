import React, {useState, useEffect} from "react";
import axios from "axios";

const setButtonDoneStyle = (DATA, text) => {
  if (DATA.exercisedButtons && DATA.exercisedButtons.indexOf(text) !== -1) return "#d6e6d6";
  return "rgba(0,0,0,0.025)";
};

export default ({DATA}) => {
  const [buttonMap, setButtonMap] = useState({});

  useEffect(() => {
    axios.get("/routes")
    .then(({data}) => setButtonMap(data))
    .catch(err => console.error(err));
  }, []);

  return <div className="category-and-buttons">
    <div className="buttons">
      {Object.keys(buttonMap).map((category) => {
        return <div key={`category-${category}`} className="category">

          <div className="category-name">{category}</div>
          
          <div className="category-buttons">
            {buttonMap[category].map((buttonData) => {
              return <div key={`button-data-${buttonData[0]}`} className="button-data">
                <div className="button-data-name" style={{borderColor: setButtonDoneStyle(DATA, buttonData[0])}} onClick={() => axios.get(buttonData[1])}>{buttonData[0]}</div>
              </div>
            })}
          </div>
        </div>
      })}
    </div>
  </div>
};