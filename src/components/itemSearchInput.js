import React, { useEffect, useState } from 'react';
import { AutoComplete, Input } from 'antd';

const ItemSearchInput = ({ handleSearch }) => {
	const [itemList, setItemList] = useState([]);
	const fetchTest = () => {
		(async () => {
			try {
				const response = await fetch('/api/search');
				const items = await response.json();
				setItemList(items.sort().map((item, index) => { return { key: index, value: item } }));
			} catch(err) {
				alert("error: " + err);
			}
		})()
	}
	useEffect(fetchTest, []);

	const filterFunction = (inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
	return (
		<AutoComplete
			options={ itemList }
			filterOption={ filterFunction }
			onSelect={ handleSearch }
		>
			<Input.Search
				size="large"
				placeholder="Search for Item"
				enterButton
				onSearch={ handleSearch }
			/>
		</AutoComplete>
	);
};

export default ItemSearchInput;