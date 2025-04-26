// grab our DOM elements
const gamesList     = document.getElementById('games-list');
const oldGamesList  = document.getElementById('old-games-list');
const refreshBtn    = document.getElementById('refresh-btn');

// two pools of games
const games = [
  { name: "Tic-Tac-Toe",  img: "https://upload.wikimedia.org/wikipedia/commons/8/89/Jogo_da_velha_-_tic_tac_toe.png", link: "https://playtictactoe.org/" },
  { name: "Uno", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/UNO_Logo.svg/2560px-UNO_Logo.svg.png", link: "https://unoonline.io/" },
  { name: "Trivia Quiz",  img: "https://png.pngtree.com/png-clipart/20210905/original/pngtree-trivia-poster-png-image_6706386.jpg", link: "https://www.sporcle.com/" },
  { name: "Hangman",  img: "https://cdn-icons-png.flaticon.com/512/3269/3269914.png", link: "https://www.hangmanwords.com/play" },
  {name: "Go", img: "https://png.pngtree.com/png-vector/20210917/ourmid/pngtree-go-game-png-image_3935432.jpg", link: "https://www.mathsisfun.com/games/go.html" },
  {name: "Wordle", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYbSMcajZtoi0ujsOZCs_AXx9eTXegRmWoUA&s" }
];
const oldGames = [
  { name: "Chess",      img: "https://static.vecteezy.com/system/resources/previews/009/593/789/non_2x/chess-composition-3d-render-free-png.png", link: "https://www.chess.com/play/online" },
  { name: "Solitaire",  img: "https://png.pngtree.com/png-clipart/20220303/original/pngtree-classic-red-and-white-solitaire-png-image_7378773.png", link: "https://www.solitr.com/" },
  { name: "Crossword",  img: "https://cdn-icons-png.flaticon.com/512/3813/3813765.png", link: "https://www.boatloadpuzzles.com/playcrossword" },
  { name: "Checkers",   img: "https://pngimg.com/d/checkers_PNG33.png", link: "https://cardgames.io/checkers/" },
  { name: "Bingo",      img: "https://png.pngtree.com/png-clipart/20221117/ourmid/pngtree-bingo-ball-png-image_6462732.png", link: "https://myfreebingocards.com/bingo-card-generator" },
  { name: "Mahjong",    img: "https://static-00.iconduck.com/assets.00/mahjong-tile-red-dragon-emoji-2048x1915-mbpz9wxv.png", link: "https://www.mahjong.com/" }
];

// helper to shuffle & pick 3
function pickThree(arr) {
  return arr
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
}

// render a single card with an <a> that opens in a new tab
function makeCard(game) {
  const card = document.createElement('div');
  card.className = 'game-card';

  const img = document.createElement('img');
  img.src = game.img;
  img.alt = game.name;

  const link = document.createElement('a');
  link.href = game.link;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = game.name;
  link.className = 'game-btn';

  card.append(img, link);
  return card;
}

// inject 3 young games
function loadGames() {
  gamesList.innerHTML = '';
  pickThree(games).forEach(g => gamesList.append(makeCard(g)));
}

// inject 3 old-people games
function loadOldGames() {
  oldGamesList.innerHTML = '';
  pickThree(oldGames).forEach(g => oldGamesList.append(makeCard(g)));
}

// on load & on refresh
window.onload = () => {
  loadGames();
  loadOldGames();
};

refreshBtn.addEventListener('click', () => {
  loadGames();
  loadOldGames();
});
