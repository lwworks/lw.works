export const updateCartNote = async ({cartId, note}: {cartId: string; note: string}): Promise<{cart: {id: string; totalQuantity: number}}> => {
  const res = await fetch('https://lukaswiesehan.myshopify.com/api/2022-10/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
    },
    body: JSON.stringify({
      query: `
        mutation cartNoteUpdate($cartId: ID!, $note: String!) {
          cartNoteUpdate(cartId: $cartId, note: $note) {
            cart {
              id
              totalQuantity
            }
          }
        }
      `,
      variables: {
        cartId,
        note
      }
    })
  })
  const {
    data: {cartNoteUpdate: cart}
  } = await res.json()
  return cart
}
