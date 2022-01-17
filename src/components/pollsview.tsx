import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import PollView from "../pollview";
import axios from "axios";

export interface PollsViewProps {}

export default function PollsView() {
  const polls: { poll_id:number, question: string; answers: string[] }[] = [];
  const [pollsState, setPollsState] = useState({ called: false, polls: polls });

  if (pollsState.called == false) {
    axios.get("/api/rootpolls").then((response) => {
      if (response.data.success) {
        const new_polls = response.data.polls;
        setPollsState({ called: true, polls: new_polls });
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
          <br></br>
          </React.Fragment>
          
        ))}
      </div>
    </Box>
  );
}
