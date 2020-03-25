import React, { useState } from 'react';
import { Popover, Typography, Button } from 'antd';
import { SearchOutlined, CheckOutlined, CloseOutlined  } from '@ant-design/icons';

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
						icon={ isFavorite ? <CloseOutlined /> : <CheckOutlined /> }
						onClick={ () => {
							setPopoverVisible(false);
							handleAddRemoveFavoriteClick(tradableName);
						}}
						style={ isItemName ? {} : { marginLeft: '10px' } }
					/>
				</React.Fragment>
			}
			trigger='click'
			visible={ popoverVisible }
			onVisibleChange={ setPopoverVisible }
		>
			<Typography.Text strong style={ { cursor: 'pointer', ...tradableTextStyle } }>
				{ tradableName }
			</Typography.Text>
		</Popover>
	);
}

export default TradablePopover;