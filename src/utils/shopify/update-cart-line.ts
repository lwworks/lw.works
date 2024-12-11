export const updateCartLine = async ({
  cartId,
  lineId,
  quantity
}: {
  cartId: string
  lineId: string
  quantity: number
}): Promise<{cart: {id: string; totalQuantity: number}}> => {
  const res = await fetch('https://lukaswiesehan.myshopify.com/api/2022-10/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
    },
    body: JSON.stringify({
      query: `
        mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
          cartLinesUpdate(cartId: $cartId, lines: $lines) {
            cart {
              id
              totalQuantity
            }
          }
        }
      `,
      variables: {
        cartId,
        lines: [
          {
            id: lineId,
            quantity
          }
        ]
      }
    })
  })
  const {
    data: {cartLinesUpdate: cart}
  } = await res.json()
  return cart
}
