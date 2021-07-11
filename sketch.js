//ESTADOS DEL JUEGO
var PLAY = 1;
var END = 0;
var gameState = PLAY;
//VARIABLES PARA TREX
var trex, trex_running, trex_collided;
//VARIABLES PARA EL SUELO
var ground, invisibleGround, groundImage;
//VARIABLES PARA NUBES
var cloudsGroup, cloudImage;
//VARIABLES PARA OBSTACULOS
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
//GRUPO AVES
var avesGroup;
//VARIABLES PARA SONIDO Y PUNTUACION
var score;
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;
 var mensaje="Aquí estoy!";

////////////////////////////////////////////////////////
function preload()
{
  //ANIMACION TREX CORRIENDO
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  //ANIMACION TREX ABRIENDO OJOS
  trex_collided = loadAnimation("trex_collided.png");
  
  //IMAGEN DE SUELO
  
  groundImage = loadImage("ground2.png");
  
  //IMAGEN DE NUBES
  
  cloudImage = loadImage("cloud.png");
  
  //IMAGENES DE OBSTACULOS
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  //IMAGENES DE LETREROS
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  //SONIDOS DEL PROGRAMA
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() 
{
  createCanvas(windowWidth, windowHeight);

  console.log(width);

  //CAMBIO ANIMACION TREX CORRIENDO Y CHOCANDO
  trex = createSprite(50,height-200,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.7;
  
  ground = createSprite(width/2,height-200,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
 
  
  invisibleGround = createSprite(width/2,height-160,width,30);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  avesGroup= createGroup();
       
  gameOver = createSprite(width/2,height/2-40);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.755;
  restart.scale = 0.7555;
 
trex.setCollider("rectangle",0,0,trex.width,trex.height);
  //trex.debug = true;
  
  score = 0;
  
}

function draw() 
{
  console.log(windowHeight)
  background('white');
 
  
  //displaying score
  text("Score: "+ score, 400,50);
  
 
  if(gameState === PLAY){
       
    gameOver.visible=false;
     restart.visible=false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0)
    {
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= windowHeight-210|| keyDown("up")&& trex.y >= windowHeight-210) {
      
        trex.velocityY = -15;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
   
    
    if(obstaclesGroup.isTouching(trex)){
       
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
    if(avesGroup.isTouching(trex)){
       
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
    //////CONDICION DE LUNAS
    if(score>300)
    {
    
        noStroke();
        circle(500,50,40);
      
        fill("white");
        circle(490,50,40);
    
    }
 
    if(score>100)
       {
      //spawn Aves
      spawnAves();
         noStroke();
        circle(490,50,40);
      
        fill("white");
        circle(500,50,40);
      if(keyDown("down")){
        trex.scale=0.3;
      }
       }
    
  }
   else if (gameState === END) 
   {
      gameOver.visible=true;
     restart.visible=true;
     
     //TREX CIERRA LOS OJOS
      trex.changeAnimation("collided", trex_collided);
     //DEJO DE MOVER EL SUELO Y A TREX    
      ground.velocityX = 0;
      trex.velocityY = 0
    //HAGO QUE LOS OBJETOS NO DESAPAREZCAN
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
    //DETENGO MOVIMIENTO DE LOS OBSTACULOS
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0); 
   if(mousePressedOver(restart)||keyDown("space"))
  {
    reset(); 
  }
  
   
     
   }
  
 
  //TREX CHOCA CONTRA SUELO INVISIBLE
  trex.collide(invisibleGround);
  drawSprites();
}
///////////////////////////FUNCIONES
function reset()
{
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  avesGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score=0;
  
}


function spawnObstacles()
{
 if (frameCount % 120 === 0)
 {
   var obstacle = createSprite(600,height-200,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() 
{
  
  if (frameCount % 60 === 0)
  {
    var cloud = createSprite(width,height,40,10);
    cloud.y = Math.round(random(50,250));
    cloud.addImage(cloudImage);
    cloud.scale = 0.7;
    cloud.velocityX = -3;
    
    //ASIGNO TIEMPO DE VIDA A LAS NUBES
    cloud.lifetime = 200;
    
    //GARANTIZO QUE TREX ESTE DELANTE DE LAS NUBES
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //AÑADO NUBES AL GRUPO NUBES
    cloudsGroup.add(cloud);
  }
}

function spawnAves() 
{
  
  if (frameCount % 150 == 0)
  {
    var aves = createSprite(400,60,20,10);
    aves.x = Math.round(random(300,600));
    aves.y = Math.round(random(300,385));
    
    aves.velocityX = -6;
    
    //ASIGNO TIEMPO DE VIDA A LAS NUBES
    aves.lifetime = 200;
    
    //GARANTIZO QUE TREX ESTE DELANTE DE LAS AVES
    aves.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //AÑADO NUBES AL GRUPO NUBES
    avesGroup.add(aves);
  }
}
