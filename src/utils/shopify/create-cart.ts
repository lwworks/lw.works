export const createCart = async ({variantId, quantity}: {variantId: string; quantity: number}): Promise<{cart: {id: string; totalQuantity: number}}> => {
  const res = await fetch('https://lukaswiesehan.myshopify.com/api/2023-10/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
    },
    body: JSON.stringify({
      query: `
        mutation cartCreate($input: CartInput!) {
          cartCreate(input: $input) {
            cart {
              id
              totalQuantity
            }
          }
        }
      `,
      variables: {
        input: {
          lines: [
            {
              merchandiseId: variantId,
              quantity
            }
          ]
        }
      }
    })
  })
  const {
    data: {
      cartCreate: {
        cart: {id}
      }
    }
  } = await res.json()
  return {cart: {id, totalQuantity: quantity}}
}
