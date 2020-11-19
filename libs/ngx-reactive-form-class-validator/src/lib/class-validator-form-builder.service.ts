/* eslint no-null/no-null: 0 */

import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup, ValidatorFn
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
  public group(
    formClassType: ClassType<any>,
    controlsConfig: { [p: string]: any },
    options?: AbstractControlOptions | { [p: string]: any } | null,
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

    return new ClassValidatorFormGroup(formClassType, controls, {asyncValidators, updateOn, validators});
  }

  public array(
    controlsConfig: any[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ): FormArray {
    const controls = controlsConfig.map(control => this.createControl(control));

    return new ClassValidatorFormArray(controls, validatorOrOpts, asyncValidator);
  }

  public control(
    formState: any,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
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
