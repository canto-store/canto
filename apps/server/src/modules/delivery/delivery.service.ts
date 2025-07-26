import axios from 'axios'

class DeliveryService {
  private readonly DELIVERIC_API
  private readonly DELIVERIC_USER
  private readonly DELIVERIC_PASSWORD
  constructor() {
    this.DELIVERIC_API = process.env.DELIVERIC_API
    this.DELIVERIC_USER = process.env.DELIVERIC_USER
    this.DELIVERIC_PASSWORD = process.env.DELIVERIC_PASSWORD
  }
  public async getAllSectors() {
    return axios
      .post(this.DELIVERIC_API + '?action=getAllSectors', {
        user: this.DELIVERIC_USER,
        password: this.DELIVERIC_PASSWORD,
      })
      .then(res => res.data)
  }
}

export default DeliveryService
