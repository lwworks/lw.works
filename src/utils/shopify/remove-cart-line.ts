export const removeCartLine = async ({cartId, lineId}: {cartId: string; lineId: string}): Promise<{cart: {id: string; totalQuantity: number}}> => {
  const res = await fetch('https://lukaswiesehan.myshopify.com/api/2022-10/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
    },
    body: JSON.stringify({
      query: `
        mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
          cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
            cart {
              id
              totalQuantity
            }
          }
        }
      `,
      variables: {
        cartId,
        lineIds: [lineId]
      }
    })
  })
  const {
    data: {
      cartLinesRemove: {cart}
    }
  } = await res.json()
  return {cart}
}
