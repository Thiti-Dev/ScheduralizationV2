import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Radio, Select } from 'antd';

import { withRouter } from 'react-router-dom';

import styled from 'styled-components';

import axios from 'axios';

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

const InitModal = inject('authStore')(
	observer(
		class InitModal extends Component {
			constructor(props) {
				super(props);
				this.state = {
					is_requesting: false,
					visible: true,
					_year: '1',
					_semester: '1',
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
				this.setState({ _year: e.target.value });
			}
			onChangeSemester(e) {
				console.log(`Semester :${e.target.value}`);
				this.setState({ _semester: e.target.value });
			}
			onChangeMajor(value) {
				console.log(`Major ${value}`);
				this.setState({ major: value });
				this.clearErrors();
			}
			async onProceed() {
				const { _year, _semester, major } = this.state;
				if (!this.state.major) {
					this.setState({ errors: { major: 'Please select your major' } });
					return false;
				}
				this.setIsRequested(true);

				await doFakeLoadIfNeeded();

				try {
					const _data = {
						year: _year,
						semester: _semester,
						studentGroup: major
					};
					const _res = await axios.patch('/api/users/updateSpecificData', _data);
					// if found the token that passed back
					if (_res.data.token) {
						this.props.authStore.updateUserDataFromToken(_res.data.token, (successfully) => {
							this.props.history.push({
								pathname: '/courseinit',
								state: { new: true }
							});
						});
					}
				} catch (error) {
					console.log(error.response.data);
					//@TODO Show errors modal/msgs
				} finally {
					this.setIsRequested(false);
				}
			}
			render() {
				const { _year, _semester, major, errors, is_requesting } = this.state;
				if (!this.props.authStore.userData) {
					return null;
				}
				const { year, semester, studentGroup } = this.props.authStore.userData;
				const { isAuthenticated } = this.props.authStore;
				if (!isAuthenticated || (year && semester && studentGroup)) {
					return null;
				}
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
								value={_year}
								style={{ marginRight: '2rem' }}
							>
								<Radio.Button value="1">1</Radio.Button>
								<Radio.Button value="2">2</Radio.Button>
								<Radio.Button value="3">3</Radio.Button>
								<Radio.Button value="4">4</Radio.Button>
							</Radio.Group>

							<Custom_span_text>Semester</Custom_span_text>
							<Radio.Group onChange={this.onChangeSemester.bind(this)} defaultValue="1" value={_semester}>
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
							<Button
								onClick={this.onProceed.bind(this)}
								loading={is_requesting}
								type="primary"
								size="large"
							>
								Confirm
							</Button>
						</Custom_centered_container>
					</Modal>
				);
			}
		}
	)
);

export default withRouter(InitModal);
