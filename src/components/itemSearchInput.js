import React, { useEffect, useState } from 'react';
import { AutoComplete, Button, Input, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const ItemSearchInput = (props) => {
	const [itemList, setItemList] = useState([]);
	const [fetchingItems, setFetchingItems] = useState(false);
	const fetchItemList = async () => {
		try {
			setFetchingItems(true);
			const response = await fetch('/api/search/all');
			const json = await response.json();
			if (!response.ok) {
				throw json.message || 'Something went wrong';
			}
			setItemList(json.items.sort().map((item, index) => { return { key: index, value: item } }));
		} catch(error) {
			message.error(error, 10);
		} finally {
			setFetchingItems(false);
		}
	}
	const {
		handleSearch,
		handleChange,
		searching,
		itemName
	} = props;
	const filterFunction = (inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
	
	useEffect(() => { fetchItemList() }, []);

	return (
		<React.Fragment>
			<AutoComplete
				autoFocus
				value={ itemName }
				options={ itemList }
				filterOption={ filterFunction }
				onSelect={ handleSearch }
				onChange={ handleChange }
			>
				<Input.Search
					size='large'
					placeholder='Search for Item'
					onSearch={ handleSearch }
					loading={ searching || fetchingItems }
					style={ { width: 350 } }
				/>
			</AutoComplete>
			<Button
				type='link'
				icon={ 
					itemName &&
					<CloseCircleOutlined style={ { fontSize: '24px', marginLeft: '10px'} } />
				}
				onClick={ () => handleChange('') }
			/>
		</React.Fragment>
	);
};

export default ItemSearchInput;