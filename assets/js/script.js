console.log(masterQuestionList);

var timerEl = document.querySelector("#timer");
var startQuizBtn = document.querySelector("#start-quiz");
var mainQuestionAreaEl = document.querySelector(".main-content-area");
var mainAnswerArea = document.createElement("div");

var numberOfQuestions = masterQuestionList.length;
var timeToFinish = numberOfQuestions*8; // 8 seconds per question


var buttonHandler = function(event) {
    var targetEl = event.target;

    if (targetEl.matches("#start-quiz")) {
        startQuiz();
    } else if (targetEl.matches("#ans-btn")) {
        if (targetEl.getAttribute("correct")) {
            questionAnswered(true);
        } else {
            questionAnswered(false);
        }
    }
}

var removeContent = function (content) {
	for (var i = 0; i < content.length; i++) {
		document.querySelector(content[i]).remove();
	}
}

var startQuiz = function () {
    // create timer, updates on main header bar
    var timer = setInterval(function() {
        timerEl.textContent = "Time: " + timeToFinish;
        if (timeToFinish === 0) {
            endQuiz();
        }
        if (timeToFinish <= 0) {
            clearInterval(timer);
			timeToFinish = 0;
        }
        timeToFinish--;
    }, 1000);
    // remove button and paragraph from screen
    removeContent(['.btn','#quiz-description']);
    mainQuestionAreaEl.appendChild(mainAnswerArea);
    // load the first question and base answer buttons
    loadQuestion();
}

var createAnswerBtns = function (answers, correctAnswer) {
    var answerArea = document.createElement("div");
    answerArea.className = "ans-area";
    for (var i = 0; i < 4; i++) {
        var answerBtn = document.createElement("button");
        answerBtn.className = "ans" + (i+1) + " btn"; //ans1, ans2, ans3, etc...
        answerBtn.id = "ans-btn";
        answerBtn.textContent = (i+1) + ". " + answers[i];

        if (correctAnswer === answers[i]) {
            answerBtn.setAttribute("correct", true);
        }
        answerArea.appendChild(answerBtn);
        mainAnswerArea.appendChild(answerArea);
    }
}

var loadQuestion = function() {
    if (masterQuestionList.length > 0) {
        var questionAnswer = randomQuestionAndAnswers();
        createAnswerBtns(questionAnswer.answers, questionAnswer.correct);
        var questionHeaderEl = document.querySelector(".question-spot");
        questionHeaderEl.textContent = questionAnswer.question;
    } else {
        clearInterval(timer);
        endQuiz();
    }
}

var randomQuestionAndAnswers = function () {
    // get random number and pick that question to show the user
    var randomNumber = Math.floor(Math.random() * masterQuestionList.length);
    var questionAnswer = masterQuestionList[randomNumber];
    // remove question that was chosen from main list so it doesn't appear again
    masterQuestionList.splice(randomNumber, 1);
    // randomize the answers
    var randomAnswers = [];
    for (var i = 0; i < 4; i++) {
        var random = Math.floor(Math.random() * (4-i));
        randomAnswers[i] = questionAnswer.answers[random];
        questionAnswer.answers.splice(random, 1);
    }
    questionAnswer.answers = randomAnswers;

    // returns the question, random answers, and correct answer
    return questionAnswer;
}

var questionAnswered = function (answeredCorrectly) {
    // if there isn't already a place for "correct" or "wrong", make it
    if (!document.querySelector(".response-form")) {
        var responseEl = document.createElement("div");
        responseEl.className = "response-form";
        mainQuestionAreaEl.appendChild(responseEl);
    }
    // create text for if they got the question right or wrong
    if (answeredCorrectly) {
        document.querySelector(".response-form").textContent = "Correct!";
    } else {
        document.querySelector(".response-form").textContent = "Wrong!";
        timeToFinish -= 15;
    }
    // remove the answers and load the next question
	document.querySelector('.ans-area').remove();
    loadQuestion();
}

// END QUIZ after all questions are answered OR time runs out
var endQuiz = function () {
	var score = 0;
	document.querySelector('.response-form').remove();
    if (masterQuestionList.length === 0) {
    	score = (timeToFinish+numberOfQuestions);
		alert("You've answered all the questions!");
	} else {
		alert("You've run out of time!");
		score = (numberOfQuestions - masterQuestionList.length);
	}
    timeToFinish = 0;
	
	enterHighScore(score);
}

var enterHighScore = function (score) {
	mainQuestionAreaEl.querySelector(".question-spot").textContent = "All Done!";
	var scoreInputArea = document.createElement('div');
	scoreInputArea.className = "score-input-wrapper";
	var description = document.createElement('p');
	description.textContent = "Your final score is " + score;
	description.setAttribute("score", score);
	var enterInitials = document.createElement('input');
	enterInitials.type = "text";
	enterInitials.id = "score-initials";
	enterInitials.name = "initials";
	var enterInitialsLabel = document.createElement('label');
	enterInitialsLabel.name = "initials";
	enterInitialsLabel.textContent = "Enter Initials:";
	var submitHighScoreBtn = document.createElement("button");
	submitHighScoreBtn.className = "btn";
	submitHighScoreBtn.textContent = "Submit";
	scoreInputArea.appendChild(description);
	scoreInputArea.appendChild(enterInitialsLabel);
	scoreInputArea.appendChild(enterInitials);
	scoreInputArea.appendChild(submitHighScoreBtn);
	mainQuestionAreaEl.appendChild(scoreInputArea);
}

//  once submit button has been pressed:
//  - remove content from main screen
//  - change questionHeaderEl.content to "High Scores"
//  - create list of high scores based on current and those from local storage
//    - call loadHighScores() and save to array localHighScores[]
//    - save high score to local storage
//      - sort through high scores and compare to localHighScores
//      - insert the new high score to wherever it lands 
//  - display high scores
//    - each on it's own line (list), with a number in front (array list number + 1)
//    - primary color scheme, but lighter (more opaque)
//    - border and each list item the same length
//  - create two buttons (variable in size depending on text lenght):
//    - "Go back"
//      - takes back to main screen content
//      - reload the page
//    - "Clear high scores"
//      - clear local storage and delete all list items on screen
//      - alert() user that scores have been cleared
//      - reload to main screen
var saveScore = function (currentScore, localScores) {
	if (localScores) {
		var scores = [];
		for (var i = 0; i < localScores.length; i++) {
			if (parseInt(localScores[i].getAttribute("scores")) < currentScore[0]) {
				scores.push(currentScore[0]);
			} else {
				scores.push(localScores[i].getAttribute("scores"));
			}
		}
		localStorage.setItem("scores", scores[0]);
		localStorage.setItem("initial", scores[1]);
	} else {
		localStorage.setItem("scores", currentScore[0]);
		if (currentScore[1])
			localStorage.setItem("initials", currentScore[1]);
		else
			localStorage.setItem("initials", "NA");
	}
}

var loadScores = function () {
	var local = [];
	local.scores = JSON.parse(localStorage.getItem("scores"));
	local.initials = JSON.parse(localStorage.getItem("initials"));
	return local;
}

var displayHighScores = function () {
	currentScore = [document.getAttribute("score"), document.querySelector('#score-name')];
	scores = saveScore(currentScore, loadScores);
	mainQuestionAreaEl.querySelector(".question-spot").textContent = "High Scores";
	document.querySelector('.score-input-wrapper').remove();
}

mainQuestionAreaEl.addEventListener("click", buttonHandler);
highScoreArea.addEventListener("submit", displayHighScores);