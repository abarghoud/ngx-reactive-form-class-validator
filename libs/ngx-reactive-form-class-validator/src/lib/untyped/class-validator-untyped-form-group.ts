import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, UntypedFormGroup, ValidatorFn } from '@angular/forms';

import { ClassValidatorUntypedFormControl } from './class-validator-untyped-form-control';
import { ClassType } from '../types';

export class ClassValidatorUntypedFormGroup extends UntypedFormGroup {
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
   * @param options Specifies whether this FormGroup instance should emit events after a new
   *     control is added.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges` observables emit events with the latest status and value when the control is
   * added. When false, no events are emitted.
   *
   */
  public addControl(
    name: string,
    control: AbstractControl,
    options?: {
      emitEvent?: boolean;
    },
  ): void {
    super.addControl(name, control, options);
    this.assignFormValueToClassValue();
    this.setClassValidatorControlsContainerGroupClassValue();
  }

  /**
   * Remove a control from this group.
   *
   * @param name The control name to remove from the collection
   * @param options Specifies whether this FormGroup instance should emit events after a
   *     control is removed.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges` observables emit events with the latest status and value when the control is
   * removed. When false, no events are emitted.
   */
  public removeControl(
    name: string,
    options?: {
      emitEvent?: boolean;
    },
  ): void {
    super.removeControl(name, options);
    this.assignFormValueToClassValue();
    this.setClassValidatorControlsContainerGroupClassValue();
  }

  private setClassValidatorControlsContainerGroupClassValue(): void {
    Object.entries(this.controls).forEach(([controlName, control]) => {
      if (control instanceof ClassValidatorUntypedFormControl) {
        (this.controls[controlName] as ClassValidatorUntypedFormControl)
          .setNameAndFormGroupClassValue(controlName, this.classValue);
      }
    });
  }

  private assignFormValueToClassValue(): void {
    this.classValue = Object.assign(new this.formClassType(), this.value);
  }
}

