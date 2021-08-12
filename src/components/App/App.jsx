import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import { TmTaskPage } from '../TmTaskPage';
import { RocksSearchPage } from '../RocksSearchPage';
import { TmBlockSearchPage } from '../TmBlockSearchPage';
import { TmTxSearchPage } from '../TmTxSearchPage';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    width: `calc(100% - ${drawerWidth}px)`,
    maxWidth: `calc(100% - ${drawerWidth}px)`,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      main: blue[700]
    },
  }
});

export default function App() {
  const classes = useStyles();
  const [page, setPage] = React.useState('TENDERMINT TASK');

  const getPage = () => {
    if (page === 'ROCKS') {
      return <RocksSearchPage />;
    } else if (page === 'TENDERMINT BLOCKS') {
      return <TmBlockSearchPage />;
    } else if (page === 'TENDERMINT TXS') {
      return <TmTxSearchPage />;
    } else {
      return <TmTaskPage />;
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              Universal Framework for Chains
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left"
        >
          <div className={classes.toolbar} />
          <Divider />
          <List>
            {['TENDERMINT TASK', 'TENDERMINT BLOCKS', 'TENDERMINT TXS'].map((text, index) => (
              <ListItem button key={index} onClick={() => setPage(text)}>
                  <ListItemText primary={<Typography type="body2" style={{ color: text === page ? blue[700] : null }}>{text}</Typography>}/>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['ROCKS'].map((text, index) => (
              <ListItem button key={index} onClick={() => setPage(text)}>
               <ListItemText primary={<Typography type="body2" style={{ color: text === page ? blue[700] : null }}>{text}</Typography>}/>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {getPage()}
        </main>
      </div>
    </ThemeProvider>
  );
}
