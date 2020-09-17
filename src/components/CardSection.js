import React from "react";
import { API, graphqlOperation } from "aws-amplify";
import { updateUser } from "../graphql/mutations";
import { getUser } from "../graphql/queries";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

const CheckoutForm = ({ userAttributes, setPaymentCardId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async event => {
    event.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)
    });

    if (!error) {
      const { id } = paymentMethod;

      try {
        const customer = await API.post("saveCard", "/savecard", {
          body: {
            id
          }
        });

        const input = {
          id: userAttributes.username,
          paymentCardId: id,
          customerId: customer.customer.id
        };
        const result = await API.graphql(
          graphqlOperation(updateUser, { input })
        );
        console.log("incard section", result.data.updateUser.paymentCardId);
        setPaymentCardId(result.data.updateUser.paymentCardId);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Save
      </button>
    </form>
  );
};

// you should use env variables here to not commit this
// but it is a public key anyway, so not as sensitive
const stripePromise = loadStripe(
  "pk_test_51HEiNVIKOoBJNWU6GhmZZtHqaksAbifnsc3aBsjQwXqR5zWs6QIv9AjOKYySbogjWTIecN8rCobYlsUMcJl2J5mb00BDCutme1"
);

const CardSection = ({ userAttributes, setPaymentCardId }) => {
  const [status, setStatus] = React.useState("ready");

  if (status === "success") {
    return <div>Congrats on your empanadas!</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        userAttributes={userAttributes}
        setPaymentCardId={setPaymentCardId}
      />
    </Elements>
  );
};
export default CardSection;
