import { Product } from '@/types/products'
import Link from 'next/link'

export function Title({
  title,
  product_id,
}: Pick<Product, 'title' | 'product_id'>) {
  return (
    <Link
      href={`/products/${product_id}`}
      passHref
      className="active:text-accent h-16 w-full flex justify-between"
    >
      <h4 className="sm:text-xl hover:text-primary dark:hover:text-secondary text-responsive w-full whitespace-normal break-words">
        {title}
      </h4>
    </Link>
  )
}
