import { useState,useMemo,useCallback,useEffect } from "react";
import {Chessboard} from "react-chessboard";
import {Chess} from "chess.js";
import CustomDialog from "./components/CustomDialog";
import socket from "./socket";
import { Card,CardContent,List,ListItem,ListItemText,ListSubheader,Stack,Typography,Box, } from "@mui/material";

function Game({players, room, orientation, cleanup}){
{/* use memo para asignar un valor que se este actualizando */}
const chess = useMemo(() => new Chess(), []);
const [fen, setFen] = useState(chess.fen());
const [over,setOver] = useState("");

const makeAMove = useCallback (
 (move) => {
    try{
const result = chess.move(move);
setFen(chess.fen());

if (chess.isGameOver()){
  if(chess.isCheckmate()){
    setOver(
       `Mate, ${chess.turn() === "w" ? "Black" : "White"} gano!`
    );
  } else if (chess.isDraw()){
    setOver('Draw');
  }else{
    setOver('Game Over')
  }

}
return result;


    }catch (e){
       return null;
    }
 },
 [chess]
   

);

function onDrop(sourceSquare, targetSquare) {

    if (chess.turn() !== orientation[0]) return false;

    if (players.length < 2) return false;



    const moveData = {
from:sourceSquare,
to: targetSquare,
color: chess.turn(),
promotion: "q"
    };
const move = makeAMove(moveData);

if (move === null) return false;

socket.emit("move",{
    move,room,
});

return true;

}


useEffect(
    () => {

        socket.on('move',(move) => {
            makeAMove(move);
        });
       
    }, [makeAMove]);


useEffect(
    () => {
        socket.on("playerDisconnected", (player) => {
             setOver(`${player.username} had disconnected`);
        });
    }, []);   

return (
<Stack>
<Card>
<CardContent>
    <Typography variant="h5">Room ID: {room}</Typography>
</CardContent>

</Card>
<Stack flexDirection="row" sx={{pt: 2}}>
<div className = "board" style={
    {
        maxWidth:1000,
        maxHeight:1000,
        flexGrow: 1,
    }
}>
    <Chessboard position={fen} onPieceDrop={onDrop} boardOrientation={orientation}/>
</div>

{players.length >0 && (
<Box>
<List>
    <ListSubheader> Jugadores </ListSubheader>
        {players.map((p) => (
         <ListItem key={p.id}>
            <ListItemText primary={p.username}/>
        </ListItem>
        ))}
    
</List>

</Box>

)}

</Stack>

<CustomDialog 
open = {Boolean(over)}
title={over}
contextText={over}
handleContinue={() => {setOver("")}}
/>
</Stack>


);

}

export default Game;