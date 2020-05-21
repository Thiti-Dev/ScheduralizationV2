import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

// ─── ANTD ───────────────────────────────────────────────────────────────────────
//
import {
	Row,
	Col,
	Divider,
	Layout,
	Button,
	PageHeader,
	Menu,
	Dropdow,
	Tag,
	Typography,
	Breadcrumb,
	Collapse,
	List,
	Input
} from 'antd';
import {
	EllipsisOutlined,
	HomeOutlined,
	UserOutlined,
	MenuOutlined,
	ScheduleOutlined,
	BookOutlined,
	CaretRightOutlined
} from '@ant-design/icons';
// ────────────────────────────────────────────────────────────────────────────────

import styled, { createGlobalStyle } from 'styled-components';

//
// ─── UTIL ───────────────────────────────────────────────────────────────────────
//
import { distinctArrayOfObject, categorizedArrayOfObject } from '../../../utils/arrayHelper';
import { splitRequiredCourseToNormalizeText } from '../../../utils/stringNormalizer';
// ────────────────────────────────────────────────────────────────────────────────

const { Header, Content, Footer } = Layout;
const { Paragraph } = Typography;
const { Panel } = Collapse;
const { Search } = Input;

//
// ─── MAPPED LOCALES ─────────────────────────────────────────────────────────────
//
const day_abbreviation_extract = {
	'จ.': 'จันทร์',
	'อ.': 'อังคาร',
	'พ.': 'พุธ',
	'พฤ.': 'พฤ',
	'ศ.': 'ศุกร์',
	'ส.': 'เสาร์',
	'อา.': 'อาทิตย์'
};
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── CONSTRANT ──────────────────────────────────────────────────────────────────
//
const RENDER_TIMEOUT_AFTER_TYPED = 1 * 1000; // 1.5 seconds ( DEFAULT ) // 1 seconds not recommend for mobile devices
// ────────────────────────────────────────────────────────────────────────────────

export default class CoursesList extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	UNSAFE_componentWillReceiveProps(nextProps) {
		// Checkboth if that exist // or use remove until no text left
		if (nextProps.search_str || nextProps.search_str == '') {
			if (!this.reRenderTimeout) {
				this.reRenderTimeout = setTimeout(() => {
					this.reRenderTimeout = null;
					this.forceUpdate();
				}, RENDER_TIMEOUT_AFTER_TYPED);
			}
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		// Prevent from rendering ( Performace Stuffs)
		if (JSON.stringify(nextProps.coursesData) == JSON.stringify(this.props.coursesData)) {
			return false;
		}
		return true;
	}
	render() {
		let rendered_course;
		let filtered_courseData;
		const { coursesData, search_str } = this.props;
		if (coursesData) {
			if (!search_str) {
				filtered_courseData = coursesData;
			} else {
				// Filtering phase
				let _search_str = search_str.toLowerCase();
				filtered_courseData = coursesData.filter((data) => {
					let _courseID = data.courseID.toLowerCase();
					let _courseName = data.courseName.toLowerCase();
					if (_courseID.includes(_search_str) || _courseName.includes(_search_str)) {
						return true;
					}
					return false;
				});
			}
			rendered_course = filtered_courseData.map((courseData, index) => {
				const finalized_available = distinctArrayOfObject(
					courseData.courseAvailable,
					[ 'start', 'end', 'day' ],
					'section'
				);
				const categorized_available = categorizedArrayOfObject(finalized_available, 'section');
				const rendered_available = [];

				// Auto increment for prefix the key id
				let panel_autoincrement = 0;
				//
				for (let [ key, value ] of Object.entries(categorized_available)) {
					panel_autoincrement = panel_autoincrement + 1;
					rendered_available.push(
						<Panel
							header={`Section ${key}`}
							key={`${courseData.courseID}-${panel_autoincrement}`}
							className="site-collapse-custom-panel"
						>
							<List
								size="small"
								// header={<div>Availability</div>}
								// footer={<div>Footer</div>}
								bordered
								dataSource={value}
								renderItem={(item) => (
									<List.Item>
										ภาคการศึกษาที่ {item.semester} วัน {day_abbreviation_extract[item.day]}{' '}
										เริ่มเรียน {item.start} เลิก {item.end} ห้อง {item.classroom}
									</List.Item>
								)}
							/>
						</Panel>
					);
				}
				return (
					<Panel
						header={courseData.courseID + ' ' + courseData.courseName}
						key={index}
						className="site-collapse-custom-panel"
					>
						{courseData.required ? (
							<text>
								<span style={{ color: 'red' }}>* วิชาที่ต้องเรียนมาก่อน </span>
								{splitRequiredCourseToNormalizeText(courseData.required)}
							</text>
						) : null}
						<Collapse
							bordered={false}
							// defaultActiveKey={[ '1' ]}
							expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
							className="site-collapse-custom-collapse"
						>
							{rendered_available}
						</Collapse>
					</Panel>
				);
			});
		}
		return (
			<React.Fragment>
				<Collapse
					bordered={true}
					// defaultActiveKey={[ '1' ]}
					expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
					className="site-collapse-custom-collapse"
				>
					{rendered_course}
				</Collapse>
			</React.Fragment>
		);
	}
}
