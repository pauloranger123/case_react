
import { api } from './api'

export type CouponValidation = {
  code: string
  discountPercent: number
  discountAmount: number
}

export async function validateCoupon(
  code: string,
  subtotal: number,
): Promise<CouponValidation> {
  const response = await api.post<CouponValidation>(
    '/coupons/validate',
    { code, subtotal },
  )

  return response.data
}
