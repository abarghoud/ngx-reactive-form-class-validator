import { Validators } from '@angular/forms';

import { FakeContactType, FakeContact } from './fake-user-testing.model';
import { ClassValidatorFormArray } from '../class-validator-form-array';
import { ClassValidatorFormGroup } from '../class-validator-form-group';
import { ClassValidatorFormControl } from '../class-validator-form-control';
import { ClassValidatorUntypedFormControl } from '../untyped/class-validator-untyped-form-control';

export const fakeContactFormGroup = new ClassValidatorFormArray([
  new ClassValidatorFormGroup(FakeContact, {
    phoneNumber: new ClassValidatorFormControl(''),
    email: new ClassValidatorFormControl(''),
    type: new ClassValidatorFormControl(FakeContactType.phone),
  }),
],
);

export const fakeUserFormControls = {
  firstName: new ClassValidatorFormControl('anas'),
  id: new ClassValidatorFormControl('123456', [Validators.minLength(10)]),
  isSessionLocked: new ClassValidatorFormControl(true),
  lastActive: new ClassValidatorFormControl(''),
  contacts: new ClassValidatorFormArray([fakeContactFormGroup]),
};

export const fakeContactUntypedFormGroup = new ClassValidatorFormArray([
    new ClassValidatorFormGroup(FakeContact, {
      phoneNumber: new ClassValidatorUntypedFormControl(''),
      email: new ClassValidatorUntypedFormControl(''),
      type: new ClassValidatorUntypedFormControl(FakeContactType.phone),
    }),
  ],
);

export const fakeUserUntypedFormControls = {
  firstName: new ClassValidatorUntypedFormControl('anas'),
  id: new ClassValidatorUntypedFormControl('123456', [Validators.minLength(10)]),
  isSessionLocked: new ClassValidatorUntypedFormControl(true),
  lastActive: new ClassValidatorUntypedFormControl(''),
  contacts: new ClassValidatorUntypedFormControl([fakeContactUntypedFormGroup]),
};
