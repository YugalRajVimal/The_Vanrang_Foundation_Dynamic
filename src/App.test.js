import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the site header/navigation', () => {
  render(<App />);
  const logo = screen.getByAltText(/vanrang foundation logo/i);
  expect(logo).toBeInTheDocument();
});
