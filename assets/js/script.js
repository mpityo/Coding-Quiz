var timerEl = document.querySelector("#timer");
var startQuizBtn = document.querySelector("#start-quiz");
var mainQuestionAreaEl = document.querySelector(".main-content-area");
var mainAnswerArea = document.createElement("div");

var questionList = masterQuestionList;
var numberOfQuestions = questionList.length;
var timeToFinish = numberOfQuestions*8; // 8 seconds per question
var questionsCorrect = 0;


var buttonHandler = function(event) {
    var targetEl = event.target;

    if (targetEl.matches("#start-quiz")) {
        startQuiz();
    } else 
    if (targetEl.matches("#ans-btn")) {
        if (targetEl.getAttribute("correct")) {
            questionAnswered(true);
        } else {
            questionAnswered(false);
        }
    } else 
    if (targetEl.matches('.score-btn')) {
        if (mainQuestionAreaEl.querySelector('#score-initials').value) {
            displayHighScores();
        } else {
            alert("You must enter a value for your initials!");
        }
    } else 
    if (targetEl.matches('#go-back-btn')) {
        location.reload();    
    } else 
    if (targetEl.matches('#clear-scores-btn')) {
        localStorage.removeItem("high-scores");
        localStorage.removeItem("initials");
        removeContent(".high-scores-area");
        alert("High scores have been reset");
    }
}

var removeContent = function (content) {
    for (var i = 0; i < content.length; i++) {
        if (document.querySelector(content[i]))
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
	//document.querySelector('.response-form').remove();
    mainAnswerArea.remove();
    if (questionList.length === 0) {
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
    if (questionList.length > 0) {
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
    var randomNumber = Math.floor(Math.random() * questionList.length);
    var questionAnswer = questionList[randomNumber];
    // remove question that was chosen from main list so it doesn't appear again
    questionList.splice(randomNumber, 1);
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

var insertIntoArray = function (index, arr, contentToAdd) {
    if (index === 0) {
        arr.unshift(contentToAdd);
    } else
    if (index === arr.length) {
        arr.push(contentToAdd);
    } else {
        arr.splice(index, 0, contentToAdd);
    }
}

var saveScore = function (localScores, localInitials, scoreToSave) {
    var scores = [];
    var initials = [];
    if (localScores) {
        for (var l = 0; l < localScores.length; l++) {
            scores.push(localScores[l]);
            initials.push(localInitials[l]);
        }
        for (var i = 0; i < localScores.length; i++) {

            if (scoreToSave[0] > scores[i]) {
                insertIntoArray(i, scores, scoreToSave[0]);
                insertIntoArray(i, initials, scoreToSave[1]);
                i = scores.length;
            } 
            else if (scoreToSave[0] === scores[i] && scoreToSave[0] > scores[i+1]) {
                insertIntoArray((i+1), scores, scoreToSave[0]);
                insertIntoArray((i+1), initials, scoreToSave[1]);
                i = scores.length;
            } 
            else if ((i+1) === scores.length) {
                insertIntoArray(scores.length, scores, scoreToSave[0]);
                insertIntoArray(initials.length, initials, scoreToSave[1]);
            }
        }
        localStorage.setItem("high-scores", JSON.stringify(scores));
        localStorage.setItem("initials", JSON.stringify(initials));
    } else {
        scores[0] = (scoreToSave[0]);
        initials[0] = (scoreToSave[1]);
        localStorage.setItem("high-scores", JSON.stringify(scores[0]));
        localStorage.setItem("initials", JSON.stringify(initials[0]));
    }
}

var saveLoadScoreHandler = function () {
    var scoreToSave = [
        score = mainQuestionAreaEl.querySelector('#score-text').getAttribute("score"),
        mainQuestionAreaEl.querySelector('#score-initials').value
    ];
    var localScores = JSON.parse(localStorage.getItem("high-scores"));
    var localInitials = JSON.parse(localStorage.getItem("initials"));

	saveScore(localScores, localInitials, scoreToSave);
}

var displayHighScores = function () {
    saveLoadScoreHandler();

	mainQuestionAreaEl.querySelector(".question-spot").textContent = "High scores";
	document.querySelector('.score-input-wrapper').remove();
    if (document.querySelector('.response-form')) {
        document.querySelector('.response-form').remove();
    }

    var scoresToDisplay = JSON.parse(localStorage.getItem("high-scores"));
    var initialsToDisplay = JSON.parse(localStorage.getItem("initials"));

     var highScoresWrapperEl = document.createElement("div");
     highScoresWrapperEl.className = "high-scores-area";
     for (var i = 0; i < scoresToDisplay.length; i++) {
        var initials = initialsToDisplay[i];
        var highScore = document.createElement("div");
        highScore.className = "high-score";
        highScore.id = "high-score-" + i;
        highScore.textContent = i+1 + ".  " + initials.toUpperCase() + " - " + scoresToDisplay[i];
        highScoresWrapperEl.appendChild(highScore);
     }
    mainQuestionAreaEl.appendChild(highScoresWrapperEl);
    var goBackBtn = document.createElement("button");
    goBackBtn.className = "btn hs-btn";
    goBackBtn.id = "go-back-btn";
    goBackBtn.textContent = "Go back";
    var clearHighScoresBtn = document.createElement("button");
    clearHighScoresBtn.className = "btn hs-btn";
    clearHighScoresBtn.id = "clear-scores-btn";
    clearHighScoresBtn.textContent = "Clear high scores";
    mainQuestionAreaEl.appendChild(goBackBtn);
    mainQuestionAreaEl.appendChild(clearHighScoresBtn);
}

mainQuestionAreaEl.addEventListener("click", buttonHandler);