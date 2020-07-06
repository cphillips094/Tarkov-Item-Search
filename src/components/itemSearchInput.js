import React from 'react';
import { AutoComplete, Button, Input } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const ItemSearchInput = (props) => {
	const {
		fetchingItems,
		itemList,
		handleSearch,
		handleChange,
		searching,
		itemName
	} = props;
	const filterFunction = (inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
	
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