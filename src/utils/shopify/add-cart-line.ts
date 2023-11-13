export const addCartLine = async ({
  cartId,
  variantId,
  quantity
}: {
  cartId: string
  variantId: string
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
        mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
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
            merchandiseId: variantId,
            quantity
          }
        ]
      }
    })
  })
  const {
    data: {
      cartLinesAdd: {cart}
    }
  } = await res.json()
  return {cart}
}
