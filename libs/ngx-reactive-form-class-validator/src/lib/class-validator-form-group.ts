import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormGroup,
  ValidatorFn,
  ɵOptionalKeys
} from '@angular/forms';

import { ClassValidatorFormControl } from './class-validator-form-control';
import { ClassType } from './types';
import { ClassValidatorFormGroupOptions } from './class-validator-form-group-options.interface';

export class ClassValidatorFormGroup<TControl extends {
  [K in keyof TControl]: AbstractControl<any>;
} = any> extends FormGroup<TControl> {
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
   * @param options Options object of type `ClassValidatorFormGroupOptions` allowing
   * to define eagerValidation that validate controls immediately upon creation. Default is false (validators are executed starting from ngAfterViewInit hook)
   * See https://github.com/abarghoud/ngx-reactive-form-class-validator/issues/47
   *
   */
  public constructor(
    private readonly formClassType: ClassType<any>,
    controls: TControl,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
    private readonly options?: ClassValidatorFormGroupOptions,
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
  public addControl<K extends string&keyof TControl>(
    name: K,
    control: Required<TControl>[K],
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
  public removeControl<S extends string>(
    name: ɵOptionalKeys<TControl>&S, options: {emitEvent?: boolean;} = {}
  ): void {
    super.removeControl(name, options);
    this.assignFormValueToClassValue();
    this.setClassValidatorControlsContainerGroupClassValue();
  }

  private setClassValidatorControlsContainerGroupClassValue(): void {
    Object.entries(this.controls).forEach(([controlName, control]) => {
      if (control instanceof ClassValidatorFormControl) {
        control.setNameAndFormGroupClassValue(controlName, this.classValue, this.options?.eagerValidation);
      }
    });
  }

  private assignFormValueToClassValue(): void {
    this.classValue = Object.assign(new this.formClassType(), this.value);
  }
}

