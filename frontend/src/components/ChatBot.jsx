import { useState } from "react";
import API from "../api/axios";
import "./ChatBot.css";

function ChatBot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);
      const res = await API.post("/ai/ask", { question });
      setAnswer(res.data.answer);
    } catch (error) {
      console.log(error);
      setAnswer("Failed to get answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-card">
      <h3 className="chatbot-title">AI Assistant</h3>

      <div className="chatbot-row">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about RFPs..."
          className="chatbot-input"
        />
        <button onClick={handleAsk} className="chatbot-btn" disabled={loading}>
          {loading ? "Asking..." : "Ask"}
        </button>
      </div>

      <div className="chatbot-answer">
        {answer || "Your answer will appear here."}
      </div>
    </div>
  );
}

export default ChatBot;