import {
  AbstractControlOptions,
  AsyncValidatorFn,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { validateSync } from 'class-validator';

export class ClassValidatorFormControl<T = any> extends FormControl<T | any> {
  private formGroupClassValue: any;
  private name: string;

  /**
   * Creates a new `ClassValidatorFormControl` instance.
   *
   * @param formState Initializes the control with an initial value,
   * or an object that defines the initial value and disabled state.
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or an `AbstractControlOptions` object that contains validation functions
   * and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator functions
   *
   */
  public constructor(
    formState?: any,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(formState, validatorOrOpts, asyncValidator);

    this.setValidatorsWithDynamicValidation(validatorOrOpts);
  }

  /**
   * @internal
   */
  public setNameAndFormGroupClassValue(name: string, value: any): void {
    this.name = name;
    this.formGroupClassValue = value;
  }

  /**
   * Sets the synchronous validators that are active on this control as well as resetting the dynamic `class-validator`.  Calling
   * this overwrites any existing sync validators.
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   */
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
