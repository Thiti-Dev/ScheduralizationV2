import React, { Component } from 'react';

// ─── ANTD ───────────────────────────────────────────────────────────────────────
//
import { Row, Col, Divider, Layout, Button, PageHeader, Menu, Dropdow, Tag, Typography, Breadcrumb } from 'antd';
import { EllipsisOutlined, HomeOutlined, UserOutlined, MenuOutlined, ScheduleOutlined } from '@ant-design/icons';

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

const { Header, Content, Footer } = Layout;
const { Paragraph } = Typography;

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
// ────────────────────────────────────────────────────────────────────────────────

export default class Schedule extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// Yet still empty
		};
		this.onSelectTimelineInSchedule = this.onSelectTimelineInSchedule.bind(this);
	}
	onSelectTimelineInSchedule(day, start_time) {
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
			_user_assigned_course.every((courseData, index) => {
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
			_user_assigned_course.every((courseData, index) => {
				if (day === courseData.day) {
					// do calc phase
					if (courseData.start >= tranversal_started_time && courseData.start <= tranversal_boundary) {
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
	}
	render() {
		return (
			<React.Fragment>
				<GlobalStyle />
				<Outer_Holder>
					<Breadcrumb_Render history={this.props.history} />
					<PageHeader
						title="Thiti Mahawannakit"
						className="site-page-header"
						subTitle="60090500410"
						tags={<Tag color="blue">Student</Tag>}
						extra={[
							<Button key="3">Operation</Button>,
							<Button key="2">Operation</Button>,
							<Button key="1" type="ghost" danger>
								Logout
							</Button>
						]}
						avatar={{ src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4' }}
					>
						<Schedule_Holder>
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
														onClick={() => this.onSelectTimelineInSchedule('จ.', value[1])}
													>
														<Day_Time_Holder>
															{_user_assigned_course.map((courseData) => {
																if (courseData.day === 'จ.') {
																	return (
																		<React.Fragment>
																			<Day_Time_Inside
																				hour={courseData.duration}
																				start={courseData.start}
																				end={courseData.end}
																			>
																				<Day_Time_Course_Name>
																					{courseData.courseID +
																						' ' +
																						courseData.courseData
																							.courseName}
																				</Day_Time_Course_Name>
																			</Day_Time_Inside>
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
														onClick={() => this.onSelectTimelineInSchedule('จ.', value[1])}
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
														onClick={() => this.onSelectTimelineInSchedule('อ.', value[1])}
													>
														<Day_Time_Holder>
															{_user_assigned_course.map((courseData) => {
																if (courseData.day === 'อ.') {
																	return (
																		<React.Fragment>
																			<Day_Time_Inside
																				hour={courseData.duration}
																				start={courseData.start}
																				end={courseData.end}
																			>
																				<Day_Time_Course_Name>
																					{courseData.courseID +
																						' ' +
																						courseData.courseData
																							.courseName}
																				</Day_Time_Course_Name>
																			</Day_Time_Inside>
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
														onClick={() => this.onSelectTimelineInSchedule('อ.', value[1])}
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
														onClick={() => this.onSelectTimelineInSchedule('พ.', value[1])}
													>
														<Day_Time_Holder>
															{_user_assigned_course.map((courseData) => {
																if (courseData.day === 'พ.') {
																	return (
																		<React.Fragment>
																			<Day_Time_Inside
																				hour={courseData.duration}
																				start={courseData.start}
																				end={courseData.end}
																			>
																				<Day_Time_Course_Name>
																					{courseData.courseID +
																						' ' +
																						courseData.courseData
																							.courseName}
																				</Day_Time_Course_Name>
																			</Day_Time_Inside>
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
														onClick={() => this.onSelectTimelineInSchedule('พ.', value[1])}
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
														onClick={() => this.onSelectTimelineInSchedule('พฤ.', value[1])}
													>
														<Day_Time_Holder>
															{_user_assigned_course.map((courseData) => {
																if (courseData.day === 'พฤ.') {
																	return (
																		<React.Fragment>
																			<Day_Time_Inside
																				hour={courseData.duration}
																				start={courseData.start}
																				end={courseData.end}
																			>
																				<Day_Time_Course_Name>
																					{courseData.courseID +
																						' ' +
																						courseData.courseData
																							.courseName}
																				</Day_Time_Course_Name>
																			</Day_Time_Inside>
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
														onClick={() => this.onSelectTimelineInSchedule('พฤ.', value[1])}
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
														onClick={() => this.onSelectTimelineInSchedule('ศ.', value[1])}
													>
														<Day_Time_Holder>
															{_user_assigned_course.map((courseData) => {
																if (courseData.day === 'ศ.') {
																	return (
																		<React.Fragment>
																			<Day_Time_Inside
																				hour={courseData.duration}
																				start={courseData.start}
																				end={courseData.end}
																			>
																				<Day_Time_Course_Name>
																					{courseData.courseID +
																						' ' +
																						courseData.courseData
																							.courseName}
																				</Day_Time_Course_Name>
																			</Day_Time_Inside>
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
														onClick={() => this.onSelectTimelineInSchedule('ศ.', value[1])}
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
														onClick={() => this.onSelectTimelineInSchedule('ส.', value[1])}
													>
														<Day_Time_Holder>
															{_user_assigned_course.map((courseData) => {
																if (courseData.day === 'ส.') {
																	return (
																		<React.Fragment>
																			<Day_Time_Inside
																				hour={courseData.duration}
																				start={courseData.start}
																				end={courseData.end}
																			>
																				<Day_Time_Course_Name>
																					{courseData.courseID +
																						' ' +
																						courseData.courseData
																							.courseName}
																				</Day_Time_Course_Name>
																			</Day_Time_Inside>
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
														onClick={() => this.onSelectTimelineInSchedule('ส.', value[1])}
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
														onClick={() => this.onSelectTimelineInSchedule('อา.', value[1])}
													>
														<Day_Time_Holder>
															{_user_assigned_course.map((courseData) => {
																if (courseData.day === 'อา.') {
																	return (
																		<React.Fragment>
																			<Day_Time_Inside
																				hour={courseData.duration}
																				start={courseData.start}
																				end={courseData.end}
																			>
																				<Day_Time_Course_Name>
																					{courseData.courseID +
																						' ' +
																						courseData.courseData
																							.courseName}
																				</Day_Time_Course_Name>
																			</Day_Time_Inside>
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
														onClick={() => this.onSelectTimelineInSchedule('อา.', value[1])}
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
					</PageHeader>
				</Outer_Holder>
			</React.Fragment>
		);
	}
}
