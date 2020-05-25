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
	Collapse,
	List,
	Input,
	Drawer,
	Avatar,
	Rate,
	Radio
} from 'antd';
import {
	EllipsisOutlined,
	HomeOutlined,
	UserOutlined,
	MenuOutlined,
	ScheduleOutlined,
	BookOutlined,
	CaretRightOutlined,
	StarOutlined
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

//
// ─── HEADER ─────────────────────────────────────────────────────────────────────
//
import PageHeaderMain from '../../common/PageHeaderMain';
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
			search_str: '',
			feedback_panel: false,
			filter: 0 // default
		};
		this.onViewFeedback = this.onViewFeedback.bind(this);
		this.onClose = this.onClose.bind(this);
	}
	componentDidMount() {
		console.log(dummy);
	}
	async onViewFeedback(c_id) {
		console.log('[DEBUG]: Trying to view feedback of ' + c_id);

		try {
			const _res = await axios.get(`/api/courses/score/${c_id}`);
			// Fetch successfully
			const feedback_data = _res.data.data;
			this.setState({ feedback_panel: feedback_data, filter: 0 });
		} catch (error) {
			//@TODO show error messages
			console.log(error.response.data);
		}
	}
	onClose() {
		this.setState({ feedback_panel: false });
	}
	render() {
		const { search_str, feedback_panel, filter } = this.state;
		let filtered_feedback = [];
		if (feedback_panel && filter !== 0) {
			filtered_feedback = feedback_panel.filter((data) => {
				if (data.score === filter) {
					return true;
				}
				return false;
			});
		} else {
			if (feedback_panel && filter === 0) {
				filtered_feedback = feedback_panel;
			}
		}
		return (
			<React.Fragment>
				<GlobalStyle />
				<Outer_Holder>
					<Drawer
						title="Course feedbacks"
						width={720}
						onClose={this.onClose}
						visible={feedback_panel}
						bodyStyle={{ paddingBottom: 80 }}
						footer={
							<div
								style={{
									textAlign: 'right'
								}}
							>
								<Button onClick={this.onClose} style={{ marginRight: 8 }}>
									Exit
								</Button>
							</div>
						}
					>
						<Radio.Group
							value={filter}
							defaultValue={0}
							buttonStyle="solid"
							onChange={(e) => this.setState({ filter: e.target.value })}
						>
							<Radio.Button value={0}>
								{' '}
								<a>
									<StarOutlined /> All
								</a>
							</Radio.Button>
							<Radio.Button value={5}>
								{' '}
								<a>
									<StarOutlined /> 5
								</a>
							</Radio.Button>
							<Radio.Button value={4}>
								{' '}
								<a>
									<StarOutlined /> 4
								</a>
							</Radio.Button>
							<Radio.Button value={3}>
								{' '}
								<a>
									<StarOutlined /> 3
								</a>
							</Radio.Button>
							<Radio.Button value={2}>
								{' '}
								<a>
									<StarOutlined /> 2
								</a>
							</Radio.Button>
							<Radio.Button value={1}>
								{' '}
								<a>
									<StarOutlined /> 1
								</a>
							</Radio.Button>
						</Radio.Group>
						<List
							itemLayout="horizontal"
							dataSource={filtered_feedback || []}
							renderItem={(data) => (
								<List.Item>
									<List.Item.Meta
										avatar={
											<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
										}
										title={
											<React.Fragment>
												{`${data.userData.firstName} ${data.userData.lastName}`}
												<span style={{ marginLeft: '1rem' }}>
													<Rate disabled defaultValue={data.score} />
												</span>
											</React.Fragment>
										}
										description={data.description}
									/>
								</List.Item>
							)}
						/>
					</Drawer>
					<Breadcrumb_Render history={this.props.history} />
					<PageHeaderMain
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
							<CoursesLists
								coursesData={dummy}
								search_str={search_str}
								on_view_feedback={this.onViewFeedback}
							/>
						</div>
					</PageHeaderMain>
				</Outer_Holder>
			</React.Fragment>
		);
	}
}
