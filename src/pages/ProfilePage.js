import React, { useEffect, useState } from "react";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { converCentsToDollars, formatOrderDate } from "../utils";
import CardSection from "../components/CardSection";
// prettier-ignore
import { Table, Button, Notification, MessageBox, Message, Tabs, Icon, Form, Dialog, Input, Card, Tag } from 'element-react'

const getUser = `query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      email
      registered
      customerId
      paymentCardId
      orders (sortDirection : DESC , limit : 999 ){
        items {
          id
          createdAt
          updatedAt
          product {
            id
            owner
            createdAt
            description
          }
        
        }
        nextToken
      }
    }
  }
`;

function ProfilePage({ user, userAttributes }) {
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState(userAttributes && userAttributes.email);
  const [verificationForm, setVerificationForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [emailDialog, setEmailDialog] = useState(false);
  const [PaymentDialog, setPaymentDialog] = useState(false);
  const [PaymentCardId, setPaymentCardId] = useState("");
  console.log("inside profile page", orders);
  const columns = [
    { prop: "name", width: "150px" },
    { prop: "value", width: "330px" },
    {
      prop: "tag",
      width: "150px",
      render: row => {
        if (row.name === "Email") {
          const emailVerified = userAttributes.email_verified;
          return emailVerified ? (
            <Tag type="success">verified</Tag>
          ) : (
            <Tag type="danger">Unverified</Tag>
          );
        }
        if (row.name === "Payment") {
          return PaymentCardId ? (
            <Tag type="success">verified</Tag>
          ) : (
            <Tag type="danger">Unverified</Tag>
          );
        }
      }
    },
    {
      prop: "operations",
      render: row => {
        switch (row.name) {
          case "Email":
            return (
              <Button
                onClick={() => setEmailDialog(true)}
                type="info"
                size="small"
              >
                Edit
              </Button>
            );

          case "Payment":
            return (
              <Button
                onClick={() => setPaymentDialog(true)}
                disabled={PaymentCardId}
                type="info"
                size="small"
              >
                Add Card
              </Button>
            );

          case "Delete Profile":
            return (
              <Button onClick={handleDeleteProfile} type="danger" size="small">
                Delete
              </Button>
            );

          default:
            return;
        }
      }
    }
  ];

  useEffect(() => {
    if (userAttributes) {
      getUserOrders(userAttributes.sub);
      getUserPaymentId(userAttributes.sub);
    }
  }, []);

  // useEffect(() => {
  //   console.log("payment card id", PaymentCardId);
  // }, [PaymentCardId]);

  async function getUserOrders(userId) {
    const input = { id: userId };
    const result = await API.graphql(graphqlOperation(getUser, input));
    setOrders(result.data.getUser.orders.items);
  }

  async function getUserPaymentId(userId) {
    const input = { id: userId };
    const result = await API.graphql(graphqlOperation(getUser, input));
    setPaymentCardId(result.data.getUser.paymentCardId);
  }

  async function handleUpdateEmail() {
    try {
      const updatedAttributes = {
        email: email
      };

      const result = await Auth.updateUserAttributes(user, updatedAttributes);
      console.log("result in profile page", result);

      if (result === "SUCCESS") {
        sendVerificationCode("email");
      }
    } catch (err) {
      console.error(err);
      Notification.error({
        title: "Error",
        message: `${err.message || "Error updating attributes"}`
      });
    }
  }

  async function sendVerificationCode(attr) {
    await Auth.verifyCurrentUserAttribute(attr);
    setVerificationForm(true);
    Message({
      type: "info",
      customClass: "message",
      message: `Verification code sent to ${email}`
    });
  }

  async function handleVerifyEmail(attr) {
    try {
      const result = await Auth.verifyCurrentUserAttributeSubmit(
        attr,
        verificationCode
      );
      Notification({
        title: "Success",
        message: "Email successfully verified",
        type: `${result.toLocaleLowerCase()}`
      });
      setTimeout(() => window.location.reload(), 3000);
    } catch (err) {
      console.error(err);
      Notification.error({
        title: "Error",
        message: `${err.message || "Error updating email"}`
      });
    }
  }

  async function handleDeleteProfile() {
    MessageBox.confirm(
      "This will permanently delete your account. Continute? ",
      "Attention!",
      {
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        type: "warning"
      }
    )
      .then(async () => {
        try {
          await user.deleteUser();
        } catch (err) {
          console.error(err);
        }
      })
      .catch(() => {
        Message({
          type: "info",
          message: " Delete was canceled"
        });
      });
  }

  return (
    userAttributes && (
      <>
        <Tabs activeName="1" className="profile-tabs">
          <Tabs.Pane
            label={
              <>
                <Icon name="document" className="icon" />
                Summary
              </>
            }
            name="1"
          >
            <h2 className="header">Profile Summary</h2>
            <Table
              columns={columns}
              data={[
                {
                  name: "Your Id",
                  value: userAttributes.sub
                },
                {
                  name: "Username",
                  value: user.username
                },
                {
                  name: "Email",
                  value: userAttributes.email
                },
                {
                  name: "Payment",
                  value: PaymentCardId
                },
                {
                  name: "Phone Number",
                  value: userAttributes.phone_number
                },
                {
                  name: "Delete Profile",
                  value: "Sorry to see you go"
                }
              ]}
              showHeader={false}
              rowClassName={row =>
                row.name === "Delete Profile" && "delete-profile"
              }
            />
          </Tabs.Pane>

          <Tabs.Pane
            label={
              <>
                <Icon name="message" className="icon" />
                orders
              </>
            }
            name="2"
          >
            <h2 className="header">Order History</h2>
            {orders.map(order => (
              <div className="mb-1" key={order.id}>
                <Card>
                  <pre>
                    <p>Order id : {order.id}</p>
                    <p>Product description : {order.product.description}</p>
                    {/* <p>Price : ${converCentsToDollars(order.product.price)}</p> */}
                    <p>Purchased On : {formatOrderDate(order.createdAt)}</p>
                  </pre>
                </Card>
              </div>
            ))}
          </Tabs.Pane>
        </Tabs>

        {/* payment Dialog */}
        <Dialog
          size="large"
          customClass="dialog"
          title="Add Payment"
          visible={PaymentDialog}
          onCancel={() => setPaymentDialog(false)}
        >
          <Dialog.Body>
            <Form labelPosition="top">
              <Form.Item label="Payment">
                <CardSection
                  userAttributes={user}
                  setPaymentCardId={setPaymentCardId}
                  setPaymentDialog={setPaymentDialog}
                />
              </Form.Item>
            </Form>
          </Dialog.Body>
        </Dialog>

        {/* Email Dialog */}
        <Dialog
          size="large"
          customClass="dialog"
          title="Edit Email"
          visible={emailDialog}
          onCancel={() => setEmailDialog(false)}
        >
          <Dialog.Body>
            <Form labelPosition="top">
              <Form.Item label="Email">
                <Input value={email} onChange={email => setEmail(email)} />
              </Form.Item>
              {verificationForm && (
                <Form.Item label="Enter verication code" labelWidth="120">
                  <Input
                    onChange={verificationCode =>
                      setVerificationCode(verificationCode)
                    }
                    value={verificationCode}
                  ></Input>
                </Form.Item>
              )}
            </Form>
          </Dialog.Body>
          <Dialog.Footer>
            <Button onClick={() => setEmailDialog(false)}>Cancel</Button>
            {!verificationForm && (
              <Button type="primary" onClick={handleUpdateEmail}>
                Save
              </Button>
            )}
            {verificationForm && (
              <Button type="primary" onClick={() => handleVerifyEmail("email")}>
                Submit
              </Button>
            )}
          </Dialog.Footer>
        </Dialog>
      </>
    )
  );
}

export default ProfilePage;
