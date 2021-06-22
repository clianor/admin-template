import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { cloneDeepWith } from 'lodash';
import { Logging } from '@server/entities/logging.entity';
import { deepOmit } from '@server/common/utils';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Logging)
    private readonly loggingRepository: Repository<Logging>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const node_env = this.configService.get('NODE_ENV');
    const now = Date.now();

    const { contextType, args } = context as any;

    const inputArgs = cloneDeepWith(args[1]);
    const omittedInputArgs = deepOmit(inputArgs, 'password');

    const { originalUrl, session, headers, socket } = args[2].req;
    const ip = headers['x-forwarded-for'] || socket.remoteAddress;

    return next.handle().pipe(
      tap(
        (response) => {
          console.log(`After... ${originalUrl} ${Date.now() - now}ms`);

          this.loggingRepository
            .save(
              this.loggingRepository.create({
                contextType,
                accessIP: ip,
                inputArgs: JSON.stringify(omittedInputArgs),
                responseStatus: null,
                response: JSON.stringify(response),
                user: session.user,
              }),
            )
            .catch((e) => {
              if (node_env !== 'production') {
                console.error('logging error: ', e);
              }
            });
        },
        (error) => {
          console.log(`After... ${originalUrl} ${Date.now() - now}ms`);
          const { status, response } = error;

          this.loggingRepository
            .save(
              this.loggingRepository.create({
                contextType,
                accessIP: ip,
                inputArgs: JSON.stringify(omittedInputArgs),
                responseStatus: status,
                response: JSON.stringify(response),
                user: session.user,
              }),
            )
            .catch((e) => {
              if (node_env !== 'production') {
                console.error('logging error: ', e);
              }
            });
        },
      ),
    );
  }
}
