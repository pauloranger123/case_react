import { api } from './api'

export type CheckoutValidationItem = {
  id: number
  quantity: number
  price: string
}

export type CheckoutValidationResponse = {
  valid: boolean
  items: Array<{
    id: number
    name: string
    price: number
    available: number
    quantity: number
  }>
  subtotal: number
  discount: number
  total: number
}

export async function validateCheckout(
  items: CheckoutValidationItem[],
  couponCode?: string,
): Promise<CheckoutValidationResponse> {
  const response = await api.post<CheckoutValidationResponse>(
    '/checkout/validate',
    { items, couponCode },
  )

  return response.data
}


export type CreateOrderRequest = {
  items: CheckoutValidationItem[]
  couponCode?: string
  name: string
  email: string
  walletName: string
  walletAddress: string
  walletNetwork: string
  idempotencyKey: string
}

export type CreatedOrder = {
  number: string
  status: 'confirmed'
  name: string
  email: string
  walletName: string
  walletAddress: string
  walletNetwork: string
  items: Array<{
    id: number
    name: string
    price: number
    available: number
    quantity: number
  }>
  subtotal: number
  discount: number
  total: number
  createdAt: string
}

export async function createOrder(
  order: CreateOrderRequest,
): Promise<CreatedOrder> {
  const response = await api.post<CreatedOrder>(
    '/checkout/orders',
    order,
    {
      headers: {
        'Idempotency-Key': order.idempotencyKey,
      },
    },
  )

  return response.data
}

