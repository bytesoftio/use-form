import { CreateFormErrors } from "./types"
import { FormErrors } from "./FormErrors"
import { ValidationResult } from "@bytesoftio/schema"

export const createFormErrors: CreateFormErrors = (initialState?: ValidationResult) => new FormErrors(initialState)