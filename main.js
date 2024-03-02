// HTML Elements
let qsCount = document.querySelector('.qs-count');
let questionContainer = document.querySelector('.question-container');
let answersDiv = document.querySelector('.quiz-app .answers')
let questionDiv = document.querySelector('.question-div');
let submitBtn = document.querySelector('.quiz-app .submit-btn button');
let bulletsContainer = document.querySelector('.bullets-container');
let infoDiv = document.querySelector('.features');
let detailsContainer = document.querySelector('.test-info');
let resultsContainer = document.querySelector('.results');
let mainExitBtn = document.querySelector('.quiz-app .buttons button');
let theCustomLine = document.querySelector('.quiz-app .custom-line');
let circlePercent = document.querySelector('.results .mark-percent .mark-parent .mark');
let markByPercent = document.querySelector('.results .exam-details .mark-percent-det h4');
let markByText = document.querySelector('.results .exam-details .mark-text-det h4');
let markByNums = document.querySelector('.results .exam-details .mark-det h4');
let totalQuestions = document.querySelector('.results .exam-details .total-questions-det h4');
let resultRightAnswers = document.querySelector('.results .exam-details .right-answers-det h4');
let incorrectAnswers = document.querySelector('.results .exam-details .incorrect-answers-det h4');
let resolveBtn = document.querySelector('.results .result-buttons .resolve-btn');

/* Some Settings */
let currentQuestion = 0;
let rightAnswers = 0;
let bullets = [];

// Fetch The Questions From Json File
let req = new XMLHttpRequest();

req.onreadystatechange = () => {
    if (req.status === 200 && req.readyState === 4) {
        let questions = JSON.parse(req.response);
        
        // Questions Count Function
        QuestionsCount(questions.length);
        
        // Questions Addition Function
        AddQuestions(questions[currentQuestion], questions.length);
        
        // Create Bullets Function
        createBullets(questions.length);
        
        // While Clicking Submit Button
        submitBtn.onclick = () => {
            // Calling The Check Answer Function
            checkAnswer(questions[currentQuestion], questions.length, questions);
            
            // Increase The Current Question Variable
            currentQuestion++; 
            
            // Removing The Current Question And Add The Next One
            questionDiv.innerHTML = '';
            answersDiv.innerHTML = '';
            
            AddQuestions(questions[currentQuestion], questions.length);
            
            // Handle Bullets Function
            handleBullets(questions.length);
            
            // Show Result Function
            showResult(currentQuestion, questions.length, rightAnswers);
        }
    }
}

req.open('GET', "qs.json", true);
req.send();

/* Application Functions Here */

// Calculating The Questions Count And Add it To The Application
function QuestionsCount(count = 0) {
    qsCount.innerHTML = `${count}`;
}

// Add Questions To Our Applicaton Function
function AddQuestions(cq, qc) {
    
    if (currentQuestion < qc) {
        // The Question 
        let question = document.createElement('div');
        
        // Add "question" Class to The Div
        question.classList.add('question');
        
        // Add The Question Into The Div
        question.innerHTML =  cq.question;
        
        // Append The Question To Question Div
        questionDiv.appendChild(question);
        
        // Append The Question Div To Question Container
        questionContainer.appendChild(questionDiv);
        
        // The Answers Container
        for (let i = 1; i <= 4; i++) {
            // The Answer Div
            let answerDiv = document.createElement('div');
            
            // Add Classes To The Answer Div
            answerDiv.classList.add(`answer-${i}`);
            answerDiv.classList.add(`answer-div`);
            
            // Create Input Element 
            let radioInput = document.createElement("input");
            
            // Setting The Input Attributes
            radioInput.setAttribute('type', 'radio');
            radioInput.setAttribute('name', 'answer');
            radioInput.setAttribute('id', `answer_${i}`);
            radioInput.dataset.answer = `${cq[`answer_${i}`]}`
            
            
            // Append The Input Element To Answer Div
            answerDiv.appendChild(radioInput);
            
            // Create Label Element
            let labelEle = document.createElement('label');
            
            // For Attribute
            labelEle.htmlFor = `answer_${i}`;
            
            // Getting The Answers And Show It
            let answer = document.createTextNode(cq[`answer_${i}`])
            
            // Appending The Answer To The Label
            labelEle.appendChild(answer);
            
            // Append The Answer To Answers Div
            answerDiv.appendChild(labelEle);
            
            // Append The Answer Div To Answers Div
            answersDiv.appendChild(answerDiv);
            
        }
        
        // Append The Answers Div To The Main Question Container
        questionContainer.appendChild(answersDiv);
    }
    
}

function checkAnswer(_cq, qc, questions) {
    if (currentQuestion >= qc) return;
    
    // The Right Answer 
    let rightAnswer = questions[currentQuestion]['right_answer'];
    
    let answers = Array.from(document.getElementsByName('answer'));
    
    console.log(rightAnswer);
    console.log(answers);
    
    answers.forEach((answer) => {
        // Checking If The Answer Checked And It is The Right Answer
        if (answer.checked && answer.dataset.answer === rightAnswer) {
            // Increase The Right Answers Variable Value
            rightAnswers++;
        }
    })
}

function createBullets(questionsCount) {
    for (let i = 0; i < questionsCount; i++) {
        // Create The Bullet 
        let bullet = document.createElement('span');
        
        // Add 'bullet' Class To The Span
        bullet.classList.add('bullet');
        
        // Append The Bullet To The Bullets Container
        bulletsContainer.appendChild(bullet);
        
        // Put 'on' Class On The First Bullet Automaticly
        if (i === 0) {
            bullet.classList.add('on');
        }

        // Add The Created Bullet To Bullets Array
        bullets.push(bullet);
    }
}

// Handle Bullets Function
function handleBullets(questionsCount) {
    // Check if The Questions ain't End
    if (currentQuestion < questionsCount) {
        // Add 'on' Class On The Bullet
        bullets[currentQuestion].classList.add('on');
    }
}

function showResult(cq, qc, ra) {
    if (cq === qc) {
        let percentMark = ((ra / qc) * 100).toFixed(2);

        questionContainer.remove();
        submitBtn.remove();
        infoDiv.remove();
        detailsContainer.remove();
        mainExitBtn.remove();
        theCustomLine.remove();

        circlePercent.innerHTML = `${Math.trunc(percentMark)}%`;
        markByPercent.innerHTML = `${percentMark}%`;
        markByNums.innerHTML = `${qc} / ${ra} `;
        totalQuestions.innerHTML = `${qc}`;
        resultRightAnswers.innerHTML = `${ra}`;
        incorrectAnswers.innerHTML = `${qc - ra}`;

        console.log(percentMark)

        if (Math.trunc(percentMark) === 100) {
            markByPercent.classList.add('exellent');
            markByNums.classList.add('exellent');
            markByText.innerHTML = `Exellent`;
            markByText.classList.add('exellent');
        } else if (Math.trunc(percentMark) >= 80 && percentMark !== 100) {
            markByPercent.classList.add('good');
            markByNums.classList.add('good');
            markByText.innerHTML = `Good`;
            markByText.classList.add('good');

        } else if (Math.trunc(percentMark) >= 50 && percentMark !== 80 && percentMark !== 100) {
            markByPercent.classList.add('not-bad');
            markByNums.classList.add('not-bad');
            markByText.innerHTML = `Not Bad`;
            markByText.classList.add('not-bad');
        } else if (Math.trunc(percentMark) < 50) {
            markByPercent.classList.add('bad');
            markByNums.classList.add('bad');
            markByText.innerHTML = `Bad`;
            markByText.classList.add('bad');
        }
        
        resultsContainer.style.display = 'block';
    }
}

resolveBtn.onclick = () => {
    window.location.reload();
}