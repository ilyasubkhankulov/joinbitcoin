   import { BaseError } from './baseError';
   import { HttpStatusCode } from './enums';

   // free to extend the BaseError
   class APIError extends BaseError {
    constructor(name: string, httpCode = HttpStatusCode.INTERNAL_SERVER, description = 'internal server error', isOperational: boolean) {
      super(name, httpCode, description, isOperational);
    }
   }