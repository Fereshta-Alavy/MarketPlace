import React, { useState } from "react";
import NewMarket from "../components/NewMarket";
import MarketList from "../components/MarketList";

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  function handleSearchChange(searchTerm) {
    setSearchTerm(searchTerm);
  }

  function handleClearSearch() {
    setSearchTerm("");
    setSearchResult([]);
  }

  function handleSearch(event) {
    event.preventDefault();
    console.log(searchTerm);
  }
  return (
    <>
      <NewMarket
        searchTerm={searchTerm}
        isSearching={isSearching}
        handleSearchChange={handleSearchChange}
        handleClearSearch={handleClearSearch}
        handleSearch={handleSearch}
      />
      <MarketList />
    </>
  );
}

export default HomePage;
