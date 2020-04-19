function Slider(parameters) {

	var parameters = parameters;
	var status = {
    isManualMoveForwardInProgress : false,
	isManualMoveBackwardInProgress : false,
	isAutomaticMoveForwardInProgress : false,
	isAutomaticMoveBackwardInProgress : false,
	isSemiAutomaticMoveForwardInProgress : false,
	isSemiAutomaticMoveBackwardInProgress : false,
	isStill : true,
	didHumanScrollWithFinger: true,
	currentSlide:0,
	targetPosition:200,
	lastScrollLeft:0
	};
	
	var timeOut;
	
	var sliderContainer = document.getElementById(parameters.sliderContainerId);
	var navigation = new Navigation(parameters.navigationParameters);
		
	var startMovingForwardManually = function()
	{
		status.isManualMoveForwardInProgress = true;
		status.didHumanScrollWithFinger = false;
	};
	
	var startMovingBackwardManually = function()
	{
		status.isManualMoveBackwardInProgress = true;
		status.didHumanScrollWithFinger = false;
	};
	
	var startMovingBackwardAutomatically = function()
	{
		status.isAutomaticMoveForwardInProgress = true;
		status.didHumanScrollWithFinger = false;
	};
	
	var startMovingForwardAutomatically = function()
	{
		status.isAutomaticMoveBackwardInProgress = true;
		status.didHumanScrollWithFinger = false;
	};
	
	var startMovingForwardSemiAutomatic = function()
	{
		status.isSemiAutomaticMoveForwardInProgress = true;
		status.didHumanScrollWithFinger = false;
	};
	
	var startMovingBackwardSemiAutomatic = function()
	{
		status.isSemiAutomaticMoveForwardInProgress = true;
		status.didHumanScrollWithFinger = false;
	};
	
	var clearAllMoves = function()
	{
	    status.isManualMoveForwardInProgress = false;
		status.isManualMoveBackwardInProgress = false;
		status.isAutomaticMoveForwardInProgress = false;
		status.isAutomaticMoveBackwardInProgress = false;
		status.isSemiAutomaticMoveForwardInProgress = false;
		status.isSemiAutomaticMoveBackwardInProgress = false;

		if (timeOut)
		{
			clearTimeout(timeOut);
		}

	};
	/* this function is called everytime the user manually scrolls with his finger. actOnHumanScroll is 
	   a semi-automatic function which completes this scroll by going automatically to the next slide
	   when the visitor scrolled more than a certain number of pixels.
	   It should not be used when moving:
	   - upon using the next or previous button
	   - upon automatic scroll
	   - when the semi-automatic move is triggered */
	   
	var listenToHumanScrollWithFinger = function()
	{		
	
		var scrollLeft = sliderContainer.scrollLeft;
		var scrollWidth = sliderContainer.scrollWidth;
		
		if (status.didHumanScrollWithFinger == true)
		{
		  actOnHumanScroll(scrollLeft,scrollWidth);
		}
		if (scrollLeft%parameters.slideWidth == 0)
		{
		  status.didHumanScrollWithFinger = true;
		}
	};
	
	var actOnHumanScroll = function(scrollLeft,scrollWidth)
	{
		console.log("acting on human scroll");
		
		  /* document.getElementById("test").innerHTML = "scrollLeft:"+scrollLeft+" scrollWidth:"+scrollWidth; */
		var triggerLeftScroll;
  
		if ( status.didHumanScrollWithFinger == true )
		{
			
			if ( scrollLeft > status.lastScrollLeft  )
			{
			  triggerLeftScroll = status.currentSlide*parameters.slideWidth+parameters.widthTriggeringMove;
			  if ( scrollLeft > triggerLeftScroll )
			  {
				goToNextSlideSemiAutomatic();
			  }
			}
			else if ( scrollLeft < status.lastScrollLeft  )
			{
			  triggerLeftScroll = status.currentSlide*parameters.slideWidth-parameters.widthTriggeringMove;
			  if ( scrollLeft < triggerLeftScroll )
			  {
				goToPreviousSlideSemiAutomatic();
			  }
			}
		}
		status.lastScrollLeft = scrollLeft;
  
	};

	var goToNextSlide = function(method){
		
		console.log("goToNextSlide launched");
		var newLeftScroll;
		
		if ( status.currentSlide <  (parameters.numberOfSlides-1) )
		{
		  newLeftScroll = status.currentSlide * parameters.slideWidth + parameters.slideWidth;
		  navigation.markBulletAsActive(status.currentSlide+1);
		  navigation.markBulletAsDeactive(status.currentSlide);
		  status.currentSlide+=1;
		  navigation.markPreviousButtonAsActive();
		}
		else
		{
		  newLeftScroll = 0;
		  navigation.markBulletAsActive(0);
		  navigation.markBulletAsDeactive(3);
		  status.currentSlide=0;
		  navigation.markPreviousButtonAsInactive();
		  navigation.markNextButtonAsActive();
		}
		
		if (status.currentSlide==3)
		{
		  navigation.markNextButtonAsInactive();
		} 
	
		status.targetPosition = newLeftScroll;
		
		if (status.currentSlide==0)
		{
			backwardUniversalSmoothScrollTo(sliderContainer,method);
		} else {
			forwardUniversalSmoothScrollTo(sliderContainer,method);
		}
		
	};
	
	var goToNextSlideWithNextButton = function(){
		
		clearAllMoves();
		
		console.log("Going to next slide with Next button");
		startMovingForwardManually();
		
		goToNextSlide("moveWithNext");
	};
	
	var goToNextSlideSemiAutomatic = function(){
		
		clearAllMoves();
		
		console.log("Going to next slide semi automatically");
		startMovingForwardSemiAutomatic();
		
		goToNextSlide("moveNextSemiAutomatically");
	};
	
	
	var goToNextSlideAutomatically = function(){
		
		clearAllMoves();
		
		console.log("Going to next slide automatically");
		startMovingForwardAutomatically();
		
		goToNextSlide("moveNextAutomatically");
	};
	
	var goToPreviousSlide = function(method)
	{
		
		console.log("goToPreviousSlide launched");
		var newLeftScroll;
			
		if ( status.currentSlide >  0 )
		{
		  newLeftScroll = status.currentSlide * parameters.slideWidth - parameters.slideWidth;
		  navigation.markBulletAsDeactive(status.currentSlide);
		  navigation.markBulletAsActive(status.currentSlide-1);
		  status.currentSlide-=1;
			  
		  if (status.currentSlide<3)
		  {
			navigation.markNextButtonAsActive();
		  }
		  
		  status.targetPosition = newLeftScroll;
		  backwardUniversalSmoothScrollTo(document.getElementById('slider-container'),method);

			
		  if ( status.currentSlide == 0 ){
			navigation.markPreviousButtonAsInactive();
		  }
		}
	};
	
	var goToPreviousSlideWithPreviousButton = function()
	{
		console.log("Going to previous slide with Previous button");
	
		clearAllMoves();
	    startMovingBackwardManually();
		goToPreviousSlide("moveWithPrevious");
	
	};
	
	var goToPreviousSlideAutomatically = function()
	{
		console.log("Going to previous slide with Automatically");
	
		clearAllMoves();
	    startMovingBackwardAutomatically();
		goToPreviousSlide("movePreviousAutomatically");
	
	};
	
	var goToPreviousSlideSemiAutomatic = function()
	{
		console.log("Going to previous slide semi Automatically");
	
		clearAllMoves();
	    startMovingBackwardSemiAutomatic();
		goToPreviousSlide("movePreviousSemiAutomatically");
	
	};
	
	
	
	var setScroll =  function(container){
		container.scrollLeft = status.targetPosition;
	};		
			
	var	forwardUniversalSmoothScrollTo = function(container,method)
	{

		status.didHumanScrollWithFinger = false;
		currentPosition = container.scrollLeft;
		speedFactor = parameters.speedFactor;
		increment=0;
				  
		leftToGo = status.targetPosition - currentPosition;
				  
		increment = speedFactor*Math.log(leftToGo);
				  
		if (increment < 1.01 ) increment = 1.01;
				  
		var newPosition = currentPosition + increment;
				  
		console.log("universal forward called by :"+method);
		console.log("new position:"+newPosition);
		console.log("increment:"+increment);
		console.log("target position:"+status.targetPosition);
		console.log(newPosition < status.targetPosition);
		console.log("==============");
				  
		if ( newPosition < status.targetPosition )
		{
			container.scrollLeft = newPosition; 
			timeOut = setTimeout(forwardUniversalSmoothScrollTo,parameters.movementTimeoutMilliseconds,container);		
		}  else {
			timeOut = setTimeout(setScroll,parameters.movementTimeoutMilliseconds,container);
		}
			
	};

	var backwardUniversalSmoothScrollTo = function(container,method)
	{
	  
	  currentPosition = container.scrollLeft;
	  speedFactor = parameters.speedFactor;
	  increment=0;
	  
	  leftToGo =  currentPosition - status.targetPosition;
	  
	  if ( leftToGo > 0 ) 
	  {
		increment = speedFactor*Math.log(leftToGo);
		if (increment < 1.01 ) increment = 1.01;
	  }
	  else increment = 0;
	  
	  var newPosition = currentPosition - increment;
	  
	  console.log("universal backward called by :"+method);
	  console.log("new position:"+newPosition);
	  console.log("increment:"+increment);
	  console.log("target position:"+status.targetPosition);
	  console.log(newPosition < status.targetPosition);
	  console.log("==============");
	  
	  if ( newPosition > status.targetPosition )
	  {
		container.scrollLeft = newPosition; 
		timeOut = setTimeout(backwardUniversalSmoothScrollTo,parameters.movementTimeoutMilliseconds,container,status.targetPosition);
	  }  else {
		timeOut = setTimeout(setScroll,parameters.movementTimeoutMilliseconds,container);
	  }

	};


	var  adjustOverflowAndAutomatism =function()
	{
	  var slideContainer = document.getElementById('slider-container');
	  
	  if (window.screen.width < 1000){
		parameters.isAutomatic=false;
		sliderContainer.style.overflow = "auto";
		
	  }else{
		sliderContainer.style.overflow = "hidden";
	  }
	};

	function goToNextSlideInLoop(){
		goToNextSlideAutomatically();
		myLoop();
	};


	function myLoop () { 
	  setTimeout(goToNextSlideInLoop, parameters.timeBetweenTwoAutomaticMoves);
	};
	
	var nextContainerElement = document.getElementById(navigation.nextButtonId);
	var previousContainerElement = document.getElementById(navigation.previousButtonId);
	

	if (nextContainerElement.addEventListener)
	{
		nextContainerElement.addEventListener('click',goToNextSlideWithNextButton);
	} else
	{
		nextContainerElement.attachEvent('onclick',goToNextSlideWithNextButton);
	}
	
	if (previousContainerElement)
	{
		previousContainerElement.addEventListener('click',goToPreviousSlideWithPreviousButton);
	}else
	{
		previousContainerElement.attachEvent('onclick',goToPreviousSlideWithPreviousButton);
	}
	
	
	var sliderContainerElement = document.getElementById(parameters.sliderContainerId);
	
	adjustOverflowAndAutomatism();
	
	/* During automatic mode, visitor cannot scroll with his finger. Scroll with keyboard or mouse
	   is imposssible because scroll bar is disabled. Here we say that if we are not in automatic 
	   mode, we listen to the visitor scrolling with his finger */
	   
	if (!parameters.isAutomatic){
	  sliderContainerElement.addEventListener('scroll',listenToHumanScrollWithFinger);
	} else {
		myLoop ();
	}


};

function Navigation(parameters)
{

	this.parameters = parameters;
	this.bulletPointPrefix = this.parameters.bulletIdPrefix;
	this.previousButtonId = this.parameters.previousButtonId;
	this.nextButtonId = this.parameters.nextButtonId;
	
	this.markBulletAsActive = function (slideNumber)
	{
	  var slideId = this.bulletPointPrefix+slideNumber;
	  document.getElementById(slideId).classList.add("active");
	};

	this.markBulletAsDeactive = function (slideNumber)
	{
	  var slideId = this.bulletPointPrefix+slideNumber;
	  document.getElementById(slideId).classList.remove("active");
	};

	this.markPreviousButtonAsActive = function ()
	{
	  var previousButton = document.getElementById(this.previousButtonId);
	  previousButton.style.display = "flex";
	};

	this.markPreviousButtonAsInactive = function ()
	{
	  var previousButton = document.getElementById(this.previousButtonId);
	  previousButton.style.display = "none";
	};

	this.markNextButtonAsActive = function ()
	{
	  var nextButton = document.getElementById(this.nextButtonId);
	  nextButton.style.display = "flex";
	};

	this.markNextButtonAsInactive = function ()
	{
	  var nextButton = document.getElementById(this.nextButtonId);
	  nextButton.style.display = "none";
	};

	
}

