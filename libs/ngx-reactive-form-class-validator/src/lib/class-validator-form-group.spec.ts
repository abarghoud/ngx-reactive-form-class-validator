import { FakeUser } from './testing/fake-user-testing.model';
import { fakeUserFormControls } from './testing/fake-form-testing.fixture';
import { ClassValidatorFormGroup } from './class-validator-form-group';
import { ClassValidatorFormControl } from './class-validator-form-control';

describe('The ClassValidatorFormGroup class', () => {
  describe('The constructor', () => {
    const firstNameSetNameAndClassValueSpy = jest.spyOn(fakeUserFormControls.firstName, 'setNameAndFormGroupClassValue');
    const idSetNameAndClassValueSpy = jest.spyOn(fakeUserFormControls.id, 'setNameAndFormGroupClassValue');

    beforeEach(() => {
      new ClassValidatorFormGroup(FakeUser, {
        firstName: fakeUserFormControls.firstName,
        id: fakeUserFormControls.id,
      });
    });

    it('should update class validator form controls name and class value', () => {
      const expectedClassValue = new FakeUser();
      expectedClassValue.firstName = fakeUserFormControls.firstName.value;
      expectedClassValue.id = fakeUserFormControls.id.value;

      expect(firstNameSetNameAndClassValueSpy).toBeCalledWith('firstName', expectedClassValue);
      expect(idSetNameAndClassValueSpy).toBeCalledWith('id', expectedClassValue);
    });
  });

  describe('The addControl method', () => {
    let fakeEmptyUserFormGroup: ClassValidatorFormGroup;
    let formControlSetNameAndClassValueSpy;

    beforeEach(() => {
      const fakeFormControlToAdd = new ClassValidatorFormControl('name');

      fakeEmptyUserFormGroup = new ClassValidatorFormGroup(FakeUser, {});
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
    const idSetNameAndClassValueSpy = jest.spyOn(fakeUserFormControls.id, 'setNameAndFormGroupClassValue');
    const isSessionLockedSetNameAndClassValueSpy = jest.spyOn(fakeUserFormControls.isSessionLocked, 'setNameAndFormGroupClassValue');

    beforeEach(() => {
      partialFakeClassValidatorFormGroup = new ClassValidatorFormGroup(FakeUser, {
        firstName: fakeUserFormControls.firstName,
        id: fakeUserFormControls.id,
        isSessionLocked: fakeUserFormControls.isSessionLocked,
      });

      partialFakeClassValidatorFormGroup.removeControl('firstName');
    });

    it('should update ClassValidatorControls name and class value', () => {
      const expectedClassValue = new FakeUser();
      expectedClassValue.id = fakeUserFormControls.id.value;
      expectedClassValue.isSessionLocked = fakeUserFormControls.isSessionLocked.value;

      expect(idSetNameAndClassValueSpy).toBeCalledWith('id', expectedClassValue);
      expect(isSessionLockedSetNameAndClassValueSpy).toBeCalledWith('isSessionLocked', expectedClassValue);
    });
  });
});
