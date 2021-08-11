import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TmTaskCard } from '../TmTaskCard';
import axios from 'axios';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Snackbar from '@material-ui/core/Snackbar';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
  },
}));

export default function TmTaskPage() {
  const classes = useStyles();

  const [tasks, setTasks] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [subId, setSubId] = React.useState();
  const [startHeight, setStartHeight] = React.useState();
  const [nodes, setNodes] = React.useState();
  const [target, setTarget] = React.useState('block');
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [message, setMessage] = React.useState('block');
  const [taskId, setTaskId] = React.useState();

  React.useEffect(() => {
    loadTasks();
  });

  const loadTasks = () => {
    axios.post('http://localhost:8080', {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "tm_get_tasks",
      "params": {
        task_id: taskId
      }
    })
    .then(response => {
      const result = response['data']['result'];
      if (result["error"]) {
        setSnackOpen(true);
        setMessage(result["error"]);
      } else {
        setTasks(result);
      }
    })
    .catch(err => {
      console.error(err);
    });
  };

  const createTask = () => {
    if (subId && startHeight && nodes) {
      const nodesArray = nodes.split(",").map(node => node.trim());
      
      axios.post('http://localhost:8080', {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tm_subscribe",
        "params": {
          target: target,
          sub_id: subId,
          start_height: parseInt(startHeight),
          nodes: nodesArray
        }
      })
      .then(response => {
        const result = response['data']['result'];
        setTarget('block');
        setSubId('');
        setStartHeight('');
        setNodes('');
        setOpen(false);
        setSnackOpen(true);
        setMessage(result["error"] ? result["error"] : result);
      })
      .catch(err => {
        console.error(err);
      });
    } 
  };

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <Box component="div">
            <TextField 
              margin="dense" 
              id="task_id" 
              label="TASK ID" 
              type="text" 
              fullWidth
              onChange={(e) => {setTaskId(e.target.value)}}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        {tasks ? 
          tasks.map((task, index) => (
            <Grid item xs={6}>
              <TmTaskCard key={index} task={task} setSnackOpen={setSnackOpen} setMessage={setMessage}/>        
            </Grid>)) : 
        null}
      </Grid>
      <Fab color="primary" aria-label="add" className={classes.fab} onClick={() => {setOpen(true)}}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={() => {setOpen(false)}} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">TENDERMINT TASK</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please input tendermint subscribing task information...
          </DialogContentText>
          <FormControl component="fieldset">
            <FormLabel component="legend">TARGET</FormLabel>
            <RadioGroup row aria-label="target" name="target" value={target} onChange={(e) => {setTarget(e.target.value)}}>
              <FormControlLabel value="block" control={<Radio />} label="BLOCK" />
              <FormControlLabel value="tx" control={<Radio />} label="TX" />
            </RadioGroup>
          </FormControl>
          <TextField 
            error={!subId}
            margin="dense" 
            id="sub_id" 
            label="SUBSCRIPTION ID" 
            type="text" 
            fullWidth 
            onChange={(e) => {setSubId(e.target.value)}}
          />
          <TextField 
            error={!startHeight}
            margin="dense" 
            id="start_height" 
            label="START HEIGHT" 
            type="text" 
            fullWidth 
            onChange={(e) => {setStartHeight(e.target.value)}}
          />
          <TextField 
            error={!nodes}
            margin="dense" 
            id="nodes" 
            label="NODES" 
            type="text" 
            fullWidth 
            onChange={(e) => {setNodes(e.target.value)}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {setOpen(false)}} color="secondary">
            CANCEL
          </Button>
          <Button onClick={createTask} color="primary">
            SUBSCRIBE
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackOpen}
        autoHideDuration={5000}
        onClose={() => {setSnackOpen(false)}}
        message={message}
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => {setSnackOpen(false)}}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}
