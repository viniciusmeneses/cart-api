import { plainToInstance } from "class-transformer";
import { validateOrReject, ValidationError as ClassValidationError } from "class-validator";
import { flatten, values } from "rambda";

import { FieldValidationError, ValidationErrors } from "./errors";

const addPropertyToPath = (path, property) => {
  const isIndexProperty = !isNaN(parseInt(property, 10));
  return path + (isIndexProperty ? `[${property}]` : `.${property}`);
};

const toFieldValidationErrors = (rootError: ClassValidationError): FieldValidationError[] => {
  const getCurrentErrors = ({ property, constraints }: ClassValidationError) => {
    const errors = values(constraints).map((message) => new FieldValidationError(property, message));
    return flatten<FieldValidationError>(errors);
  };

  const getChildrenErrors = ({
    path,
    children,
    errors = [],
  }: {
    path: string;
    children: ClassValidationError[];
    errors?: FieldValidationError[];
  }) => {
    const childrenErrors = children.map((error) => {
      const nextPath = addPropertyToPath(path, error.property);
      const errors = error.constraints != null ? getCurrentErrors({ ...error, property: nextPath }) : [];

      if (error.children == null) return errors;
      return getChildrenErrors({ path: nextPath, children: error.children, errors: errors });
    });

    return flatten<FieldValidationError>([...errors, childrenErrors]);
  };

  return [
    ...getCurrentErrors(rootError),
    ...getChildrenErrors({ path: rootError.property, children: rootError.children ?? [] }),
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
      const fieldValidationErrors = error.flatMap(toFieldValidationErrors);
      throw new ValidationErrors(fieldValidationErrors);
    }

    return await method.apply(this, inputs);
  };

  return descriptor;
}
