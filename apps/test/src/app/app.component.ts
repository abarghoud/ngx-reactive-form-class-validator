import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';

import { IsEmail, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { deserialize, deserializeAs } from 'cerialize';
import {
  ClassValidatorFormBuilderModule,
  ClassValidatorFormBuilderService, ClassValidatorFormControl,
  ClassValidatorFormGroup
} from 'ngx-reactive-form-class-validator';


class Address {
  @deserialize
  @IsNotEmpty()
  public street: string;

  @deserialize
  @IsNotEmpty()
  public city: string;

  @deserialize
  @IsOptional()
  public state: string;

  @deserialize
  @IsNotEmpty()
  public zip: string;
}

class Profile {
  @deserialize
  public firstName: string;

  @deserialize
  @IsNotEmpty()
  public lastName: string;

  @deserialize
  @IsEmail()
  public email: string;

  @deserializeAs(Address)
  @ValidateNested()
  public address: Address;
}

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    ClassValidatorFormBuilderModule,
  ]
})
export class AppComponent implements OnInit {
  public profileForm: ClassValidatorFormGroup;
  public addressForm: ClassValidatorFormGroup;

  public constructor(private readonly fb: ClassValidatorFormBuilderService) {}

  public ngOnInit(): void {
    // Creating ClassValidatorFormGroup using the builder
    this.profileForm = this.fb.group(Profile, {
      firstName: ["", Validators.required], // add custom validator, firstName property in Profile class has not any class-validator
      lastName: [""],
      email: ["12", Validators.minLength(3)], // Combining class-validator with custom validator
      // Creating ClassValidatorFormGroup using the class
      address: new ClassValidatorFormGroup(Address, {
        street: new ClassValidatorFormControl(""),
        city: new ClassValidatorFormControl(""),
        state: new ClassValidatorFormControl(""),
        // using a FormControl will not apply dynamic validation
        zip: new FormControl("")
      })
    });

    this.addressForm = this.profileForm.get(
      "address"
    ) as ClassValidatorFormGroup;
  }

  public clearValidators(): void {
    Object.entries(this.profileForm.controls).forEach(([name, control]) => {
      control.clearValidators();
      control.updateValueAndValidity();
    });
    Object.entries(this.addressForm.controls).forEach(([name, control]) => {
      control.clearValidators();
      control.updateValueAndValidity();
    });
  }

  public resetValidators(): void {
    Object.entries(this.profileForm.controls).forEach(([name, control]) => {
      if (control instanceof ClassValidatorFormControl) {
        if (name === "firstName") {
          control.setValidators(Validators.required);
          control.updateValueAndValidity();

          return;
        } else if (name === "email") {
          control.setValidatorsWithDynamicValidation(Validators.minLength(3));
          control.updateValueAndValidity();

          return;
        } else {
          control.setValidatorsWithDynamicValidation(undefined);
          control.updateValueAndValidity();

          return;
        }
      }
    });
    Object.entries(this.addressForm.controls).forEach(([name, control]) => {
      if (control instanceof ClassValidatorFormControl) {
        control.setValidatorsWithDynamicValidation(undefined);
        control.updateValueAndValidity();
      }
    });
  }
}
