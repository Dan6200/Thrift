'use client'
import { Button } from '@/components/ui/button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Form } from '../../ui/form'
import { ProductFormType } from './types'
import { submitHandler } from './submit-handler'
import useFormProps from './use-form-props'
import { Fragment } from 'react'
import { productAtom } from '@/atoms/index'
import { useSetAtom } from 'jotai'

import {
  Title,
  Description,
  BasePrice,
  Sku,
  Category,
  Subcategory,
  Quantity,
} from './form-fields'

export function ProductsForm() {
  const setProduct = useSetAtom(productAtom)
  const form = useForm<ProductFormType>(useFormProps)
  const { handleSubmit } = form
  const submit: SubmitHandler<ProductFormType> = submitHandler.bind(
    null,
    setProduct,
  )

  return (
    <Fragment>
      <Form {...form}>
        <form className="flex flex-col w-full" onSubmit={handleSubmit(submit)}>
          <Title form={form} />
          <Description form={form} />
          <BasePrice form={form} />
          <Sku form={form} />
          <Category form={form} />
          <Subcategory form={form} />
          <Quantity form={form} />
          <Button className="w-fit mx-auto mt-4 mb-8" type="submit">
            List Product
          </Button>
        </form>
      </Form>
    </Fragment>
  )
}
