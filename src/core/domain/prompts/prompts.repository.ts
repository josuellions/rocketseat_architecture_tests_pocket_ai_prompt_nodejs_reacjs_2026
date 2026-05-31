import { CreatePromptDTO } from '@/core/application/prompts/create-prompt.dto';
import { Prompt } from './prompt.entity';

export interface PromptRepository {
  findMany(): Promise<Prompt[]>;
  delete(id: string): Promise<void>;
  searchMany(term: string): Promise<Prompt[]>;
  create(data: CreatePromptDTO): Promise<void>;
  findById(id: string): Promise<Prompt | null>;
  findByTitle(title: string): Promise<Prompt | null>;
  update(id: string, data: Partial<CreatePromptDTO>): Promise<Prompt>;
}
