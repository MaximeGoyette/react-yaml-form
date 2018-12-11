import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faInfoCircle, faCircleNotch } from '@fortawesome/free-solid-svg-icons'

import './index.css'
import Form from './components/Form'
import form1 from './forms/form1.yml'

library.add(faInfoCircle, faCircleNotch)

const initialValues = {
    email: 'admin@admin.com',
    password: 'admin',
    chckbx: true
}

ReactDOM.render(
    <div className="container" style={{ marginTop: '40px' }}>
        <Form
            {...form1}
            initialValues={initialValues}
            onSubmit={(values, { onSuccess, onError }) => {
                setTimeout(() => {
                    if (values.email === 'admin@admin.com' && values.password === 'admin') {
                        onSuccess('Login successful.', () => {})
                    } else {
                        onError('Invalid creds.')
                    }
                }, 1000)
            }}
        />
    </div>, document.getElementById('root'))