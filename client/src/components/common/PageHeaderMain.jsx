import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, Divider, Layout, Button, PageHeader, Menu, Dropdow, Tag, Typography, Breadcrumb } from 'antd';
import cookie from 'react-cookies';
const PageHeaderMain = inject('authStore')(
	observer(
		class PageHeaderMain extends Component {
			onLogout = () => {
				//  remove the user token and then refresh the page
				cookie.remove('token', { path: '/' });
				window.location.reload(false); // reloading after the cookie is removed => automatically un-authenticated and will be redirecting to the login page
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
				return (
					<PageHeader
						title={`${firstName} ${lastName}`}
						className="site-page-header"
						subTitle={studentID}
						tags={<Tag color="blue">Student</Tag>}
						extra={[
							<Button key="2">Switcher</Button>,
							<Button key="1" type="ghost" danger onClick={this.onLogout}>
								Logout
							</Button>
						]}
						avatar={{ src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4' }}
					>
						{this.props.children}
					</PageHeader>
				);
			}
		}
	)
);

export default PageHeaderMain;
