import React, { useState } from 'react';
import 'antd/dist/antd.dark.css';
import { Button, Divider, Layout, Row, Col, Typography } from 'antd';
import ItemSearchInput from './components/itemSearchInput';

const App = () => {
	const [tradingData, setTradingData] = useState("");
	const { Header, Footer, Sider, Content } = Layout;

	const fetchData = value => {
		(async () => {
			try {
				const response = await fetch(`/api/search?item=${value.replace(/ /g, '_')}`);
				const json = await response.json();
				setTradingData(json.trading);
			} catch(err) {
			alert("error: " + err);
			}
		})()
	}

	return (
		<Layout>
			<Header>Tarkov Item Search</Header>
		<Layout>
			{/* <Sider>Sider</Sider> */}
			<Content>
				<div style={ { padding: "20px" } }>
					<ItemSearchInput onSearch={ fetchData } />
					<Divider/>
					<Row>
						<Col span={12}>
							<Typography.Title>
								Trading
							</Typography.Title>
							<table>
							<tr>
								<th>
									Required
								</th>
								<th>
									Trader
								</th>
								<th>
									Receive
								</th>
							</tr>
							{
								tradingData.length > 0 && tradingData.map(function(trade, index) {
									return <tr>
										<td>
											{
											trade.required.map(function(req, index) {
												return `${req.name} x${req.quantity}, `;
											})
											}
										</td>
										<td>
											{
											trade.entity.name + ", "
											}
										</td>
										<td>
											{
											trade.receivables.map(function(rec, index) {
												return `${rec.name} x${rec.quantity}`;
											})
											}
										</td>
									</tr>;
								})
							}
							</table>
						</Col>
						<Col span={12}>
							<Typography.Title>
							Crafting
							</Typography.Title>
						</Col>
					</Row>
				</div>
			</Content>
		</Layout>
			{/* <Footer>Footer</Footer> */}
		</Layout>
	);
}

export default App;
