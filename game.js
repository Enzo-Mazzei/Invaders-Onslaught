const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const character = {
  x: 500,
  y: canvas.height /2.5,
  width: 200,
  height: 200,
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
  crouchSprites: [
    "adventurer-crouch-00.png",
    "adventurer-crouch-01.png",
    "adventurer-crouch-02.png",
    "adventurer-crouch-03.png",
  ],
  swordSprites: [
    "adventurer-attack1-00.png",
    "adventurer-attack1-01.png",
    "adventurer-attack1-02.png",
    "adventurer-attack1-03.png",
    "adventurer-attack1-04.png",
  ],
  ultimateSprites:[
    "adventurer-air-attack1-00.png",
    "adventurer-air-attack1-01.png",
    "adventurer-air-attack1-02.png",
    "adventurer-air-attack1-03.png",
    "adventurer-air-attack2-01.png",
    "adventurer-air-attack2-02.png",
    "adventurer-air-attack3-loop-00.png",
    "adventurer-air-attack3-loop-01.png",
    "adventurer-air-attack3-rdy-00.png",
    "adventurer-air-attack-3-end-00.png",
    "adventurer-air-attack-3-end-01.png",
    "adventurer-air-attack-3-end-02.png",
  ],
  currentSpriteIndex: 0,
  currentJumpingSpriteIndex: 0,
  currentRunningSpriteIndex: 0,
  currentCrouchingSpriteIndex: 0,
  currentSwordSpriteIndex: 0,
  currentUltimateSpriteIndex: 0,
  spriteInterval: null,
  jumpingInterval: null,
  canJump: true,
  canAttack: true,
  ultimateReady: false,
};

const createSpriteArray = (spriteNames) =>
  spriteNames.map((spriteName) => {
    const sprite = new Image();
    sprite.src = "images/" + spriteName;
    return sprite;
  });

const characterSprites = createSpriteArray(character.idleSprites);
const runningCharacterSprites = createSpriteArray(character.runningSprites);
const jumpingCharacterSprites = createSpriteArray(character.jumpingSprites);
const crouchingCharacterSprites = createSpriteArray(character.crouchSprites);
const swordCharacterSprites = createSpriteArray(character.swordSprites);
const ultimateCharacterSprites = createSpriteArray(character.ultimateSprites);

let isRunning = false;
let isJumping = false;
let isCrouching = false;
let isAttacking = false
let isUsingUltimate = false;
setTimeout(() => {
  character.ultimateReady= true
}, 2000);
const backgroundImage = new Image();
backgroundImage.src = "images/Dryland.png";
backgroundImage.onload = () => {
  gameLoop();
};

let isRightKeyPressed = false;
let isLeftKeyPressed = false;
let isSpaceBarPressed = false;
let isDownKeyPressed = false;

document.addEventListener("keydown", (event) => {
    if (isUsingUltimate) {
    return; 
  }
  switch (event.key) {
    case "ArrowRight":
      isRightKeyPressed = true;
      isRunning = true;
      break;
    case "ArrowLeft":
      isLeftKeyPressed = true;
      isRunning = true;
      break;
      case " ":
      if (character.canJump && character.canAttack) {
        isSpaceBarPressed = true;
        isJumping = true;
      }
        break;
    case "ArrowDown":
      if (character.canJump && character.canAttack) {
        isDownKeyPressed = true;
        isCrouching = true
      }
      break;
      case "A":
      case "a":
        if (character.canAttack){
          isAttacking = true;
          character.canAttack = false
          setTimeout(() => {
            isAttacking = false;
            character.canAttack= true
          }, 750);}
          break;
      case "E":
      case "e":
        if (character.ultimateReady){
          isUsingUltimate = true;
          character.ultimateReady = false
          setTimeout(() => {
            isUsingUltimate = false;
          }, 1800);
          setTimeout(() => {
            character.ultimateReady= true
          }, 2000);}
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
      case " ":
      isSpaceBarPressed = false;
      break;
    case "ArrowDown":
      isDownKeyPressed = false;
      isCrouching = false;
      break;
    default:
      break;
  }
});
function drawCharacter() {
  let spritesArray = characterSprites;
  let currentIndex = character.currentSpriteIndex;
  if (isUsingUltimate) {
    spritesArray = ultimateCharacterSprites;
    currentIndex = character.currentUltimateSpriteIndex;
  } else if (isAttacking) {
    spritesArray = swordCharacterSprites;
    currentIndex = character.currentSwordSpriteIndex;
  } else if (isJumping) {
    spritesArray = jumpingCharacterSprites;
    currentIndex = character.currentJumpingSpriteIndex;
  } else if (isRunning) {
    spritesArray = runningCharacterSprites;
    currentIndex = character.currentRunningSpriteIndex;
  } else if (isCrouching) {
    spritesArray = crouchingCharacterSprites;
    currentIndex = character.currentCrouchingSpriteIndex;
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
let shouldStopUltimate = false;
let yIncrement = 0;
let yDecrement = 0;
function updateCharacterPosition() {
  if (!isCrouching && character.canJump) {
    character.height = 200;
    character.y = canvas.height /2.5
  }
  if (isRightKeyPressed && isCrouching) {
    character.x += 1.5;
  }
  else if (isRightKeyPressed){
    character.x += 5;
  }
  if (isLeftKeyPressed && isCrouching) {
    character.x -= 1.5;
  }
  else if (isLeftKeyPressed){
    character.x -= 5;
  }
  else if (isUsingUltimate){
    if (!shouldStopUltimate){
      yIncrement += 1;}
      character.y -= yIncrement;
      setTimeout(() => {
        shouldStop = true;
        yIncrement = 0
        yIncrement -=3
      }, 1000);
      character.x += 1.5;
    }
  
  if (isSpaceBarPressed && character.canJump) {
    character.canJump = false;
    const jumpInterval = setInterval(() => {
      character.y -= 12;
    }, 50);
    setTimeout(() => {
      clearInterval(jumpInterval);
      const downJumpInterval = setInterval(() => {
        character.y += 12;
      }, 50);
      setTimeout(() => {
        clearInterval(downJumpInterval);
        character.canJump = true;
        isJumping = false;
      }, 400);
    }, 400);
  }
  if (isDownKeyPressed && isCrouching) {
      isCrouching = true;
      character.height = 140;
      character.y = canvas.height /2.5 +60
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
  if (isUsingUltimate) {
    character.currentUltimateSpriteIndex++;
    if (character.currentUltimateSpriteIndex >= character.ultimateSprites.length) {
      character.currentUltimateSpriteIndex = 0;
    }
  }
  else if (isAttacking ) {
    character.currentSwordSpriteIndex++;
    if (character.currentSwordSpriteIndex >= character.swordSprites.length) {
      character.currentSwordSpriteIndex = 0;
    }
  }
  else if (isRunning) {
    character.currentRunningSpriteIndex++;
    if (character.currentRunningSpriteIndex >= character.runningSprites.length) {
      character.currentRunningSpriteIndex = 0;
    }
  }
  else if (isCrouching) {
     character.currentCrouchingSpriteIndex++;
  if (character.currentCrouchingSpriteIndex >= character.crouchSprites.length) {
    character.currentCrouchingSpriteIndex = 0;
  }

  }
  else {
    character.currentSpriteIndex++;
    if (character.currentSpriteIndex >= character.idleSprites.length) {
      character.currentSpriteIndex = 0;
    }
  }
}, 150);

character.jumpingInterval = setInterval(() => {
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