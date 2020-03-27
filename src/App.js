import React, { useState } from 'react';
import 'antd/dist/antd.dark.css';
import { Divider, Layout, Row, Col, Affix, Button, message } from 'antd';
import ItemSearchInput from './components/itemSearchInput';
import FavoritesDrawer from './components/favoritesDrawer';
import SearchForItemPlaceholder from './components/searchForItemPlaceholder';
import ItemData from './components/itemData';
import { LeftOutlined  } from '@ant-design/icons';

const App = () => {
	const [itemName, setItemName] = useState('');
	const [favorites, setFavorites] = useState([]);
	const [drawerVisible, setDrawerVisible] = useState(false);
	const [makingRequest, setMakingRequest] = useState(false);
	const [requestMade, setRequestMade] = useState(false);
	const [questData, setQuestData] = useState([]);
	const [hideoutData, setHideoutData] = useState([]);
	const [tradingData, setTradingData] = useState([]);
	const [craftingData, setCraftingData] = useState([]);

	const fetchItemData = async value => {
		if (value) {
			try {
				setMakingRequest(true);
				const response = await fetch(`/api/search/${value.replace(/ /g, '_')}`);
				const json = await response.json();
				if (!response.ok) {
					throw json.message || 'Something went wrong';
				}
				setQuestData(json.quest);
				setHideoutData(json.hideout);
				setTradingData(json.trading);
				setCraftingData(json.crafting);
			} catch (error) {
				message.error(error, 10);
			} finally {
				setRequestMade(true);
				setMakingRequest(false);
			}
		}
	};

	const handleChange = value => {
		setItemName(value);
		if (!value) {
			setRequestMade(false);
		}
	}

	const handleAddRemoveFavoriteClick = value => {
		if (favorites.includes(value)) {
			setFavorites(favorites.filter(arrValue => arrValue !== value).sort());
		} else {
			setFavorites(favorites.concat(value).sort());
		}
	}

	const handleSearchClick = value => {
		setItemName(value);
		fetchItemData(value);
	}

	const handleFavoriteClick = value => {
		setItemName(value);
		setDrawerVisible(false);
		fetchItemData(value);
	}

	return (
		<Layout>
			<Layout.Content>
				<div style={ { padding: '20px',  minHeight: '800px' } }>
					<Row>
						<Col span={ 16 }>
							<ItemSearchInput
								handleSearch={ fetchItemData }
								handleChange={ handleChange }
								searching={ makingRequest }
								itemName={ itemName }
							/>
						</Col>
						<Col span={ 8 }>
							<Affix offsetTop={ 20 }>
								<Button
									type='primary'
									shape='circle'
									icon={
										<LeftOutlined />
									}
									size='large'
									onClick={ () => setDrawerVisible(!drawerVisible) }
									style={ { float: 'right', marginRight: '20px' } }
								/>
							</Affix>	
							<FavoritesDrawer
								favorites={ favorites }
								drawerVisible={ drawerVisible }
								handleClose={ setDrawerVisible }
								handleFavoriteClick={ handleFavoriteClick }
								handleRemove={ handleAddRemoveFavoriteClick }
							/>
						</Col>
					</Row>
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
								favorites={ favorites }
								handleSearchClick={ handleSearchClick }
								handleAddRemoveFavoriteClick={ handleAddRemoveFavoriteClick }
							/>
						) ||
						<SearchForItemPlaceholder/>
					}
				</div>
			</Layout.Content>
		</Layout>
	);
}

export default App;
