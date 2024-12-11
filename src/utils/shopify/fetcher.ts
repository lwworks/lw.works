export const fetcher = async (query: string) => {
  const res = await fetch('https://lukaswiesehan.myshopify.com/api/2023-10/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
    },
    body: JSON.stringify({query})
  })
  return res.json()
}
