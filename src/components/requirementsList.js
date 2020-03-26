import React from 'react';
import { List } from 'antd';
import { QuestionCircleOutlined, HomeOutlined } from '@ant-design/icons';

const RequirementsList = ({ questData, hideoutData }) => {
	const iconStyle = { fontSize: '24px', marginRight: '10px' };
	const listData = questData.map(questRequirement => {
		return {
			icon: <QuestionCircleOutlined style={ iconStyle } />,
			value: questRequirement
		}
	}).concat(hideoutData.map(hideoutRequirement => {
		return {
			icon: <HomeOutlined style={ iconStyle } />,
			value: hideoutRequirement
		}
	}));
	return (
		<List
			dataSource={ listData }
			renderItem={ item => (
				<List.Item>
					{ item.icon } { item.value }
				</List.Item>
			)}
		/>
	);
}

export default RequirementsList;