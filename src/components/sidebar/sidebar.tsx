import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { PrismaPromptRepository } from '@/infra/repository/prisma-prompts.repository';

import { Spinner } from '@/components/ui/spinner';
import { SidebarContent } from './sidebar-content';
import { PromptSummary } from '@/core/domain/prompts/prompt.entity';

export const Sidebar = async () => {
  const repostory = new PrismaPromptRepository(prisma);
  let initialPrompts: PromptSummary[] = [] as PromptSummary[];

  try {
    initialPrompts = await repostory.findMany();
  } catch (error) {
    console.log(error);
    initialPrompts = [];
  }

  return (
    <Suspense fallback={<Spinner />}>
      <SidebarContent prompts={initialPrompts} />
    </Suspense>
  );
};
