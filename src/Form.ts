import {
  FormCallback,
  FormConfig,
  FormHandler,
  FormSpread, FormSubmitOptions, FormValidateOptions,
  FormValidator,
  HookForm, HookFormBinder,
  HookFormErrors,
  HookFormFields,
  HookFormData,
} from "./types"
import { createValue, HookValue } from "@bytesoftio/use-value"
import { createFormState } from "./createFormState"
import { createFormFields } from "./createFormFields"
import { createFormErrors } from "./createFormErrors"
import { keys, merge } from "lodash"
import { createValidationResult, ValidationResult, ValidationSchema } from "@bytesoftio/schema"
import { createStore, HookStore } from "@bytesoftio/use-store"
import { createFormBinder } from "./createFormBinder"

export class Form<S extends object = any, R extends object = any> implements HookForm<S, R> {
  config: FormConfig<S, R>
  data: HookFormData<S>
  dirtyFields: HookFormFields
  changedFields: HookFormFields
  submitting: HookValue<boolean>
  submitted: HookValue<boolean>
  errors: HookFormErrors
  result: HookStore<R>
  bind: HookFormBinder

  constructor(initialState: S) {
    this.config = {
      handlers: [],
      validators: [],
      schemas: [],
      validateChangedFieldsOnly: false,
      validateOnChange: true,
      validateOnSubmit: true,
    }

    this.dirtyFields = createFormFields()
    this.changedFields = createFormFields()
    this.data = createFormState(initialState, this.dirtyFields, this.changedFields)
    this.submitting = createValue<boolean>(false)
    this.submitted = createValue<boolean>(false)
    this.errors = createFormErrors()
    this.result = createStore<R>({} as R)
    this.bind = createFormBinder(this)

    this.setupValidateOnChange()
  }

  reset(initialState?: S): void {
    this.data.reset(initialState)
    this.submitting.reset()
    this.submitted.reset()
    this.dirtyFields.clear()
    this.changedFields.clear()
    this.errors.clear()
    this.result.reset()
  }

  listen(callback: FormCallback<S, R>): void {
    const formCallback = () => callback(this)

    this.data.listen(formCallback)
    this.submitting.listen(formCallback)
    this.submitted.listen(formCallback)
    this.dirtyFields.listen(formCallback)
    this.changedFields.listen(formCallback)
    this.errors.listen(formCallback)
    this.result.listen(formCallback)
  }

  use(): FormSpread<S> {
    this.data.use()
    this.submitting.use()
    this.submitted.use()
    this.dirtyFields.use()
    this.changedFields.use()
    this.errors.use()
    this.result.use()

    return this.unpack()
  }

  configure(config: Partial<FormConfig<S, R>>): this {
    this.config = { ...this.config, ...config }

    return this
  }

  handler(handler: FormHandler<S, R>): this {
    this.config.handlers.push(handler)

    return this
  }

  validator(handler: FormValidator<S, R>): this {
    this.config.validators.push(handler)

    return this
  }

  schema(handler: ValidationSchema): this {
    this.config.schemas.push(handler)

    return this
  }

  async submit(options?: FormSubmitOptions): Promise<boolean> {
    if (this.submitting.get() === true) {
      return false
    }

    const validate = options?.validate === true || (this.config.validateOnSubmit && options?.validate !== false)

    this.result.reset()
    this.errors.clear()

    this.submitting.set(true)

    if (validate) {
      const errors = await this.validate()

      if (errors) {
        this.submitting.set(false)

        return false
      }
    }

    for (const handler of this.config.handlers) {
      const index = this.config.handlers.indexOf(handler)

      try {
        await handler(this)
      } catch (error) {
        this.submitting.set(false)

        console.error(`There was an error in form submit handler #${index}:`, error)
        throw error
      }
    }

    this.submitting.set(false)
    this.submitted.set(true)

    return true
  }

  async validate(options?: FormValidateOptions): Promise<ValidationResult | undefined> {
    const changedFieldsOnly = options?.changedFieldsOnly === true || (this.config.validateChangedFieldsOnly && options?.changedFieldsOnly !== false)

    const validatorErrors = await Promise.all(this.config.validators.map(async (validator, index) => {
      try {
        return await validator(this)
      } catch (error) {
        console.error(`There was an error in form validator #${index}:`, error)
        throw error
      }
    }))

    const schemaErrors = await Promise.all(this.config.schemas.map(async (schema, index) => {
      try {
        return createValidationResult(await schema.validate(this.data.get()))
      } catch (error) {
        console.error(`There was an error in form schema #${index}:`, error)
        throw error
      }
    }))

    const allErrors = [...validatorErrors, ...schemaErrors]

    const errors = {}

    allErrors.forEach(errorSet => {
      merge(errors, errorSet)
    })

    if (changedFieldsOnly) {
      keys(errors).forEach(key => {
        if ( ! this.changedFields.get().includes(key)) {
          delete errors[key]
        }
      })
    }

    this.errors.set(errors)

    return this.errors.get()
  }

  protected setupValidateOnChange() {
    this.data.listen(() => {
      if (this.config.validateOnChange) {
        try {
          this.validate({ changedFieldsOnly: true })
        } catch (error) {
        }
      }
    })
  }

  protected unpack(): FormSpread<S> {
    return [this.data.get(), this.errors.get(), this.submitting.get()]
  }
}