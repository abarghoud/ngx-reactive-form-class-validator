import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms';

import { ClassValidatorFormControl } from './class-validator-form-control';
import { ClassType } from './types';

export class ClassValidatorFormGroup extends FormGroup {
  private classValue: any;

  /**
   * Creates a new `ClassValidatorFormGroup` instance.
   *
   * @param formClassType the `classType` containing `class-validator` decorators to be used to validate form
   * @param controls A collection of child controls. The key for each child is the name
   * under which it is registered.
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or an `AbstractControlOptions` object that contains validation functions
   * and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator functions
   *
   */
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

  /**
   * Add a control to this group.
   *
   * This method also updates the value and validity of the control.
   *
   * @param name The control name to add to the collection
   * @param control Provides the control for the given name
   */
  public addControl(name: string, control: AbstractControl): void {
    super.addControl(name, control);
    this.assignFormValueToClassValue();
    this.setClassValidatorControlsContainerGroupClassValue();
  }

  /**
   * Remove a control from this group.
   *
   * @param name The control name to remove from the collection
   */
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

