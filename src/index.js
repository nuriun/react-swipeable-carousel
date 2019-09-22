import React from "react";
import ReactDOM from "react-dom";
import Carousel from "./carousel";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <Carousel
        interval={5}
        autoPlay={true}
        slides={[
          {
            image:
              "https://dpr-cdn.azureedge.net/api/medium/Banner/Image/180/NULL/1500x400/RU?v=ddd32e8d6a170b7994f2e5524253e3d4-1569104880000",
            color: "#218A96"
          },
          {
            image:
              "https://dpr-cdn.azureedge.net/api/medium/Banner/Image/210/NULL/1500x400/RU?v=ddd32e8d6a170b7994f2e5524253e3d4-1569104880000",
            color: "#C9F28D"
          },
          {
            image:
              "https://dpr-cdn.azureedge.net/api/medium/Banner/Image/214/NULL/1500x400/RU?v=ddd32e8d6a170b7994f2e5524253e3d4-1569105000000",
            color: "#F3C24D"
          }
        ]}
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
