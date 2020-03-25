import React from 'react';
import { Drawer, List, Button, Typography } from 'antd';
import { CloseCircleOutlined  } from '@ant-design/icons';

const FavoritesDrawer = (props) => {
	const {
		favorites,
		drawerVisible,
		handleClose,
		handleFavoriteClick,
		handleRemove,
	} = props;
	return (
		<React.Fragment>
			<Drawer
				title='Favorites'
				placement='right'
				visible={ drawerVisible }
				onClose={ () => handleClose(false) }
				width={ 400 }
			>
				{
					(
						favorites.length > 0 &&
						<List
							itemLayout='horizontal'
							dataSource={ favorites }
							renderItem={ item => (
								<List.Item
									actions={[
										<Button
											key='list-item-remove'
											type='link'
											icon={ 
												<CloseCircleOutlined />
											}
											onClick={ () => handleRemove(item) }
										/>
									]}
								>
									<a
											href="/"
											onClick={ e => {
												e.preventDefault();
												handleFavoriteClick(item);
											}}
										>
											<Typography.Text strong style={  { color: 'orange' } }>
												{ item }
											</Typography.Text>
										</a>
								</List.Item>
							)}
						/>
					) ||
					<div style={ { textAlign: "center" } }>
						<div style={ { display: "inline-block" } }>
							<Typography.Text type="secondary">
								You don't have any favorites saved
							</Typography.Text>
						</div>
					</div>
				}
			</Drawer>
		</React.Fragment>
	)
}

export default FavoritesDrawer;