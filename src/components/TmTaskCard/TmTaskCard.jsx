import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  title: {
    fontSize: 14,
  },
  chip: {
    marginTop: 5
  }
}));

export default function TmTaskCard({task, setSnackOpen, setMessage}) {
  const classes = useStyles();

  const unsubscribe = (taskId) => {
    axios.post('http://localhost:8080', {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "tm_unsubscribe",
      "params": {
        "task_id": taskId
      }
    })
    .then(response => {
      const result = response["data"]["result"];
      setSnackOpen(true);
      setMessage(result["error"] ? result["error"] : result);
    })
    .catch(err => {
      console.error(err);
    });
  };

  const resubscribe = (taskId) => {
    axios.post('http://localhost:8080', {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "tm_resubscribe",
      "params": {
        "task_id": taskId
      }
    })
    .then(response => {
      const result = response["data"]["result"];
      setSnackOpen(true);
      setMessage(result["error"] ? result["error"] : result);
    })
    .catch(err => {
      console.error(err);
    });
  };

  const stop = (taskId) => {
    axios.post('http://localhost:8080', {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "tm_stop_subscription",
      "params": {
        "task_id": taskId
      }
    })
    .then(response => {
      const result = response["data"]["result"];
      setSnackOpen(true);
      setMessage(result["error"] ? result["error"] : result);
    })
    .catch(err => {
      console.error(err);
    });
  };


  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {task.task_id}
        </Typography>
        <Typography variant="body2" component="p">
          TARGET: {task.target}
        </Typography>
        <Typography variant="body2" component="p">
          SUBSCRIPTION ID: {task.sub_id}
        </Typography>
        <Typography variant="body2" component="p">
          START HEIGHT: {task.start_height}
        </Typography>
        <Typography variant="body2" component="p">
          CURRENT HEIGHT: {task.curr_height}
        </Typography>
        <Typography variant="body2" component="p">
          NODES: {task.nodes}
        </Typography>
        <Box mt={1}>
          {
            task.status === "working" ?
            <Chip className={classes.chip} size="small" label={task.status} color={"primary"} /> :
            <Tooltip title={task.err_msg} aria-label="err" placement="right">
              <Chip className={classes.chip} size="small" label={task.status} color={"default"} />
            </Tooltip>
          }
        </Box>
      </CardContent>
      <CardActions>
        <Grid container justifyContent="flex-end">
          {
            task.status === "working" ?
            <Button size="small" color="default" onClick={() => {stop(task.task_id)}}>Stop</Button> : 
            <Button size="small" color="primary" onClick={() => {resubscribe(task.task_id)}}>Resubscribe</Button>
          }
          <Button size="small" color="secondary" onClick={() => {unsubscribe(task.task_id)}}>Unsubscribe</Button>
        </Grid>
      </CardActions>
    </Card>
  );
}
