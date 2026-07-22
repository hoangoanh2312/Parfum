import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('../src/models/journalSubscriber.model', () => ({
  JournalSubscriber: {
    findOneAndUpdate: vi.fn(),
  },
}));

import { JournalSubscriber } from '../src/models/journalSubscriber.model';
import { subscribeJournal } from '../src/services/blog.service';

describe('Journal newsletter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects invalid subscriber email', async () => {
    await expect(subscribeJournal('email-sai')).rejects.toMatchObject({ status: 400 });
    expect(JournalSubscriber.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('normalizes and upserts subscriber email', async () => {
    vi.mocked(JournalSubscriber.findOneAndUpdate).mockResolvedValueOnce({
      email: 'reader@example.com',
    } as any);

    const result = await subscribeJournal(' Reader@Example.COM ');

    expect(result).toEqual({
      email: 'reader@example.com',
      message: 'Da dang ky nhan journal',
    });
    expect(JournalSubscriber.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'reader@example.com' },
      expect.objectContaining({
        $set: { email: 'reader@example.com', isActive: true },
      }),
      expect.objectContaining({ upsert: true, new: true, runValidators: true }),
    );
  });
});
