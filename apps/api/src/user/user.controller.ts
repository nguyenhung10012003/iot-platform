import { HasAnyRole } from '@app/common/decorators/has-role.decorator';
import { AccessTokenGuard } from '@app/common/guards';
import { AuthenticatedRequest } from '@app/common/types';
import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AccessTokenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  async getMe(@Req() req: AuthenticatedRequest) {
    return this.userService.findById(req.user.userId);
  }

  @Get()
  @HasAnyRole('ADMIN')
  async getAll(@Req() req: AuthenticatedRequest) {
    return this.userService.find({
      where: {
        role: 'USER',
      },
    });
  }

  @Get('/search')
  async search(@Req() req: AuthenticatedRequest, @Query('q') query: string) {
    return this.userService.search(query);
  }

  @Get('/:userId')
  async getUser(@Req() req: AuthenticatedRequest, @Param('userId') userId: string) {
    return this.userService.findById(userId);
  }
}
