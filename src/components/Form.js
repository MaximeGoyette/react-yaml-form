import React, { Component } from 'react'
import _ from 'lodash'
import $ from 'jquery'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './Form.css'

class Form extends Component {

    static propTypes = {
        fields: PropTypes.array.isRequired,
        onSubmit: PropTypes.func.isRequired,
        initialValues: PropTypes.object,
        submitText: PropTypes.string
    }

    static defaultProps = {
        initialValues: {},
        submitText: 'Submit'
    }
    state = {}

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip()
    }

    componentDidMount() {
        this.setState({ values: this.props.initialValues })
    }

    renderInput = ({
        name,
        type,
        placeholder,
        className,
        id,
        disabled
    }) => {
        const value = this.state.values[name] || ''

        switch (type) {
            case 'text':
            case 'email':
            case 'password':
                return (
                    <input
                        defaultValue={value}
                        name={name} type={type}
                        placeholder={placeholder}
                        className={classNames(className, 'form-control')}
                        id={id} disabled={disabled}
                        onChange={(e) => {
                            this.setState({
                                values: {
                                    ...this.state.values,
                                    [e.target.name]: e.target.value
                                }
                            })
                        }}
                    />
                )

            case 'checkbox':
                return (
                    <input
                        defaultChecked={value}
                        name={name} type={type}
                        placeholder={placeholder}
                        className={className}
                        id={id}
                        disabled={disabled}
                        onChange={(e) => {
                            this.setState({
                                values: {
                                    ...this.state.values,
                                    [e.target.name]: e.target.checked
                                }
                            })
                        }}
                    />
                )

            default:
                throw new Error(`The field type "${type}" is not supported.`)
        }
    }

    callbacks = {
        onSuccess: (msg, callback, delay=2) => {
            this.setState({
                externalSuccessMsg: msg + (callback ? `\nYou will be redirected in ${delay} second${delay === 1 ? '' : 's'}.` : ''),
                externalErrorMsg: ''
            })

            if (callback) {
                setTimeout(() => {
                    callback()
                }, delay*1000)
            }
        },
        onError: (msg, callback, delay=2) => {
            this.setState({
                submitting: false,
                externalErrorMsg: msg,
                externalSuccessMsg: ''
            })

            if (callback) {
                setTimeout(() => {
                    callback()
                }, delay*1000)
            }
        }
    }

    onSubmit = (e) => {
        e.preventDefault()
        this.setState({ submitting: true })

        this.props.onSubmit(this.state.values, this.callbacks)
    }

    render() {
        const { fields, submitText, title, name } = this.props
        const { submitting, values, externalSuccessMsg, externalErrorMsg } = this.state

        if (!values) {
            return (
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <FontAwesomeIcon className="rotating" icon="circle-notch" />
                </div>
            )
        }

        const renderedfields = _.map(fields, field => (
            <div
                key={field.name}
                className={classNames('card', `${field.name}-card`, 'form-group')}
                style={{ marginTop: '20px' }}
            >
                <div className="card-header">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <span style={{ fontSize: '20px' }}>{field.label}</span>
                                </td>
                                <td style={{ width: '10px' }}></td>
                                {
                                    (field.tooltip) ? (
                                        <td
                                            data-toggle="tooltip"
                                            data-trigger="hover"
                                            data-placement="right"
                                            title={field.tooltip}
                                            style={{ marginLeft: '10px' }}
                                        >
                                            <FontAwesomeIcon icon="info-circle" />
                                        </td>
                                    ) : null
                                }
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="card-body">
                    {this.renderInput(field)}
                </div>
            </div>
        ))

        return (
            <form className="form" onSubmit={this.onSubmit}>
                <h2>{title}</h2>
                {renderedfields}
                {
                    (externalSuccessMsg) ? (
                        <div className="alert alert-success" role="alert">
                            {externalSuccessMsg}
                        </div>
                    ) : null
                }
                {
                    (externalErrorMsg) ? (
                        <div className="alert alert-danger" role="alert">
                            {externalErrorMsg}
                        </div>
                    ) : null
                }
                <div className="form-group">
                    <button
                        className="btn btn-info btn-block"
                        type="submit"
                        disabled={submitting}
                    >
                        {
                            (submitting) ? (
                                <FontAwesomeIcon className="rotating" icon="circle-notch" />
                            ) : (
                                submitText
                            )
                        }
                    </button>
                </div>
            </form>
        )
    }

}

export default Form