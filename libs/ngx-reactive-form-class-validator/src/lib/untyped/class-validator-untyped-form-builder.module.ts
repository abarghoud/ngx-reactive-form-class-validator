import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassValidatorUntypedFormBuilderService } from './class-validator-untyped-form-builder.service';

@NgModule({
  imports: [CommonModule],
  providers: [ClassValidatorUntypedFormBuilderService],
})
export class ClassValidatorUntypedFormBuilderModule {
  public static forRoot(): ModuleWithProviders<ClassValidatorUntypedFormBuilderModule> {
    return {
      ngModule: ClassValidatorUntypedFormBuilderModule,
      providers: [
        ClassValidatorUntypedFormBuilderService,
      ],
    };
  }
}
