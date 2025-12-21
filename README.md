# Study Buddyy

A React-based intelligent study companion designed to gamify your learning process and keep you focused. Features a local AI Tutor (powered by Ollama), interactive study tools, and a beautiful Bento Grid Glassmorphism UI.

## ✨ Key Features

### 🤖 Local AI Tutor (Ollama)
- **Voice-Powered**: Talk to your AI tutor using the microphone.
- **Local Privacy**: Runs entirely on your machine using **Ollama** (supports `llama3.1`).
- **Contextual Help**: Ask about programming concepts, get motivation, or request a joke.
- **Smart Responses**: No API keys needed—just run your local model.

### 🎴 AI Flashcards (NEW)
- **Infinite Learning**: Generate flashcards on *any* topic instantly.
- **Interactive UI**: 3D flip animations to test your memory.
- **Smart Generation**: Powered by your local Ollama model.

### 🎧 Soundscape Mixer (NEW)
- **Custom Ambiance**: Mix multiple audio tracks to create your perfect focus environment.
- **Volume Control**: Independently adjust "Rain" and "Ambient" levels.
- **Persistent Settings**: Your volume preferences are saved automatically.

### 📊 Interactive Analytics (NEW)
- **Real-Time Tracking**: Every second of focus is recorded.
- **Visual History**: View your study performance over the last 7 days.
- **Daily Progress**: Watch your daily bar grow as you study.

### 🧠 Smart Quizzes & Review (NEW)
- **Infinite Quizzes**: Generate quizzes on any subject.
- **Review Mode**: Learn from mistakes with **AI-generated explanations** for every answer.
- **Gamified Results**: Earn XP based on your score.

### 🍱 Bento Grid Dashboard
- **Modern Layout**: A structured, responsive grid layout for optimal organization.
- **Consistent Design**: Glassmorphism cards with consistent sizing and alignment.
- **Visual Clarity**: Timer, Stats, Tasks, and Quizzes arranged for easy access.

## 🛠️ Technology Stack
- **Core**: React.js + Vite
- **Styling**: TailwindCSS
- **Animations**: Framer Motion, Canvas Confetti
- **Icons**: Lucide React
- **AI**: Local Ollama (LLaMA 3.1)
- **Audio**: Web Speech API

## 🚀 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed.
- [Ollama](https://ollama.com/) installed and running.

### 1. Setup Ollama
Ensure Ollama is installed and the model is pulled:
```bash
ollama pull llama3.1
```
Start Ollama with CORS enabled (required for browser access):
*Windows (PowerShell):*
```powershell
$env:OLLAMA_ORIGINS="*"; ollama serve
```
*Mac/Linux:*
```bash
OLLAMA_ORIGINS="*" ollama serve
```

### 2. Install App
Clone the repository and install dependencies:
```bash
git clone https://github.com/Skull-boy/StudyBuddyy.git
cd StudyBuddyy
npm install
```

### 3. Run
Start the development server:
```bash
npm run dev
```

## 📖 Usage Guide

1.  **Start Studying**: Click the play button or say "Start timer".
2.  **Generate Flashcards**: Go to the Flashcards tab, type a topic (e.g., "Biology"), and start flipping!
3.  **Mix Your Sound**: Click the music note icon to open the mixer and blend rain/ambient sounds.
4.  **Take a Smart Quiz**: Generate a quiz, answer questions, and **Review** the explanations at the end.
5.  **Track Progress**: Check the Analytics chart to see your weekly consistency.

## ❓ Troubleshooting

### Ollama Connection Failed?
- Ensure Ollama is running (`ollama serve`).
- Ensure you set the environment variable `$env:OLLAMA_ORIGINS="*"` (Windows) or `OLLAMA_ORIGINS="*"` (Mac/Linux) **before** starting the server.
- Errors in the console? Check if your browser is blocking local requests (rare, but possible).

## 🤝 Contributing
Contributions are welcome! Feel free to submit issues and enhancement requests.
