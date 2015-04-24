var GameOverScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new GameOverLayer();
        layer.init();
        this.addChild( layer );
    },
});

var GameOverLayer = cc.LayerColor.extend({
	init: function() {
		this._super( new cc.Color( 127, 127, 127, 255 ) );
        this.gameOverBG = new GameOverBG();
        this.gameOverBG.setPosition(screenWidth/2,screenHeight/2);
        this.addChild(this.gameOverBG);
        this.createScoreLabel();
        this.createBackButton();
        this.createPlayAgainButton();
        return true;
    },
    createScoreLabel:function(){
    	this.scoreLabel = cc.LabelTTF.create( '0', 'Arial', 45 );
        this.scoreLabel.setPosition(screenWidth/2,screenHeight/2);
        this.scoreLabel.setString("Your Score : "+SCORE);
        this.addChild(this.scoreLabel);

    },
     createBackButton:function(){
    	this.backButItem = new cc.MenuItemImage(
    		 res.backToMenu_But_png,
    		 res.backToMenu2_But_png,
    		function () {
    			cc.director.runScene(new StartScene() );
    		}, this);
    	this.backButton = new cc.Menu(this.backButItem);
    	this.addChild(this.backButton);
    	var deltaDistance = -80*2;
      	this.backButton.setPosition(screenWidth/4,(screenHeight/2)+deltaDistance);
    },
    createPlayAgainButton:function(){
    	this.playAgainButItem = new cc.MenuItemImage(
    		res.playAgain_but_png,
    		res.playAgain2_but_png,
    		function () {
    			cc.director.runScene(new GamePlayScene() );
    		}, this);
    	this.playAgainButton = new cc.Menu(this.playAgainButItem);
    	this.addChild(this.playAgainButton);
    	var deltaDistance = -80*2;
      	this.playAgainButton.setPosition(screenWidth*3/4,(screenHeight/2)+deltaDistance);
    },
});

var GameOverBG =  cc.Sprite.extend({
	ctor:function(){
		this._super();
		this.initWithFile(res.gameOverBG_png);
	},
});