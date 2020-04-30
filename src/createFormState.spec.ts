import { createFormState } from "./createFormState"
import { FormState } from "./FormState"
import { createFormFields } from "./createFormFields"

describe("createFormState", () => {
  it("creates state", () => {
    const state = createFormState(undefined, createFormFields(), createFormFields())

    expect(state instanceof FormState).toBe(true)
    expect(state.get()).toEqual({})
  })

  it("creates state with initial state", () => {
    const state = createFormState({ foo: "bar" }, createFormFields(), createFormFields())

    expect(state instanceof FormState).toBe(true)
    expect(state.get()).toEqual({ foo: "bar" })
  })
})