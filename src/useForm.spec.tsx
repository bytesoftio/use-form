import React from "react"
import { createForm, useForm } from "./index"
import { mount } from "enzyme"

describe("useForm", () => {
  it("uses form", () => {
    const initializer = createForm({ foo: "bar" })

    const Test = () => {
      const form = useForm(initializer)
      return (
        <h1>{form.data.get().foo}</h1>
      )
    }

    const wrapper = mount(<Test/>)
    const target = () => wrapper.find("h1")

    expect(target().text()).toBe("bar")
  })

  it("uses form with initializer", () => {
    const initializer = () => createForm({ foo: "bar" })

    const Test = () => {
      const form = useForm(initializer)
      return (
        <h1>{form.data.get().foo}</h1>
      )
    }

    const wrapper = mount(<Test/>)
    const target = () => wrapper.find("h1")

    expect(target().text()).toBe("bar")
  })
})