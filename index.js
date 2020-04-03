const state = {
  count: 0,
  score: 0
};

function handleStartQuiz() {
  $("main").on("click", ".js-start", function(event) {
    event.preventDefault();
    state.count = 0;
    state.score = 0;
    renderQuestion();
  });
}

function handleSubmitAnswer() {
  $("main").on("submit", "#js-question-form", function(event) {
    event.preventDefault();
    $("input[type=radio]").attr("disabled", true);
    $(".js-submit").hide();
    submitAnswer(event.currentTarget);
  });
}

function handleNextQuestion() {
  $("main").on("click", ".js-next", function(event) {
    event.preventDefault();
    if (state.count <= STORE.length - 1) {
      renderQuestion();
    } else {
      renderFinal();
    }
  });
}

function submitAnswer(target) {
  const qIdx = state.count;
  const selected = $(target).find("input:checked");

  if (selected.val()) {
    const userAnswer = STORE[qIdx].answers[selected.val()];
    const correctObj = STORE[qIdx].answers.find(a => a.correct === true);
    const correctStr =
      correctObj.answer !== "" ? correctObj.answer : correctObj.label;
    let feedbackStr = `That's Incorrect. The correct answer is ${correctStr}`;
    let feedbackStyle = "incorrect";

    // if user answer is correct update the score and feedback string
    if (userAnswer.correct === true) {
      state.score++;
      feedbackStr = `Good job! ${correctStr} is the correct answer.`;
      feedbackStyle = "correct";
    }

    // generate feedback hmtl
    const feedbackHtml = feedbackTmpl(feedbackStyle, feedbackStr);

    // generate score html
    const scoreHtml = scoreTmpl();

    renderFeedback(feedbackHtml);
    renderScore(scoreHtml);
    state.count++;
  }
}

function renderQuestion() {
  const qIdx = state.count;
  const question = STORE[qIdx].question;
  const answers = STORE[qIdx].answers;
  const qType = STORE[qIdx].type;

  // get the formula html for this type of question
  const formulaHtml = formulaTmpl(qType);

  // collect answers html
  const answersHtml = answersTmpl(answers);

  // collect all html for question rendering
  const questionHtml = questionTmpl(qIdx, question, formulaHtml, answersHtml);
  renderMain(questionHtml);
}

function renderMain(str) {
  $("main").html(str);
}

function renderFeedback(feedbackHtml) {
  $("main").append(feedbackHtml);
}

function renderScore(str) {
  $("main")
    .find("li.score")
    .html(str);
}

function renderFinal() {
  const finalHtml = finalTmpl();
  renderMain(finalHtml);
}

function formulaTmpl(qType) {
  let vals;
  let formulaVals = {
    time: { name: "Time", type: "hours" },
    distance: { name: "Distance", type: "miles" },
    speed: { name: "Speed", type: "miles/hour" }
  };

  let time = [formulaVals.time, formulaVals.distance, formulaVals.speed];
  let distance = [formulaVals.distance, formulaVals.time, formulaVals.speed];
  let speed = [formulaVals.speed, formulaVals.distance, formulaVals.time];

  if (qType === "time") {
    vals = time;
  }
  if (qType === "distance") {
    vals = distance;
  }
  if (qType === "speed") {
    vals = speed;
  }

  let tmpl = `
    <ul>
      <li><span>${vals[0].name}</span></li>
      <li>(${vals[0].type})</li>
    </ul>
    <ul>
      <li>=</li>
    </ul>
    <ul>
      <li><span>${vals[1].name}</span></li>
      <li>(${vals[1].type})</li>
    </ul>
    <ul>
      <li>${qType === "distance" ? "x" : "/"}</li>
    </ul>
    <ul>
      <li><span>${vals[2].name}</span></li>
      <li>(${vals[2].type})</li>
    </ul>
    `;

  return `
    <h1>Calculate ${qType.replace(/^./, qType[0].toUpperCase())}</h1>
    <code>
      ${tmpl}
    </code>
    `;
}

function questionTmpl(idx, question, formulaHtml, answersHtml) {
  return `
    <div class="formula question-formula ">
      ${formulaHtml}
    </div>
    <section>
      <div>
      <ul>
        <li class="question-num">
          Question: <span>${idx + 1}</span>/<span>${STORE.length}</span>
        </li>
        <li class="score">${scoreTmpl()}</li>
      </ul>
        
      </div>
      <form id="js-question-form">
        <h2>${question}</h2>
        ${answersHtml.join("")}
        <button type="submit" class="js-submit submit-btn">Submit</button>
      </form>
    </section>
    `;
}

function answersTmpl(answers) {
  return answers.map(function(answer, idx) {
    return `
    <label for="${idx}">
      <input type="radio" id="${idx}" name="radio" value="${idx}" required />
      <span>${answer.label}</span>
    </label>
    `;
  });
}

function feedbackTmpl(style, str) {
  return `
    <section class="feedback-container ${style}">
      <button class="js-next next-btn">Next</button>
      <div class="feedback">
        ${str}
      </div>
    </section>
    `;
}

function scoreTmpl() {
  return `
    Your Score: <span>${state.score}</span>/<span>${STORE.length}</span>
    `;
}

function finalTmpl() {
  return `
    <section class="final">
      <h1>Your Final Score Is</h1>
      <div class="score">${scoreTmpl().replace("Your Score:", "")}</div>
      <button class="js-start">Restart Quiz</button>
    </section>
    <section>
      <div>
          <img class="congratulations" src="images/congratulations.jpg" alt="congratulations image" />
      </div>
    </section>
    `;
}

function main() {
  handleStartQuiz(); // use for start and restart
  handleSubmitAnswer();
  handleNextQuestion();
}

$(main);
