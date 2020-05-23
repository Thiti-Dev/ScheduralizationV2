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
	Input
} from 'antd';
import {
	EllipsisOutlined,
	HomeOutlined,
	UserOutlined,
	MenuOutlined,
	ScheduleOutlined,
	BookOutlined,
	CaretRightOutlined,
	FileProtectOutlined
} from '@ant-design/icons';

// ────────────────────────────────────────────────────────────────────────────────

import styled, { createGlobalStyle } from 'styled-components';

//
// ─── MOCK ───────────────────────────────────────────────────────────────────────
//
import { dummy } from '../Courses/_data.json';
// ────────────────────────────────────────────────────────────────────────────────

import CoursesStudied from './CoursesStudied';
import CoursesList from './CoursesList';

//
// ─── DND ────────────────────────────────────────────────────────────────────────
//
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
// ────────────────────────────────────────────────────────────────────────────────

const { Header, Content, Footer } = Layout;
const { Paragraph } = Typography;
const { Panel } = Collapse;
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

const Custom_Courses_Holder = styled.div`
	position: relative;
	width: 50rem;
	height: 45rem;
	/* background-color: aquamarine; */
	/* overflow-y: scroll; */
	margin-right: 4rem;
`;

const Custom_Description_Header = styled.p`
	font-family: Rajdhani;
	font-size: 2.1rem;
	text-align: center;
`;

const Custom_Center_X = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-direction: column;
	overflow-y: auto;
	height: 80%;

	/* width */
	::-webkit-scrollbar {
		width: 10px;
	}

	/* Track */
	::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 20px;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
`;

const Custom_Center = styled.div`
	display: flex;
	justify-content: center;
	margin-bottom: 2rem;
`;

// ────────────────────────────────────────────────────────────────────────────────

const Breadcrumb_Render = ({ history }) => (
	<Breadcrumb style={{ marginLeft: '1.5rem' }}>
		<Breadcrumb.Item href={null} onClick={() => history.push('dashboard')}>
			<MenuOutlined />
			<span>Dashboard</span>
		</Breadcrumb.Item>
		<Breadcrumb.Item>
			<FileProtectOutlined />
			<span>Course initialization</span>
		</Breadcrumb.Item>
	</Breadcrumb>
);

export default class CourseInitialization extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allCoursesData: null,
			search_str: ''
		};
		this.addCourseToStudiedlist = this.addCourseToStudiedlist.bind(this);
		this.onSearch = this.onSearch.bind(this);
	}
	componentDidMount() {
		if (dummy) {
			this.setState({ allCoursesData: dummy });
		}
	}
	addCourseToStudiedlist(title) {
		console.log('[ADD-TO-LIST]: Added ' + title);
	}
	onSearch(search_str) {
		console.log('[SEARCH]: ' + search_str);
		this.setState({ search_str });
	}
	render() {
		const { allCoursesData, search_str } = this.state;
		if (!allCoursesData) return null;
		let filtered_courseData;
		if (search_str) {
			let _search_str = search_str.toLowerCase();
			filtered_courseData = allCoursesData.filter((data) => {
				let _courseID = data.courseID.toLowerCase();
				let _courseName = data.courseName.toLowerCase();
				if (_courseID.includes(_search_str) || _courseName.includes(_search_str)) {
					return true;
				}
				return false;
			});
		} else {
			filtered_courseData = allCoursesData;
		}
		return (
			<React.Fragment>
				<DndProvider backend={Backend}>
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
							<div
								style={{
									marginTop: '3rem',
									display: 'flex',
									justifyContent: 'center'
								}}
							>
								<Custom_Courses_Holder>
									<Custom_Description_Header>
										Courses that haven't been studied
									</Custom_Description_Header>
									<Custom_Center>
										<Search
											size="large"
											placeholder="คีย์เวิร์ดที่ต้องการจะค้นหา Ex.CSSXXX"
											onSearch={this.onSearch}
											style={{ width: 390, alignSelf: 'center' }}
										/>
									</Custom_Center>
									<Custom_Center_X>
										{filtered_courseData.map((data) => {
											return (
												<CoursesList
													on_drag={this.addCourseToStudiedlist}
													title={`${data.courseID} ${data.courseName}`}
												/>
											);
										})}
									</Custom_Center_X>
								</Custom_Courses_Holder>

								<CoursesStudied />
							</div>
						</PageHeader>
					</Outer_Holder>
				</DndProvider>
			</React.Fragment>
		);
	}
}
