import React from "react";
import { Loading, Card, Icon, Tag } from "element-react";
import { Connect } from "aws-amplify-react";
import { graphqlOperation } from "aws-amplify";
// import { listMarkets } from "../graphql/queries";
import { onCreateMarket } from "../graphql/subscriptions";
import Error from "./Error";

import { Link } from "react-router-dom";

const listMarkets = `query ListMarkets(
    $filter: ModelMarketFilterInput
    $limit: Int
    $nextToken: String,
  ) {
    listMarkets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        products {
          items {
            id
            description
            shipped
            pickUpAddress
            pickUpTime
            productOrdered
            lat
            lng
            owner
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
      nextToken
    }
  }
`;

function MarketList({ searchResults }) {
  function onNewMarket(preQuery, newData) {
    let updatedQuery = { ...preQuery };
    const updatedMarketList = [
      newData.onCreateMarket,
      ...preQuery.listMarkets.items
    ];
    updatedQuery.listMarkets.items = updatedMarketList;
    return updatedQuery;
  }
  return (
    <Connect
      query={graphqlOperation(listMarkets)}
      subscription={graphqlOperation(onCreateMarket)}
      onSubscriptionMsg={onNewMarket}
    >
      {({ data, loading, errors }) => {
        // console.log("market list page", data);
        if (errors.length > 0) return <Error errors={errors} />;
        if (loading || !data.listMarkets) return <Loading fullscreen={true} />;
        const markets =
          searchResults.length > 0 ? searchResults : data.listMarkets.items;

        console.log("list markets items", data.listMarkets.items);

        return (
          <>
            {searchResults.length > 0 ? (
              <h2 className="text-green">
                <Icon type="succes" name="check" className="icon" />
                {searchResults.length}
              </h2>
            ) : (
              <h2 className="header">
                <img
                  src="https://img.icons8.com/color/30/000000/shopping-mall.png"
                  color="527FFF"
                  alt=""
                  className="large-icon"
                />
                Markets
              </h2>
            )}
            {markets.map(market => (
              <div className=" my-2" key={market.id}>
                <Card
                  bodyStyle={{
                    padding: "0.7em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <span className="flex">
                      <Link className="link" to={`/markets/${market.id}`}>
                        {market.name}
                      </Link>
                      <span style={{ color: "var(--darkAmazonOrange)" }}>
                        {market.products.items
                          ? market.products.items.length
                          : 0}
                        {/* {0} */}
                      </span>
                      <img
                        src="https://img.icons8.com/nolan/30/shopping-cart-promotion.png"
                        alt=""
                      />
                    </span>
                    <div style={{ color: "var(--lightSquidInk)" }}>
                      {market.owner}
                    </div>
                  </div>
                  <div>
                    {market.tags &&
                      market.tags.map(tag => (
                        <Tag key={tag} type="danger" className="mx-1">
                          {tag}
                        </Tag>
                      ))}
                  </div>
                </Card>
              </div>
            ))}
          </>
        );
      }}
    </Connect>
  );
}

export default MarketList;
