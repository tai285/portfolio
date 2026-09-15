export interface TriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const triviaQuestions: TriviaQuestion[] = [
  {
    question: "What award did Dorothy's Final Year Project win at PRISM 2026?",
    options: ["Silver Award", "Gold Award", "Bronze Award", "Best Poster"],
    correctIndex: 1,
    explanation: "Gold Award — plus a Consolation Prize in a separate category!",
  },
  {
    question: "Which microcontroller powers the IoT layer of the project?",
    options: ["Arduino Uno", "Raspberry Pi", "ESP32", "STM32"],
    correctIndex: 2,
    explanation: "ESP32 connects the RFID sensing layer to the rest of the system.",
  },
  {
    question: "What does RFID stand for?",
    options: [
      "Radio Frequency Identification",
      "Rapid File Indexing Device",
      "Remote Fixed Input Detector",
      "Real-time Frequency Interface Driver",
    ],
    correctIndex: 0,
    explanation: "Radio Frequency Identification — used for physical inventory sensing.",
  },
  {
    question: "What did Dorothy add to the IoT system to turn it into a research project?",
    options: [
      "A mobile app",
      "AI / LLM implementation and tool calling",
      "A new RFID reader",
      "A cloud database",
    ],
    correctIndex: 1,
    explanation:
      "AI and LLM implementation with tool calling extended the system from IoT into intelligent assistance.",
  },
  {
    question: "Where was the AI-extended research presented?",
    options: [
      "PRISM 2026 only",
      "8th UEC ASEAN Seminar & Workshop 2026",
      "A local hackathon",
      "It hasn't been presented yet",
    ],
    correctIndex: 1,
    explanation:
      "The 8th UEC ASEAN Seminar & Workshop 2026, winning the Youth Researcher Encouragement Award.",
  },
  {
    question: "Which of these is part of Dorothy's everyday software stack?",
    options: ["Ruby on Rails", "Python + Flask", "PHP + Laravel", "Java + Spring"],
    correctIndex: 1,
    explanation: "Python and Flask, alongside JavaScript/TypeScript on the frontend.",
  },
];
