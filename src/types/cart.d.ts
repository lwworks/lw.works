type Cart = {
  id: string
  note: string | null
  lines: {
    edges: {
      node: CartLine
    }[]
  }
  totalQuantity: number
  checkoutUrl: string
  cost: {
    totalDutyAmount: Price
    totalTaxAmount: Price | null
    subtotalAmount: Price
    totalAmount: Price
  }
}
