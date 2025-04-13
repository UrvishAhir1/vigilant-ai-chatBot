import React, { useState, useRef, useEffect } from 'react';
import './ChatApp.css';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const apiKey = import.meta.env.VITE_API_KEY;
  const endpoint = import.meta.env.VITE_API_ENDPOINT;
  const model = import.meta.env.VITE_OPENAI_MODEL;

  const appendMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input.trim();
    appendMessage('user', userInput);
    setInput('');
    setLoading(true);
    appendMessage('bot', '⌛ Vigilant is processing...');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content:
                'You are Vigilant.AI, a sharp, resourceful, and watchful assistant inspired by Batman. Respond intelligently and clearly.',
            },
            { role: 'user', content: userInput },
          ],
          temperature: 0.7,
          top_p: 0.9,
        }),
      });

      const data = await res.json();
      console.log('🟢 Full API Response:', data);

      const response =
        data?.choices?.[0]?.message?.content?.trim() ||
        (data?.error?.message
          ? `⚠️ API Error: ${data.error.message}`
          : '❌ Sorry, I could not understand that.');

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = response;
        return updated;
      });
    } catch (err) {
      console.error('❌ Network or parsing error:', err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = `💥 Network Error: ${err.message}`;
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      <header>Vigilant AI</header>
      <div id="chatbox">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            <span className="sender-icon">
              {msg.sender === 'user' ? '🧑‍💻' : '🦇'}
            </span>{' '}
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask Vigilant anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
          autoFocus
          aria-label="User input"
        />
        <button type="submit" disabled={loading}>
          <span>{loading ? 'Sending...' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
};

export default ChatApp;
