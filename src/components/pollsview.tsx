import * as React from "react";
import Box from "@mui/material/Box";
import PollView from "../pollview";

const questions: { desc: string; answers: string[] }[] = [
  { desc: "how are you?", answers: ["good", "bad"] },
  { desc: "are you sure?", answers: ["yes", "no"] },
];

export interface PollsViewProps {}

export default function PollsView() {
  return (
    <Box
      component="div"
      style={{ width: "100%", margin: 8, textAlign: "center" }}
    >
      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
        {questions.map((question, index) => (
          <PollView
            key={index}
            question={question.desc}
            answers={question.answers}
          ></PollView>
        ))}
      </div>
    </Box>
  );
}
