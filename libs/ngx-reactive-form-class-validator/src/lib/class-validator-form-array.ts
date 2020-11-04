import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, ValidatorFn } from '@angular/forms';

export class ClassValidatorFormArray extends FormArray {
  public constructor(
    controls: AbstractControl[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(
      controls,
      validatorOrOpts,
      asyncValidator,
    );
  }
}
