import React from 'react';
import { toast } from 'sonner';
import { render, screen } from '@/lib/test-utils';

import {
  PromptCard,
  type PromptCardProps,
} from '@/components/prompts/prompt-card';

import userEvent from '@testing-library/user-event';

const makeSut = ({ prompt }: PromptCardProps) => {
  return render(<PromptCard prompt={prompt} />);
};

const pushMock = jest.fn();
const deleteMock = jest.fn();
const refreshMock = jest.fn();

jest.mock('@/app/actions/prompt.actions', () => ({
  deletePromptAction: (id: string) => deleteMock(id),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    prefetch,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    prefetch?: boolean;
  }) => (
    <a
      href={href}
      {...props}
      onClick={(e) => {
        e.preventDefault();
        pushMock(href);
      }}
    >
      {children}
    </a>
  ),
}));

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

describe('PromptCard', () => {
  beforeEach(() => {
    deleteMock.mockReset();
    refreshMock.mockReset();
    (toast.error as jest.Mock).mockReset();
    (toast.success as jest.Mock).mockReset();
  });

  const user = userEvent.setup();
  const prompt = { id: '1', title: 'Title 01', content: 'Content 01' };

  it('should render link with `href` details', () => {
    makeSut({ prompt });

    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/${prompt.id}`);
  });
  it('should redirect when clicking the link on the card', async () => {
    makeSut({ prompt });

    const link = screen.getByRole('link');

    await user.click(link);

    expect(pushMock).toHaveBeenCalledWith(`/${prompt.id}`);
  });
  it('should display a dialog alert before removing the prompt', async () => {
    makeSut({ prompt });

    const deleteButton = screen.getByRole('button', {
      name: /Remover prompt/i,
    });

    await user.click(deleteButton);

    expect(screen.getByText('Remover prompt')).toBeInTheDocument();
  });
  it('should successfully remove the message and display the message', async () => {
    makeSut({ prompt });
    const messageSuccess = 'Prompt removido com sucesso!';
    deleteMock.mockResolvedValue({
      success: true,
      message: messageSuccess,
    });

    const deleteButton = screen.getByRole('button', {
      name: /Remover prompt/i,
    });

    await user.click(deleteButton);
    await user.click(screen.getByRole('button', { name: /confirmar/i }));

    expect(toast.success).toHaveBeenCalledWith(messageSuccess);
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });
  it('should display a message when an error accors or removal fails', async () => {
    makeSut({ prompt });
    const messageError = 'Falha ao remover o prompt!';
    deleteMock.mockResolvedValue({
      success: false,
      message: messageError,
    });

    const deleteButton = screen.getByRole('button', {
      name: /Remover prompt/i,
    });

    await user.click(deleteButton);
    await user.click(screen.getByRole('button', { name: /confirmar/i }));

    expect(toast.error).toHaveBeenCalledWith(messageError);
    expect(refreshMock).not.toHaveBeenCalled();
  });
  it('should display a message error when the action throws an exception', async () => {
    const messageError = 'Prompt não encontrado!';
    deleteMock.mockRejectedValueOnce(new Error(messageError));

    render(<PromptCard prompt={prompt} />);

    const deleteButton = screen.getByRole('button', {
      name: /Remover prompt/i,
    });

    await user.click(deleteButton);
    await user.click(screen.getByRole('button', { name: /confirmar/i }));

    expect(toast.error).toHaveBeenCalledWith(messageError);
    expect(refreshMock).not.toHaveBeenCalled();
  });
});
