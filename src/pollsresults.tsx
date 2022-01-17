import React, { useEffect, useState } from "react";
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

  // useEffect (() => {
  //   getAllVotes();
  // }, []);

  const getAllVotes = (poll_id) => {
    console.log(poll_id)
    axios({
      method: "GET",
      url:"/api/votes",
      data:{
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
    <div>
      <Stack spacing={2} direction="row" justifyContent="center">
        <Box
          component="div"
          style={{ width: "100%", margin: 8, textAlign: "center" }}
        >
          <Autocomplete
            style={{
              margin: 8,
              marginLeft: "auto",
              marginRight: "auto",
              display: "inline-block",
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
              if (question != null){
                getAllVotes(polls[question].poll_id);
                console.log(votes)
              }


            }}
          />
        </Box>
      </Stack>
      <Box
        component="div"
        style={{ width: "100%", margin: "auto", textAlign: "center" }}
      >
       <Chart votes={votes}></Chart>
       <Autocomplete
            style={{ marginLeft: "auto", marginRight: "auto" }}
            disablePortal
            options={
              question != null
                ? polls[question].answers
                : []
            }
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Answer" />}
            value={answerList != null ? { label: answerList } : null}
            onChange={(e: any, value: any) =>
              setAnswerList(value != null ? value.label : null)
            }
            isOptionEqualToValue={(option, value) =>
              option.label == value.label
            }
          />
      </Box>
    </div>
  );
}
