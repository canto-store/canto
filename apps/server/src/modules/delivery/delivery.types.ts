export type delivericDataInput = {
  sector_id: number
  phone_1: string
  price: number
  address: string
  client_name: string
  order_id?: number
  product_name?: string
  product_desc?: string
  client_id: number
  quantity?: number
}

export type DelivericDataOutput = {
  waybill: string
  id: number
  qr_code: string
  order_id: number
  status: string
}
