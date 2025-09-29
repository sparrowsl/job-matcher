import { streamCVBuildingChat } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages, conversationId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages are required', { status: 400 });
    }

    // Stream the AI response
    const result = await streamCVBuildingChat(messages);

    // Save messages to database (non-blocking)
    if (conversationId) {
      // Save in background without blocking the stream
      saveMessages(conversationId, messages).catch(console.error);
    }

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in CV chat:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

async function saveMessages(conversationId: string, messages: any[]) {
  try {
    // Get or create conversation
    let conversation = await prisma.chatConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      conversation = await prisma.chatConversation.create({
        data: {
          id: conversationId,
          currentStep: 'greeting',
        },
      });
    }

    // Save only new messages
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      await prisma.chatMessage.create({
        data: {
          conversationId: conversation.id,
          role: lastMessage.role,
          content: lastMessage.content,
        },
      });
    }
  } catch (error) {
    console.error('Error saving messages:', error);
  }
}
