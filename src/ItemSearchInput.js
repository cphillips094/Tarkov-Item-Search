import React, { useState } from 'react';
import { AutoComplete, Input } from 'antd';

const ItemSearchInput = ({ onSearch }) => {
	const options = [
		{ value: 'Folder with intelligence' },
	];

	const handleSearch = value => {
		console.log('onSearch', value);
	};
	
	const onSelect = value => {
		console.log('onSelect', value);
	};

	return (
		<AutoComplete
			options={ options }
			filterOption={
				(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
			}
			onSelect={ onSelect }
			onSearch={ handleSearch }
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