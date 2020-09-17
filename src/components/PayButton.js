import React from "react";
import { Notification, Message } from "element-react";
import { API, graphqlOperation } from "aws-amplify";
import { getUser } from "../graphql/queries";
import { createOrder, updateProduct } from "../graphql/mutations";

import StripeCheckout from "react-stripe-checkout";
import { history } from "../App";
import { type } from "os";

const stripeConfig = {
  currency: "USD",
  publishableAPIKey:
    "pk_test_51HEiNVIKOoBJNWU6GhmZZtHqaksAbifnsc3aBsjQwXqR5zWs6QIv9AjOKYySbogjWTIecN8rCobYlsUMcJl2J5mb00BDCutme1"
};

function PayButton({ product, userAttributes }) {
  async function getOwnerEmail(ownerId) {
    try {
      const input = { id: ownerId };
      const result = await API.graphql(graphqlOperation(getUser, input));
      return result.data.getUser.email;
    } catch (err) {}
  }
  // function createShippingAddress(source) {
  //   const data = {
  //     city: source.address_city,
  //     country: source.address_country,
  //     address_line1: source.address_line1,
  //     address_state: source.address_state,
  //     add_zip: source.add_zip
  //   };

  //   return data;
  // }

  async function handleCharge(token) {
    try {
      const ownerEmail = await getOwnerEmail(product.owner);
      console.log(ownerEmail);
      console.log(userAttributes.email);
      const result = await API.post("shoplambda", "/charge", {
        body: {
          // token,
          // charge: {
          //   currency: stripeConfig.currency,
          //   amount: product.price,
          //   description: product.description,
          //   pickUpAddress: product.pickUpAddress
          // },
          description: product.description,
          pickUpAddress: product.pickUpAddress,
          email: {
            customerEmail: userAttributes.email,
            ownerEmail
          }
        }
      });

      if (result.message === "Order processed successfully") {
        // let shippingAddress = null;
        console.log();
        // if (product.shipped) {
        //   shippingAddress = createShippingAddress(result.charge.source);
        // }
        let input = {
          id: product.id,
          productOrdered: true
        };
        const orderstatus = await API.graphql(
          graphqlOperation(updateProduct, { input })
        );
        input = {
          orderUserId: userAttributes.sub,
          orderProductId: product.id
        };
        const order = await API.graphql(
          graphqlOperation(createOrder, { input })
        );
        console.log({ order });
        Notification({
          title: "success",
          message: `${result.message}`,
          type: "success",
          duration: 3000
        });

        setTimeout(() => {
          history.push("/");
          Message({
            type: "info",
            message: "Check your verified email for order details",
            duration: 5000,
            showClose: true
          });
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      Notification.error({
        title: "Error",
        message: `${err.message || "Error processing order"}`
      });
    }
  }
  return (
    // <StripeCheckout
    //   token={handleCharge}
    //   email={userAttributes && userAttributes.email}
    //   name={product.description}
    //   amount={product.price}
    //   currency={stripeConfig.currency}
    //   stripeKey={stripeConfig.publishableAPIKey}
    //   // shippingAddress={product.shipped}
    //   // billingAddress={product.shipped}
    //   locale="auto"
    //   allowRememberMe={false}
    // />
    <div>
      <button onClick={handleCharge}>Order</button>
    </div>
  );
}

export default PayButton;
