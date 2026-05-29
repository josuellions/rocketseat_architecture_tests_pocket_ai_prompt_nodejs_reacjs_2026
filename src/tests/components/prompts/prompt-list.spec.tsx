import { PromptList, type PromptListProps } from '@/components/prompts';
import { render, screen } from '@/lib/test-utils';

const makeSut = ({ prompts }: PromptListProps) => {
  return render(<PromptList prompts={prompts} />);
};

describe('PromptList', () => {
  it('should render the list of prompts', async () => {
    const prompts = [
      { id: '1', title: 'Title 01', content: 'Content 01' },
      { id: '2', title: 'Title 02', content: 'Content 02' },
      { id: '3', title: 'Title 03', content: 'Content 03' },
    ];

    makeSut({ prompts });

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText(prompts[0].title)).toBeInTheDocument();
    expect(screen.getByText(prompts[1].title)).toBeInTheDocument();
    expect(screen.getByText(prompts[2].title)).toBeInTheDocument();
  });
  it('should render ab empty list when the array prompt is empty ', async () => {
    const prompts = [] as PromptListProps['prompts'];

    makeSut({ prompts });

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
