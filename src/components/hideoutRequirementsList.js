import React from 'react';
import { List } from 'antd';
import { HomeOutlined } from '@ant-design/icons';


const HideoutRequirementsList = ({ hideoutData }) => {
	const iconStyle = { fontSize: '24px', marginRight: '10px' };
	return (
		<List
			dataSource={ hideoutData }
			renderItem={ item => (
				<List.Item>
					<HomeOutlined style={ iconStyle } /> { item }
				</List.Item>
			)}
		/>
	);
}

export default HideoutRequirementsList;