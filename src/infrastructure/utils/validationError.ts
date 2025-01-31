import { ValidationError } from 'class-validator';
import { ErrorMessageType } from '../exception-filters/exeptions';


export const validationError = (errors: ValidationError[]): ErrorMessageType[] => {
  return errors.map(error => {
    const constraints = error.constraints;
    if (!constraints) return null;

    const firstConstraintKey = Object.keys(constraints)[0];
    return { message: constraints[firstConstraintKey], field: error.property };
  }).filter(Boolean) as ErrorMessageType[];
};