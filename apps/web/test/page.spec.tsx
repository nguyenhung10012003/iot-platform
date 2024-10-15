import { render } from '@testing-library/react';

import RootPage from '../app/[lang]/(dashboard)/page';

window.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => [],
  }),
);

describe('Root page', () => {
  const { container, unmount } = render(<RootPage />);

  it('should have the correct tree parent', () => {
    expect(container).toBeInstanceOf(HTMLDivElement);
  });

  afterAll(() => {
    unmount();
  });
});
