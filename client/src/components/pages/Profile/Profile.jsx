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
	Space,
	Form,
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
	FileProtectOutlined,
	StarOutlined
} from '@ant-design/icons';

// ────────────────────────────────────────────────────────────────────────────────

import styled, { createGlobalStyle } from 'styled-components';

import axios from 'axios';

//
// ─── SUB ────────────────────────────────────────────────────────────────────────
//
//import ScorePanel from './ScorePanel';
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── HEADER ─────────────────────────────────────────────────────────────────────
//
import PageHeaderMain from '../../common/PageHeaderMain';
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

const Form_Holder = styled.div`
	position: absolute;
	left: 50%;
	transform: translate(-50%, 0);
	width: 50rem;
	margin-top: 5rem;
`;

// ────────────────────────────────────────────────────────────────────────────────

const Breadcrumb_Render = ({ history }) => (
	<Breadcrumb style={{ marginLeft: '1.5rem' }}>
		<Breadcrumb.Item href={null} onClick={() => history.push('/dashboard')}>
			<MenuOutlined />
			<span>Dashboard</span>
		</Breadcrumb.Item>
		<Breadcrumb.Item>
			<UserOutlined />
			<span>Profile</span>
		</Breadcrumb.Item>
	</Breadcrumb>
);

const Profile = inject('authStore')(
	observer(
		class Profile extends Component {
			constructor(props) {
				super(props);
				this.formRef = React.createRef();
			}
			render() {
				const {
					firstName,
					lastName,
					year,
					semester,
					studentGroup,
					email,
					studentID
				} = this.props.authStore.userData;
				return (
					<React.Fragment>
						<GlobalStyle />
						<Outer_Holder>
							<Breadcrumb_Render history={this.props.history} />
							<PageHeaderMain>
								<Form_Holder>
									<Form
										ref={this.formRef}
										labelCol={{ span: 4 }}
										// wrapperCol={{ span: 8 }}
										layout="horizontal"
									>
										<Form.Item label="Email">
											<Input value={email} disabled />
										</Form.Item>
										<Form.Item label="First name">
											<Input value={firstName} disabled />
										</Form.Item>
										<Form.Item label="Last name">
											<Input value={lastName} disabled />
										</Form.Item>
										<Form.Item label="Student ID">
											<Input value={studentID} disabled />
										</Form.Item>
										<Form.Item label="Year">
											<Radio.Group defaultValue={year} size="large" value={year}>
												<Radio.Button value={1}>1</Radio.Button>
												<Radio.Button value={2}>2</Radio.Button>
												<Radio.Button value={3}>3</Radio.Button>
												<Radio.Button value={4}>4</Radio.Button>
											</Radio.Group>
										</Form.Item>
										<Form.Item label="Semester">
											<Radio.Group defaultValue={semester} size="large" value={semester}>
												<Radio.Button value={1}>1</Radio.Button>
												<Radio.Button value={2}>2</Radio.Button>
											</Radio.Group>
										</Form.Item>
										<Form.Item label="Major abbreviation">
											<Input value={studentGroup} disabled />
										</Form.Item>
									</Form>
								</Form_Holder>
							</PageHeaderMain>
						</Outer_Holder>
					</React.Fragment>
				);
			}
		}
	)
);

export default Profile;
