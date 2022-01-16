import React, { useState } from "react";
import Poll from "./poll";
import { Button } from "@mui/material";
import { PollTree } from "../PollTree";
import { Modal } from "@mui/material";
import axios from "axios";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export interface PollWrapperProps {}

export default function PollWrapper({}: PollWrapperProps) {
  const pt = new PollTree("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [ptState, setPtState] = useState(pt);

  const sendPoll = () => {
    if (ptState.question.length != 0) {
      axios
        .post("/api/polls", { tree_poll: ptState.ToJson() })
        .then((response) => {
          if (response.data.success) {
            setModalState({
              isOpen: true,
              title: "Success!",
              message: "Poll sent successfully",
            });
            const pt = new PollTree("");
            setPtState(pt);
          } else
            setModalState({
              isOpen: true,
              title: "Failure!",
              message: response.data.error_description,
            });
        });
    } else {
      setModalState({
        isOpen: true,
        title: "Failure!",
        message: "Question for the poll is not set",
      });
    }
  };

  return (
    <React.Fragment>
      <Poll
        poll_tree={ptState}
        use_centering={true}
        margin={8}
        isRecursive={true}
      ></Poll>
      <Stack spacing={2} direction="row">
        <Button onClick={sendPoll} style={{ margin: "auto" }}>
          Submit
        </Button>
      </Stack>
      <Modal
        open={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, title: "", message: "" })}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {modalState.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {modalState.message}
          </Typography>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
