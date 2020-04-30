import { CreateFormState } from "./types"
import { FormState } from "./FormState"

export const createFormState: CreateFormState = (initialState, dirtyFields, changedFields) => new FormState(initialState, dirtyFields, changedFields)