import React, { useState, useEffect } from "react";
import DatePicker from "react-date-picker";
import Dropdown from "./Dropdown";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [date, setDate] = useState<any>(new Date());
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [output, setOutput] = useState<number>(0);

  useEffect(() => {
    const getRates = async () => {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/78317c6630ec3516eee334c3/latest/${fromCurrency}`
      ).then((response) => response.json());
      setRates(response.conversion_rates);
    };
    getRates();
  }, [fromCurrency]);

  const calculateOutput = async () => {
    if (!(date instanceof Date)) return;
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/78317c6630ec3516eee334c3/history/${fromCurrency}/${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}`
    ).then((response) => response.json());
    const fetchedRates = response.conversion_rates;
    const CurrencyRate = fetchedRates[toCurrency];
    const output = amount * CurrencyRate;
    setOutput(output);
  };

  return (
    <div className="max-w-lg mt-16 mx-auto p-6 bg-white shadow-lg border border-[#ddd] rounded-xl">
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
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full outline-none p-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <Dropdown
        label="From"
        selected={fromCurrency}
        options={Object.keys(rates)}
        onOptionSelect={setFromCurrency}
      />

      <Dropdown
        label="To"
        selected={toCurrency}
        options={Object.keys(rates)}
        onOptionSelect={setToCurrency}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date:
        </label>
        <DatePicker
          value={date}
          onChange={setDate}
          format="y-MM-dd"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
        />
      </div>

      <button
        className="w-full outline-none bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600"
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
};

export default CurrencyConverter;
