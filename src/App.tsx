import { makeStyles } from "@mui/styles";
import { useEffect } from 'react';
import Calender from './components/calender/Calender';
import APIService from './services/ApiService';

import './App.scss';

export default function App() {
  const classes = useStyles();

  useEffect(() => {
    APIService.get("api/v1/data/get-all");
  }, []);

  return (
    <div className={"App " + classes.root}>
      <Calender></Calender>
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflowX: "hidden",

    "& .paper-statistic": {
      flex: 1,
      margin: "8px 8px 0 8px",
    },
  },
});