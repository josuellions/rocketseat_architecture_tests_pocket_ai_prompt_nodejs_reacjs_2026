import { render, screen, waitFor } from '@/lib/test-utils';
import useEvent from '@testing-library/user-event';

import {
  SidebarContent,
  SidebarContentProps,
} from '@/components/sidebar/sidebar-content';

const pushMock = jest.fn();
jest.spyOn(console, 'log').mockImplementation(() => {});

let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    // push: jest.fn(),
    push: pushMock,
  }),
  useSearchParams: () => mockSearchParams,
}));

const initialPrompts = [
  {
    id: '1',
    title: 'Title 01',
    content: 'Content 01',
  },
  {
    id: '2',
    title: 'Title 02',
    content: 'Content 02',
  },
  {
    id: '3',
    title: 'Title 03',
    content: 'Content 03',
  },
];

const makeSut = (
  { prompts = initialPrompts }: SidebarContentProps = {} as SidebarContentProps
) => {
  return render(<SidebarContent prompts={prompts} />);
};

describe('SidebarContent', () => {
  const user = useEvent.setup();

  describe('aside structure', () => {
    it('should render a new prompt button', () => {
      makeSut();

      expect(screen.getByRole('complementary')).toBeVisible();
      expect(screen.getByRole('button', { name: 'Novo prompt' })).toBeVisible();
    });

    it('should render the list of prompts', () => {
      const inputPrompts = [
        {
          id: '1',
          title: 'Example title 01',
          content: 'Example Content 01',
        },
        {
          id: '2',
          title: 'Example title 02',
          content: 'Example Content 02',
        },
      ];

      makeSut({ prompts: inputPrompts });

      expect(screen.getByText(inputPrompts[0].title)).toBeInTheDocument();
      expect(screen.getByText(inputPrompts[0].content)).toBeInTheDocument();
      expect(screen.getAllByRole('paragraph')).toHaveLength(
        inputPrompts.length
      );
    });

    it('should render prompt search input', async () => {
      const text = 'Text search prompt AI';
      makeSut();

      const searchInput = screen.getByPlaceholderText('Buscar prompts...');

      await user.type(searchInput, text);

      expect(searchInput).toHaveValue(text);
    });
  });

  describe('collapse and expand', () => {
    it('should start expanded and display the minimize button', () => {
      makeSut();

      const aside = screen.getByRole('complementary');

      expect(aside).toBeVisible();

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      });

      expect(collapseButton).toBeVisible();

      const expandButton = screen.queryByRole('button', {
        name: /expandir sidebar/i,
      });

      expect(expandButton).not.toBeInTheDocument();
    });
    it('should expand when clicking the expand button', async () => {
      makeSut();
      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      });

      await user.click(collapseButton);

      const expandButton = screen.getByRole('button', {
        name: /expandir sidebar/i,
      });

      await user.click(expandButton);

      expect(
        screen.getByRole('button', { name: /minimizar sidebar/i })
      ).toBeVisible();
      expect(
        screen.getByRole('navigation', { name: /list prompts/i })
      ).toBeVisible();
    });
    it('should hide and show the expand button', async () => {
      makeSut();

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      });

      await user.click(collapseButton);

      const expandButton = screen.queryByRole('button', {
        name: /expandir sidebar/i,
      });

      expect(expandButton).toBeInTheDocument();
      expect(collapseButton).not.toBeInTheDocument();
    });
    it('should display a create new button prompt in the collapse sidebar', async () => {
      makeSut();

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      });

      await user.click(collapseButton);

      const newPromptButton = screen.getByRole('button', {
        name: /new prompt/i,
      });

      expect(newPromptButton).toBeVisible();
    });
    it('do not display prompt list in collapsed sidebar', async () => {
      makeSut();

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      });

      await user.click(collapseButton);

      const nav = screen.queryByRole('navigation', {
        name: /list prompts/i,
      });

      expect(nav).not.toBeInTheDocument();
    });
  });

  describe('new prompt', () => {
    it('should redirect to the new prompt screen', async () => {
      makeSut();
      const newButton = screen.getByRole('button', { name: 'Novo prompt' });

      await user.click(newButton);

      expect(pushMock).toHaveBeenCalledWith('/new');
    });
  });

  describe('search prompt', () => {
    it('should navigate using an encoded url when typing clear', async () => {
      const text = 'text busca prompt';
      makeSut();

      const searchInput = screen.getByPlaceholderText('Buscar prompts...');

      await user.type(searchInput, text);

      expect(pushMock).toHaveBeenCalled();

      const lastCall = pushMock.mock.calls.at(-1);

      expect(lastCall?.[0]).toBe('/?q=text%20busca%20prompt');

      await user.clear(searchInput);
      const lastClearCall = pushMock.mock.calls.at(-1);

      expect(lastClearCall?.[0]).toBe('/');
    });
    it('should submit the form by typing in the search field', async () => {
      const submitSpy = jest
        .spyOn(HTMLFormElement.prototype, 'requestSubmit')
        .mockImplementation(() => undefined);

      makeSut();

      const searchInput = screen.getByPlaceholderText('Buscar prompts...');

      await user.type(searchInput, 'AI');

      expect(submitSpy).toHaveBeenCalled();

      submitSpy.mockRestore();
    });
    it('should authomatically submit when assenbling a query when there is one', async () => {
      const submitSpy = jest
        .spyOn(HTMLFormElement.prototype, 'requestSubmit')
        .mockImplementation(() => undefined);

      const text = 'text test';
      const searchParams = new URLSearchParams(`q=${text}`);
      mockSearchParams = searchParams;
      makeSut();

      expect(submitSpy).toHaveBeenCalled();

      submitSpy.mockRestore();
    });
    it('shoud start with the search field using the search params', async () => {
      const text = 'initial';
      const searchParams = new URLSearchParams(`q=${text}`);
      mockSearchParams = searchParams;
      makeSut();

      const searchInput = screen.getByPlaceholderText('Buscar prompts...');

      await waitFor(() => {
        expect(searchInput).toHaveValue(text);
      });
    });
  });
});
