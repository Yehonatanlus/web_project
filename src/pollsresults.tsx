import React, { useEffect, useState, useLayoutEffect} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Chart from "./components/chart";
import useToken from "./components/useToken";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import axios from "axios";


// var questions: { label: string; id: number; answers: { label: string }[] }[] = [];
  // [
  //   { label: "how", id: 0, answers: [{ label: "y" }, { label: "n" }] },
  //   { label: "where", id: 1, answers: [{ label: "here" }, { label: "there" }] },
  //   {
  //     label: "why",
  //     id: 2,
  //     answers: [{ label: "because" }, { label: "duo to" }],
  //   },
  // ];


export default function PollsResults() {
  // const emptyPolls: { label: string; id: number; answers: { label: string }[] }[] = [];

  const [question, setQuestion] = useState(null);
  const [currAnswer, setCurrAnswer] = useState(null);
  const [polls, setPolls] = useState([]);
  const [votes, setVotes] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [usersList, setUsersList] = useState(null);
  const { getToken, removeToken, setToken } = useToken();

  useEffect (() => {
    generateUsersList();
  }, [currAnswer]);

  const generateUsersList = () => {
    if(currAnswer != null){
      var list_items = []

      for (const vote of votes) {
        if(vote.answer_number === currAnswer.id){
          list_items = list_items.concat([(
            <ListItem>
            <ListItemText
              primary={vote.username}
              secondary={"chat_id: "+ vote.chat_id}
            />
            </ListItem>
          )])
        }
      }

      if (list_items.length > 0){
        setUsersList(list_items);
      }else{
        setUsersList(null);
      }
    }
    else{
      setUsersList(null);
    }
  }


  useEffect (() => {
    getAllPolls();
  }, []);

  const getAllPolls = () => {
    axios({
      method: "GET",
      url:"/api/polls",
      headers: {
          Authorization: 'Bearer ' + getToken()
      }
    })
    .then((response) => {  
      if (response.data.success) {
        let new_polls = response.data.polls;
        new_polls.forEach((p: any, i: number) => {
          p.label = `#${p.poll_id} ${p.question}`;
          p.id = i;
          p.answers = p.answers.map((a: any, j: any) => {
            return { label: a, id: j };
          });
        });
        setPolls(new_polls);
      }
    }).catch((error) => {
      if (error.response) {
          console.log(error.response);
        }
    })
  }


  useEffect (() => {
    createChartData();
  }, [votes]);

  const createChartData = () =>{
    if(question != null){
      let data = [];
      if(votes.length > 0){
        for (const answer of polls[question].answers) { data.push({value: 0, category: answer.label}); }
        for (const vote of votes) { 
          data[vote.answer_number].value += 1;
        }
        setChartData(data);
      }
      else{
        for (const answer of polls[question].answers) { data.push({value: 0, category: answer.label}); }
        setChartData(data);
      }
    }
    else{
      setChartData([]);
    }
  };

  const getAllVotes = (poll_id) => {
    axios({
      method: "GET",
      url:"/api/votes",
      params:{
        poll_id: poll_id
      },
      headers: {
          Authorization: 'Bearer ' + getToken()
      }
    })
    .then((response) => {  
      if (response.data.votes) {
        setVotes(response.data.votes)
      }
    }).catch((error) => {
      if (error.response) {
          console.log(error.response);
        }
    })
  }  

  return (
    <Box>
      <Stack spacing={2} direction="row" justifyContent="center">
          <Autocomplete
            style={{
              padding: 20,
            }}
            disablePortal
            options={polls}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Question" />}
            value={
              question != null ? polls[question] : null
            }
            onChange={(e: any, value: any) => {
              setQuestion(value != null ? value.id : null);
              setCurrAnswer(
                value == null || value.id != question
                  ? null
                  : currAnswer
              );
              if (value != null){
                getAllVotes(value.poll_id);
              }
              setVotes([]);
            }}
          />
        <Autocomplete
            style={{              
              padding: 20,
              }}
            disablePortal
            options={
              question != null
                ? polls[question].answers
                : []
            }
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Answer" />}
            value={currAnswer != null ? { label: currAnswer.label } : null}
            onChange={(e: any, value: any) => {
              setCurrAnswer(value != null ? value : null);
            }}
            isOptionEqualToValue={(option, value) =>
              option.label == value.label
            }
          />
      </Stack>
      <Stack spacing={2} direction="row" justifyContent="center">
        <Box
          component="div"
          style={{ width: "100%", margin: "auto", textAlign: "center" }}
        >
         <Chart data={chartData }></Chart>
        </Box>
        {usersList ?  <Divider orientation="vertical" flexItem></Divider> : null}
        <List sx={{ width: '100%', maxWidth: 360, maxHeight:400  }}>
          {usersList ?  <Typography variant="h4" gutterBottom component="div" color="#2196f3">Users Answered</Typography> : null}
          {usersList}
        </List>
      </Stack>
    </Box>
    
  );
}
