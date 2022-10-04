import * as dotenv from 'dotenv';
import * as Joi from 'joi';

export interface DBConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  name: string;
}

export class ConfigService {
  private readonly envConfig: dotenv.DotenvParseOutput;
  private readonly validationScheme = {
    SERVER_PORT: Joi.number().default(3000),
    BASE_PATH: Joi.string().default('/'),

    JWT_SECRET: Joi.string().default('mysecret'),
    JWT_EXPIRATION_TIME: Joi.string().default('1h'),

    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USER: Joi.optional(),
    DB_PASS: Joi.optional(),
    DB_NAME: Joi.string().required(),

    SWAGGER_PATH: Joi.string().default('/'),
  };

  constructor() {
    const nodeEnv = this.nodeEnv;
    // Try to load environment config base on current NODE_ENV
    let envConfigPath = `.${nodeEnv}.env`;
    let config = dotenv.config({ path: envConfigPath });

    if (config.error) {
      envConfigPath = '.env';
      config = dotenv.config({ path: envConfigPath });
      if (config.error) {
        throw new Error('No .env found');
      }
    }
    // console.log(process.env, config);
    this.envConfig = this.validateInput(process.env);
    // tslint:disable-next-line: no-console
    console.log(`Loaded config file at path: ${envConfigPath}`);
  }

  public get(key: string): string {
    return process.env[key];
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV') || 'development';
  }

  get jwt() {
    return {
      accessTokenSecret: this.envConfig.JWT_SECRET,
      accessTokenExpireTime: this.envConfig.JWT_EXPIRATION_TIME,
    }
  }

  get swaggerPath(): string {
    return this.envConfig.SWAGGER_PATH;
  }

  get port(): number {
    return Number(this.envConfig.SERVER_PORT);
  }

  get db(): DBConfig {
    return {
      host: String(this.envConfig.DB_HOST),
      port: Number(this.envConfig.DB_PORT),
      user: String(this.envConfig.DB_USER),
      pass: String(this.envConfig.DB_PASS),
      name: String(this.envConfig.DB_NAME),
    };
  }

  private validateInput(envConfig: dotenv.DotenvParseOutput): dotenv.DotenvParseOutput {
    const envVarsSchema: Joi.ObjectSchema = Joi.object(this.validationScheme);

    const result = envVarsSchema.validate(envConfig, { allowUnknown: true });
    if (result.error) {
      throw new Error(`Config validation error: ${result.error.message}`);
    }
    return result.value;
  }
}