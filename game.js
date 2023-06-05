const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const character = {
  x: 500,
  y: canvas.height /2.5,
  width: 200,
  height: 200,
  isCrouching: false,
  isAttacking: false,
  attackType: "sword",
  ultimateReady: false,
  ultimateChargeTime: 15000,
  health: 10,
  idleSprites: [
    "adventurer-idle-2-00.png",
    "adventurer-idle-2-01.png",
    "adventurer-idle-2-02.png",
    "adventurer-idle-2-03.png",
  ],
  jumpingSprites: [
    "adventurer-jump-00.png",
    "adventurer-jump-01.png",
    "adventurer-jump-02.png",
    "adventurer-jump-03.png",
  ],
  runningSprites: [
    "adventurer-run-00.png",
    "adventurer-run-01.png",
    "adventurer-run-02.png",
    "adventurer-run-03.png",
    "adventurer-run-04.png",
    "adventurer-run-05.png",
  ],
  currentSpriteIndex: 0,
  currentJumpingSpriteIndex: 0,
  currentRunningSpriteIndex: 0,
  spriteInterval: null,
  jumpStartTime: 0,
  canJump: true,
};

const characterSprites = [];
character.idleSprites.forEach((spriteName) => {
  const sprite = new Image();
  sprite.src = "images/" + spriteName;
  characterSprites.push(sprite);
});
const runningCharacterSprites = [];
character.runningSprites.forEach((spriteName) => {
  const sprite = new Image();
  sprite.src = "images/" + spriteName;
  runningCharacterSprites.push(sprite);
});

const jumpingCharacterSprites = [];
character.jumpingSprites.forEach((spriteName) => {
  const sprite = new Image();
  sprite.src = "images/" + spriteName;
  jumpingCharacterSprites.push(sprite);
});

let isRunning = false;
let isJumping = false
const backgroundImage = new Image();
backgroundImage.src = "images/Dryland.png";
backgroundImage.onload = () => {
  gameLoop();
};

let isRightKeyPressed = false;
let isLeftKeyPressed = false;
let isUpKeyPressed = false;
let isDownKeyPressed = false;

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowRight":
      isRightKeyPressed = true;
      isRunning = true;
      break;
    case "ArrowLeft":
      isLeftKeyPressed = true;
      isRunning = true;
      break;
    case "ArrowUp":
      if (character.canJump) {
        isUpKeyPressed = true;
        isJumping = true;
      }
        break;
    case "ArrowDown":
      isDownKeyPressed = true;
      break;
    default:
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowRight":
      isRightKeyPressed = false;
      isRunning = false;
      break;
    case "ArrowLeft":
      isLeftKeyPressed = false;
      isRunning = false;
      break;
    case "ArrowUp":
      isUpKeyPressed = false;
      break;
    case "ArrowDown":
      isDownKeyPressed = false;
      break;
    default:
      break;
  }
});
function drawCharacter() {
  let spritesArray = characterSprites;
  let currentIndex = character.currentSpriteIndex;
  if (isJumping) {
  spritesArray = jumpingCharacterSprites;
  currentIndex = character.currentJumpingSpriteIndex;
}
  else if (isRunning) {
    spritesArray = runningCharacterSprites;
    currentIndex = character.currentRunningSpriteIndex;
  }


  ctx.save();
  if (isLeftKeyPressed) {
    ctx.scale(-1, 1);
    ctx.drawImage(
      spritesArray[currentIndex],
      -character.x - character.width,
      character.y,
      character.width,
      character.height
    );
  } else{
    ctx.drawImage(
      spritesArray[currentIndex],
      character.x,
      character.y,
      character.width,
      character.height
    );
  }
  ctx.restore();
}

function updateCharacterPosition() {
  if (isRightKeyPressed) {
    character.x += 5;
  }
  if (isLeftKeyPressed) {
    character.x -= 5;
  }
  
  if (isUpKeyPressed && character.canJump) {
    character.canJump = false;
    const jumpInterval = setInterval(() => {
      character.y -= 10;
    }, 50);
    setTimeout(() => {
      clearInterval(jumpInterval);
      const downJumpInterval = setInterval(() => {
        character.y += 10;
      }, 50);
      setTimeout(() => {
        clearInterval(downJumpInterval);
        character.canJump = true;
        isJumping = false;
      }, 400);
    }, 400);
  }
  if (isDownKeyPressed) {
    character.y += 10;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  drawCharacter()

  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(`Health: ${character.health}`, 10, 30);

  ctx.fillText(`Ultimate: ${character.ultimateReady ? "Ready" : "Charging"}`, 10, 60);

  updateCharacterPosition();

  requestAnimationFrame(gameLoop);
}

character.spriteInterval = setInterval(() => {
  if (isRunning) {
    character.currentRunningSpriteIndex++;
    if (character.currentRunningSpriteIndex >= character.runningSprites.length) {
      character.currentRunningSpriteIndex = 0;
    }
  }

  else {
  character.currentSpriteIndex++;
  if (character.currentSpriteIndex >= character.idleSprites.length) {
    character.currentSpriteIndex = 0;
  }}
}, 150);
character.spriteInterval = setInterval(() => {
  if (isJumping) {
    character.currentJumpingSpriteIndex++;
    if (character.currentJumpingSpriteIndex >= character.jumpingSprites.length) {
      character.currentJumpingSpriteIndex = 0;
    }
  }
  }, 200)
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  // Add later the logic to change other things sizes
  });