import {
  PromptCard,
  type PromptCardProps,
} from '@/components/prompts/prompt-card';
import { render, screen } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';
import React from 'react';

const makeSut = ({ prompt }: PromptCardProps) => {
  return render(<PromptCard prompt={prompt} />);
};

const pushMock = jest.fn();

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

describe('PromptCard', () => {
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
});
