import React from 'react';
import { AutoComplete, Input } from 'antd';

const ItemSearchInput = ({ onSearch }) => {
	const options = [
		{ value: 'Folder with intelligence' },
	];
	
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