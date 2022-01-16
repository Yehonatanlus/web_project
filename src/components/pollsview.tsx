import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import PollView from "../pollview";
import axios from "axios";

export interface PollsViewProps {}

export default function PollsView() {
  const polls: { question: string; answers: string[] }[] = [];
  const [pollsState,setPollsState] = useState({ called: false, polls: polls });

  if (pollsState.called == false) {
    axios.get("/api/polls").then((response) => {
      if (response.data.success) {
        const new_polls = response.data.polls;
        setPollsState({ called: true, polls: new_polls });
      }
    })}

  return (
    <Box
      component="div"
      style={{ width: "100%", margin: 8, textAlign: "center" }}
    >
      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
        {pollsState.polls.map((poll, index) => (
          <PollView
            key={index}
            question={poll.question}
            answers={poll.answers}
          ></PollView>
        ))}
      </div>
    </Box>
  );
}
