import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Poll from "./poll";
import { PollTree } from "../PollTree";
import axios from "axios";
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Modal } from "@mui/material";
import { Button } from "@mui/material";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export interface FollowupPollProps {}

export default function FollowupPoll({}: FollowupPollProps) {
  const polls: {
    father_poll_id: number | null;
    poll_id: number;
    root_poll_id: number;
    answers: { label: string,id:number }[];
    label: string;
    id: number
  }[] = [];
  const [followupBranch, setfollowupBranch] = useState(null);
  const [answer, setanswer] = useState(null);
  const [pollsState, setPolls] = useState({called:false,polls:polls});
  const [modalState,setModalState] = useState({isOpen: false,title:"",message:""})
  const emptyList: never[] = [];
  const pt = new PollTree("");
  if (pollsState.called ==false){
    axios.get("/api/polls").then((response) => {
      if (response.data.success) {
        let new_polls = response.data.polls;
        new_polls.forEach((p: any,i:number) => {
          p.label = p.question;
          p.id = i
          p.answers=p.answers.map((a:any,j:any)=>{return {label:a,id:j}})
        });
        setPolls({called:true,polls:new_polls});
      }
    });
  }
  
  const sendPoll = ()=>{
    const ans:any = answer
    if (pt.question.length!= 0 && followupBranch!=null && answer!=null){
        console.log(pt)
        let poll = pollsState.polls[followupBranch]
        axios.post(
            "/api/followuppolls",
            {poll: {
              "root_poll_id": poll.root_poll_id,
              "father_poll_id":  poll.poll_id,
              "answer_number": ans.id,
              "question": pt.question,
              "answers":pt.answers.filter((a)=>a.length!=0)
            }}
          ).then(response=>{
            if(response.data.success){
                setModalState({isOpen: true,title:"Success!",message:"Poll sent successfully"})
                //const  pt = new PollTree("")
            }
            else
                setModalState({isOpen: true,title:"Failure!",message: response.data.error_description})
        })
    }
    else{
        setModalState({isOpen: true,title:"Failure!",message: "Question for the poll is not set"})
    }
    
  }

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
        options={pollsState.polls}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Followup question" />
        )}
        value={followupBranch != null ? pollsState.polls[followupBranch] : null}
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
          followupBranch != null ? pollsState.polls[followupBranch].answers : emptyList
        }
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Followup answer" />
        )}
        value={answer != null ? answer : null}
        onChange={(e: any, value: any) =>{
          setanswer(value != null ? value : null)}
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
      <Stack spacing={2} direction="row">
      <Button onClick={sendPoll} style={{margin: "auto"}}>Submit</Button>
      </Stack>
      <Modal
        open={modalState.isOpen}
        onClose={()=>setModalState({isOpen: false,title:"",message:""})}
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
    </Box>
  );
}
