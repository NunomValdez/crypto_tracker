import { useEffect, useState } from "react";
import { CryptoCurrency } from "./types/types";

function App() {
  const [cryptoInfo, setCryptoInfo] = useState<CryptoCurrency[]>([]);
  const [search, setSearch] = useState<string>("");
  const [cryptoSelected, setCryptoSelected] = useState("");

  // Pagination:
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetching Items of component mount
  useEffect(() => {
    fetch(`http://api.coincap.io/v2/assets`, {})
      .then((response) => response.json())
      .then((data) => setCryptoInfo(data.data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleCryptoSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearch(inputValue.toLowerCase());
    setCurrentPage(1);
  };
  console.log(search, " search input");

  // Filter cryptoInfo based on search term during rendering
  // This ensures filtering logic is applied with the latest state
  const filteredCrypto = cryptoInfo.filter((crypto) =>
    crypto.name.toLowerCase().includes(search)
  );

  // Pagination applied to filtered results
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCrypto.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  console.log(currentItems, " items nesta pagina dps do filter", {
    indexOfFirstItem,
    indexOfLastItem,
  });

  const handleCryptoSelection = (cryptoId: string) => {
    setCryptoSelected(cryptoId);
  };
  const selectedCryptoToBeShown = filteredCrypto.filter(
    (crypto) => crypto.id === cryptoSelected
  );
  console.log(selectedCryptoToBeShown, " selected crypto");
  return (
    <section className="flex flex-col items-center bg-gray-100 h-[100vh] py-4 justify-between">
      {/* Fetched crypto */}
      <section className="flex flex-row  gap-4 text-sm flex-wrap justify-center">
        {currentItems.map((crypto) => (
          <div
            key={crypto.id}
            className="border border-black p-2 rounded-md bg-blue-950 text-white w-32"
            onClick={() => handleCryptoSelection(crypto.id)}
          >
            <h1 className="text-lg text-orange-200 text-center font-semibold ">
              {crypto.symbol}
            </h1>
            <p>{crypto.name}</p>
            <p>${parseFloat(crypto.priceUsd).toFixed(6)}</p>
            <p>{crypto.rank}</p>
          </div>
        ))}
      </section>
      {/* Search bar  */}
      <input
        type="text"
        name="crypto_search"
        id="crypto_search"
        onChange={handleCryptoSearch}
        placeholder="Search Cryptocurrency"
        className="bg-red-50 min-w-56 rounded-md border border-gray-300 m-4 focus:border-orange-300 "
      />
      {/* Selected Crypto */}
      <section>
        {cryptoSelected !== "" &&
          selectedCryptoToBeShown.map((crp) => (
            <div className="text-sm bg-orange-100 gap-2 min-w-60 text-wrap rounded-lg shadow-md shadow-blue-200 p-4 text-center">
              <p className="text-lg">{crp.name}</p>
              <p>{crp.symbol}</p>
              <p>{crp.rank}</p>
              <p>{crp.explorer}</p>
              <p>${parseFloat(crp.priceUsd).toFixed(6)}</p>
            </div>
          ))}
      </section>
      {/* Pagination section => do this in another component*/}
      <div className="flex justify-evenly w-full py-4">
        {currentItems.length > 9 &&
          [...Array(Math.ceil(cryptoInfo.length / itemsPerPage)).keys()].map(
            (number) => (
              <button
                key={number}
                onClick={() => paginate(number + 1)}
                className="p-2 bg-orange-200 rounded-full shadow-md shadow-orange-600"
              >
                {number + 1}
              </button>
            )
          )}
        {currentItems.length < 10 && (
          <button
            key={1}
            onClick={() => paginate(1)}
            className="p-2 bg-orange-200 rounded-full shadow-md shadow-orange-600"
          >
            1
          </button>
        )}
      </div>
    </section>
  );
}

export default App;
