import { ClassValidatorUntypedFormGroup } from './class-validator-untyped-form-group';
import { ClassValidatorUntypedFormControl } from './class-validator-untyped-form-control';
import { fakeUserUntypedFormControls } from '../testing/fake-form-testing.fixture';
import { FakeThing, FakeUser } from '../testing/fake-user-testing.model';

describe('The ClassValidatorUntypedFormGroup class', () => {
  describe('The constructor', () => {
    const firstNameSetNameAndClassValueSpy = jest.spyOn(fakeUserUntypedFormControls.firstName, 'setNameAndFormGroupClassValue');
    const idSetNameAndClassValueSpy = jest.spyOn(fakeUserUntypedFormControls.id, 'setNameAndFormGroupClassValue');

    beforeEach(() => {
      new ClassValidatorUntypedFormGroup(FakeUser, {
        firstName: fakeUserUntypedFormControls.firstName,
        id: fakeUserUntypedFormControls.id,
      });
    });

    it('should update class validator untyped form controls name and class value', () => {
      const expectedClassValue = new FakeUser();
      expectedClassValue.firstName = fakeUserUntypedFormControls.firstName.value;
      expectedClassValue.id = fakeUserUntypedFormControls.id.value;

      expect(firstNameSetNameAndClassValueSpy).toBeCalledWith('firstName', expectedClassValue, undefined);
      expect(idSetNameAndClassValueSpy).toBeCalledWith('id', expectedClassValue, undefined);
    });
  });

  describe('The addControl method', () => {
    let fakeEmptyUserFormGroup: ClassValidatorUntypedFormGroup;
    let formControlSetNameAndClassValueSpy;

    beforeEach(() => {
      const fakeFormControlToAdd = new ClassValidatorUntypedFormControl('name');

      fakeEmptyUserFormGroup = new ClassValidatorUntypedFormGroup(FakeUser, {});
      formControlSetNameAndClassValueSpy = jest.spyOn(fakeFormControlToAdd, 'setNameAndFormGroupClassValue');

      fakeEmptyUserFormGroup.addControl('firstName', fakeFormControlToAdd);
    });

    it('should set classValidatorFormControl name and class value', () => {
      const expectedClassValue = new FakeUser();
      expectedClassValue.firstName = 'name';

      expect(formControlSetNameAndClassValueSpy).toBeCalledWith('firstName', expectedClassValue, undefined);
    });
  });

  describe('The removeControl method', () => {
    let partialFakeClassValidatorFormGroup;
    const idSetNameAndClassValueSpy = jest.spyOn(fakeUserUntypedFormControls.id, 'setNameAndFormGroupClassValue');
    const isSessionLockedSetNameAndClassValueSpy = jest.spyOn(fakeUserUntypedFormControls.isSessionLocked, 'setNameAndFormGroupClassValue');

    beforeEach(() => {
      partialFakeClassValidatorFormGroup = new ClassValidatorUntypedFormGroup(FakeUser, {
        firstName: fakeUserUntypedFormControls.firstName,
        id: fakeUserUntypedFormControls.id,
        isSessionLocked: fakeUserUntypedFormControls.isSessionLocked,
      });

      partialFakeClassValidatorFormGroup.removeControl('firstName');
    });

    it('should update ClassValidatorControls name and class value', () => {
      const expectedClassValue = new FakeUser();
      expectedClassValue.id = fakeUserUntypedFormControls.id.value;
      expectedClassValue.isSessionLocked = fakeUserUntypedFormControls.isSessionLocked.value;

      expect(idSetNameAndClassValueSpy).toHaveBeenCalledWith('id', expectedClassValue, undefined);
      expect(isSessionLockedSetNameAndClassValueSpy).toHaveBeenCalledWith('isSessionLocked', expectedClassValue, undefined);
    });
  });

  describe('The formGroup', () => {
    let formGroup: ClassValidatorUntypedFormGroup;

    describe('When FormControls are created normally', () => {
      beforeEach(() => {
        formGroup = new ClassValidatorUntypedFormGroup(FakeThing, {
          first: new ClassValidatorUntypedFormControl('notemail'),
          last: new ClassValidatorUntypedFormControl('')
        });
      })

      it('should not run validators immediately', () => {
        expect(formGroup.valid).toBe(true);
        expect(formGroup.controls['first'].value).toBe('notemail');
      });
    });

    describe('When FormControls are created with eagerValidation flag', () => {
      beforeEach(() => {
        formGroup = new ClassValidatorUntypedFormGroup(FakeThing, {
          first: new ClassValidatorUntypedFormControl('notemail'),
          last: new ClassValidatorUntypedFormControl('')
        }, undefined, undefined, { eagerValidation: true });
      })

      it('should run validators immediately', () => {
        expect(formGroup.valid).toBe(false);
        expect(formGroup.controls['first'].value).toBe('notemail');
        expect(formGroup.controls['first'].errors.isEmail).toBeDefined();
      });
    });
  });
});
