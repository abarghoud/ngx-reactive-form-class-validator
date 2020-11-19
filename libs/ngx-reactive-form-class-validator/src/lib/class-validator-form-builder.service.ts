/* eslint no-null/no-null: 0 */

import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn
} from '@angular/forms';

import { ClassValidatorFormGroup } from './class-validator-form-group';
import { ClassValidatorFormControl } from './class-validator-form-control';
import { ClassValidatorFormArray } from './class-validator-form-array';
import { ClassType } from './types';

// Coming from https://github.com/angular/angular/blob/3b0b7d22109c79b4dceb4ae069c3927894cf1bd6/packages/forms/src/form_builder.ts#L14
const isAbstractControlOptions = (options: AbstractControlOptions | { [key: string]: any }): options is AbstractControlOptions =>
  (options as AbstractControlOptions).asyncValidators !== undefined ||
  (options as AbstractControlOptions).validators !== undefined ||
  (options as AbstractControlOptions).updateOn !== undefined;

@Injectable()
export class ClassValidatorFormBuilderService {
  /**
   * @description
   * Construct a new `FormGroup` instance.
   *
   * @param formClassType the `classType` containing `class-validator` decorators to be used to validate form
   * @param controlsConfig A collection of child controls. The key for each child is the name
   * under which it is registered.
   *
   * @param options Configuration options object for the `FormGroup`. The object can
   * have two shapes:
   *
   * 1) `AbstractControlOptions` object (preferred), which consists of:
   * * `validators`: A synchronous validator function, or an array of validator functions
   * * `asyncValidators`: A single async validator or array of async validator functions
   * * `updateOn`: The event upon which the control should be updated (options: 'change' | 'blur' |
   * submit')
   *
   * 2) Legacy configuration object, which consists of:
   * * `validator`: A synchronous validator function, or an array of validator functions
   * * `asyncValidator`: A single async validator or array of async validator functions
   *
   */
  public group(
    formClassType: ClassType<any>,
    controlsConfig: { [p: string]: any },
    options?: AbstractControlOptions | { [p: string]: any } | null
  ): ClassValidatorFormGroup {
    // Coming from https://github.com/angular/angular/blob/3b0b7d22109c79b4dceb4ae069c3927894cf1bd6/packages/forms/src/form_builder.ts#L59
    const controls = this.reduceControls(controlsConfig);

    let validators: ValidatorFn | ValidatorFn[] | null = null;
    let asyncValidators: AsyncValidatorFn | AsyncValidatorFn[] | null = null;
    let updateOn;

    if (options) {
      if (isAbstractControlOptions(options)) {
        // `options` are `AbstractControlOptions`
        validators = options.validators ? options.validators : null;
        asyncValidators = options.asyncValidators ? options.asyncValidators : null;
        updateOn = options.updateOn ? options.updateOn : undefined;
      } else {
        // `options` are legacy form group options
        validators = options['validator'] !== null ? options['validator'] : null;
        asyncValidators = options['asyncValidator'] !== null ? options['asyncValidator'] : null;
      }
    }

    return new ClassValidatorFormGroup(formClassType, controls, { asyncValidators, updateOn, validators });
  }

  /**
   * Constructs a new `FormArray` from the given array of configurations,
   * validators and options.
   *
   * @param controlsConfig An array of child controls or control configs. Each
   * child control is given an index when it is registered.
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or an `AbstractControlOptions` object that contains
   * validation functions and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator
   * functions.
   */
  public array(
    controlsConfig: any[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ): FormArray {
    const controls = controlsConfig.map(control => this.createControl(control));

    return new ClassValidatorFormArray(controls, validatorOrOpts, asyncValidator);
  }


  /**
   * @description
   * Construct a new `FormControl` with the given state, validators and options.
   *
   * @param formState Initializes the control with an initial state value, or
   * with an object that contains both a value and a disabled status.
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or an `AbstractControlOptions` object that contains
   * validation functions and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator
   * functions.
   *
   * @usageNotes
   *
   * ### Initialize a control as disabled
   *
   * The following example returns a control with an initial value in a disabled state.
   *
   * <code-example path="forms/ts/formBuilder/form_builder_example.ts" region="disabled-control">
   * </code-example>
   */
  public control(
    formState: any,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ): ClassValidatorFormControl {
    return new ClassValidatorFormControl(formState, validatorOrOpts, asyncValidator);
  }

  // Coming from https://github.com/angular/angular/blob/3b0b7d22109c79b4dceb4ae069c3927894cf1bd6/packages/forms/src/form_builder.ts#L133
  private reduceControls(controlsConfig: { [k: string]: any }): { [key: string]: AbstractControl } {
    const controls: { [key: string]: AbstractControl } = {};

    Object.keys(controlsConfig).forEach(controlName => {
      controls[controlName] = this.createControl(controlsConfig[controlName]);
    });

    return controls;
  }

  private createControl(controlConfig: any): AbstractControl {
    if (
      controlConfig instanceof FormControl
      || controlConfig instanceof FormGroup
      || controlConfig instanceof FormArray
    ) {
      return controlConfig;
    } else if (Array.isArray(controlConfig)) {
      const value = controlConfig[0];
      const validator: ValidatorFn = controlConfig.length > 1 ? controlConfig[1] : null;
      const asyncValidator: AsyncValidatorFn = controlConfig.length > 2 ? controlConfig[2] : null;

      return this.control(value, validator, asyncValidator);
    } else {
      return this.control(controlConfig);
    }
  }
}
