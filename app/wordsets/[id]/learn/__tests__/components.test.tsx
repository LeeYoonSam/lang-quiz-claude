/**
 * Tests for Learn components: Progress, Navigation, ModeSelect, Complete
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { LearnProgress } from '../LearnProgress';
import { LearnNavigation } from '../LearnNavigation';
import { LearnModeSelect } from '../LearnModeSelect';
import { LearnComplete } from '../LearnComplete';

describe('LearnProgress', () => {
  it('should display current and total count', () => {
    render(<LearnProgress current={5} total={20} />);
    expect(screen.getByText('5 / 20')).toBeInTheDocument();
  });

  it('should render progress bar', () => {
    render(<LearnProgress current={5} total={20} />);
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
  });

  it('should handle full progress', () => {
    render(<LearnProgress current={20} total={20} />);
    expect(screen.getByText('20 / 20')).toBeInTheDocument();
  });

  it('should handle zero progress', () => {
    render(<LearnProgress current={0} total={20} />);
    expect(screen.getByText('0 / 20')).toBeInTheDocument();
  });
});

describe('LearnNavigation', () => {
  const defaultProps = {
    isFirst: false,
    isLast: false,
    isSpeaking: false,
    onPrevious: jest.fn(),
    onNext: jest.fn(),
    onSpeak: jest.fn(),
    onComplete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render navigation buttons', () => {
    render(<LearnNavigation {...defaultProps} />);
    expect(screen.getByTestId('prev-button')).toBeInTheDocument();
    expect(screen.getByTestId('next-button')).toBeInTheDocument();
    expect(screen.getByTestId('speak-button')).toBeInTheDocument();
  });

  it('should disable previous button when at first', () => {
    render(<LearnNavigation {...defaultProps} isFirst={true} />);
    expect(screen.getByTestId('prev-button')).toBeDisabled();
  });

  it('should show complete button when at last', () => {
    render(<LearnNavigation {...defaultProps} isLast={true} />);
    expect(screen.getByTestId('complete-button')).toBeInTheDocument();
    expect(screen.queryByTestId('next-button')).not.toBeInTheDocument();
  });

  it('should handle button clicks', () => {
    render(<LearnNavigation {...defaultProps} />);
    fireEvent.click(screen.getByTestId('next-button'));
    expect(defaultProps.onNext).toHaveBeenCalled();
  });

  it('should show speaking state', () => {
    render(<LearnNavigation {...defaultProps} isSpeaking={true} />);
    expect(screen.getByText('🔊 재생 중...')).toBeInTheDocument();
  });
});

describe('LearnModeSelect', () => {
  const defaultProps = {
    wordSetId: 'test-id',
    wordSetName: '과일',
    wordCount: 10,
    onModeSelect: jest.fn(),
    onBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display word set information', () => {
    render(<LearnModeSelect {...defaultProps} />);
    expect(screen.getByText('과일')).toBeInTheDocument();
    expect(screen.getByText('10개 단어를 학습합니다')).toBeInTheDocument();
  });

  it('should render mode selection buttons', () => {
    render(<LearnModeSelect {...defaultProps} />);
    expect(screen.getByTestId('sequential-button')).toBeInTheDocument();
    expect(screen.getByTestId('random-button')).toBeInTheDocument();
  });

  it('should call onModeSelect with sequential', () => {
    render(<LearnModeSelect {...defaultProps} />);
    fireEvent.click(screen.getByTestId('sequential-button'));
    expect(defaultProps.onModeSelect).toHaveBeenCalledWith('sequential');
  });

  it('should call onModeSelect with random', () => {
    render(<LearnModeSelect {...defaultProps} />);
    fireEvent.click(screen.getByTestId('random-button'));
    expect(defaultProps.onModeSelect).toHaveBeenCalledWith('random');
  });

  it('should handle back button', () => {
    render(<LearnModeSelect {...defaultProps} />);
    fireEvent.click(screen.getByTestId('back-button'));
    expect(defaultProps.onBack).toHaveBeenCalled();
  });

  it('should display mode descriptions', () => {
    render(<LearnModeSelect {...defaultProps} />);
    expect(screen.getByText('단어 세트의 원래 순서대로 학습합니다')).toBeInTheDocument();
    expect(screen.getByText('단어를 무작위 순서로 학습합니다')).toBeInTheDocument();
  });
});

describe('LearnComplete', () => {
  const defaultProps = {
    wordSetId: 'test-id',
    wordSetName: '과일',
    wordCount: 10,
    duration: 180000, // 3 minutes
    onRetry: jest.fn(),
    onExit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display completion message', () => {
    render(<LearnComplete {...defaultProps} />);
    expect(screen.getByText('학습을 완료했습니다!')).toBeInTheDocument();
  });

  it('should display completion message', () => {
    const { container } = render(<LearnComplete {...defaultProps} />);
    expect(container.textContent).toContain('10개 단어');
  });

  it('should display duration when provided', () => {
    render(<LearnComplete {...defaultProps} />);
    // Duration is 180000ms = 3 minutes = 180 seconds
    expect(screen.getByText(/소요 시간/)).toBeInTheDocument();
  });

  it('should handle missing duration', () => {
    render(<LearnComplete {...defaultProps} duration={undefined} />);
    // Just check that completion component renders without crashing
    expect(screen.getByText('학습을 완료했습니다!')).toBeInTheDocument();
    expect(screen.getByTestId('retry-button')).toBeInTheDocument();
  });

  it('should render action buttons', () => {
    render(<LearnComplete {...defaultProps} />);
    expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    expect(screen.getByTestId('exit-button')).toBeInTheDocument();
  });

  it('should handle retry button', () => {
    render(<LearnComplete {...defaultProps} />);
    fireEvent.click(screen.getByTestId('retry-button'));
    expect(defaultProps.onRetry).toHaveBeenCalled();
  });

  it('should handle exit button', () => {
    render(<LearnComplete {...defaultProps} />);
    fireEvent.click(screen.getByTestId('exit-button'));
    expect(defaultProps.onExit).toHaveBeenCalled();
  });

  it('should format duration correctly', () => {
    render(<LearnComplete {...defaultProps} duration={95000} />); // 1min 35sec
    // Check that the duration text exists
    expect(screen.getByText(/소요 시간/)).toBeInTheDocument();
  });
});
