import React, { useState, useEffect } from "react";
import { Loading, Tabs, Icon } from "element-react";
import { API, graphqlOperation, Auth } from "aws-amplify";
// import { getMarket } from "../graphql/queries";
import {
  onCreateProduct,
  onDeleteProduct,
  onUpdateProduct
} from "../graphql/subscriptions";
import { Link } from "react-router-dom";
import NewProduct from "../components/NewProduct";
import Product from "../components/Product";

import { formatProductDate } from "../utils";

const getMarket = `query GetMarket($id: ID!) {
    getMarket(id: $id) {
      id
      name
      products (sortDirection: DESC, limit : 999 ){
        items { 
          id
          description
          price
          shipped
          pickUpAddress
          pickUpTime
          productOrdered
          lat
          lng
          owner
          createdAt
          updatedAt
          file {
            key
          }
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

function MarketPage({ marketId, user, userAttributes }) {
  const [market, setMarket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarketOwner, setIsMarketOwner] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  let createProductListener = null;
  let updateProductListener = null;
  let deleteProductListener = null;

  useEffect(() => {
    handleGetMarket();
  }, []);

  useEffect(() => {
    if (market !== null) {
      getUser().then(async user => {
        createProductListener = await API.graphql(
          graphqlOperation(onCreateProduct, { owner: user.username })
        ).subscribe({
          next: productData => {
            // const newProduct = productData.value.data.onCreateProduct;
            const createdProduct = productData.value.data.onCreateProduct;
            const prevProducts = market.products.items.filter(
              item => item.id !== createdProduct.id
            );

            const updatedProduct = [createdProduct, ...prevProducts];
            const newMarket = { ...market };
            newMarket.products.items = updatedProduct;
            setMarket(newMarket);
          }
        });
      });

      getUser().then(async user => {
        updateProductListener = await API.graphql(
          graphqlOperation(onUpdateProduct, { owner: user.username })
        ).subscribe({
          next: productData => {
            const updateProduct = productData.value.data.onUpdateProduct;
            const index = market.products.items.findIndex(
              item => item.id === updateProduct.id
            );
            const updatedProduct = [
              ...market.products.items.slice(0, index),
              updateProduct,
              ...market.products.items.slice(index + 1)
            ];
            const newMarket = market;
            newMarket.products.items = updatedProduct;
            setMarket(newMarket);
          }
        });
      });

      getUser().then(async user => {
        deleteProductListener = await API.graphql(
          graphqlOperation(onDeleteProduct, { owner: user.username })
        ).subscribe({
          next: productData => {
            const deletedProduct = productData.value.data.onDeleteProduct;
            const updatedProduct = market.products.items.filter(
              item => item.id !== deletedProduct.id
            );

            const newMarket = market;
            newMarket.products.items = updatedProduct;
            setMarket(newMarket);
          }
        });
      });
    }
  }, [market]);

  useEffect(() => {
    if (user && market) {
      if (user.attributes.email === market.owner) {
        setIsMarketOwner(true);
      }

      checkEmailVerified();
    }
  }, [market]);

  const getUser = async () => {
    const user = await Auth.currentUserInfo();
    return user;
  };

  async function handleGetMarket() {
    const input = {
      id: marketId
    };
    const result = await API.graphql(graphqlOperation(getMarket, input));
    setMarket(result.data.getMarket);
    console.log("in the market page", result.data.getMarket);
    setIsLoading(false);
  }

  async function checkEmailVerified() {
    if (userAttributes) {
      setIsEmailVerified(userAttributes.email_verified);
    }
  }

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
          {formatProductDate(market.createdAt)}
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
            {isEmailVerified ? (
              <NewProduct user={user} marketId={marketId} />
            ) : (
              <Link to="/profile" className="header">
                Verify Your Email Before Adding Product{" "}
              </Link>
            )}
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
            {market.products.items.map(product =>
              product.productOrdered &&
              user && user.attributes.sub !== product.owner ? null : (
                <Product key={product.id} product={product} />
              )
            )}
          </div>
        </Tabs.Pane>
      </Tabs>
    </>
  );
}
export default MarketPage;
