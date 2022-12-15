import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';

export const RoleGuard = (role?: string): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthenticationGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      const user = request.user;
      return role ? role === user?.role?.name : true;
    }
  }

  return mixin(RoleGuardMixin);
};
