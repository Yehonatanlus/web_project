import * as React from 'react'
import { useState} from 'react';
import Box from '@mui/material/Box';
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import TextField from '@mui/material/TextField';
import {PollTree} from '../PollTree'
import Answer from './answer'




export interface PollProps {
    poll_tree: PollTree
    use_centering: boolean
    margin: number
    isRecursive: boolean
}

export default function Poll({poll_tree,use_centering,margin,isRecursive}:PollProps) {
    const [question, setQuestion] = useState(poll_tree.question);
    const [answers_followupPolls,setAnswers_followupPolls] = useState({answers: [...poll_tree.answers],followupPolls: [...poll_tree.followupPolls]})
    let {answers,followupPolls} = answers_followupPolls
    function onPollChange(e:any){
        let question:String = e.target.value
        setQuestion(question)
        poll_tree.question = question
        if (question.length > 0 && answers.length ==0){
            answers.push("")
            poll_tree.answers.push("")
            let new_tree = null
            poll_tree.followupPolls.push(new_tree)
            followupPolls.push(new_tree)
            setAnswers_followupPolls({answers:answers,followupPolls:followupPolls})
        }
        if (question.length == 0)
        setAnswers_followupPolls({answers:[],followupPolls:[]})
    }
    function onAnswerChange(answer: String,answer_number:number){
        answers[answer_number] = answer
        poll_tree.answers[answer_number] = answer
        if (answer.length == 0 ){
            followupPolls[answer_number] = null
            poll_tree.followupPolls[answer_number] = null
            if (answer_number != answers.length-1 && answers[answers.length-1].length==0){
                answers.pop()
                poll_tree.answers.pop()
                followupPolls.pop()
                poll_tree.followupPolls.pop()
            }
        }
        else{
            if (followupPolls[answer_number] == null){
                let new_tree = new PollTree("")
                poll_tree.followupPolls[answer_number]=new_tree
                followupPolls[answer_number]=new_tree
            }
            let all_full: boolean = true
            answers.forEach(answer=>{
                if (answer.length  == 0)
                    all_full = false
            })
            if (all_full){
                answers.push("")
                poll_tree.answers.push("")
                let new_tree =null
                followupPolls.push(new_tree)
                poll_tree.followupPolls.push(new_tree)
            }
        }
        setAnswers_followupPolls({answers:answers,followupPolls:followupPolls})
    }
  return (
    <Box
      component="div"
      style= {{width: "100%",margin:margin,textAlign: "center"}}
      //sx={{
        //'& > :not(style)': { m: 1, width: '25ch' },
      ///}}
    >
    <div style={{marginLeft:"auto",marginRight: "auto"}}> 
      <TextField label="Question" variant="outlined" value={question}onChange={onPollChange}></TextField> 
    
      {   answers.length > 0 ?  <ImageList cols={ use_centering ? answers.length+2 : answers.length} key={-5}>
                    {use_centering==true ? <ImageListItem key={-1}></ImageListItem> : null}
                    {followupPolls.map((poll,i) => 
                    <ImageListItem key={2*i} ><Answer  p_answer={answers[i]} answer_number={i} all_answers={answers} onAnswerChange={onAnswerChange}/>
                    {(poll != null && isRecursive )  ?
                    <Poll poll_tree={poll} use_centering={false} margin={1} isRecursive={true}/>
                    : null
                    }
                    </ImageListItem>)}
                     {use_centering==true ? <ImageListItem key={-2}></ImageListItem> : null}
                     </ImageList>  : null
     }
    </div>
    </Box>

  );
}