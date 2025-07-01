import { GoogleGenerativeAI } from '@google/generative-ai';

// Use hardcoded API key since env vars aren't loading in web
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "AIzaSyBkZsDHSE5h_JsLRaTi8fKBGJKTTZZCzXU";

console.log('🤖 Gemini API Key:', GEMINI_API_KEY ? 'Present' : 'Missing');

if (!GEMINI_API_KEY) {
  console.warn('Gemini API key not found. AI features will use fallback parsing.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Parse task from natural language using Gemini AI
 * @param {string} userInput - Natural language input from user
 * @returns {Promise<Object>} - Parsed task object
 */
export const parseTaskWithGemini = async (userInput) => {
  if (!genAI || !userInput.trim()) {
    return fallbackTaskParsing(userInput);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const prompt = `
Parse the following user input into a structured task object. Extract:
- title: The main task description (required)
- time: Specific time mentioned (e.g., "8pm", "3:30 AM", "noon") or null
- date: Date mentioned (e.g., "tomorrow", "Monday", "today", "December 15") or null
- priority: High, Medium, or Low based on urgency words
- category: Work, Personal, Health, Shopping, etc. based on context

User input: "${userInput}"

Respond ONLY with a valid JSON object in this exact format:
{
  "title": "extracted task title",
  "time": "extracted time or null",
  "date": "extracted date or null",
  "priority": "High|Medium|Low",
  "category": "extracted category"
}

Examples:
- "Remind me to call Mom at 8pm tomorrow" → {"title": "Call Mom", "time": "8pm", "date": "tomorrow", "priority": "Medium", "category": "Personal"}
- "Buy groceries" → {"title": "Buy groceries", "time": null, "date": null, "priority": "Medium", "category": "Shopping"}
- "Important meeting with boss at 9 AM Monday" → {"title": "Meeting with boss", "time": "9 AM", "date": "Monday", "priority": "High", "category": "Work"}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse the JSON response
    try {
      const parsed = JSON.parse(text.trim());
      
      // Validate required fields
      if (!parsed.title) {
        throw new Error('No title extracted');
      }
      
      return {
        title: parsed.title.trim(),
        time: parsed.time || null,
        date: parsed.date || null,
        priority: parsed.priority || 'Medium',
        category: parsed.category || 'Personal',
        aiParsed: true
      };
    } catch (parseError) {
      console.warn('Failed to parse Gemini response as JSON:', text);
      return fallbackTaskParsing(userInput);
    }
  } catch (error) {
    console.error('Gemini AI error:', error);
    return fallbackTaskParsing(userInput);
  }
};

/**
 * Generate AI response for successful task creation
 * @param {Object} task - The created task object
 * @returns {Promise<string>} - AI response message
 */
export const generateAIResponse = async (task) => {
  if (!genAI) {
    return generateFallbackResponse(task);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
Generate a brief, friendly confirmation message for adding a task to a task manager app called "tasQ".

Task details:
- Title: ${task.title}
- Time: ${task.time || 'Not specified'}
- Date: ${task.date || 'Today'}
- Priority: ${task.priority}
- Category: ${task.category}

The response should be:
- 1-2 sentences maximum
- Friendly and encouraging
- Confirm the task was added
- Mention relevant details (time/date if specified)
- Match the app's motivational tone ("built for doers, not draggers")

Examples:
- "Perfect! I've added 'Call Mom' to your tasks for tomorrow at 8pm. You're staying on top of things! 💪"
- "Got it! 'Buy groceries' is now on your list. One step closer to being organized! ✅"
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating AI response:', error);
    return generateFallbackResponse(task);
  }
};

/**
 * Generate suggestions for incomplete or unclear input
 * @param {string} userInput - The unclear input
 * @returns {Promise<string>} - Suggestion message
 */
export const generateSuggestion = async (userInput) => {
  if (!genAI) {
    return "I'd be happy to help you manage your tasks! Try saying something like 'Remind me to call Mom at 8pm' or 'Add workout to tomorrow'.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
The user provided unclear input for a task manager: "${userInput}"

Generate a helpful, friendly suggestion that:
- Acknowledges their input
- Explains what might be missing
- Provides 1-2 specific examples of better phrasing
- Keeps the tone encouraging and brief
- Matches the app's style ("tasQ" - built for doers)

Keep it to 1-2 sentences maximum.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating suggestion:', error);
    return "I'd be happy to help you manage your tasks! Try saying something like 'Remind me to call Mom at 8pm' or 'Add workout to tomorrow'.";
  }
};

// Fallback parsing when Gemini is not available
const fallbackTaskParsing = (text) => {
  const lowerText = text.toLowerCase();
  
  // Extract time patterns
  const timePatterns = [
    /at (\d{1,2}):?(\d{0,2})\s*(am|pm)/i,
    /(\d{1,2}):?(\d{0,2})\s*(am|pm)/i,
    /at (\d{1,2})\s*(am|pm)/i,
  ];
  
  // Extract date patterns
  const datePatterns = [
    /tomorrow/i,
    /today/i,
    /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
  ];

  let taskTime = null;
  let taskDate = null;
  let taskTitle = text;

  // Parse time
  for (const pattern of timePatterns) {
    const match = text.match(pattern);
    if (match) {
      taskTime = match[0];
      taskTitle = taskTitle.replace(pattern, '').trim();
      break;
    }
  }

  // Parse date
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      taskDate = match[0];
      taskTitle = taskTitle.replace(pattern, '').trim();
      break;
    }
  }

  // Clean up task title
  taskTitle = taskTitle
    .replace(/^(remind me to|i need to|add task|create task)/i, '')
    .replace(/^(to )/i, '')
    .trim();

  return {
    title: taskTitle || text,
    time: taskTime,
    date: taskDate,
    priority: 'Medium',
    category: 'Personal',
    aiParsed: false
  };
};

// Fallback response generation
const generateFallbackResponse = (task) => {
  const timeText = task.time ? ` at ${task.time}` : '';
  const dateText = task.date ? ` for ${task.date}` : '';
  
  return `Great! I've added "${task.title}" to your tasks${timeText}${dateText}. Keep up the momentum! 🚀`;
};

export default {
  parseTaskWithGemini,
  generateAIResponse,
  generateSuggestion,
}; 