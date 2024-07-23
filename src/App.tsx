import React, { useState, useEffect } from "react";
import "./App.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [amount, setAmount] = useState<any>(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [date, setDate] = useState<any>(new Date());
  const [rates, setRates] = useState({});
  const [output, setOutput] = useState(0);

  useEffect(() => {
    getRates();
  }, []);

  const getRates = async () => {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/5be7d45e147adb2a8626f8c4/latest/${fromCurrency}`
    ).then((response) => response.json());
    setRates(response.conversion_rates);
  };

  const calculateOutput = async () => {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/5be7d45e147adb2a8626f8c4/history/${fromCurrency}/${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}`
    ).then((response) => response.json());
    const fetchedRates = response.conversion_rates;
    const CurrencyRate = fetchedRates[toCurrency];
    const output = amount * CurrencyRate;
    setOutput(output);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Currency Converter
      </h1>

      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="input-from">
        <label>From:</label>
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {Object.keys(rates).map((currency, index) => (
            <option key={index} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div className="input-to">
        <label>To:</label>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {Object.keys(rates).map((currency, index) => (
            <option key={index} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div className="input-date">
        <label>Date:</label>
        <DatePicker selected={date} onChange={(date) => setDate(date)} />
      </div>
      <button className="btn" onClick={calculateOutput}>
        Calculate
      </button>
      <div className="output">
        <label>Output: {output}</label>
      </div>
    </div>
  );
}

export default App;
