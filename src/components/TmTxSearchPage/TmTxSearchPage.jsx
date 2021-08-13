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
import { checkJson } from '../../utils/json';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { constants } from '../../constants/constants';

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
  tx: {
    marginBottom: theme.spacing(2),
  }
}));

export default function TmTxSearchPage() {
  const classes = useStyles();

  const [fromHeight, setFromHeight] = React.useState();
  const [toHeight, setToHeight] = React.useState();
  const [txhash, setTxhash] = React.useState();
  const [order, setOrder] = React.useState('desc');
  const [rows, setRows] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState(false);

  const getTxs = () => {
    if (!txhash && (!fromHeight || !toHeight || !order)) {
      return;
    }

    let params;
    if (txhash) {
      params = {txhash: txhash};
    } else {
      params = {from_height: parseInt(fromHeight), to_height: parseInt(toHeight), order: order};
    }
    axios.post("http://localhost:8080", {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "tm_mysql_get_txs",
      "params": params
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
  }

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
            <TextField 
              error={!txhash}
              margin="dense" 
              id="txhash" 
              label="TX HASH" 
              type="text" 
              fullWidth
              className={classes.item}
              onChange={(e) => {setTxhash(e.target.value)}}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box pl={4}>
            <FormControl fullWidth>
              <InputLabel id="order-label">ORDER</InputLabel>
                <Select
                  labelId="order-label"
                  id="order"
                  value={order}
                  onChange={(e) => {setOrder(e.target.value)}}
                >
                <MenuItem value={"desc"}>DESC</MenuItem>
                <MenuItem value={"asc"}>ASC</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Box component="div" m={2} style={{ textAlign: "center" }}>
            <Button variant="contained" color="primary" onClick={getTxs}>GET TXS</Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          {
            rows && rows.length > 0 ?
            rows.map((row, index) => {
              const isJson = checkJson(row["raw_log"]);
              const rawLog = isJson ? JSON.parse(row["raw_log"]) : row["raw_log"];
              row["raw_log"] = rawLog;
              return (
                <Paper key={index} className={classes.tx}>
                  <Box component="div" p={2}>
                    <pre>{JSON.stringify(row, null, 2)}</pre>
                  </Box>
                </Paper>)
            }):
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
        autoHideDuration={constants.autoHideTime}
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