import { CreatePromptDTO } from '@/core/application/prompts/create-prompt.dto';
import { Prompt } from '@/core/domain/prompts/prompt.entity';
import { PromptRepository } from '@/core/domain/prompts/prompts.repository';
import { PrismaClient } from '@/generated/prisma/client';

export class PrismaPromptRepository implements PromptRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreatePromptDTO): Promise<void> {
    await this.prisma.prompt.create({
      data: {
        title: data.title,
        content: data.content,
      },
    });
  }

  async update(id: string, data: Partial<CreatePromptDTO>): Promise<Prompt> {
    const updated = await this.prisma.prompt.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.content !== undefined ? { content: data.content } : {}),
      },
    });

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.prompt.delete({
      where: {
        id,
      },
    });
  }

  async findById(id: string): Promise<Prompt | null> {
    const prompt = await this.prisma.prompt.findUnique({
      where: {
        id,
      },
    });

    return prompt;
  }

  async findMany(): Promise<Prompt[]> {
    const prompts = await this.prisma.prompt.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return prompts;
  }

  async findByTitle(title: string): Promise<Prompt | null> {
    const prompt = await this.prisma.prompt.findFirst({
      where: { title },
    });

    return prompt;
  }

  async searchMany(term?: string): Promise<Prompt[]> {
    const query = term?.trim() ?? '';

    const prompts = await this.prisma.prompt.findMany({
      where: query
        ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return prompts;
  }
}
