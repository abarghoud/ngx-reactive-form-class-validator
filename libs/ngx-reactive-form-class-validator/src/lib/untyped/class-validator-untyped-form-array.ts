import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  UntypedFormArray,
  ValidatorFn
} from '@angular/forms';

export class ClassValidatorUntypedFormArray extends UntypedFormArray {
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
