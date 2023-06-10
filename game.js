const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let level = 1
let rangeAttacks = [];
const vampireMeleeAttackImage = new Image();
vampireMeleeAttackImage.src = "images/Bosses/vampire-melee-attack1.png";
vampireMeleeAttackImage.width = 2000;
vampireMeleeAttackImage.height = 2000;
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
  constructor(name, width, height, health, meleeDamages, meleeAttackTime, rangeDamages, rangeAttackTime, ultimateDamages, ultimateAttackTime, idleSprites, meleeSprites, ultimateSprites, rangeSprites, ultimateSpellSprites) {
    this.name = name;
    this.x = 1500;
    this.basex = this.x
    this.y = character.y + (character.height - height);
    this.basey = this.y
    this.currentCharacterX = 0
    this.baseWidth = width
    this.width = width;
    this.height = height;
    this.baseHeight = height;
    this.health = health;
    this.meleeDamages = meleeDamages;
    this.rangeDamages = rangeDamages;
    this.ultimateDamages = ultimateDamages;
    this.idleSprites = idleSprites;
    this.meleeSprites = meleeSprites;
    this.ultimateSprites = ultimateSprites;
    this.rangeSprites = rangeSprites;
    this.ultimateSpellSprites = ultimateSpellSprites
    this.currentSpriteIndex = 0;
    this.currentMeleeSpriteIndex = 0;
    this.currentUltimateSpriteIndex = 0;
    this.currentRangeSpriteIndex = 0;
    this.currentIdleSpriteIndex = 0;
    this.currentUltimateSpellSpriteIndex = 0;
    this.spriteInterval = null;
    this.canAttack = true;
    this.ultimateReady = false;
    this.status = true;
    this.isAttacking = false;
    this.isUlting = false;
    this.isUltingPart2 = false;
    this.isRangeAttacking = false;
    this.meleeAttackTime = meleeAttackTime;
    this.rangeAttackTime = rangeAttackTime;
    this.ultimateAttackTime = ultimateAttackTime;
    this.animationInterval = 200;
    this.idleSpriteArray = this.createBossSpriteArray(idleSprites);
    this.meleeSpriteArray = this.createBossSpriteArray(meleeSprites);
    this.ultimateSpriteArray = this.createBossSpriteArray(ultimateSprites);
    this.ultimateSpellSpriteArray = this.createBossSpriteArray(ultimateSpellSprites);
    this.rangeSpriteArray = this.createBossSpriteArray(rangeSprites);
    this.initializeUltimateTimeout()
  }

  createBossSpriteArray(spriteNames) {
    return spriteNames.map((spriteName) => {
      const sprite = new Image();
      sprite.src = "images/Bosses/" + spriteName;
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
  secondBossUltimate() {
    if (this.isUltingPart2) {
      const ultimateSpellSprite = this.ultimateSpellSpriteArray[this.currentUltimateSpellSpriteIndex];
      switch (this.name){
        case "mageBoss":
        ctx.drawImage(ultimateSpellSprite, this.currentCharacterX-20, canvas.height/2.45 );
        break;
        case "vampireBoss": 
        ctx.drawImage(ultimateSpellSprite, this.currentCharacterX+83, canvas.height/2, ultimateSpellSprite.width * 3.5, ultimateSpellSprite.height * 3.5 );
        break;
        case "samuraiBoss": 
        ctx.drawImage(ultimateSpellSprite, this.currentCharacterX+60, canvas.height/2.2, ultimateSpellSprite.width * 3, ultimateSpellSprite.height * 3 );
        break;
        case "robotBoss": 
        ctx.drawImage(ultimateSpellSprite, this.currentCharacterX-30, canvas.height/2.6, ultimateSpellSprite.width/ 2.8, ultimateSpellSprite.height/ 2.8 );
        break;

      }
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
    let attackRange=200
    if (this.canAttack) {
      this.isAttacking = true;
      this.canAttack = false;
      switch (this.name){
      case "mageBoss":
      this.width *= 1.3
      break;
      case "vampireBoss":
        this.width *=1.15
        attackRange = 160;
        break;
      case "samuraiBoss":
      this.height*=0.75
      break;
      case "robotBoss":
        this.width*=0.85
        break; }
      const heighDiff = this.height -this.baseHeight;
      const widthDiff = this.width - this.baseWidth;
      this.x -= widthDiff;
      this.y-= heighDiff
      setTimeout(() => {
        this.isAttacking = false;
        this.canAttack = true;
        this.width = this.baseWidth;
        this.height = this.baseHeight
        if (this.name === "vampireBoss"){
          ctx.clearRect(this.x, this.y, vampireMeleeAttackImage.width, vampireMeleeAttackImage.height);
        }
        this.x = this.basex
        this.y = this.basey
        this.currentMeleeSpriteIndex = 0;
        if (Math.abs(this.x - character.x) < attackRange){
          character.health-= this.meleeDamages
        }
        clearInterval(this.spriteInterval); 
      }, this.meleeAttackTime/0.75);
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
      this.currentCharacterX = character.x
      let ultimateRange = 0;
      let damagesTakenFromUlt = false;
      switch (this.name){
        case "mageBoss":
          this.width *= 3.1;
          this.height *=1.3;
          ultimateRange = 120
          break;
        case "vampireBoss":
          ultimateRange = 50
          break;
        case "samuraiBoss":
          this.height *=0.75
          this.width *=1.3
          ultimateRange = 60
          break;
        case "robotBoss":
          ultimateRange = 100
          break;
          }
      const heighDiff = this.height -this.baseHeight;
      const widthDiff = this.width - this.baseWidth;
      this.x -= widthDiff;
      this.y-= heighDiff
      this.ultimateReady = false;
      this.initializeUltimateTimeout();
      setTimeout(() => {
        this.isUlting = false;
        this.canAttack = true;
        this.width = this.baseWidth;
        this.height = this.baseHeight
        this.x = this.basex
        this.y = this.basey
        this.currentUltimateSpellSpriteIndex = 0;
        switch (this.name){
          case "mageBoss":
          case "vampireBoss":
          case "robotBoss":
            if (Math.abs(this.x - character.x) < 130){
              character.health-= this.ultimateDamages
              damagesTakenFromUlt = true;
            }
        }
        this.isUltingPart2= true;
        clearInterval(this.spriteInterval); 
      }, this.ultimateAttackTime);
      setTimeout(() => {
        this.isUltingPart2 = false;
        if (!damagesTakenFromUlt){
        if (Math.abs(this.currentCharacterX - character.x) < ultimateRange){
          character.health-= this.ultimateDamages
        }}
      }, this.ultimateAttackTime+this.ultimateSpellSpriteArray.length*130-150);
      this.spriteInterval = setInterval(() => {
        this.currentUltimateSpriteIndex++;
        if (this.currentUltimateSpriteIndex >= this.ultimateSpriteArray.length ) {
          this.currentUltimateSpriteIndex = 0;
        }
      }, this.ultimateAttackTime / this.ultimateSpriteArray.length);
    }
  }

  bossRangeAttack() {
    if (this.canAttack) {
      this.isRangeAttacking = true;
      this.canAttack = false;
      let rangeAttackTiming;
      switch (this.name){
        case "mageBoss":
          this.width *= 1.6;
          rangeAttackTiming = 1400
          break;
          case "vampireBoss":
          rangeAttackTiming = 900
          break;
        case "samuraiBoss":
          this.width *= 1.15;
          this.height *=1.2
          rangeAttackTiming = 1100
           break;
        case "robotBoss":
          this.width *=0.9
          rangeAttackTiming = 430
          break;}
        const heighDiff = this.height -this.baseHeight;
        const widthDiff = this.width - this.baseWidth;
        this.x -= widthDiff;
        this.y-= heighDiff
      setTimeout(() => {
        switch (this.name){
          case "mageBoss":
            const fireBall = {
              x: this.x + this.width - 15,
              y: this.y + this.height / 1.5 - 10,
              velocity: Math.random() * 11 + 5,
              active: true,
            };
            rangeAttacks.push(fireBall);
            break;
          case "vampireBoss":
            const blood = {
              x: this.x + this.width -10,
              y: this.y + this.height / 1.5 - 15,
              velocity: Math.random() * 11 + 5,
              active: true,
            };
            rangeAttacks.push(blood);
            break;
          case "samuraiBoss":
            const samuraiArrow = {
              x: this.x + this.width - 50,
              y: this.y + this.height / 1.5 + 23,
              velocity: Math.random() * 11 + 5,
              active: true,
            };
            rangeAttacks.push(samuraiArrow);
            break;
          case "robotBoss":
            const lightning = {
              x: this.x + this.width - 100,
              y: this.y + this.height / 1.5,
              velocity: Math.random() * 11 + 5,
              active: true,
            };
            rangeAttacks.push(lightning);
            break;
        }

      }, rangeAttackTiming);
      setTimeout(() => {
        this.isRangeAttacking = false;
        this.canAttack = true;
        this.width = this.baseWidth;
        this.height = this.baseHeight
        this.x = this.basex
        this.y = this.basey
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
    if (this.status){
    if (this.ultimateReady === true) {
      this.bossUltimateAttack();
    } else if (Math.abs(this.x - character.x) < 225) {
      this.bossMeleeAttack();
      if (this.name ==="vampireBoss"){
        ctx.drawImage(vampireMeleeAttackImage, this.x-200,this.y);}
    } else {
      this.bossRangeAttack();
    }}
  }
  startBossAttacks() {
    if (this.status){
    const performAttack = () => {
      this.bossAttack();
      const attackInterval = Math.random() * 3500; 
      setTimeout(performAttack, attackInterval);
    };
    const initialAttackInterval = Math.random() * 3500; 
    setTimeout(performAttack, initialAttackInterval);}
  }
  makeBossDie(){
    if (this.health<=0){
      this.status = false;
      level+=0.5
    }
  }
  resetUltimateTiming() {
    clearTimeout(this.ultimateTimeout); 
    this.ultimateReady = false; //
    this.initializeUltimateTimeout(); 
  }
}

function update() {
  if (currentBoss.status){
  currentBoss.updateBoss();
  currentBoss.drawBoss(ctx);}
  requestAnimationFrame(update);
}

const mageBoss = new Boss(
  "mageBoss",
  80,
  150,
  2,
  1,
  900,
  2,
  1800,
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
  ],
  [
    "Nuclear_explosion1.png",
    "Nuclear_explosion2.png",
    "Nuclear_explosion3.png",
    "Nuclear_explosion4.png",
    "Nuclear_explosion5.png",
    "Nuclear_explosion6.png",
    "Nuclear_explosion7.png",
    "Nuclear_explosion8.png",
    "Nuclear_explosion9.png",
    "Nuclear_explosion10.png",
  ],
);
const vampireBoss = new Boss(
  "vampireBoss",
  100,
  150,
  2,
  2,
  1350,
  2,
  900,
  4,
  900,
  [
    "Vampire-idle01.png",
    "Vampire-idle02.png",
    "Vampire-idle03.png",
    "Vampire-idle04.png",
    "Vampire-idle05.png",
  ],
  [
    "Vampire-melee01.png",
    "Vampire-melee02.png",
    "Vampire-melee03.png",
    "Vampire-melee04.png",
    "Vampire-melee05.png",
    "Vampire-melee06.png",
  ],
  [
    "Vampire-ultimate01.png",
    "Vampire-ultimate02.png",
    "Vampire-ultimate03.png",
    "Vampire-ultimate04.png",
  ],
  [
    "Vampire-range01.png",
    "Vampire-range02.png",
    "Vampire-range03.png",
    "Vampire-range04.png",
    "Vampire-range05.png",
    "Vampire-range06.png",
  ],
  [
    "ultimate-spell1.png",
    "ultimate-spell2.png",
    "ultimate-spell3.png",
    "ultimate-spell4.png",
    "ultimate-spell5.png",
    "ultimate-spell6.png",
  ],
); 
const samuraiBoss = new Boss(
  "samuraiBoss",
  125,
  225,
  2,
  3,
  1125,
  2,
  1200,
  5,
  1200,
  [
    "samurai-idle1.png",
    "samurai-idle2.png",
    "samurai-idle3.png",
    "samurai-idle4.png",
    "samurai-idle5.png",
    "samurai-idle6.png",
    "samurai-idle7.png",
    "samurai-idle8.png",
    "samurai-idle9.png",
  ],
  [
    "samurai-melee1.png",
    "samurai-melee2.png",
    "samurai-melee3.png",
    "samurai-melee4.png",
    "samurai-melee5.png",
  ],
  [
    "samurai-ultimate1.png",
    "samurai-ultimate2.png",
    "samurai-ultimate3.png",
    "samurai-ultimate4.png",
    "samurai-ultimate5.png",
    "samurai-ultimate6.png",
    "samurai-ultimate7.png",
    "samurai-ultimate8.png",
    "samurai-ultimate9.png",
    "samurai-ultimate10.png",
    "samurai-ultimate11.png",
  ],
  [
    "samurai-range1.png",
    "samurai-range2.png",
    "samurai-range3.png",
    "samurai-range4.png",
    "samurai-range5.png",
    "samurai-range6.png",
    "samurai-range7.png",
    "samurai-range8.png",
  ],
  [
    "samurai-ultimate-spell-1.png",
    "samurai-ultimate-spell-2.png",
    "samurai-ultimate-spell-3.png",
    "samurai-ultimate-spell-4.png",
    "samurai-ultimate-spell-5.png",
  ],
);
const robotBoss = new Boss(
  "robotBoss",
  200,
  170,
  2,
  3,
  900,
  3,
  600,
  7,
  1200,
  [
    "robot-idle1.png",
    "robot-idle2.png",
    "robot-idle3.png",
    "robot-idle4.png",
    "robot-idle5.png",
  ],
  [
    "robot-melee1.png",
    "robot-melee2.png",
    "robot-melee3.png",
    "robot-melee4.png",
    "robot-melee5.png",
    "robot-melee6.png",
  ],
  [
    "robot-ultimate1.png",
    "robot-ultimate2.png",
    "robot-ultimate3.png",
  ],
  [
    "robot-range1.png",
    "robot-range2.png",
    "robot-range3.png",
    "robot-range4.png",
  ],
  [
    "Explosion_1.png",
    "Explosion_2.png",
    "Explosion_3.png",
    "Explosion_4.png",
    "Explosion_5.png",
    "Explosion_6.png",
    "Explosion_7.png",
    "Explosion_8.png",
    "Explosion_9.png",
    "Explosion_10.png",
  ],
);
const fireBallImage = new Image();
fireBallImage.src = "images/Bosses/fireball03.png";
fireBallImage.width = 40;
fireBallImage.height = 40;
const bloodImage = new Image();
bloodImage.src ="images/Bosses/vampire-range-attack.png"
bloodImage.width = 40;
bloodImage.height = 30;
const samuraiArrowImage = new Image();
samuraiArrowImage.src ="images/Bosses/samurai-arrow.png"
samuraiArrowImage.width = 40;
samuraiArrowImage.height = 30;
const lightingImage = new Image();
lightingImage.src ="images/Bosses/Robot-electricity.png"
lightingImage.width = 40;
lightingImage.height = 30;
let rangeAttack = null;
function updateRangeAttackPosition() {
  for (let i = 0; i < rangeAttacks.length; i++) {
    let rangeAttack = rangeAttacks[i];
    rangeAttack.x -= rangeAttack.velocity;
    if (rangeAttack.x < 0) {
      rangeAttacks.splice(i, 1);
      i--;
    } else if (
      Math.abs(character.x + 150 - rangeAttack.x) <= 10 &&
      Math.abs(character.y - rangeAttack.y + 100) <= 20
    ) {
      rangeAttacks.splice(i, 1);
      i--;
      character.health -= 2;
    } else {
      ctx.save();
      ctx.translate(rangeAttack.x, rangeAttack.y);
      ctx.scale(-1, 1);
      switch (currentBoss){
        case mageBoss:
          ctx.drawImage(
            fireBallImage,
            -fireBallImage.width / 2 + 50,
            -fireBallImage.height / 2 - 40,
            fireBallImage.width,
            fireBallImage.height
          );  
          break;
        case vampireBoss:
          ctx.drawImage(
            bloodImage,
            -bloodImage.width / 2 + 80,
            -bloodImage.height / 2 - 40,
            bloodImage.width,
            bloodImage.height
          ); break;
        case samuraiBoss:
            ctx.drawImage(
              samuraiArrowImage,
              samuraiArrowImage.width,
            -samuraiArrowImage.height / 2 - 40,
            samuraiArrowImage.width*1.8,
            samuraiArrowImage.height/2.3
            ); break;
        case robotBoss:
          ctx.rotate(-Math.PI / 2);
            ctx.drawImage(
              lightingImage,
              -lightingImage.width / 2 + 50,
                -lightingImage.height / 2 - 40,
                lightingImage.width*1.5,
                lightingImage.height*3.3
              ); break;
          }

          ctx.restore();


    }
  }
}


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
let wasArrowAimingLeft = false;

setTimeout(() => {
  character.ultimateReady= true
}, 15000);
let backgroundImage = new Image();
backgroundImage.src = "images/Dryland.png";
let currentBoss = mageBoss;


let isGameLooping = false

backgroundImage.onload = () => {
  currentBoss.idleBoss();
  currentBoss.startBossAttacks();
  if (!isGameLooping) {
    gameLoop();
    isGameLooping = true
  }
};

let isRightKeyPressed = false;
let isLeftKeyPressed = false;
let isSpaceBarPressed = false;
let isDownKeyPressed = false;
let arrow = null;
let isArrowActive = false;
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
        character.currentJumpingSpriteIndex = 0;
      }
        break;
    case "ArrowDown":
      if (character.canJump && character.canAttack) {
        isDownKeyPressed = true;
        isCrouching = true
        character.canAttack = false;
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
            if ((isLeftKeyPressed && currentBoss.x - character.x <= 0 && currentBoss.x - character.x >= -150)|| (currentBoss.x - character.x >= 0 && currentBoss.x - character.x <= 150)){
              currentBoss.health -=2
            }
          }, 500);
          setTimeout(() => {
            isAttacking = false;
            character.canAttack= true
          
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
            if (Math.abs(currentBoss.x - character.x) < 150){
              currentBoss.health -=4
            }
          }, 1800);
          setTimeout(() => {
            character.ultimateReady= true
          },15000);}
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
                  if (isLeftKeyPressed){
                    wasArrowAimingLeft = true
                  }
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
      character.canAttack = true;
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

  ctx.restore();
}    
let shouldStopUltimate = false;
let yIncrement = 0;
let yDecrement = 0;
let characterSpeed = 5;
function updateCharacterPosition() {
  if (!isCrouching && character.canJump) {
    character.height = 148;
    character.y = canvas.height /2.3
  }
 
  if (!Number.isInteger(level) && isRightKeyPressed && isCrouching){
    character.x += characterSpeed/3;
  }
  else if (!Number.isInteger(level) && isRightKeyPressed){
    character.x += characterSpeed;
  }
  else if (isRightKeyPressed && isCrouching && character.x < canvas.width - character.width) {
    character.x += characterSpeed/3;
  }
  else if (isRightKeyPressed && character.x < canvas.width - character.width){
    character.x += characterSpeed;
  }

  if (isLeftKeyPressed && isCrouching && character.x > 0) {
    character.x -= characterSpeed/3;
  }
  else if (isLeftKeyPressed && character.x > 0){
    character.x -= characterSpeed;
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
      character.x += characterSpeed/3;}
    }
  
  if (isSpaceBarPressed && character.canJump) {
    character.canJump = false;
    const jumpInterval = setInterval(() => {
      character.y -= 20;
    }, 50);
    setTimeout(() => {
      clearInterval(jumpInterval);
      const downJumpInterval = setInterval(() => {
        character.y += 20;
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
  if (isArrowActive && wasArrowAimingLeft) {
    arrow.x -= arrow.velocity;
    ctx.save();
    ctx.translate(arrow.x, arrow.y);
    ctx.scale(-1, 1);
    ctx.rotate(0.68); 
    ctx.drawImage(arrowImage, -arrowImage.width /2 +65, -arrowImage.height / 2 -65 , arrowImage.width, arrowImage.height);
    ctx.restore();
    if (arrow.x < 0) {
      isArrowActive = false;
      wasArrowAimingLeft = false;
    }
    if (character.x > currentBoss.x) {
      if (arrow.x <= currentBoss.x +50) {
        currentBoss.health -= 1;
        isArrowActive = false;
      }
    }

  }
  else if (isArrowActive) {
    arrow.x += arrow.velocity;
    ctx.save();
    ctx.translate(arrow.x, arrow.y);
    ctx.rotate(0.68); 
    ctx.drawImage(arrowImage, -arrowImage.width / 2, -arrowImage.height / 2, arrowImage.width, arrowImage.height);
    ctx.restore();
    if (arrow.x >= currentBoss.x) {
      if (character.x>currentBoss.x){
        if (arrow.x>canvas.width){
          isArrowActive = false;
        }
      }
      else if (character.x<currentBoss.x){
      isArrowActive = false;
      currentBoss.health -= 1;  }
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
  if (currentBoss.health>0){
  ctx.fillText(`Boss Health: ${currentBoss.health}`, canvas.width - 200, 30);}
  updateCharacterPosition();
if (currentBoss.status){
  updateRangeAttackPosition();
  currentBoss.secondBossUltimate()
  currentBoss.makeBossDie();
}
if (character.x>=canvas.width){
  switch (level) {
    case 1.5:
      backgroundImage.src = "images/castleland.png";
      currentBoss = vampireBoss
      break;
    case 2.5:
      backgroundImage.src = "images/terraceland.png";
      currentBoss = samuraiBoss
      break;
    case 3.5:
      backgroundImage.src = "images/skyland.png";
      currentBoss = robotBoss
      break;
    default:
      break;
  }
  character.x = 20
  characterSpeed *=1.2
  if (character.health<=8){
  character.health+=2}
  else if (character.health===9){
  character.health=10
  }
  level+=0.5
  currentBoss.resetUltimateTiming()
}
  requestAnimationFrame(gameLoop);
}

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

    mageBoss.spriteInterval = setInterval(() => {
      mageBoss.currentUltimateSpellSpriteIndex++;
      if (mageBoss.currentUltimateSpellSpriteIndex >= mageBoss.ultimateSpellSpriteArray.length) {
        mageBoss.currentUltimateSpellSpriteIndex = 0;
      }
    }, 130);
    vampireBoss.spriteInterval = setInterval(() => {
      vampireBoss.currentUltimateSpellSpriteIndex++;
      if (vampireBoss.currentUltimateSpellSpriteIndex >= vampireBoss.ultimateSpellSpriteArray.length) {
        vampireBoss.currentUltimateSpellSpriteIndex = 0;
      }
    }, 130);
    samuraiBoss.spriteInterval = setInterval(() => {
      samuraiBoss.currentUltimateSpellSpriteIndex++;
      if (samuraiBoss.currentUltimateSpellSpriteIndex >=samuraiBoss.ultimateSpellSpriteArray.length) {
        samuraiBoss.currentUltimateSpellSpriteIndex = 0;
      }
    }, 180);
    robotBoss.spriteInterval = setInterval(() => {
      robotBoss.currentUltimateSpellSpriteIndex++;
      if (robotBoss.currentUltimateSpellSpriteIndex >=robotBoss.ultimateSpellSpriteArray.length) {
        robotBoss.currentUltimateSpellSpriteIndex = 0;
      }
    }, 130);
  
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });