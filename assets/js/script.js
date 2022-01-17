console.log(masterQuestionList);

var timerEl = document.querySelector("#timer");
var startQuizBtn = document.querySelector("#start-quiz");
var mainQuestionAreaEl = document.querySelector(".main-content-area");

var timeToFinish = 10;


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

var startQuiz = function () {
    // create timer, updates on main header bar
    var timer = setInterval(function() {
        timerEl.textContent = "Time: " + timeToFinish;
        if (timeToFinish === 0) {
            endQuiz();
        }
        if (timeToFinish <= 0) {
            clearInterval(timer);
        }
        timeToFinish--;
    }, 1000);
    // remove button and paragraph from screen
    startQuizBtn.remove();
    mainQuestionAreaEl.querySelector("p").remove();
    // load the first question and base answer buttons
    loadQuestion();
}

var createAnswerBtns = function (answers, correctAnswer) {
    for (var i = 0; i < 4; i++) {
        var answerArea = document.createElement("div");
        answerArea.className = "ans-area";

        var answerBtn = document.createElement("button");
        answerBtn.className = "ans" + (i+1) + " btn"; //ans1, ans2, ans3, etc...
        answerBtn.id = "ans-btn";
        answerBtn.textContent = (i+1) + ". " + answers[i];

        if (correctAnswer === answers[i]) {
            answerBtn.setAttribute("correct", true);
        }

        answerArea.appendChild(answerBtn);
        mainQuestionAreaEl.appendChild(answerArea);
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

// create button listener for answer buttons
// based on button press:
//  - TODO
// if question is right:
//  - display "correct" under question
//  - display the next question
// if answer is wrong:
//  - display "wrong" under question
//  - subtract 10 seconds from quiz
//    - (OPTIONAL) - CSS to show removal of time from timer
//  - display the next question
var questionAnswered = function () {
    
}

// once masterQuestionList is empty or the timer has reached 0:
//  - remove quiz content from screen
//  - replace questionHeaderEl.content with "All Done!"
//  - add p underneath with "Your final score is XX."
//  - create another p that shares line with textbox that says "Enter Initials:"
//  - create textbox, no shading or ghost text
//  - create btn (submitHighScoreBtn), same line as textbox
//    - give it class of 'btn' for CSS themeing
//    - text of "Submit"
//  - add action listener for submitHighScoreBtn
var endQuiz = function () {
    alert("Time has ended!");
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

mainQuestionAreaEl.addEventListener("click", buttonHandler);