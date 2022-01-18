import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import axios from "axios";
import useToken from './components/useToken';

export interface PollViewProps {
  poll_id: number;
  question: string;
  answers: string[];
}

export default function PollView({
  poll_id,
  question,
  answers,
}: PollViewProps) {
  const [isQuestionClicked, setQuestion] = useState(false);
  const [AnsweresClick, setAnswersClick] = useState(
    Array(answers.length).fill({
      poll_id: null,
      question: "",
      answers: [],
      isOpen: false,
    })
  );

  const { getToken, removeToken, setToken } = useToken();
  const handleAnswerClick = (i: number) => {
    return () => {
      if (AnsweresClick[i].isOpen) {
        AnsweresClick[i].isOpen = false;
        setAnswersClick([...AnsweresClick]);
        return;
      } else {
        axios
          .get("/api/followuppoll", {
            params: {
              father_poll_id: poll_id,
              branch_answer_number: i,
            },
            headers: {Authorization: 'Bearer ' + getToken()}
          })
          .then((response) => {
            if (response.data.success && response.data.poll != null) {
              AnsweresClick[i] = {
                poll_id: response.data.poll.poll_id,
                question: response.data.poll.question,
                answers: response.data.poll.answers,
                isOpen: true,
              };
              setAnswersClick([...AnsweresClick]);
              setAnswersClick(AnsweresClick);
            }
            if (response.data.access_token){
              setToken(response.data.access_token)
            }
          });
      }
    };
  };

  return (
    <Box
      component="div"
      style={{ width: "100%", margin: 8, textAlign: "center" }}
    >
      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
        <Button
          style={{ margin: 8 }}
          variant="contained"
          onClick={() => {
            setQuestion(!isQuestionClicked);
            AnsweresClick.forEach((p) => (p.isOpen = false));
            setAnswersClick([...AnsweresClick]);
          }}
        >
          {`#${poll_id} ${question}`}
        </Button>
        <Stack spacing={2} direction="row" justifyContent="center">
          {isQuestionClicked
            ? answers.map((answer, index) => (
                <Button
                  color="secondary"
                  variant="contained"
                  key={index}
                  onClick={handleAnswerClick(index)}
                >
                  {answer}
                </Button>
              ))
            : null}
        </Stack>
        <Stack spacing={2} direction="row" justifyContent="center">
          {
            AnsweresClick.map(a=>
              a.isOpen ? <PollView key={a.poll_id} poll_id ={a.poll_id} question={a.question} answers={a.answers}></PollView> : null
            )
          }
        </Stack>
      </div>
    </Box>
  );
}
