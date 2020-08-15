import React, { useState, useEffect } from "react";
import { Loading, Tabs, Icon } from "element-react";
import { API, graphqlOperation } from "aws-amplify";

import { Link } from "react-router-dom";
import NewProduct from "../components/NewProduct";
import Product from "../components/Product";

const getMarket = `query GetMarket($id: ID!) {
    getMarket(id: $id) {
      id
      name
      products {
        items {
          id
          description
          price
          shipped
          owner
          file {
            key
          }
          createdAt
          updatedAt
        }
        nextToken
      }
      tags
      owner
      createdAt
      updatedAt
    }
  }
`;

function MarketPage({ marketId, user }) {
  const [market, setMarket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarketOwner, setIsMarketOwner] = useState(false);
  // state = {}
  useEffect(() => {
    handleGetMarket();
  }, []);

  useEffect(() => {
    if (user && market) {
      if (user.username === market.owner) {
        setIsMarketOwner(true);
      }
    }
  }, [market]);

  async function handleGetMarket() {
    const input = {
      id: marketId
    };
    const result = await API.graphql(graphqlOperation(getMarket, input));
    console.log(result);
    setMarket(result.data.getMarket);
    setIsLoading(false);
  }

  // function checkMarketOwner() {
  //   if (user) {
  //     if (user.username === market.owner) {
  //       setIsMarketOwner(true);
  //     }
  //   }
  // }
  return isLoading ? (
    <Loading fullscreen={true} />
  ) : (
    <>
      <Link className="link" to="/">
        Back To Markets List
      </Link>
      <span className="items-center pt-2">
        <h2 className="mb-mr">{market.name}</h2> - {market.owner}
      </span>
      <div className="items-center pt-2">
        <span style={{ color: "var(--lightSquidInk)", paddingBottom: "1em" }}>
          <Icon className="icon" name="date" />
          {market.createdAt}
        </span>
      </div>

      <Tabs type="border-card" value={isMarketOwner ? "1" : "2"}>
        {isMarketOwner && (
          <Tabs.Pane
            label={
              <>
                <Icon name="plus" className="icon" />
                Add Product
              </>
            }
            name="1"
          >
            <NewProduct marketId={marketId} />
          </Tabs.Pane>
        )}
        {/* product list */}
        <Tabs.Pane
          label={
            <>
              <Icon name="menu" className="icon" />
              Products ({market.products.items.length})
            </>
          }
          name="2"
        >
          <div className="product-list">
            {market.products.items.map(product => (
              <Product key={product.id} product={product} />
            ))}
          </div>
        </Tabs.Pane>
      </Tabs>
    </>
  );
}
export default MarketPage;
