import React from "react";
import { user } from "/inventory/src/js/itemIndex.js";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { UserAvatar } from "../UserAvatar";
import Button from "@mui/material/Button";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "../Themes";
import { useTheme } from "@mui/material/styles";
import { navItems } from "./NavBar";
import { navIcons } from "./NavBar";
import { URL_LOGOUT, URL_PROFILE } from "../../globals";

/**
 * A React component that renders the NavDrawer
 * ie. the container on the right for mobile when
 * hamburger icon on NavBar is clicked
 * @returns NavDrawer
 */

export const NavDrawer = () => {
	const theme = useTheme();
	const colorMode = React.useContext(ColorModeContext);

	return (
		<Box sx={{ textAlign: "center" }}>
			<Box
				sx={{
					my: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
				}}
			>
				<UserAvatar size={100} />
				<Typography variant='h6' sx={{ mt: 2 }}>
					Hello, {user.fields.name}
				</Typography>
				<Typography variant='caption'>{user.fields.role}</Typography>
			</Box>
			<Divider />
			<List>
				<ListItem disablePadding>
					<Button
						fullWidth
						sx={{ justifyContent: "center", textTransform: "none" }}
						startIcon={<AccountCircleIcon />}
						onClick={() => (window.location.href = URL_PROFILE)}
					>
						Profile
					</Button>
				</ListItem>
				<ListItem disablePadding>
					<Button
						fullWidth
						sx={{ justifyContent: "center", textTransform: "none" }}
						startIcon={
							theme.palette.mode === "dark" ? (
								<Brightness7Icon />
							) : (
								<Brightness4Icon />
							)
						}
						onClick={colorMode.toggleColorMode}
					>
						Toggle Mode
					</Button>
				</ListItem>
			</List>
			<Divider />
			<List>
				{navItems.map((item, index) => (
					<ListItem key={item} disablePadding>
						<Button
							fullWidth
							sx={{ justifyContent: "center", textTransform: "none" }}
							startIcon={navIcons[index]}
						>
							{item}
						</Button>
					</ListItem>
				))}
			</List>
			<Divider />
			<List>
				<ListItem disablePadding>
					<Button
						fullWidth
						sx={{ justifyContent: "center", textTransform: "none" }}
						startIcon={<LogoutIcon />}
						onClick={() => (window.location.href = URL_LOGOUT)}
					>
						Logout
					</Button>
				</ListItem>
			</List>
		</Box>
	);
};
