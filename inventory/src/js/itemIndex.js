import React from "react";
import ReactDOM from "react-dom/client";
import ItemContainer from "/components/ItemContainer";
import Theme from "/components/Themes";
import NavBar from "/components/NavBar";
import Footer from "/components/Footer";

const App = () => {
	const items = JSON.parse(htmlDecode(allItems));
	return (
		<Theme>
			<NavBar />
			{items.map((item, index) => {
				return <ItemContainer key={index} item={item} />;
			})}
			<Footer />
		</Theme>
	);
};

const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(<App />);
