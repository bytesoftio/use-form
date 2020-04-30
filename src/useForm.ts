import { UseForm } from "./types"
import { isFunction } from "lodash"
import { useValue } from "@bytesoftio/use-value"

export const useForm: UseForm = (initialState) => {
  const [form] = useValue(() => isFunction(initialState) ? initialState() : initialState)

  form.use()

  return form
}