import React from "react";
import { Notification, Message } from "element-react";
import { API } from "aws-amplify";
import StripeCheckout from "react-stripe-checkout";

const stripeConfig = {
  currency: "USD",
  publishableAPIKey:
    "pk_test_51HEiNVIKOoBJNWU6GhmZZtHqaksAbifnsc3aBsjQwXqR5zWs6QIv9AjOKYySbogjWTIecN8rCobYlsUMcJl2J5mb00BDCutme1"
};

const PayButton = ({ product, user }) => {
  async function handleCharge(token) {
    try {
      const result = await API.post("shoplambda", "/charge", {
        body: { token }
      });
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <StripeCheckout
      token={handleCharge}
      email={user.attributes.email}
      name={product.description}
      amount={product.price}
      currency={stripeConfig.currency}
      stripeKey={stripeConfig.publishableAPIKey}
      shippingAddress={product.shipped}
      billingAddress={product.shipped}
      locale="auto"
      allowRememberMe={false}
    />
  );
};

export default PayButton;
