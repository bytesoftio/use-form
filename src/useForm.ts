import { UseForm } from "./types"
import { isFunction } from "lodash"
import { createFormBinder } from "./createFormBinder"
import { useMemo } from "react"
import { useValue } from "@bytesoftio/use-value"
import { useStore } from "@bytesoftio/use-store"

export const useForm: UseForm = (initialState) => {
  const [form, binder] = useMemo(() => {
    const form = isFunction(initialState) ? initialState() : initialState
    const binder = createFormBinder(form)

    return [form, binder]
  }, [])

  useStore(form.data.state)
  useValue(form.dirtyFields.state)
  useValue(form.changedFields.state)
  useValue(form.submitting)
  useValue(form.submitted)
  useStore(form.errors.state)
  useStore(form.result)

  return [form, binder]
}

