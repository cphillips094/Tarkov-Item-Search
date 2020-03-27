import React, { useState } from 'react';
import { Popover, Typography, Button, message } from 'antd';
import { SearchOutlined, StarOutlined, CloseOutlined, CloseCircleOutlined } from '@ant-design/icons';

const TradablePopover = props => {
	const {
		itemName,
		tradableName,
		favorites,
		handleSearchClick,
		handleAddRemoveFavoriteClick
	} = props;
	const [popoverVisible, setPopoverVisible] = useState(false);
	const isItemName = tradableName === itemName;
	const isFavorite = favorites.includes(tradableName);
	const tradableTextStyle = isFavorite ? { color: 'orange' } : {};
	const messageIconStyle = { color: 'orange' };
	
	return (
		<Popover
			content={
				<React.Fragment>
					{
						!isItemName &&
						<Button
							shape='circle'
							icon={ <SearchOutlined /> }
							onClick={ () => {
								setPopoverVisible(false);
								handleSearchClick(tradableName);
							}}
						/>
					}
					<Button
						shape='circle'
						icon={ isFavorite ? <CloseOutlined /> : <StarOutlined /> }
						onClick={ () => {
							setPopoverVisible(false);
							handleAddRemoveFavoriteClick(tradableName);
							message.open({
								key: 'favorite-message',
								content: isFavorite ? 'Removed from favorites' : 'Added to favorites',
								icon: isFavorite ? <CloseCircleOutlined style={ messageIconStyle }/> : <StarOutlined style={ messageIconStyle }/>,
							});
						}}
						style={ isItemName ? {} : { marginLeft: '10px' } }
					/>
				</React.Fragment>
			}
			trigger='click'
			visible={ popoverVisible }
			onVisibleChange={ setPopoverVisible }
		>
			<div style={ { paddingRight: '5px' } }>
				<Typography.Text
					strong={ true }
					style={ { cursor: 'pointer', ...tradableTextStyle } }>
					{ tradableName }
				</Typography.Text>
			</div>
		</Popover>
	);
}

export default TradablePopover;