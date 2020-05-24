import React, { Component } from 'react';
import styled from 'styled-components';
import { DragSource } from 'react-dnd';

const Types = {
	CARD: 'card'
};

const Custom_Card = styled.div`
	align-self: center;
	width: 80%;
	height: 2.5rem;
	line-height: 2.5rem;
	text-align: center;
	background-color: pink;
	font-family: Rajdhani;
	font-size: 1rem;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
	margin-bottom: 0.0rem;

	border: solid black 0.2px;

	opacity: ${(props) => (props.drag ? 0 : 1)};
`;

const cardSource = {
	canDrag(props) {
		// You can disallow drag based on props
		return true;
	},

	beginDrag(props, monitor, component) {
		// Return the data describing the dragged item
		console.log('[DRAG-INFO]: ' + props.title);
		const item = { id: props.id };
		return item;
	},

	endDrag(props, monitor, component) {
		if (!monitor.didDrop()) {
			// You can check whether the drop was successful
			// or if the drag ended but nobody handled the drop
			console.log('[DRAG]: Dropped => ' + props.title);
			return;
		}

		console.log('[DRAG][ON-TARGET]: Dropped => ' + props.courseID);
		props.on_drag(props.courseID, props.courseName);
	}
};

/**
   * Specifies which props to inject into your component.
   */
function collect(connect, monitor) {
	return {
		// Call this function inside render()
		// to let React DnD handle the drag events:
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
		// You can ask the monitor about the current drag state:
		isDragging: monitor.isDragging()
	};
}
class CoursesList extends Component {
	render() {
		const { isDragging, connectDragSource } = this.props;
		const { courseID, courseName } = this.props;
		return (
			<Custom_Card
				drag={isDragging}
				ref={(instance) => {
					connectDragSource(instance);
					//connectDropTarget(instance);
				}}
			>
				{`${courseID} ${courseName}`}
			</Custom_Card>
		);
	}
}

export default DragSource(Types.CARD, cardSource, collect)(CoursesList);
