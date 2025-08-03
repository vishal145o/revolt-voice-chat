const recordBtn = document.getElementById('recordBtn');
const chatDiv = document.getElementById('chat');

let isRecording = false;
let recognition;

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-IN';

  recognition.onstart = () => {
    isRecording = true;
    recordBtn.textContent = '🛑 Stop Talking';
  };

  recognition.onend = () => {
    isRecording = false;
    recordBtn.textContent = '🎤 Start Talking';
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    showMessage(transcript, 'user');
    sendToBackend(transcript);
  };
} else {
  alert("Your browser doesn't support speech recognition.");
}

recordBtn.addEventListener('click', () => {
  if (isRecording) {
    recognition.stop();
  } else {
    recognition.start();
  }
});

function showMessage(text, type) {
  const div = document.createElement('div');
  div.className = `message ${type}`;
  div.textContent = `${type === 'user' ? 'You' : 'Rev'}: ${text}`;
  chatDiv.appendChild(div);
}

function sendToBackend(message) {
  fetch('http://localhost:3000/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })
  .then(res => res.json())
  .then(data => {
    showMessage(data.reply, 'bot');
    speakOutLoud(data.reply);
  })
  .catch(err => {
    console.error('Error:', err);
    showMessage('Something went wrong.', 'bot');
  });
}

function speakOutLoud(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.cancel(); // Handle interruption
  speechSynthesis.speak(utterance);
}
