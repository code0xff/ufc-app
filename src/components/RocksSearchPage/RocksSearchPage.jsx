import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  }
}));

export default function RocksSearchPage() {
  const classes = useStyles();

  const [key, setKey] = React.useState();
  const [value, setValue] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState();

  const findByKey = () => {
    if (!key) {
      return;
    }
    axios.post('http://localhost:8080', {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "find_by_key",
      "params": {
        key,
      }
    })
    .then(response => {
      const result = response["data"]["result"];
      if (result["error"]) {
        setOpen(true);
        setMessage(result["error"]);
      } else {
        setValue(result);
      }
    })
    .catch(err => {
      console.error(err);
    });
  };

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <Box component="div">
            <TextField 
              error={!key}
              margin="dense" 
              id="key" 
              label="KEY" 
              type="text" 
              fullWidth
              onChange={(e) => {setKey(e.target.value)}}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Box component="div" m={2} style={{ textAlign: "center" }}>
            <Button variant="contained" color="primary" onClick={findByKey}>FIND BY KEY</Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Paper>
            <Box component="div" p={2}>
              { 
                value ? 
                <pre>{JSON.stringify(value, null, 2)}</pre> : 
                <Typography style={{textAlign: "center"}}>Empty</Typography> 
              }
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={5000}
        onClose={() => {setOpen(false)}}
        message={message}
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => {setOpen(false)}}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}
