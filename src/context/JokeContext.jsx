import { createContext, useState, useEffect } from "react";
import { url, options } from "../data/joke";

export const JokeContext = createContext();

export function JokeContextProvider(props) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        let actualData = await response.json();
        setData(actualData.results);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const newData = async () => {
    try {
      const response = await fetch('https://icanhazdadjoke.com/', options);
      let actualData = await response.json();
      setData([...data, actualData]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <JokeContext.Provider value={{ data, loading, error, newData }}>
      {props.children}
    </JokeContext.Provider>
  );
}
