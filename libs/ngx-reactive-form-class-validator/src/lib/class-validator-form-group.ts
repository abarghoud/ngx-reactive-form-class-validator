import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms';

import { ClassValidatorFormControl } from './class-validator-form-control';
import { ClassType } from './types';

export class ClassValidatorFormGroup extends FormGroup {
  private classValue: any;

  public constructor(
    private readonly formClassType: ClassType<any>,
    controls: {
      [key: string]: AbstractControl;
    },
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(controls, validatorOrOpts, asyncValidator);

    this.assignFormValueToClassValue();
    this.setClassValidatorControlsContainerGroupClassValue();
  }

  public addControl(name: string, control: AbstractControl): void {
    super.addControl(name, control);
    this.assignFormValueToClassValue();
    this.setClassValidatorControlsContainerGroupClassValue();
  }

  public removeControl(name: string): void {
    super.removeControl(name);
    this.assignFormValueToClassValue();
    this.setClassValidatorControlsContainerGroupClassValue();
  }

  private setClassValidatorControlsContainerGroupClassValue(): void {
    Object.entries(this.controls).forEach(([controlName, control]) => {
      if (control instanceof ClassValidatorFormControl) {
        (this.controls[controlName] as ClassValidatorFormControl)
          .setNameAndFormGroupClassValue(controlName, this.classValue);
      }
    });
  }

  private assignFormValueToClassValue(): void {
    this.classValue = Object.assign(new this.formClassType(), this.value);
  }
}

