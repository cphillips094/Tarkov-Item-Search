import React from 'react';
import { List } from 'antd';


const RequirementsList = ({ data, children }) => {
	return (
		<List
			dataSource={ data }
			renderItem={ item => (
				<List.Item>
					{ children } { item }
				</List.Item>
			)}
		/>
	);
}

export default RequirementsList;