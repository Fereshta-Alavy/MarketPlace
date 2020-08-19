import React, { useState } from "react";
import { PhotoPicker } from "aws-amplify-react";
import { Auth, Storage, API, graphqlOperation } from "aws-amplify";
import { createProduct } from "../graphql/mutations";
import { convertDollarToCents } from "../utils";
// prettier-ignore
import { Form, Button, Input, Notification, Radio, Progress } from "element-react";
import aws_exports from "../aws-exports";

function NewProduct({ marketId, user }) {
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [shipped, setShipped] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [ImagePreview, setImagePreview] = useState("");
  const [image, setImage] = useState("");
  const [percentUpload, setPercentUploaded] = useState(0);

  async function handleAddProduct() {
    try {
      setIsUploading(true);
      const visibility = "public";
      const { identityId } = await Auth.currentCredentials();
      const filename = `${identityId}/${Date.now()}-${image.name}`;
      const uploadedFile = await Storage.put(filename, image.file, {
        contentType: image.type,
        progressCallback: progress => {
          const percentUpload = Math.round(
            (progress.loaded / progress.total) * 100
          );
          setPercentUploaded(percentUpload);
        }
      });

      const file = {
        key: uploadedFile.key,
        bucket: aws_exports.aws_user_files_s3_bucket,
        region: aws_exports.aws_project_region
      };

      const input = {
        productMarketId: marketId,
        owner: user.attributes.sub,
        description: description,
        shipped: shipped,
        price: convertDollarToCents(price),
        file
      };

      const result = await API.graphql(
        graphqlOperation(createProduct, { input })
      );
      console.log("created product", result);
      Notification({
        title: "success",
        message: "Product successfully created",
        type: "success"
      });

      setDescription("");
      setPrice("");
      setShipped(false);
      setImagePreview("");
      setImage("");
      setIsUploading(false);
      setPercentUploaded(0);
    } catch (err) {
      console.error("error adding product", err);
    }
  }
  return (
    <div className="flex-center">
      <h2 className="header">Add New Product</h2>
      <div>
        <Form className="market-header">
          <Form.Item label="Add Product Description">
            <Input
              type="text"
              icon="information"
              placeholder="description"
              value={description}
              onChange={description => setDescription(description)}
            />
          </Form.Item>

          <Form.Item label="Set Product Price">
            <Input
              type="number"
              icon="plus"
              placeholder="price"
              value={price}
              onChange={price => setPrice(price)}
            />
          </Form.Item>

          <Form.Item label="Is the Product shipped or emailed to the customer?">
            <div className="text-center">
              <Radio
                value="true"
                checked={shipped === true}
                onChange={() => setShipped(true)}
              >
                Shippeed
              </Radio>
              <Radio
                value="false"
                checked={shipped === false}
                onChange={() => setShipped(false)}
              >
                Emailed
              </Radio>
            </div>
          </Form.Item>
          {ImagePreview && (
            <img className="image-preview" src={ImagePreview} alt=""></img>
          )}

          {percentUpload > 0 && (
            <Progress
              type="circle"
              className="progress"
              percentage={percentUpload}
            />
          )}
          <PhotoPicker
            title="product image"
            preview="hidden"
            onLoad={url => setImagePreview(url)}
            onPick={file => setImage(file)}
            theme={{
              formContainer: {
                margin: 0,
                padding: "0.8em"
              },
              formSection: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              },
              sectionHeader: {
                padding: "0.2em",
                color: "var(--darkAmazonOrange)"
              },
              sectionBody: {
                margin: 0,
                width: "250px"
              }
              // photoPickerButton: {
              //   display: "none"
              // }
            }}
          />
          <Form.Item>
            <Button
              disabled={!description || !price || !image || isUploading}
              type="primary"
              onClick={handleAddProduct}
              loading={isUploading}
            >
              {isUploading ? "...Uploading" : "Add Product"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default NewProduct;
