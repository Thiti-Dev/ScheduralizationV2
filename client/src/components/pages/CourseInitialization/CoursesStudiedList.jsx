import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { DeleteOutlined } from '@ant-design/icons';

const Custom_Card = styled.div`
	align-self: center;
	width: 50%;
	height: 2.5rem;
	line-height: 2.5rem;
	text-align: center;
	background-color: lightgreen;
	font-family: Rajdhani;
	font-size: 1rem;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
	margin-bottom: 0.0rem;

	border: solid black 0.2px;
`;
function CoursesStudiedList({ title }) {
	return (
		<Custom_Card>
			CSS224 Working Around{' '}
			<span style={{ float: 'right', paddingRight: '2rem', cursor: 'pointer' }}>
				<DeleteOutlined />
			</span>
		</Custom_Card>
	);
}

export default CoursesStudiedList;
