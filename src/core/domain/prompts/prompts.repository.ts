import { CreatePromptDTO } from '@/core/application/prompts/create-prompt.dto';
import { Prompt } from './prompt.entity';

export interface PromptRepository {
  findMany(): Promise<Prompt[]>;
  searchMany(term: string): Promise<Prompt[]>;
  create(data: CreatePromptDTO): Promise<void>;
  findByTitle(title: string): Promise<Prompt | null>;
}
