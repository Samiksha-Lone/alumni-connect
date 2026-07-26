import { render, screen } from '@testing-library/react';
import DashboardPanel from '../components/common/DashboardPanel';
import FormField from '../components/common/FormField';

describe('shared dashboard and form components', () => {
  it('renders a dashboard panel with title, subtitle, and action content', () => {
    render(
      <DashboardPanel
        title="Overview"
        subtitle="Key metrics"
        action={<button type="button">Refresh</button>}
      >
        <div>Panel contents</div>
      </DashboardPanel>
    );

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Key metrics')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
    expect(screen.getByText('Panel contents')).toBeInTheDocument();
  });

  it('renders a labeled textarea field for longer form values', () => {
    render(
      <FormField
        id="bio"
        name="bio"
        label="Bio"
        value="Hello world"
        onChange={() => {}}
        textarea
      />
    );

    const field = screen.getByLabelText('Bio');
    expect(field).toBeInTheDocument();
    expect(field.tagName).toBe('TEXTAREA');
  });
});
