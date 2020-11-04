import {
  AbstractControlOptions,
  AsyncValidatorFn,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { validateSync } from 'class-validator';

export class ClassValidatorFormControl extends FormControl {
  private formGroupClassValue: any;
  private name: string;

  public constructor(
    formState?: any,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(formState, validatorOrOpts, asyncValidator);

    this.setValidatorsWithDynamicValidation(validatorOrOpts);
  }

  public setNameAndFormGroupClassValue(name: string, value: any): void {
    this.name = name;
    this.formGroupClassValue = value;
  }

  public setValidatorsWithDynamicValidation(newValidator: ValidatorFn | ValidatorFn[] | AbstractControlOptions | undefined): void {
    this.setValidators(
      newValidator
        ? [this.composeValidators(newValidator), this.dynamicValidator]
        : this.dynamicValidator);
  }

  private composeValidators(validator: ValidatorFn | ValidatorFn[] | AbstractControlOptions): ValidatorFn {
    if (validator instanceof Array) {
      return Validators.compose(validator);
    }

    if ((validator as AbstractControlOptions).validators) {
      return this.composeValidators((validator as AbstractControlOptions).validators);
    }

    return validator as ValidatorFn;
  }

  private readonly dynamicValidator = (control: ClassValidatorFormControl): ValidationErrors => {
    this.formGroupClassValue[this.name] = control.value;

    const validationErrors = validateSync(this.formGroupClassValue)
      .find(error => error.property === this.name);

    return validationErrors ? validationErrors.constraints : undefined;
  };
}
