import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Divider from '@mui/material/Divider';
import PollView from "../pollview";
import axios from "axios";
import useToken from "./useToken";

export interface PollsViewProps {}

export default function PollsView() {
  const polls: { poll_id:number, question: string; answers: string[] }[] = [];
  const [pollsState, setPollsState] = useState({ called: false, polls: polls });
  const { getToken, removeToken, setToken } = useToken();

  if (pollsState.called == false) {
    axios.get("/api/rootpolls", { headers: {Authorization: 'Bearer ' + getToken()}}).then((response) => {
      if (response.data.success) {
        const new_polls = response.data.polls;
        setPollsState({ called: true, polls: new_polls });
      }
      if (response.data.access_token){
        setToken(response.data.access_token)
      }
    });
  }

  return (
    <Box
      component="div"
      style={{ width: "100%", margin: 8, textAlign: "center" }}
    >
      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
        {pollsState.polls.map((poll, index) => (
          <React.Fragment  key={index}>
          <PollView
            poll_id = {poll.poll_id}
            question={poll.question}
            answers={poll.answers}
          ></PollView>
          <Divider orientation="horizontal" variant="middle" flexItem ></Divider>
          <br></br>
          </React.Fragment>
          
          
        ))}
      </div>
    </Box>
  );
}
