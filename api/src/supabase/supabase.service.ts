import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Database } from 'src/types/supabase-db';

@Injectable()
export class SupabaseService {
  constructor(private readonly configService: ConfigService) {}

  getServiceClient(): SupabaseClient<Database> {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL', '');
    const supabaseServiceRoleKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
      '',
    );
    return createClient(supabaseUrl, supabaseServiceRoleKey);
  }
}
