import { HookFormFields, HookFormData } from "./types"
import { createStore, HookStore, StoreCallback, StoreSpread } from "@bytesoftio/use-store"
import { get, has, set, isEqual } from "lodash"

export class FormState<S extends object> implements HookFormData<S> {
  state: HookStore<S>
  dirtyFields: HookFormFields
  changedFields: HookFormFields

  constructor(
    initialState: S | undefined,
    dirtyFields: HookFormFields,
    changedFields: HookFormFields
  ) {
    this.state = createStore(initialState || {} as any)
    this.dirtyFields = dirtyFields
    this.changedFields = changedFields
  }

  get(): S {
    return this.state.get()
  }

  set(newState: S): void {
    this.state.set(newState)
  }

  add(newState: Partial<S>): void {
    this.state.add(newState)
  }

  reset(initialState?: S): void {
    this.state.reset(initialState)
  }

  getAt(path: string): any {
    return get(this.state.get(), path)
  }

  setAt(path: string, newValue: any): void {
    const newState = set(this.state.get(), path, newValue)

    this.state.set(newState)

    const oldValue = get(this.state.initialState, path)

    if ( ! isEqual(oldValue, newValue)) {
      this.changedFields.add(path)
    }

    this.dirtyFields.add(path)
  }

  hasAt(path: string): boolean {
    return has(this.state.get(), path)
  }

  listen(callback: StoreCallback<S>): void {
    this.state.listen(callback)
  }

  use(): StoreSpread<S, Partial<S>> {
    return this.state.use()
  }
}