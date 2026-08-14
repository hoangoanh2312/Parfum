import { afterEach, describe, expect, it, vi } from 'vitest';
import { GuestOrderLookup } from '../src/models/guestOrderLookup.model';
import { Order } from '../src/models/order.model';
import { Payment } from '../src/models/payment.model';
import * as mailer from '../src/utils/mailer';
import * as orderService from '../src/services/order.service';

afterEach(() => vi.restoreAllMocks());

describe('Guest order lookup OTP', () => {
  it('luu hash bi mat, co TTL cleanup va OTP het han sau 60 giay', async () => {
    expect((GuestOrderLookup.schema.path('lookupIdHash') as any).options.select).toBe(false);
    expect((GuestOrderLookup.schema.path('otpHash') as any).options.select).toBe(false);
    expect(
      GuestOrderLookup.schema
        .indexes()
        .some(([fields, options]) => fields.expiresAt === 1 && options.expireAfterSeconds === 0),
    ).toBe(true);
    expect(
      Order.schema
        .indexes()
        .some(
          ([fields]) =>
            fields['address.email'] === 1 &&
            fields['address.phone'] === 1 &&
            fields.createdAt === -1,
        ),
    ).toBe(true);

    vi.spyOn(GuestOrderLookup, 'findOne').mockReturnValue({
      sort: () => ({ select: () => ({ lean: async () => null }) }),
    } as any);
    vi.spyOn(GuestOrderLookup, 'countDocuments').mockResolvedValue(0 as any);
    vi.spyOn(GuestOrderLookup, 'updateMany').mockResolvedValue({ acknowledged: true } as any);
    vi.spyOn(Order, 'exists').mockResolvedValue({ _id: '507f1f77bcf86cd799439011' } as any);

    let created: any;
    vi.spyOn(GuestOrderLookup, 'create').mockImplementation(async (input: any) => {
      created = input;
      return { _id: '507f1f77bcf86cd799439012', ...input } as any;
    });
    vi.spyOn(mailer, 'sendMail').mockResolvedValue(true);

    const before = Date.now();
    const result = await orderService.requestGuestOrderLookupOtp(
      ' Customer@Example.com ',
      '0901234567',
    );

    expect(result.expiresIn).toBe(60);
    expect(result.message).toContain('Nếu email và số điện thoại khớp');
    expect(created.email).toBe('customer@example.com');
    expect(created.phone).toBe('0901234567');
    expect(created.otpHash).toMatch(/^[a-f\d]{64}$/);
    expect(created.lookupIdHash).toMatch(/^[a-f\d]{64}$/);
    expect(created).not.toHaveProperty('otp');
    expect(created.otpExpiresAt.getTime()).toBeGreaterThanOrEqual(before + 59_900);
    expect(created.otpExpiresAt.getTime()).toBeLessThanOrEqual(Date.now() + 60_000);
    expect(mailer.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'customer@example.com',
        text: expect.stringContaining('1 phút'),
      }),
    );
  });

  it('chi tra cac don khop dong thoi email va so dien thoai sau khi OTP dung', async () => {
    vi.spyOn(GuestOrderLookup, 'findOne').mockReturnValue({
      sort: () => ({ select: () => ({ lean: async () => null }) }),
    } as any);
    vi.spyOn(GuestOrderLookup, 'countDocuments').mockResolvedValue(0 as any);
    vi.spyOn(GuestOrderLookup, 'updateMany').mockResolvedValue({ acknowledged: true } as any);
    vi.spyOn(Order, 'exists').mockResolvedValue({ _id: '507f1f77bcf86cd799439011' } as any);

    let created: any;
    let sentOtp = '';
    vi.spyOn(GuestOrderLookup, 'create').mockImplementation(async (input: any) => {
      created = input;
      return { _id: '507f1f77bcf86cd799439012', ...input } as any;
    });
    vi.spyOn(mailer, 'sendMail').mockImplementation(async (input) => {
      sentOtp = input.subject.slice(0, 6);
      return true;
    });

    const requested = await orderService.requestGuestOrderLookupOtp(
      'customer@example.com',
      '0901234567',
    );
    expect(sentOtp).toMatch(/^\d{6}$/);

    vi.spyOn(GuestOrderLookup, 'findOneAndUpdate').mockReturnValue({
      select: async () => ({
        _id: '507f1f77bcf86cd799439012',
        otpHash: created.otpHash,
        matched: true,
        email: created.email,
        phone: created.phone,
        attempts: 1,
      }),
    } as any);
    vi.spyOn(GuestOrderLookup, 'updateOne').mockResolvedValue({ modifiedCount: 1 } as any);

    const leanOrders = vi.fn().mockResolvedValue([
      {
        _id: '507f1f77bcf86cd799439011',
        createdAt: new Date(),
        status: 'pending',
        total: 120000,
        items: [{ name: 'Nước hoa', volume: '10ml', price: 120000, quantity: 1 }],
        address: { email: created.email, phone: created.phone, fullName: 'Khách hàng' },
      },
    ]);
    const limit = vi.fn().mockReturnValue({ lean: leanOrders });
    const sort = vi.fn().mockReturnValue({ limit });
    const findOrders = vi.spyOn(Order, 'find').mockReturnValue({ sort } as any);
    vi.spyOn(Payment, 'find').mockReturnValue({ lean: async () => [] } as any);

    const result = await orderService.verifyGuestOrderLookupOtp(requested.lookupId, sentOtp);

    expect(findOrders).toHaveBeenCalledWith({
      'address.email': 'customer@example.com',
      'address.phone': '0901234567',
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ code: '439011', total: 120000 });
    expect(GuestOrderLookup.updateOne).toHaveBeenCalledWith(
      expect.objectContaining({ consumedAt: { $exists: false } }),
      expect.objectContaining({ $set: { consumedAt: expect.any(Date) } }),
    );
  });
});
