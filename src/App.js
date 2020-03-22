import React, { useState } from 'react';
import 'antd/dist/antd.dark.css';
import { Divider, Layout, Row, Col, Typography } from 'antd';
import ItemSearchInput from './components/itemSearchInput';
import TradeTable from './components/tradeTable';

const App = () => {
	const [tradingData, setTradingData] = useState([]);
	const [craftingData, setCraftingData] = useState([]);
	const { Header, Content } = Layout;

	const fetchData = value => {
		(async () => {
			try {
				const response = await fetch(`/api/search?item=${value.replace(/ /g, '_')}`);
				const json = await response.json();
				setTradingData(json.trading);
				setCraftingData(json.crafting);
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
						<Row gutter={ { xs: 8, sm: 16, md: 24, lg: 32 } }>
							<Col span={12}>
								<Typography.Title>
									Trading
								</Typography.Title>
								<TradeTable tradeData = { tradingData } />
							</Col>
							<Col span={12}>
								<Typography.Title>
									Crafting
								</Typography.Title>
								<TradeTable tradeData = { craftingData } />
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
