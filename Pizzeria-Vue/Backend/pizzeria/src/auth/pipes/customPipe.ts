import {
  ValidationPipe,
  ValidationError,
  BadRequestException,
} from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const errors = validationErrors.map((error) => ({
        field: error.property,
        errors: Object.values(error.constraints || {}),
      }));

      return new BadRequestException({
        message: 'Validation failed',
        errors,
      });
    };
  }
}
