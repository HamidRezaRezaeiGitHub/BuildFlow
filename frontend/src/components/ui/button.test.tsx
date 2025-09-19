/**
 * Tests for Button component
 * 
 * Tests the Button UI component functionality, variants, and accessibility
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  test('Button_shouldRender_whenBasicPropsProvided', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test('Button_shouldCallOnClick_whenClicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button', { name: /click me/i }));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('Button_shouldApplyDefaultVariant_whenNoVariantProvided', () => {
    render(<Button>Default Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-primary-foreground');
  });

  test('Button_shouldApplyDestructiveVariant_whenDestructiveVariantProvided', () => {
    render(<Button variant="destructive">Delete</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('text-destructive-foreground');
  });

  test('Button_shouldApplyOutlineVariant_whenOutlineVariantProvided', () => {
    render(<Button variant="outline">Outline Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('border-input');
    expect(button).toHaveClass('bg-background');
  });

  test('Button_shouldApplySecondaryVariant_whenSecondaryVariantProvided', () => {
    render(<Button variant="secondary">Secondary</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary');
    expect(button).toHaveClass('text-secondary-foreground');
  });

  test('Button_shouldApplyGhostVariant_whenGhostVariantProvided', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-accent');
    expect(button).toHaveClass('hover:text-accent-foreground');
  });

  test('Button_shouldApplyLinkVariant_whenLinkVariantProvided', () => {
    render(<Button variant="link">Link Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-primary');
    expect(button).toHaveClass('underline-offset-4');
    expect(button).toHaveClass('hover:underline');
  });

  test('Button_shouldApplyDefaultSize_whenNoSizeProvided', () => {
    render(<Button>Default Size</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('py-2');
  });

  test('Button_shouldApplySmallSize_whenSmSizeProvided', () => {
    render(<Button size="sm">Small Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-9');
    expect(button).toHaveClass('px-3');
  });

  test('Button_shouldApplyLargeSize_whenLgSizeProvided', () => {
    render(<Button size="lg">Large Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-11');
    expect(button).toHaveClass('px-8');
  });

  test('Button_shouldApplyIconSize_whenIconSizeProvided', () => {
    render(<Button size="icon">🎯</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('w-10');
  });

  test('Button_shouldBeDisabled_whenDisabledPropProvided', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none');
    expect(button).toHaveClass('disabled:opacity-50');
  });

  test('Button_shouldNotCallOnClick_whenDisabledAndClicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('Button_shouldApplyCustomClassName_whenClassNameProvided', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  test('Button_shouldHaveProperAccessibility_whenRendered', () => {
    render(<Button>Accessible Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('focus-visible:outline-none');
    expect(button).toHaveClass('focus-visible:ring-2');
    expect(button).toHaveClass('focus-visible:ring-ring');
    expect(button).toHaveClass('focus-visible:ring-offset-2');
  });

  test('Button_shouldForwardRef_whenRefProvided', () => {
    const ref = jest.fn();
    
    render(<Button ref={ref}>Ref Button</Button>);
    
    expect(ref).toHaveBeenCalled();
  });

  test('Button_shouldAcceptType_whenTypeProvided', () => {
    render(<Button type="submit">Submit Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  test('Button_shouldCombineVariants_whenMultipleVariantsProvided', () => {
    render(<Button variant="outline" size="lg">Combined Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border'); // from outline
    expect(button).toHaveClass('h-11'); // from lg size
    expect(button).toHaveClass('px-8'); // from lg size
  });
});