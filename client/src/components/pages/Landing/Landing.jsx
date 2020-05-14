import React, { Component } from 'react';
import { Row, Col, Divider, Layout, Button } from 'antd';
import styled from 'styled-components';

//
// ─── PHOTO IMPORTING ────────────────────────────────────────────────────────────
//
import flat_schedule from './images/flat_schedule.jpg';
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── MULTI LANG SUPPORT ─────────────────────────────────────────────────────────
//
import lang_extract from '../../../messages';
// ────────────────────────────────────────────────────────────────────────────────

const { Header, Content, Footer } = Layout;

const Flat_Schedule_Image = styled.div`
	width: 100%;
	height: 100vh;
	background-image: url(${flat_schedule});
	background-size: contain;
	background-position: center;
	background-repeat: no-repeat;
`;

const Holder_Registration_Form = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

const Message_Welcoming = styled.p`
	font-size: 3rem;
	font-family: Rajdhani;
	font-weight: lighter;
	white-space: nowrap;
`;

const Button_SignIn = styled(Button)`
	margin: 1rem;
`;

export default class Register extends Component {
	render() {
		return (
			<Content>
				<Row>
					<Col xs={24} md={12}>
						<Flat_Schedule_Image />
					</Col>
					<Col xs={24} md={12}>
						<Holder_Registration_Form>
							<Message_Welcoming>{lang_extract('welcome')}</Message_Welcoming>
							<div
								style={{
									textAlign: 'center'
								}}
							>
								<Button_SignIn size="large" type="primary" ghost>
									{lang_extract('sign_in')}
								</Button_SignIn>
								<Button_SignIn size="large" type="primary" ghost>
									{lang_extract('sign_up')}
								</Button_SignIn>
							</div>
						</Holder_Registration_Form>
					</Col>
				</Row>
			</Content>
		);
	}
}
