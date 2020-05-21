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
	CaretRightOutlined
} from '@ant-design/icons';
// ────────────────────────────────────────────────────────────────────────────────

import styled, { createGlobalStyle } from 'styled-components';

//
// ─── MOCK ───────────────────────────────────────────────────────────────────────
//
import { dummy } from './_data.json';
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── UTIL ───────────────────────────────────────────────────────────────────────
//
import { distinctArrayOfObject, categorizedArrayOfObject } from '../../../utils/arrayHelper';
import { splitRequiredCourseToNormalizeText } from '../../../utils/stringNormalizer';
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── SUB COMPONENT ──────────────────────────────────────────────────────────────
//
import CoursesLists from './CoursesList';
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

// ────────────────────────────────────────────────────────────────────────────────

const Breadcrumb_Render = ({ history }) => (
	<Breadcrumb style={{ marginLeft: '1.5rem' }}>
		<Breadcrumb.Item href={null} onClick={() => history.push('dashboard')}>
			<MenuOutlined />
			<span>Dashboard</span>
		</Breadcrumb.Item>
		<Breadcrumb.Item>
			<BookOutlined />
			<span>View all courses</span>
		</Breadcrumb.Item>
	</Breadcrumb>
);

export default class Courses extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// none
			search_str: ''
		};
	}
	componentDidMount() {
		console.log(dummy);
	}
	render() {
		const { search_str } = this.state;
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
						<div style={{ marginTop: '3rem' }}>
							<Search
								size="large"
								placeholder="คีย์เวิร์ดที่ต้องการจะค้นหา Ex.CSSXXX"
								onSearch={(value) => console.log(value)}
								onChange={(e) => this.setState({ search_str: e.target.value })}
								style={{ width: '20rem', marginBottom: '2rem' }}
							/>
							<CoursesLists coursesData={dummy} search_str={search_str} />
						</div>
					</PageHeader>
				</Outer_Holder>
			</React.Fragment>
		);
	}
}
