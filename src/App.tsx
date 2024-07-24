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
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Currency Converter
      </h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount:
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          From:
        </label>
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.keys(rates).map((currency, index) => (
            <option key={index} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          To:
        </label>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.keys(rates).map((currency, index) => (
            <option key={index} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date:
        </label>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        className="w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        onClick={calculateOutput}
      >
        Calculate
      </button>

      {output > 0 && (
        <div className="mt-4 text-lg font-semibold text-gray-800">
          <label>Output: {output.toFixed(2)}</label>
        </div>
      )}
    </div>
  );
}

export default App;
