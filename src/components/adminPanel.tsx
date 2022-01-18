import * as React from 'react';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import axios from 'axios';
import useToken from './useToken';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';


type CreateState = {
  username: string
  password:  string
  isButtonDisabled: boolean
  helperText: string
  isError: boolean
};

const initialCreateState:CreateState = {
  username: '',
  password: '',
  isButtonDisabled: true,
  helperText: 'Input username and password to create a new admin',
  isError: false
};

type CreateAction = { type: 'setUsername', payload: string }
  | { type: 'setPassword', payload: string }
  | { type: 'setIsButtonDisabled', payload: boolean }
  | { type: 'createSuccess', payload: string }
  | { type: 'createFailed', payload: string }
  | { type: 'setIsError', payload: boolean };

const createReducer = (createState: CreateState, createAction: CreateAction): CreateState => {
  switch (createAction.type) {
    case 'setUsername': 
      return {
        ...createState,
        username: createAction.payload
      };
    case 'setPassword': 
      return {
        ...createState,
        password: createAction.payload
      };
    case 'setIsButtonDisabled': 
      return {
        ...createState,
        isButtonDisabled: createAction.payload
      };
    case 'createSuccess': 
      return {
        ...createState,
        helperText: createAction.payload,
        isError: false
      };
    case 'createFailed': 
      return {
        ...createState,
        helperText: createAction.payload,
        isError: true
      };
    case 'setIsError': 
      return {
        ...createState,
        isError: createAction.payload
      };
  }
}


type RemoveState = {
  username: string
  isButtonDisabled: boolean
  helperText: string
  isError: boolean
};

const initialRemoveState:RemoveState = {
  username: '',
  isButtonDisabled: true,
  helperText: 'Remove the specified admins',
  isError: false
};

type RemoveAction = { type: 'setUsername', payload: string }
  | { type: 'setIsButtonDisabled', payload: boolean }
  | { type: 'removeSuccess', payload: string }
  | { type: 'removeFailed', payload: string }
  | { type: 'setIsError', payload: boolean };

const removeReducer = (removeState: RemoveState, removeAction: RemoveAction): RemoveState => {
  switch (removeAction.type) {
    case 'setUsername': 
      return {
        ...removeState,
        username: removeAction.payload
      };
    case 'setIsButtonDisabled': 
      return {
        ...removeState,
        isButtonDisabled: removeAction.payload
      };
    case 'removeSuccess': 
      return {
        ...removeState,
        helperText: removeAction.payload,
        isError: false
      };
    case 'removeFailed': 
      return {
        ...removeState,
        helperText: removeAction.payload,
        isError: true
      };
    case 'setIsError': 
      return {
        ...removeState,
        isError: removeAction.payload
      };
  }
}


export default function AdminPanel() {
  const [isRootAdmin, setIsRootAdmin] = React.useState(0);
  const { getToken, removeToken, setToken } = useToken();
  const [admins, setAdminsList] = React.useState([])
  const [createState, createDispatch] = React.useReducer(createReducer, initialCreateState);
  const [removeState, removeDispatch] = React.useReducer(removeReducer, initialRemoveState);
  const [checked, setChecked] = React.useState([]);
  let token = getToken()


  React.useEffect (() => {
    getAllAdmins();
  }, []);


  const getAllAdmins = () => {
    axios({
      method: "GET",
      url:"/api/get_all_admins",
      headers: {
          Authorization: 'Bearer ' + getToken()
      }
    })
    .then((response) => {  
        if(response.data.admins){
          setAdminsList(response.data.admins);
        }
        if(response.data.admins.length === 0){
          removeDispatch({
            type: 'removeSuccess',
            payload: 'No admin users to remove'
          });
        }
    }).catch((error) => {
      if (error.response) {
          console.log(error.response);
        }
    })
  }

  React.useEffect(() => {
    if (createState.username.trim() && createState.password.trim()) {
     createDispatch({
       type: 'setIsButtonDisabled',
       payload: false
     });
    } else {
      createDispatch({
        type: 'setIsButtonDisabled',
        payload: true
      });
    }
  }, [createState.username, createState.password]);


  React.useEffect(() => {
    if (removeState.username.trim()) {
     removeDispatch({
       type: 'setIsButtonDisabled',
       payload: false
     });
    } else {
      removeDispatch({
        type: 'setIsButtonDisabled',
        payload: true
      });
    }
  }, [removeState.username]);


  const handleCreateUsernameChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      createDispatch({
        type: 'setUsername',
        payload: event.target.value
      });
    };

  const handleCreatePasswordChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      createDispatch({
        type: 'setPassword',
        payload: event.target.value
      });
    }

  axios({
    method: "POST",
    url:"/api/token",
    headers: {
        Authorization: 'Bearer ' + token
    }
  })
  .then((response) => {
    if(response.data.is_root_admin == 1){
      setIsRootAdmin(1);
    }       
  }).catch((error) => {
    if (error.response) {
        console.log(error.response);
      }
  })

  const handleCreateKeyPress = (event: React.KeyboardEvent) => {
    if (event.keyCode === 13 || event.which === 13) {
      createState.isButtonDisabled || handleCreateAdmin();
    }
  };

  function handleCreateAdmin() {
    axios({
      method: "POST",
      url:"/api/admins",
      headers: {
          Authorization: 'Bearer ' + token
      },
      data:{
        username: createState.username,
        password: createState.password
        }
    })
    .then((response) => {
      if (response.data.success === true){
        createDispatch({
          type: 'createSuccess',
          payload: 'User ' + createState.username + ' created successfully'
        });
        getAllAdmins();
        removeDispatch({
          type: 'removeSuccess',
          payload: 'Remove the specified admins'
        });          
      }
      else{
        createDispatch({
          type: 'createFailed',
          payload: 'User ' + createState.username + ' already exists'
        });
      }
        
      
    }).catch((error) => {
      if (error.response) {
          console.log(error.response);
        }
    })
  }
  
  function handleRemoveAdmin() {
    axios({
      method: "DELETE",
      url:"/api/admins",
      headers: {
          Authorization: 'Bearer ' + token
      },
      data:{
        admins: checked
        }
    })
    .then((response) => {
      if (response.data.success === true){
        if (checked.length > 1){
          removeDispatch({
            type: 'removeSuccess',
            payload: 'Admins deleted successfully'
          });
        }else{
          removeDispatch({
            type: 'removeSuccess',
            payload: 'Admin deleted successfully'
          });          
        }
        setChecked([]);
        removeDispatch({
          type: 'setIsButtonDisabled',
          payload: true
        });
        getAllAdmins();
      }
      else{
        if (response.data.is_root_admin === true){
          removeDispatch({
            type: 'removeFailed',
            payload: 'Deleting the root admin is not allowed!'
          });
        }
        else{
          removeDispatch({
            type: 'removeFailed',
            payload: 'User ' + removeState.username + ' does not exists'
          });
        }
      }      
    }).catch((error) => {
      if (error.response) {
          console.log(error.response);
        }
    })
  
  }

  const handleToggle = (value: number) => () => {    
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    
    
    setChecked(newChecked);
    if (newChecked.length > 0){
      removeDispatch({
        type: 'setIsButtonDisabled',
        payload: false
      });
    }
    else{
      removeDispatch({
        type: 'setIsButtonDisabled',
        payload: true
      });
    }
  };

  let removeList, divider;
  if (isRootAdmin){
    removeList =    <Box component="div">
                    <Typography variant="h4" gutterBottom component="div" color="#2196f3">Remove Admin</Typography>
                    <List sx={{ width: '100%', minWidth:400,  bgcolor: 'background.paper', maxHeight: 200, overflow: 'auto',}}>
                    {admins.map((value) => {
                      const labelId = `checkbox-list-label-${value}`;

                      return (
                        <ListItem
                          key={value}
                          disablePadding
                        >
                          <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                checked={checked.indexOf(value) !== -1}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${value}`} />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                    </List>
                    <FormHelperText id="component-remove-helper-text">{removeState.helperText}</FormHelperText>
                    <Button sx={{ width: '100%'}} variant="contained" onClick={handleRemoveAdmin} disabled={removeState.isButtonDisabled}>Remove</Button>
                    </Box>

    divider = <Divider orientation="vertical" flexItem></Divider>;
  }
  else{
    removeList = null
    divider = null;
  }

  return (
    <Box component="form" noValidate autoComplete="off" style={{margin:10, textAlign: "center", display: 'flex', alignItems:'center', justifyContent: 'center'}}>
      <FormGroup sx={{ margin:5, width: '50ch'}}>
        <Typography variant="h4" gutterBottom component="div" color="#2196f3">Create Admin</Typography>
        <OutlinedInput placeholder="username" onChange={handleCreateUsernameChange} onKeyPress={handleCreateKeyPress}/>
        <OutlinedInput placeholder="password" type="password" onChange={handleCreatePasswordChange} onKeyPress={handleCreateKeyPress}/>
        <FormHelperText id="component-create-helper-text">{createState.helperText}</FormHelperText>
        <Button variant="contained" onClick={handleCreateAdmin} disabled={createState.isButtonDisabled} >Create</Button>
      </FormGroup>
      {divider}
      {removeList}
    </Box>
  );
}
