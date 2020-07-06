import React from 'react';
import { Row, Col } from 'antd';

const InformationTextContainer = (props) => {
	return (
		<Row justify="center" align="middle">
			<Col span={ 4 }>
				<div style={ { textAlign: "center" } }>
					<div style={ { display: "inline-block" } }>
						{ props.children }
					</div>
				</div>
			</Col>
		</Row>
	);
}

export default InformationTextContainer;