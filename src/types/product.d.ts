type Product = {
  title: string
  handle: string
  displayName: string
  displayVariant: string
  displaySKU: string
  accentColor: string
  sustainability: string
  options: {
    id: string
    name: string
    values: string[]
  }[]
  variants: Variant[]
  descriptionHtml: string
  featuredImage: {
    url: string
    width: number
    height: number
    altText: string
  }
  priceRange: {minVariantPrice: Price}
}
