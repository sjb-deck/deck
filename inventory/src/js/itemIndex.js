import React from "react";
import ReactDOM from "react-dom/client";
import ItemContainer from "/components/ItemContainer";
import Theme from "/components/Themes";
import NavBar from "/components/NavBar/NavBar";
import Footer from "/components/Footer";

export const user = JSON.parse(htmlDecode(userInfo))[0];
export const items = JSON.parse(htmlDecode(allItems));

const ItemIndex = () => {
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
root.render(<ItemIndex />);
