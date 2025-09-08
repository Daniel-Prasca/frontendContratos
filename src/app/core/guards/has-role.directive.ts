import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  ChangeDetectorRef,
  OnDestroy,
  NgZone,
} from '@angular/core';


import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthStateService } from '../../shared/services/auth-state.service';
import { UserDto, UserRole } from '../interfaces/auth.models';

@Directive({
  selector: '[hasRole]',
})
export class HasRoleDirective implements OnDestroy {
  private currentUserRole: UserRole | null = null;
  private destroy$ = new Subject<void>();
  private requiredRoles: UserRole[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authStateService: AuthStateService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {


    this.authStateService.user$
    .pipe(takeUntil(this.destroy$))
    .subscribe((userData: UserDto | null) => {
      this.currentUserRole = userData?.role as UserRole || null;
      this.updateView();
      this.cdr.markForCheck();
    });

  }

  @Input()
  set hasRole(roles: UserRole[]) {
    this.requiredRoles = roles;
    this.updateView();
  }

  private updateView(): void {
    this.viewContainer.clear();

    if (this.requiredRoles.includes(this.currentUserRole as UserRole)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
