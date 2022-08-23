import { ClassValidatorUntypedFormGroup } from './class-validator-untyped-form-group';
import { ClassValidatorUntypedFormControl } from './class-validator-untyped-form-control';
import { fakeUserUntypedFormControls } from '../testing/fake-form-testing.fixture';
import { FakeUser } from '../testing/fake-user-testing.model';

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

      expect(firstNameSetNameAndClassValueSpy).toBeCalledWith('firstName', expectedClassValue);
      expect(idSetNameAndClassValueSpy).toBeCalledWith('id', expectedClassValue);
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

      expect(formControlSetNameAndClassValueSpy).toBeCalledWith('firstName', expectedClassValue);
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

      expect(idSetNameAndClassValueSpy).toHaveBeenCalledWith('id', expectedClassValue);
      expect(isSessionLockedSetNameAndClassValueSpy).toHaveBeenCalledWith('isSessionLocked', expectedClassValue);
    });
  });
});
