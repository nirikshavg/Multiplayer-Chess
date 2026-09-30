const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();

const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();

let players = {};

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
    res.render("index", {
        title: "Chess Game"
    });
});


io.on("connection", function(socket) {

    console.log("Player connected:", socket.id);


    // -----------------------------
    // ASSIGN PLAYER ROLE
    // -----------------------------

    if (!players.white) {

        players.white = socket.id;

        socket.emit("playerRole", "w");

        console.log("Player assigned: WHITE");

    } 
    else if (!players.black) {

        players.black = socket.id;

        socket.emit("playerRole", "b");

        console.log("Player assigned: BLACK");

    } 
    else {

        socket.emit("spectatorRole");

        console.log("Player assigned: SPECTATOR");
    }


    // Send current board to the new player
    socket.emit("boardState", chess.fen());


    // -----------------------------
    // HANDLE MOVE
    // -----------------------------

    socket.on("move", function(move) {

        try {

            console.log("Move received:", move);


            // Check whose turn it is

            if (
                chess.turn() === "w" &&
                socket.id !== players.white
            ) {

                console.log("Not White's turn");

                return;
            }


            if (
                chess.turn() === "b" &&
                socket.id !== players.black
            ) {

                console.log("Not Black's turn");

                return;
            }


            // Try to make the move

            const result = chess.move(move);


            if (result) {

                console.log("Valid move:", move);

                console.log(
                    "Next turn:",
                    chess.turn()
                );


                // Send updated board to EVERYONE

                io.emit(
                    "boardState",
                    chess.fen()
                );

            } 
            else {

                console.log(
                    "Invalid move:",
                    move
                );

                socket.emit(
                    "invalidMove",
                    move
                );
            }


        } catch (error) {

            console.log(
                "Move error:",
                error
            );

            socket.emit(
                "invalidMove",
                move
            );
        }

    });


    // -----------------------------
    // HANDLE DISCONNECT
    // -----------------------------

    socket.on("disconnect", function() {

        console.log(
            "Player disconnected:",
            socket.id
        );


        if (socket.id === players.white) {

            delete players.white;

            console.log("White player left");

        } 
        else if (socket.id === players.black) {

            delete players.black;

            console.log("Black player left");
        }

    });

});


server.listen(3000, function() {

    console.log("Listening on port 3000");

});