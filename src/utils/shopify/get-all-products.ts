export const getAllProducts = async ({lang}: {lang: 'de' | 'en'}): Promise<{products: ProductPreview[]}> => {
  const language = {de: 'DE', en: 'EN'}
  const res = await fetch('https://lukaswiesehan.myshopify.com/api/2023-10/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
    },
    body: JSON.stringify({
      query: `query AllProducts @inContext(language: ${language[lang]}) {
        products(first:10) {
          edges {
            node {
              title
              handle
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
              featuredImage {
                url
                width
                height
                altText
              }
            }
          }
        }
      }`
    })
  })
  const {
    data: {
      products: {edges}
    }
  } = await res.json()
  return {
    products: edges.map((e: {node: any}) => ({
      ...e.node,
      displayName: e.node.displayName.value,
      displayVariant: e.node.displayVariant.value,
      displaySKU: e.node.displaySKU.value,
      accentColor: e.node.accentColor.value
    }))
  }
}
