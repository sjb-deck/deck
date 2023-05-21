import React from 'react';
import ReactDOM from 'react-dom/client';
import ItemContainer from '/components/ItemContainer';

const App = () => {
	const items = JSON.parse(htmlDecode(allItems));
	// all item data here in JSON format
	console.log(items);
	return (
		<div className='item-div'>
			{items.map((item) => (
				<ItemContainer key={item.id} item={item} />
			))}
		</div>
	);
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
