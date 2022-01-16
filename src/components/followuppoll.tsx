import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Poll from "./poll";
import { PollTree } from "../PollTree";

const questions: { label: string; id: number; answers: { label: string }[] }[] =
  [
    { label: "how", id: 0, answers: [{ label: "y" }, { label: "n" }] },
    { label: "where", id: 1, answers: [{ label: "here" }, { label: "there" }] },
    { label: "why", id: 2, answers: [{ label: "because" }, { label: "duo to" },
  ],
    },
  ];

export interface FollowupPollProps {}

export default function FollowupPoll({}: FollowupPollProps) {
  const [followupBranch, setfollowupBranch] = useState(null);
  const [answer, setanswer] = useState(null);
  const emptyList: never[] = [];
  const pt = new PollTree("");
  return (
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
        options={questions}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Followup question" />
        )}
        value={followupBranch != null ? questions[followupBranch] : null}
        onChange={(e: any, value: any) => {
          setfollowupBranch(value != null ? value.id : null);
          setanswer(
            value == null || value.id != followupBranch ? null : answer
          );
        }}
      />
      <Autocomplete
        style={{ marginLeft: "auto", marginRight: "auto" }}
        disablePortal
        options={
          followupBranch != null ? questions[followupBranch].answers : emptyList
        }
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Followup answer" />
        )}
        value={answer != null ? { label: answer } : null}
        onChange={(e: any, value: any) =>
          setanswer(value != null ? value.label : null)
        }
        isOptionEqualToValue={(option, value) => option.label == value.label}
      />
      {followupBranch == null || answer == null ? null : (
        <Poll
          poll_tree={pt}
          use_centering={false}
          margin={16}
          isRecursive={false}
        ></Poll>
      )}
    </Box>
  );
}
