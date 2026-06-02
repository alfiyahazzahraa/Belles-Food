import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'KUNCI_RAHASIA_SUPER_AMAN',
    });
  }

  async validate(payload: {
  userId: number;
  username: string;
  role: string;
}) {

  console.log('JWT PAYLOAD:', payload);

  const user = await this.prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
  });

  if (!user) {
    throw new UnauthorizedException(
      'User tidak ditemukan',
    );
  }

  return {
    userId: user.id,
    username: user.username,
    role: user.role,
  };
}
}