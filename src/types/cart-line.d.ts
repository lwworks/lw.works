type CartLine = {
  id: string
  attributes: {
    key: string
    value: string
  }[]
  merchandise: {
    title: string
    sku: string
    product: {
      title: string
      handle: string
      featuredImage: {
        url: string
        width: number
        height: number
        altText: string
      }
      displayName: {value: string}
      displaySKU: {value: string}
      displayVariant: {value: string}
      accentColor: {value: string}
    }
    selectedOptions: {
      name: string
      value: string
    }[]
  }
  cost: {
    amountPerQuantity: Price
    compareAtAmountPerQuantity: Price | null
    subtotalAmount: Price
    totalAmount: Price
  }
  quantity: number
}
