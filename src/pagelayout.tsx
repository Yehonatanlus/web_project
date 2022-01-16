import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import useToken from './components/useToken';

export interface MyLayoutProps {
  isOpen: boolean;
  pageList: string[];
  setActivePage: (activePage: string) => void;
  children: JSX.Element;
  setLogin: (isLoggedIn: number) => void;
}

export default function MyLayout({
  isOpen,
  pageList,
  setActivePage,
  children,
  setLogin,
}: MyLayoutProps) {
  const [state, setState] = React.useState(isOpen);
  const { getToken, removeToken, setToken } = useToken();

  const toggleDrawer =
    (newState: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState(newState);
    };

  const list = () => (
    <Box
      sx={{ width: 250, textAlign: "left" }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem></ListItem>
        {pageList.map((pageTitle, index) => (
          <ListItem button key={index} onClick={() => setActivePage(pageTitle)}>
            <ListItemIcon></ListItemIcon>
            <ListItemText primary={pageTitle} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const handleLogout = () =>{
    removeToken();
    setLogin(0); 
  };

  const open: boolean = state;
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              The Polling Service
            </Typography>
            <Button color="inherit" onClick={handleLogout}>Log Out</Button>
          </Toolbar>
        </AppBar>
        {children}
      </Box>
      <Drawer anchor="left" open={state} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </div>
  );
}
