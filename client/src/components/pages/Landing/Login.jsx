import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import styled from 'styled-components';

//
// ─── MOBX ───────────────────────────────────────────────────────────────────────
//
import { inject, observer } from 'mobx-react';
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── FAKELOAD ───────────────────────────────────────────────────────────────────
//
import doFakeLoadIfNeeded from '../../../utils/fakeLoader';
// ────────────────────────────────────────────────────────────────────────────────

const Holder_Form = styled.div`
	width: 30rem;

	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
`;
const Login = inject('authStore')(
	observer(
		class Login extends Component {
			constructor(props) {
				super(props);
				this.state = {
					is_requesting: false
				};
				this.formRef = React.createRef();
				this.onFormSubmitHandler = this.onFormSubmitHandler.bind(this);
			}
			async onFormSubmitHandler() {
				console.log('[FORM]: Submitting the form');
				const _data = this.formRef.current.getFieldsValue();
				console.log(_data);
				// Loading button
				this.setState({ is_requesting: true }); // stop loading

				// Fake Load
				await doFakeLoadIfNeeded();

				try {
					const _res = await axios.post('/api/auth/login', _data);
					// If successfully loggedIn
					console.log('[DEBUG]: Successfully loggedIn');

					this.props.authStore.setAuthenticated(true, _res.data.token, (is_auth) => {
						this.props.history.push('/home');
					});
				} catch (error) {
					console.log(error.response);
					this.setState({ is_requesting: false }); // stop loading
					const err_message =
						error.response.status === 400
							? 'Invalid email/password ( Invalid credentials )'
							: 'The server is currently unavailable at the moment';
					message.error(err_message);
				}
			}
			render() {
				const { is_requesting } = this.state;
				return (
					<React.Fragment>
						<Holder_Form>
							<Form
								name="normal_login"
								initialValues={{ remember: true }}
								onFinish={this.onFormSubmitHandler}
								size="large"
								ref={this.formRef}
							>
								<Form.Item
									name="email"
									rules={[ { required: true, message: 'Please input your Email!' } ]}
								>
									<Input
										prefix={<UserOutlined className="site-form-item-icon" />}
										placeholder="Kmutt's Email"
									/>
								</Form.Item>
								<Form.Item
									name="password"
									rules={[ { required: true, message: 'Please input your Password!' } ]}
								>
									<Input
										prefix={<LockOutlined className="site-form-item-icon" />}
										type="password"
										placeholder="Password"
									/>
								</Form.Item>
								<Form.Item>
									<Form.Item name="remember" valuePropName="checked" noStyle>
										<Checkbox>Remember me</Checkbox>
									</Form.Item>

									<a className="login-form-forgot" href="">
										Forgot password
									</a>
								</Form.Item>

								<Form.Item>
									<Button
										type="primary"
										htmlType="submit"
										className="login-form-button"
										style={{ marginRight: '1rem' }}
										loading={is_requesting}
									>
										Log in
									</Button>
									Or{' '}
									<a href="#" onClick={() => this.props.on_switch('register')}>
										register now!
									</a>
								</Form.Item>
							</Form>
						</Holder_Form>
					</React.Fragment>
				);
			}
		}
	)
);

export default withRouter(Login);
