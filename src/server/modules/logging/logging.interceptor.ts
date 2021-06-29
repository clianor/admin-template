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
import { Logs } from '@server/entities/logs.entity';
import { deepOmit } from '@server/commons/utils';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Logs)
    private readonly loggingRepository: Repository<Logs>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const node_env = this.configService.get('NODE_ENV');
    const now = Date.now();

    const { contextType, args } = context as any;

    const inputArgs = cloneDeepWith(args[1]);
    const omittedInputArgs = deepOmit(inputArgs, 'password');

    const { originalUrl, session, headers, socket } = args[2].req;
    const { fieldName } = args[3];

    let ip = headers['x-forwarded-for'] || socket.remoteAddress;
    if (ip.substr(0, 7) === '::ffff:') {
      ip = ip.substr(7);
    }

    return next.handle().pipe(
      tap(
        () => {
          console.log(`After... ${originalUrl} ${Date.now() - now}ms`);

          this.loggingRepository
            .save(
              this.loggingRepository.create({
                contextType,
                accessIP: ip,
                fieldName,
                inputArgs: JSON.stringify(omittedInputArgs),
                responseStatus: null,
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
                fieldName,
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
