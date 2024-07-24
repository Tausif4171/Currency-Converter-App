import React from "react";
import "./App.css";
import CurrencyConverter from "./component/CurrencyConverter";

const App: React.FC = () => {
  return (
    <div className="App">
      <CurrencyConverter />
    </div>
  );
};

export default App;
