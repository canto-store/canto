import { prisma, ProductOptionValue } from '../../../utils/db'

export class OptionService {
  async getSizeOptions(): Promise<ProductOptionValue[]> {
    return prisma.productOptionValue.findMany({
      where: { productOption: { name: 'Size' } },
    })
  }
}
