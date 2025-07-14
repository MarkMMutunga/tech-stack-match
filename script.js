// Tech Stack Match Game - by Mark Mikile Mutunga
const techIcons = ['💻','🖌️','⚛️','🌐','🔧','📐','💻','🖌️','⚛️','🌐','🔧','📐'];
let cards = [];
let flippedCards = [];
let matchedCards = 0;
let moves = 0;
let gameStarted = false;

// Game statistics tracking
function updateStats() {
  document.getElementById('moves').textContent = moves;
  document.getElementById('matches').textContent = matchedCards / 2;
}

// Shuffle function using Fisher-Yates algorithm
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Create individual card element
function createCard(icon, index) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.icon = icon;
  card.dataset.index = index;
  card.innerText = '';
  card.addEventListener('click', handleCardClick);
  return card;
}

// Handle card click events
function handleCardClick(e) {
  const card = e.target;
  
  // Prevent clicking on already flipped or matched cards
  if (card.classList.contains('flipped') || 
      card.classList.contains('matched') || 
      flippedCards.length === 2) {
    return;
  }

  // Flip the card
  card.classList.add('flipped');
  card.innerText = card.dataset.icon;
  flippedCards.push(card);

  // Increment moves counter
  if (!gameStarted) {
    gameStarted = true;
  }
  
  if (flippedCards.length === 1) {
    moves++;
    updateStats();
  }

  // Check for matches when two cards are flipped
  if (flippedCards.length === 2) {
    setTimeout(checkForMatch, 600);
  }
}

// Check if the two flipped cards match
function checkForMatch() {
  const [card1, card2] = flippedCards;
  
  if (card1.dataset.icon === card2.dataset.icon) {
    // Cards match!
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    card1.classList.add('matched');
    card2.classList.add('matched');
    
    matchedCards += 2;
    flippedCards = [];
    
    updateStats();
    
    // Check if game is complete
    if (matchedCards === cards.length) {
      setTimeout(() => {
        const message = document.getElementById('message');
        message.innerHTML = '🎉 Congratulations! You matched all tech tools! 🎉';
        message.classList.add('success-message');
        
        // Add confetti effect (simple version)
        celebrateWin();
      }, 300);
    }
  } else {
    // Cards don't match - flip them back
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      card1.innerText = '';
      card2.innerText = '';
      flippedCards = [];
    }, 800);
  }
}

// Simple celebration effect
function celebrateWin() {
  const gameBoard = document.getElementById('game-board');
  gameBoard.style.animation = 'celebrationBounce 1s ease-in-out';
  
  setTimeout(() => {
    gameBoard.style.animation = '';
  }, 1000);
}

// Initialize the game
function initGame() {
  // Reset game state
  cards = [];
  flippedCards = [];
  matchedCards = 0;
  moves = 0;
  gameStarted = false;
  
  // Clear message
  const message = document.getElementById('message');
  message.innerHTML = '';
  message.classList.remove('success-message');
  
  // Shuffle the icons
  shuffle(techIcons);
  
  // Create the game board
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  board.style.animation = '';
  
  // Create and append cards
  cards = techIcons.map((icon, i) => createCard(icon, i));
  cards.forEach(card => board.appendChild(card));
  
  // Update stats display
  updateStats();
}

// Reset game function (called by restart button)
function resetGame() {
  initGame();
}

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') {
    resetGame();
  }
});

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', initGame);

// Optional: Add game instructions on first load
window.addEventListener('load', () => {
  const message = document.getElementById('message');
  message.innerHTML = 'Click any card to start! Match all 6 pairs of tech tools.';
  
  setTimeout(() => {
    if (!gameStarted) {
      message.innerHTML = '';
    }
  }, 3000);
});
