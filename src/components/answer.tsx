import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export interface AnswerProps {
  p_answer: String;
  answer_number: number;
  all_answers: String[];
  onAnswerChange: (answer: string, answer_number: number) => void;
}

export default function Answer({
  p_answer,
  answer_number,
  onAnswerChange,
}: AnswerProps) {
  function onAnswerChangeEvent(e: any) {
    onAnswerChange(e.target.value, answer_number);
  }
  return (
    <Box style={{ margin: 5.5 }}>
      <TextField
        label="Answer"
        variant="outlined"
        autoComplete="off"
        value={p_answer}
        onChange={onAnswerChangeEvent}
      />
    </Box>
  );
}
