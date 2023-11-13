export const cartQuery = (cartID: string | null) => `{
  cart(id:"${cartID}"){
    id
    note
    lines(first: 100) {
      edges {
        node {
          id
          attributes {
            key
            value
          }
          merchandise {
            ... on ProductVariant {
              title
              sku
              product {
                title
                handle
                featuredImage {
                  url
                  width
                  height
                  altText
                }
                displayName: metafield(namespace: "custom", key: "display_name") {
                  value
                }
                displayVariant: metafield(namespace: "custom", key: "display_variant") {
                  value
                }
                displaySKU: metafield(namespace: "custom", key: "display_sku") {
                  value
                }
                accentColor: metafield(namespace: "custom", key: "accent_color") {
                  value
                }
              }
              selectedOptions {
                name
                value
              }
            }
          }
          quantity
          cost {
            amountPerQuantity {
              amount
              currencyCode
            }
            compareAtAmountPerQuantity {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
    totalQuantity
    checkoutUrl
    cost {
      totalDutyAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
  }
}`
