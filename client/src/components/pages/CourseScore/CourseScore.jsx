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

//
// ─── SUB ────────────────────────────────────────────────────────────────────────
//
import ScorePanel from './ScorePanel';
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
			const { courseID, courseName, courseScoring } = record;
			return (
				<Space size="middle">
					<a
						onClick={() =>
							window.courseScoreComponent.giveCourseAScore(courseID, courseName, courseScoring[0])}
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
		this.state = {
			panel_visible: false,
			panel_extras: null,
			course_score_data: []
		};
		this.giveCourseAScore = this.giveCourseAScore.bind(this);
		this.onClosePanel = this.onClosePanel.bind(this);
		this.onShowPanel = this.onShowPanel.bind(this);
		this.onCompleteVoted = this.onCompleteVoted.bind(this);
		window.courseScoreComponent = this; // for accessing outside class
	}
	async fetchUserScoreData() {
		try {
			const _res = await axios.get('/api/users/getstudiedcoursesdatafromstringwithscoredata');
			const _score_data = _res.data.data;
			this.setState({ course_score_data: _score_data });
		} catch (error) {
			//@TODO show error messages
			console.log(error.response.data);
		}
	}
	componentDidMount() {
		/*if (dummy) {
			this.setState({ course_score_data: dummy });
		}*/
		this.fetchUserScoreData();
	}
	giveCourseAScore(c_id, c_name, exist_data) {
		console.log('[DEBUG]: Give course a score, id: ' + c_id);
		console.log(exist_data);
		if (exist_data) {
			this.onShowPanel(c_id, c_name, exist_data);
		} else {
			this.onShowPanel(c_id, c_name);
		}
	}

	//
	// ─── CALLBACK ───────────────────────────────────────────────────────────────────
	//
	onShowPanel(c_id, c_name, exist_data = null) {
		this.setState({
			panel_visible: true,
			panel_extras: {
				courseID: c_id,
				courseName: c_name,
				exist_data
			}
		});
	}
	onClosePanel() {
		this.setState({ panel_visible: false });
	}
	onCompleteVoted(c_id, updated_data) {
		console.log('[DEBUG]: Updating ' + c_id);
		var index = this.state.course_score_data.findIndex((p) => p.courseID == c_id);
		console.log('[DEBUG]: Found index: ' + index);

		//@NOTE this is cloning the array pointer
		let cloned_data = [ ...this.state.course_score_data ];
		cloned_data[index].courseScoring[0] = updated_data; //new value
		/*this.setState({ course_score_data: cloned_data });*/
	}
	// ────────────────────────────────────────────────────────────────────────────────

	render() {
		const { panel_visible, panel_extras, course_score_data } = this.state;
		return (
			<React.Fragment>
				<GlobalStyle />
				<Outer_Holder>
					<ScorePanel
						on_close={this.onClosePanel}
						is_visible={panel_visible}
						extra={panel_extras}
						on_complete={this.onCompleteVoted}
					/>
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
							dataSource={course_score_data}
							bordered
							size="large"
						/>
					</PageHeader>
				</Outer_Holder>
			</React.Fragment>
		);
	}
}
