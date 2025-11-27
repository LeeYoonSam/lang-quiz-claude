import React from 'react';
import { render, screen } from '@testing-library/react';
import LearnProgress from '../LearnProgress';

describe('LearnProgress Component', () => {
  it('should display progress text correctly', () => {
    render(<LearnProgress current={5} total={20} />);

    expect(screen.getByText('5 / 20')).toBeInTheDocument();
  });

  it('should display progress at 1 of 1', () => {
    render(<LearnProgress current={1} total={1} />);

    expect(screen.getByText('1 / 1')).toBeInTheDocument();
  });

  it('should display progress at first card', () => {
    render(<LearnProgress current={1} total={10} />);

    expect(screen.getByText('1 / 10')).toBeInTheDocument();
  });

  it('should display progress at last card', () => {
    render(<LearnProgress current={10} total={10} />);

    expect(screen.getByText('10 / 10')).toBeInTheDocument();
  });

  it('should calculate percentage correctly for progress bar', () => {
    const { container } = render(<LearnProgress current={5} total={10} />);

    // Progress bar should be 50%
    const progressBar = container.querySelector('[data-testid="progress-bar"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should show 0% progress at start', () => {
    const { container } = render(<LearnProgress current={0} total={10} />);

    const progressBar = container.querySelector('[data-testid="progress-bar"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should have accessibility label', () => {
    render(<LearnProgress current={5} total={20} />);

    const container = screen.getByRole('region');
    expect(container).toHaveAttribute('aria-label');
  });

  it('should update progress when props change', () => {
    const { rerender } = render(<LearnProgress current={5} total={20} />);

    expect(screen.getByText('5 / 20')).toBeInTheDocument();

    rerender(<LearnProgress current={10} total={20} />);

    expect(screen.getByText('10 / 20')).toBeInTheDocument();
  });

  it('should display full width bar at last card', () => {
    const { container } = render(<LearnProgress current={20} total={20} />);

    const progressBar = container.querySelector('[data-testid="progress-bar"]');
    expect(progressBar).toBeInTheDocument();
  });
});
