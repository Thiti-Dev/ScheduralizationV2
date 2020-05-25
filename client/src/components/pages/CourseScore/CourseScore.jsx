import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

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
	Collapse,
	List,
	Input,
	Descriptions,
	Badge,
	Table,
	Space
} from 'antd';
import {
	EllipsisOutlined,
	HomeOutlined,
	UserOutlined,
	MenuOutlined,
	ScheduleOutlined,
	BookOutlined,
	CaretRightOutlined,
	FileProtectOutlined,
	StarOutlined
} from '@ant-design/icons';

// ────────────────────────────────────────────────────────────────────────────────

import styled, { createGlobalStyle } from 'styled-components';

import axios from 'axios';

//
// ─── MOCK ───────────────────────────────────────────────────────────────────────
//
import { dummy } from './_data.json';
// ────────────────────────────────────────────────────────────────────────────────

const { Header, Content, Footer } = Layout;
const { Paragraph } = Typography;
const { Search } = Input;

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
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── TABLE DEFINE ───────────────────────────────────────────────────────────────
//
const columns = [
	{
		title: 'CourseID',
		dataIndex: 'courseID',
		key: 'courseID'
	},
	{
		title: 'CourseName',
		dataIndex: 'courseName',
		key: 'courseName'
	},
	{
		title: 'Status',
		key: 'courseScoring',
		dataIndex: 'courseScoring',
		filters: [
			{
				text: 'Already scored',
				value: 'done'
			},
			{
				text: 'Waiting to be scored',
				value: 'undone'
			}
		],
		filterMultiple: false,
		onFilter: (value, record) => {
			if (value === 'undone') {
				return record.courseScoring.length === 0;
			} else {
				return record.courseScoring.length > 0;
			}
		},
		render: (scoring) => {
			console.log('here : ' + scoring);
			const color = scoring.length > 0 ? 'green' : 'volcano';
			return (
				<Tag color={color} key={scoring}>
					{scoring.length > 0 ? 'Already scored' : 'Waiting to be scored'}
				</Tag>
			);
		}
	},
	{
		title: 'Action',
		key: 'action',
		render: (text, record) => {
			const { courseID, courseScoring } = record;
			return (
				<Space size="middle">
					<a
						onClick={() => window.courseScoreComponent.giveCourseAScore(courseID, courseScoring[0])}
						href={null}
					>
						{courseScoring.length === 0 ? 'Give a score' : 'Edit a score'}
					</a>
				</Space>
			);
		}
	}
];
const data = [
	{
		courseID: 'CSS112',
		courseName: 'Exploring Computer Science',
		status: false
	},
	{
		courseID: 'CSS227',
		courseName: 'Web Programming',
		status: true
	}
];
// ────────────────────────────────────────────────────────────────────────────────

const Breadcrumb_Render = ({ history }) => (
	<Breadcrumb style={{ marginLeft: '1.5rem' }}>
		<Breadcrumb.Item href={null} onClick={() => history.push('dashboard')}>
			<MenuOutlined />
			<span>Dashboard</span>
		</Breadcrumb.Item>
		<Breadcrumb.Item>
			<StarOutlined />
			<span>Course Scoring</span>
		</Breadcrumb.Item>
	</Breadcrumb>
);

export default class CourseScore extends Component {
	constructor(props) {
		super(props);
		this.giveCourseAScore = this.giveCourseAScore.bind(this);
		window.courseScoreComponent = this; // for accessing outside class
	}
	giveCourseAScore(c_id, exist_data) {
		console.log('[DEBUG]: Give course a score, id: ' + c_id);
		console.log(exist_data);
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
						<Table
							style={{ marginTop: '2rem' }}
							columns={columns}
							dataSource={dummy}
							bordered
							size="large"
						/>
					</PageHeader>
				</Outer_Holder>
			</React.Fragment>
		);
	}
}
