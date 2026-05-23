import { render, screen } from '@/lib/test-utils';
import useEvent from '@testing-library/user-event';

import {
  SidebarContent,
  SidebarContentProps,
} from '@/components/sidebar/sidebar-content';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    // push: jest.fn(),
    push: pushMock,
  }),
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
        inputPrompts.length * 2
      );
    });

    it.only('should render prompt search input', async () => {
      const text = 'Text search prompt AI';
      makeSut();

      const searchInput = screen.getByPlaceholderText('Buscar prompts...');

      await user.type(searchInput, text);

      expect(searchInput).toHaveValue(text);
    });
  });

  describe('colapsar and expadir', () => {
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
    it('must hide and show the expand button', async () => {
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
  });

  describe('new prompt', () => {
    it('should redirect to the new prompt screen', async () => {
      makeSut();
      const newButton = screen.getByRole('button', { name: 'Novo prompt' });

      await user.click(newButton);

      expect(pushMock).toHaveBeenCalledWith('/new');
    });
  });
});
