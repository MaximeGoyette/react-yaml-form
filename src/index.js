import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faInfoCircle, faCircleNotch, faCheckCircle, faExclamationCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import './index.css'
import Form from './components/Form'
import form1 from './forms/form1.yml'

library.add(faInfoCircle, faCircleNotch, faCheckCircle, faExclamationCircle, faTimesCircle)

const initialValues = {
    email: 'admin@admin.com',
    password: 'admin',
    'password-confirmation': 'admin',
}

const formCallback = (values, { onSuccess, onError }) => {

    if (values.email === 'admin@admin.com' && values.password === 'admin') {
        onSuccess('Login successful.', () => console.log('redirect to next page'), 5)
    } else {
        onError('Invalid creds.')
    }

}

ReactDOM.render(
    <div className="container" style={{ marginTop: '40px' }}>

        <Form {...form1} onSubmit={formCallback} />

    </div>, document.getElementById('root')
)