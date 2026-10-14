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

export const BasePrice = ({
  form,
}: {
  form: UseFormReturn<ProductFormType>
}) => (
  <FormField
    control={form.control as any}
    name="base_price"
    render={({ field }) => (
      <FormItem className="md:w-[45%]">
        <FormLabel>Base Price (kobo)</FormLabel>
        <FormControl>
          <Input
            type="number"
            onChange={(event) => field.onChange(+event.target.value)}
            onBlur={field.onBlur}
            name={field.name}
            value={field.value}
            placeholder="Product's base price"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)
