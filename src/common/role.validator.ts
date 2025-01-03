/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Role } from 'src/interfaces/types'; // Assuming Role enum is defined here

// Validator for 'USER' role
@ValidatorConstraint({ async: false })
export class IsUserRole implements ValidatorConstraintInterface {
  validate(role: Role | undefined, args: ValidationArguments) {
    // If no role is provided, it's valid (defaults to 'USER')
    if (!role) {
      return true; // Implicitly allows default 'USER'
    }

    // If role is anything other than 'USER', reject it
    return role === Role.USER;
  }

  defaultMessage(args: ValidationArguments) {
    return `Role '${args.value}' is invalid. Only 'USER' is allowed for this field.`;
  }
}

// Validator for 'SELLER' role
@ValidatorConstraint({ async: false })
export class IsSellerRole implements ValidatorConstraintInterface {
  validate(role: Role, args: ValidationArguments) {

    // If role is anything other than 'SELLER', reject it
    return role === Role.SELLER;
  }

  defaultMessage(args: ValidationArguments) {
    return `Role '${args.value}' is invalid. Only 'SELLER' is allowed for this field.`;
  }
}
