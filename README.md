# ♟️ Real-Time Multiplayer Chess Game

A real-time multiplayer chess game built using **Node.js, Express.js, Socket.IO, Chess.js, HTML, CSS, and JavaScript**.

The application allows two players to play chess against each other in real time. One player is assigned the White pieces and the other player is assigned the Black pieces. Additional users can join as spectators.

---

## 🎮 Features

- ♟️ Real-time multiplayer chess
- 👤 Automatic player role assignment
- ⚪ White player and ⚫ Black player
- 👀 Spectator mode for additional users
- 🔄 Real-time board synchronization
- ✅ Valid chess move validation using Chess.js
- 🖱️ Drag-and-drop chess pieces
- 🔄 Board automatically flips for the Black player
- 🌐 Socket.IO-based real-time communication
- 🎨 Chess-themed background and user interface

---

## 🛠️ Technologies Used

- **Node.js** – Backend runtime
- **Express.js** – Web server framework
- **Socket.IO** – Real-time communication
- **Chess.js** – Chess rules and move validation
- **EJS** – Template engine
- **HTML5** – Structure
- **CSS3** – Styling
- **JavaScript** – Frontend functionality
- **Tailwind CSS** – UI styling

---

## 📂 Project Structure

```text
multiplayer-chess/
│
├── public/
│   ├── css/
│   ├── images/
│   │   └── chess-bg.jpeg
│   └── js/
│       └── chessgame.js
│
├── views/
│   └── index.ejs
│
├── app.js
├── package.json
├── package-lock.json
└── README.md
