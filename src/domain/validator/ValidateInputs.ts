import { plainToInstance } from "class-transformer";
import { validateOrReject, ValidationError as ClassValidationError } from "class-validator";
import { flatten, values } from "rambda";

import { FieldValidationError } from "./errors/FieldValidationError";
import { ValidationErrors } from "./errors";

const toFieldValidationError = (rootError: ClassValidationError): FieldValidationError[] => {
  const getCurrentErrors = ({ property, constraints }: ClassValidationError): FieldValidationError[] => {
    const errors = values(constraints).map((message) => new FieldValidationError(property, message));
    return flatten(errors);
  };

  const getChildrenErrors = ({
    path,
    children,
    errors = [],
  }: {
    path: string;
    children: ClassValidationError[];
    errors?: FieldValidationError[];
  }): FieldValidationError[] => {
    const nextErrors = [...errors];

    const childrenErrors = children.map((error, i) => {
      const nextPath = `${path}[${i}].${error.property}`;

      if (error.constraints != null) nextErrors.push(...getCurrentErrors({ ...error, property: nextPath }));
      if (error.children != null)
        return getChildrenErrors({ path: nextPath, children: error.children, errors: nextErrors });

      return nextErrors;
    });

    return flatten(childrenErrors);
  };

  return [
    ...getCurrentErrors(rootError),
    ...(rootError.children ? getChildrenErrors({ path: rootError.property, children: rootError.children }) : []),
  ];
};

export function ValidateInputs(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = async function (...inputs) {
    const inputTypes: any[] = Reflect.getMetadata("design:paramtypes", target, propertyKey);

    try {
      const validationPromises = inputTypes.map((Class, index) => {
        if (!Class.toString().startsWith("class ")) return Promise.resolve();

        return validateOrReject(plainToInstance(Class, inputs[index] ?? {}), {
          validationError: { target: false },
          forbidUnknownValues: true,
        });
      });

      await Promise.all(validationPromises);
    } catch (error) {
      if (error instanceof Error) throw error;
      const fieldValidationErrors = (error as ClassValidationError[]).map((error) => toFieldValidationError(error));
      throw new ValidationErrors(flatten(fieldValidationErrors));
    }

    return await method.apply(this, inputs);
  };

  return descriptor;
}
