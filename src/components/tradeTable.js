import React from 'react';
import { Row, Col, Card, List, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const wrapInCenteredDiv = jsx => {
	return (
		<div style={ { textAlign: "center" } }>
			<div style={ { display: "inline-block" } }>
				{ jsx }
			</div>
		</div>
	);
}

const TradeTable = ({ tradeData, favorites, handleItemClick }) => {
	const tradableList = tradableData => {
		return (
			<List
				bordered
				itemLayout="horizontal"
				dataSource={ tradableData }
				renderItem={ tradable => (
					<List.Item
						extra={
							<img
								src={ tradable.imageURL }
								alt={ tradable.name }
								style={ { maxWidth: "50%" } }
							/>
						}
					>
						<List.Item.Meta
							title={
								<a
									href="/"
									onClick={ e => {
										e.preventDefault();
										handleItemClick(tradable.name);
									}}
								>
									<Typography.Text strong style={ favorites.includes(tradable.name) ? { color: 'orange' } : {} }>
										{ tradable.name }
									</Typography.Text>
								</a>
							}
							description={ tradable.quantity && `x${tradable.quantity}` }
						/>
					</List.Item>
				)}
			/>
		);
	}
	const colStyle = { margin: "auto" };
	const iconStyle = { fontSize: "24px"};

	return tradeData.map((trade, index) => {
		const requirements = trade.entity.requirements;
		return (
			<Card key={ index } style={ { margin: "20px auto" } }>
				<Row>
					<Col span={ 8 } style={ colStyle }>
						{ tradableList(trade.required) }
					</Col>
					<Col span={ 2 } style={ colStyle }>
						{
							wrapInCenteredDiv(
								<ArrowRightOutlined style={ iconStyle } />
							)
						}
					</Col>
					<Col span={ 4 } style={ colStyle }>
						{
							wrapInCenteredDiv(
								<React.Fragment>
									{
										trade.entity.imageURL &&
										<img
											src={ trade.entity.imageURL }
											alt={ trade.entity.name }
										/>
									}
									<Typography.Title level={4}>
										{ trade.entity.name }
									</Typography.Title>
									{
										requirements &&
										<p>
											{ requirements }
										</p>
									}
								</React.Fragment>
							)
						}
					</Col>
					<Col span={ 2 } style={ colStyle }>
						{
							wrapInCenteredDiv(
								<ArrowRightOutlined style={ iconStyle } />
							)
						}
					</Col>
					<Col span={ 8 } style={ colStyle }>
						{ tradableList(trade.receivables) }
					</Col>
				</Row>
			</Card>
		)
	});
}

export default TradeTable;