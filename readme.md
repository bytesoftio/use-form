# @bytesoftio/use-form

## Installation

`yarn add @bytesoftio/use-form` or `npm install @bytesoftio/use-form`

## Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Description](#description)
- [Form hooks and bindings](#form-hooks-and-bindings)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Description

This library provides an integration form the [@bytesoftio/form](https://github.com/bytesoftio/form) package.

## Form hooks and bindings

For a React component to properly update upon form state changes, you must first hook the form up. There are several ways on how to consume forms in components.

After consuming a form you must bind it to input fields. This library already ships with a very lightweight binder inside, but you can very easily roll your own binder for your specific ui library. Just take a look on how `FormBinder`  is written - its easy as cake.

Lets take a look on how to use hooks and bindings:

```tsx
import React from "react"
import { createForm } from "@bytesoftio/form"
import { useForm } from "@bytesoftio/use-form"

const formFactory = () => createForm()
const sharedFormInstance = createForm()

const Component = () => {
  const [formFromFactory, bind] = useForm(formFactory)
  const [sharedForm] = useForm(sharedFormInstance)
  const [formFromInlineFactory] = useForm(() => createForm())
  
	return (
    <form { ...bind.form() }>
    	<input type="text" { ...bind.input("field1") } />
    	
      <input type="checkbox" { ...bind.checkbox("field2") } />
      
      <input type="radio" { ...bind.radio("field3", "value1") } />
      <input type="radio" { ...bind.radio("field3", "value2") } />
      
      <select { ...bind.select("field4") }>
        <option>option 1</option>
        <option>option 2<option>
        <option>option 3<option>
      </select>
          
      <button { ...bind.submit() }>Submit</button>
    </form>
  )
}
```

