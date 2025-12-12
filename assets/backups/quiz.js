let isMuted = localStorage.getItem('isMuted') === 'true';

document.addEventListener('DOMContentLoaded', function() {
    loadArticle(quizData);
    loadScore();
    setupResetButton();
    
    const muteBtn = document.getElementById('mute-btn');
    muteBtn.textContent = isMuted ? 'Unmute' : 'Mute';
    muteBtn.classList.toggle('muted', isMuted);
    muteBtn.addEventListener('click', toggleMute);
});

function setupResetButton() {
    const resetBtn = document.createElement('button');
    resetBtn.id = 'reset-score';
    resetBtn.textContent = 'Reset';
    resetBtn.onclick = resetScore;
    document.getElementById('score').appendChild(resetBtn);
}

function resetScore() {
    if (confirm('Are you sure you want to reset your score?')) {
        localStorage.setItem('correctScore', '0');
        localStorage.setItem('incorrectScore', '0');
        loadScore();
    }
}

function loadScore() {
    const correctScore = parseInt(localStorage.getItem('correctScore')) || 0;
    const incorrectScore = parseInt(localStorage.getItem('incorrectScore')) || 0;
    
    document.getElementById('correct-score').textContent = correctScore;
    document.getElementById('incorrect-score').textContent = incorrectScore;
    
    const total = correctScore + incorrectScore;
    const percentage = total > 0 ? Math.round((correctScore / total) * 100) : 0;
    document.getElementById('percentage-score').textContent = percentage;
}

function loadArticle(data) {
    const contentDiv = document.getElementById('article-content');
    contentDiv.innerHTML = '';
    
    data.sentences.forEach((sentence, idx) => {
        const sentenceDiv = document.createElement('div');
        sentenceDiv.className = 'sentence';
        sentenceDiv.textContent = sentence.text;

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';

        const trueBtn = document.createElement('button');
        trueBtn.className = 'option';
        trueBtn.textContent = 'True';
        trueBtn.onclick = () => validateAnswer(sentence.isTrue, true, sentenceDiv, trueBtn, falseBtn);

        const falseBtn = document.createElement('button');
        falseBtn.className = 'option';
        falseBtn.textContent = 'False';
        falseBtn.onclick = () => validateAnswer(sentence.isTrue, false, sentenceDiv, trueBtn, falseBtn);

        optionsDiv.appendChild(trueBtn);
        optionsDiv.appendChild(falseBtn);
        sentenceDiv.appendChild(optionsDiv);
        contentDiv.appendChild(sentenceDiv);
    });

    const sourceLink = document.getElementById('source-link');
    sourceLink.style.display = 'none';
    sourceLink.querySelector('button').setAttribute('data-url', data.sourceLink);
}

function validateAnswer(isTrue, userAnswer, sentenceDiv, trueBtn, falseBtn) {
    const isCorrect = userAnswer === isTrue;
    
    trueBtn.disabled = true;
    falseBtn.disabled = true;

    // Add selected class to clicked button only
    const selectedBtn = userAnswer ? trueBtn : falseBtn;
    selectedBtn.classList.add('selected');
    selectedBtn.classList.add(isCorrect ? 'correct' : 'incorrect');

    const indicator = document.createElement('span');
    indicator.className = `answer-indicator ${isCorrect ? 'correct-indicator' : 'incorrect-indicator'}`;
    indicator.textContent = isCorrect ? '✓' : '✗';
    
    if (!isCorrect) {
        const correctLabel = document.createElement('span');
        correctLabel.className = 'correct-answer-label';
        correctLabel.textContent = `Correct answer: ${isTrue ? 'True' : 'False'}`;
        sentenceDiv.appendChild(correctLabel);
    }

    selectedBtn.appendChild(indicator);

    updateScore(isCorrect);
    playSound(isCorrect ? 'ding' : 'buzzer');
    
    checkCompletion();
}

function updateScore(isCorrect) {
    const correctScore = document.getElementById('correct-score');
    const incorrectScore = document.getElementById('incorrect-score');
    
    const currentCorrect = parseInt(correctScore.textContent) || 0;
    const currentIncorrect = parseInt(incorrectScore.textContent) || 0;
    
    if (isCorrect) {
        const newScore = currentCorrect + 1;
        correctScore.textContent = newScore;
        localStorage.setItem('correctScore', newScore);
    } else {
        const newScore = currentIncorrect + 1;
        incorrectScore.textContent = newScore;
        localStorage.setItem('incorrectScore', newScore);
    }
    
    const total = parseInt(correctScore.textContent) + parseInt(incorrectScore.textContent);
    const percentage = Math.round((parseInt(correctScore.textContent) / total) * 100);
    document.getElementById('percentage-score').textContent = percentage;
}

function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('isMuted', isMuted);
    const muteBtn = document.getElementById('mute-btn');
    muteBtn.textContent = isMuted ? 'Unmute' : 'Mute';
    muteBtn.classList.toggle('muted', isMuted);
}

function playSound(type) {
    if (!isMuted) {
        const sound = document.getElementById(`${type}-sound`);
        sound.play();
    }
}

function checkCompletion() {
    const options = document.querySelectorAll('.option');
    const allDisabled = Array.from(options).every(option => option.disabled);
    if (allDisabled) {
        document.getElementById('source-link').style.display = 'block';
    }
}