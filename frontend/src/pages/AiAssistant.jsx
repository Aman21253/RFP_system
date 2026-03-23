import ChatBot from "../components/ChatBot";

function AiAssistant() {
  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
        <h2>AI Assistant</h2>
        <div>Home / AI Assistant</div>
      </div>

      <ChatBot />
    </div>
  );
}

export default AiAssistant;