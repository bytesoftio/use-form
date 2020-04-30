import {
  CheckboxBinding,
  HookFormBinder,
  InputBinding,
  RadioBinding,
  SubmitBinding,
  FormBindingOptions,
  SubmitButtonBinding,
  ButtonBindingOptions, SelectBinding, HookForm,
} from "./types"

export class FormBinder implements HookFormBinder {
  target: HookForm

  constructor(target: HookForm) {
    this.target = target
  }

  form(options: FormBindingOptions = {}): SubmitBinding {
    options = { ...{ validate: undefined }, ...options }

    return {
      onSubmit: (e) => {
        e.preventDefault()
        this.target.submit({ validate: options.validate })
      },
    }
  }

  button(options: ButtonBindingOptions = {}): SubmitButtonBinding {
    options = { ...{ validate: undefined, disableOnSubmit: true }, ...options }

    return {
      disabled: !! (options.disableOnSubmit && this.target.submitting.get()),
      onClick: (e) => {
        e.preventDefault()
        this.target.submit({ validate: options.validate })
      },
    }
  }

  input(path: string): InputBinding {
    return {
      name: path,
      value: this.target.data.getAt(path),
      onChange: (e) => this.target.data.setAt(path, e.target.value),
    }
  }

  select(path: string): SelectBinding {
    return this.input(path)
  }

  checkbox(path: string): CheckboxBinding {
    return {
      name: path,
      checked: this.target.data.getAt(path),
      onChange: (e) => this.target.data.setAt(path, !! e.target.checked),
    }
  }

  radio(path: string, value: any = true): RadioBinding {
    return {
      name: path,
      checked: value === this.target.data.getAt(path),
      onChange: () => this.target.data.setAt(path, value),
    }
  }
}