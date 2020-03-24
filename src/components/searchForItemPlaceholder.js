import React from 'react';
import { Row, Col, Typography } from 'antd';

const SearchForItemPlaceholder = () => {
	return (
		<Row justify="center" align="middle">
			<Col span={ 4 }>
				<div style={ { textAlign: "center" } }>
					<div style={ { display: "inline-block" } }>
						<Typography.Text type="secondary">
							Search for an item to get data
						</Typography.Text>
					</div>
				</div>
			</Col>
		</Row>
	);
}

export default SearchForItemPlaceholder;