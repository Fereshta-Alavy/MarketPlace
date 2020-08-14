import React, { useState } from "react";
import NewMarket from "../components/NewMarket";
import MarketList from "../components/MarketList";
import { API, graphqlOperation } from "aws-amplify";
import { searchMarkets } from "../graphql/queries";

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  function handleSearchChange(searchTerm) {
    setSearchTerm(searchTerm);
  }

  function handleClearSearch() {
    setSearchTerm("");
    setSearchResults([]);
  }

  async function handleSearch(event) {
    try {
      event.preventDefault();
      setIsSearching(true);
      const result = await API.graphql(
        graphqlOperation(searchMarkets, {
          filter: {
            or: [
              { name: { match: searchTerm } },
              { owner: { match: searchTerm } },
              { tags: { match: searchTerm } }
            ]
          }
        })
      );
      console.log(result);
      setSearchResults(result.data.searchMarkets.items);
      setIsSearching(false);
    } catch (err) {
      console.error(err);
    }
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
      <MarketList searchResults={searchResults} />
    </>
  );
}

export default HomePage;
