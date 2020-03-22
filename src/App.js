import React, { useState } from 'react';
import 'antd/dist/antd.dark.css';
import { Divider, Layout, Row, Col, Typography } from 'antd';
import HideoutRequirementsList from './components/hideoutRequirementsList';
import ItemSearchInput from './components/itemSearchInput';
import TradeTable from './components/tradeTable';

const App = () => {
	const [hideoutData, setHideoutData] = useState([]);
	const [tradingData, setTradingData] = useState([]);
	const [craftingData, setCraftingData] = useState([]);
	const { Header, Content } = Layout;

	const fetchData = value => {
		(async () => {
			try {
				const response = await fetch(`/api/search?item=${value.replace(/ /g, '_')}`);
				const json = await response.json();
				setHideoutData(json.hideout);
				setTradingData(json.trading);
				setCraftingData(json.crafting);
			} catch(err) {
			alert("error: " + err);
			}
		})()
	}

	const gutterSizes = [ { xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 } ];

	return (
		<Layout>
			<Header>Tarkov Item Search</Header>
			<Layout>
				{/* <Sider>Sider</Sider> */}
				<Content>
					<div style={ { padding: "20px" } }>
						<ItemSearchInput onSearch={ fetchData } />
						<Divider/>
						<Row gutter={ gutterSizes }>
							<Col>
								<HideoutRequirementsList hideoutData = { hideoutData } />
							</Col>
						</Row>
						<Row gutter={ gutterSizes }>
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
