import { difference, isArray, uniq } from "lodash"
import { HookFormFields } from "./types"
import { createValue, HookValue, ValueCallback, ValueSpread } from "@bytesoftio/use-value"

export class FormFields implements HookFormFields {
  state: HookValue<string[]>

  constructor(initialState?: string[]) {
    this.state = createValue<string[]>([])

    if (initialState) {
      this.set(initialState)
    }
  }

  get(): string[] {
    return this.state.get()
  }

  has(fields: string | string[]): boolean {
    if ( ! isArray(fields)) {
      fields = [fields]
    }

    return difference(fields, this.state.get()).length === 0
  }

  set(fields: string[]) {
    this.state.set(uniq(fields))
  }

  add(fields: string | string[]) {
    if ( ! isArray(fields)) {
      fields = [fields]
    }

    this.set([...this.state.get(), ...fields])
  }

  remove(fields: string | string[]) {
    if ( ! isArray(fields)) {
      fields = [fields]
    }

    this.state.set(difference(this.state.get(), fields))
  }

  clear() {
    this.state.reset()
  }

  listen(callback: ValueCallback<string[]>): void {
    this.state.listen(callback)
  }

  use(): ValueSpread<string[]> {
    return this.state.use()
  }
}