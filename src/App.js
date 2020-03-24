import React, { useState } from 'react';
import 'antd/dist/antd.dark.css';
import { Divider, Layout } from 'antd';
import ItemSearchInput from './components/itemSearchInput';
import SearchForItemPlaceholder from './components/searchForItemPlaceholder';
import ItemData from './components/itemData';

const App = () => {
	const [itemName, setItemName] = useState('');
	const [makingRequest, setMakingRequest] = useState(false);
	const [requestMade, setRequestMade] = useState(false);
	const [questData, setQuestData] = useState([]);
	const [hideoutData, setHideoutData] = useState([]);
	const [tradingData, setTradingData] = useState([]);
	const [craftingData, setCraftingData] = useState([]);
	const { Header, Content } = Layout;

	const fetchItemData = value => {
		(async () => {
			if (value) {
				try {
					setMakingRequest(true);
					const response = await fetch(`/api/search/${value.replace(/ /g, '_')}`);
					const json = await response.json();
					setQuestData(json.quest);
					setHideoutData(json.hideout);
					setTradingData(json.trading);
					setCraftingData(json.crafting);
				} catch(err) {
					alert("error: " + err);
				} finally{
					setRequestMade(true);
					setMakingRequest(false);
				}
			}
		})()
	}

	const handleChange = value => {
		setItemName(value);
		if (!value) {
			setRequestMade(false);
		}
	}

	return (
		<Layout>
			<Header>Tarkov Item Search</Header>
			<Layout>
				<Content>
					<div style={ { padding: '20px',  minHeight: '800px' } }>
						<ItemSearchInput
							handleSearch={ fetchItemData }
							handleChange={ handleChange }
							searching={ makingRequest }
							itemName={ itemName }
						/>
						<Divider/>
						{
							(
								requestMade &&
								<ItemData
									itemName={ itemName }
									questData={ questData }
									hideoutData={ hideoutData }
									tradingData={ tradingData }
									craftingData={ craftingData }
								/>
							) ||
							<SearchForItemPlaceholder/>
						}
					</div>
				</Content>
			</Layout>
		</Layout>
	);
}

export default App;
