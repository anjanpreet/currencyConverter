import { useEffect, useState } from "react";

function App() {
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");
  const [convertedValue, setconvertedValue] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [fromValue, setFromValue] = useState("AED");
  const [toValue, setToValue] = useState("AED");
  const [isLoading, setIsLoading] = useState(false);

  function handleFromValueSelection(newFromValue) {
    setFromValue(newFromValue);
  }

  function handleToValueSelection(newToValue) {
    setToValue(newToValue);
  }

  useEffect(() => {
    // Fetch data from the API
    const fetchCurrencies = async () => {
      try {
        const response = await fetch(
          "https://openexchangerates.org/api/currencies.json"
        );
        if (!response.ok) {
          setError("Failed to fetch currencies");
        }
        const data = await response.json();
        // Extract keys from the response and set the state
        const currencyKeys = Object.keys(data);
        setCurrencies(currencyKeys);
      } catch (error) {
        console.error("Error fetching currency data:", error);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(
    function () {
      const convertCurrency = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${fromValue}&to=${toValue}`
          );
          if (!response.ok) {
            setError("Failed to get convertion data");
          }
          setIsLoading(false);
          const data = await response.json();
          const [currency, value] = Object.entries(data.rates)[0];
          console.log(data);
          setconvertedValue(value);
        } catch (error) {
          console.error("Error converting currency :", error);
        }
      };

      amount && convertCurrency();
      return function () {
        setError("");
      };
    },
    [amount, fromValue, toValue]
  );

  return (
    <>
      <input
        type="number"
        id="value"
        name="currencyValue"
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      ></input>
      <select onChange={(e) => handleFromValueSelection(e.target.value)}>
        {currencies.map((i) => (
          <option key={i}>{i}</option>
        ))}
      </select>
      <select onChange={(e) => handleToValueSelection(e.target.value)}>
        {currencies.map((i) => (
          <option key={i}>{i}</option>
        ))}
      </select>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        !error &&
        convertedValue && (
          <p>
            {toValue}
            {": "}
            {convertedValue}
          </p>
        )
      )}
      {error && <p>{error}</p>}
    </>
  );
}

export default App;
