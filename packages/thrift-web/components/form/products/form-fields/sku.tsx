import { Input } from '@/components/ui/input'
import { UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../ui/form'
import { ProductFormType } from '../types'

export const Sku = ({ form }: { form: UseFormReturn<ProductFormType> }) => (
  <FormField
    control={form.control as any}
    name="sku"
    render={({ field }) => (
      <FormItem className="md:w-[45%]">
        <FormLabel>SKU</FormLabel>
        <FormControl>
          <Input
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            value={field.value}
            placeholder="Stock keeping unit"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)
