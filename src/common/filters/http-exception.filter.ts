import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  interface ErrorResponse {
    statusCode: number;
    message: string | string[];
    error: string;
    // path: string;
    timestamp: string;
    success: boolean;
  }
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);
  
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      // Handle HttpExceptions
      const status = 
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
  
      // Extract message
      let message: string | string[];
      let error: string;
  
      if (exception instanceof HttpException) {
        const exceptionResponse = exception.getResponse();
        
        // Handle both string and object responses
        if (typeof exceptionResponse === 'object') {
          message = (exceptionResponse as any).message || exception.message;
          error = (exceptionResponse as any).error || 'Error';
        } else {
          message = exception.message;
          error = 'Error';
        }
      } else {
        // For non-HTTP exceptions (like database errors, etc.)
        message = exception?.message || 'Internal server error';
        error = 'Internal Server Error';
        
        // Log unexpected errors for debugging
        this.logger.error(
          `Unhandled exception: ${exception?.message}`,
          exception?.stack,
        );
      }
  
      const errorResponse: ErrorResponse = {
        statusCode: status,
        message,
        error,
        // path: request.url,
        timestamp: new Date().toISOString(),
        success: false,
      };
  
      response.status(status).json(errorResponse);
    }
  }