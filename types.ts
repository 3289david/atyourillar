
export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface RabbitState {
  level: number;
  exp: number;
  maxExp: number;
  energy: number;
  happiness: number;
  intelligence: number;
  stageName: string;
  emoji: string;
}

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

export interface EduLink {
  name: string;
  url: string;
  desc: string;
  category: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface PlannerTask {
  id: string;
  text: string;
  done: boolean;
}
