import { UseForm } from "./types"
import { isFunction } from "lodash"
import { useMemo } from "react"
import { useValue } from "@bytesoftio/use-value"
import { useStore } from "@bytesoftio/use-store"

export const useForm: UseForm = (initialValue) => {
  const form = useMemo(() => isFunction(initialValue) ? initialValue() : initialValue, [])

  useStore(form.values.value)
  useValue(form.dirtyFields.value)
  useValue(form.changedFields.value)
  useValue(form.submitting)
  useValue(form.submitted)
  useStore(form.errors.value)
  useStore(form.result)

  return form
}

