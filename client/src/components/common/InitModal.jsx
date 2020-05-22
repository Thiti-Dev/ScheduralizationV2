import React, { Component } from 'react';
import { Modal, Button, Radio, Select } from 'antd';

import { withRouter } from 'react-router-dom';

import styled from 'styled-components';

//
// ─── FAKELOAD ───────────────────────────────────────────────────────────────────
//
import doFakeLoadIfNeeded from '../../utils/fakeLoader';
// ────────────────────────────────────────────────────────────────────────────────

const { Option } = Select;
const Custom_paragraph_info = styled.p`
	font-family: Rajdhani;
	font-size: 1.5rem;
	text-align: center;
`;

const Custom_error_info = styled.p`
	margin-left: 1rem;
	font-family: Rajdhani;
	font-size: 0.9rem;
	text-align: center;
	color: red;
	margin-top: 0.5rem;
`;

const Custom_warning_info = styled.p`
	font-family: Rajdhani;
	font-size: 0.9rem;
	text-align: center;
	color: red;
`;

const Custom_centered_container = styled.div`
	text-align: center;
	margin-bottom: 2rem;
`;

const Custom_span_text = styled.span`
	font-family: Rajdhani;
	font-size: 1.2rem;
	margin-right: 0.5rem;
`;
export default withRouter(
	class InitModal extends Component {
		constructor(props) {
			super(props);
			this.state = {
				is_requesting: false,
				visible: false,
				year: '1',
				semester: '1',
				major: '',
				errors: {}
			};
		}
		setIsRequested(bool) {
			this.setState({ is_requesting: bool });
		}
		clearErrors() {
			this.setState({ errors: {} });
		}
		onChangeYear(e) {
			console.log(`Year :${e.target.value}`);
			this.setState({ year: e.target.value });
		}
		onChangeSemester(e) {
			console.log(`Semester :${e.target.value}`);
			this.setState({ semester: e.target.value });
		}
		onChangeMajor(value) {
			console.log(`Major ${value}`);
			this.setState({ major: value });
			this.clearErrors();
		}
		async onProceed() {
			if (!this.state.major) {
				this.setState({ errors: { major: 'Please select your major' } });
				return false;
			}
			this.setIsRequested(true);

			await doFakeLoadIfNeeded();

			this.setIsRequested(false);

			this.props.history.push('/courseinit');
		}
		render() {
			const { year, semester, major, errors, is_requesting } = this.state;
			return (
				<Modal visible={this.state.visible} closable={false} footer={false} centered width="50vw">
					<Custom_paragraph_info>
						Please give us more detail in order to serve you the best experience
					</Custom_paragraph_info>
					<Custom_centered_container>
						<Custom_span_text>Year</Custom_span_text>
						<Radio.Group
							onChange={this.onChangeYear.bind(this)}
							defaultValue="1"
							value={year}
							style={{ marginRight: '2rem' }}
						>
							<Radio.Button value="1">1</Radio.Button>
							<Radio.Button value="2">2</Radio.Button>
							<Radio.Button value="3">3</Radio.Button>
							<Radio.Button value="4">4</Radio.Button>
						</Radio.Group>

						<Custom_span_text>Semester</Custom_span_text>
						<Radio.Group onChange={this.onChangeSemester.bind(this)} defaultValue="1" value={semester}>
							<Radio.Button value="1">1</Radio.Button>
							<Radio.Button value="2">2</Radio.Button>
						</Radio.Group>
					</Custom_centered_container>

					<Custom_centered_container>
						<Custom_span_text>Major</Custom_span_text>
						<Select
							value={major}
							showSearch
							style={{ width: 300 }}
							placeholder="Select your major"
							optionFilterProp="children"
							onChange={this.onChangeMajor.bind(this)}
							// onFocus={onFocus}
							// onBlur={onBlur}
							// onSearch={onSearch}
							filterOption={(input, option) =>
								option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
						>
							<Option value="CSS">Applied Computer Science</Option>
						</Select>
						<Custom_error_info>{errors.major}</Custom_error_info>
					</Custom_centered_container>
					<Custom_centered_container>
						{/* <Custom_warning_info>*Note: This action cannot be skipped</Custom_warning_info> */}
						<Button onClick={this.onProceed.bind(this)} loading={is_requesting} type="primary" size="large">
							Confirm
						</Button>
					</Custom_centered_container>
				</Modal>
			);
		}
	}
);
