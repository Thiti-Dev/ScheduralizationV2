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
	width: ${(props) =>
		`${(!isHavingDecimalPlaceThatGreaterThanZero(props.hour) ? props.hour : props.hour + 0.2) * 60 * 0.148}rem`};
	height: 3.6rem;
	line-height: 3.6rem;
	/* text-align: left; */
	border-radius: 10rem;
	margin-left: ${(props) =>
		`${(!isHavingDecimalPlaceThatGreaterThanZero(props.start - 8) ? props.start - 8 : props.start - 8 + 0.2) *
			60 *
			0.148}rem`};

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
	[ '08.00 AM', 8.0 ],
	[ '09.00 AM', 9.0 ],
	[ '10.00 AM', 10.0 ],
	[ '11.00 AM', 11.0 ],
	[ '12.00 PM', 12.0 ],
	[ '1.00 PM', 13.0 ],
	[ '2.00 PM', 14.0 ],
	[ '3.00 PM', 15.0 ],
	[ '4.00 PM', 16.0 ],
	[ '5.00 PM', 17.0 ],
	[ '6.00 PM', 18.0 ]
];
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── MOCK DATA ──────────────────────────────────────────────────────────────────
//

const _user_assigned_course = [
	// array of assigned courses
	{
		courseID: 'LNG220',
		courseName: 'Academic English',
		day: 1, // 1 == Monday
		start: 8.3, // 8.30 AM
		duration: 3 // 3 hours
	},
	{
		courseID: 'GEN111',
		courseName: 'Man and Ethics of Living',
		day: 1, // 1 == Monday
		start: 13.3, // 13.30 PM
		duration: 3 // 3 hours
	},
	{
		courseID: 'CSS112',
		courseName: 'Computer Programming I	',
		day: 3, // 3 == Wednesday
		start: 9,
		duration: 3
	},
	{
		courseID: 'CSS 322',
		courseName: 'System Analysis and Design	',
		day: 4, // 4 == Thursday
		start: 10.3,
		duration: 1.3
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
												<Custom_Td onClick={() => this.onSelectTimelineInSchedule(1, value[1])}>
													<Day_Time_Holder>
														{_user_assigned_course.map((courseData) => {
															if (courseData.day === 1) {
																return (
																	<React.Fragment>
																		<Day_Time_Inside
																			hour={courseData.duration}
																			start={courseData.start}
																		>
																			<Day_Time_Course_Name>
																				{courseData.courseID +
																					' ' +
																					courseData.courseName}
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
													onClick={() => this.onSelectTimelineInSchedule(1, value[1])}
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
												<Custom_Td onClick={() => this.onSelectTimelineInSchedule(2, value[1])}>
													<Day_Time_Holder>
														{_user_assigned_course.map((courseData) => {
															if (courseData.day === 2) {
																return (
																	<React.Fragment>
																		<Day_Time_Inside
																			hour={courseData.duration}
																			start={courseData.start}
																		>
																			<Day_Time_Course_Name>
																				{courseData.courseID +
																					' ' +
																					courseData.courseName}
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
													onClick={() => this.onSelectTimelineInSchedule(2, value[1])}
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
												<Custom_Td onClick={() => this.onSelectTimelineInSchedule(3, value[1])}>
													<Day_Time_Holder>
														{_user_assigned_course.map((courseData) => {
															if (courseData.day === 3) {
																return (
																	<React.Fragment>
																		<Day_Time_Inside
																			hour={courseData.duration}
																			start={courseData.start}
																		>
																			<Day_Time_Course_Name>
																				{courseData.courseID +
																					' ' +
																					courseData.courseName}
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
													onClick={() => this.onSelectTimelineInSchedule(3, value[1])}
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
												<Custom_Td onClick={() => this.onSelectTimelineInSchedule(4, value[1])}>
													<Day_Time_Holder>
														{_user_assigned_course.map((courseData) => {
															if (courseData.day === 4) {
																return (
																	<React.Fragment>
																		<Day_Time_Inside
																			hour={courseData.duration}
																			start={courseData.start}
																		>
																			<Day_Time_Course_Name>
																				{courseData.courseID +
																					' ' +
																					courseData.courseName}
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
													onClick={() => this.onSelectTimelineInSchedule(4, value[1])}
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
												<Custom_Td onClick={() => this.onSelectTimelineInSchedule(5, value[1])}>
													<Day_Time_Holder>
														{_user_assigned_course.map((courseData) => {
															if (courseData.day === 5) {
																return (
																	<React.Fragment>
																		<Day_Time_Inside
																			hour={courseData.duration}
																			start={courseData.start}
																		>
																			<Day_Time_Course_Name>
																				{courseData.courseID +
																					' ' +
																					courseData.courseName}
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
													onClick={() => this.onSelectTimelineInSchedule(5, value[1])}
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
												<Custom_Td onClick={() => this.onSelectTimelineInSchedule(6, value[1])}>
													<Day_Time_Holder>
														{_user_assigned_course.map((courseData) => {
															if (courseData.day === 6) {
																return (
																	<React.Fragment>
																		<Day_Time_Inside
																			hour={courseData.duration}
																			start={courseData.start}
																		>
																			<Day_Time_Course_Name>
																				{courseData.courseID +
																					' ' +
																					courseData.courseName}
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
													onClick={() => this.onSelectTimelineInSchedule(6, value[1])}
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
												<Custom_Td onClick={() => this.onSelectTimelineInSchedule(7, value[1])}>
													<Day_Time_Holder>
														{_user_assigned_course.map((courseData) => {
															if (courseData.day === 7) {
																return (
																	<React.Fragment>
																		<Day_Time_Inside
																			hour={courseData.duration}
																			start={courseData.start}
																		>
																			<Day_Time_Course_Name>
																				{courseData.courseID +
																					' ' +
																					courseData.courseName}
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
													onClick={() => this.onSelectTimelineInSchedule(7, value[1])}
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
					</PageHeader>
				</Outer_Holder>
			</React.Fragment>
		);
	}
}
