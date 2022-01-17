console.log(masterQuestionList);

var timerEl = document.querySelector("#timer");
var startQuizBtn = document.querySelector("#start-quiz");

var mainQuestionAreaEl = document.querySelector(".main-content-area");

var timeToFinish = 10;

// create html content for:
//  - question (questionHeaderEl)
//  - answers buttons (answerListEl, answer1Btn - answer4BtnEl)
//    - add 'btn' as class for CSS themeing

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

    loadQuestion();
}

var createQuestionBtns = function () {

}

var loadQuestion = function() {
    var questionHeaderEl = document.querySelector(".question-spot");
    questionHeaderEl.textContent = masterQuestionList[0].question;
}

// load the first (and subsequent) questions by:
//  - randomize the question array and get a random array slot
//  - take question and change content from questionHeaderEl
//  - loop through answers
//    - randomize answers
//    - display questions with "1. XXXXXX"
//  - remove question from array

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

startQuizBtn.addEventListener("click", startQuiz);