import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // Hardcoded admin credentials for now
  private readonly ADMIN_USERNAME = 'admin';
  private readonly ADMIN_PASSWORD_HASH =
    '$2b$10$EKY6HbLyqwNK5zVszjSDTe7xR4NU1ov6SH5QV0/haYscuPbVaTCPy'; // We'll generate this

  constructor(private jwtService: JwtService) {}

  async login(username: string, password: string) {
    // Check username
    if (username !== this.ADMIN_USERNAME) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      password,
      this.ADMIN_PASSWORD_HASH,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { username, sub: 1, role: 'admin' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
