import React from "react";
import Paper from "@mui/material/Paper";

/**
 * A React component that is used to show each individual item card
 * @returns Item container
 */

const ItemContainer = ({ index, item }) => {
	return (
		<Paper key={index} elevation={3}>
			{item.fields.name}
		</Paper>
	);
};

export default ItemContainer;
