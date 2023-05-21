import React from 'react';
import PropTypes from 'prop-types';

/**
 * A React component that returns the item container
 * @returns Item container
 */

const ItemContainer = ({ key, item }) => {
	return (
		<section id={key}>
			<h1>{item.fields.name}</h1>
		</section>
	);
};

ItemContainer.propTypes = {
	key: PropTypes.object.isRequired,
	item: PropTypes.object.isRequired,
};

export default ItemContainer;
