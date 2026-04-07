import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { toast } from 'react-hot-toast';
import { MessageCircle, Send } from 'lucide-react';

export default function Chatbot() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('/ai/chatbot', { question });
      setAnswer(res.data.answer || 'No answer available.');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to get answer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <h1 className="mb-2 heading-lg">AI Chatbot Assistant</h1>
        <p className="text-sm text-text-secondary">Get instant platform guidance, mentorship tips, and discussion best practices from our AI assistant.</p>
      </div>

      <Card className="max-w-3xl p-6 mx-auto space-y-4">
        <div className="flex items-center gap-2 font-semibold text-primary">
          <MessageCircle size={18} /> Ask the platform assistant
        </div>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What would you like to know?"
          className="w-full h-32 text-sm form-input"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-text-secondary">You can ask about mentor requests, discussion rules, profile verification, and platform navigation.</div>
          <Button onClick={askQuestion} disabled={loading}>
            <Send size={14} /> {loading ? 'Thinking...' : 'Ask'}
          </Button>
        </div>
        {answer && (
          <div className="p-4 border rounded-3xl border-border bg-card">
            <div className="mb-2 text-sm font-semibold">Answer</div>
            <p className="whitespace-pre-wrap text-text-secondary">{answer}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
