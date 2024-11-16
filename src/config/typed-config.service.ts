import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config.types';

export class TypedConfigService extends ConfigService<ConfigType> {}
