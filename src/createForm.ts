import { CreateForm } from "./types"
import { Form } from "./Form"

export const createForm: CreateForm = (initialState) => new Form(initialState)