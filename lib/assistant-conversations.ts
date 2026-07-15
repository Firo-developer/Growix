export interface StoredChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}

export interface StoredConversation {
  id: number;
  title: string;
  preview: string;
  messages: StoredChatMessage[];
  pinned?: boolean;
}

const STORAGE_KEY = 'growix-assistant-conversations';
const RESTORE_KEY = 'growix-assistant-restore-id';

export function readAssistantConversations(): StoredConversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredConversation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeAssistantConversations(conversations: StoredConversation[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function queueAssistantConversationRestore(id: number) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(RESTORE_KEY, String(id));
}

export function takeAssistantConversationRestore(): number | null {
  if (typeof window === 'undefined') return null;
  const value = sessionStorage.getItem(RESTORE_KEY);
  sessionStorage.removeItem(RESTORE_KEY);
  if (!value) return null;
  const id = Number(value);
  return Number.isFinite(id) ? id : null;
}

export function searchAssistantConversations(query: string, conversations = readAssistantConversations()) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return conversations.slice(0, 6);
  return conversations
    .filter((conversation) => `${conversation.title} ${conversation.preview}`.toLowerCase().includes(normalized))
    .sort((left, right) => Number(Boolean(right.pinned)) - Number(Boolean(left.pinned)) || right.id - left.id)
    .slice(0, 8);
}
