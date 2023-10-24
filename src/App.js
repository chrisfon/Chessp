import {useState, useEffect, useCallback} from "react";
import socket from './socket'
import './App.css';
import Game from './Game';
import InitGame from "./InitGame";

import { Container, TextField } from '@mui/material';
import CustomDialog from './components/CustomDialog';



export default function App(){
  const[username, setUsername] = useState('');

  const[usernameSubmitted, setUsernameSubmitted] = useState(false);

  const [room,setRoom] = useState('');
  const [orientation, setOrientation] = useState('');
  const [players,setPlayers] = useState('');

const cleanup = useCallback (() => {
setRoom("");
setOrientation("");
setPlayers("");

},[]);

useEffect( () => {
  socket.on("opponentJoined", (roomData) => {
    console.log("el roomdata es:", roomData);
    setPlayers(roomData.players);
  })
})

  return (
    <Container>
      <CustomDialog 
      open = {!usernameSubmitted}
      title="What's ur name?"
      contentText="Seleccione su nombre"
      handleContinue={
        ()=>{
          if (!username) return;
          socket.emit("username",username);
          setUsernameSubmitted(true);
        }
      }
      >
      <TextField
      autoFocus
      margin="dense"
      id = "username"
      label="Usuario"
      name="username"
      value={username}
      required
      onChange={(p)=> setUsername(p.target.value)}
      type="text"
      variant="standard"

      />
      
      </CustomDialog>
      {room ? (<Game
        room={room}
        orientation={orientation}
        username={username}
        players={players}
        cleanup={cleanup}
      
      />):(<InitGame
      setRoom={setRoom}
      setOrientation={setOrientation}
      setPlayers={setPlayers}
      />
      )}
       
    </Container>
     
   
  );
}
