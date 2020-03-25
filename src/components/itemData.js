import React from 'react';
import { Row, Col, Typography, Empty } from 'antd';
import RequirementsList from './requirementsList';
import TradeTable from './tradeTable';
import { QuestionCircleOutlined, HomeOutlined } from '@ant-design/icons';

const gutterSizes = [ { xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 } ];
const iconStyle = { fontSize: '24px', marginRight: '10px' };

const ItemData = (props) => {
	const {
		itemName,
		questData,
		hideoutData,
		tradingData,
		craftingData,
		favorites,
		handleItemClick,
	} = props;
	let hasListData = questData.concat(hideoutData).length > 0;
	let hasTableData = tradingData.concat(craftingData).length > 0;
	let hasData = hasListData || hasTableData;

	const listData = () => {
		return (
			<Row gutter={ gutterSizes }>
				<Col>
					{
						questData.length > 0 &&
						<RequirementsList data = { questData } >
							<QuestionCircleOutlined style={ iconStyle } />
						</RequirementsList>
					}
					{
						hideoutData.length > 0 &&
						<RequirementsList data = { hideoutData } >
							<HomeOutlined style={ iconStyle } />
						</RequirementsList>
					}
				</Col>
			</Row>
		);
	}

	const tableData = () => {
		return (
			<Row gutter={ gutterSizes }>
				{
					tradingData.length > 0 &&
					<Col span={ 12 }>
						<Typography.Title>
							Trading
						</Typography.Title>
						<TradeTable
							tradeData={ tradingData }
							favorites={ favorites }
							handleItemClick={ handleItemClick }
						/>
					</Col>
				}
				{
					craftingData.length > 0 &&
					<Col span={ 12 }>
						<Typography.Title>
							Crafting
						</Typography.Title>
						<TradeTable
							tradeData={ craftingData }
							favorites={ favorites }
							handleItemClick={ handleItemClick }
						/>
					</Col>
				}
			</Row>
		);
	}
	
	return (
		// Data exists for item
		(
			hasData &&
			<React.Fragment>
				{ hasListData && listData() }
				{ hasTableData && tableData() }
			</React.Fragment>
		) ||
		// No data found for item
		(
			<Row justify="center" align="middle">
				<Col span={ 4 }>
					<div style={ { textAlign: "center" } }>
						<div style={ { display: "inline-block" } }>
							<Empty
								image={ Empty.PRESENTED_IMAGE_SIMPLE }
								description={ `No data found for ${itemName}` }
							/>
						</div>
					</div>
				</Col>
			</Row>
		)
	);
}

export default ItemData;