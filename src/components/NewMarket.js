import React, { useState } from "react";
// prettier-ignore
import {API, graphqlOperation} from 'aws-amplify'
import { createMarket } from "../graphql/mutations";
import {
  Form,
  Button,
  Dialog,
  Input,
  Select,
  Notification
} from "element-react";

import { UserContext } from "../App";

function NewMarket({
  searchTerm,
  isSearching,
  handleSearchChange,
  handleClearSearch,
  handleSearch
}) {
  const [addMarketDialog, setAddMarketDialog] = useState(false);
  const [name, setName] = useState("");
  const [tags, setTags] = useState([
    "Arts",
    "Technology",
    "Crafts",
    "Entertainment"
  ]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [options, setOptions] = useState([]);

  // function handleInput(event) {
  //   setName(event.target.value);
  // }
  async function handleAddMarket(user) {
    console.log("user is", user.attributes.email);
    try {
      setAddMarketDialog(false);
      const input = {
        name: name,
        owner: user.username,
        tags: selectedTags
      };
      const result = await API.graphql(
        graphqlOperation(createMarket, { input })
      );
      console.log(result);
      console.info(`created market : id ${result.data.createMarket.id}`);
      setName("");
      setSelectedTags([]);
    } catch (err) {
      console.error("Error adding new market", err);
      Notification.error({
        title: "Error",
        message: `${err.message || "Error Adding market"}`
      });
    }
  }

  function handleFilterTags(query) {
    const options = tags
      .map(tag => ({ value: tag, label: tag }))
      .filter(tag => tag.label.toLowerCase().includes(query.toLowerCase()));
    setOptions(options);
  }

  return (
    <UserContext.Consumer>
      {({ user }) => (
        <>
          <div className="market-header">
            <h1 className="market-title">
              Create your market place
              <Button
                type="text"
                icon="edit"
                className="market-title-button"
                onClick={() => setAddMarketDialog(true)}
              />
            </h1>

            <Form inline={true} onSubmit={handleSearch}>
              <Form.Item>
                <Input
                  placeholder="Search Market..."
                  icon="circle-cross"
                  onIconClick={handleClearSearch}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="info"
                  icon="search"
                  onClick={handleSearch}
                  loading={isSearching}
                >
                  Search
                </Button>
              </Form.Item>
            </Form>
          </div>
          <Dialog
            title="Create new market"
            visible={addMarketDialog}
            onCancel={() => setAddMarketDialog(false)}
            size="large"
            customClass="dialog"
          >
            <Dialog.Body>
              <Form labelPosition="top">
                <Form.Item label="Add Market Name">
                  <Input
                    placeholder="Market Name"
                    trim={true}
                    onChange={name => setName(name)}
                    value={name}
                  />
                </Form.Item>
                <Form.Item label="Add Tags">
                  <Select
                    multiple={true}
                    filterable={true}
                    placeholder="Market Tags"
                    onChange={selectedTags => setSelectedTags(selectedTags)}
                    remoteMethod={handleFilterTags}
                    remote={true}
                  >
                    {options.map(option => (
                      <Select.Option
                        key={option.value}
                        label={option.label}
                        value={option.value}
                      />
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            </Dialog.Body>

            <Dialog.Footer>
              <Button onClick={() => setAddMarketDialog(false)}>Cancel</Button>
              <Button
                type="primary"
                disabled={!name}
                onClick={() => handleAddMarket(user)}
              >
                Add
              </Button>
            </Dialog.Footer>
          </Dialog>
        </>
      )}
    </UserContext.Consumer>
  );
}

export default NewMarket;
