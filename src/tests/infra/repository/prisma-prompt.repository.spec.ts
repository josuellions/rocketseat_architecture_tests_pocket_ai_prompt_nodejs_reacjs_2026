import { PrismaClient } from '@/generated/prisma/client';
import { Prompt } from '@/core/domain/prompts/prompt.entity';
import { CreatePromptDTO } from '@/core/application/prompts/create-prompt.dto';
import { UpdatePromptDTO } from '@/core/application/prompts/update-prompt.dto';
import { PrismaPromptRepository } from '@/infra/repository/prisma-prompts.repository';

type PromptDelegateMock = {
  create: jest.MockedFunction<
    (args: { data: CreatePromptDTO }) => Promise<void>
  >;
  update: jest.MockedFunction<
    (args: { where: { id: string }; data: UpdatePromptDTO }) => Promise<Prompt>
  >;
  delete: jest.MockedFunction<
    (args: { where: { id: string } }) => Promise<void>
  >;
  findUnique: jest.MockedFunction<
    (args: { where: { id: string } }) => Promise<Prompt | null>
  >;
  findFirst: jest.MockedFunction<
    (args: {
      where: { title: string };
    }) => Promise<Pick<Prompt, 'id' | 'title' | 'content'> | null>
  >;
  findMany: jest.MockedFunction<
    (args: {
      orderBy?: { createdAt: 'asc' | 'desc' };
      where?: {
        OR: Array<{
          title?: { contains: string; mode: 'insensitive' };
          content?: { contains: string; mode: 'insensitive' };
        }>;
      };
    }) => Promise<Prompt[]>
  >;
};

type PrismaMock = {
  prompt: PromptDelegateMock;
};

function createMockPrisma() {
  const mock: PrismaMock = {
    prompt: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  return mock as unknown as PrismaClient & PrismaMock;
}

describe('PrismaPromptRepository', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let repository: PrismaPromptRepository;

  beforeEach(() => {
    prisma = createMockPrisma();
    repository = new PrismaPromptRepository(prisma);
  });

  describe('create', () => {
    it('should use the create method with the correct data', async () => {
      const input = {
        title: 'Title create 01',
        content: 'Content create 01',
      };

      await repository.create(input);

      expect(prisma.prompt.create).toHaveBeenCalledWith({
        data: input,
      });
    });
  });
  describe('update', () => {
    it('should use the update method with the correct data', async () => {
      const now = new Date();
      const input = {
        id: '1',
        title: 'Title update 01',
        content: 'Content update 01',
        createdAt: now,
        updatedAt: now,
      };

      prisma.prompt.update.mockResolvedValue(input);

      const result = await repository.update(input.id, {
        title: input.title,
        content: input.content,
      });

      expect(result).toEqual(input);
      expect(prisma.prompt.update).toHaveBeenCalledWith({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          content: input.content,
        },
      });
    });
    it('should use the update method only for the title field', async () => {
      const now = new Date();
      const input = {
        id: '1',
        title: 'Title update 01',
        content: '',
        createdAt: now,
        updatedAt: now,
      };

      prisma.prompt.update.mockResolvedValue(input);

      await repository.update(input.id, {
        title: input.title,
      });

      const call = prisma.prompt.update.mock.calls[0][0];

      expect(call.where).toEqual({ id: input.id });
      expect(call.data).toEqual({ title: input.title });
      expect('content' in call.data).toBe(false);
    });
    it('should use the update method only for the content field', async () => {
      const now = new Date();
      const input = {
        id: '1',
        title: '',
        content: 'Content update 01',
        createdAt: now,
        updatedAt: now,
      };

      prisma.prompt.update.mockResolvedValue(input);

      await repository.update(input.id, {
        content: input.content,
      });

      const call = prisma.prompt.update.mock.calls[0][0];

      expect(call.where).toEqual({ id: input.id });
      expect(call.data).toEqual({ content: input.content });
      expect('title' in call.data).toBe(false);
    });
  });
  describe('delete', () => {
    it('should use the delete method with the correct data', async () => {
      const promptId = '1';

      await repository.delete(promptId);

      expect(prisma.prompt.delete).toHaveBeenCalledWith({
        where: { id: promptId },
      });
    });
  });
  describe('findById', () => {
    it('should return a prompt when it exists', async () => {
      const dateNow = new Date();
      const input = {
        id: '1',
        title: 'Title 01',
        content: 'Content 01',
        createdAt: dateNow,
        updatedAt: dateNow,
      };

      prisma.prompt.findUnique.mockResolvedValue(input);

      const results = await repository.findById(input.id);

      expect(prisma.prompt.findUnique).toHaveBeenCalledWith({
        where: {
          id: input.id,
        },
      });
      expect(results).toMatchObject(input);
    });
    it('should return null a prompt does not exists', async () => {
      prisma.prompt.findUnique.mockResolvedValue(null);

      const results = await repository.findById('null');

      expect(results).toBeNull();
    });
  });
  describe('findMany', () => {
    it('should sort by createdAt desc and map the results', async () => {
      const dateNow = new Date();
      const input = [
        {
          id: '1',
          title: 'Title 01',
          content: 'Content 01',
          createdAt: dateNow,
          updatedAt: dateNow,
        },
        {
          id: '2',
          title: 'Title 02',
          content: 'Content 02',
          createdAt: dateNow,
          updatedAt: dateNow,
        },
      ];

      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.findMany();

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(results).toMatchObject(input);
    });
  });
  describe('searchMany', () => {
    it('should search for an empty term and not send the WHERE clause', async () => {
      const dateNow = new Date();
      const input = [
        {
          id: '1',
          title: 'Title 01',
          content: 'Content 01',
          createdAt: dateNow,
          updatedAt: dateNow,
        },
      ];

      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.searchMany(' ');

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(results).toMatchObject(input);
    });
    it('should search by term and populate OR in WHERE clause', async () => {
      const dateNow = new Date();
      const input = [
        {
          id: '1',
          title: 'Title 01',
          content: 'Content 01',
          createdAt: dateNow,
          updatedAt: dateNow,
        },
      ];

      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.searchMany(' title 01 ');

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            {
              title: {
                contains: 'title 01',
                mode: 'insensitive',
              },
            },
            {
              content: {
                contains: 'title 01',
                mode: 'insensitive',
              },
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(results).toMatchObject(input);
    });
    it('should accept the term undefined and not send the where clause', async () => {
      const now = new Date();
      const input = [
        {
          id: '1',
          title: 'Title 01',
          content: 'Content 01',
          createdAt: now,
          updatedAt: now,
        },
      ];
      prisma.prompt.findMany.mockResolvedValue(input);

      const results = await repository.searchMany(undefined);

      expect(prisma.prompt.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { createdAt: 'desc' },
      });
      expect(results).toMatchObject(input);
    });
  });
  describe('findByTitle', () => {
    it('should use the `findByTitle` method if the title already exists', async () => {
      const input = {
        id: '1',
        title: 'Title create exist',
        content: 'Content create title exist',
      };

      prisma.prompt.findFirst.mockResolvedValue(input);

      const result = await repository.findByTitle(input.title);

      expect(prisma.prompt.findFirst).toHaveBeenCalledWith({
        where: { title: input.title },
      });
      expect(result).toEqual(input);
    });
  });
});
