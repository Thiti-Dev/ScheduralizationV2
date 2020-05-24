import React, { Component } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Button } from 'antd';
import { DropTarget } from 'react-dnd';

import CoursesStudiedList from './CoursesStudiedList';

//
// ─── FAKELOAD ───────────────────────────────────────────────────────────────────
//
import doFakeLoadIfNeeded from '../../../utils/fakeLoader';
// ────────────────────────────────────────────────────────────────────────────────

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
	overflow-x: hidden;
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

function collect(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		hovered: monitor.isOver(),
		item: monitor.getItem()
	};
}

class CoursesStudied extends Component {
	constructor(props) {
		super(props);
		this.state = {
			is_requesting: false
		};
	}
	render() {
		const {
			connectDropTarget,
			hovered,
			item,
			detect_changes,
			studied_list,
			on_remove,
			on_discard,
			on_save
		} = this.props;
		const { is_requesting } = this.state;
		return (
			<Custom_Courses_Holder
				ref={(instance) => {
					connectDropTarget(instance);
				}}
				hovered={hovered}
			>
				<Custom_Description_Header>
					My Studied Courses{' '}
					{detect_changes ? (
						<React.Fragment>
							<Button
								loading={is_requesting}
								onClick={async () => {
									this.setState({ is_requesting: true });
									await doFakeLoadIfNeeded();
									on_save();
									this.setState({ is_requesting: false });
								}}
								type="primary"
								ghost
								style={{ marginLeft: '2rem', marginRight: '0.5rem' }}
							>
								Save changes
							</Button>
							<Button danger onClick={on_discard}>
								Discard
							</Button>{' '}
						</React.Fragment>
					) : null}
				</Custom_Description_Header>
				<Custom_Center_X>
					{studied_list.map((data, index) => {
						return (
							<CoursesStudiedList
								_key={index}
								courseID={data.courseID}
								courseName={data.courseName}
								on_remove={(id, key) => on_remove(id, key)}
							/>
						);
					})}
				</Custom_Center_X>
			</Custom_Courses_Holder>
		);
	}
}

export default DropTarget('card', {}, collect)(CoursesStudied);
