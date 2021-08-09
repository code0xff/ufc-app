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

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.background.default,
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

  React.useEffect(() => {
    loadTasks();
  });

  const loadTasks = () => {
    axios.post('http://localhost:8080', {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "tm_get_tasks",
      "params": {}
    })
    .then(response => {
      setTasks(response['data']['result']);
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
        setTarget('block');
        setSubId('');
        setStartHeight('');
        setNodes('');
        setOpen(false);
        alert(response.data.result);
      })
      .catch(err => {
        console.error(err);
      });
    } 
  };

  return (
    <div className={classes.root}>
      { tasks ? tasks.map((task, index) => <TmTaskCard key={index} task={task}/>) : null }
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
    </div>
  );
}
