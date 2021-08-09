import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 275,
    margin: theme.spacing(2),
  },
  title: {
    fontSize: 14,
  },
  chip: {
    marginTop: 5
  }
}));

export default function TmTaskCard({task}) {
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
      console.log(response);
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
        <Chip className={classes.chip} size="small" label={task.status} color={task.status === "working" ? "primary" : "default"} />
      </CardContent>
      <CardActions>
        <Button size="small" color="secondary" onClick={() => {unsubscribe(task.task_id)}}>Unsubscribe</Button>
      </CardActions>
    </Card>
  );
}
