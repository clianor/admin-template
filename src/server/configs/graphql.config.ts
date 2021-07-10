import { GraphQLModule } from '@nestjs/graphql';

export default GraphQLModule.forRoot({
  autoSchemaFile: true,
  context: ({ req }) => {
    return {
      cookies: req.cookies,
      session: req.session,
    };
  },
  debug: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production' && {
    settings: {
      'request.credentials': 'include',
    },
  },
});
