import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'ComparePassword', async: false })
export class ComparePassword implements ValidatorConstraintInterface {
    validate(password: string, args: ValidationArguments) {
        if (args.object['password'] !== password) {
            return false;
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Las contraseñas enviadas no coinciden';
    }
}
