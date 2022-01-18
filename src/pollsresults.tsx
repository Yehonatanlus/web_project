import React, { useEffect, useState, useLayoutEffect} from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Chart from "./components/chart";
import useToken from "./components/useToken";
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
  const emptyPolls: { label: string; id: number; answers: { label: string }[] }[] = [];

  const [question, setQuestion] = useState(null);
  const [answerList, setAnswerList] = useState(null);
  const [polls, setPolls] = useState([]);
  const [votes, setVotes] = useState([]);
  const [chartData, setChartData] = useState([]);
  const { getToken, removeToken, setToken } = useToken();

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
    setChartData([
        { value: 10, category: "One" },
        { value: 9, category: "Two" },
        { value: 6, category: "Three" },
        { value: 5, category: "Four" },
        { value: 4, category: "Five" },
        { value: 3, category: "Six" },
        { value: 1, category: "Seven" },
      ]);
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
              setAnswerList(
                value == null || value.id != question
                  ? null
                  : answerList
              );
              if (value != null){
                getAllVotes(value.poll_id);
              }
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
            value={answerList != null ? { label: answerList } : null}
            onChange={(e: any, value: any) => {
              setAnswerList(value != null ? value.label : null);
            }}
            isOptionEqualToValue={(option, value) =>
              option.label == value.label
            }
          />
      </Stack>
      <Box
        component="div"
        style={{ width: "100%", margin: "auto", textAlign: "center" }}
      >
       <Chart data={chartData}></Chart>
      </Box>
    </Box>
    
  );
}
