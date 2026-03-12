import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()
    
    if (!message) {
      return NextResponse.json({ 
        message: "Please provide a message." 
      }, { status: 400 })
    }

    const zai = await ZAI.create()
    
    // Create system prompt with context about Prathamesh
    const systemPrompt = `You are an AI assistant for ${context.name}, a ${context.title}. 
    
Here's what you know about ${context.name}:
- Role: ${context.title}
- Email: ${context.email}
- LinkedIn: ${context.linkedin}
- GitHub: ${context.github}
- 3+ years of experience in Data Science and Machine Learning
- Currently working at 6D Technologies Ltd
- Skills: Python, TensorFlow, Scikit-learn, Deep Learning, NLP, RAG, MySQL, Redis, Chroma, Pandas
- Projects: Customer Segmentation, Recommendation Engine, RAG Chatbot, Text-to-Rule System
- Languages: English, Kannada, Marathi, Hindi
- Location: Bengaluru, India

Keep responses:
- Friendly and professional
- Concise (2-3 sentences max)
- Helpful about ${context.name.split(' ')[0]}'s work and skills
- If asked about contact, provide the email: ${context.email}`

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
    })

    const responseMessage = completion.choices[0]?.message?.content || 
      "I'm here to help! Feel free to ask about my work, skills, or projects."
    
    return NextResponse.json({ 
      message: responseMessage 
    })
    
  } catch (error: any) {
    console.error('Chat API error:', error)
    
    return NextResponse.json({ 
      message: "I'm having a bit of trouble right now. Please try again or reach out directly via email!" 
    }, { status: 500 })
  }
}
