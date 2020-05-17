import React, { Component } from 'react';

//
// ─── IMPORTING ASSET ────────────────────────────────────────────────────────────
//
import schedule_img from './images/schedule.png';
import profile_img from './images/profile.png';
import course_img from './images/course.png';
import course_feedback_img from './images/course-feedback.png';
import find_img from './images/find.png';
// ────────────────────────────────────────────────────────────────────────────────

// ─── ANTD ───────────────────────────────────────────────────────────────────────
//
import { Row, Col, Divider, Layout, Button, PageHeader, Menu, Dropdow, Tag, Typography } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

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

const Outer_Holder = styled.div`padding: 3rem 5rem;`;

const Action_Card_Holder = styled.div`
	padding: 3rem 3rem;
	display: flex;
	flex-wrap: wrap;
`;

const Card_Action = styled.div`
	width: 20rem;
	height: 18rem;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
	text-align: center;
	font-family: Rajdhani;

	position: relative;
	margin: 2rem;
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

//
// ─── COMPONENT RELATED ──────────────────────────────────────────────────────────
//
const routes = [
	{
		path: 'index',
		breadcrumbName: 'Dashboard'
	}
];
// ────────────────────────────────────────────────────────────────────────────────

export default class Dashboard extends Component {
	render() {
		return (
			<React.Fragment>
				<GlobalStyle />
				<Outer_Holder>
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
						breadcrumb={{ routes }}
					/>
					<Action_Card_Holder>
						<Card_Action className="hvr-grow">
							<Card_Action_Image img={schedule_img} />
							<Card_Action_Text>Manage/View Schedule</Card_Action_Text>
						</Card_Action>
						<Card_Action className="hvr-grow">
							<Card_Action_Image img={find_img} />
							<Card_Action_Text>Find people based on ur profession</Card_Action_Text>
						</Card_Action>
						<Card_Action className="hvr-grow">
							<Card_Action_Image img={course_img} />
							<Card_Action_Text>Add/Edit Studied Course</Card_Action_Text>
						</Card_Action>
						<Card_Action className="hvr-grow">
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
