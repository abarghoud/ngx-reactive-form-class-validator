
# ngx-reactive-form-class-validator
A lightweight library for dynamically validate Angular reactive forms using [class-validator](https://github.com/typestack/class-validator) library.

<p>
  <a href="https://www.npmjs.com/package/ngx-reactive-form-class-validator">
    <img src="https://img.shields.io/npm/v/ngx-reactive-form-class-validator?color=green" alt="npm version" />
  </a>&nbsp;
  <a href="https://www.npmjs.com/package/ngx-reactive-form-class-validator">
    <img src="https://img.shields.io/bundlephobia/min/ngx-reactive-form-class-validator" alt="npm minified size" />
  </a>&nbsp;
  <a href="https://codecov.io/gh/abarghoud/ngx-reactive-form-class-validator">
      <img src="https://img.shields.io/codecov/c/github/abarghoud/ngx-reactive-form-class-validator?color=green" alt="Code coverage" />
  </a>&nbsp;
  <a href="https://app.circleci.com/pipelines/github/abarghoud/ngx-reactive-form-class-validator">
      <img src="https://img.shields.io/circleci/build/github/abarghoud/ngx-reactive-form-class-validator/main" alt="Build status" />
  </a>&nbsp;
</p>

## Table of contents
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
	  - [Peer dependencies](#peer-dependencies)
  - [Usage](#usage)
    - [Defining classes with validators](#defining-classes-with-validators)
    - [Untyped classes](#untyped-classes)
    - [Creating a ClassValidatorFormGroup](#creating-a-classvalidatorformgroup)
      - [Using ClassValidatorFormBuilderService](#using-classvalidatorformbuilderservice)
      - [Using ClassValidatorFormGroup class](#using-classvalidatorformgroup-class)
    - [Add custom validators](#add-custom-validators)
      - [Providing validators when creating the ClassValidatorFormControl](#providing-validators-when-creating-the-classvalidatorformcontrol)
      - [Providing validators using  `setValidators`/`setValidatorsWithDynamicValidation`  methods](#providing-validators-using-setvalidatorssetvalidatorswithdynamicvalidation-methods)
  -  [Available classes](#available-classes)
	  - [ClassValidatorFormBuilderModule](#classvalidatorformbuildermodule)
	  - [ClassValidatorFormBuilderService](#classvalidatorformbuilderservice)
		  - [classType parameter](#classtype-parameter)
	  - [ClassValidatorFormGroup](#classvalidatorformgroup)
  - [Stackblitz example](https://stackblitz.com/edit/ngx-reactive-form-class-validator-4pbcrp)
  - [Developer note](#developer-note)
  
## Installation

    npm install --save ngx-reactive-form-class-validator
    
    // OR
    
    yarn add ngx-reactive-form-class-validator
### Peer dependencies
    "@angular/common": ">= 2.0.0 <= ^17.0.0",
    "@angular/core": ">= 2.0.0 <= ^17.0.0",
    "@angular/forms": ">= 2.0.0 <= ^17.0.0",
    "class-validator": "^0.12.2"

## Usage
### Defining classes with validators and deserializers
**Please note that properties without a class-validator decorator will not be validated, see [class-validator](https://github.com/typestack/class-validator)**
profile.ts

    import { IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';  
      
    class Profile {  
      @IsNotEmpty()  
      public firstName: string;  
      
      @IsNotEmpty()  
      public lastName: string;  

      @IsEmail()  
      public email: string;  	
      
      @ValidateNested()  
      public address: Address;  
    }
address.ts
      
    import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';  
    
    class Address {  
      @IsNotEmpty()  
      public street: string;  
      
      @IsNotEmpty()  
      public city: string;  
      
      @IsOptional()  
      public state: string;  
      
      @IsNotEmpty()  
      public zip: string;  
    } 

### Untyped classes
Untyped version of ngx-class-validator form classes exist in order to be backward compatible with angular untyped form classes
### Creating a ClassValidatorFormGroup
#### Using ClassValidatorFormBuilderService
As described [here](#classvalidatorformbuilderservice) to be able to use the `ClassValidatorFormBuilderService`, you need to import [ClassValidatorFormBuilderModule](#classvalidatorformbuildermodule).

app.module.ts

    imports: [  
      ...
      ClassValidatorFormBuilderModule.forRoot(),  
      ...
    ],
Then in your component
profile-form.component.ts

    public constructor(  
     private fb: ClassValidatorFormBuilderService,  
    ) { }
    
     profileForm =  this.fb.group(Profile,
	    {
	     firstName:  [''],
	     lastName:  [''],
	     email: [''],
	     address: this.fb.group(Address,
		      {
			      street:  [''],
			      city:  [''],
			      state:  [''],
			      zip:  ['']
			  }
		  ),
	    });
#### Using ClassValidatorFormGroup class
As it's possible with angular `FormGroup` class we can directly create a `ClassValidatorFormGroup` using the constructor


    export class ProfileFormComponent {
      profileForm = new ClassValidatorFormGroup({
        firstName: new ClassValidatorFormControl(''),
        lastName: new ClassValidatorFormControl(''),
      });
    }

Now, setting value to any of form controls, will perfom the validator set in the corresponding class.

    this.profileForm.controls.email.setValue('notEmailValue');
    console.log(this.profileForm.controls.email) // { isEmail: 'email must be an email' }
	
	this.profileForm.controls.email.setValue('email@email.com');
    console.log(this.profileForm.controls.email) // null
### Add custom validators
It is possible as well to combine dynamic validation with custom validation.
There are several ways to do it:
#### Providing validators when creating the ClassValidatorFormControl

    this.fb.group (Profile, {  
	      email: ['', Validators.required],
	      ...
      }
	)

	// OR
	
	new ClassValidatorFormGroup(Profile, {
		email: new ClassValidatorFormControl('', Validators.required)
	})
#### Providing validators using `setValidators`/`setValidatorsWithDynamicValidation` methods
Both `setValidators` and `setValidatorsWithDynamicValidation` replace validators provided in parameter, the only one difference is that `setValidatorsWithDynamicValidation` add given validators as well as re-enable dynamic validation, as the `setValidators` method replace validators with given ones without re-enabling dynamic validation.

    emailControl.setValidators(Validators.required); // there will be only Validators.required validator

	emailControl.setValidatorsWithDynamicValidation(Validators.required) // there will be Validaros.required validator as well as dynamic validator



## Available classes
### ClassValidatorFormBuilderModule
An Angular module that provides [ClassValidatorFormBuilderService](#classvalidatorformbuilderservice) for dependency injection.
It can either be imported `forRoot` or normally (We don't recommend importing it normally because that will create multiple instances of [ClassValidatorFormBuilderService](#classvalidatorformbuilderservice)).

app.module.ts

    imports: [  
      ...
      ClassValidatorFormBuilderModule.forRoot(),  
      ...
    ],
### ClassValidatorFormBuilderService
An Angular injectable service having the same methods as Angular [FormBuilder](https://angular.io/api/forms/FormBuilder) except a minor change of `group` method signature, see below:

    group(  
      classType: ClassType<any>, // The class type of the form group value.
      // Angular FormBuilder group method parameters
      controlsConfig: { [p: string]: any },  
      options?: AbstractControlOptions | { [p: string]: any } | null,  
    ): ClassValidatorFormGroup;
    
#### classType parameter
We've introduced a new parameter called `classType` (a class type containing [class-validator](https://github.com/typestack/class-validator) decorators) that you should provide, to enable us to perform dynamic validations.
### ClassValidatorFormGroup
A typescript class extending angular [FormGroup](https://angular.io/api/forms/FormGroup) class, with a minor change of `constructor` signature, the [classType parameter](#classType-parameter).

    export class ClassValidatorFormGroup extends FormGroup {        
     public constructor(  
	      private readonly classType: ClassType<any>, 
	      // Angular FormGroup constructor parameters
	      controls: {  
	          [key: string]: AbstractControl;  
	      },  
	      validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,  
	      asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,  
      ) {  
        ... 
      }
### ClassValidatorFormControl
A typescript class extending angular [FormControl](https://angular.io/api/forms/FormControl) class, that will use the [classType](#classtype-parameter) instance to perform validations and assign validation errors to the `ClassValidatorFormControl`.

As it extends angular [FormControl](https://angular.io/api/forms/FormControl) class, it contains all `FormControl` methods, with a custom new method:

    setValidatorsWithDynamicValidation(newValidator: ValidatorFn | ValidatorFn[] | AbstractControlOptions | undefined): void

This method has the same signature as FormControl [setValidators](https://angular.io/api/forms/AbstractControl#setValidators) method. In addition it re-enables dynamic validation when disabled.

## Developer note
We are open for proposals, so please don't hesitate to create issues if you want to report any bugs/proposals/feature requests.
