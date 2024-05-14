import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/auth.guard';

export const Auth = () => UseGuards(JwtAuthGuard);
