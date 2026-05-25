'use client';

import React, {
  startTransition,
  useActionState,
  useRef,
  useState,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeftToLine,
  X as CloseIcon,
  Plus as AddIcon,
  ArrowRightToLine,
} from 'lucide-react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Logo } from '../logo';

import { PromptSummary } from '@/core/domain/prompts/prompt.entity';
import { PromptList } from '../ui/prompts';
import { searchPromptAction } from '@/app/actions/prompt.action';
import { Spinner } from '../ui/spinner';

export type SidebarContentProps = {
  prompts: PromptSummary[];
};

export const SidebarContent = ({ prompts }: SidebarContentProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const [searchState, searchAction, isPending] = useActionState(
    searchPromptAction,
    {
      success: true,
      prompts,
    }
  );

  const hasQuery = query.trim().length > 0;
  const promptList = hasQuery ? (searchState.prompts ?? prompts) : prompts;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const collapsedSidebar = () => setIsCollapsed(true);
  const expandSidebar = () => setIsCollapsed(false);

  const formRef = useRef<HTMLFormElement | null>(null);

  const handleNewPrompt = () => {
    console.log('>>NEW PROMPT');
    router.push('/new');
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    startTransition(() => {
      const url = newQuery ? `/?q=${encodeURIComponent(newQuery)}` : '/';

      router.push(url, { scroll: false });
      formRef.current?.requestSubmit();
    });
  };
  return (
    <aside
      className={`border-r border-gray-700 flex flex-col h-full bg-gray-800 
        transition-[transform, width] duration-300 ease-in-out fixed md:relative left-0 top-0 z-50 md:z-auto w-[80vw] sm:w-[320px] ${isCollapsed ? 'md:w-[72px]' : 'md:w-[384px]'} `}
    >
      {isCollapsed && (
        <section className="px-2 py-6">
          <header className="flex item-center justfy-center mb-6">
            <Button
              onClick={expandSidebar}
              variant="icon"
              title="Expandir sidebar"
              aria-label="Expandir sidebar"
              className="hidden md:inline-flex p-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-500 rounded-lg transition-colors"
            >
              <ArrowRightToLine className="w-5 h-5 text-gray-500" />
            </Button>
          </header>

          <div className="flex flex-col items-center space-y-4">
            <Button
              size="lg"
              title="New prompt"
              aria-label="New prompt"
              className="w-full"
              onClick={handleNewPrompt}
            >
              <AddIcon className="w-5 h-5" />
            </Button>
          </div>
        </section>
      )}

      {!isCollapsed && (
        <>
          <section className="p-6">
            <div className="md:hidden mb-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="icon"
                  aria-label="Fechar menu"
                  title="Fechar menu"
                >
                  <CloseIcon className="w-5 h-5 text-gray-100" />
                </Button>
              </div>
            </div>
            <div className="flex w-full items-center justify-between mb-6">
              <header className="flex w-full items-center justify-between">
                <Logo />
                <Button
                  onClick={collapsedSidebar}
                  variant="secondary"
                  aria-label="Minimizar sidebar"
                  title="Minimizar sidebar"
                  className="hidden md:inline-flex p-2 hover:bg-gray-700 focus:outline-nome focus:ring-2 focus:ring-accent-500 rounded-lg transition-colors"
                >
                  <ArrowLeftToLine className="w-5 h-5 text-gray-100" />
                </Button>
              </header>
            </div>

            <section className="mb-5">
              <form
                ref={formRef}
                action={searchAction}
                className="relative group w-full"
              >
                <Input
                  type="text"
                  autoFocus
                  //name="search-prompts"
                  name="query"
                  placeholder="Buscar prompts..."
                  onChange={handleQueryChange}
                  value={query}
                />
                {isPending && (
                  <div
                    title="Carregando prompts"
                    aria-label="Carregando prompts"
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex  items-center gap-2"
                  >
                    <Spinner />
                    <span className="text-xs">Carregando...</span>
                  </div>
                )}
              </form>
            </section>

            <div className="">
              <Button size="lg" className="w-full" onClick={handleNewPrompt}>
                <AddIcon className="w-5 h-5 mr-2" />
                Novo prompt
              </Button>
            </div>
          </section>

          <nav
            aria-label="List prompts"
            className="flex-1 overflow-auto px-6 pb-6"
          >
            <PromptList prompts={promptList} />
          </nav>
        </>
      )}
    </aside>
  );
};
