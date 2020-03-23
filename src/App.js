import React, { useState } from 'react';
import 'antd/dist/antd.dark.css';
import { Divider, Layout, Row, Col, Typography } from 'antd';
import RequirementsList from './components/requirementsList';
import ItemSearchInput from './components/itemSearchInput';
import TradeTable from './components/tradeTable';
import { QuestionCircleOutlined, HomeOutlined } from '@ant-design/icons';

const App = () => {
	const [questData, setQuestData] = useState([]);
	const [hideoutData, setHideoutData] = useState([]);
	const [tradingData, setTradingData] = useState([]);
	const [craftingData, setCraftingData] = useState([]);
	const { Header, Content } = Layout;

	const fetchData = value => {
		(async () => {
			try {
				const response = await fetch(`/api/search/${value.replace(/ /g, '_')}`);
				const json = await response.json();
				setQuestData(json.quest);
				setHideoutData(json.hideout);
				setTradingData(json.trading);
				setCraftingData(json.crafting);
			} catch(err) {
				alert("error: " + err);
			}
		})()
	}

	const gutterSizes = [ { xs: 8, sm: 16, md: 24, lg: 32 }, { xs: 8, sm: 16, md: 24, lg: 32 } ];
	const iconStyle = { fontSize: '24px', marginRight: '10px' };

	return (
		<Layout>
			<Header>Tarkov Item Search</Header>
			<Layout>
				{/* <Sider>Sider</Sider> */}
				<Content>
					<div style={ { padding: "20px" } }>
						<ItemSearchInput onSearch={ fetchData } />
						<Divider/>
						{	
							questData.length + hideoutData.length > 0 &&
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
						}
						<Row gutter={ gutterSizes }>
							{
								tradingData.length > 0 &&
								<Col span={ 12 }>
									<Typography.Title>
										Trading
									</Typography.Title>
									<TradeTable tradeData = { tradingData } />
								</Col>
							}
							{
								craftingData.length > 0 &&
								<Col span={ 12 }>
									<Typography.Title>
										Crafting
									</Typography.Title>
									<TradeTable tradeData = { craftingData } />
								</Col>
							}
						</Row>
					</div>
				</Content>
			</Layout>
			{/* <Footer>Footer</Footer> */}
		</Layout>
	);
}

export default App;
