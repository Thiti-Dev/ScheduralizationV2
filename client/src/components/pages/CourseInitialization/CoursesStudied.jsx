import React, { Component } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Button } from 'antd';
import { DropTarget } from 'react-dnd';

import CoursesStudiedList from './CoursesStudiedList';

const Custom_Courses_Holder = styled.div`
	width: 50rem;
	height: 45rem;
	background-color: ${(props) => (props.hovered ? 'rgba(0,0,0,0.05)' : 'white')};
	overflow-y: auto;
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
`;

function collect(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		hovered: monitor.isOver(),
		item: monitor.getItem()
	};
}

class CoursesStudied extends Component {
	render() {
		const { connectDropTarget, hovered, item } = this.props;
		return (
			<Custom_Courses_Holder
				ref={(instance) => {
					connectDropTarget(instance);
				}}
				hovered={hovered}
			>
				<Custom_Description_Header>
					My Studied Courses{' '}
					<Button type="primary" ghost style={{ marginLeft: '2rem', marginRight: '0.5rem' }}>
						Save changes
					</Button>
					<Button danger>Discard</Button>
				</Custom_Description_Header>
				<Custom_Center_X>
					<CoursesStudiedList title="CSS101 EXPLORING COMPUTER SCIENCE" />
				</Custom_Center_X>
			</Custom_Courses_Holder>
		);
	}
}

export default DropTarget('card', {}, collect)(CoursesStudied);
