import React from 'react';
import { Row, Col, Typography, Empty } from 'antd';
import RequirementsList from './requirementsList';
import TradeTable from './tradeTable';

const gutterSizes = [ { xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 } ];

const ItemData = (props) => {
	const {
		itemName,
		questData,
		hideoutData,
		tradingData,
		craftingData,
		favorites,
		handleSearchClick,
		handleAddRemoveFavoriteClick,
	} = props;
	let hasListData = questData.concat(hideoutData).length > 0;
	let hasTableData = tradingData.concat(craftingData).length > 0;
	let hasData = hasListData || hasTableData;

	const listData = () => {
		return (
			<Row gutter={ gutterSizes }>
				<Col>
					<RequirementsList
						questData={ questData }
						hideoutData={ hideoutData }
					/>
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
							itemName={ itemName }
							tradeData={ tradingData }
							favorites={ favorites }
							handleSearchClick={ handleSearchClick }
							handleAddRemoveFavoriteClick={ handleAddRemoveFavoriteClick }
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
							itemName={ itemName }
							tradeData={ craftingData }
							favorites={ favorites }
							handleSearchClick={ handleSearchClick }
							handleAddRemoveFavoriteClick={ handleAddRemoveFavoriteClick }
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