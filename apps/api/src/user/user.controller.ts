import { AccessTokenGuard } from '@app/common/guards';
import { AuthenticatedRequest } from '@app/common/types';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AccessTokenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  async getMe(@Req() req: AuthenticatedRequest) {
    return this.userService.findById(req.user.userId);
  }
}
