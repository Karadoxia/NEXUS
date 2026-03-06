
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Performance
 * persisted agent performance metrics that the leader uses for learning
 */
export type Performance = $Result.DefaultSelection<Prisma.$PerformancePayload>
/**
 * Model AgentJob
 * 
 */
export type AgentJob = $Result.DefaultSelection<Prisma.$AgentJobPayload>
/**
 * Model AgentConfig
 * 
 */
export type AgentConfig = $Result.DefaultSelection<Prisma.$AgentConfigPayload>
/**
 * Model AgentResult
 * 
 */
export type AgentResult = $Result.DefaultSelection<Prisma.$AgentResultPayload>
/**
 * Model ContainerRegistry
 * Track all Docker containers registered in infrastructure
 */
export type ContainerRegistry = $Result.DefaultSelection<Prisma.$ContainerRegistryPayload>
/**
 * Model RegistrationEvent
 * Track registration events for containers
 */
export type RegistrationEvent = $Result.DefaultSelection<Prisma.$RegistrationEventPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const AgentStatus: {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type AgentStatus = (typeof AgentStatus)[keyof typeof AgentStatus]

}

export type AgentStatus = $Enums.AgentStatus

export const AgentStatus: typeof $Enums.AgentStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Performances
 * const performances = await prisma.performance.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Performances
   * const performances = await prisma.performance.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.performance`: Exposes CRUD operations for the **Performance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Performances
    * const performances = await prisma.performance.findMany()
    * ```
    */
  get performance(): Prisma.PerformanceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.agentJob`: Exposes CRUD operations for the **AgentJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgentJobs
    * const agentJobs = await prisma.agentJob.findMany()
    * ```
    */
  get agentJob(): Prisma.AgentJobDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.agentConfig`: Exposes CRUD operations for the **AgentConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgentConfigs
    * const agentConfigs = await prisma.agentConfig.findMany()
    * ```
    */
  get agentConfig(): Prisma.AgentConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.agentResult`: Exposes CRUD operations for the **AgentResult** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgentResults
    * const agentResults = await prisma.agentResult.findMany()
    * ```
    */
  get agentResult(): Prisma.AgentResultDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.containerRegistry`: Exposes CRUD operations for the **ContainerRegistry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ContainerRegistries
    * const containerRegistries = await prisma.containerRegistry.findMany()
    * ```
    */
  get containerRegistry(): Prisma.ContainerRegistryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.registrationEvent`: Exposes CRUD operations for the **RegistrationEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RegistrationEvents
    * const registrationEvents = await prisma.registrationEvent.findMany()
    * ```
    */
  get registrationEvent(): Prisma.RegistrationEventDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Performance: 'Performance',
    AgentJob: 'AgentJob',
    AgentConfig: 'AgentConfig',
    AgentResult: 'AgentResult',
    ContainerRegistry: 'ContainerRegistry',
    RegistrationEvent: 'RegistrationEvent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "performance" | "agentJob" | "agentConfig" | "agentResult" | "containerRegistry" | "registrationEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Performance: {
        payload: Prisma.$PerformancePayload<ExtArgs>
        fields: Prisma.PerformanceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PerformanceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PerformanceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformancePayload>
          }
          findFirst: {
            args: Prisma.PerformanceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PerformanceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformancePayload>
          }
          findMany: {
            args: Prisma.PerformanceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformancePayload>[]
          }
          create: {
            args: Prisma.PerformanceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformancePayload>
          }
          createMany: {
            args: Prisma.PerformanceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PerformanceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformancePayload>[]
          }
          delete: {
            args: Prisma.PerformanceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformancePayload>
          }
          update: {
            args: Prisma.PerformanceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformancePayload>
          }
          deleteMany: {
            args: Prisma.PerformanceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PerformanceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PerformanceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformancePayload>[]
          }
          upsert: {
            args: Prisma.PerformanceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformancePayload>
          }
          aggregate: {
            args: Prisma.PerformanceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePerformance>
          }
          groupBy: {
            args: Prisma.PerformanceGroupByArgs<ExtArgs>
            result: $Utils.Optional<PerformanceGroupByOutputType>[]
          }
          count: {
            args: Prisma.PerformanceCountArgs<ExtArgs>
            result: $Utils.Optional<PerformanceCountAggregateOutputType> | number
          }
        }
      }
      AgentJob: {
        payload: Prisma.$AgentJobPayload<ExtArgs>
        fields: Prisma.AgentJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgentJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgentJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentJobPayload>
          }
          findFirst: {
            args: Prisma.AgentJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgentJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentJobPayload>
          }
          findMany: {
            args: Prisma.AgentJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentJobPayload>[]
          }
          create: {
            args: Prisma.AgentJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentJobPayload>
          }
          createMany: {
            args: Prisma.AgentJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgentJobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentJobPayload>[]
          }
          delete: {
            args: Prisma.AgentJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentJobPayload>
          }
          update: {
            args: Prisma.AgentJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentJobPayload>
          }
          deleteMany: {
            args: Prisma.AgentJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgentJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AgentJobUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentJobPayload>[]
          }
          upsert: {
            args: Prisma.AgentJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentJobPayload>
          }
          aggregate: {
            args: Prisma.AgentJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgentJob>
          }
          groupBy: {
            args: Prisma.AgentJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgentJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgentJobCountArgs<ExtArgs>
            result: $Utils.Optional<AgentJobCountAggregateOutputType> | number
          }
        }
      }
      AgentConfig: {
        payload: Prisma.$AgentConfigPayload<ExtArgs>
        fields: Prisma.AgentConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgentConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgentConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentConfigPayload>
          }
          findFirst: {
            args: Prisma.AgentConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgentConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentConfigPayload>
          }
          findMany: {
            args: Prisma.AgentConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentConfigPayload>[]
          }
          create: {
            args: Prisma.AgentConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentConfigPayload>
          }
          createMany: {
            args: Prisma.AgentConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgentConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentConfigPayload>[]
          }
          delete: {
            args: Prisma.AgentConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentConfigPayload>
          }
          update: {
            args: Prisma.AgentConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentConfigPayload>
          }
          deleteMany: {
            args: Prisma.AgentConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgentConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AgentConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentConfigPayload>[]
          }
          upsert: {
            args: Prisma.AgentConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentConfigPayload>
          }
          aggregate: {
            args: Prisma.AgentConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgentConfig>
          }
          groupBy: {
            args: Prisma.AgentConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgentConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgentConfigCountArgs<ExtArgs>
            result: $Utils.Optional<AgentConfigCountAggregateOutputType> | number
          }
        }
      }
      AgentResult: {
        payload: Prisma.$AgentResultPayload<ExtArgs>
        fields: Prisma.AgentResultFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgentResultFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentResultPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgentResultFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentResultPayload>
          }
          findFirst: {
            args: Prisma.AgentResultFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentResultPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgentResultFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentResultPayload>
          }
          findMany: {
            args: Prisma.AgentResultFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentResultPayload>[]
          }
          create: {
            args: Prisma.AgentResultCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentResultPayload>
          }
          createMany: {
            args: Prisma.AgentResultCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgentResultCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentResultPayload>[]
          }
          delete: {
            args: Prisma.AgentResultDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentResultPayload>
          }
          update: {
            args: Prisma.AgentResultUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentResultPayload>
          }
          deleteMany: {
            args: Prisma.AgentResultDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgentResultUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AgentResultUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentResultPayload>[]
          }
          upsert: {
            args: Prisma.AgentResultUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentResultPayload>
          }
          aggregate: {
            args: Prisma.AgentResultAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgentResult>
          }
          groupBy: {
            args: Prisma.AgentResultGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgentResultGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgentResultCountArgs<ExtArgs>
            result: $Utils.Optional<AgentResultCountAggregateOutputType> | number
          }
        }
      }
      ContainerRegistry: {
        payload: Prisma.$ContainerRegistryPayload<ExtArgs>
        fields: Prisma.ContainerRegistryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContainerRegistryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContainerRegistryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContainerRegistryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContainerRegistryPayload>
          }
          findFirst: {
            args: Prisma.ContainerRegistryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContainerRegistryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContainerRegistryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContainerRegistryPayload>
          }
          findMany: {
            args: Prisma.ContainerRegistryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContainerRegistryPayload>[]
          }
          create: {
            args: Prisma.ContainerRegistryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContainerRegistryPayload>
          }
          createMany: {
            args: Prisma.ContainerRegistryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContainerRegistryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContainerRegistryPayload>[]
          }
          delete: {
            args: Prisma.ContainerRegistryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContainerRegistryPayload>
          }
          update: {
            args: Prisma.ContainerRegistryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContainerRegistryPayload>
          }
          deleteMany: {
            args: Prisma.ContainerRegistryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContainerRegistryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ContainerRegistryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContainerRegistryPayload>[]
          }
          upsert: {
            args: Prisma.ContainerRegistryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContainerRegistryPayload>
          }
          aggregate: {
            args: Prisma.ContainerRegistryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContainerRegistry>
          }
          groupBy: {
            args: Prisma.ContainerRegistryGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContainerRegistryGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContainerRegistryCountArgs<ExtArgs>
            result: $Utils.Optional<ContainerRegistryCountAggregateOutputType> | number
          }
        }
      }
      RegistrationEvent: {
        payload: Prisma.$RegistrationEventPayload<ExtArgs>
        fields: Prisma.RegistrationEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RegistrationEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RegistrationEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationEventPayload>
          }
          findFirst: {
            args: Prisma.RegistrationEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RegistrationEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationEventPayload>
          }
          findMany: {
            args: Prisma.RegistrationEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationEventPayload>[]
          }
          create: {
            args: Prisma.RegistrationEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationEventPayload>
          }
          createMany: {
            args: Prisma.RegistrationEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RegistrationEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationEventPayload>[]
          }
          delete: {
            args: Prisma.RegistrationEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationEventPayload>
          }
          update: {
            args: Prisma.RegistrationEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationEventPayload>
          }
          deleteMany: {
            args: Prisma.RegistrationEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RegistrationEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RegistrationEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationEventPayload>[]
          }
          upsert: {
            args: Prisma.RegistrationEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegistrationEventPayload>
          }
          aggregate: {
            args: Prisma.RegistrationEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRegistrationEvent>
          }
          groupBy: {
            args: Prisma.RegistrationEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<RegistrationEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.RegistrationEventCountArgs<ExtArgs>
            result: $Utils.Optional<RegistrationEventCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    performance?: PerformanceOmit
    agentJob?: AgentJobOmit
    agentConfig?: AgentConfigOmit
    agentResult?: AgentResultOmit
    containerRegistry?: ContainerRegistryOmit
    registrationEvent?: RegistrationEventOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ContainerRegistryCountOutputType
   */

  export type ContainerRegistryCountOutputType = {
    events: number
  }

  export type ContainerRegistryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | ContainerRegistryCountOutputTypeCountEventsArgs
  }

  // Custom InputTypes
  /**
   * ContainerRegistryCountOutputType without action
   */
  export type ContainerRegistryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContainerRegistryCountOutputType
     */
    select?: ContainerRegistryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ContainerRegistryCountOutputType without action
   */
  export type ContainerRegistryCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RegistrationEventWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Performance
   */

  export type AggregatePerformance = {
    _count: PerformanceCountAggregateOutputType | null
    _avg: PerformanceAvgAggregateOutputType | null
    _sum: PerformanceSumAggregateOutputType | null
    _min: PerformanceMinAggregateOutputType | null
    _max: PerformanceMaxAggregateOutputType | null
  }

  export type PerformanceAvgAggregateOutputType = {
    orders: number | null
    returns: number | null
  }

  export type PerformanceSumAggregateOutputType = {
    orders: number | null
    returns: number | null
  }

  export type PerformanceMinAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    orders: number | null
    returns: number | null
    downtime: boolean | null
    notes: string | null
  }

  export type PerformanceMaxAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    orders: number | null
    returns: number | null
    downtime: boolean | null
    notes: string | null
  }

  export type PerformanceCountAggregateOutputType = {
    id: number
    timestamp: number
    orders: number
    returns: number
    downtime: number
    notes: number
    _all: number
  }


  export type PerformanceAvgAggregateInputType = {
    orders?: true
    returns?: true
  }

  export type PerformanceSumAggregateInputType = {
    orders?: true
    returns?: true
  }

  export type PerformanceMinAggregateInputType = {
    id?: true
    timestamp?: true
    orders?: true
    returns?: true
    downtime?: true
    notes?: true
  }

  export type PerformanceMaxAggregateInputType = {
    id?: true
    timestamp?: true
    orders?: true
    returns?: true
    downtime?: true
    notes?: true
  }

  export type PerformanceCountAggregateInputType = {
    id?: true
    timestamp?: true
    orders?: true
    returns?: true
    downtime?: true
    notes?: true
    _all?: true
  }

  export type PerformanceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Performance to aggregate.
     */
    where?: PerformanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Performances to fetch.
     */
    orderBy?: PerformanceOrderByWithRelationInput | PerformanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PerformanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Performances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Performances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Performances
    **/
    _count?: true | PerformanceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PerformanceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PerformanceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PerformanceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PerformanceMaxAggregateInputType
  }

  export type GetPerformanceAggregateType<T extends PerformanceAggregateArgs> = {
        [P in keyof T & keyof AggregatePerformance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePerformance[P]>
      : GetScalarType<T[P], AggregatePerformance[P]>
  }




  export type PerformanceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PerformanceWhereInput
    orderBy?: PerformanceOrderByWithAggregationInput | PerformanceOrderByWithAggregationInput[]
    by: PerformanceScalarFieldEnum[] | PerformanceScalarFieldEnum
    having?: PerformanceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PerformanceCountAggregateInputType | true
    _avg?: PerformanceAvgAggregateInputType
    _sum?: PerformanceSumAggregateInputType
    _min?: PerformanceMinAggregateInputType
    _max?: PerformanceMaxAggregateInputType
  }

  export type PerformanceGroupByOutputType = {
    id: string
    timestamp: Date
    orders: number
    returns: number
    downtime: boolean
    notes: string | null
    _count: PerformanceCountAggregateOutputType | null
    _avg: PerformanceAvgAggregateOutputType | null
    _sum: PerformanceSumAggregateOutputType | null
    _min: PerformanceMinAggregateOutputType | null
    _max: PerformanceMaxAggregateOutputType | null
  }

  type GetPerformanceGroupByPayload<T extends PerformanceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PerformanceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PerformanceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PerformanceGroupByOutputType[P]>
            : GetScalarType<T[P], PerformanceGroupByOutputType[P]>
        }
      >
    >


  export type PerformanceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    orders?: boolean
    returns?: boolean
    downtime?: boolean
    notes?: boolean
  }, ExtArgs["result"]["performance"]>

  export type PerformanceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    orders?: boolean
    returns?: boolean
    downtime?: boolean
    notes?: boolean
  }, ExtArgs["result"]["performance"]>

  export type PerformanceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    orders?: boolean
    returns?: boolean
    downtime?: boolean
    notes?: boolean
  }, ExtArgs["result"]["performance"]>

  export type PerformanceSelectScalar = {
    id?: boolean
    timestamp?: boolean
    orders?: boolean
    returns?: boolean
    downtime?: boolean
    notes?: boolean
  }

  export type PerformanceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "timestamp" | "orders" | "returns" | "downtime" | "notes", ExtArgs["result"]["performance"]>

  export type $PerformancePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Performance"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      timestamp: Date
      orders: number
      returns: number
      downtime: boolean
      notes: string | null
    }, ExtArgs["result"]["performance"]>
    composites: {}
  }

  type PerformanceGetPayload<S extends boolean | null | undefined | PerformanceDefaultArgs> = $Result.GetResult<Prisma.$PerformancePayload, S>

  type PerformanceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PerformanceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PerformanceCountAggregateInputType | true
    }

  export interface PerformanceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Performance'], meta: { name: 'Performance' } }
    /**
     * Find zero or one Performance that matches the filter.
     * @param {PerformanceFindUniqueArgs} args - Arguments to find a Performance
     * @example
     * // Get one Performance
     * const performance = await prisma.performance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PerformanceFindUniqueArgs>(args: SelectSubset<T, PerformanceFindUniqueArgs<ExtArgs>>): Prisma__PerformanceClient<$Result.GetResult<Prisma.$PerformancePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Performance that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PerformanceFindUniqueOrThrowArgs} args - Arguments to find a Performance
     * @example
     * // Get one Performance
     * const performance = await prisma.performance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PerformanceFindUniqueOrThrowArgs>(args: SelectSubset<T, PerformanceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PerformanceClient<$Result.GetResult<Prisma.$PerformancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Performance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceFindFirstArgs} args - Arguments to find a Performance
     * @example
     * // Get one Performance
     * const performance = await prisma.performance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PerformanceFindFirstArgs>(args?: SelectSubset<T, PerformanceFindFirstArgs<ExtArgs>>): Prisma__PerformanceClient<$Result.GetResult<Prisma.$PerformancePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Performance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceFindFirstOrThrowArgs} args - Arguments to find a Performance
     * @example
     * // Get one Performance
     * const performance = await prisma.performance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PerformanceFindFirstOrThrowArgs>(args?: SelectSubset<T, PerformanceFindFirstOrThrowArgs<ExtArgs>>): Prisma__PerformanceClient<$Result.GetResult<Prisma.$PerformancePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Performances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Performances
     * const performances = await prisma.performance.findMany()
     * 
     * // Get first 10 Performances
     * const performances = await prisma.performance.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const performanceWithIdOnly = await prisma.performance.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PerformanceFindManyArgs>(args?: SelectSubset<T, PerformanceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PerformancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Performance.
     * @param {PerformanceCreateArgs} args - Arguments to create a Performance.
     * @example
     * // Create one Performance
     * const Performance = await prisma.performance.create({
     *   data: {
     *     // ... data to create a Performance
     *   }
     * })
     * 
     */
    create<T extends PerformanceCreateArgs>(args: SelectSubset<T, PerformanceCreateArgs<ExtArgs>>): Prisma__PerformanceClient<$Result.GetResult<Prisma.$PerformancePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Performances.
     * @param {PerformanceCreateManyArgs} args - Arguments to create many Performances.
     * @example
     * // Create many Performances
     * const performance = await prisma.performance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PerformanceCreateManyArgs>(args?: SelectSubset<T, PerformanceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Performances and returns the data saved in the database.
     * @param {PerformanceCreateManyAndReturnArgs} args - Arguments to create many Performances.
     * @example
     * // Create many Performances
     * const performance = await prisma.performance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Performances and only return the `id`
     * const performanceWithIdOnly = await prisma.performance.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PerformanceCreateManyAndReturnArgs>(args?: SelectSubset<T, PerformanceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PerformancePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Performance.
     * @param {PerformanceDeleteArgs} args - Arguments to delete one Performance.
     * @example
     * // Delete one Performance
     * const Performance = await prisma.performance.delete({
     *   where: {
     *     // ... filter to delete one Performance
     *   }
     * })
     * 
     */
    delete<T extends PerformanceDeleteArgs>(args: SelectSubset<T, PerformanceDeleteArgs<ExtArgs>>): Prisma__PerformanceClient<$Result.GetResult<Prisma.$PerformancePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Performance.
     * @param {PerformanceUpdateArgs} args - Arguments to update one Performance.
     * @example
     * // Update one Performance
     * const performance = await prisma.performance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PerformanceUpdateArgs>(args: SelectSubset<T, PerformanceUpdateArgs<ExtArgs>>): Prisma__PerformanceClient<$Result.GetResult<Prisma.$PerformancePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Performances.
     * @param {PerformanceDeleteManyArgs} args - Arguments to filter Performances to delete.
     * @example
     * // Delete a few Performances
     * const { count } = await prisma.performance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PerformanceDeleteManyArgs>(args?: SelectSubset<T, PerformanceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Performances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Performances
     * const performance = await prisma.performance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PerformanceUpdateManyArgs>(args: SelectSubset<T, PerformanceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Performances and returns the data updated in the database.
     * @param {PerformanceUpdateManyAndReturnArgs} args - Arguments to update many Performances.
     * @example
     * // Update many Performances
     * const performance = await prisma.performance.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Performances and only return the `id`
     * const performanceWithIdOnly = await prisma.performance.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PerformanceUpdateManyAndReturnArgs>(args: SelectSubset<T, PerformanceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PerformancePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Performance.
     * @param {PerformanceUpsertArgs} args - Arguments to update or create a Performance.
     * @example
     * // Update or create a Performance
     * const performance = await prisma.performance.upsert({
     *   create: {
     *     // ... data to create a Performance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Performance we want to update
     *   }
     * })
     */
    upsert<T extends PerformanceUpsertArgs>(args: SelectSubset<T, PerformanceUpsertArgs<ExtArgs>>): Prisma__PerformanceClient<$Result.GetResult<Prisma.$PerformancePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Performances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceCountArgs} args - Arguments to filter Performances to count.
     * @example
     * // Count the number of Performances
     * const count = await prisma.performance.count({
     *   where: {
     *     // ... the filter for the Performances we want to count
     *   }
     * })
    **/
    count<T extends PerformanceCountArgs>(
      args?: Subset<T, PerformanceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PerformanceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Performance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PerformanceAggregateArgs>(args: Subset<T, PerformanceAggregateArgs>): Prisma.PrismaPromise<GetPerformanceAggregateType<T>>

    /**
     * Group by Performance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PerformanceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PerformanceGroupByArgs['orderBy'] }
        : { orderBy?: PerformanceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PerformanceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPerformanceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Performance model
   */
  readonly fields: PerformanceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Performance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PerformanceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Performance model
   */
  interface PerformanceFieldRefs {
    readonly id: FieldRef<"Performance", 'String'>
    readonly timestamp: FieldRef<"Performance", 'DateTime'>
    readonly orders: FieldRef<"Performance", 'Int'>
    readonly returns: FieldRef<"Performance", 'Int'>
    readonly downtime: FieldRef<"Performance", 'Boolean'>
    readonly notes: FieldRef<"Performance", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Performance findUnique
   */
  export type PerformanceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Performance
     */
    select?: PerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Performance
     */
    omit?: PerformanceOmit<ExtArgs> | null
    /**
     * Filter, which Performance to fetch.
     */
    where: PerformanceWhereUniqueInput
  }

  /**
   * Performance findUniqueOrThrow
   */
  export type PerformanceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Performance
     */
    select?: PerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Performance
     */
    omit?: PerformanceOmit<ExtArgs> | null
    /**
     * Filter, which Performance to fetch.
     */
    where: PerformanceWhereUniqueInput
  }

  /**
   * Performance findFirst
   */
  export type PerformanceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Performance
     */
    select?: PerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Performance
     */
    omit?: PerformanceOmit<ExtArgs> | null
    /**
     * Filter, which Performance to fetch.
     */
    where?: PerformanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Performances to fetch.
     */
    orderBy?: PerformanceOrderByWithRelationInput | PerformanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Performances.
     */
    cursor?: PerformanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Performances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Performances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Performances.
     */
    distinct?: PerformanceScalarFieldEnum | PerformanceScalarFieldEnum[]
  }

  /**
   * Performance findFirstOrThrow
   */
  export type PerformanceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Performance
     */
    select?: PerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Performance
     */
    omit?: PerformanceOmit<ExtArgs> | null
    /**
     * Filter, which Performance to fetch.
     */
    where?: PerformanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Performances to fetch.
     */
    orderBy?: PerformanceOrderByWithRelationInput | PerformanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Performances.
     */
    cursor?: PerformanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Performances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Performances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Performances.
     */
    distinct?: PerformanceScalarFieldEnum | PerformanceScalarFieldEnum[]
  }

  /**
   * Performance findMany
   */
  export type PerformanceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Performance
     */
    select?: PerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Performance
     */
    omit?: PerformanceOmit<ExtArgs> | null
    /**
     * Filter, which Performances to fetch.
     */
    where?: PerformanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Performances to fetch.
     */
    orderBy?: PerformanceOrderByWithRelationInput | PerformanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Performances.
     */
    cursor?: PerformanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Performances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Performances.
     */
    skip?: number
    distinct?: PerformanceScalarFieldEnum | PerformanceScalarFieldEnum[]
  }

  /**
   * Performance create
   */
  export type PerformanceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Performance
     */
    select?: PerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Performance
     */
    omit?: PerformanceOmit<ExtArgs> | null
    /**
     * The data needed to create a Performance.
     */
    data: XOR<PerformanceCreateInput, PerformanceUncheckedCreateInput>
  }

  /**
   * Performance createMany
   */
  export type PerformanceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Performances.
     */
    data: PerformanceCreateManyInput | PerformanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Performance createManyAndReturn
   */
  export type PerformanceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Performance
     */
    select?: PerformanceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Performance
     */
    omit?: PerformanceOmit<ExtArgs> | null
    /**
     * The data used to create many Performances.
     */
    data: PerformanceCreateManyInput | PerformanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Performance update
   */
  export type PerformanceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Performance
     */
    select?: PerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Performance
     */
    omit?: PerformanceOmit<ExtArgs> | null
    /**
     * The data needed to update a Performance.
     */
    data: XOR<PerformanceUpdateInput, PerformanceUncheckedUpdateInput>
    /**
     * Choose, which Performance to update.
     */
    where: PerformanceWhereUniqueInput
  }

  /**
   * Performance updateMany
   */
  export type PerformanceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Performances.
     */
    data: XOR<PerformanceUpdateManyMutationInput, PerformanceUncheckedUpdateManyInput>
    /**
     * Filter which Performances to update
     */
    where?: PerformanceWhereInput
    /**
     * Limit how many Performances to update.
     */
    limit?: number
  }

  /**
   * Performance updateManyAndReturn
   */
  export type PerformanceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Performance
     */
    select?: PerformanceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Performance
     */
    omit?: PerformanceOmit<ExtArgs> | null
    /**
     * The data used to update Performances.
     */
    data: XOR<PerformanceUpdateManyMutationInput, PerformanceUncheckedUpdateManyInput>
    /**
     * Filter which Performances to update
     */
    where?: PerformanceWhereInput
    /**
     * Limit how many Performances to update.
     */
    limit?: number
  }

  /**
   * Performance upsert
   */
  export type PerformanceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Performance
     */
    select?: PerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Performance
     */
    omit?: PerformanceOmit<ExtArgs> | null
    /**
     * The filter to search for the Performance to update in case it exists.
     */
    where: PerformanceWhereUniqueInput
    /**
     * In case the Performance found by the `where` argument doesn't exist, create a new Performance with this data.
     */
    create: XOR<PerformanceCreateInput, PerformanceUncheckedCreateInput>
    /**
     * In case the Performance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PerformanceUpdateInput, PerformanceUncheckedUpdateInput>
  }

  /**
   * Performance delete
   */
  export type PerformanceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Performance
     */
    select?: PerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Performance
     */
    omit?: PerformanceOmit<ExtArgs> | null
    /**
     * Filter which Performance to delete.
     */
    where: PerformanceWhereUniqueInput
  }

  /**
   * Performance deleteMany
   */
  export type PerformanceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Performances to delete
     */
    where?: PerformanceWhereInput
    /**
     * Limit how many Performances to delete.
     */
    limit?: number
  }

  /**
   * Performance without action
   */
  export type PerformanceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Performance
     */
    select?: PerformanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Performance
     */
    omit?: PerformanceOmit<ExtArgs> | null
  }


  /**
   * Model AgentJob
   */

  export type AggregateAgentJob = {
    _count: AgentJobCountAggregateOutputType | null
    _avg: AgentJobAvgAggregateOutputType | null
    _sum: AgentJobSumAggregateOutputType | null
    _min: AgentJobMinAggregateOutputType | null
    _max: AgentJobMaxAggregateOutputType | null
  }

  export type AgentJobAvgAggregateOutputType = {
    durationMs: number | null
  }

  export type AgentJobSumAggregateOutputType = {
    durationMs: number | null
  }

  export type AgentJobMinAggregateOutputType = {
    id: string | null
    agentName: string | null
    status: $Enums.AgentStatus | null
    triggeredBy: string | null
    triggeredAt: Date | null
    completedAt: Date | null
    error: string | null
    durationMs: number | null
  }

  export type AgentJobMaxAggregateOutputType = {
    id: string | null
    agentName: string | null
    status: $Enums.AgentStatus | null
    triggeredBy: string | null
    triggeredAt: Date | null
    completedAt: Date | null
    error: string | null
    durationMs: number | null
  }

  export type AgentJobCountAggregateOutputType = {
    id: number
    agentName: number
    status: number
    triggeredBy: number
    triggeredAt: number
    completedAt: number
    result: number
    error: number
    durationMs: number
    metadata: number
    _all: number
  }


  export type AgentJobAvgAggregateInputType = {
    durationMs?: true
  }

  export type AgentJobSumAggregateInputType = {
    durationMs?: true
  }

  export type AgentJobMinAggregateInputType = {
    id?: true
    agentName?: true
    status?: true
    triggeredBy?: true
    triggeredAt?: true
    completedAt?: true
    error?: true
    durationMs?: true
  }

  export type AgentJobMaxAggregateInputType = {
    id?: true
    agentName?: true
    status?: true
    triggeredBy?: true
    triggeredAt?: true
    completedAt?: true
    error?: true
    durationMs?: true
  }

  export type AgentJobCountAggregateInputType = {
    id?: true
    agentName?: true
    status?: true
    triggeredBy?: true
    triggeredAt?: true
    completedAt?: true
    result?: true
    error?: true
    durationMs?: true
    metadata?: true
    _all?: true
  }

  export type AgentJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentJob to aggregate.
     */
    where?: AgentJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentJobs to fetch.
     */
    orderBy?: AgentJobOrderByWithRelationInput | AgentJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgentJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgentJobs
    **/
    _count?: true | AgentJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AgentJobAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AgentJobSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentJobMaxAggregateInputType
  }

  export type GetAgentJobAggregateType<T extends AgentJobAggregateArgs> = {
        [P in keyof T & keyof AggregateAgentJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgentJob[P]>
      : GetScalarType<T[P], AggregateAgentJob[P]>
  }




  export type AgentJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentJobWhereInput
    orderBy?: AgentJobOrderByWithAggregationInput | AgentJobOrderByWithAggregationInput[]
    by: AgentJobScalarFieldEnum[] | AgentJobScalarFieldEnum
    having?: AgentJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentJobCountAggregateInputType | true
    _avg?: AgentJobAvgAggregateInputType
    _sum?: AgentJobSumAggregateInputType
    _min?: AgentJobMinAggregateInputType
    _max?: AgentJobMaxAggregateInputType
  }

  export type AgentJobGroupByOutputType = {
    id: string
    agentName: string
    status: $Enums.AgentStatus
    triggeredBy: string
    triggeredAt: Date
    completedAt: Date | null
    result: JsonValue | null
    error: string | null
    durationMs: number | null
    metadata: JsonValue | null
    _count: AgentJobCountAggregateOutputType | null
    _avg: AgentJobAvgAggregateOutputType | null
    _sum: AgentJobSumAggregateOutputType | null
    _min: AgentJobMinAggregateOutputType | null
    _max: AgentJobMaxAggregateOutputType | null
  }

  type GetAgentJobGroupByPayload<T extends AgentJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentJobGroupByOutputType[P]>
            : GetScalarType<T[P], AgentJobGroupByOutputType[P]>
        }
      >
    >


  export type AgentJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentName?: boolean
    status?: boolean
    triggeredBy?: boolean
    triggeredAt?: boolean
    completedAt?: boolean
    result?: boolean
    error?: boolean
    durationMs?: boolean
    metadata?: boolean
    results?: boolean | AgentJob$resultsArgs<ExtArgs>
  }, ExtArgs["result"]["agentJob"]>

  export type AgentJobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentName?: boolean
    status?: boolean
    triggeredBy?: boolean
    triggeredAt?: boolean
    completedAt?: boolean
    result?: boolean
    error?: boolean
    durationMs?: boolean
    metadata?: boolean
  }, ExtArgs["result"]["agentJob"]>

  export type AgentJobSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentName?: boolean
    status?: boolean
    triggeredBy?: boolean
    triggeredAt?: boolean
    completedAt?: boolean
    result?: boolean
    error?: boolean
    durationMs?: boolean
    metadata?: boolean
  }, ExtArgs["result"]["agentJob"]>

  export type AgentJobSelectScalar = {
    id?: boolean
    agentName?: boolean
    status?: boolean
    triggeredBy?: boolean
    triggeredAt?: boolean
    completedAt?: boolean
    result?: boolean
    error?: boolean
    durationMs?: boolean
    metadata?: boolean
  }

  export type AgentJobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "agentName" | "status" | "triggeredBy" | "triggeredAt" | "completedAt" | "result" | "error" | "durationMs" | "metadata", ExtArgs["result"]["agentJob"]>
  export type AgentJobInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    results?: boolean | AgentJob$resultsArgs<ExtArgs>
  }
  export type AgentJobIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AgentJobIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AgentJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgentJob"
    objects: {
      results: Prisma.$AgentResultPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      agentName: string
      status: $Enums.AgentStatus
      triggeredBy: string
      triggeredAt: Date
      completedAt: Date | null
      result: Prisma.JsonValue | null
      error: string | null
      durationMs: number | null
      metadata: Prisma.JsonValue | null
    }, ExtArgs["result"]["agentJob"]>
    composites: {}
  }

  type AgentJobGetPayload<S extends boolean | null | undefined | AgentJobDefaultArgs> = $Result.GetResult<Prisma.$AgentJobPayload, S>

  type AgentJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AgentJobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AgentJobCountAggregateInputType | true
    }

  export interface AgentJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgentJob'], meta: { name: 'AgentJob' } }
    /**
     * Find zero or one AgentJob that matches the filter.
     * @param {AgentJobFindUniqueArgs} args - Arguments to find a AgentJob
     * @example
     * // Get one AgentJob
     * const agentJob = await prisma.agentJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgentJobFindUniqueArgs>(args: SelectSubset<T, AgentJobFindUniqueArgs<ExtArgs>>): Prisma__AgentJobClient<$Result.GetResult<Prisma.$AgentJobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AgentJob that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AgentJobFindUniqueOrThrowArgs} args - Arguments to find a AgentJob
     * @example
     * // Get one AgentJob
     * const agentJob = await prisma.agentJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgentJobFindUniqueOrThrowArgs>(args: SelectSubset<T, AgentJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgentJobClient<$Result.GetResult<Prisma.$AgentJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentJobFindFirstArgs} args - Arguments to find a AgentJob
     * @example
     * // Get one AgentJob
     * const agentJob = await prisma.agentJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgentJobFindFirstArgs>(args?: SelectSubset<T, AgentJobFindFirstArgs<ExtArgs>>): Prisma__AgentJobClient<$Result.GetResult<Prisma.$AgentJobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentJobFindFirstOrThrowArgs} args - Arguments to find a AgentJob
     * @example
     * // Get one AgentJob
     * const agentJob = await prisma.agentJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgentJobFindFirstOrThrowArgs>(args?: SelectSubset<T, AgentJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgentJobClient<$Result.GetResult<Prisma.$AgentJobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AgentJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgentJobs
     * const agentJobs = await prisma.agentJob.findMany()
     * 
     * // Get first 10 AgentJobs
     * const agentJobs = await prisma.agentJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agentJobWithIdOnly = await prisma.agentJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgentJobFindManyArgs>(args?: SelectSubset<T, AgentJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AgentJob.
     * @param {AgentJobCreateArgs} args - Arguments to create a AgentJob.
     * @example
     * // Create one AgentJob
     * const AgentJob = await prisma.agentJob.create({
     *   data: {
     *     // ... data to create a AgentJob
     *   }
     * })
     * 
     */
    create<T extends AgentJobCreateArgs>(args: SelectSubset<T, AgentJobCreateArgs<ExtArgs>>): Prisma__AgentJobClient<$Result.GetResult<Prisma.$AgentJobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AgentJobs.
     * @param {AgentJobCreateManyArgs} args - Arguments to create many AgentJobs.
     * @example
     * // Create many AgentJobs
     * const agentJob = await prisma.agentJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgentJobCreateManyArgs>(args?: SelectSubset<T, AgentJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgentJobs and returns the data saved in the database.
     * @param {AgentJobCreateManyAndReturnArgs} args - Arguments to create many AgentJobs.
     * @example
     * // Create many AgentJobs
     * const agentJob = await prisma.agentJob.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgentJobs and only return the `id`
     * const agentJobWithIdOnly = await prisma.agentJob.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgentJobCreateManyAndReturnArgs>(args?: SelectSubset<T, AgentJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentJobPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AgentJob.
     * @param {AgentJobDeleteArgs} args - Arguments to delete one AgentJob.
     * @example
     * // Delete one AgentJob
     * const AgentJob = await prisma.agentJob.delete({
     *   where: {
     *     // ... filter to delete one AgentJob
     *   }
     * })
     * 
     */
    delete<T extends AgentJobDeleteArgs>(args: SelectSubset<T, AgentJobDeleteArgs<ExtArgs>>): Prisma__AgentJobClient<$Result.GetResult<Prisma.$AgentJobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AgentJob.
     * @param {AgentJobUpdateArgs} args - Arguments to update one AgentJob.
     * @example
     * // Update one AgentJob
     * const agentJob = await prisma.agentJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgentJobUpdateArgs>(args: SelectSubset<T, AgentJobUpdateArgs<ExtArgs>>): Prisma__AgentJobClient<$Result.GetResult<Prisma.$AgentJobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AgentJobs.
     * @param {AgentJobDeleteManyArgs} args - Arguments to filter AgentJobs to delete.
     * @example
     * // Delete a few AgentJobs
     * const { count } = await prisma.agentJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgentJobDeleteManyArgs>(args?: SelectSubset<T, AgentJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgentJobs
     * const agentJob = await prisma.agentJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgentJobUpdateManyArgs>(args: SelectSubset<T, AgentJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentJobs and returns the data updated in the database.
     * @param {AgentJobUpdateManyAndReturnArgs} args - Arguments to update many AgentJobs.
     * @example
     * // Update many AgentJobs
     * const agentJob = await prisma.agentJob.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AgentJobs and only return the `id`
     * const agentJobWithIdOnly = await prisma.agentJob.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AgentJobUpdateManyAndReturnArgs>(args: SelectSubset<T, AgentJobUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentJobPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AgentJob.
     * @param {AgentJobUpsertArgs} args - Arguments to update or create a AgentJob.
     * @example
     * // Update or create a AgentJob
     * const agentJob = await prisma.agentJob.upsert({
     *   create: {
     *     // ... data to create a AgentJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgentJob we want to update
     *   }
     * })
     */
    upsert<T extends AgentJobUpsertArgs>(args: SelectSubset<T, AgentJobUpsertArgs<ExtArgs>>): Prisma__AgentJobClient<$Result.GetResult<Prisma.$AgentJobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AgentJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentJobCountArgs} args - Arguments to filter AgentJobs to count.
     * @example
     * // Count the number of AgentJobs
     * const count = await prisma.agentJob.count({
     *   where: {
     *     // ... the filter for the AgentJobs we want to count
     *   }
     * })
    **/
    count<T extends AgentJobCountArgs>(
      args?: Subset<T, AgentJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgentJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgentJobAggregateArgs>(args: Subset<T, AgentJobAggregateArgs>): Prisma.PrismaPromise<GetAgentJobAggregateType<T>>

    /**
     * Group by AgentJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgentJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgentJobGroupByArgs['orderBy'] }
        : { orderBy?: AgentJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgentJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgentJob model
   */
  readonly fields: AgentJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgentJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgentJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    results<T extends AgentJob$resultsArgs<ExtArgs> = {}>(args?: Subset<T, AgentJob$resultsArgs<ExtArgs>>): Prisma__AgentResultClient<$Result.GetResult<Prisma.$AgentResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AgentJob model
   */
  interface AgentJobFieldRefs {
    readonly id: FieldRef<"AgentJob", 'String'>
    readonly agentName: FieldRef<"AgentJob", 'String'>
    readonly status: FieldRef<"AgentJob", 'AgentStatus'>
    readonly triggeredBy: FieldRef<"AgentJob", 'String'>
    readonly triggeredAt: FieldRef<"AgentJob", 'DateTime'>
    readonly completedAt: FieldRef<"AgentJob", 'DateTime'>
    readonly result: FieldRef<"AgentJob", 'Json'>
    readonly error: FieldRef<"AgentJob", 'String'>
    readonly durationMs: FieldRef<"AgentJob", 'Int'>
    readonly metadata: FieldRef<"AgentJob", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * AgentJob findUnique
   */
  export type AgentJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentJob
     */
    select?: AgentJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentJob
     */
    omit?: AgentJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentJobInclude<ExtArgs> | null
    /**
     * Filter, which AgentJob to fetch.
     */
    where: AgentJobWhereUniqueInput
  }

  /**
   * AgentJob findUniqueOrThrow
   */
  export type AgentJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentJob
     */
    select?: AgentJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentJob
     */
    omit?: AgentJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentJobInclude<ExtArgs> | null
    /**
     * Filter, which AgentJob to fetch.
     */
    where: AgentJobWhereUniqueInput
  }

  /**
   * AgentJob findFirst
   */
  export type AgentJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentJob
     */
    select?: AgentJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentJob
     */
    omit?: AgentJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentJobInclude<ExtArgs> | null
    /**
     * Filter, which AgentJob to fetch.
     */
    where?: AgentJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentJobs to fetch.
     */
    orderBy?: AgentJobOrderByWithRelationInput | AgentJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentJobs.
     */
    cursor?: AgentJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentJobs.
     */
    distinct?: AgentJobScalarFieldEnum | AgentJobScalarFieldEnum[]
  }

  /**
   * AgentJob findFirstOrThrow
   */
  export type AgentJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentJob
     */
    select?: AgentJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentJob
     */
    omit?: AgentJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentJobInclude<ExtArgs> | null
    /**
     * Filter, which AgentJob to fetch.
     */
    where?: AgentJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentJobs to fetch.
     */
    orderBy?: AgentJobOrderByWithRelationInput | AgentJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentJobs.
     */
    cursor?: AgentJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentJobs.
     */
    distinct?: AgentJobScalarFieldEnum | AgentJobScalarFieldEnum[]
  }

  /**
   * AgentJob findMany
   */
  export type AgentJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentJob
     */
    select?: AgentJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentJob
     */
    omit?: AgentJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentJobInclude<ExtArgs> | null
    /**
     * Filter, which AgentJobs to fetch.
     */
    where?: AgentJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentJobs to fetch.
     */
    orderBy?: AgentJobOrderByWithRelationInput | AgentJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgentJobs.
     */
    cursor?: AgentJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentJobs.
     */
    skip?: number
    distinct?: AgentJobScalarFieldEnum | AgentJobScalarFieldEnum[]
  }

  /**
   * AgentJob create
   */
  export type AgentJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentJob
     */
    select?: AgentJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentJob
     */
    omit?: AgentJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentJobInclude<ExtArgs> | null
    /**
     * The data needed to create a AgentJob.
     */
    data: XOR<AgentJobCreateInput, AgentJobUncheckedCreateInput>
  }

  /**
   * AgentJob createMany
   */
  export type AgentJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgentJobs.
     */
    data: AgentJobCreateManyInput | AgentJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentJob createManyAndReturn
   */
  export type AgentJobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentJob
     */
    select?: AgentJobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentJob
     */
    omit?: AgentJobOmit<ExtArgs> | null
    /**
     * The data used to create many AgentJobs.
     */
    data: AgentJobCreateManyInput | AgentJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentJob update
   */
  export type AgentJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentJob
     */
    select?: AgentJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentJob
     */
    omit?: AgentJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentJobInclude<ExtArgs> | null
    /**
     * The data needed to update a AgentJob.
     */
    data: XOR<AgentJobUpdateInput, AgentJobUncheckedUpdateInput>
    /**
     * Choose, which AgentJob to update.
     */
    where: AgentJobWhereUniqueInput
  }

  /**
   * AgentJob updateMany
   */
  export type AgentJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgentJobs.
     */
    data: XOR<AgentJobUpdateManyMutationInput, AgentJobUncheckedUpdateManyInput>
    /**
     * Filter which AgentJobs to update
     */
    where?: AgentJobWhereInput
    /**
     * Limit how many AgentJobs to update.
     */
    limit?: number
  }

  /**
   * AgentJob updateManyAndReturn
   */
  export type AgentJobUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentJob
     */
    select?: AgentJobSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentJob
     */
    omit?: AgentJobOmit<ExtArgs> | null
    /**
     * The data used to update AgentJobs.
     */
    data: XOR<AgentJobUpdateManyMutationInput, AgentJobUncheckedUpdateManyInput>
    /**
     * Filter which AgentJobs to update
     */
    where?: AgentJobWhereInput
    /**
     * Limit how many AgentJobs to update.
     */
    limit?: number
  }

  /**
   * AgentJob upsert
   */
  export type AgentJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentJob
     */
    select?: AgentJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentJob
     */
    omit?: AgentJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentJobInclude<ExtArgs> | null
    /**
     * The filter to search for the AgentJob to update in case it exists.
     */
    where: AgentJobWhereUniqueInput
    /**
     * In case the AgentJob found by the `where` argument doesn't exist, create a new AgentJob with this data.
     */
    create: XOR<AgentJobCreateInput, AgentJobUncheckedCreateInput>
    /**
     * In case the AgentJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgentJobUpdateInput, AgentJobUncheckedUpdateInput>
  }

  /**
   * AgentJob delete
   */
  export type AgentJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentJob
     */
    select?: AgentJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentJob
     */
    omit?: AgentJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentJobInclude<ExtArgs> | null
    /**
     * Filter which AgentJob to delete.
     */
    where: AgentJobWhereUniqueInput
  }

  /**
   * AgentJob deleteMany
   */
  export type AgentJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentJobs to delete
     */
    where?: AgentJobWhereInput
    /**
     * Limit how many AgentJobs to delete.
     */
    limit?: number
  }

  /**
   * AgentJob.results
   */
  export type AgentJob$resultsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentResult
     */
    select?: AgentResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentResult
     */
    omit?: AgentResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentResultInclude<ExtArgs> | null
    where?: AgentResultWhereInput
  }

  /**
   * AgentJob without action
   */
  export type AgentJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentJob
     */
    select?: AgentJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentJob
     */
    omit?: AgentJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentJobInclude<ExtArgs> | null
  }


  /**
   * Model AgentConfig
   */

  export type AggregateAgentConfig = {
    _count: AgentConfigCountAggregateOutputType | null
    _min: AgentConfigMinAggregateOutputType | null
    _max: AgentConfigMaxAggregateOutputType | null
  }

  export type AgentConfigMinAggregateOutputType = {
    id: string | null
    agentName: string | null
    updatedAt: Date | null
  }

  export type AgentConfigMaxAggregateOutputType = {
    id: string | null
    agentName: string | null
    updatedAt: Date | null
  }

  export type AgentConfigCountAggregateOutputType = {
    id: number
    agentName: number
    config: number
    updatedAt: number
    _all: number
  }


  export type AgentConfigMinAggregateInputType = {
    id?: true
    agentName?: true
    updatedAt?: true
  }

  export type AgentConfigMaxAggregateInputType = {
    id?: true
    agentName?: true
    updatedAt?: true
  }

  export type AgentConfigCountAggregateInputType = {
    id?: true
    agentName?: true
    config?: true
    updatedAt?: true
    _all?: true
  }

  export type AgentConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentConfig to aggregate.
     */
    where?: AgentConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentConfigs to fetch.
     */
    orderBy?: AgentConfigOrderByWithRelationInput | AgentConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgentConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgentConfigs
    **/
    _count?: true | AgentConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentConfigMaxAggregateInputType
  }

  export type GetAgentConfigAggregateType<T extends AgentConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateAgentConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgentConfig[P]>
      : GetScalarType<T[P], AggregateAgentConfig[P]>
  }




  export type AgentConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentConfigWhereInput
    orderBy?: AgentConfigOrderByWithAggregationInput | AgentConfigOrderByWithAggregationInput[]
    by: AgentConfigScalarFieldEnum[] | AgentConfigScalarFieldEnum
    having?: AgentConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentConfigCountAggregateInputType | true
    _min?: AgentConfigMinAggregateInputType
    _max?: AgentConfigMaxAggregateInputType
  }

  export type AgentConfigGroupByOutputType = {
    id: string
    agentName: string
    config: JsonValue
    updatedAt: Date
    _count: AgentConfigCountAggregateOutputType | null
    _min: AgentConfigMinAggregateOutputType | null
    _max: AgentConfigMaxAggregateOutputType | null
  }

  type GetAgentConfigGroupByPayload<T extends AgentConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentConfigGroupByOutputType[P]>
            : GetScalarType<T[P], AgentConfigGroupByOutputType[P]>
        }
      >
    >


  export type AgentConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentName?: boolean
    config?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["agentConfig"]>

  export type AgentConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentName?: boolean
    config?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["agentConfig"]>

  export type AgentConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    agentName?: boolean
    config?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["agentConfig"]>

  export type AgentConfigSelectScalar = {
    id?: boolean
    agentName?: boolean
    config?: boolean
    updatedAt?: boolean
  }

  export type AgentConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "agentName" | "config" | "updatedAt", ExtArgs["result"]["agentConfig"]>

  export type $AgentConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgentConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      agentName: string
      config: Prisma.JsonValue
      updatedAt: Date
    }, ExtArgs["result"]["agentConfig"]>
    composites: {}
  }

  type AgentConfigGetPayload<S extends boolean | null | undefined | AgentConfigDefaultArgs> = $Result.GetResult<Prisma.$AgentConfigPayload, S>

  type AgentConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AgentConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AgentConfigCountAggregateInputType | true
    }

  export interface AgentConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgentConfig'], meta: { name: 'AgentConfig' } }
    /**
     * Find zero or one AgentConfig that matches the filter.
     * @param {AgentConfigFindUniqueArgs} args - Arguments to find a AgentConfig
     * @example
     * // Get one AgentConfig
     * const agentConfig = await prisma.agentConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgentConfigFindUniqueArgs>(args: SelectSubset<T, AgentConfigFindUniqueArgs<ExtArgs>>): Prisma__AgentConfigClient<$Result.GetResult<Prisma.$AgentConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AgentConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AgentConfigFindUniqueOrThrowArgs} args - Arguments to find a AgentConfig
     * @example
     * // Get one AgentConfig
     * const agentConfig = await prisma.agentConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgentConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, AgentConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgentConfigClient<$Result.GetResult<Prisma.$AgentConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentConfigFindFirstArgs} args - Arguments to find a AgentConfig
     * @example
     * // Get one AgentConfig
     * const agentConfig = await prisma.agentConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgentConfigFindFirstArgs>(args?: SelectSubset<T, AgentConfigFindFirstArgs<ExtArgs>>): Prisma__AgentConfigClient<$Result.GetResult<Prisma.$AgentConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentConfigFindFirstOrThrowArgs} args - Arguments to find a AgentConfig
     * @example
     * // Get one AgentConfig
     * const agentConfig = await prisma.agentConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgentConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, AgentConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgentConfigClient<$Result.GetResult<Prisma.$AgentConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AgentConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgentConfigs
     * const agentConfigs = await prisma.agentConfig.findMany()
     * 
     * // Get first 10 AgentConfigs
     * const agentConfigs = await prisma.agentConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agentConfigWithIdOnly = await prisma.agentConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgentConfigFindManyArgs>(args?: SelectSubset<T, AgentConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AgentConfig.
     * @param {AgentConfigCreateArgs} args - Arguments to create a AgentConfig.
     * @example
     * // Create one AgentConfig
     * const AgentConfig = await prisma.agentConfig.create({
     *   data: {
     *     // ... data to create a AgentConfig
     *   }
     * })
     * 
     */
    create<T extends AgentConfigCreateArgs>(args: SelectSubset<T, AgentConfigCreateArgs<ExtArgs>>): Prisma__AgentConfigClient<$Result.GetResult<Prisma.$AgentConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AgentConfigs.
     * @param {AgentConfigCreateManyArgs} args - Arguments to create many AgentConfigs.
     * @example
     * // Create many AgentConfigs
     * const agentConfig = await prisma.agentConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgentConfigCreateManyArgs>(args?: SelectSubset<T, AgentConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgentConfigs and returns the data saved in the database.
     * @param {AgentConfigCreateManyAndReturnArgs} args - Arguments to create many AgentConfigs.
     * @example
     * // Create many AgentConfigs
     * const agentConfig = await prisma.agentConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgentConfigs and only return the `id`
     * const agentConfigWithIdOnly = await prisma.agentConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgentConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, AgentConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AgentConfig.
     * @param {AgentConfigDeleteArgs} args - Arguments to delete one AgentConfig.
     * @example
     * // Delete one AgentConfig
     * const AgentConfig = await prisma.agentConfig.delete({
     *   where: {
     *     // ... filter to delete one AgentConfig
     *   }
     * })
     * 
     */
    delete<T extends AgentConfigDeleteArgs>(args: SelectSubset<T, AgentConfigDeleteArgs<ExtArgs>>): Prisma__AgentConfigClient<$Result.GetResult<Prisma.$AgentConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AgentConfig.
     * @param {AgentConfigUpdateArgs} args - Arguments to update one AgentConfig.
     * @example
     * // Update one AgentConfig
     * const agentConfig = await prisma.agentConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgentConfigUpdateArgs>(args: SelectSubset<T, AgentConfigUpdateArgs<ExtArgs>>): Prisma__AgentConfigClient<$Result.GetResult<Prisma.$AgentConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AgentConfigs.
     * @param {AgentConfigDeleteManyArgs} args - Arguments to filter AgentConfigs to delete.
     * @example
     * // Delete a few AgentConfigs
     * const { count } = await prisma.agentConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgentConfigDeleteManyArgs>(args?: SelectSubset<T, AgentConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgentConfigs
     * const agentConfig = await prisma.agentConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgentConfigUpdateManyArgs>(args: SelectSubset<T, AgentConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentConfigs and returns the data updated in the database.
     * @param {AgentConfigUpdateManyAndReturnArgs} args - Arguments to update many AgentConfigs.
     * @example
     * // Update many AgentConfigs
     * const agentConfig = await prisma.agentConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AgentConfigs and only return the `id`
     * const agentConfigWithIdOnly = await prisma.agentConfig.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AgentConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, AgentConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AgentConfig.
     * @param {AgentConfigUpsertArgs} args - Arguments to update or create a AgentConfig.
     * @example
     * // Update or create a AgentConfig
     * const agentConfig = await prisma.agentConfig.upsert({
     *   create: {
     *     // ... data to create a AgentConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgentConfig we want to update
     *   }
     * })
     */
    upsert<T extends AgentConfigUpsertArgs>(args: SelectSubset<T, AgentConfigUpsertArgs<ExtArgs>>): Prisma__AgentConfigClient<$Result.GetResult<Prisma.$AgentConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AgentConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentConfigCountArgs} args - Arguments to filter AgentConfigs to count.
     * @example
     * // Count the number of AgentConfigs
     * const count = await prisma.agentConfig.count({
     *   where: {
     *     // ... the filter for the AgentConfigs we want to count
     *   }
     * })
    **/
    count<T extends AgentConfigCountArgs>(
      args?: Subset<T, AgentConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgentConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgentConfigAggregateArgs>(args: Subset<T, AgentConfigAggregateArgs>): Prisma.PrismaPromise<GetAgentConfigAggregateType<T>>

    /**
     * Group by AgentConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgentConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgentConfigGroupByArgs['orderBy'] }
        : { orderBy?: AgentConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgentConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgentConfig model
   */
  readonly fields: AgentConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgentConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgentConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AgentConfig model
   */
  interface AgentConfigFieldRefs {
    readonly id: FieldRef<"AgentConfig", 'String'>
    readonly agentName: FieldRef<"AgentConfig", 'String'>
    readonly config: FieldRef<"AgentConfig", 'Json'>
    readonly updatedAt: FieldRef<"AgentConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AgentConfig findUnique
   */
  export type AgentConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentConfig
     */
    select?: AgentConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentConfig
     */
    omit?: AgentConfigOmit<ExtArgs> | null
    /**
     * Filter, which AgentConfig to fetch.
     */
    where: AgentConfigWhereUniqueInput
  }

  /**
   * AgentConfig findUniqueOrThrow
   */
  export type AgentConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentConfig
     */
    select?: AgentConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentConfig
     */
    omit?: AgentConfigOmit<ExtArgs> | null
    /**
     * Filter, which AgentConfig to fetch.
     */
    where: AgentConfigWhereUniqueInput
  }

  /**
   * AgentConfig findFirst
   */
  export type AgentConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentConfig
     */
    select?: AgentConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentConfig
     */
    omit?: AgentConfigOmit<ExtArgs> | null
    /**
     * Filter, which AgentConfig to fetch.
     */
    where?: AgentConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentConfigs to fetch.
     */
    orderBy?: AgentConfigOrderByWithRelationInput | AgentConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentConfigs.
     */
    cursor?: AgentConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentConfigs.
     */
    distinct?: AgentConfigScalarFieldEnum | AgentConfigScalarFieldEnum[]
  }

  /**
   * AgentConfig findFirstOrThrow
   */
  export type AgentConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentConfig
     */
    select?: AgentConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentConfig
     */
    omit?: AgentConfigOmit<ExtArgs> | null
    /**
     * Filter, which AgentConfig to fetch.
     */
    where?: AgentConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentConfigs to fetch.
     */
    orderBy?: AgentConfigOrderByWithRelationInput | AgentConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentConfigs.
     */
    cursor?: AgentConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentConfigs.
     */
    distinct?: AgentConfigScalarFieldEnum | AgentConfigScalarFieldEnum[]
  }

  /**
   * AgentConfig findMany
   */
  export type AgentConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentConfig
     */
    select?: AgentConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentConfig
     */
    omit?: AgentConfigOmit<ExtArgs> | null
    /**
     * Filter, which AgentConfigs to fetch.
     */
    where?: AgentConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentConfigs to fetch.
     */
    orderBy?: AgentConfigOrderByWithRelationInput | AgentConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgentConfigs.
     */
    cursor?: AgentConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentConfigs.
     */
    skip?: number
    distinct?: AgentConfigScalarFieldEnum | AgentConfigScalarFieldEnum[]
  }

  /**
   * AgentConfig create
   */
  export type AgentConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentConfig
     */
    select?: AgentConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentConfig
     */
    omit?: AgentConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a AgentConfig.
     */
    data: XOR<AgentConfigCreateInput, AgentConfigUncheckedCreateInput>
  }

  /**
   * AgentConfig createMany
   */
  export type AgentConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgentConfigs.
     */
    data: AgentConfigCreateManyInput | AgentConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentConfig createManyAndReturn
   */
  export type AgentConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentConfig
     */
    select?: AgentConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentConfig
     */
    omit?: AgentConfigOmit<ExtArgs> | null
    /**
     * The data used to create many AgentConfigs.
     */
    data: AgentConfigCreateManyInput | AgentConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentConfig update
   */
  export type AgentConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentConfig
     */
    select?: AgentConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentConfig
     */
    omit?: AgentConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a AgentConfig.
     */
    data: XOR<AgentConfigUpdateInput, AgentConfigUncheckedUpdateInput>
    /**
     * Choose, which AgentConfig to update.
     */
    where: AgentConfigWhereUniqueInput
  }

  /**
   * AgentConfig updateMany
   */
  export type AgentConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgentConfigs.
     */
    data: XOR<AgentConfigUpdateManyMutationInput, AgentConfigUncheckedUpdateManyInput>
    /**
     * Filter which AgentConfigs to update
     */
    where?: AgentConfigWhereInput
    /**
     * Limit how many AgentConfigs to update.
     */
    limit?: number
  }

  /**
   * AgentConfig updateManyAndReturn
   */
  export type AgentConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentConfig
     */
    select?: AgentConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentConfig
     */
    omit?: AgentConfigOmit<ExtArgs> | null
    /**
     * The data used to update AgentConfigs.
     */
    data: XOR<AgentConfigUpdateManyMutationInput, AgentConfigUncheckedUpdateManyInput>
    /**
     * Filter which AgentConfigs to update
     */
    where?: AgentConfigWhereInput
    /**
     * Limit how many AgentConfigs to update.
     */
    limit?: number
  }

  /**
   * AgentConfig upsert
   */
  export type AgentConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentConfig
     */
    select?: AgentConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentConfig
     */
    omit?: AgentConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the AgentConfig to update in case it exists.
     */
    where: AgentConfigWhereUniqueInput
    /**
     * In case the AgentConfig found by the `where` argument doesn't exist, create a new AgentConfig with this data.
     */
    create: XOR<AgentConfigCreateInput, AgentConfigUncheckedCreateInput>
    /**
     * In case the AgentConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgentConfigUpdateInput, AgentConfigUncheckedUpdateInput>
  }

  /**
   * AgentConfig delete
   */
  export type AgentConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentConfig
     */
    select?: AgentConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentConfig
     */
    omit?: AgentConfigOmit<ExtArgs> | null
    /**
     * Filter which AgentConfig to delete.
     */
    where: AgentConfigWhereUniqueInput
  }

  /**
   * AgentConfig deleteMany
   */
  export type AgentConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentConfigs to delete
     */
    where?: AgentConfigWhereInput
    /**
     * Limit how many AgentConfigs to delete.
     */
    limit?: number
  }

  /**
   * AgentConfig without action
   */
  export type AgentConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentConfig
     */
    select?: AgentConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentConfig
     */
    omit?: AgentConfigOmit<ExtArgs> | null
  }


  /**
   * Model AgentResult
   */

  export type AggregateAgentResult = {
    _count: AgentResultCountAggregateOutputType | null
    _min: AgentResultMinAggregateOutputType | null
    _max: AgentResultMaxAggregateOutputType | null
  }

  export type AgentResultMinAggregateOutputType = {
    id: string | null
    jobId: string | null
    error: string | null
    createdAt: Date | null
  }

  export type AgentResultMaxAggregateOutputType = {
    id: string | null
    jobId: string | null
    error: string | null
    createdAt: Date | null
  }

  export type AgentResultCountAggregateOutputType = {
    id: number
    jobId: number
    output: number
    error: number
    createdAt: number
    _all: number
  }


  export type AgentResultMinAggregateInputType = {
    id?: true
    jobId?: true
    error?: true
    createdAt?: true
  }

  export type AgentResultMaxAggregateInputType = {
    id?: true
    jobId?: true
    error?: true
    createdAt?: true
  }

  export type AgentResultCountAggregateInputType = {
    id?: true
    jobId?: true
    output?: true
    error?: true
    createdAt?: true
    _all?: true
  }

  export type AgentResultAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentResult to aggregate.
     */
    where?: AgentResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentResults to fetch.
     */
    orderBy?: AgentResultOrderByWithRelationInput | AgentResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgentResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgentResults
    **/
    _count?: true | AgentResultCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentResultMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentResultMaxAggregateInputType
  }

  export type GetAgentResultAggregateType<T extends AgentResultAggregateArgs> = {
        [P in keyof T & keyof AggregateAgentResult]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgentResult[P]>
      : GetScalarType<T[P], AggregateAgentResult[P]>
  }




  export type AgentResultGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentResultWhereInput
    orderBy?: AgentResultOrderByWithAggregationInput | AgentResultOrderByWithAggregationInput[]
    by: AgentResultScalarFieldEnum[] | AgentResultScalarFieldEnum
    having?: AgentResultScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentResultCountAggregateInputType | true
    _min?: AgentResultMinAggregateInputType
    _max?: AgentResultMaxAggregateInputType
  }

  export type AgentResultGroupByOutputType = {
    id: string
    jobId: string
    output: JsonValue
    error: string | null
    createdAt: Date
    _count: AgentResultCountAggregateOutputType | null
    _min: AgentResultMinAggregateOutputType | null
    _max: AgentResultMaxAggregateOutputType | null
  }

  type GetAgentResultGroupByPayload<T extends AgentResultGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentResultGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentResultGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentResultGroupByOutputType[P]>
            : GetScalarType<T[P], AgentResultGroupByOutputType[P]>
        }
      >
    >


  export type AgentResultSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    output?: boolean
    error?: boolean
    createdAt?: boolean
    job?: boolean | AgentJobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentResult"]>

  export type AgentResultSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    output?: boolean
    error?: boolean
    createdAt?: boolean
    job?: boolean | AgentJobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentResult"]>

  export type AgentResultSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    output?: boolean
    error?: boolean
    createdAt?: boolean
    job?: boolean | AgentJobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentResult"]>

  export type AgentResultSelectScalar = {
    id?: boolean
    jobId?: boolean
    output?: boolean
    error?: boolean
    createdAt?: boolean
  }

  export type AgentResultOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "jobId" | "output" | "error" | "createdAt", ExtArgs["result"]["agentResult"]>
  export type AgentResultInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | AgentJobDefaultArgs<ExtArgs>
  }
  export type AgentResultIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | AgentJobDefaultArgs<ExtArgs>
  }
  export type AgentResultIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | AgentJobDefaultArgs<ExtArgs>
  }

  export type $AgentResultPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgentResult"
    objects: {
      job: Prisma.$AgentJobPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      jobId: string
      output: Prisma.JsonValue
      error: string | null
      createdAt: Date
    }, ExtArgs["result"]["agentResult"]>
    composites: {}
  }

  type AgentResultGetPayload<S extends boolean | null | undefined | AgentResultDefaultArgs> = $Result.GetResult<Prisma.$AgentResultPayload, S>

  type AgentResultCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AgentResultFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AgentResultCountAggregateInputType | true
    }

  export interface AgentResultDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgentResult'], meta: { name: 'AgentResult' } }
    /**
     * Find zero or one AgentResult that matches the filter.
     * @param {AgentResultFindUniqueArgs} args - Arguments to find a AgentResult
     * @example
     * // Get one AgentResult
     * const agentResult = await prisma.agentResult.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgentResultFindUniqueArgs>(args: SelectSubset<T, AgentResultFindUniqueArgs<ExtArgs>>): Prisma__AgentResultClient<$Result.GetResult<Prisma.$AgentResultPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AgentResult that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AgentResultFindUniqueOrThrowArgs} args - Arguments to find a AgentResult
     * @example
     * // Get one AgentResult
     * const agentResult = await prisma.agentResult.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgentResultFindUniqueOrThrowArgs>(args: SelectSubset<T, AgentResultFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgentResultClient<$Result.GetResult<Prisma.$AgentResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentResult that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentResultFindFirstArgs} args - Arguments to find a AgentResult
     * @example
     * // Get one AgentResult
     * const agentResult = await prisma.agentResult.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgentResultFindFirstArgs>(args?: SelectSubset<T, AgentResultFindFirstArgs<ExtArgs>>): Prisma__AgentResultClient<$Result.GetResult<Prisma.$AgentResultPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentResult that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentResultFindFirstOrThrowArgs} args - Arguments to find a AgentResult
     * @example
     * // Get one AgentResult
     * const agentResult = await prisma.agentResult.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgentResultFindFirstOrThrowArgs>(args?: SelectSubset<T, AgentResultFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgentResultClient<$Result.GetResult<Prisma.$AgentResultPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AgentResults that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentResultFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgentResults
     * const agentResults = await prisma.agentResult.findMany()
     * 
     * // Get first 10 AgentResults
     * const agentResults = await prisma.agentResult.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agentResultWithIdOnly = await prisma.agentResult.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgentResultFindManyArgs>(args?: SelectSubset<T, AgentResultFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AgentResult.
     * @param {AgentResultCreateArgs} args - Arguments to create a AgentResult.
     * @example
     * // Create one AgentResult
     * const AgentResult = await prisma.agentResult.create({
     *   data: {
     *     // ... data to create a AgentResult
     *   }
     * })
     * 
     */
    create<T extends AgentResultCreateArgs>(args: SelectSubset<T, AgentResultCreateArgs<ExtArgs>>): Prisma__AgentResultClient<$Result.GetResult<Prisma.$AgentResultPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AgentResults.
     * @param {AgentResultCreateManyArgs} args - Arguments to create many AgentResults.
     * @example
     * // Create many AgentResults
     * const agentResult = await prisma.agentResult.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgentResultCreateManyArgs>(args?: SelectSubset<T, AgentResultCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgentResults and returns the data saved in the database.
     * @param {AgentResultCreateManyAndReturnArgs} args - Arguments to create many AgentResults.
     * @example
     * // Create many AgentResults
     * const agentResult = await prisma.agentResult.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgentResults and only return the `id`
     * const agentResultWithIdOnly = await prisma.agentResult.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgentResultCreateManyAndReturnArgs>(args?: SelectSubset<T, AgentResultCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentResultPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AgentResult.
     * @param {AgentResultDeleteArgs} args - Arguments to delete one AgentResult.
     * @example
     * // Delete one AgentResult
     * const AgentResult = await prisma.agentResult.delete({
     *   where: {
     *     // ... filter to delete one AgentResult
     *   }
     * })
     * 
     */
    delete<T extends AgentResultDeleteArgs>(args: SelectSubset<T, AgentResultDeleteArgs<ExtArgs>>): Prisma__AgentResultClient<$Result.GetResult<Prisma.$AgentResultPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AgentResult.
     * @param {AgentResultUpdateArgs} args - Arguments to update one AgentResult.
     * @example
     * // Update one AgentResult
     * const agentResult = await prisma.agentResult.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgentResultUpdateArgs>(args: SelectSubset<T, AgentResultUpdateArgs<ExtArgs>>): Prisma__AgentResultClient<$Result.GetResult<Prisma.$AgentResultPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AgentResults.
     * @param {AgentResultDeleteManyArgs} args - Arguments to filter AgentResults to delete.
     * @example
     * // Delete a few AgentResults
     * const { count } = await prisma.agentResult.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgentResultDeleteManyArgs>(args?: SelectSubset<T, AgentResultDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentResultUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgentResults
     * const agentResult = await prisma.agentResult.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgentResultUpdateManyArgs>(args: SelectSubset<T, AgentResultUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentResults and returns the data updated in the database.
     * @param {AgentResultUpdateManyAndReturnArgs} args - Arguments to update many AgentResults.
     * @example
     * // Update many AgentResults
     * const agentResult = await prisma.agentResult.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AgentResults and only return the `id`
     * const agentResultWithIdOnly = await prisma.agentResult.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AgentResultUpdateManyAndReturnArgs>(args: SelectSubset<T, AgentResultUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentResultPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AgentResult.
     * @param {AgentResultUpsertArgs} args - Arguments to update or create a AgentResult.
     * @example
     * // Update or create a AgentResult
     * const agentResult = await prisma.agentResult.upsert({
     *   create: {
     *     // ... data to create a AgentResult
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgentResult we want to update
     *   }
     * })
     */
    upsert<T extends AgentResultUpsertArgs>(args: SelectSubset<T, AgentResultUpsertArgs<ExtArgs>>): Prisma__AgentResultClient<$Result.GetResult<Prisma.$AgentResultPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AgentResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentResultCountArgs} args - Arguments to filter AgentResults to count.
     * @example
     * // Count the number of AgentResults
     * const count = await prisma.agentResult.count({
     *   where: {
     *     // ... the filter for the AgentResults we want to count
     *   }
     * })
    **/
    count<T extends AgentResultCountArgs>(
      args?: Subset<T, AgentResultCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentResultCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgentResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentResultAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgentResultAggregateArgs>(args: Subset<T, AgentResultAggregateArgs>): Prisma.PrismaPromise<GetAgentResultAggregateType<T>>

    /**
     * Group by AgentResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentResultGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgentResultGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgentResultGroupByArgs['orderBy'] }
        : { orderBy?: AgentResultGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgentResultGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentResultGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgentResult model
   */
  readonly fields: AgentResultFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgentResult.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgentResultClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    job<T extends AgentJobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AgentJobDefaultArgs<ExtArgs>>): Prisma__AgentJobClient<$Result.GetResult<Prisma.$AgentJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AgentResult model
   */
  interface AgentResultFieldRefs {
    readonly id: FieldRef<"AgentResult", 'String'>
    readonly jobId: FieldRef<"AgentResult", 'String'>
    readonly output: FieldRef<"AgentResult", 'Json'>
    readonly error: FieldRef<"AgentResult", 'String'>
    readonly createdAt: FieldRef<"AgentResult", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AgentResult findUnique
   */
  export type AgentResultFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentResult
     */
    select?: AgentResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentResult
     */
    omit?: AgentResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentResultInclude<ExtArgs> | null
    /**
     * Filter, which AgentResult to fetch.
     */
    where: AgentResultWhereUniqueInput
  }

  /**
   * AgentResult findUniqueOrThrow
   */
  export type AgentResultFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentResult
     */
    select?: AgentResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentResult
     */
    omit?: AgentResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentResultInclude<ExtArgs> | null
    /**
     * Filter, which AgentResult to fetch.
     */
    where: AgentResultWhereUniqueInput
  }

  /**
   * AgentResult findFirst
   */
  export type AgentResultFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentResult
     */
    select?: AgentResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentResult
     */
    omit?: AgentResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentResultInclude<ExtArgs> | null
    /**
     * Filter, which AgentResult to fetch.
     */
    where?: AgentResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentResults to fetch.
     */
    orderBy?: AgentResultOrderByWithRelationInput | AgentResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentResults.
     */
    cursor?: AgentResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentResults.
     */
    distinct?: AgentResultScalarFieldEnum | AgentResultScalarFieldEnum[]
  }

  /**
   * AgentResult findFirstOrThrow
   */
  export type AgentResultFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentResult
     */
    select?: AgentResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentResult
     */
    omit?: AgentResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentResultInclude<ExtArgs> | null
    /**
     * Filter, which AgentResult to fetch.
     */
    where?: AgentResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentResults to fetch.
     */
    orderBy?: AgentResultOrderByWithRelationInput | AgentResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentResults.
     */
    cursor?: AgentResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentResults.
     */
    distinct?: AgentResultScalarFieldEnum | AgentResultScalarFieldEnum[]
  }

  /**
   * AgentResult findMany
   */
  export type AgentResultFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentResult
     */
    select?: AgentResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentResult
     */
    omit?: AgentResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentResultInclude<ExtArgs> | null
    /**
     * Filter, which AgentResults to fetch.
     */
    where?: AgentResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentResults to fetch.
     */
    orderBy?: AgentResultOrderByWithRelationInput | AgentResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgentResults.
     */
    cursor?: AgentResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentResults.
     */
    skip?: number
    distinct?: AgentResultScalarFieldEnum | AgentResultScalarFieldEnum[]
  }

  /**
   * AgentResult create
   */
  export type AgentResultCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentResult
     */
    select?: AgentResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentResult
     */
    omit?: AgentResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentResultInclude<ExtArgs> | null
    /**
     * The data needed to create a AgentResult.
     */
    data: XOR<AgentResultCreateInput, AgentResultUncheckedCreateInput>
  }

  /**
   * AgentResult createMany
   */
  export type AgentResultCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgentResults.
     */
    data: AgentResultCreateManyInput | AgentResultCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentResult createManyAndReturn
   */
  export type AgentResultCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentResult
     */
    select?: AgentResultSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentResult
     */
    omit?: AgentResultOmit<ExtArgs> | null
    /**
     * The data used to create many AgentResults.
     */
    data: AgentResultCreateManyInput | AgentResultCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentResultIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AgentResult update
   */
  export type AgentResultUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentResult
     */
    select?: AgentResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentResult
     */
    omit?: AgentResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentResultInclude<ExtArgs> | null
    /**
     * The data needed to update a AgentResult.
     */
    data: XOR<AgentResultUpdateInput, AgentResultUncheckedUpdateInput>
    /**
     * Choose, which AgentResult to update.
     */
    where: AgentResultWhereUniqueInput
  }

  /**
   * AgentResult updateMany
   */
  export type AgentResultUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgentResults.
     */
    data: XOR<AgentResultUpdateManyMutationInput, AgentResultUncheckedUpdateManyInput>
    /**
     * Filter which AgentResults to update
     */
    where?: AgentResultWhereInput
    /**
     * Limit how many AgentResults to update.
     */
    limit?: number
  }

  /**
   * AgentResult updateManyAndReturn
   */
  export type AgentResultUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentResult
     */
    select?: AgentResultSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentResult
     */
    omit?: AgentResultOmit<ExtArgs> | null
    /**
     * The data used to update AgentResults.
     */
    data: XOR<AgentResultUpdateManyMutationInput, AgentResultUncheckedUpdateManyInput>
    /**
     * Filter which AgentResults to update
     */
    where?: AgentResultWhereInput
    /**
     * Limit how many AgentResults to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentResultIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AgentResult upsert
   */
  export type AgentResultUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentResult
     */
    select?: AgentResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentResult
     */
    omit?: AgentResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentResultInclude<ExtArgs> | null
    /**
     * The filter to search for the AgentResult to update in case it exists.
     */
    where: AgentResultWhereUniqueInput
    /**
     * In case the AgentResult found by the `where` argument doesn't exist, create a new AgentResult with this data.
     */
    create: XOR<AgentResultCreateInput, AgentResultUncheckedCreateInput>
    /**
     * In case the AgentResult was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgentResultUpdateInput, AgentResultUncheckedUpdateInput>
  }

  /**
   * AgentResult delete
   */
  export type AgentResultDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentResult
     */
    select?: AgentResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentResult
     */
    omit?: AgentResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentResultInclude<ExtArgs> | null
    /**
     * Filter which AgentResult to delete.
     */
    where: AgentResultWhereUniqueInput
  }

  /**
   * AgentResult deleteMany
   */
  export type AgentResultDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentResults to delete
     */
    where?: AgentResultWhereInput
    /**
     * Limit how many AgentResults to delete.
     */
    limit?: number
  }

  /**
   * AgentResult without action
   */
  export type AgentResultDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentResult
     */
    select?: AgentResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentResult
     */
    omit?: AgentResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentResultInclude<ExtArgs> | null
  }


  /**
   * Model ContainerRegistry
   */

  export type AggregateContainerRegistry = {
    _count: ContainerRegistryCountAggregateOutputType | null
    _avg: ContainerRegistryAvgAggregateOutputType | null
    _sum: ContainerRegistrySumAggregateOutputType | null
    _min: ContainerRegistryMinAggregateOutputType | null
    _max: ContainerRegistryMaxAggregateOutputType | null
  }

  export type ContainerRegistryAvgAggregateOutputType = {
    grafanaPanelIds: number | null
    kumaMonitorId: number | null
  }

  export type ContainerRegistrySumAggregateOutputType = {
    grafanaPanelIds: number[]
    kumaMonitorId: number | null
  }

  export type ContainerRegistryMinAggregateOutputType = {
    id: string | null
    containerId: string | null
    containerName: string | null
    image: string | null
    status: string | null
    traefikRegistered: boolean | null
    traefikUpdatedAt: Date | null
    prometheusRegistered: boolean | null
    prometheusUpdatedAt: Date | null
    prometheusJobName: string | null
    grafanaRegistered: boolean | null
    grafanaUpdatedAt: Date | null
    kumaRegistered: boolean | null
    kumaUpdatedAt: Date | null
    kumaMonitorId: number | null
    wireguardRegistered: boolean | null
    wireguardUpdatedAt: Date | null
    wireguardIp: string | null
    lokiRegistered: boolean | null
    lokiUpdatedAt: Date | null
    firstDetectedAt: Date | null
    lastEventAt: Date | null
    registrationCompletedAt: Date | null
    lastHealthCheck: Date | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ContainerRegistryMaxAggregateOutputType = {
    id: string | null
    containerId: string | null
    containerName: string | null
    image: string | null
    status: string | null
    traefikRegistered: boolean | null
    traefikUpdatedAt: Date | null
    prometheusRegistered: boolean | null
    prometheusUpdatedAt: Date | null
    prometheusJobName: string | null
    grafanaRegistered: boolean | null
    grafanaUpdatedAt: Date | null
    kumaRegistered: boolean | null
    kumaUpdatedAt: Date | null
    kumaMonitorId: number | null
    wireguardRegistered: boolean | null
    wireguardUpdatedAt: Date | null
    wireguardIp: string | null
    lokiRegistered: boolean | null
    lokiUpdatedAt: Date | null
    firstDetectedAt: Date | null
    lastEventAt: Date | null
    registrationCompletedAt: Date | null
    lastHealthCheck: Date | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ContainerRegistryCountAggregateOutputType = {
    id: number
    containerId: number
    containerName: number
    image: number
    status: number
    ports: number
    labels: number
    environment: number
    networks: number
    traefikRegistered: number
    traefikUpdatedAt: number
    traefikConfig: number
    prometheusRegistered: number
    prometheusUpdatedAt: number
    prometheusJobName: number
    grafanaRegistered: number
    grafanaUpdatedAt: number
    grafanaPanelIds: number
    kumaRegistered: number
    kumaUpdatedAt: number
    kumaMonitorId: number
    wireguardRegistered: number
    wireguardUpdatedAt: number
    wireguardIp: number
    lokiRegistered: number
    lokiUpdatedAt: number
    firstDetectedAt: number
    lastEventAt: number
    registrationCompletedAt: number
    lastHealthCheck: number
    createdBy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ContainerRegistryAvgAggregateInputType = {
    grafanaPanelIds?: true
    kumaMonitorId?: true
  }

  export type ContainerRegistrySumAggregateInputType = {
    grafanaPanelIds?: true
    kumaMonitorId?: true
  }

  export type ContainerRegistryMinAggregateInputType = {
    id?: true
    containerId?: true
    containerName?: true
    image?: true
    status?: true
    traefikRegistered?: true
    traefikUpdatedAt?: true
    prometheusRegistered?: true
    prometheusUpdatedAt?: true
    prometheusJobName?: true
    grafanaRegistered?: true
    grafanaUpdatedAt?: true
    kumaRegistered?: true
    kumaUpdatedAt?: true
    kumaMonitorId?: true
    wireguardRegistered?: true
    wireguardUpdatedAt?: true
    wireguardIp?: true
    lokiRegistered?: true
    lokiUpdatedAt?: true
    firstDetectedAt?: true
    lastEventAt?: true
    registrationCompletedAt?: true
    lastHealthCheck?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ContainerRegistryMaxAggregateInputType = {
    id?: true
    containerId?: true
    containerName?: true
    image?: true
    status?: true
    traefikRegistered?: true
    traefikUpdatedAt?: true
    prometheusRegistered?: true
    prometheusUpdatedAt?: true
    prometheusJobName?: true
    grafanaRegistered?: true
    grafanaUpdatedAt?: true
    kumaRegistered?: true
    kumaUpdatedAt?: true
    kumaMonitorId?: true
    wireguardRegistered?: true
    wireguardUpdatedAt?: true
    wireguardIp?: true
    lokiRegistered?: true
    lokiUpdatedAt?: true
    firstDetectedAt?: true
    lastEventAt?: true
    registrationCompletedAt?: true
    lastHealthCheck?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ContainerRegistryCountAggregateInputType = {
    id?: true
    containerId?: true
    containerName?: true
    image?: true
    status?: true
    ports?: true
    labels?: true
    environment?: true
    networks?: true
    traefikRegistered?: true
    traefikUpdatedAt?: true
    traefikConfig?: true
    prometheusRegistered?: true
    prometheusUpdatedAt?: true
    prometheusJobName?: true
    grafanaRegistered?: true
    grafanaUpdatedAt?: true
    grafanaPanelIds?: true
    kumaRegistered?: true
    kumaUpdatedAt?: true
    kumaMonitorId?: true
    wireguardRegistered?: true
    wireguardUpdatedAt?: true
    wireguardIp?: true
    lokiRegistered?: true
    lokiUpdatedAt?: true
    firstDetectedAt?: true
    lastEventAt?: true
    registrationCompletedAt?: true
    lastHealthCheck?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ContainerRegistryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContainerRegistry to aggregate.
     */
    where?: ContainerRegistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContainerRegistries to fetch.
     */
    orderBy?: ContainerRegistryOrderByWithRelationInput | ContainerRegistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContainerRegistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContainerRegistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContainerRegistries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ContainerRegistries
    **/
    _count?: true | ContainerRegistryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ContainerRegistryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ContainerRegistrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContainerRegistryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContainerRegistryMaxAggregateInputType
  }

  export type GetContainerRegistryAggregateType<T extends ContainerRegistryAggregateArgs> = {
        [P in keyof T & keyof AggregateContainerRegistry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContainerRegistry[P]>
      : GetScalarType<T[P], AggregateContainerRegistry[P]>
  }




  export type ContainerRegistryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContainerRegistryWhereInput
    orderBy?: ContainerRegistryOrderByWithAggregationInput | ContainerRegistryOrderByWithAggregationInput[]
    by: ContainerRegistryScalarFieldEnum[] | ContainerRegistryScalarFieldEnum
    having?: ContainerRegistryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContainerRegistryCountAggregateInputType | true
    _avg?: ContainerRegistryAvgAggregateInputType
    _sum?: ContainerRegistrySumAggregateInputType
    _min?: ContainerRegistryMinAggregateInputType
    _max?: ContainerRegistryMaxAggregateInputType
  }

  export type ContainerRegistryGroupByOutputType = {
    id: string
    containerId: string
    containerName: string
    image: string | null
    status: string
    ports: JsonValue | null
    labels: JsonValue | null
    environment: JsonValue | null
    networks: string[]
    traefikRegistered: boolean
    traefikUpdatedAt: Date | null
    traefikConfig: JsonValue | null
    prometheusRegistered: boolean
    prometheusUpdatedAt: Date | null
    prometheusJobName: string | null
    grafanaRegistered: boolean
    grafanaUpdatedAt: Date | null
    grafanaPanelIds: number[]
    kumaRegistered: boolean
    kumaUpdatedAt: Date | null
    kumaMonitorId: number | null
    wireguardRegistered: boolean
    wireguardUpdatedAt: Date | null
    wireguardIp: string | null
    lokiRegistered: boolean
    lokiUpdatedAt: Date | null
    firstDetectedAt: Date
    lastEventAt: Date
    registrationCompletedAt: Date | null
    lastHealthCheck: Date | null
    createdBy: string
    createdAt: Date
    updatedAt: Date
    _count: ContainerRegistryCountAggregateOutputType | null
    _avg: ContainerRegistryAvgAggregateOutputType | null
    _sum: ContainerRegistrySumAggregateOutputType | null
    _min: ContainerRegistryMinAggregateOutputType | null
    _max: ContainerRegistryMaxAggregateOutputType | null
  }

  type GetContainerRegistryGroupByPayload<T extends ContainerRegistryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContainerRegistryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContainerRegistryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContainerRegistryGroupByOutputType[P]>
            : GetScalarType<T[P], ContainerRegistryGroupByOutputType[P]>
        }
      >
    >


  export type ContainerRegistrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    containerId?: boolean
    containerName?: boolean
    image?: boolean
    status?: boolean
    ports?: boolean
    labels?: boolean
    environment?: boolean
    networks?: boolean
    traefikRegistered?: boolean
    traefikUpdatedAt?: boolean
    traefikConfig?: boolean
    prometheusRegistered?: boolean
    prometheusUpdatedAt?: boolean
    prometheusJobName?: boolean
    grafanaRegistered?: boolean
    grafanaUpdatedAt?: boolean
    grafanaPanelIds?: boolean
    kumaRegistered?: boolean
    kumaUpdatedAt?: boolean
    kumaMonitorId?: boolean
    wireguardRegistered?: boolean
    wireguardUpdatedAt?: boolean
    wireguardIp?: boolean
    lokiRegistered?: boolean
    lokiUpdatedAt?: boolean
    firstDetectedAt?: boolean
    lastEventAt?: boolean
    registrationCompletedAt?: boolean
    lastHealthCheck?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    events?: boolean | ContainerRegistry$eventsArgs<ExtArgs>
    _count?: boolean | ContainerRegistryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["containerRegistry"]>

  export type ContainerRegistrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    containerId?: boolean
    containerName?: boolean
    image?: boolean
    status?: boolean
    ports?: boolean
    labels?: boolean
    environment?: boolean
    networks?: boolean
    traefikRegistered?: boolean
    traefikUpdatedAt?: boolean
    traefikConfig?: boolean
    prometheusRegistered?: boolean
    prometheusUpdatedAt?: boolean
    prometheusJobName?: boolean
    grafanaRegistered?: boolean
    grafanaUpdatedAt?: boolean
    grafanaPanelIds?: boolean
    kumaRegistered?: boolean
    kumaUpdatedAt?: boolean
    kumaMonitorId?: boolean
    wireguardRegistered?: boolean
    wireguardUpdatedAt?: boolean
    wireguardIp?: boolean
    lokiRegistered?: boolean
    lokiUpdatedAt?: boolean
    firstDetectedAt?: boolean
    lastEventAt?: boolean
    registrationCompletedAt?: boolean
    lastHealthCheck?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["containerRegistry"]>

  export type ContainerRegistrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    containerId?: boolean
    containerName?: boolean
    image?: boolean
    status?: boolean
    ports?: boolean
    labels?: boolean
    environment?: boolean
    networks?: boolean
    traefikRegistered?: boolean
    traefikUpdatedAt?: boolean
    traefikConfig?: boolean
    prometheusRegistered?: boolean
    prometheusUpdatedAt?: boolean
    prometheusJobName?: boolean
    grafanaRegistered?: boolean
    grafanaUpdatedAt?: boolean
    grafanaPanelIds?: boolean
    kumaRegistered?: boolean
    kumaUpdatedAt?: boolean
    kumaMonitorId?: boolean
    wireguardRegistered?: boolean
    wireguardUpdatedAt?: boolean
    wireguardIp?: boolean
    lokiRegistered?: boolean
    lokiUpdatedAt?: boolean
    firstDetectedAt?: boolean
    lastEventAt?: boolean
    registrationCompletedAt?: boolean
    lastHealthCheck?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["containerRegistry"]>

  export type ContainerRegistrySelectScalar = {
    id?: boolean
    containerId?: boolean
    containerName?: boolean
    image?: boolean
    status?: boolean
    ports?: boolean
    labels?: boolean
    environment?: boolean
    networks?: boolean
    traefikRegistered?: boolean
    traefikUpdatedAt?: boolean
    traefikConfig?: boolean
    prometheusRegistered?: boolean
    prometheusUpdatedAt?: boolean
    prometheusJobName?: boolean
    grafanaRegistered?: boolean
    grafanaUpdatedAt?: boolean
    grafanaPanelIds?: boolean
    kumaRegistered?: boolean
    kumaUpdatedAt?: boolean
    kumaMonitorId?: boolean
    wireguardRegistered?: boolean
    wireguardUpdatedAt?: boolean
    wireguardIp?: boolean
    lokiRegistered?: boolean
    lokiUpdatedAt?: boolean
    firstDetectedAt?: boolean
    lastEventAt?: boolean
    registrationCompletedAt?: boolean
    lastHealthCheck?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ContainerRegistryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "containerId" | "containerName" | "image" | "status" | "ports" | "labels" | "environment" | "networks" | "traefikRegistered" | "traefikUpdatedAt" | "traefikConfig" | "prometheusRegistered" | "prometheusUpdatedAt" | "prometheusJobName" | "grafanaRegistered" | "grafanaUpdatedAt" | "grafanaPanelIds" | "kumaRegistered" | "kumaUpdatedAt" | "kumaMonitorId" | "wireguardRegistered" | "wireguardUpdatedAt" | "wireguardIp" | "lokiRegistered" | "lokiUpdatedAt" | "firstDetectedAt" | "lastEventAt" | "registrationCompletedAt" | "lastHealthCheck" | "createdBy" | "createdAt" | "updatedAt", ExtArgs["result"]["containerRegistry"]>
  export type ContainerRegistryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | ContainerRegistry$eventsArgs<ExtArgs>
    _count?: boolean | ContainerRegistryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ContainerRegistryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ContainerRegistryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ContainerRegistryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ContainerRegistry"
    objects: {
      events: Prisma.$RegistrationEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      containerId: string
      containerName: string
      image: string | null
      status: string
      ports: Prisma.JsonValue | null
      labels: Prisma.JsonValue | null
      environment: Prisma.JsonValue | null
      networks: string[]
      traefikRegistered: boolean
      traefikUpdatedAt: Date | null
      traefikConfig: Prisma.JsonValue | null
      prometheusRegistered: boolean
      prometheusUpdatedAt: Date | null
      prometheusJobName: string | null
      grafanaRegistered: boolean
      grafanaUpdatedAt: Date | null
      grafanaPanelIds: number[]
      kumaRegistered: boolean
      kumaUpdatedAt: Date | null
      kumaMonitorId: number | null
      wireguardRegistered: boolean
      wireguardUpdatedAt: Date | null
      wireguardIp: string | null
      lokiRegistered: boolean
      lokiUpdatedAt: Date | null
      firstDetectedAt: Date
      lastEventAt: Date
      registrationCompletedAt: Date | null
      lastHealthCheck: Date | null
      createdBy: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["containerRegistry"]>
    composites: {}
  }

  type ContainerRegistryGetPayload<S extends boolean | null | undefined | ContainerRegistryDefaultArgs> = $Result.GetResult<Prisma.$ContainerRegistryPayload, S>

  type ContainerRegistryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ContainerRegistryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ContainerRegistryCountAggregateInputType | true
    }

  export interface ContainerRegistryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ContainerRegistry'], meta: { name: 'ContainerRegistry' } }
    /**
     * Find zero or one ContainerRegistry that matches the filter.
     * @param {ContainerRegistryFindUniqueArgs} args - Arguments to find a ContainerRegistry
     * @example
     * // Get one ContainerRegistry
     * const containerRegistry = await prisma.containerRegistry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContainerRegistryFindUniqueArgs>(args: SelectSubset<T, ContainerRegistryFindUniqueArgs<ExtArgs>>): Prisma__ContainerRegistryClient<$Result.GetResult<Prisma.$ContainerRegistryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ContainerRegistry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ContainerRegistryFindUniqueOrThrowArgs} args - Arguments to find a ContainerRegistry
     * @example
     * // Get one ContainerRegistry
     * const containerRegistry = await prisma.containerRegistry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContainerRegistryFindUniqueOrThrowArgs>(args: SelectSubset<T, ContainerRegistryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContainerRegistryClient<$Result.GetResult<Prisma.$ContainerRegistryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContainerRegistry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContainerRegistryFindFirstArgs} args - Arguments to find a ContainerRegistry
     * @example
     * // Get one ContainerRegistry
     * const containerRegistry = await prisma.containerRegistry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContainerRegistryFindFirstArgs>(args?: SelectSubset<T, ContainerRegistryFindFirstArgs<ExtArgs>>): Prisma__ContainerRegistryClient<$Result.GetResult<Prisma.$ContainerRegistryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ContainerRegistry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContainerRegistryFindFirstOrThrowArgs} args - Arguments to find a ContainerRegistry
     * @example
     * // Get one ContainerRegistry
     * const containerRegistry = await prisma.containerRegistry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContainerRegistryFindFirstOrThrowArgs>(args?: SelectSubset<T, ContainerRegistryFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContainerRegistryClient<$Result.GetResult<Prisma.$ContainerRegistryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ContainerRegistries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContainerRegistryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ContainerRegistries
     * const containerRegistries = await prisma.containerRegistry.findMany()
     * 
     * // Get first 10 ContainerRegistries
     * const containerRegistries = await prisma.containerRegistry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const containerRegistryWithIdOnly = await prisma.containerRegistry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContainerRegistryFindManyArgs>(args?: SelectSubset<T, ContainerRegistryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContainerRegistryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ContainerRegistry.
     * @param {ContainerRegistryCreateArgs} args - Arguments to create a ContainerRegistry.
     * @example
     * // Create one ContainerRegistry
     * const ContainerRegistry = await prisma.containerRegistry.create({
     *   data: {
     *     // ... data to create a ContainerRegistry
     *   }
     * })
     * 
     */
    create<T extends ContainerRegistryCreateArgs>(args: SelectSubset<T, ContainerRegistryCreateArgs<ExtArgs>>): Prisma__ContainerRegistryClient<$Result.GetResult<Prisma.$ContainerRegistryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ContainerRegistries.
     * @param {ContainerRegistryCreateManyArgs} args - Arguments to create many ContainerRegistries.
     * @example
     * // Create many ContainerRegistries
     * const containerRegistry = await prisma.containerRegistry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContainerRegistryCreateManyArgs>(args?: SelectSubset<T, ContainerRegistryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ContainerRegistries and returns the data saved in the database.
     * @param {ContainerRegistryCreateManyAndReturnArgs} args - Arguments to create many ContainerRegistries.
     * @example
     * // Create many ContainerRegistries
     * const containerRegistry = await prisma.containerRegistry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ContainerRegistries and only return the `id`
     * const containerRegistryWithIdOnly = await prisma.containerRegistry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContainerRegistryCreateManyAndReturnArgs>(args?: SelectSubset<T, ContainerRegistryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContainerRegistryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ContainerRegistry.
     * @param {ContainerRegistryDeleteArgs} args - Arguments to delete one ContainerRegistry.
     * @example
     * // Delete one ContainerRegistry
     * const ContainerRegistry = await prisma.containerRegistry.delete({
     *   where: {
     *     // ... filter to delete one ContainerRegistry
     *   }
     * })
     * 
     */
    delete<T extends ContainerRegistryDeleteArgs>(args: SelectSubset<T, ContainerRegistryDeleteArgs<ExtArgs>>): Prisma__ContainerRegistryClient<$Result.GetResult<Prisma.$ContainerRegistryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ContainerRegistry.
     * @param {ContainerRegistryUpdateArgs} args - Arguments to update one ContainerRegistry.
     * @example
     * // Update one ContainerRegistry
     * const containerRegistry = await prisma.containerRegistry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContainerRegistryUpdateArgs>(args: SelectSubset<T, ContainerRegistryUpdateArgs<ExtArgs>>): Prisma__ContainerRegistryClient<$Result.GetResult<Prisma.$ContainerRegistryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ContainerRegistries.
     * @param {ContainerRegistryDeleteManyArgs} args - Arguments to filter ContainerRegistries to delete.
     * @example
     * // Delete a few ContainerRegistries
     * const { count } = await prisma.containerRegistry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContainerRegistryDeleteManyArgs>(args?: SelectSubset<T, ContainerRegistryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContainerRegistries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContainerRegistryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ContainerRegistries
     * const containerRegistry = await prisma.containerRegistry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContainerRegistryUpdateManyArgs>(args: SelectSubset<T, ContainerRegistryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContainerRegistries and returns the data updated in the database.
     * @param {ContainerRegistryUpdateManyAndReturnArgs} args - Arguments to update many ContainerRegistries.
     * @example
     * // Update many ContainerRegistries
     * const containerRegistry = await prisma.containerRegistry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ContainerRegistries and only return the `id`
     * const containerRegistryWithIdOnly = await prisma.containerRegistry.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ContainerRegistryUpdateManyAndReturnArgs>(args: SelectSubset<T, ContainerRegistryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContainerRegistryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ContainerRegistry.
     * @param {ContainerRegistryUpsertArgs} args - Arguments to update or create a ContainerRegistry.
     * @example
     * // Update or create a ContainerRegistry
     * const containerRegistry = await prisma.containerRegistry.upsert({
     *   create: {
     *     // ... data to create a ContainerRegistry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ContainerRegistry we want to update
     *   }
     * })
     */
    upsert<T extends ContainerRegistryUpsertArgs>(args: SelectSubset<T, ContainerRegistryUpsertArgs<ExtArgs>>): Prisma__ContainerRegistryClient<$Result.GetResult<Prisma.$ContainerRegistryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ContainerRegistries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContainerRegistryCountArgs} args - Arguments to filter ContainerRegistries to count.
     * @example
     * // Count the number of ContainerRegistries
     * const count = await prisma.containerRegistry.count({
     *   where: {
     *     // ... the filter for the ContainerRegistries we want to count
     *   }
     * })
    **/
    count<T extends ContainerRegistryCountArgs>(
      args?: Subset<T, ContainerRegistryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContainerRegistryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ContainerRegistry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContainerRegistryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ContainerRegistryAggregateArgs>(args: Subset<T, ContainerRegistryAggregateArgs>): Prisma.PrismaPromise<GetContainerRegistryAggregateType<T>>

    /**
     * Group by ContainerRegistry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContainerRegistryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ContainerRegistryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContainerRegistryGroupByArgs['orderBy'] }
        : { orderBy?: ContainerRegistryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ContainerRegistryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContainerRegistryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ContainerRegistry model
   */
  readonly fields: ContainerRegistryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ContainerRegistry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContainerRegistryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    events<T extends ContainerRegistry$eventsArgs<ExtArgs> = {}>(args?: Subset<T, ContainerRegistry$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegistrationEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ContainerRegistry model
   */
  interface ContainerRegistryFieldRefs {
    readonly id: FieldRef<"ContainerRegistry", 'String'>
    readonly containerId: FieldRef<"ContainerRegistry", 'String'>
    readonly containerName: FieldRef<"ContainerRegistry", 'String'>
    readonly image: FieldRef<"ContainerRegistry", 'String'>
    readonly status: FieldRef<"ContainerRegistry", 'String'>
    readonly ports: FieldRef<"ContainerRegistry", 'Json'>
    readonly labels: FieldRef<"ContainerRegistry", 'Json'>
    readonly environment: FieldRef<"ContainerRegistry", 'Json'>
    readonly networks: FieldRef<"ContainerRegistry", 'String[]'>
    readonly traefikRegistered: FieldRef<"ContainerRegistry", 'Boolean'>
    readonly traefikUpdatedAt: FieldRef<"ContainerRegistry", 'DateTime'>
    readonly traefikConfig: FieldRef<"ContainerRegistry", 'Json'>
    readonly prometheusRegistered: FieldRef<"ContainerRegistry", 'Boolean'>
    readonly prometheusUpdatedAt: FieldRef<"ContainerRegistry", 'DateTime'>
    readonly prometheusJobName: FieldRef<"ContainerRegistry", 'String'>
    readonly grafanaRegistered: FieldRef<"ContainerRegistry", 'Boolean'>
    readonly grafanaUpdatedAt: FieldRef<"ContainerRegistry", 'DateTime'>
    readonly grafanaPanelIds: FieldRef<"ContainerRegistry", 'Int[]'>
    readonly kumaRegistered: FieldRef<"ContainerRegistry", 'Boolean'>
    readonly kumaUpdatedAt: FieldRef<"ContainerRegistry", 'DateTime'>
    readonly kumaMonitorId: FieldRef<"ContainerRegistry", 'Int'>
    readonly wireguardRegistered: FieldRef<"ContainerRegistry", 'Boolean'>
    readonly wireguardUpdatedAt: FieldRef<"ContainerRegistry", 'DateTime'>
    readonly wireguardIp: FieldRef<"ContainerRegistry", 'String'>
    readonly lokiRegistered: FieldRef<"ContainerRegistry", 'Boolean'>
    readonly lokiUpdatedAt: FieldRef<"ContainerRegistry", 'DateTime'>
    readonly firstDetectedAt: FieldRef<"ContainerRegistry", 'DateTime'>
    readonly lastEventAt: FieldRef<"ContainerRegistry", 'DateTime'>
    readonly registrationCompletedAt: FieldRef<"ContainerRegistry", 'DateTime'>
    readonly lastHealthCheck: FieldRef<"ContainerRegistry", 'DateTime'>
    readonly createdBy: FieldRef<"ContainerRegistry", 'String'>
    readonly createdAt: FieldRef<"ContainerRegistry", 'DateTime'>
    readonly updatedAt: FieldRef<"ContainerRegistry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ContainerRegistry findUnique
   */
  export type ContainerRegistryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContainerRegistry
     */
    select?: ContainerRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContainerRegistry
     */
    omit?: ContainerRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContainerRegistryInclude<ExtArgs> | null
    /**
     * Filter, which ContainerRegistry to fetch.
     */
    where: ContainerRegistryWhereUniqueInput
  }

  /**
   * ContainerRegistry findUniqueOrThrow
   */
  export type ContainerRegistryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContainerRegistry
     */
    select?: ContainerRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContainerRegistry
     */
    omit?: ContainerRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContainerRegistryInclude<ExtArgs> | null
    /**
     * Filter, which ContainerRegistry to fetch.
     */
    where: ContainerRegistryWhereUniqueInput
  }

  /**
   * ContainerRegistry findFirst
   */
  export type ContainerRegistryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContainerRegistry
     */
    select?: ContainerRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContainerRegistry
     */
    omit?: ContainerRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContainerRegistryInclude<ExtArgs> | null
    /**
     * Filter, which ContainerRegistry to fetch.
     */
    where?: ContainerRegistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContainerRegistries to fetch.
     */
    orderBy?: ContainerRegistryOrderByWithRelationInput | ContainerRegistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContainerRegistries.
     */
    cursor?: ContainerRegistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContainerRegistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContainerRegistries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContainerRegistries.
     */
    distinct?: ContainerRegistryScalarFieldEnum | ContainerRegistryScalarFieldEnum[]
  }

  /**
   * ContainerRegistry findFirstOrThrow
   */
  export type ContainerRegistryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContainerRegistry
     */
    select?: ContainerRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContainerRegistry
     */
    omit?: ContainerRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContainerRegistryInclude<ExtArgs> | null
    /**
     * Filter, which ContainerRegistry to fetch.
     */
    where?: ContainerRegistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContainerRegistries to fetch.
     */
    orderBy?: ContainerRegistryOrderByWithRelationInput | ContainerRegistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContainerRegistries.
     */
    cursor?: ContainerRegistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContainerRegistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContainerRegistries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContainerRegistries.
     */
    distinct?: ContainerRegistryScalarFieldEnum | ContainerRegistryScalarFieldEnum[]
  }

  /**
   * ContainerRegistry findMany
   */
  export type ContainerRegistryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContainerRegistry
     */
    select?: ContainerRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContainerRegistry
     */
    omit?: ContainerRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContainerRegistryInclude<ExtArgs> | null
    /**
     * Filter, which ContainerRegistries to fetch.
     */
    where?: ContainerRegistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContainerRegistries to fetch.
     */
    orderBy?: ContainerRegistryOrderByWithRelationInput | ContainerRegistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ContainerRegistries.
     */
    cursor?: ContainerRegistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContainerRegistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContainerRegistries.
     */
    skip?: number
    distinct?: ContainerRegistryScalarFieldEnum | ContainerRegistryScalarFieldEnum[]
  }

  /**
   * ContainerRegistry create
   */
  export type ContainerRegistryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContainerRegistry
     */
    select?: ContainerRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContainerRegistry
     */
    omit?: ContainerRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContainerRegistryInclude<ExtArgs> | null
    /**
     * The data needed to create a ContainerRegistry.
     */
    data: XOR<ContainerRegistryCreateInput, ContainerRegistryUncheckedCreateInput>
  }

  /**
   * ContainerRegistry createMany
   */
  export type ContainerRegistryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ContainerRegistries.
     */
    data: ContainerRegistryCreateManyInput | ContainerRegistryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContainerRegistry createManyAndReturn
   */
  export type ContainerRegistryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContainerRegistry
     */
    select?: ContainerRegistrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContainerRegistry
     */
    omit?: ContainerRegistryOmit<ExtArgs> | null
    /**
     * The data used to create many ContainerRegistries.
     */
    data: ContainerRegistryCreateManyInput | ContainerRegistryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContainerRegistry update
   */
  export type ContainerRegistryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContainerRegistry
     */
    select?: ContainerRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContainerRegistry
     */
    omit?: ContainerRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContainerRegistryInclude<ExtArgs> | null
    /**
     * The data needed to update a ContainerRegistry.
     */
    data: XOR<ContainerRegistryUpdateInput, ContainerRegistryUncheckedUpdateInput>
    /**
     * Choose, which ContainerRegistry to update.
     */
    where: ContainerRegistryWhereUniqueInput
  }

  /**
   * ContainerRegistry updateMany
   */
  export type ContainerRegistryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ContainerRegistries.
     */
    data: XOR<ContainerRegistryUpdateManyMutationInput, ContainerRegistryUncheckedUpdateManyInput>
    /**
     * Filter which ContainerRegistries to update
     */
    where?: ContainerRegistryWhereInput
    /**
     * Limit how many ContainerRegistries to update.
     */
    limit?: number
  }

  /**
   * ContainerRegistry updateManyAndReturn
   */
  export type ContainerRegistryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContainerRegistry
     */
    select?: ContainerRegistrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ContainerRegistry
     */
    omit?: ContainerRegistryOmit<ExtArgs> | null
    /**
     * The data used to update ContainerRegistries.
     */
    data: XOR<ContainerRegistryUpdateManyMutationInput, ContainerRegistryUncheckedUpdateManyInput>
    /**
     * Filter which ContainerRegistries to update
     */
    where?: ContainerRegistryWhereInput
    /**
     * Limit how many ContainerRegistries to update.
     */
    limit?: number
  }

  /**
   * ContainerRegistry upsert
   */
  export type ContainerRegistryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContainerRegistry
     */
    select?: ContainerRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContainerRegistry
     */
    omit?: ContainerRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContainerRegistryInclude<ExtArgs> | null
    /**
     * The filter to search for the ContainerRegistry to update in case it exists.
     */
    where: ContainerRegistryWhereUniqueInput
    /**
     * In case the ContainerRegistry found by the `where` argument doesn't exist, create a new ContainerRegistry with this data.
     */
    create: XOR<ContainerRegistryCreateInput, ContainerRegistryUncheckedCreateInput>
    /**
     * In case the ContainerRegistry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContainerRegistryUpdateInput, ContainerRegistryUncheckedUpdateInput>
  }

  /**
   * ContainerRegistry delete
   */
  export type ContainerRegistryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContainerRegistry
     */
    select?: ContainerRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContainerRegistry
     */
    omit?: ContainerRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContainerRegistryInclude<ExtArgs> | null
    /**
     * Filter which ContainerRegistry to delete.
     */
    where: ContainerRegistryWhereUniqueInput
  }

  /**
   * ContainerRegistry deleteMany
   */
  export type ContainerRegistryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContainerRegistries to delete
     */
    where?: ContainerRegistryWhereInput
    /**
     * Limit how many ContainerRegistries to delete.
     */
    limit?: number
  }

  /**
   * ContainerRegistry.events
   */
  export type ContainerRegistry$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationEvent
     */
    select?: RegistrationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationEvent
     */
    omit?: RegistrationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationEventInclude<ExtArgs> | null
    where?: RegistrationEventWhereInput
    orderBy?: RegistrationEventOrderByWithRelationInput | RegistrationEventOrderByWithRelationInput[]
    cursor?: RegistrationEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RegistrationEventScalarFieldEnum | RegistrationEventScalarFieldEnum[]
  }

  /**
   * ContainerRegistry without action
   */
  export type ContainerRegistryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContainerRegistry
     */
    select?: ContainerRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ContainerRegistry
     */
    omit?: ContainerRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContainerRegistryInclude<ExtArgs> | null
  }


  /**
   * Model RegistrationEvent
   */

  export type AggregateRegistrationEvent = {
    _count: RegistrationEventCountAggregateOutputType | null
    _min: RegistrationEventMinAggregateOutputType | null
    _max: RegistrationEventMaxAggregateOutputType | null
  }

  export type RegistrationEventMinAggregateOutputType = {
    id: string | null
    containerId: string | null
    eventType: string | null
    system: string | null
    status: string | null
    message: string | null
    timestamp: Date | null
  }

  export type RegistrationEventMaxAggregateOutputType = {
    id: string | null
    containerId: string | null
    eventType: string | null
    system: string | null
    status: string | null
    message: string | null
    timestamp: Date | null
  }

  export type RegistrationEventCountAggregateOutputType = {
    id: number
    containerId: number
    eventType: number
    system: number
    status: number
    message: number
    errorDetails: number
    timestamp: number
    _all: number
  }


  export type RegistrationEventMinAggregateInputType = {
    id?: true
    containerId?: true
    eventType?: true
    system?: true
    status?: true
    message?: true
    timestamp?: true
  }

  export type RegistrationEventMaxAggregateInputType = {
    id?: true
    containerId?: true
    eventType?: true
    system?: true
    status?: true
    message?: true
    timestamp?: true
  }

  export type RegistrationEventCountAggregateInputType = {
    id?: true
    containerId?: true
    eventType?: true
    system?: true
    status?: true
    message?: true
    errorDetails?: true
    timestamp?: true
    _all?: true
  }

  export type RegistrationEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RegistrationEvent to aggregate.
     */
    where?: RegistrationEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegistrationEvents to fetch.
     */
    orderBy?: RegistrationEventOrderByWithRelationInput | RegistrationEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RegistrationEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegistrationEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegistrationEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RegistrationEvents
    **/
    _count?: true | RegistrationEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RegistrationEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RegistrationEventMaxAggregateInputType
  }

  export type GetRegistrationEventAggregateType<T extends RegistrationEventAggregateArgs> = {
        [P in keyof T & keyof AggregateRegistrationEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRegistrationEvent[P]>
      : GetScalarType<T[P], AggregateRegistrationEvent[P]>
  }




  export type RegistrationEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RegistrationEventWhereInput
    orderBy?: RegistrationEventOrderByWithAggregationInput | RegistrationEventOrderByWithAggregationInput[]
    by: RegistrationEventScalarFieldEnum[] | RegistrationEventScalarFieldEnum
    having?: RegistrationEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RegistrationEventCountAggregateInputType | true
    _min?: RegistrationEventMinAggregateInputType
    _max?: RegistrationEventMaxAggregateInputType
  }

  export type RegistrationEventGroupByOutputType = {
    id: string
    containerId: string
    eventType: string
    system: string
    status: string
    message: string | null
    errorDetails: JsonValue | null
    timestamp: Date
    _count: RegistrationEventCountAggregateOutputType | null
    _min: RegistrationEventMinAggregateOutputType | null
    _max: RegistrationEventMaxAggregateOutputType | null
  }

  type GetRegistrationEventGroupByPayload<T extends RegistrationEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RegistrationEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RegistrationEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RegistrationEventGroupByOutputType[P]>
            : GetScalarType<T[P], RegistrationEventGroupByOutputType[P]>
        }
      >
    >


  export type RegistrationEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    containerId?: boolean
    eventType?: boolean
    system?: boolean
    status?: boolean
    message?: boolean
    errorDetails?: boolean
    timestamp?: boolean
    container?: boolean | ContainerRegistryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["registrationEvent"]>

  export type RegistrationEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    containerId?: boolean
    eventType?: boolean
    system?: boolean
    status?: boolean
    message?: boolean
    errorDetails?: boolean
    timestamp?: boolean
    container?: boolean | ContainerRegistryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["registrationEvent"]>

  export type RegistrationEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    containerId?: boolean
    eventType?: boolean
    system?: boolean
    status?: boolean
    message?: boolean
    errorDetails?: boolean
    timestamp?: boolean
    container?: boolean | ContainerRegistryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["registrationEvent"]>

  export type RegistrationEventSelectScalar = {
    id?: boolean
    containerId?: boolean
    eventType?: boolean
    system?: boolean
    status?: boolean
    message?: boolean
    errorDetails?: boolean
    timestamp?: boolean
  }

  export type RegistrationEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "containerId" | "eventType" | "system" | "status" | "message" | "errorDetails" | "timestamp", ExtArgs["result"]["registrationEvent"]>
  export type RegistrationEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    container?: boolean | ContainerRegistryDefaultArgs<ExtArgs>
  }
  export type RegistrationEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    container?: boolean | ContainerRegistryDefaultArgs<ExtArgs>
  }
  export type RegistrationEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    container?: boolean | ContainerRegistryDefaultArgs<ExtArgs>
  }

  export type $RegistrationEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RegistrationEvent"
    objects: {
      container: Prisma.$ContainerRegistryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      containerId: string
      eventType: string
      system: string
      status: string
      message: string | null
      errorDetails: Prisma.JsonValue | null
      timestamp: Date
    }, ExtArgs["result"]["registrationEvent"]>
    composites: {}
  }

  type RegistrationEventGetPayload<S extends boolean | null | undefined | RegistrationEventDefaultArgs> = $Result.GetResult<Prisma.$RegistrationEventPayload, S>

  type RegistrationEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RegistrationEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RegistrationEventCountAggregateInputType | true
    }

  export interface RegistrationEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RegistrationEvent'], meta: { name: 'RegistrationEvent' } }
    /**
     * Find zero or one RegistrationEvent that matches the filter.
     * @param {RegistrationEventFindUniqueArgs} args - Arguments to find a RegistrationEvent
     * @example
     * // Get one RegistrationEvent
     * const registrationEvent = await prisma.registrationEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RegistrationEventFindUniqueArgs>(args: SelectSubset<T, RegistrationEventFindUniqueArgs<ExtArgs>>): Prisma__RegistrationEventClient<$Result.GetResult<Prisma.$RegistrationEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RegistrationEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RegistrationEventFindUniqueOrThrowArgs} args - Arguments to find a RegistrationEvent
     * @example
     * // Get one RegistrationEvent
     * const registrationEvent = await prisma.registrationEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RegistrationEventFindUniqueOrThrowArgs>(args: SelectSubset<T, RegistrationEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RegistrationEventClient<$Result.GetResult<Prisma.$RegistrationEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RegistrationEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationEventFindFirstArgs} args - Arguments to find a RegistrationEvent
     * @example
     * // Get one RegistrationEvent
     * const registrationEvent = await prisma.registrationEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RegistrationEventFindFirstArgs>(args?: SelectSubset<T, RegistrationEventFindFirstArgs<ExtArgs>>): Prisma__RegistrationEventClient<$Result.GetResult<Prisma.$RegistrationEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RegistrationEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationEventFindFirstOrThrowArgs} args - Arguments to find a RegistrationEvent
     * @example
     * // Get one RegistrationEvent
     * const registrationEvent = await prisma.registrationEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RegistrationEventFindFirstOrThrowArgs>(args?: SelectSubset<T, RegistrationEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__RegistrationEventClient<$Result.GetResult<Prisma.$RegistrationEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RegistrationEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RegistrationEvents
     * const registrationEvents = await prisma.registrationEvent.findMany()
     * 
     * // Get first 10 RegistrationEvents
     * const registrationEvents = await prisma.registrationEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const registrationEventWithIdOnly = await prisma.registrationEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RegistrationEventFindManyArgs>(args?: SelectSubset<T, RegistrationEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegistrationEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RegistrationEvent.
     * @param {RegistrationEventCreateArgs} args - Arguments to create a RegistrationEvent.
     * @example
     * // Create one RegistrationEvent
     * const RegistrationEvent = await prisma.registrationEvent.create({
     *   data: {
     *     // ... data to create a RegistrationEvent
     *   }
     * })
     * 
     */
    create<T extends RegistrationEventCreateArgs>(args: SelectSubset<T, RegistrationEventCreateArgs<ExtArgs>>): Prisma__RegistrationEventClient<$Result.GetResult<Prisma.$RegistrationEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RegistrationEvents.
     * @param {RegistrationEventCreateManyArgs} args - Arguments to create many RegistrationEvents.
     * @example
     * // Create many RegistrationEvents
     * const registrationEvent = await prisma.registrationEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RegistrationEventCreateManyArgs>(args?: SelectSubset<T, RegistrationEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RegistrationEvents and returns the data saved in the database.
     * @param {RegistrationEventCreateManyAndReturnArgs} args - Arguments to create many RegistrationEvents.
     * @example
     * // Create many RegistrationEvents
     * const registrationEvent = await prisma.registrationEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RegistrationEvents and only return the `id`
     * const registrationEventWithIdOnly = await prisma.registrationEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RegistrationEventCreateManyAndReturnArgs>(args?: SelectSubset<T, RegistrationEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegistrationEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RegistrationEvent.
     * @param {RegistrationEventDeleteArgs} args - Arguments to delete one RegistrationEvent.
     * @example
     * // Delete one RegistrationEvent
     * const RegistrationEvent = await prisma.registrationEvent.delete({
     *   where: {
     *     // ... filter to delete one RegistrationEvent
     *   }
     * })
     * 
     */
    delete<T extends RegistrationEventDeleteArgs>(args: SelectSubset<T, RegistrationEventDeleteArgs<ExtArgs>>): Prisma__RegistrationEventClient<$Result.GetResult<Prisma.$RegistrationEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RegistrationEvent.
     * @param {RegistrationEventUpdateArgs} args - Arguments to update one RegistrationEvent.
     * @example
     * // Update one RegistrationEvent
     * const registrationEvent = await prisma.registrationEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RegistrationEventUpdateArgs>(args: SelectSubset<T, RegistrationEventUpdateArgs<ExtArgs>>): Prisma__RegistrationEventClient<$Result.GetResult<Prisma.$RegistrationEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RegistrationEvents.
     * @param {RegistrationEventDeleteManyArgs} args - Arguments to filter RegistrationEvents to delete.
     * @example
     * // Delete a few RegistrationEvents
     * const { count } = await prisma.registrationEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RegistrationEventDeleteManyArgs>(args?: SelectSubset<T, RegistrationEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RegistrationEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RegistrationEvents
     * const registrationEvent = await prisma.registrationEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RegistrationEventUpdateManyArgs>(args: SelectSubset<T, RegistrationEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RegistrationEvents and returns the data updated in the database.
     * @param {RegistrationEventUpdateManyAndReturnArgs} args - Arguments to update many RegistrationEvents.
     * @example
     * // Update many RegistrationEvents
     * const registrationEvent = await prisma.registrationEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RegistrationEvents and only return the `id`
     * const registrationEventWithIdOnly = await prisma.registrationEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RegistrationEventUpdateManyAndReturnArgs>(args: SelectSubset<T, RegistrationEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegistrationEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RegistrationEvent.
     * @param {RegistrationEventUpsertArgs} args - Arguments to update or create a RegistrationEvent.
     * @example
     * // Update or create a RegistrationEvent
     * const registrationEvent = await prisma.registrationEvent.upsert({
     *   create: {
     *     // ... data to create a RegistrationEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RegistrationEvent we want to update
     *   }
     * })
     */
    upsert<T extends RegistrationEventUpsertArgs>(args: SelectSubset<T, RegistrationEventUpsertArgs<ExtArgs>>): Prisma__RegistrationEventClient<$Result.GetResult<Prisma.$RegistrationEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RegistrationEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationEventCountArgs} args - Arguments to filter RegistrationEvents to count.
     * @example
     * // Count the number of RegistrationEvents
     * const count = await prisma.registrationEvent.count({
     *   where: {
     *     // ... the filter for the RegistrationEvents we want to count
     *   }
     * })
    **/
    count<T extends RegistrationEventCountArgs>(
      args?: Subset<T, RegistrationEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RegistrationEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RegistrationEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RegistrationEventAggregateArgs>(args: Subset<T, RegistrationEventAggregateArgs>): Prisma.PrismaPromise<GetRegistrationEventAggregateType<T>>

    /**
     * Group by RegistrationEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegistrationEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RegistrationEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RegistrationEventGroupByArgs['orderBy'] }
        : { orderBy?: RegistrationEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RegistrationEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRegistrationEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RegistrationEvent model
   */
  readonly fields: RegistrationEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RegistrationEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RegistrationEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    container<T extends ContainerRegistryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ContainerRegistryDefaultArgs<ExtArgs>>): Prisma__ContainerRegistryClient<$Result.GetResult<Prisma.$ContainerRegistryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RegistrationEvent model
   */
  interface RegistrationEventFieldRefs {
    readonly id: FieldRef<"RegistrationEvent", 'String'>
    readonly containerId: FieldRef<"RegistrationEvent", 'String'>
    readonly eventType: FieldRef<"RegistrationEvent", 'String'>
    readonly system: FieldRef<"RegistrationEvent", 'String'>
    readonly status: FieldRef<"RegistrationEvent", 'String'>
    readonly message: FieldRef<"RegistrationEvent", 'String'>
    readonly errorDetails: FieldRef<"RegistrationEvent", 'Json'>
    readonly timestamp: FieldRef<"RegistrationEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RegistrationEvent findUnique
   */
  export type RegistrationEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationEvent
     */
    select?: RegistrationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationEvent
     */
    omit?: RegistrationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationEventInclude<ExtArgs> | null
    /**
     * Filter, which RegistrationEvent to fetch.
     */
    where: RegistrationEventWhereUniqueInput
  }

  /**
   * RegistrationEvent findUniqueOrThrow
   */
  export type RegistrationEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationEvent
     */
    select?: RegistrationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationEvent
     */
    omit?: RegistrationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationEventInclude<ExtArgs> | null
    /**
     * Filter, which RegistrationEvent to fetch.
     */
    where: RegistrationEventWhereUniqueInput
  }

  /**
   * RegistrationEvent findFirst
   */
  export type RegistrationEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationEvent
     */
    select?: RegistrationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationEvent
     */
    omit?: RegistrationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationEventInclude<ExtArgs> | null
    /**
     * Filter, which RegistrationEvent to fetch.
     */
    where?: RegistrationEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegistrationEvents to fetch.
     */
    orderBy?: RegistrationEventOrderByWithRelationInput | RegistrationEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RegistrationEvents.
     */
    cursor?: RegistrationEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegistrationEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegistrationEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RegistrationEvents.
     */
    distinct?: RegistrationEventScalarFieldEnum | RegistrationEventScalarFieldEnum[]
  }

  /**
   * RegistrationEvent findFirstOrThrow
   */
  export type RegistrationEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationEvent
     */
    select?: RegistrationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationEvent
     */
    omit?: RegistrationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationEventInclude<ExtArgs> | null
    /**
     * Filter, which RegistrationEvent to fetch.
     */
    where?: RegistrationEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegistrationEvents to fetch.
     */
    orderBy?: RegistrationEventOrderByWithRelationInput | RegistrationEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RegistrationEvents.
     */
    cursor?: RegistrationEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegistrationEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegistrationEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RegistrationEvents.
     */
    distinct?: RegistrationEventScalarFieldEnum | RegistrationEventScalarFieldEnum[]
  }

  /**
   * RegistrationEvent findMany
   */
  export type RegistrationEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationEvent
     */
    select?: RegistrationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationEvent
     */
    omit?: RegistrationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationEventInclude<ExtArgs> | null
    /**
     * Filter, which RegistrationEvents to fetch.
     */
    where?: RegistrationEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegistrationEvents to fetch.
     */
    orderBy?: RegistrationEventOrderByWithRelationInput | RegistrationEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RegistrationEvents.
     */
    cursor?: RegistrationEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegistrationEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegistrationEvents.
     */
    skip?: number
    distinct?: RegistrationEventScalarFieldEnum | RegistrationEventScalarFieldEnum[]
  }

  /**
   * RegistrationEvent create
   */
  export type RegistrationEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationEvent
     */
    select?: RegistrationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationEvent
     */
    omit?: RegistrationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationEventInclude<ExtArgs> | null
    /**
     * The data needed to create a RegistrationEvent.
     */
    data: XOR<RegistrationEventCreateInput, RegistrationEventUncheckedCreateInput>
  }

  /**
   * RegistrationEvent createMany
   */
  export type RegistrationEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RegistrationEvents.
     */
    data: RegistrationEventCreateManyInput | RegistrationEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RegistrationEvent createManyAndReturn
   */
  export type RegistrationEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationEvent
     */
    select?: RegistrationEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationEvent
     */
    omit?: RegistrationEventOmit<ExtArgs> | null
    /**
     * The data used to create many RegistrationEvents.
     */
    data: RegistrationEventCreateManyInput | RegistrationEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RegistrationEvent update
   */
  export type RegistrationEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationEvent
     */
    select?: RegistrationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationEvent
     */
    omit?: RegistrationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationEventInclude<ExtArgs> | null
    /**
     * The data needed to update a RegistrationEvent.
     */
    data: XOR<RegistrationEventUpdateInput, RegistrationEventUncheckedUpdateInput>
    /**
     * Choose, which RegistrationEvent to update.
     */
    where: RegistrationEventWhereUniqueInput
  }

  /**
   * RegistrationEvent updateMany
   */
  export type RegistrationEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RegistrationEvents.
     */
    data: XOR<RegistrationEventUpdateManyMutationInput, RegistrationEventUncheckedUpdateManyInput>
    /**
     * Filter which RegistrationEvents to update
     */
    where?: RegistrationEventWhereInput
    /**
     * Limit how many RegistrationEvents to update.
     */
    limit?: number
  }

  /**
   * RegistrationEvent updateManyAndReturn
   */
  export type RegistrationEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationEvent
     */
    select?: RegistrationEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationEvent
     */
    omit?: RegistrationEventOmit<ExtArgs> | null
    /**
     * The data used to update RegistrationEvents.
     */
    data: XOR<RegistrationEventUpdateManyMutationInput, RegistrationEventUncheckedUpdateManyInput>
    /**
     * Filter which RegistrationEvents to update
     */
    where?: RegistrationEventWhereInput
    /**
     * Limit how many RegistrationEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RegistrationEvent upsert
   */
  export type RegistrationEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationEvent
     */
    select?: RegistrationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationEvent
     */
    omit?: RegistrationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationEventInclude<ExtArgs> | null
    /**
     * The filter to search for the RegistrationEvent to update in case it exists.
     */
    where: RegistrationEventWhereUniqueInput
    /**
     * In case the RegistrationEvent found by the `where` argument doesn't exist, create a new RegistrationEvent with this data.
     */
    create: XOR<RegistrationEventCreateInput, RegistrationEventUncheckedCreateInput>
    /**
     * In case the RegistrationEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RegistrationEventUpdateInput, RegistrationEventUncheckedUpdateInput>
  }

  /**
   * RegistrationEvent delete
   */
  export type RegistrationEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationEvent
     */
    select?: RegistrationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationEvent
     */
    omit?: RegistrationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationEventInclude<ExtArgs> | null
    /**
     * Filter which RegistrationEvent to delete.
     */
    where: RegistrationEventWhereUniqueInput
  }

  /**
   * RegistrationEvent deleteMany
   */
  export type RegistrationEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RegistrationEvents to delete
     */
    where?: RegistrationEventWhereInput
    /**
     * Limit how many RegistrationEvents to delete.
     */
    limit?: number
  }

  /**
   * RegistrationEvent without action
   */
  export type RegistrationEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegistrationEvent
     */
    select?: RegistrationEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegistrationEvent
     */
    omit?: RegistrationEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegistrationEventInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PerformanceScalarFieldEnum: {
    id: 'id',
    timestamp: 'timestamp',
    orders: 'orders',
    returns: 'returns',
    downtime: 'downtime',
    notes: 'notes'
  };

  export type PerformanceScalarFieldEnum = (typeof PerformanceScalarFieldEnum)[keyof typeof PerformanceScalarFieldEnum]


  export const AgentJobScalarFieldEnum: {
    id: 'id',
    agentName: 'agentName',
    status: 'status',
    triggeredBy: 'triggeredBy',
    triggeredAt: 'triggeredAt',
    completedAt: 'completedAt',
    result: 'result',
    error: 'error',
    durationMs: 'durationMs',
    metadata: 'metadata'
  };

  export type AgentJobScalarFieldEnum = (typeof AgentJobScalarFieldEnum)[keyof typeof AgentJobScalarFieldEnum]


  export const AgentConfigScalarFieldEnum: {
    id: 'id',
    agentName: 'agentName',
    config: 'config',
    updatedAt: 'updatedAt'
  };

  export type AgentConfigScalarFieldEnum = (typeof AgentConfigScalarFieldEnum)[keyof typeof AgentConfigScalarFieldEnum]


  export const AgentResultScalarFieldEnum: {
    id: 'id',
    jobId: 'jobId',
    output: 'output',
    error: 'error',
    createdAt: 'createdAt'
  };

  export type AgentResultScalarFieldEnum = (typeof AgentResultScalarFieldEnum)[keyof typeof AgentResultScalarFieldEnum]


  export const ContainerRegistryScalarFieldEnum: {
    id: 'id',
    containerId: 'containerId',
    containerName: 'containerName',
    image: 'image',
    status: 'status',
    ports: 'ports',
    labels: 'labels',
    environment: 'environment',
    networks: 'networks',
    traefikRegistered: 'traefikRegistered',
    traefikUpdatedAt: 'traefikUpdatedAt',
    traefikConfig: 'traefikConfig',
    prometheusRegistered: 'prometheusRegistered',
    prometheusUpdatedAt: 'prometheusUpdatedAt',
    prometheusJobName: 'prometheusJobName',
    grafanaRegistered: 'grafanaRegistered',
    grafanaUpdatedAt: 'grafanaUpdatedAt',
    grafanaPanelIds: 'grafanaPanelIds',
    kumaRegistered: 'kumaRegistered',
    kumaUpdatedAt: 'kumaUpdatedAt',
    kumaMonitorId: 'kumaMonitorId',
    wireguardRegistered: 'wireguardRegistered',
    wireguardUpdatedAt: 'wireguardUpdatedAt',
    wireguardIp: 'wireguardIp',
    lokiRegistered: 'lokiRegistered',
    lokiUpdatedAt: 'lokiUpdatedAt',
    firstDetectedAt: 'firstDetectedAt',
    lastEventAt: 'lastEventAt',
    registrationCompletedAt: 'registrationCompletedAt',
    lastHealthCheck: 'lastHealthCheck',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ContainerRegistryScalarFieldEnum = (typeof ContainerRegistryScalarFieldEnum)[keyof typeof ContainerRegistryScalarFieldEnum]


  export const RegistrationEventScalarFieldEnum: {
    id: 'id',
    containerId: 'containerId',
    eventType: 'eventType',
    system: 'system',
    status: 'status',
    message: 'message',
    errorDetails: 'errorDetails',
    timestamp: 'timestamp'
  };

  export type RegistrationEventScalarFieldEnum = (typeof RegistrationEventScalarFieldEnum)[keyof typeof RegistrationEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'AgentStatus'
   */
  export type EnumAgentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AgentStatus'>
    


  /**
   * Reference to a field of type 'AgentStatus[]'
   */
  export type ListEnumAgentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AgentStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type PerformanceWhereInput = {
    AND?: PerformanceWhereInput | PerformanceWhereInput[]
    OR?: PerformanceWhereInput[]
    NOT?: PerformanceWhereInput | PerformanceWhereInput[]
    id?: StringFilter<"Performance"> | string
    timestamp?: DateTimeFilter<"Performance"> | Date | string
    orders?: IntFilter<"Performance"> | number
    returns?: IntFilter<"Performance"> | number
    downtime?: BoolFilter<"Performance"> | boolean
    notes?: StringNullableFilter<"Performance"> | string | null
  }

  export type PerformanceOrderByWithRelationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    orders?: SortOrder
    returns?: SortOrder
    downtime?: SortOrder
    notes?: SortOrderInput | SortOrder
  }

  export type PerformanceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PerformanceWhereInput | PerformanceWhereInput[]
    OR?: PerformanceWhereInput[]
    NOT?: PerformanceWhereInput | PerformanceWhereInput[]
    timestamp?: DateTimeFilter<"Performance"> | Date | string
    orders?: IntFilter<"Performance"> | number
    returns?: IntFilter<"Performance"> | number
    downtime?: BoolFilter<"Performance"> | boolean
    notes?: StringNullableFilter<"Performance"> | string | null
  }, "id">

  export type PerformanceOrderByWithAggregationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    orders?: SortOrder
    returns?: SortOrder
    downtime?: SortOrder
    notes?: SortOrderInput | SortOrder
    _count?: PerformanceCountOrderByAggregateInput
    _avg?: PerformanceAvgOrderByAggregateInput
    _max?: PerformanceMaxOrderByAggregateInput
    _min?: PerformanceMinOrderByAggregateInput
    _sum?: PerformanceSumOrderByAggregateInput
  }

  export type PerformanceScalarWhereWithAggregatesInput = {
    AND?: PerformanceScalarWhereWithAggregatesInput | PerformanceScalarWhereWithAggregatesInput[]
    OR?: PerformanceScalarWhereWithAggregatesInput[]
    NOT?: PerformanceScalarWhereWithAggregatesInput | PerformanceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Performance"> | string
    timestamp?: DateTimeWithAggregatesFilter<"Performance"> | Date | string
    orders?: IntWithAggregatesFilter<"Performance"> | number
    returns?: IntWithAggregatesFilter<"Performance"> | number
    downtime?: BoolWithAggregatesFilter<"Performance"> | boolean
    notes?: StringNullableWithAggregatesFilter<"Performance"> | string | null
  }

  export type AgentJobWhereInput = {
    AND?: AgentJobWhereInput | AgentJobWhereInput[]
    OR?: AgentJobWhereInput[]
    NOT?: AgentJobWhereInput | AgentJobWhereInput[]
    id?: StringFilter<"AgentJob"> | string
    agentName?: StringFilter<"AgentJob"> | string
    status?: EnumAgentStatusFilter<"AgentJob"> | $Enums.AgentStatus
    triggeredBy?: StringFilter<"AgentJob"> | string
    triggeredAt?: DateTimeFilter<"AgentJob"> | Date | string
    completedAt?: DateTimeNullableFilter<"AgentJob"> | Date | string | null
    result?: JsonNullableFilter<"AgentJob">
    error?: StringNullableFilter<"AgentJob"> | string | null
    durationMs?: IntNullableFilter<"AgentJob"> | number | null
    metadata?: JsonNullableFilter<"AgentJob">
    results?: XOR<AgentResultNullableScalarRelationFilter, AgentResultWhereInput> | null
  }

  export type AgentJobOrderByWithRelationInput = {
    id?: SortOrder
    agentName?: SortOrder
    status?: SortOrder
    triggeredBy?: SortOrder
    triggeredAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    result?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    durationMs?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    results?: AgentResultOrderByWithRelationInput
  }

  export type AgentJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AgentJobWhereInput | AgentJobWhereInput[]
    OR?: AgentJobWhereInput[]
    NOT?: AgentJobWhereInput | AgentJobWhereInput[]
    agentName?: StringFilter<"AgentJob"> | string
    status?: EnumAgentStatusFilter<"AgentJob"> | $Enums.AgentStatus
    triggeredBy?: StringFilter<"AgentJob"> | string
    triggeredAt?: DateTimeFilter<"AgentJob"> | Date | string
    completedAt?: DateTimeNullableFilter<"AgentJob"> | Date | string | null
    result?: JsonNullableFilter<"AgentJob">
    error?: StringNullableFilter<"AgentJob"> | string | null
    durationMs?: IntNullableFilter<"AgentJob"> | number | null
    metadata?: JsonNullableFilter<"AgentJob">
    results?: XOR<AgentResultNullableScalarRelationFilter, AgentResultWhereInput> | null
  }, "id">

  export type AgentJobOrderByWithAggregationInput = {
    id?: SortOrder
    agentName?: SortOrder
    status?: SortOrder
    triggeredBy?: SortOrder
    triggeredAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    result?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    durationMs?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    _count?: AgentJobCountOrderByAggregateInput
    _avg?: AgentJobAvgOrderByAggregateInput
    _max?: AgentJobMaxOrderByAggregateInput
    _min?: AgentJobMinOrderByAggregateInput
    _sum?: AgentJobSumOrderByAggregateInput
  }

  export type AgentJobScalarWhereWithAggregatesInput = {
    AND?: AgentJobScalarWhereWithAggregatesInput | AgentJobScalarWhereWithAggregatesInput[]
    OR?: AgentJobScalarWhereWithAggregatesInput[]
    NOT?: AgentJobScalarWhereWithAggregatesInput | AgentJobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AgentJob"> | string
    agentName?: StringWithAggregatesFilter<"AgentJob"> | string
    status?: EnumAgentStatusWithAggregatesFilter<"AgentJob"> | $Enums.AgentStatus
    triggeredBy?: StringWithAggregatesFilter<"AgentJob"> | string
    triggeredAt?: DateTimeWithAggregatesFilter<"AgentJob"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"AgentJob"> | Date | string | null
    result?: JsonNullableWithAggregatesFilter<"AgentJob">
    error?: StringNullableWithAggregatesFilter<"AgentJob"> | string | null
    durationMs?: IntNullableWithAggregatesFilter<"AgentJob"> | number | null
    metadata?: JsonNullableWithAggregatesFilter<"AgentJob">
  }

  export type AgentConfigWhereInput = {
    AND?: AgentConfigWhereInput | AgentConfigWhereInput[]
    OR?: AgentConfigWhereInput[]
    NOT?: AgentConfigWhereInput | AgentConfigWhereInput[]
    id?: StringFilter<"AgentConfig"> | string
    agentName?: StringFilter<"AgentConfig"> | string
    config?: JsonFilter<"AgentConfig">
    updatedAt?: DateTimeFilter<"AgentConfig"> | Date | string
  }

  export type AgentConfigOrderByWithRelationInput = {
    id?: SortOrder
    agentName?: SortOrder
    config?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    agentName?: string
    AND?: AgentConfigWhereInput | AgentConfigWhereInput[]
    OR?: AgentConfigWhereInput[]
    NOT?: AgentConfigWhereInput | AgentConfigWhereInput[]
    config?: JsonFilter<"AgentConfig">
    updatedAt?: DateTimeFilter<"AgentConfig"> | Date | string
  }, "id" | "agentName">

  export type AgentConfigOrderByWithAggregationInput = {
    id?: SortOrder
    agentName?: SortOrder
    config?: SortOrder
    updatedAt?: SortOrder
    _count?: AgentConfigCountOrderByAggregateInput
    _max?: AgentConfigMaxOrderByAggregateInput
    _min?: AgentConfigMinOrderByAggregateInput
  }

  export type AgentConfigScalarWhereWithAggregatesInput = {
    AND?: AgentConfigScalarWhereWithAggregatesInput | AgentConfigScalarWhereWithAggregatesInput[]
    OR?: AgentConfigScalarWhereWithAggregatesInput[]
    NOT?: AgentConfigScalarWhereWithAggregatesInput | AgentConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AgentConfig"> | string
    agentName?: StringWithAggregatesFilter<"AgentConfig"> | string
    config?: JsonWithAggregatesFilter<"AgentConfig">
    updatedAt?: DateTimeWithAggregatesFilter<"AgentConfig"> | Date | string
  }

  export type AgentResultWhereInput = {
    AND?: AgentResultWhereInput | AgentResultWhereInput[]
    OR?: AgentResultWhereInput[]
    NOT?: AgentResultWhereInput | AgentResultWhereInput[]
    id?: StringFilter<"AgentResult"> | string
    jobId?: StringFilter<"AgentResult"> | string
    output?: JsonFilter<"AgentResult">
    error?: StringNullableFilter<"AgentResult"> | string | null
    createdAt?: DateTimeFilter<"AgentResult"> | Date | string
    job?: XOR<AgentJobScalarRelationFilter, AgentJobWhereInput>
  }

  export type AgentResultOrderByWithRelationInput = {
    id?: SortOrder
    jobId?: SortOrder
    output?: SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    job?: AgentJobOrderByWithRelationInput
  }

  export type AgentResultWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    jobId?: string
    AND?: AgentResultWhereInput | AgentResultWhereInput[]
    OR?: AgentResultWhereInput[]
    NOT?: AgentResultWhereInput | AgentResultWhereInput[]
    output?: JsonFilter<"AgentResult">
    error?: StringNullableFilter<"AgentResult"> | string | null
    createdAt?: DateTimeFilter<"AgentResult"> | Date | string
    job?: XOR<AgentJobScalarRelationFilter, AgentJobWhereInput>
  }, "id" | "jobId">

  export type AgentResultOrderByWithAggregationInput = {
    id?: SortOrder
    jobId?: SortOrder
    output?: SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AgentResultCountOrderByAggregateInput
    _max?: AgentResultMaxOrderByAggregateInput
    _min?: AgentResultMinOrderByAggregateInput
  }

  export type AgentResultScalarWhereWithAggregatesInput = {
    AND?: AgentResultScalarWhereWithAggregatesInput | AgentResultScalarWhereWithAggregatesInput[]
    OR?: AgentResultScalarWhereWithAggregatesInput[]
    NOT?: AgentResultScalarWhereWithAggregatesInput | AgentResultScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AgentResult"> | string
    jobId?: StringWithAggregatesFilter<"AgentResult"> | string
    output?: JsonWithAggregatesFilter<"AgentResult">
    error?: StringNullableWithAggregatesFilter<"AgentResult"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AgentResult"> | Date | string
  }

  export type ContainerRegistryWhereInput = {
    AND?: ContainerRegistryWhereInput | ContainerRegistryWhereInput[]
    OR?: ContainerRegistryWhereInput[]
    NOT?: ContainerRegistryWhereInput | ContainerRegistryWhereInput[]
    id?: StringFilter<"ContainerRegistry"> | string
    containerId?: StringFilter<"ContainerRegistry"> | string
    containerName?: StringFilter<"ContainerRegistry"> | string
    image?: StringNullableFilter<"ContainerRegistry"> | string | null
    status?: StringFilter<"ContainerRegistry"> | string
    ports?: JsonNullableFilter<"ContainerRegistry">
    labels?: JsonNullableFilter<"ContainerRegistry">
    environment?: JsonNullableFilter<"ContainerRegistry">
    networks?: StringNullableListFilter<"ContainerRegistry">
    traefikRegistered?: BoolFilter<"ContainerRegistry"> | boolean
    traefikUpdatedAt?: DateTimeNullableFilter<"ContainerRegistry"> | Date | string | null
    traefikConfig?: JsonNullableFilter<"ContainerRegistry">
    prometheusRegistered?: BoolFilter<"ContainerRegistry"> | boolean
    prometheusUpdatedAt?: DateTimeNullableFilter<"ContainerRegistry"> | Date | string | null
    prometheusJobName?: StringNullableFilter<"ContainerRegistry"> | string | null
    grafanaRegistered?: BoolFilter<"ContainerRegistry"> | boolean
    grafanaUpdatedAt?: DateTimeNullableFilter<"ContainerRegistry"> | Date | string | null
    grafanaPanelIds?: IntNullableListFilter<"ContainerRegistry">
    kumaRegistered?: BoolFilter<"ContainerRegistry"> | boolean
    kumaUpdatedAt?: DateTimeNullableFilter<"ContainerRegistry"> | Date | string | null
    kumaMonitorId?: IntNullableFilter<"ContainerRegistry"> | number | null
    wireguardRegistered?: BoolFilter<"ContainerRegistry"> | boolean
    wireguardUpdatedAt?: DateTimeNullableFilter<"ContainerRegistry"> | Date | string | null
    wireguardIp?: StringNullableFilter<"ContainerRegistry"> | string | null
    lokiRegistered?: BoolFilter<"ContainerRegistry"> | boolean
    lokiUpdatedAt?: DateTimeNullableFilter<"ContainerRegistry"> | Date | string | null
    firstDetectedAt?: DateTimeFilter<"ContainerRegistry"> | Date | string
    lastEventAt?: DateTimeFilter<"ContainerRegistry"> | Date | string
    registrationCompletedAt?: DateTimeNullableFilter<"ContainerRegistry"> | Date | string | null
    lastHealthCheck?: DateTimeNullableFilter<"ContainerRegistry"> | Date | string | null
    createdBy?: StringFilter<"ContainerRegistry"> | string
    createdAt?: DateTimeFilter<"ContainerRegistry"> | Date | string
    updatedAt?: DateTimeFilter<"ContainerRegistry"> | Date | string
    events?: RegistrationEventListRelationFilter
  }

  export type ContainerRegistryOrderByWithRelationInput = {
    id?: SortOrder
    containerId?: SortOrder
    containerName?: SortOrder
    image?: SortOrderInput | SortOrder
    status?: SortOrder
    ports?: SortOrderInput | SortOrder
    labels?: SortOrderInput | SortOrder
    environment?: SortOrderInput | SortOrder
    networks?: SortOrder
    traefikRegistered?: SortOrder
    traefikUpdatedAt?: SortOrderInput | SortOrder
    traefikConfig?: SortOrderInput | SortOrder
    prometheusRegistered?: SortOrder
    prometheusUpdatedAt?: SortOrderInput | SortOrder
    prometheusJobName?: SortOrderInput | SortOrder
    grafanaRegistered?: SortOrder
    grafanaUpdatedAt?: SortOrderInput | SortOrder
    grafanaPanelIds?: SortOrder
    kumaRegistered?: SortOrder
    kumaUpdatedAt?: SortOrderInput | SortOrder
    kumaMonitorId?: SortOrderInput | SortOrder
    wireguardRegistered?: SortOrder
    wireguardUpdatedAt?: SortOrderInput | SortOrder
    wireguardIp?: SortOrderInput | SortOrder
    lokiRegistered?: SortOrder
    lokiUpdatedAt?: SortOrderInput | SortOrder
    firstDetectedAt?: SortOrder
    lastEventAt?: SortOrder
    registrationCompletedAt?: SortOrderInput | SortOrder
    lastHealthCheck?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    events?: RegistrationEventOrderByRelationAggregateInput
  }

  export type ContainerRegistryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    containerId?: string
    AND?: ContainerRegistryWhereInput | ContainerRegistryWhereInput[]
    OR?: ContainerRegistryWhereInput[]
    NOT?: ContainerRegistryWhereInput | ContainerRegistryWhereInput[]
    containerName?: StringFilter<"ContainerRegistry"> | string
    image?: StringNullableFilter<"ContainerRegistry"> | string | null
    status?: StringFilter<"ContainerRegistry"> | string
    ports?: JsonNullableFilter<"ContainerRegistry">
    labels?: JsonNullableFilter<"ContainerRegistry">
    environment?: JsonNullableFilter<"ContainerRegistry">
    networks?: StringNullableListFilter<"ContainerRegistry">
    traefikRegistered?: BoolFilter<"ContainerRegistry"> | boolean
    traefikUpdatedAt?: DateTimeNullableFilter<"ContainerRegistry"> | Date | string | null
    traefikConfig?: JsonNullableFilter<"ContainerRegistry">
    prometheusRegistered?: BoolFilter<"ContainerRegistry"> | boolean
    prometheusUpdatedAt?: DateTimeNullableFilter<"ContainerRegistry"> | Date | string | null
    prometheusJobName?: StringNullableFilter<"ContainerRegistry"> | string | null
    grafanaRegistered?: BoolFilter<"ContainerRegistry"> | boolean
    grafanaUpdatedAt?: DateTimeNullableFilter<"ContainerRegistry"> | Date | string | null
    grafanaPanelIds?: IntNullableListFilter<"ContainerRegistry">
    kumaRegistered?: BoolFilter<"ContainerRegistry"> | boolean
    kumaUpdatedAt?: DateTimeNullableFilter<"ContainerRegistry"> | Date | string | null
    kumaMonitorId?: IntNullableFilter<"ContainerRegistry"> | number | null
    wireguardRegistered?: BoolFilter<"ContainerRegistry"> | boolean
    wireguardUpdatedAt?: DateTimeNullableFilter<"ContainerRegistry"> | Date | string | null
    wireguardIp?: StringNullableFilter<"ContainerRegistry"> | string | null
    lokiRegistered?: BoolFilter<"ContainerRegistry"> | boolean
    lokiUpdatedAt?: DateTimeNullableFilter<"ContainerRegistry"> | Date | string | null
    firstDetectedAt?: DateTimeFilter<"ContainerRegistry"> | Date | string
    lastEventAt?: DateTimeFilter<"ContainerRegistry"> | Date | string
    registrationCompletedAt?: DateTimeNullableFilter<"ContainerRegistry"> | Date | string | null
    lastHealthCheck?: DateTimeNullableFilter<"ContainerRegistry"> | Date | string | null
    createdBy?: StringFilter<"ContainerRegistry"> | string
    createdAt?: DateTimeFilter<"ContainerRegistry"> | Date | string
    updatedAt?: DateTimeFilter<"ContainerRegistry"> | Date | string
    events?: RegistrationEventListRelationFilter
  }, "id" | "containerId">

  export type ContainerRegistryOrderByWithAggregationInput = {
    id?: SortOrder
    containerId?: SortOrder
    containerName?: SortOrder
    image?: SortOrderInput | SortOrder
    status?: SortOrder
    ports?: SortOrderInput | SortOrder
    labels?: SortOrderInput | SortOrder
    environment?: SortOrderInput | SortOrder
    networks?: SortOrder
    traefikRegistered?: SortOrder
    traefikUpdatedAt?: SortOrderInput | SortOrder
    traefikConfig?: SortOrderInput | SortOrder
    prometheusRegistered?: SortOrder
    prometheusUpdatedAt?: SortOrderInput | SortOrder
    prometheusJobName?: SortOrderInput | SortOrder
    grafanaRegistered?: SortOrder
    grafanaUpdatedAt?: SortOrderInput | SortOrder
    grafanaPanelIds?: SortOrder
    kumaRegistered?: SortOrder
    kumaUpdatedAt?: SortOrderInput | SortOrder
    kumaMonitorId?: SortOrderInput | SortOrder
    wireguardRegistered?: SortOrder
    wireguardUpdatedAt?: SortOrderInput | SortOrder
    wireguardIp?: SortOrderInput | SortOrder
    lokiRegistered?: SortOrder
    lokiUpdatedAt?: SortOrderInput | SortOrder
    firstDetectedAt?: SortOrder
    lastEventAt?: SortOrder
    registrationCompletedAt?: SortOrderInput | SortOrder
    lastHealthCheck?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ContainerRegistryCountOrderByAggregateInput
    _avg?: ContainerRegistryAvgOrderByAggregateInput
    _max?: ContainerRegistryMaxOrderByAggregateInput
    _min?: ContainerRegistryMinOrderByAggregateInput
    _sum?: ContainerRegistrySumOrderByAggregateInput
  }

  export type ContainerRegistryScalarWhereWithAggregatesInput = {
    AND?: ContainerRegistryScalarWhereWithAggregatesInput | ContainerRegistryScalarWhereWithAggregatesInput[]
    OR?: ContainerRegistryScalarWhereWithAggregatesInput[]
    NOT?: ContainerRegistryScalarWhereWithAggregatesInput | ContainerRegistryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ContainerRegistry"> | string
    containerId?: StringWithAggregatesFilter<"ContainerRegistry"> | string
    containerName?: StringWithAggregatesFilter<"ContainerRegistry"> | string
    image?: StringNullableWithAggregatesFilter<"ContainerRegistry"> | string | null
    status?: StringWithAggregatesFilter<"ContainerRegistry"> | string
    ports?: JsonNullableWithAggregatesFilter<"ContainerRegistry">
    labels?: JsonNullableWithAggregatesFilter<"ContainerRegistry">
    environment?: JsonNullableWithAggregatesFilter<"ContainerRegistry">
    networks?: StringNullableListFilter<"ContainerRegistry">
    traefikRegistered?: BoolWithAggregatesFilter<"ContainerRegistry"> | boolean
    traefikUpdatedAt?: DateTimeNullableWithAggregatesFilter<"ContainerRegistry"> | Date | string | null
    traefikConfig?: JsonNullableWithAggregatesFilter<"ContainerRegistry">
    prometheusRegistered?: BoolWithAggregatesFilter<"ContainerRegistry"> | boolean
    prometheusUpdatedAt?: DateTimeNullableWithAggregatesFilter<"ContainerRegistry"> | Date | string | null
    prometheusJobName?: StringNullableWithAggregatesFilter<"ContainerRegistry"> | string | null
    grafanaRegistered?: BoolWithAggregatesFilter<"ContainerRegistry"> | boolean
    grafanaUpdatedAt?: DateTimeNullableWithAggregatesFilter<"ContainerRegistry"> | Date | string | null
    grafanaPanelIds?: IntNullableListFilter<"ContainerRegistry">
    kumaRegistered?: BoolWithAggregatesFilter<"ContainerRegistry"> | boolean
    kumaUpdatedAt?: DateTimeNullableWithAggregatesFilter<"ContainerRegistry"> | Date | string | null
    kumaMonitorId?: IntNullableWithAggregatesFilter<"ContainerRegistry"> | number | null
    wireguardRegistered?: BoolWithAggregatesFilter<"ContainerRegistry"> | boolean
    wireguardUpdatedAt?: DateTimeNullableWithAggregatesFilter<"ContainerRegistry"> | Date | string | null
    wireguardIp?: StringNullableWithAggregatesFilter<"ContainerRegistry"> | string | null
    lokiRegistered?: BoolWithAggregatesFilter<"ContainerRegistry"> | boolean
    lokiUpdatedAt?: DateTimeNullableWithAggregatesFilter<"ContainerRegistry"> | Date | string | null
    firstDetectedAt?: DateTimeWithAggregatesFilter<"ContainerRegistry"> | Date | string
    lastEventAt?: DateTimeWithAggregatesFilter<"ContainerRegistry"> | Date | string
    registrationCompletedAt?: DateTimeNullableWithAggregatesFilter<"ContainerRegistry"> | Date | string | null
    lastHealthCheck?: DateTimeNullableWithAggregatesFilter<"ContainerRegistry"> | Date | string | null
    createdBy?: StringWithAggregatesFilter<"ContainerRegistry"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ContainerRegistry"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ContainerRegistry"> | Date | string
  }

  export type RegistrationEventWhereInput = {
    AND?: RegistrationEventWhereInput | RegistrationEventWhereInput[]
    OR?: RegistrationEventWhereInput[]
    NOT?: RegistrationEventWhereInput | RegistrationEventWhereInput[]
    id?: StringFilter<"RegistrationEvent"> | string
    containerId?: StringFilter<"RegistrationEvent"> | string
    eventType?: StringFilter<"RegistrationEvent"> | string
    system?: StringFilter<"RegistrationEvent"> | string
    status?: StringFilter<"RegistrationEvent"> | string
    message?: StringNullableFilter<"RegistrationEvent"> | string | null
    errorDetails?: JsonNullableFilter<"RegistrationEvent">
    timestamp?: DateTimeFilter<"RegistrationEvent"> | Date | string
    container?: XOR<ContainerRegistryScalarRelationFilter, ContainerRegistryWhereInput>
  }

  export type RegistrationEventOrderByWithRelationInput = {
    id?: SortOrder
    containerId?: SortOrder
    eventType?: SortOrder
    system?: SortOrder
    status?: SortOrder
    message?: SortOrderInput | SortOrder
    errorDetails?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    container?: ContainerRegistryOrderByWithRelationInput
  }

  export type RegistrationEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RegistrationEventWhereInput | RegistrationEventWhereInput[]
    OR?: RegistrationEventWhereInput[]
    NOT?: RegistrationEventWhereInput | RegistrationEventWhereInput[]
    containerId?: StringFilter<"RegistrationEvent"> | string
    eventType?: StringFilter<"RegistrationEvent"> | string
    system?: StringFilter<"RegistrationEvent"> | string
    status?: StringFilter<"RegistrationEvent"> | string
    message?: StringNullableFilter<"RegistrationEvent"> | string | null
    errorDetails?: JsonNullableFilter<"RegistrationEvent">
    timestamp?: DateTimeFilter<"RegistrationEvent"> | Date | string
    container?: XOR<ContainerRegistryScalarRelationFilter, ContainerRegistryWhereInput>
  }, "id">

  export type RegistrationEventOrderByWithAggregationInput = {
    id?: SortOrder
    containerId?: SortOrder
    eventType?: SortOrder
    system?: SortOrder
    status?: SortOrder
    message?: SortOrderInput | SortOrder
    errorDetails?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    _count?: RegistrationEventCountOrderByAggregateInput
    _max?: RegistrationEventMaxOrderByAggregateInput
    _min?: RegistrationEventMinOrderByAggregateInput
  }

  export type RegistrationEventScalarWhereWithAggregatesInput = {
    AND?: RegistrationEventScalarWhereWithAggregatesInput | RegistrationEventScalarWhereWithAggregatesInput[]
    OR?: RegistrationEventScalarWhereWithAggregatesInput[]
    NOT?: RegistrationEventScalarWhereWithAggregatesInput | RegistrationEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RegistrationEvent"> | string
    containerId?: StringWithAggregatesFilter<"RegistrationEvent"> | string
    eventType?: StringWithAggregatesFilter<"RegistrationEvent"> | string
    system?: StringWithAggregatesFilter<"RegistrationEvent"> | string
    status?: StringWithAggregatesFilter<"RegistrationEvent"> | string
    message?: StringNullableWithAggregatesFilter<"RegistrationEvent"> | string | null
    errorDetails?: JsonNullableWithAggregatesFilter<"RegistrationEvent">
    timestamp?: DateTimeWithAggregatesFilter<"RegistrationEvent"> | Date | string
  }

  export type PerformanceCreateInput = {
    id?: string
    timestamp?: Date | string
    orders: number
    returns: number
    downtime?: boolean
    notes?: string | null
  }

  export type PerformanceUncheckedCreateInput = {
    id?: string
    timestamp?: Date | string
    orders: number
    returns: number
    downtime?: boolean
    notes?: string | null
  }

  export type PerformanceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: IntFieldUpdateOperationsInput | number
    returns?: IntFieldUpdateOperationsInput | number
    downtime?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PerformanceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: IntFieldUpdateOperationsInput | number
    returns?: IntFieldUpdateOperationsInput | number
    downtime?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PerformanceCreateManyInput = {
    id?: string
    timestamp?: Date | string
    orders: number
    returns: number
    downtime?: boolean
    notes?: string | null
  }

  export type PerformanceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: IntFieldUpdateOperationsInput | number
    returns?: IntFieldUpdateOperationsInput | number
    downtime?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PerformanceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: IntFieldUpdateOperationsInput | number
    returns?: IntFieldUpdateOperationsInput | number
    downtime?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AgentJobCreateInput = {
    id?: string
    agentName: string
    status?: $Enums.AgentStatus
    triggeredBy: string
    triggeredAt?: Date | string
    completedAt?: Date | string | null
    result?: NullableJsonNullValueInput | InputJsonValue
    error?: string | null
    durationMs?: number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    results?: AgentResultCreateNestedOneWithoutJobInput
  }

  export type AgentJobUncheckedCreateInput = {
    id?: string
    agentName: string
    status?: $Enums.AgentStatus
    triggeredBy: string
    triggeredAt?: Date | string
    completedAt?: Date | string | null
    result?: NullableJsonNullValueInput | InputJsonValue
    error?: string | null
    durationMs?: number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    results?: AgentResultUncheckedCreateNestedOneWithoutJobInput
  }

  export type AgentJobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentName?: StringFieldUpdateOperationsInput | string
    status?: EnumAgentStatusFieldUpdateOperationsInput | $Enums.AgentStatus
    triggeredBy?: StringFieldUpdateOperationsInput | string
    triggeredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    result?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableStringFieldUpdateOperationsInput | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    results?: AgentResultUpdateOneWithoutJobNestedInput
  }

  export type AgentJobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentName?: StringFieldUpdateOperationsInput | string
    status?: EnumAgentStatusFieldUpdateOperationsInput | $Enums.AgentStatus
    triggeredBy?: StringFieldUpdateOperationsInput | string
    triggeredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    result?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableStringFieldUpdateOperationsInput | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    results?: AgentResultUncheckedUpdateOneWithoutJobNestedInput
  }

  export type AgentJobCreateManyInput = {
    id?: string
    agentName: string
    status?: $Enums.AgentStatus
    triggeredBy: string
    triggeredAt?: Date | string
    completedAt?: Date | string | null
    result?: NullableJsonNullValueInput | InputJsonValue
    error?: string | null
    durationMs?: number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AgentJobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentName?: StringFieldUpdateOperationsInput | string
    status?: EnumAgentStatusFieldUpdateOperationsInput | $Enums.AgentStatus
    triggeredBy?: StringFieldUpdateOperationsInput | string
    triggeredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    result?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableStringFieldUpdateOperationsInput | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AgentJobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentName?: StringFieldUpdateOperationsInput | string
    status?: EnumAgentStatusFieldUpdateOperationsInput | $Enums.AgentStatus
    triggeredBy?: StringFieldUpdateOperationsInput | string
    triggeredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    result?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableStringFieldUpdateOperationsInput | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AgentConfigCreateInput = {
    id?: string
    agentName: string
    config: JsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type AgentConfigUncheckedCreateInput = {
    id?: string
    agentName: string
    config: JsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type AgentConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentName?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentName?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentConfigCreateManyInput = {
    id?: string
    agentName: string
    config: JsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
  }

  export type AgentConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentName?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentName?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentResultCreateInput = {
    id?: string
    output: JsonNullValueInput | InputJsonValue
    error?: string | null
    createdAt?: Date | string
    job: AgentJobCreateNestedOneWithoutResultsInput
  }

  export type AgentResultUncheckedCreateInput = {
    id?: string
    jobId: string
    output: JsonNullValueInput | InputJsonValue
    error?: string | null
    createdAt?: Date | string
  }

  export type AgentResultUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    output?: JsonNullValueInput | InputJsonValue
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    job?: AgentJobUpdateOneRequiredWithoutResultsNestedInput
  }

  export type AgentResultUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    output?: JsonNullValueInput | InputJsonValue
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentResultCreateManyInput = {
    id?: string
    jobId: string
    output: JsonNullValueInput | InputJsonValue
    error?: string | null
    createdAt?: Date | string
  }

  export type AgentResultUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    output?: JsonNullValueInput | InputJsonValue
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentResultUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    output?: JsonNullValueInput | InputJsonValue
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContainerRegistryCreateInput = {
    id?: string
    containerId: string
    containerName: string
    image?: string | null
    status?: string
    ports?: NullableJsonNullValueInput | InputJsonValue
    labels?: NullableJsonNullValueInput | InputJsonValue
    environment?: NullableJsonNullValueInput | InputJsonValue
    networks?: ContainerRegistryCreatenetworksInput | string[]
    traefikRegistered?: boolean
    traefikUpdatedAt?: Date | string | null
    traefikConfig?: NullableJsonNullValueInput | InputJsonValue
    prometheusRegistered?: boolean
    prometheusUpdatedAt?: Date | string | null
    prometheusJobName?: string | null
    grafanaRegistered?: boolean
    grafanaUpdatedAt?: Date | string | null
    grafanaPanelIds?: ContainerRegistryCreategrafanaPanelIdsInput | number[]
    kumaRegistered?: boolean
    kumaUpdatedAt?: Date | string | null
    kumaMonitorId?: number | null
    wireguardRegistered?: boolean
    wireguardUpdatedAt?: Date | string | null
    wireguardIp?: string | null
    lokiRegistered?: boolean
    lokiUpdatedAt?: Date | string | null
    firstDetectedAt?: Date | string
    lastEventAt?: Date | string
    registrationCompletedAt?: Date | string | null
    lastHealthCheck?: Date | string | null
    createdBy?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: RegistrationEventCreateNestedManyWithoutContainerInput
  }

  export type ContainerRegistryUncheckedCreateInput = {
    id?: string
    containerId: string
    containerName: string
    image?: string | null
    status?: string
    ports?: NullableJsonNullValueInput | InputJsonValue
    labels?: NullableJsonNullValueInput | InputJsonValue
    environment?: NullableJsonNullValueInput | InputJsonValue
    networks?: ContainerRegistryCreatenetworksInput | string[]
    traefikRegistered?: boolean
    traefikUpdatedAt?: Date | string | null
    traefikConfig?: NullableJsonNullValueInput | InputJsonValue
    prometheusRegistered?: boolean
    prometheusUpdatedAt?: Date | string | null
    prometheusJobName?: string | null
    grafanaRegistered?: boolean
    grafanaUpdatedAt?: Date | string | null
    grafanaPanelIds?: ContainerRegistryCreategrafanaPanelIdsInput | number[]
    kumaRegistered?: boolean
    kumaUpdatedAt?: Date | string | null
    kumaMonitorId?: number | null
    wireguardRegistered?: boolean
    wireguardUpdatedAt?: Date | string | null
    wireguardIp?: string | null
    lokiRegistered?: boolean
    lokiUpdatedAt?: Date | string | null
    firstDetectedAt?: Date | string
    lastEventAt?: Date | string
    registrationCompletedAt?: Date | string | null
    lastHealthCheck?: Date | string | null
    createdBy?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: RegistrationEventUncheckedCreateNestedManyWithoutContainerInput
  }

  export type ContainerRegistryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    containerId?: StringFieldUpdateOperationsInput | string
    containerName?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ports?: NullableJsonNullValueInput | InputJsonValue
    labels?: NullableJsonNullValueInput | InputJsonValue
    environment?: NullableJsonNullValueInput | InputJsonValue
    networks?: ContainerRegistryUpdatenetworksInput | string[]
    traefikRegistered?: BoolFieldUpdateOperationsInput | boolean
    traefikUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    traefikConfig?: NullableJsonNullValueInput | InputJsonValue
    prometheusRegistered?: BoolFieldUpdateOperationsInput | boolean
    prometheusUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prometheusJobName?: NullableStringFieldUpdateOperationsInput | string | null
    grafanaRegistered?: BoolFieldUpdateOperationsInput | boolean
    grafanaUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    grafanaPanelIds?: ContainerRegistryUpdategrafanaPanelIdsInput | number[]
    kumaRegistered?: BoolFieldUpdateOperationsInput | boolean
    kumaUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kumaMonitorId?: NullableIntFieldUpdateOperationsInput | number | null
    wireguardRegistered?: BoolFieldUpdateOperationsInput | boolean
    wireguardUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wireguardIp?: NullableStringFieldUpdateOperationsInput | string | null
    lokiRegistered?: BoolFieldUpdateOperationsInput | boolean
    lokiUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firstDetectedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastEventAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastHealthCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: RegistrationEventUpdateManyWithoutContainerNestedInput
  }

  export type ContainerRegistryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    containerId?: StringFieldUpdateOperationsInput | string
    containerName?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ports?: NullableJsonNullValueInput | InputJsonValue
    labels?: NullableJsonNullValueInput | InputJsonValue
    environment?: NullableJsonNullValueInput | InputJsonValue
    networks?: ContainerRegistryUpdatenetworksInput | string[]
    traefikRegistered?: BoolFieldUpdateOperationsInput | boolean
    traefikUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    traefikConfig?: NullableJsonNullValueInput | InputJsonValue
    prometheusRegistered?: BoolFieldUpdateOperationsInput | boolean
    prometheusUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prometheusJobName?: NullableStringFieldUpdateOperationsInput | string | null
    grafanaRegistered?: BoolFieldUpdateOperationsInput | boolean
    grafanaUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    grafanaPanelIds?: ContainerRegistryUpdategrafanaPanelIdsInput | number[]
    kumaRegistered?: BoolFieldUpdateOperationsInput | boolean
    kumaUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kumaMonitorId?: NullableIntFieldUpdateOperationsInput | number | null
    wireguardRegistered?: BoolFieldUpdateOperationsInput | boolean
    wireguardUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wireguardIp?: NullableStringFieldUpdateOperationsInput | string | null
    lokiRegistered?: BoolFieldUpdateOperationsInput | boolean
    lokiUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firstDetectedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastEventAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastHealthCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: RegistrationEventUncheckedUpdateManyWithoutContainerNestedInput
  }

  export type ContainerRegistryCreateManyInput = {
    id?: string
    containerId: string
    containerName: string
    image?: string | null
    status?: string
    ports?: NullableJsonNullValueInput | InputJsonValue
    labels?: NullableJsonNullValueInput | InputJsonValue
    environment?: NullableJsonNullValueInput | InputJsonValue
    networks?: ContainerRegistryCreatenetworksInput | string[]
    traefikRegistered?: boolean
    traefikUpdatedAt?: Date | string | null
    traefikConfig?: NullableJsonNullValueInput | InputJsonValue
    prometheusRegistered?: boolean
    prometheusUpdatedAt?: Date | string | null
    prometheusJobName?: string | null
    grafanaRegistered?: boolean
    grafanaUpdatedAt?: Date | string | null
    grafanaPanelIds?: ContainerRegistryCreategrafanaPanelIdsInput | number[]
    kumaRegistered?: boolean
    kumaUpdatedAt?: Date | string | null
    kumaMonitorId?: number | null
    wireguardRegistered?: boolean
    wireguardUpdatedAt?: Date | string | null
    wireguardIp?: string | null
    lokiRegistered?: boolean
    lokiUpdatedAt?: Date | string | null
    firstDetectedAt?: Date | string
    lastEventAt?: Date | string
    registrationCompletedAt?: Date | string | null
    lastHealthCheck?: Date | string | null
    createdBy?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContainerRegistryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    containerId?: StringFieldUpdateOperationsInput | string
    containerName?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ports?: NullableJsonNullValueInput | InputJsonValue
    labels?: NullableJsonNullValueInput | InputJsonValue
    environment?: NullableJsonNullValueInput | InputJsonValue
    networks?: ContainerRegistryUpdatenetworksInput | string[]
    traefikRegistered?: BoolFieldUpdateOperationsInput | boolean
    traefikUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    traefikConfig?: NullableJsonNullValueInput | InputJsonValue
    prometheusRegistered?: BoolFieldUpdateOperationsInput | boolean
    prometheusUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prometheusJobName?: NullableStringFieldUpdateOperationsInput | string | null
    grafanaRegistered?: BoolFieldUpdateOperationsInput | boolean
    grafanaUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    grafanaPanelIds?: ContainerRegistryUpdategrafanaPanelIdsInput | number[]
    kumaRegistered?: BoolFieldUpdateOperationsInput | boolean
    kumaUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kumaMonitorId?: NullableIntFieldUpdateOperationsInput | number | null
    wireguardRegistered?: BoolFieldUpdateOperationsInput | boolean
    wireguardUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wireguardIp?: NullableStringFieldUpdateOperationsInput | string | null
    lokiRegistered?: BoolFieldUpdateOperationsInput | boolean
    lokiUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firstDetectedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastEventAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastHealthCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContainerRegistryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    containerId?: StringFieldUpdateOperationsInput | string
    containerName?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ports?: NullableJsonNullValueInput | InputJsonValue
    labels?: NullableJsonNullValueInput | InputJsonValue
    environment?: NullableJsonNullValueInput | InputJsonValue
    networks?: ContainerRegistryUpdatenetworksInput | string[]
    traefikRegistered?: BoolFieldUpdateOperationsInput | boolean
    traefikUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    traefikConfig?: NullableJsonNullValueInput | InputJsonValue
    prometheusRegistered?: BoolFieldUpdateOperationsInput | boolean
    prometheusUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prometheusJobName?: NullableStringFieldUpdateOperationsInput | string | null
    grafanaRegistered?: BoolFieldUpdateOperationsInput | boolean
    grafanaUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    grafanaPanelIds?: ContainerRegistryUpdategrafanaPanelIdsInput | number[]
    kumaRegistered?: BoolFieldUpdateOperationsInput | boolean
    kumaUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kumaMonitorId?: NullableIntFieldUpdateOperationsInput | number | null
    wireguardRegistered?: BoolFieldUpdateOperationsInput | boolean
    wireguardUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wireguardIp?: NullableStringFieldUpdateOperationsInput | string | null
    lokiRegistered?: BoolFieldUpdateOperationsInput | boolean
    lokiUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firstDetectedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastEventAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastHealthCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistrationEventCreateInput = {
    id?: string
    eventType: string
    system: string
    status: string
    message?: string | null
    errorDetails?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
    container: ContainerRegistryCreateNestedOneWithoutEventsInput
  }

  export type RegistrationEventUncheckedCreateInput = {
    id?: string
    containerId: string
    eventType: string
    system: string
    status: string
    message?: string | null
    errorDetails?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type RegistrationEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    system?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    errorDetails?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    container?: ContainerRegistryUpdateOneRequiredWithoutEventsNestedInput
  }

  export type RegistrationEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    containerId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    system?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    errorDetails?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistrationEventCreateManyInput = {
    id?: string
    containerId: string
    eventType: string
    system: string
    status: string
    message?: string | null
    errorDetails?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type RegistrationEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    system?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    errorDetails?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistrationEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    containerId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    system?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    errorDetails?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PerformanceCountOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    orders?: SortOrder
    returns?: SortOrder
    downtime?: SortOrder
    notes?: SortOrder
  }

  export type PerformanceAvgOrderByAggregateInput = {
    orders?: SortOrder
    returns?: SortOrder
  }

  export type PerformanceMaxOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    orders?: SortOrder
    returns?: SortOrder
    downtime?: SortOrder
    notes?: SortOrder
  }

  export type PerformanceMinOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    orders?: SortOrder
    returns?: SortOrder
    downtime?: SortOrder
    notes?: SortOrder
  }

  export type PerformanceSumOrderByAggregateInput = {
    orders?: SortOrder
    returns?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumAgentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AgentStatus | EnumAgentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AgentStatus[] | ListEnumAgentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AgentStatus[] | ListEnumAgentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAgentStatusFilter<$PrismaModel> | $Enums.AgentStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type AgentResultNullableScalarRelationFilter = {
    is?: AgentResultWhereInput | null
    isNot?: AgentResultWhereInput | null
  }

  export type AgentJobCountOrderByAggregateInput = {
    id?: SortOrder
    agentName?: SortOrder
    status?: SortOrder
    triggeredBy?: SortOrder
    triggeredAt?: SortOrder
    completedAt?: SortOrder
    result?: SortOrder
    error?: SortOrder
    durationMs?: SortOrder
    metadata?: SortOrder
  }

  export type AgentJobAvgOrderByAggregateInput = {
    durationMs?: SortOrder
  }

  export type AgentJobMaxOrderByAggregateInput = {
    id?: SortOrder
    agentName?: SortOrder
    status?: SortOrder
    triggeredBy?: SortOrder
    triggeredAt?: SortOrder
    completedAt?: SortOrder
    error?: SortOrder
    durationMs?: SortOrder
  }

  export type AgentJobMinOrderByAggregateInput = {
    id?: SortOrder
    agentName?: SortOrder
    status?: SortOrder
    triggeredBy?: SortOrder
    triggeredAt?: SortOrder
    completedAt?: SortOrder
    error?: SortOrder
    durationMs?: SortOrder
  }

  export type AgentJobSumOrderByAggregateInput = {
    durationMs?: SortOrder
  }

  export type EnumAgentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AgentStatus | EnumAgentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AgentStatus[] | ListEnumAgentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AgentStatus[] | ListEnumAgentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAgentStatusWithAggregatesFilter<$PrismaModel> | $Enums.AgentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAgentStatusFilter<$PrismaModel>
    _max?: NestedEnumAgentStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AgentConfigCountOrderByAggregateInput = {
    id?: SortOrder
    agentName?: SortOrder
    config?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    agentName?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentConfigMinOrderByAggregateInput = {
    id?: SortOrder
    agentName?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type AgentJobScalarRelationFilter = {
    is?: AgentJobWhereInput
    isNot?: AgentJobWhereInput
  }

  export type AgentResultCountOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    output?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type AgentResultMaxOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type AgentResultMinOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntNullableListFilter<$PrismaModel = never> = {
    equals?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    has?: number | IntFieldRefInput<$PrismaModel> | null
    hasEvery?: number[] | ListIntFieldRefInput<$PrismaModel>
    hasSome?: number[] | ListIntFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type RegistrationEventListRelationFilter = {
    every?: RegistrationEventWhereInput
    some?: RegistrationEventWhereInput
    none?: RegistrationEventWhereInput
  }

  export type RegistrationEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ContainerRegistryCountOrderByAggregateInput = {
    id?: SortOrder
    containerId?: SortOrder
    containerName?: SortOrder
    image?: SortOrder
    status?: SortOrder
    ports?: SortOrder
    labels?: SortOrder
    environment?: SortOrder
    networks?: SortOrder
    traefikRegistered?: SortOrder
    traefikUpdatedAt?: SortOrder
    traefikConfig?: SortOrder
    prometheusRegistered?: SortOrder
    prometheusUpdatedAt?: SortOrder
    prometheusJobName?: SortOrder
    grafanaRegistered?: SortOrder
    grafanaUpdatedAt?: SortOrder
    grafanaPanelIds?: SortOrder
    kumaRegistered?: SortOrder
    kumaUpdatedAt?: SortOrder
    kumaMonitorId?: SortOrder
    wireguardRegistered?: SortOrder
    wireguardUpdatedAt?: SortOrder
    wireguardIp?: SortOrder
    lokiRegistered?: SortOrder
    lokiUpdatedAt?: SortOrder
    firstDetectedAt?: SortOrder
    lastEventAt?: SortOrder
    registrationCompletedAt?: SortOrder
    lastHealthCheck?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContainerRegistryAvgOrderByAggregateInput = {
    grafanaPanelIds?: SortOrder
    kumaMonitorId?: SortOrder
  }

  export type ContainerRegistryMaxOrderByAggregateInput = {
    id?: SortOrder
    containerId?: SortOrder
    containerName?: SortOrder
    image?: SortOrder
    status?: SortOrder
    traefikRegistered?: SortOrder
    traefikUpdatedAt?: SortOrder
    prometheusRegistered?: SortOrder
    prometheusUpdatedAt?: SortOrder
    prometheusJobName?: SortOrder
    grafanaRegistered?: SortOrder
    grafanaUpdatedAt?: SortOrder
    kumaRegistered?: SortOrder
    kumaUpdatedAt?: SortOrder
    kumaMonitorId?: SortOrder
    wireguardRegistered?: SortOrder
    wireguardUpdatedAt?: SortOrder
    wireguardIp?: SortOrder
    lokiRegistered?: SortOrder
    lokiUpdatedAt?: SortOrder
    firstDetectedAt?: SortOrder
    lastEventAt?: SortOrder
    registrationCompletedAt?: SortOrder
    lastHealthCheck?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContainerRegistryMinOrderByAggregateInput = {
    id?: SortOrder
    containerId?: SortOrder
    containerName?: SortOrder
    image?: SortOrder
    status?: SortOrder
    traefikRegistered?: SortOrder
    traefikUpdatedAt?: SortOrder
    prometheusRegistered?: SortOrder
    prometheusUpdatedAt?: SortOrder
    prometheusJobName?: SortOrder
    grafanaRegistered?: SortOrder
    grafanaUpdatedAt?: SortOrder
    kumaRegistered?: SortOrder
    kumaUpdatedAt?: SortOrder
    kumaMonitorId?: SortOrder
    wireguardRegistered?: SortOrder
    wireguardUpdatedAt?: SortOrder
    wireguardIp?: SortOrder
    lokiRegistered?: SortOrder
    lokiUpdatedAt?: SortOrder
    firstDetectedAt?: SortOrder
    lastEventAt?: SortOrder
    registrationCompletedAt?: SortOrder
    lastHealthCheck?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ContainerRegistrySumOrderByAggregateInput = {
    grafanaPanelIds?: SortOrder
    kumaMonitorId?: SortOrder
  }

  export type ContainerRegistryScalarRelationFilter = {
    is?: ContainerRegistryWhereInput
    isNot?: ContainerRegistryWhereInput
  }

  export type RegistrationEventCountOrderByAggregateInput = {
    id?: SortOrder
    containerId?: SortOrder
    eventType?: SortOrder
    system?: SortOrder
    status?: SortOrder
    message?: SortOrder
    errorDetails?: SortOrder
    timestamp?: SortOrder
  }

  export type RegistrationEventMaxOrderByAggregateInput = {
    id?: SortOrder
    containerId?: SortOrder
    eventType?: SortOrder
    system?: SortOrder
    status?: SortOrder
    message?: SortOrder
    timestamp?: SortOrder
  }

  export type RegistrationEventMinOrderByAggregateInput = {
    id?: SortOrder
    containerId?: SortOrder
    eventType?: SortOrder
    system?: SortOrder
    status?: SortOrder
    message?: SortOrder
    timestamp?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type AgentResultCreateNestedOneWithoutJobInput = {
    create?: XOR<AgentResultCreateWithoutJobInput, AgentResultUncheckedCreateWithoutJobInput>
    connectOrCreate?: AgentResultCreateOrConnectWithoutJobInput
    connect?: AgentResultWhereUniqueInput
  }

  export type AgentResultUncheckedCreateNestedOneWithoutJobInput = {
    create?: XOR<AgentResultCreateWithoutJobInput, AgentResultUncheckedCreateWithoutJobInput>
    connectOrCreate?: AgentResultCreateOrConnectWithoutJobInput
    connect?: AgentResultWhereUniqueInput
  }

  export type EnumAgentStatusFieldUpdateOperationsInput = {
    set?: $Enums.AgentStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AgentResultUpdateOneWithoutJobNestedInput = {
    create?: XOR<AgentResultCreateWithoutJobInput, AgentResultUncheckedCreateWithoutJobInput>
    connectOrCreate?: AgentResultCreateOrConnectWithoutJobInput
    upsert?: AgentResultUpsertWithoutJobInput
    disconnect?: AgentResultWhereInput | boolean
    delete?: AgentResultWhereInput | boolean
    connect?: AgentResultWhereUniqueInput
    update?: XOR<XOR<AgentResultUpdateToOneWithWhereWithoutJobInput, AgentResultUpdateWithoutJobInput>, AgentResultUncheckedUpdateWithoutJobInput>
  }

  export type AgentResultUncheckedUpdateOneWithoutJobNestedInput = {
    create?: XOR<AgentResultCreateWithoutJobInput, AgentResultUncheckedCreateWithoutJobInput>
    connectOrCreate?: AgentResultCreateOrConnectWithoutJobInput
    upsert?: AgentResultUpsertWithoutJobInput
    disconnect?: AgentResultWhereInput | boolean
    delete?: AgentResultWhereInput | boolean
    connect?: AgentResultWhereUniqueInput
    update?: XOR<XOR<AgentResultUpdateToOneWithWhereWithoutJobInput, AgentResultUpdateWithoutJobInput>, AgentResultUncheckedUpdateWithoutJobInput>
  }

  export type AgentJobCreateNestedOneWithoutResultsInput = {
    create?: XOR<AgentJobCreateWithoutResultsInput, AgentJobUncheckedCreateWithoutResultsInput>
    connectOrCreate?: AgentJobCreateOrConnectWithoutResultsInput
    connect?: AgentJobWhereUniqueInput
  }

  export type AgentJobUpdateOneRequiredWithoutResultsNestedInput = {
    create?: XOR<AgentJobCreateWithoutResultsInput, AgentJobUncheckedCreateWithoutResultsInput>
    connectOrCreate?: AgentJobCreateOrConnectWithoutResultsInput
    upsert?: AgentJobUpsertWithoutResultsInput
    connect?: AgentJobWhereUniqueInput
    update?: XOR<XOR<AgentJobUpdateToOneWithWhereWithoutResultsInput, AgentJobUpdateWithoutResultsInput>, AgentJobUncheckedUpdateWithoutResultsInput>
  }

  export type ContainerRegistryCreatenetworksInput = {
    set: string[]
  }

  export type ContainerRegistryCreategrafanaPanelIdsInput = {
    set: number[]
  }

  export type RegistrationEventCreateNestedManyWithoutContainerInput = {
    create?: XOR<RegistrationEventCreateWithoutContainerInput, RegistrationEventUncheckedCreateWithoutContainerInput> | RegistrationEventCreateWithoutContainerInput[] | RegistrationEventUncheckedCreateWithoutContainerInput[]
    connectOrCreate?: RegistrationEventCreateOrConnectWithoutContainerInput | RegistrationEventCreateOrConnectWithoutContainerInput[]
    createMany?: RegistrationEventCreateManyContainerInputEnvelope
    connect?: RegistrationEventWhereUniqueInput | RegistrationEventWhereUniqueInput[]
  }

  export type RegistrationEventUncheckedCreateNestedManyWithoutContainerInput = {
    create?: XOR<RegistrationEventCreateWithoutContainerInput, RegistrationEventUncheckedCreateWithoutContainerInput> | RegistrationEventCreateWithoutContainerInput[] | RegistrationEventUncheckedCreateWithoutContainerInput[]
    connectOrCreate?: RegistrationEventCreateOrConnectWithoutContainerInput | RegistrationEventCreateOrConnectWithoutContainerInput[]
    createMany?: RegistrationEventCreateManyContainerInputEnvelope
    connect?: RegistrationEventWhereUniqueInput | RegistrationEventWhereUniqueInput[]
  }

  export type ContainerRegistryUpdatenetworksInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ContainerRegistryUpdategrafanaPanelIdsInput = {
    set?: number[]
    push?: number | number[]
  }

  export type RegistrationEventUpdateManyWithoutContainerNestedInput = {
    create?: XOR<RegistrationEventCreateWithoutContainerInput, RegistrationEventUncheckedCreateWithoutContainerInput> | RegistrationEventCreateWithoutContainerInput[] | RegistrationEventUncheckedCreateWithoutContainerInput[]
    connectOrCreate?: RegistrationEventCreateOrConnectWithoutContainerInput | RegistrationEventCreateOrConnectWithoutContainerInput[]
    upsert?: RegistrationEventUpsertWithWhereUniqueWithoutContainerInput | RegistrationEventUpsertWithWhereUniqueWithoutContainerInput[]
    createMany?: RegistrationEventCreateManyContainerInputEnvelope
    set?: RegistrationEventWhereUniqueInput | RegistrationEventWhereUniqueInput[]
    disconnect?: RegistrationEventWhereUniqueInput | RegistrationEventWhereUniqueInput[]
    delete?: RegistrationEventWhereUniqueInput | RegistrationEventWhereUniqueInput[]
    connect?: RegistrationEventWhereUniqueInput | RegistrationEventWhereUniqueInput[]
    update?: RegistrationEventUpdateWithWhereUniqueWithoutContainerInput | RegistrationEventUpdateWithWhereUniqueWithoutContainerInput[]
    updateMany?: RegistrationEventUpdateManyWithWhereWithoutContainerInput | RegistrationEventUpdateManyWithWhereWithoutContainerInput[]
    deleteMany?: RegistrationEventScalarWhereInput | RegistrationEventScalarWhereInput[]
  }

  export type RegistrationEventUncheckedUpdateManyWithoutContainerNestedInput = {
    create?: XOR<RegistrationEventCreateWithoutContainerInput, RegistrationEventUncheckedCreateWithoutContainerInput> | RegistrationEventCreateWithoutContainerInput[] | RegistrationEventUncheckedCreateWithoutContainerInput[]
    connectOrCreate?: RegistrationEventCreateOrConnectWithoutContainerInput | RegistrationEventCreateOrConnectWithoutContainerInput[]
    upsert?: RegistrationEventUpsertWithWhereUniqueWithoutContainerInput | RegistrationEventUpsertWithWhereUniqueWithoutContainerInput[]
    createMany?: RegistrationEventCreateManyContainerInputEnvelope
    set?: RegistrationEventWhereUniqueInput | RegistrationEventWhereUniqueInput[]
    disconnect?: RegistrationEventWhereUniqueInput | RegistrationEventWhereUniqueInput[]
    delete?: RegistrationEventWhereUniqueInput | RegistrationEventWhereUniqueInput[]
    connect?: RegistrationEventWhereUniqueInput | RegistrationEventWhereUniqueInput[]
    update?: RegistrationEventUpdateWithWhereUniqueWithoutContainerInput | RegistrationEventUpdateWithWhereUniqueWithoutContainerInput[]
    updateMany?: RegistrationEventUpdateManyWithWhereWithoutContainerInput | RegistrationEventUpdateManyWithWhereWithoutContainerInput[]
    deleteMany?: RegistrationEventScalarWhereInput | RegistrationEventScalarWhereInput[]
  }

  export type ContainerRegistryCreateNestedOneWithoutEventsInput = {
    create?: XOR<ContainerRegistryCreateWithoutEventsInput, ContainerRegistryUncheckedCreateWithoutEventsInput>
    connectOrCreate?: ContainerRegistryCreateOrConnectWithoutEventsInput
    connect?: ContainerRegistryWhereUniqueInput
  }

  export type ContainerRegistryUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<ContainerRegistryCreateWithoutEventsInput, ContainerRegistryUncheckedCreateWithoutEventsInput>
    connectOrCreate?: ContainerRegistryCreateOrConnectWithoutEventsInput
    upsert?: ContainerRegistryUpsertWithoutEventsInput
    connect?: ContainerRegistryWhereUniqueInput
    update?: XOR<XOR<ContainerRegistryUpdateToOneWithWhereWithoutEventsInput, ContainerRegistryUpdateWithoutEventsInput>, ContainerRegistryUncheckedUpdateWithoutEventsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumAgentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AgentStatus | EnumAgentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AgentStatus[] | ListEnumAgentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AgentStatus[] | ListEnumAgentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAgentStatusFilter<$PrismaModel> | $Enums.AgentStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumAgentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AgentStatus | EnumAgentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AgentStatus[] | ListEnumAgentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AgentStatus[] | ListEnumAgentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAgentStatusWithAggregatesFilter<$PrismaModel> | $Enums.AgentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAgentStatusFilter<$PrismaModel>
    _max?: NestedEnumAgentStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AgentResultCreateWithoutJobInput = {
    id?: string
    output: JsonNullValueInput | InputJsonValue
    error?: string | null
    createdAt?: Date | string
  }

  export type AgentResultUncheckedCreateWithoutJobInput = {
    id?: string
    output: JsonNullValueInput | InputJsonValue
    error?: string | null
    createdAt?: Date | string
  }

  export type AgentResultCreateOrConnectWithoutJobInput = {
    where: AgentResultWhereUniqueInput
    create: XOR<AgentResultCreateWithoutJobInput, AgentResultUncheckedCreateWithoutJobInput>
  }

  export type AgentResultUpsertWithoutJobInput = {
    update: XOR<AgentResultUpdateWithoutJobInput, AgentResultUncheckedUpdateWithoutJobInput>
    create: XOR<AgentResultCreateWithoutJobInput, AgentResultUncheckedCreateWithoutJobInput>
    where?: AgentResultWhereInput
  }

  export type AgentResultUpdateToOneWithWhereWithoutJobInput = {
    where?: AgentResultWhereInput
    data: XOR<AgentResultUpdateWithoutJobInput, AgentResultUncheckedUpdateWithoutJobInput>
  }

  export type AgentResultUpdateWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    output?: JsonNullValueInput | InputJsonValue
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentResultUncheckedUpdateWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    output?: JsonNullValueInput | InputJsonValue
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentJobCreateWithoutResultsInput = {
    id?: string
    agentName: string
    status?: $Enums.AgentStatus
    triggeredBy: string
    triggeredAt?: Date | string
    completedAt?: Date | string | null
    result?: NullableJsonNullValueInput | InputJsonValue
    error?: string | null
    durationMs?: number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AgentJobUncheckedCreateWithoutResultsInput = {
    id?: string
    agentName: string
    status?: $Enums.AgentStatus
    triggeredBy: string
    triggeredAt?: Date | string
    completedAt?: Date | string | null
    result?: NullableJsonNullValueInput | InputJsonValue
    error?: string | null
    durationMs?: number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AgentJobCreateOrConnectWithoutResultsInput = {
    where: AgentJobWhereUniqueInput
    create: XOR<AgentJobCreateWithoutResultsInput, AgentJobUncheckedCreateWithoutResultsInput>
  }

  export type AgentJobUpsertWithoutResultsInput = {
    update: XOR<AgentJobUpdateWithoutResultsInput, AgentJobUncheckedUpdateWithoutResultsInput>
    create: XOR<AgentJobCreateWithoutResultsInput, AgentJobUncheckedCreateWithoutResultsInput>
    where?: AgentJobWhereInput
  }

  export type AgentJobUpdateToOneWithWhereWithoutResultsInput = {
    where?: AgentJobWhereInput
    data: XOR<AgentJobUpdateWithoutResultsInput, AgentJobUncheckedUpdateWithoutResultsInput>
  }

  export type AgentJobUpdateWithoutResultsInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentName?: StringFieldUpdateOperationsInput | string
    status?: EnumAgentStatusFieldUpdateOperationsInput | $Enums.AgentStatus
    triggeredBy?: StringFieldUpdateOperationsInput | string
    triggeredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    result?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableStringFieldUpdateOperationsInput | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AgentJobUncheckedUpdateWithoutResultsInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentName?: StringFieldUpdateOperationsInput | string
    status?: EnumAgentStatusFieldUpdateOperationsInput | $Enums.AgentStatus
    triggeredBy?: StringFieldUpdateOperationsInput | string
    triggeredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    result?: NullableJsonNullValueInput | InputJsonValue
    error?: NullableStringFieldUpdateOperationsInput | string | null
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RegistrationEventCreateWithoutContainerInput = {
    id?: string
    eventType: string
    system: string
    status: string
    message?: string | null
    errorDetails?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type RegistrationEventUncheckedCreateWithoutContainerInput = {
    id?: string
    eventType: string
    system: string
    status: string
    message?: string | null
    errorDetails?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type RegistrationEventCreateOrConnectWithoutContainerInput = {
    where: RegistrationEventWhereUniqueInput
    create: XOR<RegistrationEventCreateWithoutContainerInput, RegistrationEventUncheckedCreateWithoutContainerInput>
  }

  export type RegistrationEventCreateManyContainerInputEnvelope = {
    data: RegistrationEventCreateManyContainerInput | RegistrationEventCreateManyContainerInput[]
    skipDuplicates?: boolean
  }

  export type RegistrationEventUpsertWithWhereUniqueWithoutContainerInput = {
    where: RegistrationEventWhereUniqueInput
    update: XOR<RegistrationEventUpdateWithoutContainerInput, RegistrationEventUncheckedUpdateWithoutContainerInput>
    create: XOR<RegistrationEventCreateWithoutContainerInput, RegistrationEventUncheckedCreateWithoutContainerInput>
  }

  export type RegistrationEventUpdateWithWhereUniqueWithoutContainerInput = {
    where: RegistrationEventWhereUniqueInput
    data: XOR<RegistrationEventUpdateWithoutContainerInput, RegistrationEventUncheckedUpdateWithoutContainerInput>
  }

  export type RegistrationEventUpdateManyWithWhereWithoutContainerInput = {
    where: RegistrationEventScalarWhereInput
    data: XOR<RegistrationEventUpdateManyMutationInput, RegistrationEventUncheckedUpdateManyWithoutContainerInput>
  }

  export type RegistrationEventScalarWhereInput = {
    AND?: RegistrationEventScalarWhereInput | RegistrationEventScalarWhereInput[]
    OR?: RegistrationEventScalarWhereInput[]
    NOT?: RegistrationEventScalarWhereInput | RegistrationEventScalarWhereInput[]
    id?: StringFilter<"RegistrationEvent"> | string
    containerId?: StringFilter<"RegistrationEvent"> | string
    eventType?: StringFilter<"RegistrationEvent"> | string
    system?: StringFilter<"RegistrationEvent"> | string
    status?: StringFilter<"RegistrationEvent"> | string
    message?: StringNullableFilter<"RegistrationEvent"> | string | null
    errorDetails?: JsonNullableFilter<"RegistrationEvent">
    timestamp?: DateTimeFilter<"RegistrationEvent"> | Date | string
  }

  export type ContainerRegistryCreateWithoutEventsInput = {
    id?: string
    containerId: string
    containerName: string
    image?: string | null
    status?: string
    ports?: NullableJsonNullValueInput | InputJsonValue
    labels?: NullableJsonNullValueInput | InputJsonValue
    environment?: NullableJsonNullValueInput | InputJsonValue
    networks?: ContainerRegistryCreatenetworksInput | string[]
    traefikRegistered?: boolean
    traefikUpdatedAt?: Date | string | null
    traefikConfig?: NullableJsonNullValueInput | InputJsonValue
    prometheusRegistered?: boolean
    prometheusUpdatedAt?: Date | string | null
    prometheusJobName?: string | null
    grafanaRegistered?: boolean
    grafanaUpdatedAt?: Date | string | null
    grafanaPanelIds?: ContainerRegistryCreategrafanaPanelIdsInput | number[]
    kumaRegistered?: boolean
    kumaUpdatedAt?: Date | string | null
    kumaMonitorId?: number | null
    wireguardRegistered?: boolean
    wireguardUpdatedAt?: Date | string | null
    wireguardIp?: string | null
    lokiRegistered?: boolean
    lokiUpdatedAt?: Date | string | null
    firstDetectedAt?: Date | string
    lastEventAt?: Date | string
    registrationCompletedAt?: Date | string | null
    lastHealthCheck?: Date | string | null
    createdBy?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContainerRegistryUncheckedCreateWithoutEventsInput = {
    id?: string
    containerId: string
    containerName: string
    image?: string | null
    status?: string
    ports?: NullableJsonNullValueInput | InputJsonValue
    labels?: NullableJsonNullValueInput | InputJsonValue
    environment?: NullableJsonNullValueInput | InputJsonValue
    networks?: ContainerRegistryCreatenetworksInput | string[]
    traefikRegistered?: boolean
    traefikUpdatedAt?: Date | string | null
    traefikConfig?: NullableJsonNullValueInput | InputJsonValue
    prometheusRegistered?: boolean
    prometheusUpdatedAt?: Date | string | null
    prometheusJobName?: string | null
    grafanaRegistered?: boolean
    grafanaUpdatedAt?: Date | string | null
    grafanaPanelIds?: ContainerRegistryCreategrafanaPanelIdsInput | number[]
    kumaRegistered?: boolean
    kumaUpdatedAt?: Date | string | null
    kumaMonitorId?: number | null
    wireguardRegistered?: boolean
    wireguardUpdatedAt?: Date | string | null
    wireguardIp?: string | null
    lokiRegistered?: boolean
    lokiUpdatedAt?: Date | string | null
    firstDetectedAt?: Date | string
    lastEventAt?: Date | string
    registrationCompletedAt?: Date | string | null
    lastHealthCheck?: Date | string | null
    createdBy?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ContainerRegistryCreateOrConnectWithoutEventsInput = {
    where: ContainerRegistryWhereUniqueInput
    create: XOR<ContainerRegistryCreateWithoutEventsInput, ContainerRegistryUncheckedCreateWithoutEventsInput>
  }

  export type ContainerRegistryUpsertWithoutEventsInput = {
    update: XOR<ContainerRegistryUpdateWithoutEventsInput, ContainerRegistryUncheckedUpdateWithoutEventsInput>
    create: XOR<ContainerRegistryCreateWithoutEventsInput, ContainerRegistryUncheckedCreateWithoutEventsInput>
    where?: ContainerRegistryWhereInput
  }

  export type ContainerRegistryUpdateToOneWithWhereWithoutEventsInput = {
    where?: ContainerRegistryWhereInput
    data: XOR<ContainerRegistryUpdateWithoutEventsInput, ContainerRegistryUncheckedUpdateWithoutEventsInput>
  }

  export type ContainerRegistryUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    containerId?: StringFieldUpdateOperationsInput | string
    containerName?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ports?: NullableJsonNullValueInput | InputJsonValue
    labels?: NullableJsonNullValueInput | InputJsonValue
    environment?: NullableJsonNullValueInput | InputJsonValue
    networks?: ContainerRegistryUpdatenetworksInput | string[]
    traefikRegistered?: BoolFieldUpdateOperationsInput | boolean
    traefikUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    traefikConfig?: NullableJsonNullValueInput | InputJsonValue
    prometheusRegistered?: BoolFieldUpdateOperationsInput | boolean
    prometheusUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prometheusJobName?: NullableStringFieldUpdateOperationsInput | string | null
    grafanaRegistered?: BoolFieldUpdateOperationsInput | boolean
    grafanaUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    grafanaPanelIds?: ContainerRegistryUpdategrafanaPanelIdsInput | number[]
    kumaRegistered?: BoolFieldUpdateOperationsInput | boolean
    kumaUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kumaMonitorId?: NullableIntFieldUpdateOperationsInput | number | null
    wireguardRegistered?: BoolFieldUpdateOperationsInput | boolean
    wireguardUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wireguardIp?: NullableStringFieldUpdateOperationsInput | string | null
    lokiRegistered?: BoolFieldUpdateOperationsInput | boolean
    lokiUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firstDetectedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastEventAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastHealthCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContainerRegistryUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    containerId?: StringFieldUpdateOperationsInput | string
    containerName?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ports?: NullableJsonNullValueInput | InputJsonValue
    labels?: NullableJsonNullValueInput | InputJsonValue
    environment?: NullableJsonNullValueInput | InputJsonValue
    networks?: ContainerRegistryUpdatenetworksInput | string[]
    traefikRegistered?: BoolFieldUpdateOperationsInput | boolean
    traefikUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    traefikConfig?: NullableJsonNullValueInput | InputJsonValue
    prometheusRegistered?: BoolFieldUpdateOperationsInput | boolean
    prometheusUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    prometheusJobName?: NullableStringFieldUpdateOperationsInput | string | null
    grafanaRegistered?: BoolFieldUpdateOperationsInput | boolean
    grafanaUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    grafanaPanelIds?: ContainerRegistryUpdategrafanaPanelIdsInput | number[]
    kumaRegistered?: BoolFieldUpdateOperationsInput | boolean
    kumaUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kumaMonitorId?: NullableIntFieldUpdateOperationsInput | number | null
    wireguardRegistered?: BoolFieldUpdateOperationsInput | boolean
    wireguardUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    wireguardIp?: NullableStringFieldUpdateOperationsInput | string | null
    lokiRegistered?: BoolFieldUpdateOperationsInput | boolean
    lokiUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firstDetectedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastEventAt?: DateTimeFieldUpdateOperationsInput | Date | string
    registrationCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastHealthCheck?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistrationEventCreateManyContainerInput = {
    id?: string
    eventType: string
    system: string
    status: string
    message?: string | null
    errorDetails?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type RegistrationEventUpdateWithoutContainerInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    system?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    errorDetails?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistrationEventUncheckedUpdateWithoutContainerInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    system?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    errorDetails?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegistrationEventUncheckedUpdateManyWithoutContainerInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    system?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    errorDetails?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}