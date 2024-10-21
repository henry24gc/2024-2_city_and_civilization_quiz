let currentQuestion = {};
let usedQuestions = [];
let results = [];

// 진행 상황 업데이트
function updateProgress() {
    const progress = `${usedQuestions.length} / ${quizData.length} 문제 완료`;
    document.getElementById('progress').textContent = progress;
}

// 페이지 로드 시 첫 문제 로드
window.onload = function() {
    loadQuestion();
    updateProgress();
};

// 랜덤 문제 로드 (중복 방지)
function loadQuestion() {
    if (usedQuestions.length === quizData.length) {
        showSummary(); // 모든 문제 완료 시 요약 표시
        return;
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * quizData.length);
    } while (usedQuestions.includes(randomIndex));

    currentQuestion = quizData[randomIndex];
    usedQuestions.push(randomIndex);

    document.getElementById('question').textContent = currentQuestion.question;
    document.getElementById('answer').value = "";
    document.getElementById('answer').focus();

    // 초기화
    document.getElementById('result').textContent = "";
    document.getElementById('submit-btn').style.display = "inline-block";
    document.getElementById('show-answer-btn').style.display = "none";
    document.getElementById('next-btn').style.display = "none";

    updateProgress();
}

// 공백과 대소문자 무시한 비교
function normalizeText(text) {
    return text.replace(/\s+/g, '').toLowerCase();
}

// 정답 제출 처리
function submitAnswer() {
    const userAnswer = document.getElementById('answer').value.trim();
    const isCorrect = normalizeText(userAnswer) === normalizeText(currentQuestion.answer);

    // 이미 존재하는 문제 결과가 없으면 새로 저장
    const existingResult = results.find(r => r.question === currentQuestion.question);
    if (!existingResult) {
        results.push({
            question: currentQuestion.question,
            correctAnswer: currentQuestion.answer,
            userAnswer: userAnswer,
            isCorrect: isCorrect
        });
    }

    const resultElement = document.getElementById('result');
    if (isCorrect) {
        resultElement.textContent = "정답입니다! 🎉";
        resultElement.style.color = "green";
        document.getElementById('next-btn').style.display = "inline-block";
    } else {
        resultElement.textContent = "오답입니다. 다시 시도해보세요! ❌";
        resultElement.style.color = "red";
        document.getElementById('show-answer-btn').style.display = "inline-block";
    }
}

// 정답 보기 기능
function showAnswer() {
    const resultElement = document.getElementById('result');
    resultElement.textContent = `정답은: ${currentQuestion.answer}`;
    resultElement.style.color = "blue";
    document.getElementById('next-btn').style.display = "inline-block";
}

// 요약 표시
function showSummary() {
    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = "<h2>모든 문제를 완료했습니다!</h2>";

    const resultTable = document.createElement('table');
    resultTable.innerHTML = `
        <tr>
            <th>문제</th>
            <th>정답</th>
            <th>내 답변</th>
            <th>정오 여부</th>
        </tr>
    `;

    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.question}</td>
            <td>${result.correctAnswer}</td>
            <td>${result.userAnswer || "미제출"}</td>
            <td>${result.isCorrect ? "정답" : "오답"}</td>
        `;
        resultTable.appendChild(row);
    });

    summaryDiv.appendChild(resultTable);
    summaryDiv.style.display = "block";
}

// 키보드 이벤트 처리
function handleKeyPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submitAnswer();
    } else if (event.key === "Enter" && event.shiftKey) {
        event.preventDefault();
        loadQuestion();
    }
}
