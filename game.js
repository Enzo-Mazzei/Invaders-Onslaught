const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const character = {
  x: 100,
  y: canvas.height/2.3,
  width: 200,
  height: 148,
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
  bowSprites:[
    "adventurer-bow-01.png",
    "adventurer-bow-02.png",
    "adventurer-bow-03.png",
    "adventurer-bow-04.png",
    "adventurer-bow-05.png",
    "adventurer-bow-06.png",
    "adventurer-bow-07.png",
    "adventurer-bow-08.png",

  ],
  currentSpriteIndex: 0,
  currentJumpingSpriteIndex: 0,
  currentRunningSpriteIndex: 0,
  currentCrouchingSpriteIndex: 0,
  currentSwordSpriteIndex: 0,
  currentUltimateSpriteIndex: 0,
  currentbowSpriteIndex: 0,
  spriteInterval: null,
  jumpingInterval: null,
  canJump: true,
  canAttack: true,
  ultimateReady: false,
};

class Boss {
  constructor(width, height, health, meleeDamages, meleeAttackTime, rangeDamages, rangeAttackTime, ultimateDamages, ultimateAttackTime, idleSprites, meleeSprites, ultimateSprites, rangeSprites) {
    this.x = 1500;
    this.basex = this.x
    this.y = character.y + (character.height - height);
    this.baseWidth = width
    this.width = width;
    this.height = height;
    this.health = health;
    this.meleeDamages = meleeDamages;
    this.rangeDamages = rangeDamages;
    this.ultimateDamages = ultimateDamages;
    this.idleSprites = idleSprites;
    this.meleeSprites = meleeSprites;
    this.ultimateSprites = ultimateSprites;
    this.rangeSprites = rangeSprites;
    this.currentSpriteIndex = 0;
    this.currentMeleeSpriteIndex = 0;
    this.currentUltimateSpriteIndex = 0;
    this.currentRangeSpriteIndex = 0;
    this.currentIdleSpriteIndex = 0;
    this.spriteInterval = null;
    this.canAttack = true;
    this.ultimateReady = false;
    this.status = true;
    this.isAttacking = false;
    this.isUlting = false;
    this.isRangeAttacking = false;
    this.meleeAttackTime = meleeAttackTime;
    this.rangeAttackTime = rangeAttackTime;
    this.ultimateAttackTime = ultimateAttackTime;
    this.animationInterval = 200;
    this.idleSpriteArray = this.createBossSpriteArray(idleSprites);
    this.meleeSpriteArray = this.createBossSpriteArray(meleeSprites);
    this.ultimateSpriteArray = this.createBossSpriteArray(ultimateSprites);
    this.rangeSpriteArray = this.createBossSpriteArray(rangeSprites);
    this.initializeUltimateTimeout()
  }

  createBossSpriteArray(spriteNames) {
    return spriteNames.map((spriteName) => {
      const sprite = new Image();
      sprite.src = "images/MageBoss/" + spriteName;
      return sprite;
    });
  }
  idleBoss(){
    this.spriteInterval = setInterval(() => {
      this.currentIdleSpriteIndex++
      if (this.currentIdleSpriteIndex >= this.idleSpriteArray.length) {
        this.currentIdleSpriteIndex = 0;
      }
    }, 200);
  }
  drawBoss(ctx) {
    if (!this.status) {
      return;
    }
    let spritesArray = this.idleSpriteArray;
    let currentIndex = this.currentIdleSpriteIndex;
    let flipSprite = false;
  
    if (this.isUlting) {
      spritesArray = this.ultimateSpriteArray;
      currentIndex = this.currentUltimateSpriteIndex;
    } else if (this.isRangeAttacking) {
      spritesArray = this.rangeSpriteArray;
      currentIndex = this.currentRangeSpriteIndex;
    } else if (this.isAttacking) {
      spritesArray = this.meleeSpriteArray;
      currentIndex = this.currentMeleeSpriteIndex;
    } else if (this.currentIdleSpriteIndex !== this.currentSpriteIndex) {
      spritesArray = this.idleSpriteArray;
      currentIndex = this.currentIdleSpriteIndex;
    }
  
    if (this.x < character.x) {
      flipSprite = true;
    }
  
    if (!flipSprite) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        spritesArray[currentIndex],
        -this.x - this.width,
        this.y,
        this.width,
        this.height
      );
      ctx.restore();
    } else {
      ctx.drawImage(
        spritesArray[currentIndex],
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }
  
  updateBoss() {
    if (this.isAttacking) {
      this.currentSpriteIndex = this.currentMeleeSpriteIndex;
    } else if (this.isUlting) {
      this.currentSpriteIndex = this.currentUltimateSpriteIndex;
    } else if (this.isRangeAttacking) {
      this.currentSpriteIndex = this.currentRangeSpriteIndex;
    } else {
      this.currentSpriteIndex = this.currentIdleSpriteIndex;
    }
  }
    
  initializeUltimateTimeout() {
    setTimeout(() => {
      this.ultimateReady = true;
    }, 15000);
  }

  bossMeleeAttack() {
    if (this.canAttack) {
      this.isAttacking = true;
      this.canAttack = false;
      this.width *= 1.55
      const widthDiff = this.width - this.baseWidth;
      this.x -= widthDiff;
      setTimeout(() => {
        this.isAttacking = false;
        this.canAttack = true;
        this.width = this.baseWidth
        this.x = this.basex
        this.currentMeleeSpriteIndex = 0;
        clearInterval(this.spriteInterval); 
      }, this.meleeAttackTime);
      this.spriteInterval = setInterval(() => {
        this.currentMeleeSpriteIndex++;
        if (this.currentMeleeSpriteIndex >= this.meleeSpriteArray.length) {
          this.currentMeleeSpriteIndex = 0;
        }
      }, this.meleeAttackTime / this.meleeSpriteArray.length);
    }
  }
  
  bossUltimateAttack() {
    if (this.canAttack) {
      this.isUlting = true;
      this.canAttack = false;
      this.width *= 2.5;
      const widthDiff = this.width - this.baseWidth;
      this.x -= widthDiff;
      this.ultimateReady = false;
      this.initializeUltimateTimeout();
      setTimeout(() => {
        this.isUlting = false;
        this.canAttack = true;
        this.width = this.baseWidth
        this.x = this.basex
        this.currentUltimateSpriteIndex = 0;
        clearInterval(this.spriteInterval); 
      }, this.ultimateAttackTime);
      this.spriteInterval = setInterval(() => {
        this.currentUltimateSpriteIndex++;
        if (this.currentUltimateSpriteIndex >= this.ultimateSpriteArray.length) {
          this.currentUltimateSpriteIndex = 0;
        }
      }, this.ultimateAttackTime / this.ultimateSpriteArray.length);
    }
  }
  
  bossRangeAttack() {
    if (this.canAttack) {
      this.isRangeAttacking = true;
      this.canAttack = false;
      this.width *= 1.55
      const widthDiff = this.width - this.baseWidth;
      this.x -= widthDiff;
      setTimeout(() => {
        this.isRangeAttacking = false;
        this.canAttack = true;
        this.width = this.baseWidth
        this.x = this.basex
        this.currentRangeSpriteIndex = 0;
        clearInterval(this.spriteInterval); 
      }, this.rangeAttackTime);
      this.spriteInterval = setInterval(() => {
        this.currentRangeSpriteIndex++;
        if (this.currentRangeSpriteIndex >= this.rangeSpriteArray.length) {
          this.currentRangeSpriteIndex = 0;
        }
      }, this.rangeAttackTime / this.rangeSpriteArray.length);
    }
  }
  bossAttack() {
    if (this.ultimateReady === true) {
      this.bossUltimateAttack();
    } else if (Math.abs(this.x - character.x) < 300) {
      this.bossMeleeAttack();
    } else {
      this.bossRangeAttack();
    }
  }
  startBossAttacks() {
    const performAttack = () => {
      this.bossAttack();
      const attackInterval = Math.random() * 3500; 
      setTimeout(performAttack, attackInterval);
    };
    const initialAttackInterval = Math.random() * 3500; 
    setTimeout(performAttack, initialAttackInterval);
  }
}

function update() {
  mageBoss.updateBoss();
  mageBoss.drawBoss(ctx);
  requestAnimationFrame(update);
}
let bossArray = []
const mageBoss = new Boss(
  80,
  150,
  20,
  1,
  900,
  2,
  2100,
  4,
  1200,
  [
    "mage-idle00.png",
    "mage-idle01.png",
    "mage-idle02.png",
    "mage-idle03.png",
    "mage-idle04.png",
    "mage-idle05.png",
    "mage-idle06.png",
  ],
  [
    "mage-melee00.png",
    "mage-melee01.png",
    "mage-melee02.png",
    "mage-melee03.png",
  ],
  [
    "mage-ultimate00.png",
    "mage-ultimate01.png",
    "mage-ultimate02.png",
    "mage-ultimate03.png",
    "mage-ultimate04.png",
    "mage-ultimate05.png",
    "mage-ultimate06.png",
    "mage-ultimate07.png",
    "mage-ultimate08.png",
    "mage-ultimate09.png",
    "mage-ultimate10.png",
    "mage-ultimate11.png",
    "mage-ultimate12.png",
    "mage-ultimate13.png",
  ],
  [
    "mage-range00.png",
    "mage-range01.png",
    "mage-range02.png",
    "mage-range03.png",
    "mage-range04.png",
    "mage-range05.png",
    "mage-range06.png",
    "mage-range07.png",
  ]
);
bossArray.push(mageBoss)
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
const bowCharacterSprites = createSpriteArray(character.bowSprites);
const arrowImage = new Image()
arrowImage.src = "images/item_8.png"
arrowImage.width = 60;
arrowImage.height = 50;

let isRunning = false;
let isJumping = false;
let isCrouching = false;
let isAttacking = false
let isUsingBow = false;
let isUsingUltimate = false;
setTimeout(() => {
  character.ultimateReady= true
}, 15000);
const backgroundImage = new Image();
backgroundImage.src = "images/Dryland.png";
backgroundImage.onload = () => {
  gameLoop();
};

let isRightKeyPressed = false;
let isLeftKeyPressed = false;
let isSpaceBarPressed = false;
let isDownKeyPressed = false;
let arrow = null;
let isArrowActive = false;
document.addEventListener("keydown", (event) => {
  for (let boss of bossArray){
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
        character.currentJumpingSpriteIndex = 0;
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
      case "q":
      case "Q":
        if (character.canAttack){
          isAttacking = true;
          character.currentSwordSpriteIndex = 0;
          character.canAttack = false
          setTimeout(() => {
            isAttacking = false;
            character.canAttack= true
            if ((isLeftKeyPressed && boss.x - character.x <= 0 && boss.x - character.x >= -150)|| (boss.x - character.x >= 0 && boss.x - character.x <= 150)){
              boss.health -=2
            }
          }, 750);}
          break;
      case "E":
      case "e":
        if (character.ultimateReady){
          isUsingUltimate = true;
          character.currentUltimateSpriteIndex = 0;
          character.ultimateReady = false
          setTimeout(() => {
            isUsingUltimate = false;
            if (Math.abs(boss.x - character.x) < 150){
              boss.health -=4
            }
          }, 1800);
          setTimeout(() => {
            character.ultimateReady= true
          }, 15000);}
      break;
      case "W":
        case "w":
        case "z":
        case "Z":
          if (character.canAttack && !isArrowActive) {
            isUsingBow = true;
            character.currentbowSpriteIndex = 0;
            character.canAttack = false;
            setTimeout(() => {
                   arrow = {
                    x: character.x + character.width-25, 
                    y: character.y + character.height/1.5-10, 
                    velocity: 10, 
                    active: true 
                  };
                  isArrowActive = true;
            }, 950);
            setTimeout(() => {
              isUsingBow = false;
              character.canAttack = true;
            }, 1200);
          }
          break;
    
        default:
          break;
      }}
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
  } else if (isUsingBow) {
    spritesArray = bowCharacterSprites;
    currentIndex = character.currentbowSpriteIndex;}
  else if (isAttacking) {
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
  if (isArrowActive) {
    ctx.save();
    ctx.translate(arrow.x, arrow.y);
    ctx.rotate(0.68); // Adjust the rotation angle as per your needs
    ctx.drawImage(arrowImage, -arrowImage.width / 2, -arrowImage.height / 2, arrowImage.width, arrowImage.height);
    ctx.restore();
  }
  ctx.restore();
}    
let shouldStopUltimate = false;
let yIncrement = 0;
let yDecrement = 0;

function updateCharacterPosition() {
  if (!isCrouching && character.canJump) {
    character.height = 148;
    character.y = canvas.height /2.3
  }
  //here you need to check every boss status, if the boss is dead you can go to the next room
  if (isRightKeyPressed && isCrouching && character.x < canvas.width - character.width) {
    character.x += 1.5;
  }
  else if (isRightKeyPressed && character.x < canvas.width - character.width){
    character.x += 5;
  }
  if (isLeftKeyPressed && isCrouching && character.x > 0) {
    character.x -= 1.5;
  }
  else if (isLeftKeyPressed && character.x > 0){
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
      if (character.x < canvas.width - character.width){
      character.x += 1.5;}
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
      character.height = 110;
      character.y = canvas.height /2.3 +38
  }


}
function updateArrowPosition() {
  if (isArrowActive) {
    arrow.x += arrow.velocity;
  
    if (arrow.x >= bossArray[0].x) {
      isArrowActive = false;
      bossArray[0].health -= 1;
    }
  }
}
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  update();
  drawCharacter();
  updateArrowPosition();
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(`Health: ${character.health}`, 10, 30);
  ctx.fillText(`Ultimate: ${character.ultimateReady ? "Ready" : "Charging"}`, 10, 60);
  ctx.fillText(`Boss Health: ${mageBoss.health}`, canvas.width - 200, 30); // Display boss health on the top right

  updateCharacterPosition();

  requestAnimationFrame(gameLoop);
}
mageBoss.idleBoss();
mageBoss.startBossAttacks();
character.spriteInterval = setInterval(() => {
  if (isUsingUltimate) {
    character.currentUltimateSpriteIndex++;
    if (character.currentUltimateSpriteIndex >= character.ultimateSprites.length) {
      character.currentUltimateSpriteIndex = 0;
    }
  }
  else if (isUsingBow) {
    character.currentbowSpriteIndex++;
    if (character.currentbowSpriteIndex >= character.bowSprites.length) {
      character.currentbowSpriteIndex = 0;
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