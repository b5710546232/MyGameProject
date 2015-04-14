var GameLayer = cc.LayerColor.extend({
	init: function() {
		this._super( new cc.Color( 127, 127, 127, 255 ) );
        this.setPosition( new cc.Point( 0, 0 ) );
        this.createPlayer();
        this.createDrill();

        this.addKeyboardHandlers();

        this.initCondition();
        this.initFloorSets();
        this.initTimer();
        this.createBG();
        this.createScoreLabel();
        this.score = 0;
        this.scheduleUpdate();
        this.isPlayerGetBomb = false;
        return true;
    },

    shakeScreen:function(){
        var shakeForce = 5;
        this.setPosition(0,shakeForce);
    },

    update: function(dt) {
        this.counterTime(dt);
        this.floorManage();
        this.gameStart();
        this.playerHitSideFloorSet();
        this.playerOutScreen();
        this.updateScore(this.score);
        this.setPosition(0,0);
        //this.createRainbowDrill();
    },

    updateScore:function(score){
        this.scoreLabel.setString("Score : "+score);

    },

    initCondition:function(){
        this.isStart = false;
        this.checkFloorCreate = false;
        this.isGameOver = false;

    },


    createDrill:function(){
        this.drill = new Drill(this.player);
        this.drill.scheduleUpdate();
        this.addChild(this.drill,3);

    },

    createScoreLabel:function(){
        this.scoreLabel = cc.LabelTTF.create( '0', 'Arial', 30 );
        this.scoreLabel.setPosition( new cc.Point( 680, 400 ) );
        this.addChild( this.scoreLabel );
    },
    
    createBG:function(){
      this.bg = new PackBackGround(this);
      this.addChild(this.bg,0);
  },

  initTimer:function(){
    this.totalDeltaTime=0;
    this.counterSec = 0;
    this.delayRainbowDrill = 0;
    this.xModeTime = 0;
},
counterTime:function(dt){
    if(this.isStart){
       this.totalDeltaTime+= dt;
   }
   if(this.totalDeltaTime>1){
    this.counterSec++;
            // console.log(this.counterSec);
            this.delayRainbowDrill++;
            this.totalDeltaTime=0;
            //this.playerInXMode();
    }

    },
    // playerInXMode:function(){
    //     if(this.xModeTime>0){
    //         this.xModeTime--;
    //     }
    //     if(this.xModeTime<=0&&this.player.drillType=='X'){
    //         console.log('out x mode');
    //         this.xModeTime = 0;
    //         this.player.drillType = 'D';
    //     }

    // },
    /*will reCode by use extends.
    */
createRainbowDrill:function(){ // item to change to X mode 
    if(this.isStart&&this.delayRainbowDrill==10){
            var rainbowDrill = new Item(this);
            rainbowDrill.scheduleUpdate();
            this.addChild(rainbowDrill,2);
            this.delayRainbowDrill = 0;
    }

},
playerHitSideFloorSet:function(){
    this.playerRightSideHitGround(this.floorSets);
    this.playerRightSideHitGround(this.floorSets2);
},
initFloorSets:function(){
    this.floorSpeed = 0;
    this.floorSets2 = [];
    this.floorSets  = this.createFloors(0);
    this.floorSets2 = [];
    this.floorSets2 = this.createFloors(1);
},
floorManage:function(){
    var ran = 1+Math.floor(Math.random()*this.numOfMap);
        //console.log(ran);
        // run
        if(this.floorSets[this.floorSets.length-1].outOfScreen()){
            this.floorSetsRun(this.floorSets2,this.floorSpeed);
        }
        //create
        if(this.floorSets[this.floorSets.length-1].outOfScreen()&&this.checkFloorCreate==false){
            this.checkFloorCreate=true;
            this.floorSets = null;
            this.floorSets = this.createFloors(ran);

        }
        // run
        if(this.floorSets2[this.floorSets2.length-1].outOfScreen()){
            if(this.checkFloorCreate){
                this.checkFloorCreate=false;
                this.floorSetsRun(this.floorSets,this.floorSpeed);
            }
            //create
            if(this.floorSets2[this.floorSets2.length-1].outOfScreen()){
                this.floorSets2=null;
                this.floorSets2 = this.createFloors(ran)
            }
        }
    },
createPlayer:function(){
    this.player = new Player();
    this.player.setPosition(new cc.Point(200,300))
    this.addChild(this.player,2)
    this.player.scheduleUpdate();
},
createRandomFloorsPatterns: function(num){
    var map = [ [1,1,1,1,1,1,1,1],
    [0,1,0,0,1,1,1,1],
    [0,1,1,1,1,1,1,1],
    [0,1,0,1,1,0,1,1],
    [0,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1],
    [0,1,0,1,0,1,1,1]
    ];
    this.numOfMap = map.length-1;
    return map[num];
},
createFloors: function(num){
    var floorSet = [];
    var index = 0;
    var map = this.createRandomFloorsPatterns(num);
    for(var i = 0 ;i<map.length;i++){
        if(map[i]==1){
            var floor = new Floor(this);
            if(num==0){
             floor.setPosition(50+100*i,10) ;    
         }
         else{
                var floorWidth = 100;
                floor.setPosition(floorWidth/2+screenWidth+(100*i),10);
                var  chanceCreateMon = 1+Math.floor(Math.random()*2)
                if(chanceCreateMon!=1){
                    var ranMonType = Math.floor(Math.random()*4)
                    var monType = ['R','L','D','U']
                       var m = new Monster(floor,monType[ranMonType]);
                    m.scheduleUpdate();
                    this.addChild(m,1);
                }
        }
            floor.scheduleUpdate();
            this.addChild(floor,1);
            floorSet.push(floor);
        }
    }   
    this.FloorSetPosX = floorSet[floorSet.length-1].getBoundingBox().x+50;
return floorSet;
},
gameStart:function(){
    if(this.isStart){
        this.player.startToPlay();
        this.floorSetsRun(this.floorSets,this.floorSpeed);
        this.floorSetsRun(this.floorSets2,this.floorSpeed);
    }
},
floorSetsRun:function(floorSets,speed){
    for(var i = 0 ;i<floorSets.length;i++){
        floorSets[i].run(speed);
    }
},
gameOver:function(){
    this.player.death();
    this.isGameOver = true;
        if(this.isGameOver){
            this.shakeScreen();
        }
    this.floorSpeed = 0;
},
setFloorsSpeed:function(floorSets,newSpeed){
   for(var i = 0;i<floorSets.length;i++){

    floorSets[i].speed = speed;
}
},
playerOutScreen:function(){
    if(this.player.isFall()){
        this.gameOver();
    }
},
playerRightSideHitGround:function(floorSets){
    for(var i = 0;i<floorSets.length;i++){
      if(floorSets[i].checkCollision  (this.player.getPlayerRectSideR())){
        this.gameOver();

    }
}
},
onKeyDownForCheck: function( e ) {
    if(e==69){
        this.isStart = true;
    }
            if(e==81){ // q
                window.location.reload();
            }
            if (e==82){ //r refesh
                console.log('re');
                this.player.setPosition(200,300);
                this.player.vy = Player.STARTING_VELOCITY;
                Player.G = -1;
                this.player.canJump = false;
                this.player.grounded = false;
                this.stop=false;
                this.player.isDie = false
                this.player.hp = 10;
                this.floorSpeed = 5;

            }
            if ( e == 68) { //right
                this.player.setPosition(new cc.Point(this.player.getPosition().x+10
                    ,this.player.getPosition().y));
            }
            if ( e == 65) {//right
                this.player.setPosition(new cc.Point(this.player.getPosition().x-10
                    ,this.player.getPosition().y));
            }
            if ( e == 84) { //t stop
                this.floorSpeed = 0;
                this.isStart = false;
                Player.G = 0;
                this.player.vy=0;
            }
            if( e==87){//up
             this.player.setPosition(new cc.Point(this.player.getPosition().x
                ,this.player.getPosition().y+10));
         }
            if(e==83){ //down
             this.player.setPosition(new cc.Point(this.player.getPosition().x
                ,this.player.getPosition().y-10));

         }
         if(e==49){
            this.isPlayerGetBomb = true;
            this.floorSpeed++;
        }
    },
onKeyDown:function(e){
    if(GameLayer.KEYS[cc.KEY.space]){
            this.player.jump();
            if(!this.isStart)this.floorSpeed=3.5;
            this.isStart = true;
    }
            if(e==cc.KEY.up||
            e==cc.KEY.down||
            e==cc.KEY.right||
            e==cc.KEY.left){
                this.player.switchDrillType();
            }
    //this.player.stopAction(this.player.movingAction);
           // console.log(e);
},

onKeyUp: function( e ) {
    if(e!=cc.KEY.up||
        e!=cc.KEY.down||
        e!=cc.KEY.right||
        e!=cc.KEY.left){
        this.player.switchDrillType();
    }
    else if(e==cc.KEY.up||
        e==cc.KEY.down||
        e==cc.KEY.right||
        e==cc.KEY.left){
        this.player.drillType = 'N';
    }
},
addKeyboardHandlers: function() {
    var self = this;
    cc.eventManager.addListener({
        event: cc.EventListener.KEYBOARD,
        onKeyPressed : function(keyCode,event ) {
            GameLayer.KEYS[keyCode] = true;
            self.onKeyDown( keyCode);
            self.onKeyDownForCheck(keyCode);
        },
        onKeyReleased: function( keyCode,event) {
            GameLayer.KEYS[keyCode] = false;
            self.onKeyUp( keyCode);
        }
    }, this);
},


});
var StartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new GameLayer();
        layer.init();
        this.addChild( layer );
    },
});
GameLayer.KEYS = [];