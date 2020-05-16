import React, { Component } from 'react';

//
// ─── ANTD ───────────────────────────────────────────────────────────────────────
//
import { Row, Col, Divider, Layout, Button } from 'antd';

// ────────────────────────────────────────────────────────────────────────────────

import styled from 'styled-components';

//
// ─── MOBX ───────────────────────────────────────────────────────────────────────
//
import { inject, observer } from 'mobx-react';
// ────────────────────────────────────────────────────────────────────────────────

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

//
// ─── ANIMATION ──────────────────────────────────────────────────────────────────
//
import { Animated } from 'react-animated-css';
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── IMPORTING SUB COMPONENT ───────────────────────────────────────────────────
//
import Register from './Register';
import Login from './Login';
// ────────────────────────────────────────────────────────────────────────────────

const { Header, Content, Footer } = Layout;

const Outer_Holder = styled.div`overflow-x: hidden;`;

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
const Landing = inject('authStore')(
	observer(
		class Landing extends Component {
			constructor(props) {
				super(props);
				this.state = {
					action: 'landing',
					t_out: '',
					t_in: 'landing'
				};
				this.switchAction = this.switchAction.bind(this);
			}
			componentWillMount() {
				if (this.props.authStore.isAuthenticated) {
					console.log('[SWITCHING]: Already authenticated => no need to show landing page');
					this.props.history.push('/home');
				}
			}
			switchAction(action, safe_timeout = 1000) {
				const _old_action = this.state.action;
				this.setState({ action }, function() {
					setTimeout(() => {
						this.setState({ t_out: _old_action, t_in: action });
					}, safe_timeout);
				});
			}
			render() {
				const { action, t_out, t_in } = this.state;
				return (
					<React.Fragment>
						<Outer_Holder>
							<Animated animationIn="fadeIn" animationInDuration={2000} isVisible={true}>
								<Content>
									<Row>
										<Col xs={24} md={12}>
											<Flat_Schedule_Image />
										</Col>
										<Col xs={24} md={12}>
											<Holder_Registration_Form>
												{t_in === 'landing' ? (
													<Animated
														animationIn="fadeInRight"
														animationOut="fadeOutRight"
														animationInDuration={!t_out ? 0 : 1500}
														animationOutDuration={1000}
														isVisible={action === 'landing' ? true : false}
													>
														<Message_Welcoming>{lang_extract('welcome')}</Message_Welcoming>
														<div
															style={{
																textAlign: 'center'
															}}
														>
															<Button_SignIn
																size="large"
																type="primary"
																ghost
																onClick={() => this.switchAction('login')}
															>
																{lang_extract('sign_in')}
															</Button_SignIn>
															<Button_SignIn
																size="large"
																type="primary"
																ghost
																onClick={() => this.switchAction('register')}
															>
																{lang_extract('sign_up')}
															</Button_SignIn>
														</div>
													</Animated>
												) : null}
												{t_in === 'register' ? (
													<Animated
														animationIn="fadeInRight"
														animationOut="fadeOutRight"
														// animationInDelay={200}
														animationInDuration={1000}
														animationOutDuration={500}
														isVisible={action === 'register' ? true : false}
													>
														<Register on_switch={this.switchAction} />
													</Animated>
												) : null}
												{t_in === 'login' ? (
													<Animated
														animationIn="fadeInRight"
														animationOut="fadeOutRight"
														// animationInDelay={200}
														animationInDuration={1000}
														animationOutDuration={500}
														isVisible={action === 'login' ? true : false}
													>
														<Login on_switch={this.switchAction} />
													</Animated>
												) : null}
											</Holder_Registration_Form>
										</Col>
									</Row>
								</Content>
							</Animated>
						</Outer_Holder>
					</React.Fragment>
				);
			}
		}
	)
);
export default Landing;
