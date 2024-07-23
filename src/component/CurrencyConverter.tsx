import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ExchangeRateResponse {
  conversion_rates: { [key: string]: number };
}

const CurrencyConverter: React.FC = () => {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [amount, setAmount] = useState<number>(1);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  // Fetch the list of currencies when the component mounts
  useEffect(() => {
    fetchCurrencies();
  }, []);

  // Fetch the conversion rate whenever the relevant state changes
  useEffect(() => {
    if (fromCurrency && toCurrency && amount) {
      fetchConversionRate();
    }
  }, [fromCurrency, toCurrency, amount, date]);

  // Fetch the list of available currencies
  const fetchCurrencies = async () => {
    try {
      const result = await axios.get<ExchangeRateResponse>(
        "https://v6.exchangerate-api.com/v6/7dc41bb5da5297facffca17b/latest/USD"
      );
      setCurrencies(Object.keys(result.data.conversion_rates));
    } catch (error) {
      setError("Failed to fetch currencies. Please try again later.");
    }
  };

  // Fetch the conversion rate for the selected date, from currency, and to currency
  const fetchConversionRate = async () => {
    try {
      const result = await axios.get<ExchangeRateResponse>(
        `https://v6.exchangerate-api.com/v6/7dc41bb5da5297facffca17b/latest/${fromCurrency}`
      );
      setConversionRate(result.data.conversion_rates[toCurrency]);
    } catch (error) {
      setError("Failed to fetch conversion rate. Please try again later.");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value));
  };

  const handleFromCurrencyChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToCurrency(e.target.value);
  };

  return (
    <div>
      <h1>Currency Converter</h1>
      <div>
        <input type="number" value={amount} onChange={handleAmountChange} />
        <select value={fromCurrency} onChange={handleFromCurrencyChange}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <select value={toCurrency} onChange={handleToCurrencyChange}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <DatePicker selected={date} onChange={(date) => setDate(date!)} />
      </div>
      {conversionRate && (
        <div>
          <h2>
            {amount} {fromCurrency} = {(amount * conversionRate).toFixed(2)}{" "}
            {toCurrency}
          </h2>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CurrencyConverter;
