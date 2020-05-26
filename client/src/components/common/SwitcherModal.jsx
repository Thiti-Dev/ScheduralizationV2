import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Radio, Select, Affix, message } from 'antd';

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

const SwitcherModal = inject('authStore')(
	observer(
		class SwitcherModal extends Component {
			constructor(props) {
				super(props);
				this.state = {
					_year: 1,
					_semester: 1,
					is_requesting: false
				};
				this.changesDetection = this.changesDetection.bind(this);
			}
			changesDetection() {
				let changes = false;
				if (this.state._year !== this.props.year || this.state._semester !== this.props.semester) {
					changes = true;
				}
				/*if (changes) {
					console.log('[DEBUG]: Detect changes');
				} else {
					console.log('[DEBUG]: Dont Detect any changes');
                }*/

				return changes;
			}

			componentWillReceiveProps(nextProps) {
				if (nextProps.year || nextProps.semester) {
					this.setState({ _year: nextProps.year, _semester: nextProps.semester });
				}
			}
			onChangeYear(e) {
				console.log(`Year :${e.target.value}`);
				this.setState({ _year: e.target.value });
			}
			onChangeSemester(e) {
				console.log(`Semester :${e.target.value}`);
				this.setState({ _semester: e.target.value });
			}
			async onProceed() {
				console.log('[DEBUG]: Trying to apply the switcher');

				//
				// CHECK IF THERE IS ANY CHANGES
				//
				let changes = this.changesDetection();
				if (changes) {
					console.log('[DEBUG]: Detect changes');
					this.setState({ is_requesting: true });
					await doFakeLoadIfNeeded(); // doing fake load
					const { _year, _semester } = this.state;
					try {
						const _res = await axios.put('/api/users/switch', {
							year: _year,
							semester: _semester
						});
						// If update sucessfully

						// Check if token has been passed
						if (_res.data.token) {
							this.props.authStore.updateUserDataFromToken(_res.data.token, (successfully) => {
								message.success(`Successfully changing year to ${_year} and semester to ${_semester}`);
								message.warning(
									'All of your scheduled courses have been automatically removed by default'
								);
								setTimeout(() => {
									window.location.reload(false); // reloading after the cookie is removed => automatically un-authenticated and will be redirecting to the login page
								}, 2000);
								this.props.on_close();
							});
						}
					} catch (error) {
						//@TODO send errors messages
						console.log(error);
					} finally {
						this.setState({ is_requesting: false });
					}
				} else {
					console.log('[DEBUG]: Dont Detect any changes');
					this.props.on_close();
				}
				// • • • • •
			}
			render() {
				const { visible, on_close, year, semester } = this.props;
				const { _year, _semester, is_requesting } = this.state;
				return (
					<Modal visible={visible} closable={true} centered width="50vw" onCancel={on_close} footer={false}>
						<Custom_centered_container>
							<Custom_span_text>Year</Custom_span_text>
							<Radio.Group
								onChange={this.onChangeYear.bind(this)}
								defaultValue={1}
								value={_year}
								style={{ marginRight: '2rem' }}
							>
								<Radio.Button value={1}>1</Radio.Button>
								<Radio.Button value={2}>2</Radio.Button>
								<Radio.Button value={3}>3</Radio.Button>
								<Radio.Button value={4}>4</Radio.Button>
							</Radio.Group>

							<Custom_span_text>Semester</Custom_span_text>
							<Radio.Group onChange={this.onChangeSemester.bind(this)} defaultValue={1} value={_semester}>
								<Radio.Button value={1}>1</Radio.Button>
								<Radio.Button value={2}>2</Radio.Button>
							</Radio.Group>
						</Custom_centered_container>
						<Custom_centered_container>
							<Custom_error_info>
								{this.changesDetection() ? (
									'*By changing year/semester you will lost all of your scheduled courses'
								) : null}
							</Custom_error_info>
						</Custom_centered_container>
						<Custom_centered_container>
							{/* <Custom_warning_info>*Note: This action cannot be skipped</Custom_warning_info> */}
							<Button
								onClick={this.onProceed.bind(this)}
								loading={is_requesting}
								type="primary"
								size="large"
							>
								{this.changesDetection() ? 'Confirm changes' : 'Confirm'}
							</Button>
						</Custom_centered_container>
					</Modal>
				);
			}
		}
	)
);

export default SwitcherModal;
