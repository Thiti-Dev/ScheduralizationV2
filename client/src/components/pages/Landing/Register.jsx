import React, { Component } from 'react';
import { Form, Input, Tooltip, Cascader, Select, Checkbox, AutoComplete, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import styled from 'styled-components';

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

//
// ─── STYLING ────────────────────────────────────────────────────────────────────
//
const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 8 }
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 }
	}
};

const Holder_Form = styled.div`width: 30rem;`;
// ────────────────────────────────────────────────────────────────────────────────

export default class Register extends Component {
	constructor(props) {
		super(props);

		this.formRef = React.createRef();
		this.onFormSubmitHandler = this.onFormSubmitHandler.bind(this);
	}
	componentDidMount() {
		//this.formRef.useForm();
	}
	onFormSubmitHandler() {
		console.log('Submitting the form');
		const _data = this.formRef.current.getFieldsValue();
		console.log(_data);
	}
	render() {
		return (
			<React.Fragment>
				<Holder_Form>
					<Form
						onFinish={this.onFormSubmitHandler}
						{...formItemLayout}
						ref={this.formRef}
						name="register"
						scrollToFirstError
						size="large"
					>
						<Form.Item
							name="email"
							label="E-mail"
							hasFeedback
							rules={[
								// {
								// 	type: 'email',
								// 	message: 'The input is not valid E-mail!'
								// },
								{
									required: true,
									message: 'Please input your E-mail!'
								},
								({ getFieldValue }) => ({
									validator(rule, value) {
										if (!value || value.endsWith('@mail.kmutt.ac.th')) {
											return Promise.resolve();
										}
										return Promise.reject(`This is not a valid kmutt's student email!`);
									}
								})
							]}
						>
							<Input autoComplete="off" />
						</Form.Item>
						<Form.Item
							name="password"
							label="Password"
							rules={[
								{
									required: true,
									message: 'Please input your password!'
								}
							]}
							hasFeedback
						>
							<Input.Password />
						</Form.Item>

						<Form.Item
							name="confirmPassword"
							label="Confirm Password"
							dependencies={[ 'password' ]}
							hasFeedback
							rules={[
								{
									required: true,
									message: 'Please confirm your password!'
								},
								({ getFieldValue }) => ({
									validator(rule, value) {
										if (!value || getFieldValue('password') === value) {
											return Promise.resolve();
										}
										return Promise.reject('The two passwords that you entered do not match!');
									}
								})
							]}
						>
							<Input.Password />
						</Form.Item>
						<Form.Item
							name="username"
							label={
								<span>
									Username&nbsp;
									<Tooltip title="What do you want others to call you?">
										<QuestionCircleOutlined />
									</Tooltip>
								</span>
							}
							rules={[ { required: true, message: 'Please input your username!', whitespace: true } ]}
						>
							<Input autoComplete="off" />
						</Form.Item>
						<Form.Item
							name="firstName"
							label="First name"
							rules={[ { required: true, message: 'Please input your firstname!', whitespace: false } ]}
						>
							<Input autoComplete="off" />
						</Form.Item>
						<Form.Item
							name="lastName"
							label="Last name"
							rules={[ { required: true, message: 'Please input your lastname!', whitespace: false } ]}
						>
							<Input autoComplete="off" />
						</Form.Item>
						<div style={{ textAlign: 'right' }}>
							<Button type="primary" htmlType="submit" style={{ marginRight: '1rem' }}>
								Register
							</Button>
							<Button type="default" onClick={() => this.props.on_switch('landing')}>
								Cancel
							</Button>
						</div>
					</Form>
				</Holder_Form>
			</React.Fragment>
		);
	}
}
