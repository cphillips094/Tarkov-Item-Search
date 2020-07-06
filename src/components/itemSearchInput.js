import React, { useState } from 'react';
import { AutoComplete, Button, Input } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const ItemSearchInput = (props) => {
	const [isFocused, setIsFocused] = useState(true);
	const {
		fetchingItems,
		itemList,
		handleSearch,
		handleChange,
		searching,
		itemName
	} = props;
	const filterFunction = (inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
	const handleSearchAndBlur = inputValue => {
		handleSearch(inputValue);
		const selector =  document.getElementById('item-select');
		if (selector) {
			selector.blur();
		}
	};
	
	return (
		<React.Fragment>
			<AutoComplete
				id="item-select"
				autoFocus
				value={ itemName }
				options={ itemList }
				filterOption={ filterFunction }
				onSelect={ handleSearchAndBlur }
				onChange={ handleChange }
				open={ isFocused && itemName.length > 0 }
				onFocus={ () => setIsFocused(true) }
				onBlur={() => setIsFocused(false) }
			>
				<Input.Search
					size='large'
					placeholder='Search for Item'
					loading={ searching || fetchingItems }
					style={ { width: 350 } }
					onSearch={ handleSearchAndBlur }
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