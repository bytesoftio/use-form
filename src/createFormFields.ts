import { FormFields } from "./FormFields"
import { CreateFormFields } from "./types"

export const createFormFields: CreateFormFields = (initialState?: string[]) => new FormFields(initialState)