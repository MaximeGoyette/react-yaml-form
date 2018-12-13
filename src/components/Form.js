import React, { Component } from 'react'
import _ from 'lodash'
import $ from 'jquery'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './Form.css'

class Form extends Component {

    static propTypes = {
        fields: PropTypes.object.isRequired,
        onSubmit: PropTypes.func.isRequired,
        initialValues: PropTypes.object,
        submitText: PropTypes.string
    }

    static defaultProps = {
        initialValues: {},
        submitText: 'Submit'
    }

    state = {
        touched: []
    }

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip()
    }

    componentDidMount() {
        const { initialValues, fields } = this.props
        this.setState({
            values: initialValues ? initialValues : _.mapValues(fields, o => ''),
            touched: _.map(initialValues, (value, name) => name)
        })
    }

    renderInput = (name, {
        type,
        placeholder,
        className,
        id,
        disabled
    }, isTouched, isValid) => {
        const { values, touched } = this.state
        const value = values[name] || ''

        switch (type) {
            case 'text':
            case 'email':
            case 'password':
                return (
                    <input
                        defaultValue={value}
                        name={name} type={type}
                        placeholder={placeholder}
                        className={classNames(className, 'form-control', { 'is-valid': isTouched && isValid, 'is-invalid': isTouched && !isValid })}
                        id={id} disabled={disabled}
                        style={{
                            borderRightWidth: isTouched ? '0px' : '1px'
                        }}
                        onChange={(e) => {
                            this.setState({
                                values: {
                                    ...values,
                                    [e.target.name]: e.target.value
                                }
                            })
                        }}
                        onBlur={(e) => {
                            this.setState({
                                touched: [
                                    ...touched,
                                    name
                                ]
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

    checkField = (checks, value) => {
        const msgs = _.map(checks, check => {
            if (check.regexp && !(new RegExp(check.regexp).test(value))) {
                return check.msg || `Check for RegExp "${check}" has failed.`
            } else if (check.length) {
                const extremums = _.map(check.length.split('..'), o => parseInt(o))
                if (value.length < extremums[0] || value.length > extremums[1]) {
                    return check.msg || `Check for length of "${check.length}" has failed.`
                }
            } else if (check.matches) {
                if (!this.props.fields[check.matches]) {
                    throw new Error(`The field "${check.matches}" doesn't exist.`)
                } else if (value !== this.state.values[check.matches]) {
                    return check.msg || `Check for matching value with "${check.matches}" field has failed.`
                }
            }
        })
        return _.filter(msgs)
    }

    render() {
        const { fields, submitText, title } = this.props
        const { submitting, values, externalSuccessMsg, externalErrorMsg } = this.state

        if (!values) {
            return (
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <FontAwesomeIcon className="rotating" icon="circle-notch" />
                </div>
            )
        }

        const renderedfields = _.map(fields, (field, name) => {
            const { values, touched } = this.state
            const value = values[name] || ''
            const msgs = this.checkField(field.checks, value)
            const isTouched = touched.includes(name)
            const isValid = msgs.length === 0

            const renderedMsgs = _.map(msgs, (msg, index) => (
                <li key={index}>
                    <FontAwesomeIcon style={{ marginRight: '10px', color: isValid ? 'green' : '#dd3c4c' }} icon={isValid ? 'check-circle' : 'exclamation-circle'} />{msg}
                </li>
            ))

            return (
                <div
                    key={name}
                    className={classNames('card', `${name}-card`, 'form-group')}
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
                        <div className="input-group">
                            {this.renderInput(name, field, isTouched, isValid)}
                            {
                                (isTouched) ? (
                                    <div className="input-group-append">
                                        <span className="input-group-text" style={{
                                            color: isValid ? '#28a745' : '#dc3545',
                                            backgroundColor: 'white',
                                            borderColor: isValid ? '#28a745' : '#dc3545'
                                        }}>
                                            {
                                                isValid ? (
                                                    <FontAwesomeIcon icon="check-circle" />
                                                ) : (
                                                    <FontAwesomeIcon icon="times-circle" />
                                                )
                                            }
                                        </span>
                                    </div>
                                ) : null
                            }
                        </div>
                    </div>
                    {
                        (isTouched && renderedMsgs.length > 0) ? (
                            <div className="card-footer">
                                <ul className="unstyled">
                                    {renderedMsgs}
                                </ul>
                            </div>
                        ) : null
                    }
                </div>
            )
        })

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