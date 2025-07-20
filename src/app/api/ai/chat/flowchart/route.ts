import { canUserUseAI, recordAIUsage } from '@/lib/ai-usage';
import { auth } from '@/lib/auth';
import { canGuestUseAI, recordGuestAIUsage } from '@/lib/guest-usage';
import { headers } from 'next/headers';
import { GoogleGenerativeAI, FunctionDeclarationSchemaType, Content } from '@google/generative-ai/server';

// Gemini 客户端配置
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 工具定义
const tools = {
  functionDeclarations: [
    {
      name: 'generate_flowchart',
      description: 'Generate or update a flowchart using Mermaid syntax',
      parameters: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
          mermaid_code: {
            type: FunctionDeclarationSchemaType.STRING,
            description: 'Valid Mermaid flowchart code',
          },
          mode: {
            type: FunctionDeclarationSchemaType.STRING,
            enum: ['replace', 'extend'],
            description:
              'Whether to replace existing flowchart completely or extend/modify it based on existing content',
          },
          description: {
            type: FunctionDeclarationSchemaType.STRING,
            description: 'Brief description of the flowchart',
          },
        },
        required: ['mermaid_code', 'mode', 'description'],
      },
    },
    {
      name: 'get_canvas_state',
      description:
        'Get detailed analysis of current canvas elements, including user modifications and all elements on the canvas. Use this to understand what is currently drawn before making modifications.',
      parameters: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {},
        required: [],
      },
    },
  ],
};

// 系统提示词
function generateSystemPrompt() {
  return `You are FlowChart AI, an expert at creating flowcharts using Mermaid syntax.

AVAILABLE TOOLS:
- generate_flowchart: Create or update flowcharts using Mermaid syntax
- get_canvas_state: Get detailed analysis of current canvas elements (use this to understand what's currently drawn)

CORE RULES:
- If user asks to create, generate, draw, make, design, or modify a flowchart/diagram → use generate_flowchart tool
- If you need to understand the current canvas state → use get_canvas_state tool first
- If user asks to analyze, describe, or explain the canvas → use get_canvas_state tool and provide natural, conversational analysis
- For general questions or chat → respond normally with text
- Always generate valid Mermaid syntax when using the flowchart tool
- Keep flowcharts clear, well-structured, and easy to understand

IMPORTANT RESPONSE GUIDELINES:
- When generating flowcharts, DO NOT show or mention Mermaid code in your response
- Focus on explaining what the flowchart represents and its purpose
- The flowchart will be automatically added to the canvas - you don't need to tell users how to add it
- Provide natural, conversational explanations about the process or workflow you created
- Ask users if they want any modifications or improvements

FLOWCHART GENERATION MODES:
- **replace**: Clear existing AI elements and create new flowchart (when starting fresh)
- **extend**: Add to or modify existing flowchart (when building on current content)

Be helpful, clear, and educational in all your responses!`;
}

export async function POST(req: Request) {
  let userId: string | null = null;
  let isGuestUser = false;
  const modelName = 'gemini-1.5-flash'; // Using a standard Gemini model name

  try {
    // 1. 身份验证 - 支持guest用户
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      isGuestUser = true;
      const guestCheck = await canGuestUseAI(req);
      if (!guestCheck.canUse) {
        return new Response(
          JSON.stringify({
            error: 'Guest usage limit exceeded',
            message:
              guestCheck.reason ||
              'Guest users can only use AI once per month. Please sign up for more requests.',
            isGuest: true,
            lastUsed: guestCheck.lastUsed,
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // 2. 检查AI使用量限制 (仅对登录用户)
    if (!isGuestUser) {
      const usageCheck = await canUserUseAI(userId!);
      if (!usageCheck.canUse) {
        return new Response(
          JSON.stringify({
            error: 'Usage limit exceeded',
            message: `You have reached your AI usage limit. ${usageCheck.remainingUsage} of ${usageCheck.limit} requests remaining.`,
            usageInfo: usageCheck,
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // 3. 验证请求数据
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. 准备模型和消息
    const model = gemini.getGenerativeModel({
      model: modelName,
      systemInstruction: generateSystemPrompt(),
      tools,
    });

    const chatHistory = messages.map((msg: { role: string; content: string; }) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
    })) as Content[];

    const lastMessage = chatHistory.pop();
    if (!lastMessage) {
        return new Response(JSON.stringify({ error: 'No message to process' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const chat = model.startChat({ history: chatHistory });

    console.log(
      `🚀 Starting AI conversation with ${messages.length} messages (${isGuestUser ? 'Guest' : 'User'})`
    );

    const result = await chat.sendMessageStream(lastMessage.parts);

    console.log('✅ Gemini API call successful, starting stream');

    // 6. 记录AI使用情况
    if (isGuestUser) {
      await recordGuestAIUsage(req, 'flowchart_generation', true);
    } else {
      await recordAIUsage(userId!, 'flowchart_generation', {
        tokensUsed: 0, // Note: Token count from Gemini is not implemented here
        model: modelName,
        success: true,
        metadata: { messageCount: messages.length },
      });
    }

    // 7. 创建流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let accumulatedContent = '';

          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              accumulatedContent += chunkText;
              const data = JSON.stringify({ type: 'text', content: chunkText });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
            
            const functionCalls = chunk.functionCalls();
            if (functionCalls) {
                for (const call of functionCalls) {
                    const data = JSON.stringify({
                        type: 'tool-call',
                        toolName: call.name,
                        args: call.args,
                      });
                    controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                }
                const finishData = JSON.stringify({
                    type: 'finish',
                    content: accumulatedContent || 'Tool calls completed successfully.',
                    toolCallsCompleted: true,
                  });
                controller.enqueue(encoder.encode(`data: ${finishData}\n\n`));
            }
          }
          
          // Final finish if no tool calls were made
          const finishData = JSON.stringify({
            type: 'finish',
            content: accumulatedContent || 'Conversation completed.',
          });
          controller.enqueue(encoder.encode(`data: ${finishData}\n\n`));

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (error: any) {
          console.error('FlowChart API Error:', error);
          const errorData = JSON.stringify({
            type: 'error',
            error: error.message || 'An error occurred while processing your request.',
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('FlowChart API Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message || 'An unexpected error occurred.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
