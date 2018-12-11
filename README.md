# React-yaml-form

This react component renders a form based on a yaml file. The developer has control over the onSubmit event.

## Example

```js
// App.js

import React, { Component } from 'react'
import Form from './components/Form'
import form1 from './forms/form1.yml'

export default App extends Component {
    render() {
        const initialValues = {
            email: 'admin@admin.com',
            password: 'admin',
            chckbx: true
        }

        return (
            <Form
                {...form1}
                initialValues={initialValues}
                onSubmit={(values, { onSuccess, onError }) => {
                    if (values.email === 'admin@admin.com' && values.password === 'admin') {
                        onSuccess('Login successful.', () => {console.log('this is the callback')})
                    } else {
                        onError('Invalid creds.')
                    }
                }}
            />
        )
    }
}
```

```yaml
# ./forms/form1.yml

name: 'login-form'
title: 'Login form'

fields:
  - name: 'email'
    type: 'email'
    label: 'Email address'
    placeholder: 'Enter your email address here'
    tooltip: 'Type your email address in this field'

  - name: 'password'
    type: 'password'
    label: 'Password'
    placeholder: 'Enter your password here'
    tooltip: 'Type your password in this field'

  - name: 'chckbx'
    type: 'checkbox'
    label: 'A random checkbox'
    tooltip: 'Toggle on or off the button by clicking on it'

submitText: 'Login'
```

## Result

<img src="https://i.imgur.com/aQviYA2.png" />