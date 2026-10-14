import { formatNaira } from '@/lib/money'

export const Price = ({ kobo }: { kobo: number | null | undefined }) => (
  <div className="text-lg sm:text-xl md:text-2xl font-bold w-full">
    <p>{formatNaira(kobo)}</p>
  </div>
)
