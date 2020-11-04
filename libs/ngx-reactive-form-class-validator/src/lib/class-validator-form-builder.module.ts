import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassValidatorFormBuilderService } from './class-validator-form-builder.service';

@NgModule({
  imports: [CommonModule],
  providers: [ClassValidatorFormBuilderService],
})
export class ClassValidatorFormBuilderModule {
  public static forRoot(): ModuleWithProviders<ClassValidatorFormBuilderModule> {
    return {
      ngModule: ClassValidatorFormBuilderModule,
      providers: [
        ClassValidatorFormBuilderService,
      ],
    };
  }
}
