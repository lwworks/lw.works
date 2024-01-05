export const getProduct = async ({handle, lang}: {lang: 'de' | 'en'; handle: string}): Promise<{product?: Product; error?: string}> => {
  const language = {de: 'DE', en: 'EN'}
  const res = await fetch('https://lukaswiesehan.myshopify.com/api/2023-10/graphql.json', {
    next: { revalidate: 60 }
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
    },
    body: JSON.stringify({
      query: `query Product @inContext(language: ${language[lang]}) {
        productByHandle(handle:"${handle}") {
          id
          title
          handle
          descriptionHtml
          priceRange {
            minVariantPrice {
              amount 
              currencyCode
            }
          }
          options(first:100) {
            id
            name
            values
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
          shipping: metafield(namespace: "custom", key: "shipping") {
            value
          }
          sizing: metafield(namespace: "custom", key: "sizing") {
            value
          }
          sustainability: metafield(namespace: "custom", key: "sustainability") {
            value
          }
          transparency: metafield(namespace: "custom", key: "transparency") {
            value
          }
          accentColor: metafield(namespace: "custom", key: "accent_color") {
            value
          }
          variants(first:100) {
            edges {
              node {
                id
                selectedOptions {
                  name
                  value
                }
                price {
                  amount
                  currencyCode
                }
                availableForSale
                currentlyNotInStock
              }
            }
          }
          featuredImage {
            url
            width
            height
            altText
          }
        }
      }`
    })
  })

  const {
    data: {productByHandle}
  } = await res.json()

  if (!productByHandle) return {error: 'Product not found'}

  return {
    product: {
      ...productByHandle,
      displayName: productByHandle.displayName.value,
      displaySKU: productByHandle.displaySKU.value,
      displayVariant: productByHandle.displayVariant.value,
      accentColor: productByHandle.accentColor.value,
      shipping: productByHandle.shipping?.value,
      sustainability: productByHandle.sustainability?.value,
      transparency: productByHandle.transparency?.value,
      sizing: productByHandle.sizing?.value,
      variants: productByHandle.variants.edges.map((edge: any) => edge.node)
    }
  }
}
