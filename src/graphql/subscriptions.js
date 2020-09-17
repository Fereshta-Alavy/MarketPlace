/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMarket = /* GraphQL */ `
  subscription OnCreateMarket {
    onCreateMarket {
      id
      name
      products {
        items {
          id
          description
          price
          shipped
          pickUpAddress
          lat
          lng
          owner
          pickUpTime
          createdAt
          productPickedUp
          productOrdered
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
export const onUpdateMarket = /* GraphQL */ `
  subscription OnUpdateMarket {
    onUpdateMarket {
      id
      name
      products {
        items {
          id
          description
          price
          shipped
          pickUpAddress
          lat
          lng
          owner
          pickUpTime
          createdAt
          productPickedUp
          productOrdered
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
export const onDeleteMarket = /* GraphQL */ `
  subscription OnDeleteMarket {
    onDeleteMarket {
      id
      name
      products {
        items {
          id
          description
          price
          shipped
          pickUpAddress
          lat
          lng
          owner
          pickUpTime
          createdAt
          productPickedUp
          productOrdered
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
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct {
    onCreateProduct {
      id
      description
      market {
        id
        name
        products {
          nextToken
        }
        tags
        owner
        createdAt
        updatedAt
      }
      file {
        bucket
        region
        key
      }
      price
      shipped
      pickUpAddress
      lat
      lng
      owner
      pickUpTime
      createdAt
      productPickedUp
      productOrdered
      updatedAt
    }
  }
`;
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct {
    onUpdateProduct {
      id
      description
      market {
        id
        name
        products {
          nextToken
        }
        tags
        owner
        createdAt
        updatedAt
      }
      file {
        bucket
        region
        key
      }
      price
      shipped
      pickUpAddress
      lat
      lng
      owner
      pickUpTime
      createdAt
      productPickedUp
      productOrdered
      updatedAt
    }
  }
`;
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct {
    onDeleteProduct {
      id
      description
      market {
        id
        name
        products {
          nextToken
        }
        tags
        owner
        createdAt
        updatedAt
      }
      file {
        bucket
        region
        key
      }
      price
      shipped
      pickUpAddress
      lat
      lng
      owner
      pickUpTime
      createdAt
      productPickedUp
      productOrdered
      updatedAt
    }
  }
`;
