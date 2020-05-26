import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';

// ─── ANTD ───────────────────────────────────────────────────────────────────────
//
import {
	Row,
	Col,
	Divider,
	Layout,
	Button,
	PageHeader,
	Menu,
	Dropdow,
	Tag,
	Typography,
	Breadcrumb,
	Drawer,
	List,
	Badge,
	Modal,
	message,
	Popover,
	Radio
} from 'antd';
import {
	EllipsisOutlined,
	HomeOutlined,
	UserOutlined,
	MenuOutlined,
	ScheduleOutlined,
	ExclamationCircleOutlined,
	BookFilled
} from '@ant-design/icons';

// ────────────────────────────────────────────────────────────────────────────────

import styled, { createGlobalStyle } from 'styled-components';

//
// ─── UTIL ───────────────────────────────────────────────────────────────────────
//
import { isHavingDecimalPlaceThatGreaterThanZero } from '../../../utils/mathHelper';
import {
	convertClockTimeToMinutesFromStart,
	addHourExactNoAdditionalMinuteRemain,
	minusHourExactNoAdditionalMinuteRemain
} from './helper';
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── HEADER ─────────────────────────────────────────────────────────────────────
//
import PageHeaderMain from '../../common/PageHeaderMain';
// ────────────────────────────────────────────────────────────────────────────────

const { Header, Content, Footer } = Layout;
const { Paragraph } = Typography;
const { confirm } = Modal;

//
// ─── FIX HIDDEN OVERFLOW BY DEFAULT APPCSS ──────────────────────────────────────
//
const GlobalStyle = createGlobalStyle`
  body {
    overflow: auto;
  }
`;
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── CUSTOM STYLING ─────────────────────────────────────────────────────────────
//

const Outer_Holder = styled.div`padding: 3rem 5rem;`;

const Custom_Top_Table = styled.table`
	text-align: center;
	border: 1px solid black;
	table-layout: fixed;

	font-family: Rajdhani;
	color: white;
	margin-top: 2rem;
`;

const Custom_Bottom_Table = styled.table`
	width: 107rem;
	text-align: center;
	border: 1px solid black;
	table-layout: fixed;

	font-family: Rajdhani;
	color: white;
`;

const Custom_Table = styled.table`
	width: 107rem;
	text-align: center;
	border: 1px solid black;
	table-layout: fixed;

	font-family: Rajdhani;
	color: white;
`;

const Custom_Main_Th = styled.th`
	border: 1px solid black;
	overflow: hidden;
	width: 106.92rem;
	max-width: 106.92rem;
	min-width: 106.92rem;

	height: 3rem;
	max-height: 3rem;
	min-height: 3rem;

	background-color: rgba(0, 0, 0, 0.7);
`;

const Custom_Th = styled.th`
	border: 1px solid black;
	overflow: hidden;
	width: 100px;
	max-width: 100px;
	min-width: 100px;

	background-color: rgba(0, 0, 0, 0.7);
`;

const Custom_Day_Td = styled.td`
	border: 1px solid black;
	overflow: hidden;
	width: 100px;
	height: 70px;
	max-width: 100px;
	min-width: 100px;
	max-height: 70px;
	min-height: 70px;
	background-color: rgba(0, 0, 0, 0.7);
`;

// ────────────────────────────────────────────────────────────────────────────────

//
// ─── LOGIC PROCESS UI HOLDER ──────────────────────────────────────────────────────────────
//
const Custom_Td = styled.td`
	border: 1px solid rgba(0, 0, 0, 0.2);
	cursor: pointer;
	width: 100px;
	max-width: 100px;
	min-width: 100px;
`;
const Day_Time_Holder = styled.div`
	/* background-color: lightcoral; */
	width: 1565px;
	height: 3.6rem;
	/* text-align: left; */
	border-radius: 10rem;
`;

const Day_Time_Inside = styled.div`
	background-color: lightcoral;
	width: ${(props) => `${convertClockTimeToMinutesFromStart(props.start, props.end) * 0.14835}rem`};
	height: 3.6rem;
	line-height: 3.6rem;
	/* text-align: left; */
	border-radius: 10rem;
	margin-left: ${(props) => `${convertClockTimeToMinutesFromStart(props.start) * 0.14835}rem`};

	user-select: none;
	position: absolute;
`;

const Day_Time_Course_Name = styled.p`
	width: 100%;
	height: 100%;
	overflow-x: auto;
	overflow-y: hidden;
	white-space: nowrap;

	::-webkit-scrollbar {
		height: 8px;
		border-radius: 10rem;
	}

	::-webkit-scrollbar-track-piece {
		margin: 2rem;
		border-radius: 10rem;
		background: grey;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.5);
		border-radius: 10rem;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
`;

const Schedule_Holder = styled.div`
	@media (min-width: 992px) {
		/* small screen ignore centering adjust */
	}
	@media (min-width: 1600px) {
		position: absolute;
		left: 50%;
		transform: translate(-50%, 0);

		@media (min-height: 1000px) {
			/* small screen ignore centering adjust */
			margin-top: 5rem;
		}
	}
`;

const Custom_Semester_Info = styled.p`
	font-family: Rajdhani;
	font-size: 2rem;
`;
// ────────────────────────────────────────────────────────────────────────────────

const Breadcrumb_Render = ({ history }) => (
	<Breadcrumb style={{ marginLeft: '1.5rem' }}>
		<Breadcrumb.Item href={null} onClick={() => history.push('dashboard')}>
			<MenuOutlined />
			<span>Dashboard</span>
		</Breadcrumb.Item>
		<Breadcrumb.Item>
			<ScheduleOutlined />
			<span>My Schedule</span>
		</Breadcrumb.Item>
	</Breadcrumb>
);

//
// ─── MAPPING UTIL ───────────────────────────────────────────────────────────────
//
const normal_time_slot = [
	[ '08.00 AM', '08.00' ],
	[ '09.00 AM', '09.00' ],
	[ '10.00 AM', '10.00' ],
	[ '11.00 AM', '11.00' ],
	[ '12.00 PM', '12.00' ],
	[ '1.00 PM', '13.00' ],
	[ '2.00 PM', '14.00' ],
	[ '3.00 PM', '15.00' ],
	[ '4.00 PM', '16.00' ],
	[ '5.00 PM', '17.00' ],
	[ '6.00 PM', '18.00' ]
];
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── MOCK DATA ──────────────────────────────────────────────────────────────────
//

const _user_assigned_course = [
	// array of assigned courses
	{
		courseID: 'LNG220',

		day: 'จ.', // 1 == Monday
		start: '08.30', // 8.30 AM
		end: '11.30',
		courseData: {
			courseName: 'Academic English'
		}
	},
	{
		courseID: 'GEN111',

		day: 'จ.', // 1 == Monday
		start: '13.30', // 13.30 PM
		end: '16.30',
		courseData: {
			courseName: 'Man and Ethics of Living'
		}
	},
	{
		courseID: 'CSS112',

		day: 'พ.', // 3 == Wednesday
		start: '09.00',
		end: '12.00',
		courseData: {
			courseName: 'Computer Programming I	'
		}
	},
	{
		courseID: 'CSS322',

		day: 'พฤ.', // 4 == Thursday
		start: '10.00',
		end: '11.30',
		courseData: {
			courseName: 'System Analysis and Design	'
		}
	},
	{
		courseID: 'AWK101',

		day: 'ส.', // 4 == Thursday
		start: '09.00',
		end: '14.20',
		courseData: {
			courseName: 'Learn how to be like thiti	'
		}
	}
];

const mock_available = [
	{
		id: 1523,
		courseID: 'CSS227',
		semester: 2,
		totalSeat: 50,
		section: '1',
		allowedGroup: 'CSS 2 A(48)',
		day: 'พ.',
		start: '10.30',
		end: '12.30',
		classroom: 'SCL703',
		createdAt: '2020-05-21T18:09:43.849Z',
		updatedAt: '2020-05-21T18:09:43.849Z',
		courseData: {
			id: 197,
			courseID: 'CSS227',
			courseName: 'WEB PROGRAMMING',
			required: 'CSS112/CSS114',
			credit: 3,
			createdAt: '2020-05-21T18:09:21.754Z',
			updatedAt: '2020-05-21T18:09:21.754Z'
		},
		consequence_data: {
			id: 1525,
			courseID: 'CSS227',
			semester: 2,
			totalSeat: 50,
			section: '1',
			allowedGroup: 'OTHER (0)',
			day: 'พ.',
			start: '08.30',
			end: '10.30',
			classroom: 'SCL602',
			createdAt: '2020-05-21T18:09:43.849Z',
			updatedAt: '2020-05-21T18:09:43.849Z',
			courseData: {
				id: 197,
				courseID: 'CSS227',
				courseName: 'WEB PROGRAMMING',
				required: 'CSS112/CSS114',
				credit: 3,
				createdAt: '2020-05-21T18:09:21.754Z',
				updatedAt: '2020-05-21T18:09:21.754Z'
			}
		}
	},
	{
		id: 1568,
		courseID: 'CSS499',
		semester: 2,
		totalSeat: 30,
		section: '1',
		allowedGroup: 'CSS 4 A(0)',
		day: 'พ.',
		start: '08.30',
		end: '11.30',
		classroom: 'SCL607',
		createdAt: '2020-05-21T18:09:43.849Z',
		updatedAt: '2020-05-21T18:09:43.849Z',
		courseData: {
			id: 217,
			courseID: 'CSS499',
			courseName: 'SPECIAL TOPICS III : DIGITAL STARTUP',
			required: null,
			credit: 3,
			createdAt: '2020-05-21T18:09:21.754Z',
			updatedAt: '2020-05-21T18:09:21.754Z'
		}
	},
	{
		id: 1690,
		courseID: 'MTH494',
		semester: 2,
		totalSeat: 10,
		section: '1',
		allowedGroup: 'OTHER (0)',
		day: 'พ.',
		start: '09.00',
		end: '12.00',
		classroom: 'SC2216',
		createdAt: '2020-05-21T18:09:43.849Z',
		updatedAt: '2020-05-21T18:09:43.849Z',
		courseData: {
			id: 239,
			courseID: 'MTH494',
			courseName: 'SPECIAL TOPICS IV : STATISTICAL CONSULTING',
			required: null,
			credit: 3,
			createdAt: '2020-05-21T18:09:21.754Z',
			updatedAt: '2020-05-21T18:09:21.754Z'
		}
	}
];
// ────────────────────────────────────────────────────────────────────────────────

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const Schedule = inject('authStore')(
	observer(
		class Schedule extends Component {
			constructor(props) {
				super(props);
				this.state = {
					// Yet still empty
					schedule_courses: [],
					_delete: false,
					panel_visible: false,
					panel_extra: [],
					filter: 'All'
				};
				this.onSelectTimelineInSchedule = this.onSelectTimelineInSchedule.bind(this);
				this.onDeleteAssignedCourse = this.onDeleteAssignedCourse.bind(this);
				this.onClosePanel = this.onClosePanel.bind(this);
				this.onAssignCourse = this.onAssignCourse.bind(this);
				this.assignCourse = this.assignCourse.bind(this);
				this.onChangeFilter = this.onChangeFilter.bind(this);
			}
			async fetchUserScheduleData() {
				try {
					const _res = await axios.get('/api/courses/myschedule');
					const _schedule_data = _res.data.data;
					this.setState({ schedule_courses: _schedule_data });
				} catch (error) {
					//@TODO show errors messages
					console.log(error.response.data);
				}
			}
			componentDidMount() {
				this.fetchUserScheduleData();
			}
			async onSelectTimelineInSchedule(day, start_time) {
				await sleep(200);
				if (this.state._delete) return;
				const { schedule_courses } = this.state;
				console.log('[DEBUG]: day = ' + day + ', start_time = ' + start_time);

				//
				// ─── TIME SLOT AVAILABLE CALCULATION ─────────────────────────────
				//
				// @ Iterating over the courses data by using every instead of forEach (Performance increment [ The iteration can be stopped ])
				// @ REQUIRE 2 - CUSTOM MADE UTIL (minusHourExactNoAdditionalMinuteRemain,addHourExactNoAdditionalMinuteRemain) Created 8 Implemented by Thiti Mahawannakit
				// @ This took me like 3 hrs to implement lel
				// calculating available time in the selected slot
				let safe_start_time = false,
					safe_stop_time = false;

				// Finding safestart
				let decrement = -1;
				while (!safe_start_time) {
					decrement = decrement + 1;
					const tranversal_started_time = minusHourExactNoAdditionalMinuteRemain(start_time, decrement);
					const tranversal_boundary = addHourExactNoAdditionalMinuteRemain(tranversal_started_time, 1);
					// Check if no before subject til the start of the day
					if (tranversal_started_time <= '08.00') {
						safe_start_time = '08.00';
					}
					schedule_courses.every((courseData, index) => {
						if (day === courseData.day) {
							// do calc phase
							if (courseData.end >= tranversal_started_time && courseData.end <= tranversal_boundary) {
								safe_start_time = courseData.end;
								return false; //false to stop the loop
							}
						}
						return true; // true to keep going
					});
				}

				let increment = -1;
				while (!safe_stop_time) {
					increment = increment + 1;
					const tranversal_started_time = addHourExactNoAdditionalMinuteRemain(safe_start_time, increment);
					const tranversal_boundary = addHourExactNoAdditionalMinuteRemain(tranversal_started_time, 1);
					// Check if no subject til the end of the day
					if (tranversal_started_time >= '18.00') {
						safe_stop_time = '18.00';
					}
					schedule_courses.every((courseData, index) => {
						if (day === courseData.day) {
							// do calc phase
							if (
								courseData.start >= tranversal_started_time &&
								courseData.start <= tranversal_boundary
							) {
								safe_stop_time = courseData.start;
								return false; //false to stop the loop
							}
						}
						return true; // true to keep going
					});
				}

				// ─────────────────────────────────────────────────────────────────
				console.log(safe_start_time);
				console.log(safe_stop_time);

				try {
					const _res = await axios.get(
						`/api/courses/getavailablebetweentime?start=${safe_start_time}&end=${safe_stop_time}&day=${day}`
					);
					this.setState({ panel_visible: true, panel_extra: _res.data.data, filter: 'All' });
				} catch (error) {
					//@TODO show error message
					console.log(error.response.data);
				}
			}
			async onDeleteAssignedCourse(c_id) {
				console.log('[DEBUG]: Trying to delete course ' + c_id);
				this.setState({ _delete: true }); // prevent get available course at time from calling
				setTimeout(() => {
					this.setState({ _delete: false }); // debounce
				}, 500);

				let _this = this;
				confirm({
					title: `Do you want to remove ${c_id}?`,
					icon: <ExclamationCircleOutlined />,
					content: 'Removing schedule course can be done without causing any conflicts',
					onOk() {
						return new Promise(async (resolve, reject) => {
							try {
								const _res = await axios.delete(`/api/courses/${c_id}/assign`);

								// If succesfully deleted
								_this.fetchUserScheduleData(); // re-fetch the user scheduled
								resolve();
								message.success(`Successfully removed ${c_id} from your schedule`);
							} catch (error) {
								//@TODO show error message
								console.log(error);
								reject(`Error in deleting course`);
							}
						}).catch(() => console.log('Oops errors!'));
					},
					onCancel() {}
				});
			}
			async assignCourse(c_id, section, start, end, day) {
				console.log('[ASSIGN]: CID: ' + c_id + ' SECTION: ' + section);
				try {
					const _res = await axios.post(`/api/courses/${c_id}/assign`, { section, start, end, day });

					// If assgin successfully
					this.fetchUserScheduleData(); // re-fetch the user scheduled
					this.onClosePanel();
					message.success(`Successfully added ${c_id} to your schedule`);
				} catch (error) {}
			}
			async onAssignCourse(c_id, section, start, end, day) {
				console.log('[DEBUG]: Trying to schedule ' + c_id + ' section ' + section + ' Day : ' + day);

				//
				// ─── CHECKING FOR CONSEQUENCE ────────────────────────────────────
				//
				try {
					const _res = await axios.get(
						`/api/courses/getSpecificCourseWithConsequence/${c_id}?section=${section}&start=${start}&stop=${end}&day=${day}`
					);
					const consequence = _res.data.data;
					if (consequence) {
						const { is_free } = _res.data;
						console.log('[DEBUG]: Found consequence, user free => ' + is_free);
						console.log(consequence);
						if (is_free) {
							this.assignCourse(c_id, section, start, end, day); // assign the course because user is free => no need to show modal message
						} else {
							// If user is not free for consequence course
							Modal.error({
								title: 'Cannot assign for course',
								content: (
									<React.Fragment>
										<p>This course require available for sequence of class below</p>
										<Badge
											color="green"
											text={`${consequence.day} ${consequence.start} ${consequence.end} ${consequence.classroom}`}
										/>
									</React.Fragment>
								)
							});
						}
					} else {
						console.log('[DEBUG]: No consequence found');
						this.assignCourse(c_id, section, start, end, day);
					}
				} catch (error) {
					//@TODO show error message
					console.log(error);
				}
				// ─────────────────────────────────────────────────────────────────
			}
			onClosePanel() {
				this.setState({ panel_visible: false });
			}
			onChangeFilter(e) {
				const { value } = e.target;
				console.log('[FILTER]: Looking for ' + value);
				this.setState({ filter: value });
			}
			render() {
				const { schedule_courses, panel_visible, panel_extra, filter } = this.state;
				let year = '',
					semester = '',
					studentGroup = '';
				if (this.props.authStore.userData) {
					year = this.props.authStore.userData.year;
					semester = this.props.authStore.userData.semester;
					studentGroup = this.props.authStore.userData.studentGroup;
				}
				// Filter
				let filtered_panel_extra;
				if (filter !== 'All') {
					filtered_panel_extra = panel_extra.filter((data) => {
						if (data.courseID.includes(filter)) return true;
						return false;
					});
				} else {
					// No filter at all
					filtered_panel_extra = panel_extra;
				}
				//
				return (
					<React.Fragment>
						<GlobalStyle />
						<Outer_Holder>
							<Drawer
								width={500}
								title="Available Courses"
								placement="right"
								closable={true}
								onClose={this.onClosePanel}
								visible={panel_visible}
								key="right"
							>
								<Radio.Group
									value={filter}
									defaultValue="All"
									buttonStyle="solid"
									onChange={this.onChangeFilter}
								>
									<Radio.Button value="All">
										{' '}
										<a>
											<BookFilled /> All
										</a>
									</Radio.Button>
									<Radio.Button value={studentGroup}>
										{' '}
										<a>
											<BookFilled /> {studentGroup}
										</a>
									</Radio.Button>
									<Radio.Button value="LNG">
										{' '}
										<a>
											<BookFilled /> LNG
										</a>
									</Radio.Button>
									<Radio.Button value="MTH">
										{' '}
										<a>
											<BookFilled /> MTH
										</a>
									</Radio.Button>
									<Radio.Button value="GEN">
										{' '}
										<a>
											<BookFilled /> GEN
										</a>
									</Radio.Button>
									<Radio.Button value="SSC">
										{' '}
										<a>
											<BookFilled /> SSC
										</a>
									</Radio.Button>
								</Radio.Group>
								<List
									size="large"
									bordered
									dataSource={filtered_panel_extra}
									renderItem={(data) => (
										<List.Item>
											<span>
												<Tag color="#108ee9">section:{data.section}</Tag>
											</span>
											{`${data.courseID} ${data.courseData.courseName}`}
											<br />
											<Badge
												color="green"
												text={`${data.day} ${data.start} ${data.end} ${data.classroom}`}
											/>
											{data.consequence_data ? (
												<React.Fragment>
													<br />
													<Badge
														color="green"
														text={`${data.consequence_data.day} ${data.consequence_data
															.start} ${data.consequence_data.end} ${data.consequence_data
															.classroom}`}
													/>
												</React.Fragment>
											) : null}
											<br />
											<div style={{ textAlign: 'right' }}>
												<Button
													type="ghost"
													onClick={() =>
														this.onAssignCourse(
															data.courseID,
															data.section,
															data.start,
															data.end,
															data.day
														)}
												>
													Pick course
												</Button>
											</div>
										</List.Item>
									)}
								/>
							</Drawer>
							<Breadcrumb_Render history={this.props.history} />
							<PageHeaderMain>
								<Schedule_Holder>
									<Custom_Semester_Info style={{ textAlign: 'center' }}>
										Year {year} Semester {semester}
									</Custom_Semester_Info>
									<Custom_Top_Table>
										<thead>
											<tr>
												<Custom_Main_Th>My schedule</Custom_Main_Th>
											</tr>
										</thead>
									</Custom_Top_Table>
									<Custom_Table>
										<thead>
											<tr>
												<Custom_Th>Day</Custom_Th>
												<Custom_Th>08.00 AM</Custom_Th>
												<Custom_Th>09.00 AM</Custom_Th>
												<Custom_Th>10.00 AM</Custom_Th>
												<Custom_Th>11.00 AM</Custom_Th>
												<Custom_Th>12.00 PM</Custom_Th>
												<Custom_Th>1.00 PM</Custom_Th>
												<Custom_Th>2.00 PM</Custom_Th>
												<Custom_Th>3.00 PM</Custom_Th>
												<Custom_Th>4.00 PM</Custom_Th>
												<Custom_Th>5.00 PM</Custom_Th>
												<Custom_Th>6.00 PM</Custom_Th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<Custom_Day_Td>Monday</Custom_Day_Td>
												{normal_time_slot.map((value, index) => {
													if (index === 0) {
														return (
															<Custom_Td
																onClick={() =>
																	this.onSelectTimelineInSchedule('จ.', value[1])}
															>
																<Day_Time_Holder>
																	{schedule_courses.map((courseData) => {
																		if (courseData.day === 'จ.') {
																			return (
																				<React.Fragment>
																					<Popover
																						content={
																							<div>
																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#76DA6B">
																											time:
																										</Tag>
																									</span>
																									{`${courseData.start} - ${courseData.end}`}
																								</div>
																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#bababa">
																											section:
																										</Tag>
																									</span>
																									{courseData.section}
																								</div>

																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#108ee9">
																											room:
																										</Tag>
																									</span>
																									{
																										courseData.classroom
																									}
																								</div>
																							</div>
																						}
																					>
																						<Day_Time_Inside
																							onClick={() =>
																								this.onDeleteAssignedCourse(
																									courseData.courseID
																								)}
																							hour={courseData.duration}
																							start={courseData.start}
																							end={courseData.end}
																						>
																							<Day_Time_Course_Name>
																								{courseData.courseID +
																									' ' +
																									courseData
																										.courseData
																										.courseName}
																							</Day_Time_Course_Name>
																						</Day_Time_Inside>
																					</Popover>
																				</React.Fragment>
																			);
																		}
																	})}
																</Day_Time_Holder>
															</Custom_Td>
														);
													} else {
														return (
															<Custom_Td
																onClick={() =>
																	this.onSelectTimelineInSchedule('จ.', value[1])}
															/>
														);
													}
												})}
											</tr>
											<tr>
												<Custom_Day_Td>Tuesday</Custom_Day_Td>
												{normal_time_slot.map((value, index) => {
													if (index === 0) {
														return (
															<Custom_Td
																onClick={() =>
																	this.onSelectTimelineInSchedule('อ.', value[1])}
															>
																<Day_Time_Holder>
																	{schedule_courses.map((courseData) => {
																		if (courseData.day === 'อ.') {
																			return (
																				<React.Fragment>
																					<Popover
																						content={
																							<div>
																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#76DA6B">
																											time:
																										</Tag>
																									</span>
																									{`${courseData.start} - ${courseData.end}`}
																								</div>
																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#bababa">
																											section:
																										</Tag>
																									</span>
																									{courseData.section}
																								</div>

																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#108ee9">
																											room:
																										</Tag>
																									</span>
																									{
																										courseData.classroom
																									}
																								</div>
																							</div>
																						}
																					>
																						<Day_Time_Inside
																							onClick={() =>
																								this.onDeleteAssignedCourse(
																									courseData.courseID
																								)}
																							hour={courseData.duration}
																							start={courseData.start}
																							end={courseData.end}
																						>
																							<Day_Time_Course_Name>
																								{courseData.courseID +
																									' ' +
																									courseData
																										.courseData
																										.courseName}
																							</Day_Time_Course_Name>
																						</Day_Time_Inside>
																					</Popover>
																				</React.Fragment>
																			);
																		}
																	})}
																</Day_Time_Holder>
															</Custom_Td>
														);
													} else {
														return (
															<Custom_Td
																onClick={() =>
																	this.onSelectTimelineInSchedule('อ.', value[1])}
															/>
														);
													}
												})}
											</tr>
											<tr>
												<Custom_Day_Td>Wednesday</Custom_Day_Td>
												{normal_time_slot.map((value, index) => {
													if (index === 0) {
														return (
															<Custom_Td
																onClick={() =>
																	this.onSelectTimelineInSchedule('พ.', value[1])}
															>
																<Day_Time_Holder>
																	{schedule_courses.map((courseData) => {
																		if (courseData.day === 'พ.') {
																			return (
																				<React.Fragment>
																					<Popover
																						content={
																							<div>
																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#76DA6B">
																											time:
																										</Tag>
																									</span>
																									{`${courseData.start} - ${courseData.end}`}
																								</div>
																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#bababa">
																											section:
																										</Tag>
																									</span>
																									{courseData.section}
																								</div>

																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#108ee9">
																											room:
																										</Tag>
																									</span>
																									{
																										courseData.classroom
																									}
																								</div>
																							</div>
																						}
																					>
																						<Day_Time_Inside
																							onClick={() =>
																								this.onDeleteAssignedCourse(
																									courseData.courseID
																								)}
																							hour={courseData.duration}
																							start={courseData.start}
																							end={courseData.end}
																						>
																							<Day_Time_Course_Name>
																								{courseData.courseID +
																									' ' +
																									courseData
																										.courseData
																										.courseName}
																							</Day_Time_Course_Name>
																						</Day_Time_Inside>
																					</Popover>
																				</React.Fragment>
																			);
																		}
																	})}
																</Day_Time_Holder>
															</Custom_Td>
														);
													} else {
														return (
															<Custom_Td
																onClick={() =>
																	this.onSelectTimelineInSchedule('พ.', value[1])}
															/>
														);
													}
												})}
											</tr>
											<tr>
												<Custom_Day_Td>Thursday</Custom_Day_Td>
												{normal_time_slot.map((value, index) => {
													if (index === 0) {
														return (
															<Custom_Td
																onClick={() =>
																	this.onSelectTimelineInSchedule('พฤ.', value[1])}
															>
																<Day_Time_Holder>
																	{schedule_courses.map((courseData) => {
																		if (courseData.day === 'พฤ.') {
																			return (
																				<React.Fragment>
																					<Popover
																						content={
																							<div>
																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#76DA6B">
																											time:
																										</Tag>
																									</span>
																									{`${courseData.start} - ${courseData.end}`}
																								</div>
																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#bababa">
																											section:
																										</Tag>
																									</span>
																									{courseData.section}
																								</div>

																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#108ee9">
																											room:
																										</Tag>
																									</span>
																									{
																										courseData.classroom
																									}
																								</div>
																							</div>
																						}
																					>
																						<Day_Time_Inside
																							onClick={() =>
																								this.onDeleteAssignedCourse(
																									courseData.courseID
																								)}
																							hour={courseData.duration}
																							start={courseData.start}
																							end={courseData.end}
																						>
																							<Day_Time_Course_Name>
																								{courseData.courseID +
																									' ' +
																									courseData
																										.courseData
																										.courseName}
																							</Day_Time_Course_Name>
																						</Day_Time_Inside>
																					</Popover>
																				</React.Fragment>
																			);
																		}
																	})}
																</Day_Time_Holder>
															</Custom_Td>
														);
													} else {
														return (
															<Custom_Td
																onClick={() =>
																	this.onSelectTimelineInSchedule('พฤ.', value[1])}
															/>
														);
													}
												})}
											</tr>
											<tr>
												<Custom_Day_Td>Friday</Custom_Day_Td>
												{normal_time_slot.map((value, index) => {
													if (index === 0) {
														return (
															<Custom_Td
																onClick={() =>
																	this.onSelectTimelineInSchedule('ศ.', value[1])}
															>
																<Day_Time_Holder>
																	{schedule_courses.map((courseData) => {
																		if (courseData.day === 'ศ.') {
																			return (
																				<React.Fragment>
																					<Popover
																						content={
																							<div>
																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#76DA6B">
																											time:
																										</Tag>
																									</span>
																									{`${courseData.start} - ${courseData.end}`}
																								</div>
																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#bababa">
																											section:
																										</Tag>
																									</span>
																									{courseData.section}
																								</div>

																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#108ee9">
																											room:
																										</Tag>
																									</span>
																									{
																										courseData.classroom
																									}
																								</div>
																							</div>
																						}
																					>
																						<Day_Time_Inside
																							onClick={() =>
																								this.onDeleteAssignedCourse(
																									courseData.courseID
																								)}
																							hour={courseData.duration}
																							start={courseData.start}
																							end={courseData.end}
																						>
																							<Day_Time_Course_Name>
																								{courseData.courseID +
																									' ' +
																									courseData
																										.courseData
																										.courseName}
																							</Day_Time_Course_Name>
																						</Day_Time_Inside>
																					</Popover>
																				</React.Fragment>
																			);
																		}
																	})}
																</Day_Time_Holder>
															</Custom_Td>
														);
													} else {
														return (
															<Custom_Td
																onClick={() =>
																	this.onSelectTimelineInSchedule('ศ.', value[1])}
															/>
														);
													}
												})}
											</tr>
											<tr>
												<Custom_Day_Td>Saturday</Custom_Day_Td>
												{normal_time_slot.map((value, index) => {
													if (index === 0) {
														return (
															<Custom_Td
																onClick={() =>
																	this.onSelectTimelineInSchedule('ส.', value[1])}
															>
																<Day_Time_Holder>
																	{schedule_courses.map((courseData) => {
																		if (courseData.day === 'ส.') {
																			return (
																				<React.Fragment>
																					<Popover
																						content={
																							<div>
																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#76DA6B">
																											time:
																										</Tag>
																									</span>
																									{`${courseData.start} - ${courseData.end}`}
																								</div>
																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#bababa">
																											section:
																										</Tag>
																									</span>
																									{courseData.section}
																								</div>

																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#108ee9">
																											room:
																										</Tag>
																									</span>
																									{
																										courseData.classroom
																									}
																								</div>
																							</div>
																						}
																					>
																						<Day_Time_Inside
																							onClick={() =>
																								this.onDeleteAssignedCourse(
																									courseData.courseID
																								)}
																							hour={courseData.duration}
																							start={courseData.start}
																							end={courseData.end}
																						>
																							<Day_Time_Course_Name>
																								{courseData.courseID +
																									' ' +
																									courseData
																										.courseData
																										.courseName}
																							</Day_Time_Course_Name>
																						</Day_Time_Inside>
																					</Popover>
																				</React.Fragment>
																			);
																		}
																	})}
																</Day_Time_Holder>
															</Custom_Td>
														);
													} else {
														return (
															<Custom_Td
																onClick={() =>
																	this.onSelectTimelineInSchedule('ส.', value[1])}
															/>
														);
													}
												})}
											</tr>
											<tr>
												<Custom_Day_Td>Sunday</Custom_Day_Td>
												{normal_time_slot.map((value, index) => {
													if (index === 0) {
														return (
															<Custom_Td
																onClick={() =>
																	this.onSelectTimelineInSchedule('อา.', value[1])}
															>
																<Day_Time_Holder>
																	{schedule_courses.map((courseData) => {
																		if (courseData.day === 'อา.') {
																			return (
																				<React.Fragment>
																					<Popover
																						content={
																							<div>
																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#76DA6B">
																											time:
																										</Tag>
																									</span>
																									{`${courseData.start} - ${courseData.end}`}
																								</div>
																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#bababa">
																											section:
																										</Tag>
																									</span>
																									{courseData.section}
																								</div>

																								<div
																									style={{
																										marginBottom:
																											'0.2rem'
																									}}
																								>
																									<span>
																										<Tag color="#108ee9">
																											room:
																										</Tag>
																									</span>
																									{
																										courseData.classroom
																									}
																								</div>
																							</div>
																						}
																					>
																						<Day_Time_Inside
																							onClick={() =>
																								this.onDeleteAssignedCourse(
																									courseData.courseID
																								)}
																							hour={courseData.duration}
																							start={courseData.start}
																							end={courseData.end}
																						>
																							<Day_Time_Course_Name>
																								{courseData.courseID +
																									' ' +
																									courseData
																										.courseData
																										.courseName}
																							</Day_Time_Course_Name>
																						</Day_Time_Inside>
																					</Popover>
																				</React.Fragment>
																			);
																		}
																	})}
																</Day_Time_Holder>
															</Custom_Td>
														);
													} else {
														return (
															<Custom_Td
																onClick={() =>
																	this.onSelectTimelineInSchedule('อา.', value[1])}
															/>
														);
													}
												})}
											</tr>
										</tbody>
									</Custom_Table>
									<Custom_Bottom_Table>
										<thead>
											<tr>
												<Custom_Main_Th>Ⓒ Copyright by SchedularizationV2</Custom_Main_Th>
											</tr>
										</thead>
									</Custom_Bottom_Table>
								</Schedule_Holder>
							</PageHeaderMain>
						</Outer_Holder>
					</React.Fragment>
				);
			}
		}
	)
);

export default Schedule;
