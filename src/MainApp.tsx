import "./App.css";
import FollowupPoll from "./components/followuppoll";
import AdminPanel from "./components/adminPanel";
import { PollTree } from "./PollTree";
import MyDrawer from "./pagelayout";
import { useState } from "react";
import PollsView from "./components/pollsview";
import PollsResults from "./pollsresults";
import PollWrapper from "./components/pollwrapper";
import Login from './components/Login';
import axios from 'axios';
import useToken from './components/useToken';



export default function MainApp(props :any) : any {
  const [activePage, setActivePage] = useState("New Poll");
  const [isLoggedIn, setLogin] = useState(0);
  const { getToken, removeToken, setToken } = useToken();

  let token = getToken();
  if (token && token !== "" && token !==  undefined && token !== null){
    axios({
        method: "POST",
        url:"/api/token",
        headers: {
            Authorization: 'Bearer ' + token
        }
      })
      .then((response) => {
        // console.log(response);
        setLogin(1);        
      }).catch((error) => {
        if (error.response) {
            console.log(error.response);
          }
      })
  }

  if (isLoggedIn){
    let pt = new PollTree("");
    const pagesList = [
        "New Poll",
        "New Followup Poll",
        "View Polls",
        "Polls Results",
        "Add Admin",
    ];
    const pageContentList: { [id: string]: JSX.Element } = {
        "New Poll": (
        <PollWrapper></PollWrapper>
        ),
        "New Followup Poll": <FollowupPoll></FollowupPoll>,
        "View Polls": <PollsView></PollsView>,
        "Polls Results": <PollsResults></PollsResults>,
        "Add Admin": <AdminPanel></AdminPanel>,
    };
    return (
        //
        <MyDrawer isOpen={false} pageList={pagesList} setActivePage={setActivePage} setLogin={setLogin}>
        {pageContentList[activePage]}
        </MyDrawer>
    );
  }
  else{
    return(
        <Login setToken={setToken} setLogin={setLogin}/>
    );
  }

}
