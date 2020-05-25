import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
//
// ─── IMPORTING ASSET ────────────────────────────────────────────────────────────
//
import schedule_img from './images/schedule.png';
import profile_img from './images/profile.png';
import course_img from './images/course.png';
import courses_img from './images/courses.png';
import course_feedback_img from './images/course-feedback.png';
import find_img from './images/find.png';
// ────────────────────────────────────────────────────────────────────────────────

// ─── ANTD ───────────────────────────────────────────────────────────────────────
//
import { Row, Col, Divider, Layout, Button, PageHeader, Menu, Dropdow, Tag, Typography, Breadcrumb } from 'antd';
import { EllipsisOutlined, HomeOutlined, UserOutlined, MenuOutlined, ScheduleOutlined } from '@ant-design/icons';

// ────────────────────────────────────────────────────────────────────────────────

import styled, { createGlobalStyle } from 'styled-components';

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

const Outer_Holder = styled.div`
	padding: 3rem 5rem;
	@media (max-width: 1430px) {
		/* small screen ignore centering adjust */
		width: 1430px;
	}
`;

const Action_Card_Holder = styled.div`
	padding: 3rem 3rem;
	/* display: flex;
	flex-wrap: wrap; */
`;

const Card_Action_Main = styled.div`
	width: 60rem;
	height: 20rem;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
	text-align: center;
	font-family: Rajdhani;

	position: relative;
	margin: 2rem 0rem 0rem 2rem;
	cursor: pointer;
`;

const Card_Action = styled.div`
	width: 18rem;
	height: 16rem;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
	text-align: center;
	font-family: Rajdhani;

	position: relative;
	margin: 0rem 2rem;
	cursor: pointer;
`;

const Card_Action_Image = styled.div`
	width: 100%;
	height: 80%;
	background-image: url(${(props) => props.img});
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;
`;

const Card_Action_Text = styled.p`
	font-size: 1.2rem;
	position: absolute;
	width: 100%;
	top: 85%;
`;

// ────────────────────────────────────────────────────────────────────────────────

const Breadcrumb_Render = ({ history }) => (
	<Breadcrumb style={{ marginLeft: '1.5rem' }}>
		<Breadcrumb.Item>
			<MenuOutlined />
			<span>Dashboard</span>
		</Breadcrumb.Item>
	</Breadcrumb>
);
const Dashboard = inject('rootStore')(
	observer(
		class Dashboard extends Component {
			render() {
				const { startContinous, instantProcess } = this.props.rootStore.loadingStore;
				return (
					<React.Fragment>
						<GlobalStyle />
						<Outer_Holder>
							<Breadcrumb_Render />
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
							/>
							<Action_Card_Holder>
								<Card_Action_Main
									className="hvr-grow"
									onClick={() => {
										this.props.history.push('schedule');
										instantProcess();
									}}
								>
									<Card_Action_Image img={schedule_img} />
									<Card_Action_Text>Manage/View Schedule</Card_Action_Text>
								</Card_Action_Main>
							</Action_Card_Holder>
							<Action_Card_Holder>
								<Card_Action
									className="hvr-grow"
									onClick={() => {
										this.props.history.push('courses');
										instantProcess();
									}}
								>
									<Card_Action_Image img={courses_img} />
									<Card_Action_Text>View all available courses</Card_Action_Text>
								</Card_Action>

								{/* <Card_Action className="hvr-grow">
									<Card_Action_Image img={find_img} />
									<Card_Action_Text>Find people based on ur profession</Card_Action_Text>
								</Card_Action> */}
								<Card_Action
									className="hvr-grow"
									onClick={() => {
										this.props.history.push('courseinit');
										instantProcess();
									}}
								>
									<Card_Action_Image img={course_img} />
									<Card_Action_Text>Add/Edit Studied Course</Card_Action_Text>
								</Card_Action>
								<Card_Action
									className="hvr-grow"
									onClick={() => {
										this.props.history.push('coursescore');
										instantProcess();
									}}
								>
									<Card_Action_Image img={course_feedback_img} />
									<Card_Action_Text>Course Scoring</Card_Action_Text>
								</Card_Action>
								<Card_Action className="hvr-grow">
									<Card_Action_Image img={profile_img} />
									<Card_Action_Text>View/Edit Profile</Card_Action_Text>
								</Card_Action>
							</Action_Card_Holder>
						</Outer_Holder>
					</React.Fragment>
				);
			}
		}
	)
);

export default Dashboard;
