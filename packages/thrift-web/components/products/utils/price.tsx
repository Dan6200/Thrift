import { FC } from 'react'
import { formatNaira } from '@/lib/money'

interface priceProps {
  // Price in kobo (the API's integer minor-unit amount).
  kobo: number | string | null | undefined
}

export const Price: FC<priceProps> = ({ kobo }) => {
  return <p className="text-md sm:text-xl">{formatNaira(kobo)}</p>
}
