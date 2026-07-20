import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const spec = {
  openapi: '3.0.0',
  info: { title: 'HOC PARFUM API', version: '1.0.0' },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
  paths: {
    '/api/admin/orders': {
      get: {
        summary: 'Danh sách đơn hàng dành cho Admin',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1, default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 } },
          { in: 'query', name: 'search', schema: { type: 'string' } },
          { in: 'query', name: 'status', schema: { type: 'string', enum: ['pending', 'paid', 'shipping', 'done', 'cancelled'] } },
          { in: 'query', name: 'paymentStatus', schema: { type: 'string', enum: ['unpaid', 'paid'] } },
          { in: 'query', name: 'sort', schema: { type: 'string', enum: ['newest', 'oldest'], default: 'newest' } },
        ],
        responses: { '200': { description: 'Danh sách đơn hàng và thông tin phân trang' } },
      },
    },
    '/api/admin/orders/{orderId}': {
      get: {
        summary: 'Chi tiết đơn hàng dành cho Admin',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'orderId', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Chi tiết đơn hàng' }, '404': { description: 'Không tìm thấy đơn hàng' } },
      },
    },
    '/api/admin/orders/{orderId}/status': {
      patch: {
        summary: 'Cập nhật trạng thái đơn hàng',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'orderId', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['pending', 'paid', 'shipping', 'done', 'cancelled'] } } } } },
        },
        responses: { '200': { description: 'Đã cập nhật trạng thái đơn hàng' } },
      },
    },
    '/api/admin/orders/{orderId}/confirm-payment': {
      patch: {
        summary: 'Xác nhận thanh toán đơn hàng',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'orderId', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Đã xác nhận thanh toán đơn hàng' } },
      },
    },
  },
};

export function setupSwagger(app: Express) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
}
