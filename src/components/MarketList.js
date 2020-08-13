import React from "react";
import { Loading, Card, Icon, Tag } from "element-react";
import { Connect } from "aws-amplify-react";
import { graphqlOperation } from "aws-amplify";
import { listMarkets } from "../graphql/queries";
import { onCreateMarket } from "../graphql/subscriptions";
import Error from "./Error";

import { Link } from "react-router-dom";

const MarketList = () => {
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
        if (errors.length > 0) return <Error errors={errors} />;
        if (loading || !data.listMarkets) return <Loading fullscreen={true} />;

        return (
          <>
            <h2 className="header">
              <img
                src="https://img.icons8.com/color/30/000000/shopping-mall.png"
                color="527FFF"
                alt=""
                className="large-icon"
              />
              Markets
            </h2>
            {data.listMarkets.items.map(market => (
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
                        {0}
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
};

export default MarketList;
