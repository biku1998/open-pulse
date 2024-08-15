import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Request } from 'src/types/express';
import { Database } from 'src/types/supabase-db';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly databaseService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = this.extractApiKeyFromHeader(request);

    if (!apiKey) throw new UnauthorizedException();

    try {
      const results = await this.databaseService.sql<
        Pick<
          Database['public']['Tables']['tokens']['Row'],
          'id' | 'created_by'
        >[]
      >`
      SELECT id,created_by FROM public.tokens WHERE value=${apiKey} AND is_active=true;
      `;

      if (results.length === 0)
        throw new UnauthorizedException('invalid or in-active api key');

      const token = results[0];

      request['token'] = {
        id: token.id,
        createdBy: token.created_by,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException();
    }
  }

  private extractApiKeyFromHeader(request: Request): string | undefined {
    const apiKey = request.headers['api-key'];

    if (!apiKey) return undefined;
    if (typeof apiKey !== 'string') return undefined;

    return apiKey;
  }
}
