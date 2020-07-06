import React from 'react';
import InformationTextContainer from './informationTextContainer'
import { Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SearchForItemPlaceholder = () => {
	return (
		<InformationTextContainer>
			<Typography.Title level={ 4 }>
				<Typography.Text type="secondary">
					<SearchOutlined /> Search for an item to get data
				</Typography.Text>
			</Typography.Title>
		</InformationTextContainer>
	);
}

export default SearchForItemPlaceholder;