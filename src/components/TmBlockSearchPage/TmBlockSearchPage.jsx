import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  input: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  block: {
    marginBottom: theme.spacing(2)
  }
}));

export default function TmBlockSearchPage() {
  const classes = useStyles();

  const [fromHeight, setFromHeight] = React.useState();
  const [toHeight, setToHeight] = React.useState();
  const [order, setOrder] = React.useState('asc');
  const [rows, setRows] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState(false);

  const getBlocks = () => {
    if (!fromHeight || !toHeight || !order) {
      return;
    }
    axios.post('http://localhost:8080', {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "tm_mysql_get_blocks",
      "params": {
        from_height: parseInt(fromHeight),
        to_height: parseInt(toHeight),
        order: order,
      }
    })
    .then(response => {
      let result = response["data"]["result"];
      if (result["error"]) {
        setOpen(true);
        setMessage(result["error"]);
      } else {
        setRows(result);
      }
    })
    .catch(err => {
      console.error(err);
    });
  };

  return (
    <div className={classes.root}>
      <Grid container className={classes.input}>
        <Grid item xs={6}>
          <Box pr={4}>
            <TextField 
              error={!fromHeight}
              margin="dense" 
              id="from_height" 
              label="FROM HEIGHT" 
              type="text" 
              fullWidth
              className={classes.item}
              onChange={(e) => {setFromHeight(e.target.value)}}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box pl={4}>
            <TextField 
              error={!toHeight}
              margin="dense" 
              id="to_height" 
              label="TO HEIGHT" 
              type="text" 
              fullWidth
              className={classes.item}
              onChange={(e) => {setToHeight(e.target.value)}}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container className={classes.input}>
        <Grid item xs={6}>
          <Box pr={4}>
            <FormControl fullWidth>
              <InputLabel id="order-label">ORDER</InputLabel>
                <Select
                  labelId="order-label"
                  id="order"
                  value={order}
                  onChange={(e) => {setOrder(e.target.value)}}
                >
                <MenuItem value={"asc"}>ASC</MenuItem>
                <MenuItem value={"desc"}>DESC</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Box component="div" m={2} style={{ textAlign: "center" }}>
            <Button variant="contained" color="primary" onClick={getBlocks}>GET BLOCKS</Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          {
            rows && rows.length > 0 ?
            rows.map((row, index) => (
              <Paper key={index} className={classes.block}>
                <Box component="div" p={2}>
                  <pre>{JSON.stringify(row, null, 2)}</pre>
                </Box>
              </Paper>
            )):
            <Paper>
              <Box component="div" p={2}>
                <Typography style={{textAlign: "center"}}>Empty</Typography> 
              </Box>
            </Paper>
          }
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
