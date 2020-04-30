import { HookValue, ValueCallback, ValueInitializer, ValueSpread } from "@bytesoftio/use-value"
import { ObjectSchema, ValidationResult, ValidationSchema } from "@bytesoftio/schema"
import { HookStore, StoreCallback, StoreSpread } from "@bytesoftio/use-store"

export type CreateForm = <S extends object = any, R extends object = any>(initialState: S) => HookForm<S, R>
export type CreateFormErrors = (initialState?: ValidationResult) => HookFormErrors
export type CreateFormFields = (initialState?: string[]) => HookFormFields
export type CreateFormState = <S extends object>(initialState: S | undefined, dirtyFields: HookFormFields, changedFields: HookFormFields) => HookFormData<S>
export type FormValidator<S extends object, R extends object> = (form: HookForm<S, R>) => Promise<ValidationResult | undefined> | ValidationResult | undefined
export type FormCallback<S extends object, R extends object> = (form: HookForm<S, R>) => void
export type FormHandler<S extends object, R extends object> = (form: HookForm<S, R>) => Promise<any> | any
export type FormSpread<S> = [S, ValidationResult | undefined, boolean]
export type FormValidateOptions = { changedFieldsOnly?: boolean }
export type FormSubmitOptions = { validate?: boolean }

export type UseForm = <S extends object = any, R extends object = any>(initialState: ValueInitializer<HookForm<S, R>>) => HookForm<S, R>

export type FormConfig<S extends object, R extends object> = {
  validators: FormValidator<S, R>[]
  schemas: ValidationSchema[]
  handlers: FormHandler<S, R>[]
  validateOnSubmit: boolean
  validateChangedFieldsOnly: boolean
  validateOnChange: boolean
}

export interface HookFormFields {
  state: HookValue<string[]>

  get(): string[]
  has(fields: string | string[]): boolean
  set(fields: string[]): void
  add(fields: string | string[]): void
  remove(fields: string | string[]): void
  clear(): void

  listen(callback?: ValueCallback<string[]>): void
  use(): ValueSpread<string[]>
}

export interface HookFormErrors {
  state: HookStore<ValidationResult>

  get(): ValidationResult | undefined
  set(newErrors: ValidationResult): void
  add(newErrors: Partial<ValidationResult>): void
  has(): boolean
  clear(): void

  getAt(path: string): string[] | undefined
  setAt(path: string, newErrors: string[]): void
  addAt(path: string, newErrors: string | string[]): void
  hasAt(path: string | string[]): boolean
  clearAt(path: string | string[]): void

  listen(callback: StoreCallback<ValidationResult>): void
  use(): StoreSpread<ValidationResult, ValidationResult>
}

export interface HookFormData<S extends object> {
  state: HookStore<S>

  get(): S
  set(newState: S): void
  add(newState: Partial<S>): void
  reset(initialState?: S): void

  getAt(path: string): any
  setAt(path: string, value: any): void
  hasAt(path: string): boolean

  listen(callback: StoreCallback<S>): void
  use(): StoreSpread<S, Partial<S>>
}

export interface HookForm<S extends object = any, R extends object = any> {
  config: FormConfig<S, R>
  data: HookFormData<S>
  dirtyFields: HookFormFields
  changedFields: HookFormFields
  submitting: HookValue<boolean>
  submitted: HookValue<boolean>
  errors: HookFormErrors
  result: HookStore<R>
  bind: HookFormBinder

  reset(initialState?: S): void
  submit(options?: FormSubmitOptions): Promise<boolean>
  validate(options?: FormValidateOptions): Promise<ValidationResult | undefined>

  configure(config: Partial<FormConfig<S, R>>): this
  validator(handler: FormValidator<S, R>): this
  schema(handler: ObjectSchema<Partial<S>>): this
  handler(handler: FormHandler<S, R>): this

  listen(callback: FormCallback<S, R>): void
  use(): FormSpread<S>
}

export type CreateFormBinder = (form: HookForm) => HookFormBinder

export type FormBindingOptions = { validate?: boolean }
export type ButtonBindingOptions = { validate?: boolean, disableOnSubmit?: boolean }

export type SubmitBinding = { onSubmit: (e) => void }
export type SubmitButtonBinding = { onClick: (e) => void, disabled: boolean }
export type InputBinding = { onChange: (e) => void, value: any, name: string }
export type SelectBinding = { onChange: (e) => void, value: any, name: string }
export type CheckboxBinding = { onChange: (e) => void, checked: any, name: string }
export type RadioBinding = { onChange: (e) => void, checked: any, name: string }

export interface HookFormBinder {
  form(options?: Partial<FormBindingOptions>): SubmitBinding
  button(options?: Partial<ButtonBindingOptions>): SubmitButtonBinding
  input(path?: string): InputBinding
  select(path?: string): SelectBinding
  checkbox(path?: string): CheckboxBinding
  radio(path?: string, directValue?: any): RadioBinding
}