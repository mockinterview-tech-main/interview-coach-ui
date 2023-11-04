import {json} from '@sveltejs/kit';

type ConversationPart = {
    participant: string;
    text: string
}

type Conversation = ConversationPart[];

let conversation: Conversation = [];

export const GET = () => {
    return json(conversation);
}

export const POST = async ({ request }) => {
    const { participant, text } = await request.json();
    conversation = [...conversation, {participant, text}];
    return json(conversation);
}

export const PUT = async ({ request }) => {
    const { participant, text } = await request.json();
    conversation = [...conversation, {participant, text}];
    return json(conversation);
}

export const DELETE = () => {
    conversation = [];
    return json(conversation);
}
