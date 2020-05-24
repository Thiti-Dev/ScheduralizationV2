import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { DeleteOutlined } from '@ant-design/icons';

//
// ─── ANIMATION ──────────────────────────────────────────────────────────────────
//
import { Animated } from 'react-animated-css';
// ────────────────────────────────────────────────────────────────────────────────
const Custom_Card = styled.div`
	align-self: center;
	min-width: 80%;
	padding: 0 1rem;
	height: 2.5rem;
	line-height: 2.5rem;
	text-align: center;
	background-color: lightgreen;
	font-family: Rajdhani;
	font-size: 1rem;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
	margin-bottom: 0.0rem;

	border: solid black 0.2px;
	user-select: none;
`;
function CoursesStudiedList({ title, courseID, courseName, on_remove, _key }) {
	return (
		<Animated animationIn="bounceInLeft" animationOut="bounceOutLeft">
			<Custom_Card>
				{`${courseID} ${courseName}`}
				<span style={{ float: 'right', paddingRight: '2rem', cursor: 'pointer' }}>
					<DeleteOutlined onClick={() => on_remove(courseID, _key)} />
				</span>
			</Custom_Card>
		</Animated>
	);
}

// class CoursesStudiedList extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			visible: true
// 		};
// 		this.transitionEnd = this.transitionEnd.bind(this);
// 	}
// 	componentWillReceiveProps(newProps) {}
// 	transitionEnd(c_id, c_key) {
// 		// remove the node on transition end when the mounted prop is false
// 		console.log('cid + ' + c_id);
// 		this.setState({
// 			visible: false
// 		});
// 		this.props.on_remove(c_id, c_key);
// 	}
// 	render() {
// 		const { title, courseID, courseName, on_remove, _key } = this.props;
// 		const { visible } = this.state;
// 		return (
// 			<Animated isVisible={visible} animationIn="bounceInLeft" animationOut="bounceOutLeft">
// 				<Custom_Card>
// 					{`${courseID} ${courseName}`}
// 					<span style={{ float: 'right', paddingRight: '2rem', cursor: 'pointer' }}>
// 						<DeleteOutlined onClick={() => this.transitionEnd(courseID, _key)} />
// 					</span>
// 				</Custom_Card>
// 			</Animated>
// 		);
// 	}
// }

export default CoursesStudiedList;
