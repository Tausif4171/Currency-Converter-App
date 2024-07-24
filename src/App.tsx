import React, { useState, useEffect } from "react";
import "./App.css";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

function App() {
  const [amount, setAmount] = useState<any>(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [date, setDate] = useState<any>(new Date());
  const [rates, setRates] = useState({});
  const [output, setOutput] = useState(0);
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");

  useEffect(() => {
    const getRates = async () => {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/97d29519909f473c87f4a60b/latest/${fromCurrency}`
      ).then((response) => response.json());
      setRates(response.conversion_rates);
    };
    getRates();
  }, [fromCurrency]);

  const calculateOutput = async () => {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/97d29519909f473c87f4a60b/history/${fromCurrency}/${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}`
    ).then((response) => response.json());
    const fetchedRates = response.conversion_rates;
    const CurrencyRate = fetchedRates[toCurrency];
    const output = amount * CurrencyRate;
    setOutput(output);
  };

  const handleFromClick = () => {
    setFromDropdownOpen(!fromDropdownOpen);
    setToDropdownOpen(false);
  };

  const handleToClick = () => {
    setToDropdownOpen(!toDropdownOpen);
    setFromDropdownOpen(false);
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
          className="w-full outline-none p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          From:
        </label>
        <div
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          onClick={handleFromClick}
        >
          {fromCurrency}
        </div>
        {fromDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-52 overflow-y-auto">
            <input
              type="text"
              value={fromSearch}
              onChange={(e) => setFromSearch(e.target.value)}
              className="w-full outline-none p-2 border-b border-gray-300"
              placeholder="Search currency"
            />
            {Object.keys(rates)
              .filter((currency) =>
                currency.toLowerCase().includes(fromSearch.toLowerCase())
              )
              .map((currency, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setFromCurrency(currency);
                    setFromDropdownOpen(false);
                    setFromSearch(""); // Reset search input
                  }}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {currency}
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          To:
        </label>
        <div
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          onClick={handleToClick}
        >
          {toCurrency}
        </div>
        {toDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-52 overflow-y-auto">
            <input
              type="text"
              value={toSearch}
              onChange={(e) => setToSearch(e.target.value)}
              className="w-full outline-none p-2 border-b border-gray-300"
              placeholder="Search currency"
            />
            {Object.keys(rates)
              .filter((currency) =>
                currency.toLowerCase().includes(toSearch.toLowerCase())
              )
              .map((currency, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setToCurrency(currency);
                    setToDropdownOpen(false);
                    setToSearch(""); // Reset search input
                  }}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {currency}
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date:
        </label>
        <DatePicker
          value={date}
          onChange={setDate}
          format="y-MM-dd"
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
