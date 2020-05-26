import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, Divider, Layout, Button, PageHeader, Menu, Dropdow, Tag, Typography, Breadcrumb } from 'antd';
import cookie from 'react-cookies';

//
// ─── SUB COMPONENT ──────────────────────────────────────────────────────────────
//
import SwitcherModal from './SwitcherModal';
// ────────────────────────────────────────────────────────────────────────────────

const PageHeaderMain = inject('authStore')(
	observer(
		class PageHeaderMain extends Component {
			constructor(props) {
				super(props);
				this.state = {
					switcher_panel_visible: false
				};
			}

			onLogout = () => {
				//  remove the user token and then refresh the page
				cookie.remove('token', { path: '/' });
				window.location.reload(false); // reloading after the cookie is removed => automatically un-authenticated and will be redirecting to the login page
			};

			//
			// ─── CALLBACK ────────────────────────────────────────────────────
			//

			onOpenSwitcher = () => {
				this.setState({ switcher_panel_visible: true });
			};

			onCLoseSwitcher = () => {
				this.setState({ switcher_panel_visible: false });
			};

			render() {
				if (!this.props.authStore.userData) {
					console.log('fuckkkkkkkkkkk shit');
					return null;
				}
				const { year, semester, studentGroup, firstName, lastName, studentID } = this.props.authStore.userData;
				const { isAuthenticated } = this.props.authStore;
				console.log('ISAUTHENTICATED: ' + isAuthenticated);
				if (!isAuthenticated) {
					return null;
				}
				const { switcher_panel_visible } = this.state;
				return (
					<React.Fragment>
						<SwitcherModal
							visible={switcher_panel_visible}
							on_close={this.onCLoseSwitcher}
							year={year}
							semester={semester}
						/>
						<PageHeader
							title={`${firstName} ${lastName}`}
							className="site-page-header"
							subTitle={studentID}
							tags={<Tag color="blue">Student</Tag>}
							extra={[
								<Button key="2" onClick={this.onOpenSwitcher}>
									Switcher
								</Button>,
								<Button key="1" type="ghost" danger onClick={this.onLogout}>
									Logout
								</Button>
							]}
							avatar={{ src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4' }}
						>
							{this.props.children}
						</PageHeader>
					</React.Fragment>
				);
			}
		}
	)
);

export default PageHeaderMain;
