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

  const [followupBranch, setfollowupBranch] = useState([null, null]);
  const [answer, setanswer] = useState([null, null]);
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
              followupBranch[0] != null ? polls[followupBranch[0]] : null
            }
            onChange={(e: any, value: any) => {
              setfollowupBranch([
                value != null ? value.id : null,
                followupBranch[1],
              ]);
              setanswer(
                value == null || value.id != followupBranch[0]
                  ? [null, answer[1]]
                  : answer
              );
            }}
          />
          <Autocomplete
            style={{ marginLeft: "auto", marginRight: "auto" }}
            disablePortal
            options={
              followupBranch[0] != null
                ? polls[followupBranch[0]].answers
                : []
            }
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Answer" />}
            value={answer[0] != null ? { label: answer[0] } : null}
            onChange={(e: any, value: any) =>
              setanswer([value != null ? value.label : null, answer[1]])
            }
            isOptionEqualToValue={(option, value) =>
              option.label == value.label
            }
          />
        </Box>
        {/* <Box
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
            options={questions}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Question" />}
            value={
              followupBranch[1] != null ? questions[followupBranch[1]] : null
            }
            onChange={(e: any, value: any) => {
              setfollowupBranch([
                followupBranch[0],
                value != null ? value.id : null,
              ]);
              setanswer(
                value == null || value.id != followupBranch[1]
                  ? [answer[0], null]
                  : answer
              );
            }}
          />
          <Autocomplete
            style={{ marginLeft: "auto", marginRight: "auto" }}
            disablePortal
            options={
              followupBranch[1] != null
                ? questions[followupBranch[1]].answers
                : emptyList
            }
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Answer" />}
            value={answer[1] != null ? { label: answer[1] } : null}
            onChange={(e: any, value: any) =>
              setanswer([answer[0], value != null ? value.label : null])
            }
            isOptionEqualToValue={(option, value) =>
              option.label == value.label
            }
          />
        </Box> */}
      </Stack>
      <Box
        component="div"
        style={{ width: "100%", margin: "auto", textAlign: "center" }}
      >
       <Chart></Chart>
      </Box>
    </div>
  );
}
