import { HookFormErrors } from "./types"
import { ValidationResult } from "@bytesoftio/schema"
import { createStore, HookStore, StoreCallback, StoreSpread } from "@bytesoftio/use-store"
import { get, isArray, keys } from "lodash"

export class FormErrors implements HookFormErrors {
  state: HookStore<ValidationResult>

  constructor(initialState?: ValidationResult) {
    this.state = createStore({})

    if (initialState) {
      this.set(initialState)
    }
  }

  get(): ValidationResult | undefined | any {
    const errors = this.state.get()

    if (keys(errors).length === 0) {
      return undefined
    }

    return errors
  }

  getAt(path: string): any | undefined {
    const errors = get(this.state.get(), path)

    if ( ! errors || errors.length === 0) {
      return undefined
    }

    return errors
  }

  set(newErrors: ValidationResult): void {
    this.state.set(newErrors)
  }

  setAt(path: string, newErrors: string[]): void {
    const errors = this.get()
    errors[path] = newErrors

    this.state.set(errors)
  }

  add(newErrors: Partial<ValidationResult>): void {
    this.state.add(newErrors)
  }

  addAt(path: string, newErrors: string | string[]): void {
    if ( ! isArray(newErrors)) {
      newErrors = [newErrors]
    }

    const errors = this.getAt(path) || []
    errors.push(...newErrors)

    this.setAt(path, errors)
  }

  has(): boolean {
    return this.get() !== undefined
  }

  hasAt(path: string | string[]): boolean {
    if ( ! isArray(path)) {
      path = [path]
    }

    const hasErrors = path.map(p => this.getAt(p) !== undefined)

    return hasErrors.includes(true)
  }

  clearAt(path: string | string[]): void {
    if ( ! isArray(path)) {
      path = [path]
    }

    const errors = this.state.get()

    if (errors) {
      path.forEach(p => delete errors[p])

      this.set(errors)
    }
  }

  clear(): void {
    this.state.reset()
  }

  listen(callback: StoreCallback<ValidationResult>): void {
    this.state.listen(callback)
  }

  use(): StoreSpread<ValidationResult, ValidationResult> {
    return this.state.use()
  }
}