import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    axios
      .get(url, {
        headers: {
          network: process.env.REACT_APP_NETWORK,
          signal: controller.signal,
        },
      })
      .then((resp) => {
        setData(resp.data);
        console.log(resp.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
    controller.abort();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
