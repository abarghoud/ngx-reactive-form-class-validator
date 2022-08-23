import { ValidationErrors, Validators } from '@angular/forms';

import { ClassValidatorUntypedFormControl } from './class-validator-untyped-form-control';
import { FakeContact, FakeContactType } from '../testing/fake-user-testing.model';

describe('The ClassValidatorFormControl class', () => {
  let phoneNumberClassValidatorFormControl: ClassValidatorUntypedFormControl;

  beforeEach(() => {
    phoneNumberClassValidatorFormControl = new ClassValidatorUntypedFormControl('');
  });

  describe('When control name and classValue are provided', () => {
    const contact = new FakeContact();
    contact.phoneNumber = '';
    contact.email = '';
    contact.type = FakeContactType.phone;

    beforeEach(() => {
      phoneNumberClassValidatorFormControl.setNameAndFormGroupClassValue('phoneNumber', contact);
    });

    describe('When dynamic class-validator', () => {
      const validPhoneNumber = '0634555555';
      const invalidPhoneNumber = '0634555555545';

      describe('When invalid value provided', () => {
        it('should has error', () => {
          phoneNumberClassValidatorFormControl.setValue('0634555555545');

          expect(phoneNumberClassValidatorFormControl.errors).toEqual({isMobilePhone: 'phoneNumber must be a phone number'});
        });
      });

      describe('When valid value provided', () => {
        it('should not have any error', () => {
          phoneNumberClassValidatorFormControl.setValue(validPhoneNumber);

          expect(phoneNumberClassValidatorFormControl.errors).toBeFalsy();
        });
      });

      describe('When conditional validation', () => {
        it('should not have any error', () => {
          contact.type = FakeContactType.email;

          phoneNumberClassValidatorFormControl.setValue(invalidPhoneNumber);
          expect(phoneNumberClassValidatorFormControl.errors).toBeFalsy();
        });
      });
    });

    describe('When combining dynamic class-validator and manual validation', () => {
      const emailClassValidatorFormControl = new ClassValidatorUntypedFormControl();

      beforeEach(() => {
        const contactForEmailValidation = Object.assign(contact, {type: FakeContactType.email});

        emailClassValidatorFormControl.setNameAndFormGroupClassValue('email', contactForEmailValidation);
        emailClassValidatorFormControl.setValidatorsWithDynamicValidation(Validators.minLength(8));
      });

      it('should consider manual validation as well as dynamic validator', () => {
        emailClassValidatorFormControl.setValue('123456');

        expect(emailClassValidatorFormControl.errors).toEqual({
          isEmail: 'email must be an email',
          minlength: {
            actualLength: 6,
            requiredLength: 8,
          },
        });
      });

      describe('When array of validators', () => {
        beforeEach(() => {
          emailClassValidatorFormControl.setValidatorsWithDynamicValidation([
            Validators.maxLength(8),
            (): ValidationErrors => ({isSecondValidatorError: true}),
          ],
          );
        });

        it('should use validators provided as well as dynamic validator', () => {
          emailClassValidatorFormControl.setValue('4546546546565');

          expect(emailClassValidatorFormControl.errors).toEqual({
            isEmail: 'email must be an email',
            maxlength: {
              actualLength: 13,
              requiredLength: 8,
            },
            isSecondValidatorError: true,
          });
        });
      });

      describe('When AbstractControlOptions validators', () => {
        beforeEach(() => {
          emailClassValidatorFormControl.setValidatorsWithDynamicValidation({
            validators: [
              Validators.maxLength(8),
              (): ValidationErrors => ({isSecondValidatorError: true}),
            ]
          });
        });

        it('should use validators provided as well as dynamic validator', () => {
          emailClassValidatorFormControl.setValue('4546546546565');

          expect(emailClassValidatorFormControl.errors).toEqual({
            isEmail: 'email must be an email',
            maxlength: {
              actualLength: 13,
              requiredLength: 8,
            },
            isSecondValidatorError: true,
          });
        });
      });

      describe('When `null` provided', () => {
        beforeEach(() => {
          emailClassValidatorFormControl.setValidatorsWithDynamicValidation(undefined);
        });

        it('should use only dynamic validator', () => {
          emailClassValidatorFormControl.setValue('notEmail');

          expect(emailClassValidatorFormControl.errors).toEqual({ isEmail: 'email must be an email' });
        });
      });
    });
  });
});
