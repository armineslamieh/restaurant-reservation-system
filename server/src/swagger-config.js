const version = process.env.APP_VERSION || '1.0.0'

export const swaggerSpec = {
    openapi: '3.0.3',
    info: {
        title: 'Web Advanced API',
        version
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
        },
        schemas: {
            User: { type: 'object', properties: { id: { type: 'string' }, email: { type: 'string' }, name: { type: 'string' }, active: { type: 'boolean' }, roles: { type: 'array', items: { type: 'string' } } } },
            Table: { type: 'object', properties: { id: { type: 'string' }, slug: { type: 'string' }, name: { type: 'string' }, capacity: { type: 'integer' }, location: { type: 'string' }, active: { type: 'boolean' } } },
            TimeSlot: { type: 'object', properties: { id: { type: 'string' }, start: { type: 'string' }, end: { type: 'string' } } },
            Reservation: { type: 'object', properties: { id: { type: 'string' }, status: { type: 'string' }, partySize: { type: 'integer' }, timeSlotId: { type: 'string' } } },
            Error: { type: 'object', properties: { message: { type: 'string' } } }
        }
    },
    security: [{ bearerAuth: [] }],
    paths: {
        '/auth/register': { post: { tags: ['auth'], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email','password','name'], properties: { email: { type: 'string' }, password: { type: 'string' }, name: { type: 'string' } } } } } }, responses: { '201': { description: 'created' }, '400': { description: 'bad request' } } } },
        '/auth/login': { post: { tags: ['auth'], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email','password'], properties: { email: { type: 'string' }, password: { type: 'string' } } } } } }, responses: { '200': { description: 'ok' }, '401': { description: 'unauthorized' } } } },
        '/me': { put: { tags: ['users'], security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, password: { type: 'string' } } } } } }, responses: { '200': { description: 'ok' }, '400': { description: 'bad request' }, '401': { description: 'unauthenticated' } } } },
        '/items': { get: { tags: ['items'], parameters: [{ name: 'q', in: 'query', schema: { type: 'string' } }, { name: 'minCapacity', in: 'query', schema: { type: 'integer' } }, { name: 'sort', in: 'query', schema: { type: 'string' } }, { name: 'order', in: 'query', schema: { type: 'string' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }, { name: 'offset', in: 'query', schema: { type: 'integer' } }], responses: { '200': { description: 'ok' } } } },
        '/items/{id}/timeslots': { get: { tags: ['items'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'ok' } } } },
        '/reservations': { post: { tags: ['reservations'], security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['tableIds','timeSlotId','partySize'], properties: { tableIds: { type: 'array', items: { type: 'string' } }, timeSlotId: { type: 'string' }, partySize: { type: 'integer' }, notes: { type: 'string' } } } } } }, responses: { '201': { description: 'created' }, '400': { description: 'bad request' }, '409': { description: 'conflict' } } } },
        '/reservations/{id}': { delete: { tags: ['reservations'], security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '204': { description: 'deleted' }, '403': { description: 'forbidden' } } }, get: { tags: ['reservations'], security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'ok' }, '404': { description: 'not found' } } } },
        '/me/reservations': { get: { tags: ['reservations'], security: [{ bearerAuth: [] }], responses: { '200': { description: 'ok' }, '401': { description: 'unauthenticated' } } } },
        '/admin/users': { get: { tags: ['admin'], security: [{ bearerAuth: [] }], parameters: [{ name: 'q', in: 'query', schema: { type: 'string' } }], responses: { '200': { description: 'ok' } } } },
        '/admin/users/{id}': { get: { tags: ['admin'], security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'ok' }, '404': { description: 'not found' } } } },
        '/admin/users/{id}/active': { patch: { tags: ['admin'], security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['active'], properties: { active: { type: 'boolean' } } } } } }, responses: { '200': { description: 'ok' }, '404': { description: 'not found' } } } },
        '/admin/tables': { get: { tags: ['admin'], security: [{ bearerAuth: [] }], responses: { '200': { description: 'ok' } } }, post: { tags: ['admin'], security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name','capacity'], properties: { name: { type: 'string' }, capacity: { type: 'integer' }, location: { type: 'string' } } } } } }, responses: { '201': { description: 'created' } } } },
        '/admin/tables/{id}': { get: { tags: ['admin'], security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'ok' }, '404': { description: 'not found' } } }, patch: { tags: ['admin'], security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } }, responses: { '200': { description: 'ok' }, '404': { description: 'not found' } } } },
        '/admin/reservations': { get: { tags: ['admin'], security: [{ bearerAuth: [] }], parameters: [{ name: 'userId', in: 'query', schema: { type: 'string' } }, { name: 'itemId', in: 'query', schema: { type: 'string' } }, { name: 'status', in: 'query', schema: { type: 'string' } }, { name: 'sort', in: 'query', schema: { type: 'string' } }, { name: 'order', in: 'query', schema: { type: 'string' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }, { name: 'offset', in: 'query', schema: { type: 'integer' } }], responses: { '200': { description: 'ok' } } } },
        '/admin/settings': { get: { tags: ['admin'], security: [{ bearerAuth: [] }], responses: { '200': { description: 'ok' } } }, put: { tags: ['admin'], security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } }, responses: { '200': { description: 'ok' } } } }
    }
}
