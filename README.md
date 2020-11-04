
# ngx-reactive-form-class-validator
A lightweight library for dynamically validate Angular reactive forms using [class-validator](https://github.com/typestack/class-validator) library.

<p>
  <a href="https://www.npmjs.com/package/ngx-reactive-form-class-validator">
    <img src="https://img.shields.io/npm/v/ngx-reactive-form-class-validator?color=green" alt="npm version" />
  </a>&nbsp;
  <a href="https://www.npmjs.com/package/ngx-reactive-form-class-validator">
    <img src="https://img.shields.io/bundlephobia/min/ngx-reactive-form-class-validator" alt="npm minified size" />
  </a>&nbsp;
</p>

## Table of contents
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
	  - [Peer dependencies](#peer-dependencies)
  - [Usage](#usage)
	  - [Defining classes with validators and deserializers](#defining-classes-with-validators-and-deserializers)
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
  - [Developer note](#developer-note)
  
## Installation

    npm install --save ngx-reactive-form-class-validator
### Peer dependencies
    "@angular/common": "^10.0.0",  
    "@angular/core": "^10.0.0",  
    "@angular/forms": "^10.0.0",  
    "class-validator": "^0.12.2",  
    "cerialize": "^0.1.18"

## Usage
### Defining classes with validators and deserializers
**Please note that properties without a deserialize decorator will not be validated, see [cerialize](https://github.com/weichx/cerialize#readme)**
profile.ts

    import { deserialize, deserializeAs } from 'cerialize';  
    import { IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';  
      
    class Profile {  
      @deserialize  
      @IsNotEmpty()  
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
address.ts
      
    import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';  
    
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

### Creating a ClassValidatorFormGroup
#### Using ClassValidatorFormBuilderService
As described [here](#classvalidatorformbuilderservice) to be able to use the `ClassValidatorFormBuilderService`, you need to import [ClassValidatorFormBuilderModule](#classvalidatorformbuildermodule).

app.module.ts

    imports: [  
      ...
      DynamicFormBuilderModule.forRoot(),  
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
As it's possible with angular `FormGroup` class we can directly create a using the constructor/


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
      DynamicFormBuilderModule.forRoot(),  
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
A typescript class extending angular [FormGroup](https://angular.io/api/forms/FormGroup) class, with a minor change of `constructor` signautre, the [classType parameter](#classType-parameter).

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
