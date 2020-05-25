import React, { Component } from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Rate, Steps, Result } from 'antd';
import { PlusOutlined, SmileOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { Step } = Steps;

const desc = [ 'terrible', 'bad', 'normal', 'good', 'wonderful' ];

export default class ScorePanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			rate: 3,
			_desc: '',
			step: 1
		};
		this.formRef = React.createRef();
	}
	componentWillReceiveProps(nextProps) {
		// Only rerender if visible only => (prevent from leaking the re-rendering when the panel is being closed)
		if (nextProps.is_visible) {
			if (nextProps.extra.exist_data) {
				console.log('[DEBUG]: Found exist data');
				const { score, description } = nextProps.extra.exist_data;
				this.setState({ rate: score, _desc: '' });
				if (!this.formRef.current) {
					//this.formRef.current.setFieldsValue({ description });
					this.setState({ step: 1, _desc: description });
				} else {
					this.formRef.current.setFieldsValue({ description });
				}
			} else {
				console.log('[DEBUG]: Not found exist data');
				if (!this.formRef.current) {
					console.log('QFUK!');
					this.setState({ step: 1, rate: 3, _desc: '' });
				} else {
					console.log('QFUK!ASDASD');
					this.setState({ step: 1, rate: 3, _desc: '' });
					this.formRef.current.setFieldsValue({ description: '' });
				}
			}
		}
	}
	handleChange = (value) => {
		this.setState({ rate: value });
	};
	onSubmit = async () => {
		console.log('[DEBUG]: Submitting');
		const desc = this.formRef.current.getFieldValue('description');
		const { rate } = this.state;
		const { courseID } = this.props.extra;
		console.log(`[DEBUG][${courseID}]: Got ${rate} score with desc of ${desc}`);

		try {
			const _res = await axios.post(`/api/courses/score/${courseID}`, { score: rate, desc });
			// If successfully vote
			// Calling callback
			this.props.on_complete(courseID, {
				score: rate,
				description: desc
			});
			// Setting the step
			this.setState({ step: 2 });
		} catch (error) {
			//@TODO show errors message
			console.log(error.response.data);
		}
	};
	render() {
		const { rate, _desc, step } = this.state;
		const { on_close, is_visible, extra } = this.props;
		if (!extra) {
			return null;
		}

		const { courseID, courseName, exist_data } = extra;

		// If found completing voted
		if (step === 2) {
			return (
				<Drawer
					title={`${courseID} ${courseName}`}
					width={720}
					onClose={on_close}
					visible={is_visible}
					bodyStyle={{ paddingBottom: 80 }}
					footer={
						<div
							style={{
								textAlign: 'right'
							}}
						>
							<Button onClick={on_close} style={{ marginRight: 8 }}>
								Close
							</Button>
						</div>
					}
				>
					<Row gutter={[ 16, 16 ]}>
						<Col span={24}>
							<Steps size="small" current={step}>
								<Step title={exist_data ? 'Give a feedback' : 'Study the course'} />
								<Step title={exist_data ? 'Edit a feedback' : 'Give a feedback'} />
								<Step title="Complete" />
							</Steps>
						</Col>
					</Row>
					<Result icon={<SmileOutlined />} title="Great, thank you for your feedback!" />
				</Drawer>
			);
		}

		return (
			<Drawer
				title={`${courseID} ${courseName}`}
				width={720}
				onClose={on_close}
				visible={is_visible}
				bodyStyle={{ paddingBottom: 80 }}
				footer={
					<div
						style={{
							textAlign: 'right'
						}}
					>
						<Button onClick={on_close} style={{ marginRight: 8 }}>
							Cancel
						</Button>
						<Button onClick={this.onSubmit} type="primary">
							Submit
						</Button>
					</div>
				}
			>
				<Form layout="vertical" hideRequiredMark ref={this.formRef} initialValues={{ description: _desc }}>
					<Row gutter={[ 16, 16 ]}>
						<Col span={24}>
							<Steps size="small" current={step}>
								<Step title={exist_data ? 'Give a feedback' : 'Study the course'} />
								<Step title={exist_data ? 'Edit a feedback' : 'Give a feedback'} />
								<Step title="Complete" />
							</Steps>
						</Col>
					</Row>
					<Row gutter={[ 16, 16 ]}>
						<Col span={24}>
							<span>
								<Rate tooltips={desc} onChange={this.handleChange} value={rate} />
								{rate ? <span className="ant-rate-text">{desc[rate - 1]}</span> : ''}
							</span>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item
								name="description"
								label="Feedback"
								rules={[
									{
										required: false,
										message: 'please give a description'
									}
								]}
							>
								<Input.TextArea rows={4} placeholder="Any extra feedback?" />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Drawer>
		);
	}
}
