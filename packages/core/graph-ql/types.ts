// types.ts

export interface GraphQLConfig {
  path: string;
  typeDefs: string;
  resolvers: any;
  enablePlayground: boolean,
  context: (context: any) => Promise<any>;
}
