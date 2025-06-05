const { AuthMiddleware } = require('../middleware/auth.middleware');
const { body, validationResult } = require('express-validator');

describe('Email Registration request body validator', () => {
  const mockRequest = (body: Record<string, unknown>) => ({ body });
  const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    (res as any).status = jest.fn().mockReturnValue(res);
    (res as any).json = jest.fn().mockReturnValue(res);
    return res;
  };
  const mockNext = jest.fn();

  it('Valid email and password', async () => {
    const req = mockRequest({
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateEmailRegistration) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledTimes(0);
  });

  it('Empty firstName', async () => {
    const req = mockRequest({
      email: 'test@example.com',
      password: 'Password123',
      firstName: '',
      lastName: 'Doe',
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateEmailRegistration) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([expect.objectContaining({ msg: 'First name is required' })]),
    });
  });

  it('Empty lastName', async () => {
    const req = mockRequest({
      email: 'test@example.com',
      password: 'Password123',
      firstName: 'John',
      lastName: '',
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateEmailRegistration) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([expect.objectContaining({ msg: 'Last name is required' })]),
    });
  });

  it('Empty email', async () => {
    const req = mockRequest({
      email: '',
      password: 'Password123',
      firstName: 'John',
      lastName: 'Doe',
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateEmailRegistration) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([expect.objectContaining({ msg: 'Valid email is required' })]),
    });
  });

  it('Invalid email', async () => {
    const req = mockRequest({
      email: 'invalid-email',
      password: 'Password123',
      firstName: 'John',
      lastName: 'Doe',
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateEmailRegistration) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([expect.objectContaining({ msg: 'Valid email is required' })]),
    });
  });

  it('Password without uppercase letter', async () => {
    const req = mockRequest({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateEmailRegistration) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({
          msg: 'Password must include at least one uppercase letter.',
        }),
      ]),
    });
  });

  it('Password without lowercase letter', async () => {
    const req = mockRequest({
      email: 'test@example.com',
      password: 'PASSWORD123',
      firstName: 'John',
      lastName: 'Doe',
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateEmailRegistration) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({
          msg: 'Password must include at least one lowercase letter.',
        }),
      ]),
    });
  });

  it('Password shorter than 8 characters', async () => {
    const req = mockRequest({
      email: 'test@example.com',
      password: 'Pass1',
      firstName: 'John',
      lastName: 'Doe',
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateEmailRegistration) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({
          msg: 'Password must be at least 8 characters long.',
        }),
      ]),
    });
  });
});

describe('Device Registration request body validator', () => {
  const mockRequest = (body: Record<string, unknown>) => ({ body });
  const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    (res as any).status = jest.fn().mockReturnValue(res);
    (res as any).json = jest.fn().mockReturnValue(res);
    return res;
  };
  const mockNext = jest.fn();

  it('Valid deviceId', async () => {
    const req = mockRequest({
      deviceId: '3f246742-f8bf-4972-a5d5-e2323963464f',
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateDeviceRegistration) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledTimes(0);
  });

  it('Null deviceId', async () => {
    const req = mockRequest({
      deviceId: null,
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateDeviceRegistration) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({ msg: 'Device ID must be a string' }),
      ]),
    });
  });

  it('Invalid deviceId', async () => {
    const req = mockRequest({
      deviceId: 15648956486,
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateDeviceRegistration) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({ msg: 'Device ID must be a string' }),
      ]),
    });
  });
});

describe('Login request body validator', () => {
  const mockRequest = (body: Record<string, unknown>) => ({ body });
  const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    (res as any).status = jest.fn().mockReturnValue(res);
    (res as any).json = jest.fn().mockReturnValue(res);
    return res;
  };
  const mockNext = jest.fn();

  it('Valid email & password combination', async () => {
    const req = mockRequest({
      email: 'test@example.com',
      password: 'P@ssword01',
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateLogin) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledTimes(0);
  });

  it('Valid deviceId', async () => {
    const req = mockRequest({
      deviceId: '6b6549bf-338a-4e9a-98be-506e910c9f3c',
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateLogin) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledTimes(0);
  });

  it('Missing email', async () => {
    const req = mockRequest({
      password: 'P@ssword01',
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateLogin) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({ msg: 'Either email/password or deviceId must be provided' }),
      ]),
    });
  });

  it('Missing password', async () => {
    const req = mockRequest({
      email: 'test@example.com',
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateLogin) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({ msg: 'Either email/password or deviceId must be provided' }),
      ]),
    });
  });

  it('Missing deviceId', async () => {
    const req = mockRequest({
      deviceId: '',
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateLogin) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({ msg: 'Either email/password or deviceId must be provided' }),
      ]),
    });
  });

  it('Invalid email', async () => {
    const req = mockRequest({
      email: 'testexample.com',
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateLogin) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({ msg: 'Either email/password or deviceId must be provided' }),
      ]),
    });
  });

  it('Password is empty string', async () => {
    const req = mockRequest({
      email: 'test@example.com',
      password: '   ', // only whitespace
    });
    const res = mockResponse();

    for (const middleware of AuthMiddleware.validateLogin) {
      await middleware(req, res, mockNext);
    }

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([expect.objectContaining({ msg: 'Password is required' })]),
    });
  });

  it('DeviceId is not a string', async () => {
    const req = mockRequest({
      deviceId: 12345, // invalid type
    });
    const res = mockResponse();

    for (const middleware of AuthMiddleware.validateLogin) {
      await middleware(req, res, mockNext);
    }

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({ msg: 'Device ID must be a string' }),
      ]),
    });
  });

  it('Invalid email format with valid password', async () => {
    const req = mockRequest({
      email: 'invalid-email-format',
      password: 'validPass123',
    });
    const res = mockResponse();

    for (const middleware of AuthMiddleware.validateLogin) {
      await middleware(req, res, mockNext);
    }

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({
          msg: 'Valid email is required when logging in with email/password',
        }),
      ]),
    });
  });

  it('Email, password, and deviceId all present', async () => {
    const req = mockRequest({
      email: 'test@example.com',
      password: 'P@ssword01',
      deviceId: 'device-abc',
    });
    const res = mockResponse();

    for (const middleware of AuthMiddleware.validateLogin) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe('Refresh token request body validator', () => {
  const mockRequest = (body: Record<string, unknown>) => ({ body });
  const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    (res as any).status = jest.fn().mockReturnValue(res);
    (res as any).json = jest.fn().mockReturnValue(res);
    return res;
  };
  const mockNext = jest.fn();

  it('valid refreshToken', async () => {
    const req = mockRequest({
      refreshToken: 'abc123',
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateRefreshToken) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledTimes(0);
  });

  it('Missing refreshToken', async () => {
    const req = mockRequest({});
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateRefreshToken) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({ msg: 'Refresh token is required' }),
      ]),
    });
  });

  it('Empty string refreshToken', async () => {
    const req = mockRequest({
      refreshToken: '',
    });
    const res = mockResponse();

    // Run each middleware in the array
    for (const middleware of AuthMiddleware.validateRefreshToken) {
      await middleware(req, res, mockNext);
    }

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({ msg: 'Refresh token is required' }),
      ]),
    });
  });
});
