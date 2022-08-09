import React, { useEffect, useState } from "react";

function CurrencyFormat({ value }) {
  const [conversionRate, setConversionRate] = useState(-1);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const convRate = localStorage.getItem("rate");
      const now = new Date();
      if (!convRate || convRate.ttl > now.getTime()) {
        const priceReq = await fetch(
          // "https://api.nomics.com/v1/currencies/ticker?key=3adfe4e337a778eddca7185ed32f76409e559d51&ids=MATIC&interval=1d&convert=INR&platform-currency=MATIC&per-page=100&page=1"
          "https://api.coingecko.com/api/v3/coins/matic-network?localization=false&community_data=false&developer_data=false&sparkline=false"
        );
        const json = await priceReq.json();
        const price = json?.market_data?.current_price?.inr;
        setConversionRate(price);
        localStorage.setItem(
          "rate",
          JSON.stringify({
            price,
            ttl: now.getTime() + 60 * 60 * 1000,
          })
        );
      } else {
        const jData = JSON.parse(convRate);
        setConversionRate(jData.price);
      }
      setLoading(false);
    })();
  }, []);
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p className="font-bold">{value} MATIC</p>
          <p className="font-bold italic">{(conversionRate * value).toFixed(2)} INR</p>
        </div>
      )}
    </div>
  );
}

export default CurrencyFormat;
