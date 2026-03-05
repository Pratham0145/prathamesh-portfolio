import { NextRequest, NextResponse } from 'next/server'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// Prathamesh's information for context
const PRATHAMESH_CONTEXT = `
You are an AI assistant for Prathamesh Patil's portfolio website. You help visitors learn about Prathamesh and his work. Be friendly, professional, and helpful.

Here's information about Prathamesh Patil:

**Professional Summary:**
- Data Scientist with 3+ years of experience
- Expertise in ML models, customer segmentation, recommendation systems, and conversational AI
- Works at 6D Technologies Ltd in Bengaluru, India
- Strong problem-solving skills focused on delivering business value through AI/ML solutions

**Skills:**
- Data Science & ML: Python, TensorFlow, Scikit-learn, Pandas, NumPy, Deep Learning, NLP, RAG Architecture
- Databases: MySQL, SingleStoreDB, Redis Stack, Chroma, Supabase
- Web & Automation: JavaScript, HTML5, CSS3, Streamlit, N8N, Seahorse Workflow
- Tools: Linux, Git, RESTful APIs

**Key Projects:**
1. AI-Powered Customer Segmentation System - RFM analysis and behavioral pattern recognition for CRM integration
2. Product Recommendation Engine - Collaborative filtering with real-time APIs for prepaid/postpaid customers
3. RAG-Based CVM Chatbot - Vector search and conversational AI for customer value management
4. Text-to-Rule Automation - NLP-powered dynamic business rule configuration
5. ML Workflow Pipelines - Automation using Seahorse, N8N, Apache Airflow, Metabase
6. Interactive ML Dashboard - Streamlit-based real-time model experimentation

**Education:**
- Bachelor of Engineering (B.E.) from The Oxford College of Engineering, Bengaluru
- CGPA: 7.91/10, Graduated 2022

**Languages:** English, Kannada, Marathi, Hindi

**Contact:**
- Phone: +91 9187585706
- Email: prathameshece2022@gmail.com

**Professional Attributes:**
- Strong problem-solving skills
- Experience in Agile development environments
- Excellent communication with technical and non-technical stakeholders
- Continuous learner staying updated with AI/ML trends

When answering:
- Be concise but informative
- Encourage visitors to contact Prathamesh for collaborations
- Highlight relevant skills and projects based on the visitor's interests
- If asked about something not in the context, politely say you don't have that information and suggest contacting Prathamesh directly
`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history = [] } = body as { message: string; history: Message[] }

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Call the Python chatbot backend
    const response = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message, 
        history,
        system_prompt: PRATHAMESH_CONTEXT 
      })
    })

    if (!response.ok) {
      // Fallback to a simple response if backend is not available
      return NextResponse.json({ 
        response: "I'm here to help you learn about Prathamesh! He's a Data Scientist with 3+ years of experience in ML, customer segmentation, and AI. Feel free to ask about his skills, projects, or how to contact him for collaborations!" 
      })
    }

    const data = await response.json()
    return NextResponse.json({ response: data.response })

  } catch (error) {
    console.error('Chat API error:', error)
    // Return a fallback response
    return NextResponse.json({ 
      response: "Thanks for your interest! Prathamesh is a Data Scientist specializing in ML and AI solutions. For detailed inquiries, please reach out via email at prathameshece2022@gmail.com or use the contact form above." 
    })
  }
}
