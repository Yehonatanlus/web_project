import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export interface PollViewProps {
  question: string;
  answers: string[];
}

export default function PollView({ question, answers }: PollViewProps) {
  const [isClicked, setQuestion] = useState(false);
  return (
    <Box
      component="div"
      style={{ width: "100%", margin: 8, textAlign: "center" }}
    >
      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
        <Button
          style={{ margin: 8 }}
          variant="contained"
          onClick={() => setQuestion(!isClicked)}
        >
          {question}
        </Button>
        <Stack spacing={2} direction="row" justifyContent="center">
          {isClicked
            ? answers.map((answer, index) => (
                <Button color="secondary" variant="contained" key={index}>
                  {answer}
                </Button>
              ))
            : null}
        </Stack>
      </div>
    </Box>
  );
}
