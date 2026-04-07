const { execFile } = require('child_process');
const { OpenAI } = require('openai');

const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1:latest';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

const generateWithOllama = (prompt) => {
  return new Promise((resolve, reject) => {
    execFile('ollama', ['generate', OLLAMA_MODEL, '--no-stream', '--json', prompt], { timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`Ollama error: ${stderr || error.message}`));
      }

      const raw = stdout.toString().trim();
      if (!raw) {
        return reject(new Error('Empty response from Ollama'));
      }

      try {
        const parsed = JSON.parse(raw);
        if (parsed?.output) {
          return resolve(parsed.output);
        }
      } catch {
        return resolve(raw);
      }

      resolve(raw);
    });
  });
};

const generateWithOpenAI = async (prompt) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: OPENAI_MODEL,
    input: prompt,
  });

  const output = response.output?.[0]?.content;
  let text = '';

  if (typeof output === 'string') {
    text = output;
  } else if (Array.isArray(output)) {
    const entry = output.find((item) => item.type === 'output_text');
    text = entry?.text || output.map((item) => item.text || '').join('');
  }

  if (!text) {
    throw new Error('OpenAI returned an invalid response');
  }

  return text;
};

const generateIcebreaker = async (req, res) => {
  const { studentName, studentMajor, alumniName, alumniRole, alumniCompany } = req.body;

  if (!studentName || !alumniName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = `You are a helpful networking assistant for a university alumni platform. Write a short, professional LinkedIn-style icebreaker message (max 60 words). Sender: ${studentName}, a student majoring in ${studentMajor}. Recipient: ${alumniName}, a ${alumniRole} at ${alumniCompany}. Instructions: Mention their company, be respectful, and ask for a small piece of advice. Do not ask for a job.`;

  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const icebreaker = isProduction
      ? await generateWithOpenAI(prompt)
      : await generateWithOllama(prompt);

    res.json({ icebreaker: icebreaker.trim() });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to generate icebreaker' });
  }
};

const generateChatbotResponse = async (req, res) => {
  const { question } = req.body;

  if (!question || question.trim().length === 0) {
    return res.status(400).json({ error: 'Question is required' });
  }

  const prompt = `You are an AI assistant for an alumni-student engagement platform. Answer the user query clearly and concisely, provide guidance on platform navigation, mentorship requests, discussion guidelines, and community best practices. Keep the response friendly, professional, and specific to using the Alumni Connect platform.`;
  const fullPrompt = `${prompt}\n\nUser question: ${question}`;

  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const answer = isProduction
      ? await generateWithOpenAI(fullPrompt)
      : await generateWithOllama(fullPrompt);

    res.json({ answer: answer.trim() });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to generate chatbot response' });
  }
};

module.exports = { generateIcebreaker, generateChatbotResponse };