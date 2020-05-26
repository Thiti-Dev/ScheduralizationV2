import React, { Component } from 'react';

import { Spin, Space, Result, Button } from 'antd';
import styled from 'styled-components';

//
// ─── SOCKET IO ──────────────────────────────────────────────────────────────────
//
import socketIOClient from 'socket.io-client';
// ────────────────────────────────────────────────────────────────────────────────

const endpoint = 'http://localhost:5000'; // socket.io endpoint server
var socket = null;

const Outer_Holder = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
`;
const Main_Message = styled.p`
	font-size: 3rem;
	font-family: Rajdhani;
	font-weight: lighter;
	white-space: nowrap;
`;
export default class ConfirmEmail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			yetVerified: false
		};
	}
	componentDidMount() {
		//
		// ─── CHECK IF CAME ACROSS VALID ──────────────────────────────────
		//
		//console.log(this.props.location.state.email);
		if (!this.props.location.state) {
			return;
		}
		if (this.props.location.state.email) {
			// valid
			this.socketListening();
			/*setTimeout(() => {
				this.setState({ yetVerified: true });
			}, 3000);*/
		} else {
			// not valid show an error
		}
		// ─────────────────────────────────────────────────────────────────
	}
	onConfirmEmailSuccess() {
		this.setState({ yetVerified: true });
	}
	//
	// ─── SOCKET.IO ─────────────────────────────────────────────────────────────────────
	//
	onSendingMessage() {
		/*const { message, endpoint } = this.state;
		console.log(message);
		const socket = socketIOClient(endpoint);
		socket.emit('sent-message', message);
		this.setState({ message: '' });*/
	}

	joinWaitingRoom() {
		socket.emit('room', this.props.location.state.email);
	}

	socketListening() {
		console.log('[socket.io]: Connecting to the endpoint');
		socket = socketIOClient(endpoint);
		socket.on('email-status', (is_success) => {
			console.log('[RECIEVE]: ' + is_success);
			socket.ondisconnect(); // disconnect from socket io ( no need )
			this.onConfirmEmailSuccess();
		});
		socket.on('connect', () => {
			console.log('[socket.io]: Connected to the endpoint');
			this.joinWaitingRoom();
		});
	}

	// ────────────────────────────────────────────────────────────────────────────────
	render() {
		const { yetVerified } = this.state;
		return (
			<Outer_Holder>
				{!yetVerified ? (
					<React.Fragment>
						<Main_Message>Waiting for email comfirmation</Main_Message>
						<Spin size="large" />
					</React.Fragment>
				) : (
					<React.Fragment>
						<Result
							status="success"
							title="Successfully Verified the email!"
							subTitle="Welcome to Schedularization. Hoping you to have a great experience here and enjoy using our platform"
						/>
						<Button type="ghost" onClick={() => this.props.history.push('/')}>
							Back to landing page
						</Button>
					</React.Fragment>
				)}
			</Outer_Holder>
		);
	}
}
