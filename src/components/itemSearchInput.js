import React, { useEffect, useState } from 'react';
import { AutoComplete, Input } from 'antd';

const ItemSearchInput = ({ onSearch }) => {
	const [itemList, setItemList] = useState([]);
	const fetchTest = () => {
		(async () => {
			try {
				const response = await fetch('/api/search');
				const items = await response.json();
				setItemList(items.map((item, index) => { return { key: index, value: item } }));
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
			onSelect={ onSearch }
		>
			<Input.Search
				size="large"
				placeholder="Search for Item"
				enterButton
				onSearch={ onSearch }
			/>
		</AutoComplete>
	);
};

export default ItemSearchInput;