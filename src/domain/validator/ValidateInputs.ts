import { plainToInstance } from "class-transformer";
import { validateOrReject, ValidationError } from "class-validator";

import { FieldValidationError } from "./errors/FieldValidationError";
import { ValidationErrors } from "./errors";

export function ValidateInputs(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = async function (...inputs) {
    const inputTypes: any[] = Reflect.getMetadata("design:paramtypes", target, propertyKey);

    try {
      const validationPromises = inputTypes.map((Class, index) => {
        if (!Class.toString().startsWith(`class `)) return Promise.resolve();

        return validateOrReject(plainToInstance(Class, inputs[index]), {
          validationError: { target: false },
          forbidUnknownValues: true,
        });
      });

      await Promise.all(validationPromises);
    } catch (errors) {
      if (errors instanceof Error) throw errors;

      const validationErrors = errors as ValidationError[];
      throw new ValidationErrors(
        validationErrors
          .filter(({ constraints }) => constraints)
          .flatMap((error) =>
            Object.values(error.constraints).map((message) => new FieldValidationError(error.property, message))
          )
      );
    }

    return await method.apply(this, inputs);
  };

  return descriptor;
}
