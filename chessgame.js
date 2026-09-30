const socket = io();

const chess = new Chess();

const boardElement =
    document.querySelector(".chessboard");


let draggedPiece = null;

let sourceSquare = null;

let playerRole = null;


// =====================================
// RENDER BOARD
// =====================================

const renderBoard = () => {

    const board = chess.board();

    boardElement.innerHTML = "";


    board.forEach((row, rowindex) => {

        row.forEach((square, squareindex) => {


            // Create square

            const squareElement =
                document.createElement("div");


            // Light / dark square

            squareElement.classList.add(
                "square",
                (rowindex + squareindex) % 2 === 0
                    ? "light"
                    : "dark"
            );


            // Store position

            squareElement.dataset.row =
                rowindex;

            squareElement.dataset.col =
                squareindex;


            // =====================================
            // IF SQUARE HAS A CHESS PIECE
            // =====================================

            if (square) {

                const pieceElement =
                    document.createElement("div");


                // Add piece classes

                pieceElement.classList.add(
                    "piece",
                    square.color === "w"
                        ? "white"
                        : "black"
                );


                // Add chess symbol

                pieceElement.innerText =
                    getPieceUnicode(square);


                // =====================================
                // CHECK WHETHER THIS PIECE BELONGS
                // TO CURRENT PLAYER
                // =====================================

                const isMyPiece =
                    playerRole === square.color;


                const isMyTurn =
                    chess.turn() === square.color;


                const canMove =
                    isMyPiece && isMyTurn;


                pieceElement.draggable =
                    canMove;


                if (canMove) {

                    pieceElement.classList.add(
                        "draggable"
                    );
                }


                // =====================================
                // DRAG START
                // =====================================

                pieceElement.addEventListener(
                    "dragstart",
                    function(e) {

                        if (!canMove) {

                            e.preventDefault();

                            return;
                        }


                        draggedPiece =
                            pieceElement;


                        sourceSquare = {

                            row: rowindex,

                            col: squareindex
                        };


                        e.dataTransfer.setData(
                            "text/plain",
                            ""
                        );


                        pieceElement.classList.add(
                            "dragging"
                        );


                        console.log(
                            "Dragging from:",
                            sourceSquare
                        );
                    }
                );


                // =====================================
                // DRAG END
                // =====================================

                pieceElement.addEventListener(
                    "dragend",
                    function() {

                        draggedPiece = null;

                        sourceSquare = null;


                        pieceElement.classList.remove(
                            "dragging"
                        );
                    }
                );


                squareElement.appendChild(
                    pieceElement
                );
            }


            // =====================================
            // ALLOW DROP
            // =====================================

            squareElement.addEventListener(
                "dragover",
                function(e) {

                    e.preventDefault();
                }
            );


            // =====================================
            // DROP
            // =====================================

            squareElement.addEventListener(
                "drop",
                function(e) {

                    e.preventDefault();


                    if (!draggedPiece ||
                        !sourceSquare) {

                        return;
                    }


                    const targetSquare = {

                        row: parseInt(
                            squareElement.dataset.row
                        ),

                        col: parseInt(
                            squareElement.dataset.col
                        )
                    };


                    console.log(
                        "Moving to:",
                        targetSquare
                    );


                    handleMove(
                        sourceSquare,
                        targetSquare
                    );


                    draggedPiece = null;

                    sourceSquare = null;
                }
            );


            boardElement.appendChild(
                squareElement
            );

        });

    });


    // =====================================
    // FLIP BOARD FOR BLACK
    // =====================================

    if (playerRole === "b") {

        boardElement.classList.add(
            "flipped"
        );

    } 
    else {

        boardElement.classList.remove(
            "flipped"
        );
    }

};


// =====================================
// HANDLE MOVE
// =====================================

const handleMove = (source, target) => {


    const move = {

        from:
            `${String.fromCharCode(
                97 + source.col
            )}${8 - source.row}`,

        to:
            `${String.fromCharCode(
                97 + target.col
            )}${8 - target.row}`,

        promotion: "q"
    };


    console.log(
        "Sending move:",
        move
    );


    socket.emit(
        "move",
        move
    );
};


// =====================================
// CHESS PIECES
// =====================================

const getPieceUnicode = (piece) => {

    const unicodePieces = {

        p: "♟",
        r: "♜",
        n: "♞",
        b: "♝",
        q: "♛",
        k: "♚",

        P: "♙",
        R: "♖",
        N: "♘",
        B: "♗",
        Q: "♕",
        K: "♔"
    };


    return unicodePieces[piece.type] || "";
};


// =====================================
// PLAYER ROLE
// =====================================

socket.on(
    "playerRole",
    function(role) {

        playerRole = role;


        console.log(
            "My role:",
            playerRole
        );


        renderBoard();
    }
);


// =====================================
// SPECTATOR
// =====================================

socket.on(
    "spectatorRole",
    function() {

        playerRole = null;


        console.log(
            "You are a spectator"
        );


        renderBoard();
    }
);


// =====================================
// BOARD STATE
// =====================================

socket.on(
    "boardState",
    function(fen) {

        console.log(
            "Board updated:",
            fen
        );


        chess.load(fen);

        renderBoard();
    }
);


// =====================================
// INVALID MOVE
// =====================================

socket.on(
    "invalidMove",
    function(move) {

        console.log(
            "Invalid move:",
            move
        );
    }
);


// Initial board

renderBoard();