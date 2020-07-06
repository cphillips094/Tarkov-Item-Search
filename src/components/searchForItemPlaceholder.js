import React from 'react';
import InformationTextContainer from './informationTextContainer'
import { Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SearchForItemPlaceholder = () => {
	return (
		<InformationTextContainer>
			<Typography.Text type="secondary">
				<SearchOutlined /> Search for an item to get data
			</Typography.Text>
		</InformationTextContainer>
	);
}

export default SearchForItemPlaceholder;