import { useEffect } from 'react';
import APIService from './services/ApiService';
import Calender from './components/calender/Calender';
import Paper from '@mui/material/Paper';
import { makeStyles } from "@mui/styles";


// import './App.css';
import './App.scss';

export default function App() {
  const classes = useStyles();

  useEffect(() => {
    APIService.get("api/v1/data/get-all");
  }, []);

  return (
    <div className={"App " + classes.root}>
      <Calender></Calender>
      {/* <Paper className="paper-statistic" elevation={3}>
        <h3>Thống kê tháng XXX</h3>
      </Paper> */}
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",

    "& .paper-statistic": {
      flex: 1,
      margin: "8px 8px 0 8px",
    },
  },
});