import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[appDynamicComponent]',
  standalone: true,
})
export class DynamicComponentDirective {
  @Input() component: any; // The dynamic component class

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {}

  ngOnChanges() {
    if (this.component) {
      // Create a component factory for the dynamic component
      const componentFactory =
        this.componentFactoryResolver.resolveComponentFactory(this.component);

      // Clear any previous components in the view container
      this.viewContainerRef.clear();

      // Create and attach the dynamic component to the view container
      const componentRef: ComponentRef<any> = componentFactory.create(
        this.viewContainerRef.injector,
      );
      this.viewContainerRef.insert(componentRef.hostView);
    }
  }
}
