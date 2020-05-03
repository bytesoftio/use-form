import { ObservableForm } from "@bytesoftio/form"
import { ValueInitializer } from "@bytesoftio/value"

export type UseForm = <S extends object = any, R extends object = any>(initialState: ValueInitializer<ObservableForm<S, R>>) => UseFormSpread<S, R>
export type UseFormSpread<S extends object = any, R extends object = any> = [ObservableForm<S, R>, ObservableFormBinder]

export type CreateFormBinder = (form: ObservableForm) => ObservableFormBinder

export type FormBindingOptions = { validate?: boolean }
export type ButtonBindingOptions = { validate?: boolean, disableOnSubmit?: boolean }

export type SubmitBinding = { onSubmit: (e) => void }
export type SubmitButtonBinding = { onClick: (e) => void, disabled: boolean }
export type InputBinding = { onChange: (e) => void, value: any, name: string }
export type SelectBinding = { onChange: (e) => void, value: any, name: string }
export type CheckboxBinding = { onChange: (e) => void, checked: any, name: string }
export type RadioBinding = { onChange: (e) => void, checked: any, name: string }

export interface ObservableFormBinder {
  form(options?: Partial<FormBindingOptions>): SubmitBinding
  button(options?: Partial<ButtonBindingOptions>): SubmitButtonBinding
  input(path?: string): InputBinding
  select(path?: string): SelectBinding
  checkbox(path?: string): CheckboxBinding
  radio(path?: string, directValue?: any): RadioBinding
}