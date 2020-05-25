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
import axios from 'axios';

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

const _learnedCourses = 'CSS112,CSS226';

function isBothArrayContainsTheSameElement(ar1, ar2) {
	return ar1.sort().join(',') === ar2.sort().join(',');
}

function mapArrayObjectToArrayWithStringKey(arr) {
	return arr.reduce((prev, data) => {
		return prev.concat(data.courseID);
	}, []);
}

//
// ─── CONSTRANT ──────────────────────────────────────────────────────────────────
//
const RENDER_TIMEOUT_AFTER_TYPED = 1 * 1000; // 1.5 seconds ( DEFAULT ) // 1 seconds not recommend for mobile devices
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── EMBED SUB CLASS ────────────────────────────────────────────────────────────
//
class CoursesListWrapper extends Component {
	constructor(props) {
		super(props);
	}
	UNSAFE_componentWillReceiveProps(nextProps) {
		// Checkboth if that exist // or use remove until no text left
		if (nextProps.search_str || nextProps.search_str == '') {
			if (!this.reRenderTimeout) {
				this.reRenderTimeout = setTimeout(() => {
					this.reRenderTimeout = null;
					this.forceUpdate();
				}, RENDER_TIMEOUT_AFTER_TYPED);
			}
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		// Prevent from rendering ( Performace Stuffs)
		if (nextProps.search_str !== this.props.search_str) {
			return false;
		}
		return true;
	}
	render() {
		const { courses_data, on_drag, search_str } = this.props;
		return (
			<React.Fragment>
				{courses_data.map((data) => {
					return <CoursesList on_drag={on_drag} courseID={data.courseID} courseName={data.courseName} />;
				})}
			</React.Fragment>
		);
	}
}
// ────────────────────────────────────────────────────────────────────────────────

const CourseInitialization = inject('authStore')(
	observer(
		class CourseInitialization extends Component {
			constructor(props) {
				super(props);
				this.state = {
					allCoursesData: null,
					search_str: '',
					studiedList: [],
					cached_studiedList: null
				};
				this.addCourseToStudiedlist = this.addCourseToStudiedlist.bind(this);
				this.removeCourseFromStudiedlist = this.removeCourseFromStudiedlist.bind(this);
				this.onSearch = this.onSearch.bind(this);
				this.onDiscard = this.onDiscard.bind(this);
				this.onSaveChanges = this.onSaveChanges.bind(this);
			}
			async fetchLearnedCoursesData() {
				try {
					//console.log('[DEBUG][learnedCOurses]: ' + this.props.authStore.userData.learnedCourses);
					const _res = await axios.post('/api/users/getstudiedcoursesdatafromstring', {
						courses_plain_str: this.props.authStore.userData.learnedCourses
					});
					const _coursesData = _res.data.data;
					console.log(_coursesData);
					this.setState({ studiedList: _coursesData, cached_studiedList: _coursesData });
				} catch (error) {
					//@TODO => Showing error
					console.log(error.response.data);
				}
			}
			componentDidMount() {
				if (dummy) {
					this.setState(
						{
							allCoursesData: dummy
						},
						function() {
							this.fetchLearnedCoursesData();
						}
					);
				}
			}
			addCourseToStudiedlist(c_id, c_title) {
				console.log('[ADD-TO-LIST]: Added ' + c_title);
				this.setState((prevState) => ({
					studiedList: [
						...prevState.studiedList,
						{
							courseID: c_id,
							courseName: c_title
						}
					]
				}));
			}

			onSearch(search_str) {
				console.log('[SEARCH]: ' + search_str);
				this.setState({ search_str });
			}
			//
			// ─── CALLBACK FOR SUBCOMPONENT ───────────────────────────────────
			//

			removeCourseFromStudiedlist(c_id, key) {
				console.log('[REMOVE-FROM-LIST]: Removing ' + c_id + ', KEY: ' + key);
				this.setState((prevState) => {
					const new_array = prevState.studiedList.filter((data) => {
						return data.courseID !== c_id;
					});
					return {
						studiedList: new_array
					};
				});
			}
			onDiscard() {
				// Reset to initialize cached
				this.setState((prevState) => {
					return {
						studiedList: prevState.cached_studiedList
					};
				});
			}

			async onSaveChanges() {
				console.log('[DEBUG]: Saving changes');
				const finalized_plain_str = mapArrayObjectToArrayWithStringKey(this.state.studiedList).join(',');
				console.log(finalized_plain_str);

				try {
					const _res = await axios.put('/api/users/updateStudiedCourses', {
						courses_plain_str: finalized_plain_str
					});
					this.props.authStore.updateUserDataFromToken(_res.data.token, (successfully) => {
						// If token was successfully regenerate => setting cached to current ( temp only until next refresh )
						this.setState((prevState) => {
							return {
								cached_studiedList: prevState.studiedList
							};
						});
					});
				} catch (error) {
					//@TODO => Showing error
					console.log(error.response.data);
				}
			}

			// ─────────────────────────────────────────────────────────────────

			render() {
				const { allCoursesData, search_str, studiedList } = this.state;
				if (!allCoursesData || !this.props.authStore.userData) return null;
				const { learnedCourses } = this.props.authStore.userData;
				const _learnedCourses = learnedCourses || '';
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
				// Filtering the studied courses out
				const target = mapArrayObjectToArrayWithStringKey(studiedList).join(',');
				filtered_courseData = filtered_courseData.filter((data) => {
					return !target.includes(data.courseID);
				});
				// • • • • •

				return (
					<React.Fragment>
						<DndProvider backend={Backend}>
							<GlobalStyle />
							<Outer_Holder>
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
													onChange={(e) => this.setState({ search_str: e.target.value })}
													style={{ width: 630, alignSelf: 'center' }}
												/>
											</Custom_Center>
											<Custom_Center_X>
												{/* {filtered_courseData.map((data) => {
													return (
														<CoursesList
															on_drag={this.addCourseToStudiedlist}
															courseID={data.courseID}
															courseName={data.courseName}
														/>
													);
												})} */}
												<CoursesListWrapper
													courses_data={filtered_courseData}
													on_drag={this.addCourseToStudiedlist}
													search_str={search_str}
												/>
											</Custom_Center_X>
										</Custom_Courses_Holder>

										<CoursesStudied
											on_save={this.onSaveChanges}
											on_discard={this.onDiscard}
											on_remove={this.removeCourseFromStudiedlist}
											studied_list={studiedList}
											detect_changes={
												!isBothArrayContainsTheSameElement(
													mapArrayObjectToArrayWithStringKey(studiedList),
													_learnedCourses.split(',')
												)
											}
										/>
									</div>
								</PageHeaderMain>
							</Outer_Holder>
						</DndProvider>
					</React.Fragment>
				);
			}
		}
	)
);

export default CourseInitialization;
