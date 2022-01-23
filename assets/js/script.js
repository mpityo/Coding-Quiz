var timerEl = document.querySelector("#timer");
var startQuizBtn = document.querySelector("#start-quiz");
var mainQuestionAreaEl = document.querySelector(".main-content-area");
var mainAnswerArea = document.createElement("div");

var numberOfQuestions = masterQuestionList.length;
var timeToFinish = numberOfQuestions*8; // 8 seconds per question
var questionsCorrect = 0;


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
    } else if (targetEl.matches('.score-btn')) {
        console.log("Score button was clicked");
        displayHighScores();
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
        timeToFinish--;
        timerEl.textContent = "Time: " + timeToFinish;
        if (timeToFinish <= 0) {
            clearInterval(timer);
            endQuiz();
        }
    }, 1000);
    // remove button and paragraph from screen
    removeContent(['.btn','#quiz-description']);
    mainQuestionAreaEl.appendChild(mainAnswerArea);
    // load the first question and base answer buttons
    loadQuestion();
}

// END QUIZ after all questions are answered OR time runs out
var endQuiz = function () {
	var score = 0;
	document.querySelector('.response-form').remove();
    if (masterQuestionList.length === 0) {
    	score = (timeToFinish+questionsCorrect);
		alert("You've answered all the questions!");
	} else {
		alert("You've run out of time!");
		score = questionsCorrect;
	}
	
	enterHighScore(score);
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
        timeToFinish = 0;
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
        questionsCorrect += 1;
    } else {
        document.querySelector(".response-form").textContent = "Wrong!";
        if (timeToFinish > 15)
            timeToFinish -= 15;
        else
            timeToFinish = 0;
    }
    if (timeToFinish > 0) {
        // remove the answers and load the next question
	    document.querySelector('.ans-area').remove();
        loadQuestion();
    }
}

var enterHighScore = function (score) {
	mainQuestionAreaEl.querySelector(".question-spot").textContent = "All Done!";
	var scoreInputArea = document.createElement('div');
	scoreInputArea.className = "score-input-wrapper";
	var description = document.createElement('p');
	description.textContent = "Your final score is " + score;
	description.setAttribute("score", score);
    description.id = "score-text";
	var enterInitials = document.createElement('input');
	enterInitials.type = "text";
	enterInitials.id = "score-initials";
	enterInitials.name = "initials";
	var enterInitialsLabel = document.createElement('label');
	enterInitialsLabel.name = "initials";
	enterInitialsLabel.textContent = "Enter Initials:";
	var submitHighScoreBtn = document.createElement("button");
	submitHighScoreBtn.className = "btn score-btn";
	submitHighScoreBtn.textContent = "Submit";
	scoreInputArea.appendChild(description);
	scoreInputArea.appendChild(enterInitialsLabel);
	scoreInputArea.appendChild(enterInitials);
	scoreInputArea.appendChild(submitHighScoreBtn);
	mainQuestionAreaEl.appendChild(scoreInputArea);
}

var saveScore = function () {
    
}

var loadScores = function () {
    
}

var displayHighScores = function () {
    var score = mainQuestionAreaEl.querySelector('#score-text').getAttribute("score");
    var initials = mainQuestionAreaEl.querySelector('#score-initials').value;

    var localScores = loadScores;
	var scoresToList = saveScore(localScores, scoreToSave);

	mainQuestionAreaEl.querySelector(".question-spot").textContent = "High Scores";
	document.querySelector('.score-input-wrapper').remove();
}

mainQuestionAreaEl.addEventListener("click", buttonHandler);