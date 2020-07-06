import React from 'react';
import InformationTextContainer from './informationTextContainer'
import { Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const FetchingItemListPlaceholder = () => {
	return (
		<InformationTextContainer>
			<Typography.Text type="secondary">
				<LoadingOutlined /> Loading item list, one sec...
			</Typography.Text>
		</InformationTextContainer>
	);
}

export default FetchingItemListPlaceholder;