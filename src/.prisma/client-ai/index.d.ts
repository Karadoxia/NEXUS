
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model ProductEmbedding
 * Product embeddings for similarity search and recommendations
 */
export type ProductEmbedding = $Result.DefaultSelection<Prisma.$ProductEmbeddingPayload>
/**
 * Model CustomerBehavior
 * Customer behavioral data for ML training (anonymized)
 */
export type CustomerBehavior = $Result.DefaultSelection<Prisma.$CustomerBehaviorPayload>
/**
 * Model ChurnPrediction
 * Churn prediction features & scores
 */
export type ChurnPrediction = $Result.DefaultSelection<Prisma.$ChurnPredictionPayload>
/**
 * Model ProductRecommendation
 * Product recommendation results & CTR metrics
 */
export type ProductRecommendation = $Result.DefaultSelection<Prisma.$ProductRecommendationPayload>
/**
 * Model SentimentAnalysis
 * Sentiment analysis results from reviews/feedback
 */
export type SentimentAnalysis = $Result.DefaultSelection<Prisma.$SentimentAnalysisPayload>
/**
 * Model PriceOptimization
 * Price elasticity & optimization data
 */
export type PriceOptimization = $Result.DefaultSelection<Prisma.$PriceOptimizationPayload>
/**
 * Model CustomerLTV
 * Customer lifetime value predictions
 */
export type CustomerLTV = $Result.DefaultSelection<Prisma.$CustomerLTVPayload>
/**
 * Model ABTest
 * A/B test configurations & results
 */
export type ABTest = $Result.DefaultSelection<Prisma.$ABTestPayload>
/**
 * Model FraudScore
 * Fraud detection flags & scores
 */
export type FraudScore = $Result.DefaultSelection<Prisma.$FraudScorePayload>
/**
 * Model MLModel
 * Track deployed ML models and their performance
 */
export type MLModel = $Result.DefaultSelection<Prisma.$MLModelPayload>
/**
 * Model ModelTrainingLog
 * Model training logs for debugging and optimization
 */
export type ModelTrainingLog = $Result.DefaultSelection<Prisma.$ModelTrainingLogPayload>
/**
 * Model UserFeatures
 * User features for ML pipelines
 */
export type UserFeatures = $Result.DefaultSelection<Prisma.$UserFeaturesPayload>
/**
 * Model ProductFeatures
 * Product features for ML pipelines
 */
export type ProductFeatures = $Result.DefaultSelection<Prisma.$ProductFeaturesPayload>
/**
 * Model AIAuditLog
 * Audit trail for AI operations & decisions
 */
export type AIAuditLog = $Result.DefaultSelection<Prisma.$AIAuditLogPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ProductEmbeddings
 * const productEmbeddings = await prisma.productEmbedding.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
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
   * // Fetch zero or more ProductEmbeddings
   * const productEmbeddings = await prisma.productEmbedding.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.productEmbedding`: Exposes CRUD operations for the **ProductEmbedding** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductEmbeddings
    * const productEmbeddings = await prisma.productEmbedding.findMany()
    * ```
    */
  get productEmbedding(): Prisma.ProductEmbeddingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.customerBehavior`: Exposes CRUD operations for the **CustomerBehavior** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CustomerBehaviors
    * const customerBehaviors = await prisma.customerBehavior.findMany()
    * ```
    */
  get customerBehavior(): Prisma.CustomerBehaviorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.churnPrediction`: Exposes CRUD operations for the **ChurnPrediction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChurnPredictions
    * const churnPredictions = await prisma.churnPrediction.findMany()
    * ```
    */
  get churnPrediction(): Prisma.ChurnPredictionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.productRecommendation`: Exposes CRUD operations for the **ProductRecommendation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductRecommendations
    * const productRecommendations = await prisma.productRecommendation.findMany()
    * ```
    */
  get productRecommendation(): Prisma.ProductRecommendationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sentimentAnalysis`: Exposes CRUD operations for the **SentimentAnalysis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SentimentAnalyses
    * const sentimentAnalyses = await prisma.sentimentAnalysis.findMany()
    * ```
    */
  get sentimentAnalysis(): Prisma.SentimentAnalysisDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.priceOptimization`: Exposes CRUD operations for the **PriceOptimization** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PriceOptimizations
    * const priceOptimizations = await prisma.priceOptimization.findMany()
    * ```
    */
  get priceOptimization(): Prisma.PriceOptimizationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.customerLTV`: Exposes CRUD operations for the **CustomerLTV** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CustomerLTVS
    * const customerLTVS = await prisma.customerLTV.findMany()
    * ```
    */
  get customerLTV(): Prisma.CustomerLTVDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aBTest`: Exposes CRUD operations for the **ABTest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ABTests
    * const aBTests = await prisma.aBTest.findMany()
    * ```
    */
  get aBTest(): Prisma.ABTestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fraudScore`: Exposes CRUD operations for the **FraudScore** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FraudScores
    * const fraudScores = await prisma.fraudScore.findMany()
    * ```
    */
  get fraudScore(): Prisma.FraudScoreDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mLModel`: Exposes CRUD operations for the **MLModel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MLModels
    * const mLModels = await prisma.mLModel.findMany()
    * ```
    */
  get mLModel(): Prisma.MLModelDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.modelTrainingLog`: Exposes CRUD operations for the **ModelTrainingLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ModelTrainingLogs
    * const modelTrainingLogs = await prisma.modelTrainingLog.findMany()
    * ```
    */
  get modelTrainingLog(): Prisma.ModelTrainingLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userFeatures`: Exposes CRUD operations for the **UserFeatures** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserFeatures
    * const userFeatures = await prisma.userFeatures.findMany()
    * ```
    */
  get userFeatures(): Prisma.UserFeaturesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.productFeatures`: Exposes CRUD operations for the **ProductFeatures** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductFeatures
    * const productFeatures = await prisma.productFeatures.findMany()
    * ```
    */
  get productFeatures(): Prisma.ProductFeaturesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aIAuditLog`: Exposes CRUD operations for the **AIAuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AIAuditLogs
    * const aIAuditLogs = await prisma.aIAuditLog.findMany()
    * ```
    */
  get aIAuditLog(): Prisma.AIAuditLogDelegate<ExtArgs, ClientOptions>;
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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.1
   * Query Engine version: 55ae170b1ced7fc6ed07a15f110549408c501bb3
   */
  export type PrismaVersion = {
    client: string
    engine: string
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
    ProductEmbedding: 'ProductEmbedding',
    CustomerBehavior: 'CustomerBehavior',
    ChurnPrediction: 'ChurnPrediction',
    ProductRecommendation: 'ProductRecommendation',
    SentimentAnalysis: 'SentimentAnalysis',
    PriceOptimization: 'PriceOptimization',
    CustomerLTV: 'CustomerLTV',
    ABTest: 'ABTest',
    FraudScore: 'FraudScore',
    MLModel: 'MLModel',
    ModelTrainingLog: 'ModelTrainingLog',
    UserFeatures: 'UserFeatures',
    ProductFeatures: 'ProductFeatures',
    AIAuditLog: 'AIAuditLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "productEmbedding" | "customerBehavior" | "churnPrediction" | "productRecommendation" | "sentimentAnalysis" | "priceOptimization" | "customerLTV" | "aBTest" | "fraudScore" | "mLModel" | "modelTrainingLog" | "userFeatures" | "productFeatures" | "aIAuditLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ProductEmbedding: {
        payload: Prisma.$ProductEmbeddingPayload<ExtArgs>
        fields: Prisma.ProductEmbeddingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductEmbeddingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductEmbeddingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductEmbeddingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductEmbeddingPayload>
          }
          findFirst: {
            args: Prisma.ProductEmbeddingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductEmbeddingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductEmbeddingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductEmbeddingPayload>
          }
          findMany: {
            args: Prisma.ProductEmbeddingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductEmbeddingPayload>[]
          }
          create: {
            args: Prisma.ProductEmbeddingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductEmbeddingPayload>
          }
          createMany: {
            args: Prisma.ProductEmbeddingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductEmbeddingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductEmbeddingPayload>[]
          }
          delete: {
            args: Prisma.ProductEmbeddingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductEmbeddingPayload>
          }
          update: {
            args: Prisma.ProductEmbeddingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductEmbeddingPayload>
          }
          deleteMany: {
            args: Prisma.ProductEmbeddingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductEmbeddingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductEmbeddingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductEmbeddingPayload>[]
          }
          upsert: {
            args: Prisma.ProductEmbeddingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductEmbeddingPayload>
          }
          aggregate: {
            args: Prisma.ProductEmbeddingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductEmbedding>
          }
          groupBy: {
            args: Prisma.ProductEmbeddingGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductEmbeddingGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductEmbeddingCountArgs<ExtArgs>
            result: $Utils.Optional<ProductEmbeddingCountAggregateOutputType> | number
          }
        }
      }
      CustomerBehavior: {
        payload: Prisma.$CustomerBehaviorPayload<ExtArgs>
        fields: Prisma.CustomerBehaviorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerBehaviorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerBehaviorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerBehaviorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerBehaviorPayload>
          }
          findFirst: {
            args: Prisma.CustomerBehaviorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerBehaviorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerBehaviorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerBehaviorPayload>
          }
          findMany: {
            args: Prisma.CustomerBehaviorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerBehaviorPayload>[]
          }
          create: {
            args: Prisma.CustomerBehaviorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerBehaviorPayload>
          }
          createMany: {
            args: Prisma.CustomerBehaviorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomerBehaviorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerBehaviorPayload>[]
          }
          delete: {
            args: Prisma.CustomerBehaviorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerBehaviorPayload>
          }
          update: {
            args: Prisma.CustomerBehaviorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerBehaviorPayload>
          }
          deleteMany: {
            args: Prisma.CustomerBehaviorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerBehaviorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CustomerBehaviorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerBehaviorPayload>[]
          }
          upsert: {
            args: Prisma.CustomerBehaviorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerBehaviorPayload>
          }
          aggregate: {
            args: Prisma.CustomerBehaviorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomerBehavior>
          }
          groupBy: {
            args: Prisma.CustomerBehaviorGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerBehaviorGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerBehaviorCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerBehaviorCountAggregateOutputType> | number
          }
        }
      }
      ChurnPrediction: {
        payload: Prisma.$ChurnPredictionPayload<ExtArgs>
        fields: Prisma.ChurnPredictionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChurnPredictionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurnPredictionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChurnPredictionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurnPredictionPayload>
          }
          findFirst: {
            args: Prisma.ChurnPredictionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurnPredictionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChurnPredictionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurnPredictionPayload>
          }
          findMany: {
            args: Prisma.ChurnPredictionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurnPredictionPayload>[]
          }
          create: {
            args: Prisma.ChurnPredictionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurnPredictionPayload>
          }
          createMany: {
            args: Prisma.ChurnPredictionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChurnPredictionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurnPredictionPayload>[]
          }
          delete: {
            args: Prisma.ChurnPredictionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurnPredictionPayload>
          }
          update: {
            args: Prisma.ChurnPredictionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurnPredictionPayload>
          }
          deleteMany: {
            args: Prisma.ChurnPredictionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChurnPredictionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChurnPredictionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurnPredictionPayload>[]
          }
          upsert: {
            args: Prisma.ChurnPredictionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChurnPredictionPayload>
          }
          aggregate: {
            args: Prisma.ChurnPredictionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChurnPrediction>
          }
          groupBy: {
            args: Prisma.ChurnPredictionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChurnPredictionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChurnPredictionCountArgs<ExtArgs>
            result: $Utils.Optional<ChurnPredictionCountAggregateOutputType> | number
          }
        }
      }
      ProductRecommendation: {
        payload: Prisma.$ProductRecommendationPayload<ExtArgs>
        fields: Prisma.ProductRecommendationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductRecommendationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductRecommendationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductRecommendationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductRecommendationPayload>
          }
          findFirst: {
            args: Prisma.ProductRecommendationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductRecommendationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductRecommendationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductRecommendationPayload>
          }
          findMany: {
            args: Prisma.ProductRecommendationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductRecommendationPayload>[]
          }
          create: {
            args: Prisma.ProductRecommendationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductRecommendationPayload>
          }
          createMany: {
            args: Prisma.ProductRecommendationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductRecommendationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductRecommendationPayload>[]
          }
          delete: {
            args: Prisma.ProductRecommendationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductRecommendationPayload>
          }
          update: {
            args: Prisma.ProductRecommendationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductRecommendationPayload>
          }
          deleteMany: {
            args: Prisma.ProductRecommendationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductRecommendationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductRecommendationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductRecommendationPayload>[]
          }
          upsert: {
            args: Prisma.ProductRecommendationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductRecommendationPayload>
          }
          aggregate: {
            args: Prisma.ProductRecommendationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductRecommendation>
          }
          groupBy: {
            args: Prisma.ProductRecommendationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductRecommendationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductRecommendationCountArgs<ExtArgs>
            result: $Utils.Optional<ProductRecommendationCountAggregateOutputType> | number
          }
        }
      }
      SentimentAnalysis: {
        payload: Prisma.$SentimentAnalysisPayload<ExtArgs>
        fields: Prisma.SentimentAnalysisFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SentimentAnalysisFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentAnalysisPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SentimentAnalysisFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentAnalysisPayload>
          }
          findFirst: {
            args: Prisma.SentimentAnalysisFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentAnalysisPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SentimentAnalysisFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentAnalysisPayload>
          }
          findMany: {
            args: Prisma.SentimentAnalysisFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentAnalysisPayload>[]
          }
          create: {
            args: Prisma.SentimentAnalysisCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentAnalysisPayload>
          }
          createMany: {
            args: Prisma.SentimentAnalysisCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SentimentAnalysisCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentAnalysisPayload>[]
          }
          delete: {
            args: Prisma.SentimentAnalysisDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentAnalysisPayload>
          }
          update: {
            args: Prisma.SentimentAnalysisUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentAnalysisPayload>
          }
          deleteMany: {
            args: Prisma.SentimentAnalysisDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SentimentAnalysisUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SentimentAnalysisUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentAnalysisPayload>[]
          }
          upsert: {
            args: Prisma.SentimentAnalysisUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SentimentAnalysisPayload>
          }
          aggregate: {
            args: Prisma.SentimentAnalysisAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSentimentAnalysis>
          }
          groupBy: {
            args: Prisma.SentimentAnalysisGroupByArgs<ExtArgs>
            result: $Utils.Optional<SentimentAnalysisGroupByOutputType>[]
          }
          count: {
            args: Prisma.SentimentAnalysisCountArgs<ExtArgs>
            result: $Utils.Optional<SentimentAnalysisCountAggregateOutputType> | number
          }
        }
      }
      PriceOptimization: {
        payload: Prisma.$PriceOptimizationPayload<ExtArgs>
        fields: Prisma.PriceOptimizationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PriceOptimizationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceOptimizationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PriceOptimizationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceOptimizationPayload>
          }
          findFirst: {
            args: Prisma.PriceOptimizationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceOptimizationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PriceOptimizationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceOptimizationPayload>
          }
          findMany: {
            args: Prisma.PriceOptimizationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceOptimizationPayload>[]
          }
          create: {
            args: Prisma.PriceOptimizationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceOptimizationPayload>
          }
          createMany: {
            args: Prisma.PriceOptimizationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PriceOptimizationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceOptimizationPayload>[]
          }
          delete: {
            args: Prisma.PriceOptimizationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceOptimizationPayload>
          }
          update: {
            args: Prisma.PriceOptimizationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceOptimizationPayload>
          }
          deleteMany: {
            args: Prisma.PriceOptimizationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PriceOptimizationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PriceOptimizationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceOptimizationPayload>[]
          }
          upsert: {
            args: Prisma.PriceOptimizationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceOptimizationPayload>
          }
          aggregate: {
            args: Prisma.PriceOptimizationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePriceOptimization>
          }
          groupBy: {
            args: Prisma.PriceOptimizationGroupByArgs<ExtArgs>
            result: $Utils.Optional<PriceOptimizationGroupByOutputType>[]
          }
          count: {
            args: Prisma.PriceOptimizationCountArgs<ExtArgs>
            result: $Utils.Optional<PriceOptimizationCountAggregateOutputType> | number
          }
        }
      }
      CustomerLTV: {
        payload: Prisma.$CustomerLTVPayload<ExtArgs>
        fields: Prisma.CustomerLTVFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerLTVFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLTVPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerLTVFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLTVPayload>
          }
          findFirst: {
            args: Prisma.CustomerLTVFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLTVPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerLTVFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLTVPayload>
          }
          findMany: {
            args: Prisma.CustomerLTVFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLTVPayload>[]
          }
          create: {
            args: Prisma.CustomerLTVCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLTVPayload>
          }
          createMany: {
            args: Prisma.CustomerLTVCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomerLTVCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLTVPayload>[]
          }
          delete: {
            args: Prisma.CustomerLTVDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLTVPayload>
          }
          update: {
            args: Prisma.CustomerLTVUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLTVPayload>
          }
          deleteMany: {
            args: Prisma.CustomerLTVDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerLTVUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CustomerLTVUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLTVPayload>[]
          }
          upsert: {
            args: Prisma.CustomerLTVUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerLTVPayload>
          }
          aggregate: {
            args: Prisma.CustomerLTVAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomerLTV>
          }
          groupBy: {
            args: Prisma.CustomerLTVGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerLTVGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerLTVCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerLTVCountAggregateOutputType> | number
          }
        }
      }
      ABTest: {
        payload: Prisma.$ABTestPayload<ExtArgs>
        fields: Prisma.ABTestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ABTestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ABTestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ABTestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ABTestPayload>
          }
          findFirst: {
            args: Prisma.ABTestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ABTestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ABTestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ABTestPayload>
          }
          findMany: {
            args: Prisma.ABTestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ABTestPayload>[]
          }
          create: {
            args: Prisma.ABTestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ABTestPayload>
          }
          createMany: {
            args: Prisma.ABTestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ABTestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ABTestPayload>[]
          }
          delete: {
            args: Prisma.ABTestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ABTestPayload>
          }
          update: {
            args: Prisma.ABTestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ABTestPayload>
          }
          deleteMany: {
            args: Prisma.ABTestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ABTestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ABTestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ABTestPayload>[]
          }
          upsert: {
            args: Prisma.ABTestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ABTestPayload>
          }
          aggregate: {
            args: Prisma.ABTestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateABTest>
          }
          groupBy: {
            args: Prisma.ABTestGroupByArgs<ExtArgs>
            result: $Utils.Optional<ABTestGroupByOutputType>[]
          }
          count: {
            args: Prisma.ABTestCountArgs<ExtArgs>
            result: $Utils.Optional<ABTestCountAggregateOutputType> | number
          }
        }
      }
      FraudScore: {
        payload: Prisma.$FraudScorePayload<ExtArgs>
        fields: Prisma.FraudScoreFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FraudScoreFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FraudScorePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FraudScoreFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FraudScorePayload>
          }
          findFirst: {
            args: Prisma.FraudScoreFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FraudScorePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FraudScoreFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FraudScorePayload>
          }
          findMany: {
            args: Prisma.FraudScoreFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FraudScorePayload>[]
          }
          create: {
            args: Prisma.FraudScoreCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FraudScorePayload>
          }
          createMany: {
            args: Prisma.FraudScoreCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FraudScoreCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FraudScorePayload>[]
          }
          delete: {
            args: Prisma.FraudScoreDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FraudScorePayload>
          }
          update: {
            args: Prisma.FraudScoreUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FraudScorePayload>
          }
          deleteMany: {
            args: Prisma.FraudScoreDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FraudScoreUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FraudScoreUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FraudScorePayload>[]
          }
          upsert: {
            args: Prisma.FraudScoreUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FraudScorePayload>
          }
          aggregate: {
            args: Prisma.FraudScoreAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFraudScore>
          }
          groupBy: {
            args: Prisma.FraudScoreGroupByArgs<ExtArgs>
            result: $Utils.Optional<FraudScoreGroupByOutputType>[]
          }
          count: {
            args: Prisma.FraudScoreCountArgs<ExtArgs>
            result: $Utils.Optional<FraudScoreCountAggregateOutputType> | number
          }
        }
      }
      MLModel: {
        payload: Prisma.$MLModelPayload<ExtArgs>
        fields: Prisma.MLModelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MLModelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MLModelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MLModelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MLModelPayload>
          }
          findFirst: {
            args: Prisma.MLModelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MLModelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MLModelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MLModelPayload>
          }
          findMany: {
            args: Prisma.MLModelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MLModelPayload>[]
          }
          create: {
            args: Prisma.MLModelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MLModelPayload>
          }
          createMany: {
            args: Prisma.MLModelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MLModelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MLModelPayload>[]
          }
          delete: {
            args: Prisma.MLModelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MLModelPayload>
          }
          update: {
            args: Prisma.MLModelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MLModelPayload>
          }
          deleteMany: {
            args: Prisma.MLModelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MLModelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MLModelUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MLModelPayload>[]
          }
          upsert: {
            args: Prisma.MLModelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MLModelPayload>
          }
          aggregate: {
            args: Prisma.MLModelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMLModel>
          }
          groupBy: {
            args: Prisma.MLModelGroupByArgs<ExtArgs>
            result: $Utils.Optional<MLModelGroupByOutputType>[]
          }
          count: {
            args: Prisma.MLModelCountArgs<ExtArgs>
            result: $Utils.Optional<MLModelCountAggregateOutputType> | number
          }
        }
      }
      ModelTrainingLog: {
        payload: Prisma.$ModelTrainingLogPayload<ExtArgs>
        fields: Prisma.ModelTrainingLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ModelTrainingLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelTrainingLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ModelTrainingLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelTrainingLogPayload>
          }
          findFirst: {
            args: Prisma.ModelTrainingLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelTrainingLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ModelTrainingLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelTrainingLogPayload>
          }
          findMany: {
            args: Prisma.ModelTrainingLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelTrainingLogPayload>[]
          }
          create: {
            args: Prisma.ModelTrainingLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelTrainingLogPayload>
          }
          createMany: {
            args: Prisma.ModelTrainingLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ModelTrainingLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelTrainingLogPayload>[]
          }
          delete: {
            args: Prisma.ModelTrainingLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelTrainingLogPayload>
          }
          update: {
            args: Prisma.ModelTrainingLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelTrainingLogPayload>
          }
          deleteMany: {
            args: Prisma.ModelTrainingLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ModelTrainingLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ModelTrainingLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelTrainingLogPayload>[]
          }
          upsert: {
            args: Prisma.ModelTrainingLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModelTrainingLogPayload>
          }
          aggregate: {
            args: Prisma.ModelTrainingLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateModelTrainingLog>
          }
          groupBy: {
            args: Prisma.ModelTrainingLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ModelTrainingLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ModelTrainingLogCountArgs<ExtArgs>
            result: $Utils.Optional<ModelTrainingLogCountAggregateOutputType> | number
          }
        }
      }
      UserFeatures: {
        payload: Prisma.$UserFeaturesPayload<ExtArgs>
        fields: Prisma.UserFeaturesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFeaturesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFeaturesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFeaturesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFeaturesPayload>
          }
          findFirst: {
            args: Prisma.UserFeaturesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFeaturesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFeaturesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFeaturesPayload>
          }
          findMany: {
            args: Prisma.UserFeaturesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFeaturesPayload>[]
          }
          create: {
            args: Prisma.UserFeaturesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFeaturesPayload>
          }
          createMany: {
            args: Prisma.UserFeaturesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserFeaturesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFeaturesPayload>[]
          }
          delete: {
            args: Prisma.UserFeaturesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFeaturesPayload>
          }
          update: {
            args: Prisma.UserFeaturesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFeaturesPayload>
          }
          deleteMany: {
            args: Prisma.UserFeaturesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserFeaturesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserFeaturesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFeaturesPayload>[]
          }
          upsert: {
            args: Prisma.UserFeaturesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFeaturesPayload>
          }
          aggregate: {
            args: Prisma.UserFeaturesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserFeatures>
          }
          groupBy: {
            args: Prisma.UserFeaturesGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserFeaturesGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserFeaturesCountArgs<ExtArgs>
            result: $Utils.Optional<UserFeaturesCountAggregateOutputType> | number
          }
        }
      }
      ProductFeatures: {
        payload: Prisma.$ProductFeaturesPayload<ExtArgs>
        fields: Prisma.ProductFeaturesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFeaturesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductFeaturesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFeaturesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductFeaturesPayload>
          }
          findFirst: {
            args: Prisma.ProductFeaturesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductFeaturesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFeaturesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductFeaturesPayload>
          }
          findMany: {
            args: Prisma.ProductFeaturesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductFeaturesPayload>[]
          }
          create: {
            args: Prisma.ProductFeaturesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductFeaturesPayload>
          }
          createMany: {
            args: Prisma.ProductFeaturesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductFeaturesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductFeaturesPayload>[]
          }
          delete: {
            args: Prisma.ProductFeaturesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductFeaturesPayload>
          }
          update: {
            args: Prisma.ProductFeaturesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductFeaturesPayload>
          }
          deleteMany: {
            args: Prisma.ProductFeaturesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductFeaturesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductFeaturesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductFeaturesPayload>[]
          }
          upsert: {
            args: Prisma.ProductFeaturesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductFeaturesPayload>
          }
          aggregate: {
            args: Prisma.ProductFeaturesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductFeatures>
          }
          groupBy: {
            args: Prisma.ProductFeaturesGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductFeaturesGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductFeaturesCountArgs<ExtArgs>
            result: $Utils.Optional<ProductFeaturesCountAggregateOutputType> | number
          }
        }
      }
      AIAuditLog: {
        payload: Prisma.$AIAuditLogPayload<ExtArgs>
        fields: Prisma.AIAuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AIAuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AIAuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAuditLogPayload>
          }
          findFirst: {
            args: Prisma.AIAuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AIAuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAuditLogPayload>
          }
          findMany: {
            args: Prisma.AIAuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAuditLogPayload>[]
          }
          create: {
            args: Prisma.AIAuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAuditLogPayload>
          }
          createMany: {
            args: Prisma.AIAuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AIAuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAuditLogPayload>[]
          }
          delete: {
            args: Prisma.AIAuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAuditLogPayload>
          }
          update: {
            args: Prisma.AIAuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AIAuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AIAuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AIAuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AIAuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAuditLogPayload>
          }
          aggregate: {
            args: Prisma.AIAuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAIAuditLog>
          }
          groupBy: {
            args: Prisma.AIAuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AIAuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AIAuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AIAuditLogCountAggregateOutputType> | number
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
     * Read more in our [docs](https://pris.ly/d/logging).
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
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
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
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    productEmbedding?: ProductEmbeddingOmit
    customerBehavior?: CustomerBehaviorOmit
    churnPrediction?: ChurnPredictionOmit
    productRecommendation?: ProductRecommendationOmit
    sentimentAnalysis?: SentimentAnalysisOmit
    priceOptimization?: PriceOptimizationOmit
    customerLTV?: CustomerLTVOmit
    aBTest?: ABTestOmit
    fraudScore?: FraudScoreOmit
    mLModel?: MLModelOmit
    modelTrainingLog?: ModelTrainingLogOmit
    userFeatures?: UserFeaturesOmit
    productFeatures?: ProductFeaturesOmit
    aIAuditLog?: AIAuditLogOmit
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
   * Models
   */

  /**
   * Model ProductEmbedding
   */

  export type AggregateProductEmbedding = {
    _count: ProductEmbeddingCountAggregateOutputType | null
    _avg: ProductEmbeddingAvgAggregateOutputType | null
    _sum: ProductEmbeddingSumAggregateOutputType | null
    _min: ProductEmbeddingMinAggregateOutputType | null
    _max: ProductEmbeddingMaxAggregateOutputType | null
  }

  export type ProductEmbeddingAvgAggregateOutputType = {
    embedding: number | null
  }

  export type ProductEmbeddingSumAggregateOutputType = {
    embedding: number[]
  }

  export type ProductEmbeddingMinAggregateOutputType = {
    id: string | null
    productId: string | null
    model: string | null
    modelVersion: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductEmbeddingMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    model: string | null
    modelVersion: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductEmbeddingCountAggregateOutputType = {
    id: number
    productId: number
    embedding: number
    model: number
    modelVersion: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductEmbeddingAvgAggregateInputType = {
    embedding?: true
  }

  export type ProductEmbeddingSumAggregateInputType = {
    embedding?: true
  }

  export type ProductEmbeddingMinAggregateInputType = {
    id?: true
    productId?: true
    model?: true
    modelVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductEmbeddingMaxAggregateInputType = {
    id?: true
    productId?: true
    model?: true
    modelVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductEmbeddingCountAggregateInputType = {
    id?: true
    productId?: true
    embedding?: true
    model?: true
    modelVersion?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductEmbeddingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductEmbedding to aggregate.
     */
    where?: ProductEmbeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductEmbeddings to fetch.
     */
    orderBy?: ProductEmbeddingOrderByWithRelationInput | ProductEmbeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductEmbeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductEmbeddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductEmbeddings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductEmbeddings
    **/
    _count?: true | ProductEmbeddingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductEmbeddingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductEmbeddingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductEmbeddingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductEmbeddingMaxAggregateInputType
  }

  export type GetProductEmbeddingAggregateType<T extends ProductEmbeddingAggregateArgs> = {
        [P in keyof T & keyof AggregateProductEmbedding]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductEmbedding[P]>
      : GetScalarType<T[P], AggregateProductEmbedding[P]>
  }




  export type ProductEmbeddingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductEmbeddingWhereInput
    orderBy?: ProductEmbeddingOrderByWithAggregationInput | ProductEmbeddingOrderByWithAggregationInput[]
    by: ProductEmbeddingScalarFieldEnum[] | ProductEmbeddingScalarFieldEnum
    having?: ProductEmbeddingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductEmbeddingCountAggregateInputType | true
    _avg?: ProductEmbeddingAvgAggregateInputType
    _sum?: ProductEmbeddingSumAggregateInputType
    _min?: ProductEmbeddingMinAggregateInputType
    _max?: ProductEmbeddingMaxAggregateInputType
  }

  export type ProductEmbeddingGroupByOutputType = {
    id: string
    productId: string
    embedding: number[]
    model: string
    modelVersion: string
    createdAt: Date
    updatedAt: Date
    _count: ProductEmbeddingCountAggregateOutputType | null
    _avg: ProductEmbeddingAvgAggregateOutputType | null
    _sum: ProductEmbeddingSumAggregateOutputType | null
    _min: ProductEmbeddingMinAggregateOutputType | null
    _max: ProductEmbeddingMaxAggregateOutputType | null
  }

  type GetProductEmbeddingGroupByPayload<T extends ProductEmbeddingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductEmbeddingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductEmbeddingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductEmbeddingGroupByOutputType[P]>
            : GetScalarType<T[P], ProductEmbeddingGroupByOutputType[P]>
        }
      >
    >


  export type ProductEmbeddingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    embedding?: boolean
    model?: boolean
    modelVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["productEmbedding"]>

  export type ProductEmbeddingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    embedding?: boolean
    model?: boolean
    modelVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["productEmbedding"]>

  export type ProductEmbeddingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    embedding?: boolean
    model?: boolean
    modelVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["productEmbedding"]>

  export type ProductEmbeddingSelectScalar = {
    id?: boolean
    productId?: boolean
    embedding?: boolean
    model?: boolean
    modelVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProductEmbeddingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "embedding" | "model" | "modelVersion" | "createdAt" | "updatedAt", ExtArgs["result"]["productEmbedding"]>

  export type $ProductEmbeddingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductEmbedding"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      embedding: number[]
      model: string
      modelVersion: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["productEmbedding"]>
    composites: {}
  }

  type ProductEmbeddingGetPayload<S extends boolean | null | undefined | ProductEmbeddingDefaultArgs> = $Result.GetResult<Prisma.$ProductEmbeddingPayload, S>

  type ProductEmbeddingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductEmbeddingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductEmbeddingCountAggregateInputType | true
    }

  export interface ProductEmbeddingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductEmbedding'], meta: { name: 'ProductEmbedding' } }
    /**
     * Find zero or one ProductEmbedding that matches the filter.
     * @param {ProductEmbeddingFindUniqueArgs} args - Arguments to find a ProductEmbedding
     * @example
     * // Get one ProductEmbedding
     * const productEmbedding = await prisma.productEmbedding.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductEmbeddingFindUniqueArgs>(args: SelectSubset<T, ProductEmbeddingFindUniqueArgs<ExtArgs>>): Prisma__ProductEmbeddingClient<$Result.GetResult<Prisma.$ProductEmbeddingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProductEmbedding that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductEmbeddingFindUniqueOrThrowArgs} args - Arguments to find a ProductEmbedding
     * @example
     * // Get one ProductEmbedding
     * const productEmbedding = await prisma.productEmbedding.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductEmbeddingFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductEmbeddingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductEmbeddingClient<$Result.GetResult<Prisma.$ProductEmbeddingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductEmbedding that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductEmbeddingFindFirstArgs} args - Arguments to find a ProductEmbedding
     * @example
     * // Get one ProductEmbedding
     * const productEmbedding = await prisma.productEmbedding.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductEmbeddingFindFirstArgs>(args?: SelectSubset<T, ProductEmbeddingFindFirstArgs<ExtArgs>>): Prisma__ProductEmbeddingClient<$Result.GetResult<Prisma.$ProductEmbeddingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductEmbedding that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductEmbeddingFindFirstOrThrowArgs} args - Arguments to find a ProductEmbedding
     * @example
     * // Get one ProductEmbedding
     * const productEmbedding = await prisma.productEmbedding.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductEmbeddingFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductEmbeddingFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductEmbeddingClient<$Result.GetResult<Prisma.$ProductEmbeddingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProductEmbeddings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductEmbeddingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductEmbeddings
     * const productEmbeddings = await prisma.productEmbedding.findMany()
     * 
     * // Get first 10 ProductEmbeddings
     * const productEmbeddings = await prisma.productEmbedding.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productEmbeddingWithIdOnly = await prisma.productEmbedding.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductEmbeddingFindManyArgs>(args?: SelectSubset<T, ProductEmbeddingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductEmbeddingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProductEmbedding.
     * @param {ProductEmbeddingCreateArgs} args - Arguments to create a ProductEmbedding.
     * @example
     * // Create one ProductEmbedding
     * const ProductEmbedding = await prisma.productEmbedding.create({
     *   data: {
     *     // ... data to create a ProductEmbedding
     *   }
     * })
     * 
     */
    create<T extends ProductEmbeddingCreateArgs>(args: SelectSubset<T, ProductEmbeddingCreateArgs<ExtArgs>>): Prisma__ProductEmbeddingClient<$Result.GetResult<Prisma.$ProductEmbeddingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProductEmbeddings.
     * @param {ProductEmbeddingCreateManyArgs} args - Arguments to create many ProductEmbeddings.
     * @example
     * // Create many ProductEmbeddings
     * const productEmbedding = await prisma.productEmbedding.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductEmbeddingCreateManyArgs>(args?: SelectSubset<T, ProductEmbeddingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProductEmbeddings and returns the data saved in the database.
     * @param {ProductEmbeddingCreateManyAndReturnArgs} args - Arguments to create many ProductEmbeddings.
     * @example
     * // Create many ProductEmbeddings
     * const productEmbedding = await prisma.productEmbedding.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProductEmbeddings and only return the `id`
     * const productEmbeddingWithIdOnly = await prisma.productEmbedding.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductEmbeddingCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductEmbeddingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductEmbeddingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProductEmbedding.
     * @param {ProductEmbeddingDeleteArgs} args - Arguments to delete one ProductEmbedding.
     * @example
     * // Delete one ProductEmbedding
     * const ProductEmbedding = await prisma.productEmbedding.delete({
     *   where: {
     *     // ... filter to delete one ProductEmbedding
     *   }
     * })
     * 
     */
    delete<T extends ProductEmbeddingDeleteArgs>(args: SelectSubset<T, ProductEmbeddingDeleteArgs<ExtArgs>>): Prisma__ProductEmbeddingClient<$Result.GetResult<Prisma.$ProductEmbeddingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProductEmbedding.
     * @param {ProductEmbeddingUpdateArgs} args - Arguments to update one ProductEmbedding.
     * @example
     * // Update one ProductEmbedding
     * const productEmbedding = await prisma.productEmbedding.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductEmbeddingUpdateArgs>(args: SelectSubset<T, ProductEmbeddingUpdateArgs<ExtArgs>>): Prisma__ProductEmbeddingClient<$Result.GetResult<Prisma.$ProductEmbeddingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProductEmbeddings.
     * @param {ProductEmbeddingDeleteManyArgs} args - Arguments to filter ProductEmbeddings to delete.
     * @example
     * // Delete a few ProductEmbeddings
     * const { count } = await prisma.productEmbedding.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductEmbeddingDeleteManyArgs>(args?: SelectSubset<T, ProductEmbeddingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductEmbeddings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductEmbeddingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductEmbeddings
     * const productEmbedding = await prisma.productEmbedding.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductEmbeddingUpdateManyArgs>(args: SelectSubset<T, ProductEmbeddingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductEmbeddings and returns the data updated in the database.
     * @param {ProductEmbeddingUpdateManyAndReturnArgs} args - Arguments to update many ProductEmbeddings.
     * @example
     * // Update many ProductEmbeddings
     * const productEmbedding = await prisma.productEmbedding.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProductEmbeddings and only return the `id`
     * const productEmbeddingWithIdOnly = await prisma.productEmbedding.updateManyAndReturn({
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
    updateManyAndReturn<T extends ProductEmbeddingUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductEmbeddingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductEmbeddingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProductEmbedding.
     * @param {ProductEmbeddingUpsertArgs} args - Arguments to update or create a ProductEmbedding.
     * @example
     * // Update or create a ProductEmbedding
     * const productEmbedding = await prisma.productEmbedding.upsert({
     *   create: {
     *     // ... data to create a ProductEmbedding
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductEmbedding we want to update
     *   }
     * })
     */
    upsert<T extends ProductEmbeddingUpsertArgs>(args: SelectSubset<T, ProductEmbeddingUpsertArgs<ExtArgs>>): Prisma__ProductEmbeddingClient<$Result.GetResult<Prisma.$ProductEmbeddingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProductEmbeddings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductEmbeddingCountArgs} args - Arguments to filter ProductEmbeddings to count.
     * @example
     * // Count the number of ProductEmbeddings
     * const count = await prisma.productEmbedding.count({
     *   where: {
     *     // ... the filter for the ProductEmbeddings we want to count
     *   }
     * })
    **/
    count<T extends ProductEmbeddingCountArgs>(
      args?: Subset<T, ProductEmbeddingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductEmbeddingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductEmbedding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductEmbeddingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProductEmbeddingAggregateArgs>(args: Subset<T, ProductEmbeddingAggregateArgs>): Prisma.PrismaPromise<GetProductEmbeddingAggregateType<T>>

    /**
     * Group by ProductEmbedding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductEmbeddingGroupByArgs} args - Group by arguments.
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
      T extends ProductEmbeddingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductEmbeddingGroupByArgs['orderBy'] }
        : { orderBy?: ProductEmbeddingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProductEmbeddingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductEmbeddingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductEmbedding model
   */
  readonly fields: ProductEmbeddingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductEmbedding.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductEmbeddingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ProductEmbedding model
   */
  interface ProductEmbeddingFieldRefs {
    readonly id: FieldRef<"ProductEmbedding", 'String'>
    readonly productId: FieldRef<"ProductEmbedding", 'String'>
    readonly embedding: FieldRef<"ProductEmbedding", 'Float[]'>
    readonly model: FieldRef<"ProductEmbedding", 'String'>
    readonly modelVersion: FieldRef<"ProductEmbedding", 'String'>
    readonly createdAt: FieldRef<"ProductEmbedding", 'DateTime'>
    readonly updatedAt: FieldRef<"ProductEmbedding", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProductEmbedding findUnique
   */
  export type ProductEmbeddingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductEmbedding
     */
    select?: ProductEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductEmbedding
     */
    omit?: ProductEmbeddingOmit<ExtArgs> | null
    /**
     * Filter, which ProductEmbedding to fetch.
     */
    where: ProductEmbeddingWhereUniqueInput
  }

  /**
   * ProductEmbedding findUniqueOrThrow
   */
  export type ProductEmbeddingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductEmbedding
     */
    select?: ProductEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductEmbedding
     */
    omit?: ProductEmbeddingOmit<ExtArgs> | null
    /**
     * Filter, which ProductEmbedding to fetch.
     */
    where: ProductEmbeddingWhereUniqueInput
  }

  /**
   * ProductEmbedding findFirst
   */
  export type ProductEmbeddingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductEmbedding
     */
    select?: ProductEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductEmbedding
     */
    omit?: ProductEmbeddingOmit<ExtArgs> | null
    /**
     * Filter, which ProductEmbedding to fetch.
     */
    where?: ProductEmbeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductEmbeddings to fetch.
     */
    orderBy?: ProductEmbeddingOrderByWithRelationInput | ProductEmbeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductEmbeddings.
     */
    cursor?: ProductEmbeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductEmbeddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductEmbeddings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductEmbeddings.
     */
    distinct?: ProductEmbeddingScalarFieldEnum | ProductEmbeddingScalarFieldEnum[]
  }

  /**
   * ProductEmbedding findFirstOrThrow
   */
  export type ProductEmbeddingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductEmbedding
     */
    select?: ProductEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductEmbedding
     */
    omit?: ProductEmbeddingOmit<ExtArgs> | null
    /**
     * Filter, which ProductEmbedding to fetch.
     */
    where?: ProductEmbeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductEmbeddings to fetch.
     */
    orderBy?: ProductEmbeddingOrderByWithRelationInput | ProductEmbeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductEmbeddings.
     */
    cursor?: ProductEmbeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductEmbeddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductEmbeddings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductEmbeddings.
     */
    distinct?: ProductEmbeddingScalarFieldEnum | ProductEmbeddingScalarFieldEnum[]
  }

  /**
   * ProductEmbedding findMany
   */
  export type ProductEmbeddingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductEmbedding
     */
    select?: ProductEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductEmbedding
     */
    omit?: ProductEmbeddingOmit<ExtArgs> | null
    /**
     * Filter, which ProductEmbeddings to fetch.
     */
    where?: ProductEmbeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductEmbeddings to fetch.
     */
    orderBy?: ProductEmbeddingOrderByWithRelationInput | ProductEmbeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductEmbeddings.
     */
    cursor?: ProductEmbeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductEmbeddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductEmbeddings.
     */
    skip?: number
    distinct?: ProductEmbeddingScalarFieldEnum | ProductEmbeddingScalarFieldEnum[]
  }

  /**
   * ProductEmbedding create
   */
  export type ProductEmbeddingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductEmbedding
     */
    select?: ProductEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductEmbedding
     */
    omit?: ProductEmbeddingOmit<ExtArgs> | null
    /**
     * The data needed to create a ProductEmbedding.
     */
    data: XOR<ProductEmbeddingCreateInput, ProductEmbeddingUncheckedCreateInput>
  }

  /**
   * ProductEmbedding createMany
   */
  export type ProductEmbeddingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductEmbeddings.
     */
    data: ProductEmbeddingCreateManyInput | ProductEmbeddingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductEmbedding createManyAndReturn
   */
  export type ProductEmbeddingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductEmbedding
     */
    select?: ProductEmbeddingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductEmbedding
     */
    omit?: ProductEmbeddingOmit<ExtArgs> | null
    /**
     * The data used to create many ProductEmbeddings.
     */
    data: ProductEmbeddingCreateManyInput | ProductEmbeddingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductEmbedding update
   */
  export type ProductEmbeddingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductEmbedding
     */
    select?: ProductEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductEmbedding
     */
    omit?: ProductEmbeddingOmit<ExtArgs> | null
    /**
     * The data needed to update a ProductEmbedding.
     */
    data: XOR<ProductEmbeddingUpdateInput, ProductEmbeddingUncheckedUpdateInput>
    /**
     * Choose, which ProductEmbedding to update.
     */
    where: ProductEmbeddingWhereUniqueInput
  }

  /**
   * ProductEmbedding updateMany
   */
  export type ProductEmbeddingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductEmbeddings.
     */
    data: XOR<ProductEmbeddingUpdateManyMutationInput, ProductEmbeddingUncheckedUpdateManyInput>
    /**
     * Filter which ProductEmbeddings to update
     */
    where?: ProductEmbeddingWhereInput
    /**
     * Limit how many ProductEmbeddings to update.
     */
    limit?: number
  }

  /**
   * ProductEmbedding updateManyAndReturn
   */
  export type ProductEmbeddingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductEmbedding
     */
    select?: ProductEmbeddingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductEmbedding
     */
    omit?: ProductEmbeddingOmit<ExtArgs> | null
    /**
     * The data used to update ProductEmbeddings.
     */
    data: XOR<ProductEmbeddingUpdateManyMutationInput, ProductEmbeddingUncheckedUpdateManyInput>
    /**
     * Filter which ProductEmbeddings to update
     */
    where?: ProductEmbeddingWhereInput
    /**
     * Limit how many ProductEmbeddings to update.
     */
    limit?: number
  }

  /**
   * ProductEmbedding upsert
   */
  export type ProductEmbeddingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductEmbedding
     */
    select?: ProductEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductEmbedding
     */
    omit?: ProductEmbeddingOmit<ExtArgs> | null
    /**
     * The filter to search for the ProductEmbedding to update in case it exists.
     */
    where: ProductEmbeddingWhereUniqueInput
    /**
     * In case the ProductEmbedding found by the `where` argument doesn't exist, create a new ProductEmbedding with this data.
     */
    create: XOR<ProductEmbeddingCreateInput, ProductEmbeddingUncheckedCreateInput>
    /**
     * In case the ProductEmbedding was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductEmbeddingUpdateInput, ProductEmbeddingUncheckedUpdateInput>
  }

  /**
   * ProductEmbedding delete
   */
  export type ProductEmbeddingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductEmbedding
     */
    select?: ProductEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductEmbedding
     */
    omit?: ProductEmbeddingOmit<ExtArgs> | null
    /**
     * Filter which ProductEmbedding to delete.
     */
    where: ProductEmbeddingWhereUniqueInput
  }

  /**
   * ProductEmbedding deleteMany
   */
  export type ProductEmbeddingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductEmbeddings to delete
     */
    where?: ProductEmbeddingWhereInput
    /**
     * Limit how many ProductEmbeddings to delete.
     */
    limit?: number
  }

  /**
   * ProductEmbedding without action
   */
  export type ProductEmbeddingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductEmbedding
     */
    select?: ProductEmbeddingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductEmbedding
     */
    omit?: ProductEmbeddingOmit<ExtArgs> | null
  }


  /**
   * Model CustomerBehavior
   */

  export type AggregateCustomerBehavior = {
    _count: CustomerBehaviorCountAggregateOutputType | null
    _avg: CustomerBehaviorAvgAggregateOutputType | null
    _sum: CustomerBehaviorSumAggregateOutputType | null
    _min: CustomerBehaviorMinAggregateOutputType | null
    _max: CustomerBehaviorMaxAggregateOutputType | null
  }

  export type CustomerBehaviorAvgAggregateOutputType = {
    duration: number | null
  }

  export type CustomerBehaviorSumAggregateOutputType = {
    duration: number | null
  }

  export type CustomerBehaviorMinAggregateOutputType = {
    id: string | null
    customerId: string | null
    eventType: string | null
    productId: string | null
    category: string | null
    sessionId: string | null
    duration: number | null
    createdAt: Date | null
  }

  export type CustomerBehaviorMaxAggregateOutputType = {
    id: string | null
    customerId: string | null
    eventType: string | null
    productId: string | null
    category: string | null
    sessionId: string | null
    duration: number | null
    createdAt: Date | null
  }

  export type CustomerBehaviorCountAggregateOutputType = {
    id: number
    customerId: number
    eventType: number
    productId: number
    category: number
    sessionId: number
    duration: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type CustomerBehaviorAvgAggregateInputType = {
    duration?: true
  }

  export type CustomerBehaviorSumAggregateInputType = {
    duration?: true
  }

  export type CustomerBehaviorMinAggregateInputType = {
    id?: true
    customerId?: true
    eventType?: true
    productId?: true
    category?: true
    sessionId?: true
    duration?: true
    createdAt?: true
  }

  export type CustomerBehaviorMaxAggregateInputType = {
    id?: true
    customerId?: true
    eventType?: true
    productId?: true
    category?: true
    sessionId?: true
    duration?: true
    createdAt?: true
  }

  export type CustomerBehaviorCountAggregateInputType = {
    id?: true
    customerId?: true
    eventType?: true
    productId?: true
    category?: true
    sessionId?: true
    duration?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type CustomerBehaviorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomerBehavior to aggregate.
     */
    where?: CustomerBehaviorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerBehaviors to fetch.
     */
    orderBy?: CustomerBehaviorOrderByWithRelationInput | CustomerBehaviorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerBehaviorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerBehaviors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerBehaviors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CustomerBehaviors
    **/
    _count?: true | CustomerBehaviorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomerBehaviorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomerBehaviorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerBehaviorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerBehaviorMaxAggregateInputType
  }

  export type GetCustomerBehaviorAggregateType<T extends CustomerBehaviorAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomerBehavior]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomerBehavior[P]>
      : GetScalarType<T[P], AggregateCustomerBehavior[P]>
  }




  export type CustomerBehaviorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerBehaviorWhereInput
    orderBy?: CustomerBehaviorOrderByWithAggregationInput | CustomerBehaviorOrderByWithAggregationInput[]
    by: CustomerBehaviorScalarFieldEnum[] | CustomerBehaviorScalarFieldEnum
    having?: CustomerBehaviorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerBehaviorCountAggregateInputType | true
    _avg?: CustomerBehaviorAvgAggregateInputType
    _sum?: CustomerBehaviorSumAggregateInputType
    _min?: CustomerBehaviorMinAggregateInputType
    _max?: CustomerBehaviorMaxAggregateInputType
  }

  export type CustomerBehaviorGroupByOutputType = {
    id: string
    customerId: string
    eventType: string
    productId: string
    category: string
    sessionId: string
    duration: number
    metadata: JsonValue
    createdAt: Date
    _count: CustomerBehaviorCountAggregateOutputType | null
    _avg: CustomerBehaviorAvgAggregateOutputType | null
    _sum: CustomerBehaviorSumAggregateOutputType | null
    _min: CustomerBehaviorMinAggregateOutputType | null
    _max: CustomerBehaviorMaxAggregateOutputType | null
  }

  type GetCustomerBehaviorGroupByPayload<T extends CustomerBehaviorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerBehaviorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerBehaviorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerBehaviorGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerBehaviorGroupByOutputType[P]>
        }
      >
    >


  export type CustomerBehaviorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    eventType?: boolean
    productId?: boolean
    category?: boolean
    sessionId?: boolean
    duration?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["customerBehavior"]>

  export type CustomerBehaviorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    eventType?: boolean
    productId?: boolean
    category?: boolean
    sessionId?: boolean
    duration?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["customerBehavior"]>

  export type CustomerBehaviorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    eventType?: boolean
    productId?: boolean
    category?: boolean
    sessionId?: boolean
    duration?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["customerBehavior"]>

  export type CustomerBehaviorSelectScalar = {
    id?: boolean
    customerId?: boolean
    eventType?: boolean
    productId?: boolean
    category?: boolean
    sessionId?: boolean
    duration?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type CustomerBehaviorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "customerId" | "eventType" | "productId" | "category" | "sessionId" | "duration" | "metadata" | "createdAt", ExtArgs["result"]["customerBehavior"]>

  export type $CustomerBehaviorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CustomerBehavior"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      customerId: string
      eventType: string
      productId: string
      category: string
      sessionId: string
      duration: number
      metadata: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["customerBehavior"]>
    composites: {}
  }

  type CustomerBehaviorGetPayload<S extends boolean | null | undefined | CustomerBehaviorDefaultArgs> = $Result.GetResult<Prisma.$CustomerBehaviorPayload, S>

  type CustomerBehaviorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CustomerBehaviorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomerBehaviorCountAggregateInputType | true
    }

  export interface CustomerBehaviorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CustomerBehavior'], meta: { name: 'CustomerBehavior' } }
    /**
     * Find zero or one CustomerBehavior that matches the filter.
     * @param {CustomerBehaviorFindUniqueArgs} args - Arguments to find a CustomerBehavior
     * @example
     * // Get one CustomerBehavior
     * const customerBehavior = await prisma.customerBehavior.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerBehaviorFindUniqueArgs>(args: SelectSubset<T, CustomerBehaviorFindUniqueArgs<ExtArgs>>): Prisma__CustomerBehaviorClient<$Result.GetResult<Prisma.$CustomerBehaviorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CustomerBehavior that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CustomerBehaviorFindUniqueOrThrowArgs} args - Arguments to find a CustomerBehavior
     * @example
     * // Get one CustomerBehavior
     * const customerBehavior = await prisma.customerBehavior.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerBehaviorFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerBehaviorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerBehaviorClient<$Result.GetResult<Prisma.$CustomerBehaviorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomerBehavior that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerBehaviorFindFirstArgs} args - Arguments to find a CustomerBehavior
     * @example
     * // Get one CustomerBehavior
     * const customerBehavior = await prisma.customerBehavior.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerBehaviorFindFirstArgs>(args?: SelectSubset<T, CustomerBehaviorFindFirstArgs<ExtArgs>>): Prisma__CustomerBehaviorClient<$Result.GetResult<Prisma.$CustomerBehaviorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomerBehavior that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerBehaviorFindFirstOrThrowArgs} args - Arguments to find a CustomerBehavior
     * @example
     * // Get one CustomerBehavior
     * const customerBehavior = await prisma.customerBehavior.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerBehaviorFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerBehaviorFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerBehaviorClient<$Result.GetResult<Prisma.$CustomerBehaviorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CustomerBehaviors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerBehaviorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CustomerBehaviors
     * const customerBehaviors = await prisma.customerBehavior.findMany()
     * 
     * // Get first 10 CustomerBehaviors
     * const customerBehaviors = await prisma.customerBehavior.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerBehaviorWithIdOnly = await prisma.customerBehavior.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerBehaviorFindManyArgs>(args?: SelectSubset<T, CustomerBehaviorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerBehaviorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CustomerBehavior.
     * @param {CustomerBehaviorCreateArgs} args - Arguments to create a CustomerBehavior.
     * @example
     * // Create one CustomerBehavior
     * const CustomerBehavior = await prisma.customerBehavior.create({
     *   data: {
     *     // ... data to create a CustomerBehavior
     *   }
     * })
     * 
     */
    create<T extends CustomerBehaviorCreateArgs>(args: SelectSubset<T, CustomerBehaviorCreateArgs<ExtArgs>>): Prisma__CustomerBehaviorClient<$Result.GetResult<Prisma.$CustomerBehaviorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CustomerBehaviors.
     * @param {CustomerBehaviorCreateManyArgs} args - Arguments to create many CustomerBehaviors.
     * @example
     * // Create many CustomerBehaviors
     * const customerBehavior = await prisma.customerBehavior.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerBehaviorCreateManyArgs>(args?: SelectSubset<T, CustomerBehaviorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CustomerBehaviors and returns the data saved in the database.
     * @param {CustomerBehaviorCreateManyAndReturnArgs} args - Arguments to create many CustomerBehaviors.
     * @example
     * // Create many CustomerBehaviors
     * const customerBehavior = await prisma.customerBehavior.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CustomerBehaviors and only return the `id`
     * const customerBehaviorWithIdOnly = await prisma.customerBehavior.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomerBehaviorCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomerBehaviorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerBehaviorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CustomerBehavior.
     * @param {CustomerBehaviorDeleteArgs} args - Arguments to delete one CustomerBehavior.
     * @example
     * // Delete one CustomerBehavior
     * const CustomerBehavior = await prisma.customerBehavior.delete({
     *   where: {
     *     // ... filter to delete one CustomerBehavior
     *   }
     * })
     * 
     */
    delete<T extends CustomerBehaviorDeleteArgs>(args: SelectSubset<T, CustomerBehaviorDeleteArgs<ExtArgs>>): Prisma__CustomerBehaviorClient<$Result.GetResult<Prisma.$CustomerBehaviorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CustomerBehavior.
     * @param {CustomerBehaviorUpdateArgs} args - Arguments to update one CustomerBehavior.
     * @example
     * // Update one CustomerBehavior
     * const customerBehavior = await prisma.customerBehavior.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerBehaviorUpdateArgs>(args: SelectSubset<T, CustomerBehaviorUpdateArgs<ExtArgs>>): Prisma__CustomerBehaviorClient<$Result.GetResult<Prisma.$CustomerBehaviorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CustomerBehaviors.
     * @param {CustomerBehaviorDeleteManyArgs} args - Arguments to filter CustomerBehaviors to delete.
     * @example
     * // Delete a few CustomerBehaviors
     * const { count } = await prisma.customerBehavior.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerBehaviorDeleteManyArgs>(args?: SelectSubset<T, CustomerBehaviorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomerBehaviors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerBehaviorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CustomerBehaviors
     * const customerBehavior = await prisma.customerBehavior.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerBehaviorUpdateManyArgs>(args: SelectSubset<T, CustomerBehaviorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomerBehaviors and returns the data updated in the database.
     * @param {CustomerBehaviorUpdateManyAndReturnArgs} args - Arguments to update many CustomerBehaviors.
     * @example
     * // Update many CustomerBehaviors
     * const customerBehavior = await prisma.customerBehavior.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CustomerBehaviors and only return the `id`
     * const customerBehaviorWithIdOnly = await prisma.customerBehavior.updateManyAndReturn({
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
    updateManyAndReturn<T extends CustomerBehaviorUpdateManyAndReturnArgs>(args: SelectSubset<T, CustomerBehaviorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerBehaviorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CustomerBehavior.
     * @param {CustomerBehaviorUpsertArgs} args - Arguments to update or create a CustomerBehavior.
     * @example
     * // Update or create a CustomerBehavior
     * const customerBehavior = await prisma.customerBehavior.upsert({
     *   create: {
     *     // ... data to create a CustomerBehavior
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CustomerBehavior we want to update
     *   }
     * })
     */
    upsert<T extends CustomerBehaviorUpsertArgs>(args: SelectSubset<T, CustomerBehaviorUpsertArgs<ExtArgs>>): Prisma__CustomerBehaviorClient<$Result.GetResult<Prisma.$CustomerBehaviorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CustomerBehaviors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerBehaviorCountArgs} args - Arguments to filter CustomerBehaviors to count.
     * @example
     * // Count the number of CustomerBehaviors
     * const count = await prisma.customerBehavior.count({
     *   where: {
     *     // ... the filter for the CustomerBehaviors we want to count
     *   }
     * })
    **/
    count<T extends CustomerBehaviorCountArgs>(
      args?: Subset<T, CustomerBehaviorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerBehaviorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CustomerBehavior.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerBehaviorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CustomerBehaviorAggregateArgs>(args: Subset<T, CustomerBehaviorAggregateArgs>): Prisma.PrismaPromise<GetCustomerBehaviorAggregateType<T>>

    /**
     * Group by CustomerBehavior.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerBehaviorGroupByArgs} args - Group by arguments.
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
      T extends CustomerBehaviorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerBehaviorGroupByArgs['orderBy'] }
        : { orderBy?: CustomerBehaviorGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CustomerBehaviorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerBehaviorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CustomerBehavior model
   */
  readonly fields: CustomerBehaviorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CustomerBehavior.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerBehaviorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the CustomerBehavior model
   */
  interface CustomerBehaviorFieldRefs {
    readonly id: FieldRef<"CustomerBehavior", 'String'>
    readonly customerId: FieldRef<"CustomerBehavior", 'String'>
    readonly eventType: FieldRef<"CustomerBehavior", 'String'>
    readonly productId: FieldRef<"CustomerBehavior", 'String'>
    readonly category: FieldRef<"CustomerBehavior", 'String'>
    readonly sessionId: FieldRef<"CustomerBehavior", 'String'>
    readonly duration: FieldRef<"CustomerBehavior", 'Int'>
    readonly metadata: FieldRef<"CustomerBehavior", 'Json'>
    readonly createdAt: FieldRef<"CustomerBehavior", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CustomerBehavior findUnique
   */
  export type CustomerBehaviorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerBehavior
     */
    select?: CustomerBehaviorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerBehavior
     */
    omit?: CustomerBehaviorOmit<ExtArgs> | null
    /**
     * Filter, which CustomerBehavior to fetch.
     */
    where: CustomerBehaviorWhereUniqueInput
  }

  /**
   * CustomerBehavior findUniqueOrThrow
   */
  export type CustomerBehaviorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerBehavior
     */
    select?: CustomerBehaviorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerBehavior
     */
    omit?: CustomerBehaviorOmit<ExtArgs> | null
    /**
     * Filter, which CustomerBehavior to fetch.
     */
    where: CustomerBehaviorWhereUniqueInput
  }

  /**
   * CustomerBehavior findFirst
   */
  export type CustomerBehaviorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerBehavior
     */
    select?: CustomerBehaviorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerBehavior
     */
    omit?: CustomerBehaviorOmit<ExtArgs> | null
    /**
     * Filter, which CustomerBehavior to fetch.
     */
    where?: CustomerBehaviorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerBehaviors to fetch.
     */
    orderBy?: CustomerBehaviorOrderByWithRelationInput | CustomerBehaviorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomerBehaviors.
     */
    cursor?: CustomerBehaviorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerBehaviors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerBehaviors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerBehaviors.
     */
    distinct?: CustomerBehaviorScalarFieldEnum | CustomerBehaviorScalarFieldEnum[]
  }

  /**
   * CustomerBehavior findFirstOrThrow
   */
  export type CustomerBehaviorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerBehavior
     */
    select?: CustomerBehaviorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerBehavior
     */
    omit?: CustomerBehaviorOmit<ExtArgs> | null
    /**
     * Filter, which CustomerBehavior to fetch.
     */
    where?: CustomerBehaviorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerBehaviors to fetch.
     */
    orderBy?: CustomerBehaviorOrderByWithRelationInput | CustomerBehaviorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomerBehaviors.
     */
    cursor?: CustomerBehaviorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerBehaviors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerBehaviors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerBehaviors.
     */
    distinct?: CustomerBehaviorScalarFieldEnum | CustomerBehaviorScalarFieldEnum[]
  }

  /**
   * CustomerBehavior findMany
   */
  export type CustomerBehaviorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerBehavior
     */
    select?: CustomerBehaviorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerBehavior
     */
    omit?: CustomerBehaviorOmit<ExtArgs> | null
    /**
     * Filter, which CustomerBehaviors to fetch.
     */
    where?: CustomerBehaviorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerBehaviors to fetch.
     */
    orderBy?: CustomerBehaviorOrderByWithRelationInput | CustomerBehaviorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CustomerBehaviors.
     */
    cursor?: CustomerBehaviorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerBehaviors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerBehaviors.
     */
    skip?: number
    distinct?: CustomerBehaviorScalarFieldEnum | CustomerBehaviorScalarFieldEnum[]
  }

  /**
   * CustomerBehavior create
   */
  export type CustomerBehaviorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerBehavior
     */
    select?: CustomerBehaviorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerBehavior
     */
    omit?: CustomerBehaviorOmit<ExtArgs> | null
    /**
     * The data needed to create a CustomerBehavior.
     */
    data: XOR<CustomerBehaviorCreateInput, CustomerBehaviorUncheckedCreateInput>
  }

  /**
   * CustomerBehavior createMany
   */
  export type CustomerBehaviorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CustomerBehaviors.
     */
    data: CustomerBehaviorCreateManyInput | CustomerBehaviorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CustomerBehavior createManyAndReturn
   */
  export type CustomerBehaviorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerBehavior
     */
    select?: CustomerBehaviorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerBehavior
     */
    omit?: CustomerBehaviorOmit<ExtArgs> | null
    /**
     * The data used to create many CustomerBehaviors.
     */
    data: CustomerBehaviorCreateManyInput | CustomerBehaviorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CustomerBehavior update
   */
  export type CustomerBehaviorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerBehavior
     */
    select?: CustomerBehaviorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerBehavior
     */
    omit?: CustomerBehaviorOmit<ExtArgs> | null
    /**
     * The data needed to update a CustomerBehavior.
     */
    data: XOR<CustomerBehaviorUpdateInput, CustomerBehaviorUncheckedUpdateInput>
    /**
     * Choose, which CustomerBehavior to update.
     */
    where: CustomerBehaviorWhereUniqueInput
  }

  /**
   * CustomerBehavior updateMany
   */
  export type CustomerBehaviorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CustomerBehaviors.
     */
    data: XOR<CustomerBehaviorUpdateManyMutationInput, CustomerBehaviorUncheckedUpdateManyInput>
    /**
     * Filter which CustomerBehaviors to update
     */
    where?: CustomerBehaviorWhereInput
    /**
     * Limit how many CustomerBehaviors to update.
     */
    limit?: number
  }

  /**
   * CustomerBehavior updateManyAndReturn
   */
  export type CustomerBehaviorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerBehavior
     */
    select?: CustomerBehaviorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerBehavior
     */
    omit?: CustomerBehaviorOmit<ExtArgs> | null
    /**
     * The data used to update CustomerBehaviors.
     */
    data: XOR<CustomerBehaviorUpdateManyMutationInput, CustomerBehaviorUncheckedUpdateManyInput>
    /**
     * Filter which CustomerBehaviors to update
     */
    where?: CustomerBehaviorWhereInput
    /**
     * Limit how many CustomerBehaviors to update.
     */
    limit?: number
  }

  /**
   * CustomerBehavior upsert
   */
  export type CustomerBehaviorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerBehavior
     */
    select?: CustomerBehaviorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerBehavior
     */
    omit?: CustomerBehaviorOmit<ExtArgs> | null
    /**
     * The filter to search for the CustomerBehavior to update in case it exists.
     */
    where: CustomerBehaviorWhereUniqueInput
    /**
     * In case the CustomerBehavior found by the `where` argument doesn't exist, create a new CustomerBehavior with this data.
     */
    create: XOR<CustomerBehaviorCreateInput, CustomerBehaviorUncheckedCreateInput>
    /**
     * In case the CustomerBehavior was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerBehaviorUpdateInput, CustomerBehaviorUncheckedUpdateInput>
  }

  /**
   * CustomerBehavior delete
   */
  export type CustomerBehaviorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerBehavior
     */
    select?: CustomerBehaviorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerBehavior
     */
    omit?: CustomerBehaviorOmit<ExtArgs> | null
    /**
     * Filter which CustomerBehavior to delete.
     */
    where: CustomerBehaviorWhereUniqueInput
  }

  /**
   * CustomerBehavior deleteMany
   */
  export type CustomerBehaviorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomerBehaviors to delete
     */
    where?: CustomerBehaviorWhereInput
    /**
     * Limit how many CustomerBehaviors to delete.
     */
    limit?: number
  }

  /**
   * CustomerBehavior without action
   */
  export type CustomerBehaviorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerBehavior
     */
    select?: CustomerBehaviorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerBehavior
     */
    omit?: CustomerBehaviorOmit<ExtArgs> | null
  }


  /**
   * Model ChurnPrediction
   */

  export type AggregateChurnPrediction = {
    _count: ChurnPredictionCountAggregateOutputType | null
    _avg: ChurnPredictionAvgAggregateOutputType | null
    _sum: ChurnPredictionSumAggregateOutputType | null
    _min: ChurnPredictionMinAggregateOutputType | null
    _max: ChurnPredictionMaxAggregateOutputType | null
  }

  export type ChurnPredictionAvgAggregateOutputType = {
    churnScore: number | null
  }

  export type ChurnPredictionSumAggregateOutputType = {
    churnScore: number | null
  }

  export type ChurnPredictionMinAggregateOutputType = {
    id: string | null
    customerId: string | null
    churnScore: number | null
    lastUpdated: Date | null
    nextReviewDate: Date | null
  }

  export type ChurnPredictionMaxAggregateOutputType = {
    id: string | null
    customerId: string | null
    churnScore: number | null
    lastUpdated: Date | null
    nextReviewDate: Date | null
  }

  export type ChurnPredictionCountAggregateOutputType = {
    id: number
    customerId: number
    churnScore: number
    riskFactors: number
    lastUpdated: number
    nextReviewDate: number
    _all: number
  }


  export type ChurnPredictionAvgAggregateInputType = {
    churnScore?: true
  }

  export type ChurnPredictionSumAggregateInputType = {
    churnScore?: true
  }

  export type ChurnPredictionMinAggregateInputType = {
    id?: true
    customerId?: true
    churnScore?: true
    lastUpdated?: true
    nextReviewDate?: true
  }

  export type ChurnPredictionMaxAggregateInputType = {
    id?: true
    customerId?: true
    churnScore?: true
    lastUpdated?: true
    nextReviewDate?: true
  }

  export type ChurnPredictionCountAggregateInputType = {
    id?: true
    customerId?: true
    churnScore?: true
    riskFactors?: true
    lastUpdated?: true
    nextReviewDate?: true
    _all?: true
  }

  export type ChurnPredictionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChurnPrediction to aggregate.
     */
    where?: ChurnPredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChurnPredictions to fetch.
     */
    orderBy?: ChurnPredictionOrderByWithRelationInput | ChurnPredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChurnPredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChurnPredictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChurnPredictions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChurnPredictions
    **/
    _count?: true | ChurnPredictionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChurnPredictionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChurnPredictionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChurnPredictionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChurnPredictionMaxAggregateInputType
  }

  export type GetChurnPredictionAggregateType<T extends ChurnPredictionAggregateArgs> = {
        [P in keyof T & keyof AggregateChurnPrediction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChurnPrediction[P]>
      : GetScalarType<T[P], AggregateChurnPrediction[P]>
  }




  export type ChurnPredictionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChurnPredictionWhereInput
    orderBy?: ChurnPredictionOrderByWithAggregationInput | ChurnPredictionOrderByWithAggregationInput[]
    by: ChurnPredictionScalarFieldEnum[] | ChurnPredictionScalarFieldEnum
    having?: ChurnPredictionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChurnPredictionCountAggregateInputType | true
    _avg?: ChurnPredictionAvgAggregateInputType
    _sum?: ChurnPredictionSumAggregateInputType
    _min?: ChurnPredictionMinAggregateInputType
    _max?: ChurnPredictionMaxAggregateInputType
  }

  export type ChurnPredictionGroupByOutputType = {
    id: string
    customerId: string
    churnScore: number
    riskFactors: string[]
    lastUpdated: Date
    nextReviewDate: Date
    _count: ChurnPredictionCountAggregateOutputType | null
    _avg: ChurnPredictionAvgAggregateOutputType | null
    _sum: ChurnPredictionSumAggregateOutputType | null
    _min: ChurnPredictionMinAggregateOutputType | null
    _max: ChurnPredictionMaxAggregateOutputType | null
  }

  type GetChurnPredictionGroupByPayload<T extends ChurnPredictionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChurnPredictionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChurnPredictionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChurnPredictionGroupByOutputType[P]>
            : GetScalarType<T[P], ChurnPredictionGroupByOutputType[P]>
        }
      >
    >


  export type ChurnPredictionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    churnScore?: boolean
    riskFactors?: boolean
    lastUpdated?: boolean
    nextReviewDate?: boolean
  }, ExtArgs["result"]["churnPrediction"]>

  export type ChurnPredictionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    churnScore?: boolean
    riskFactors?: boolean
    lastUpdated?: boolean
    nextReviewDate?: boolean
  }, ExtArgs["result"]["churnPrediction"]>

  export type ChurnPredictionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    churnScore?: boolean
    riskFactors?: boolean
    lastUpdated?: boolean
    nextReviewDate?: boolean
  }, ExtArgs["result"]["churnPrediction"]>

  export type ChurnPredictionSelectScalar = {
    id?: boolean
    customerId?: boolean
    churnScore?: boolean
    riskFactors?: boolean
    lastUpdated?: boolean
    nextReviewDate?: boolean
  }

  export type ChurnPredictionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "customerId" | "churnScore" | "riskFactors" | "lastUpdated" | "nextReviewDate", ExtArgs["result"]["churnPrediction"]>

  export type $ChurnPredictionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChurnPrediction"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      customerId: string
      churnScore: number
      riskFactors: string[]
      lastUpdated: Date
      nextReviewDate: Date
    }, ExtArgs["result"]["churnPrediction"]>
    composites: {}
  }

  type ChurnPredictionGetPayload<S extends boolean | null | undefined | ChurnPredictionDefaultArgs> = $Result.GetResult<Prisma.$ChurnPredictionPayload, S>

  type ChurnPredictionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChurnPredictionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChurnPredictionCountAggregateInputType | true
    }

  export interface ChurnPredictionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChurnPrediction'], meta: { name: 'ChurnPrediction' } }
    /**
     * Find zero or one ChurnPrediction that matches the filter.
     * @param {ChurnPredictionFindUniqueArgs} args - Arguments to find a ChurnPrediction
     * @example
     * // Get one ChurnPrediction
     * const churnPrediction = await prisma.churnPrediction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChurnPredictionFindUniqueArgs>(args: SelectSubset<T, ChurnPredictionFindUniqueArgs<ExtArgs>>): Prisma__ChurnPredictionClient<$Result.GetResult<Prisma.$ChurnPredictionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChurnPrediction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChurnPredictionFindUniqueOrThrowArgs} args - Arguments to find a ChurnPrediction
     * @example
     * // Get one ChurnPrediction
     * const churnPrediction = await prisma.churnPrediction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChurnPredictionFindUniqueOrThrowArgs>(args: SelectSubset<T, ChurnPredictionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChurnPredictionClient<$Result.GetResult<Prisma.$ChurnPredictionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChurnPrediction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChurnPredictionFindFirstArgs} args - Arguments to find a ChurnPrediction
     * @example
     * // Get one ChurnPrediction
     * const churnPrediction = await prisma.churnPrediction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChurnPredictionFindFirstArgs>(args?: SelectSubset<T, ChurnPredictionFindFirstArgs<ExtArgs>>): Prisma__ChurnPredictionClient<$Result.GetResult<Prisma.$ChurnPredictionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChurnPrediction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChurnPredictionFindFirstOrThrowArgs} args - Arguments to find a ChurnPrediction
     * @example
     * // Get one ChurnPrediction
     * const churnPrediction = await prisma.churnPrediction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChurnPredictionFindFirstOrThrowArgs>(args?: SelectSubset<T, ChurnPredictionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChurnPredictionClient<$Result.GetResult<Prisma.$ChurnPredictionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChurnPredictions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChurnPredictionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChurnPredictions
     * const churnPredictions = await prisma.churnPrediction.findMany()
     * 
     * // Get first 10 ChurnPredictions
     * const churnPredictions = await prisma.churnPrediction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const churnPredictionWithIdOnly = await prisma.churnPrediction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChurnPredictionFindManyArgs>(args?: SelectSubset<T, ChurnPredictionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChurnPredictionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChurnPrediction.
     * @param {ChurnPredictionCreateArgs} args - Arguments to create a ChurnPrediction.
     * @example
     * // Create one ChurnPrediction
     * const ChurnPrediction = await prisma.churnPrediction.create({
     *   data: {
     *     // ... data to create a ChurnPrediction
     *   }
     * })
     * 
     */
    create<T extends ChurnPredictionCreateArgs>(args: SelectSubset<T, ChurnPredictionCreateArgs<ExtArgs>>): Prisma__ChurnPredictionClient<$Result.GetResult<Prisma.$ChurnPredictionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChurnPredictions.
     * @param {ChurnPredictionCreateManyArgs} args - Arguments to create many ChurnPredictions.
     * @example
     * // Create many ChurnPredictions
     * const churnPrediction = await prisma.churnPrediction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChurnPredictionCreateManyArgs>(args?: SelectSubset<T, ChurnPredictionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChurnPredictions and returns the data saved in the database.
     * @param {ChurnPredictionCreateManyAndReturnArgs} args - Arguments to create many ChurnPredictions.
     * @example
     * // Create many ChurnPredictions
     * const churnPrediction = await prisma.churnPrediction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChurnPredictions and only return the `id`
     * const churnPredictionWithIdOnly = await prisma.churnPrediction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChurnPredictionCreateManyAndReturnArgs>(args?: SelectSubset<T, ChurnPredictionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChurnPredictionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChurnPrediction.
     * @param {ChurnPredictionDeleteArgs} args - Arguments to delete one ChurnPrediction.
     * @example
     * // Delete one ChurnPrediction
     * const ChurnPrediction = await prisma.churnPrediction.delete({
     *   where: {
     *     // ... filter to delete one ChurnPrediction
     *   }
     * })
     * 
     */
    delete<T extends ChurnPredictionDeleteArgs>(args: SelectSubset<T, ChurnPredictionDeleteArgs<ExtArgs>>): Prisma__ChurnPredictionClient<$Result.GetResult<Prisma.$ChurnPredictionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChurnPrediction.
     * @param {ChurnPredictionUpdateArgs} args - Arguments to update one ChurnPrediction.
     * @example
     * // Update one ChurnPrediction
     * const churnPrediction = await prisma.churnPrediction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChurnPredictionUpdateArgs>(args: SelectSubset<T, ChurnPredictionUpdateArgs<ExtArgs>>): Prisma__ChurnPredictionClient<$Result.GetResult<Prisma.$ChurnPredictionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChurnPredictions.
     * @param {ChurnPredictionDeleteManyArgs} args - Arguments to filter ChurnPredictions to delete.
     * @example
     * // Delete a few ChurnPredictions
     * const { count } = await prisma.churnPrediction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChurnPredictionDeleteManyArgs>(args?: SelectSubset<T, ChurnPredictionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChurnPredictions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChurnPredictionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChurnPredictions
     * const churnPrediction = await prisma.churnPrediction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChurnPredictionUpdateManyArgs>(args: SelectSubset<T, ChurnPredictionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChurnPredictions and returns the data updated in the database.
     * @param {ChurnPredictionUpdateManyAndReturnArgs} args - Arguments to update many ChurnPredictions.
     * @example
     * // Update many ChurnPredictions
     * const churnPrediction = await prisma.churnPrediction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChurnPredictions and only return the `id`
     * const churnPredictionWithIdOnly = await prisma.churnPrediction.updateManyAndReturn({
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
    updateManyAndReturn<T extends ChurnPredictionUpdateManyAndReturnArgs>(args: SelectSubset<T, ChurnPredictionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChurnPredictionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChurnPrediction.
     * @param {ChurnPredictionUpsertArgs} args - Arguments to update or create a ChurnPrediction.
     * @example
     * // Update or create a ChurnPrediction
     * const churnPrediction = await prisma.churnPrediction.upsert({
     *   create: {
     *     // ... data to create a ChurnPrediction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChurnPrediction we want to update
     *   }
     * })
     */
    upsert<T extends ChurnPredictionUpsertArgs>(args: SelectSubset<T, ChurnPredictionUpsertArgs<ExtArgs>>): Prisma__ChurnPredictionClient<$Result.GetResult<Prisma.$ChurnPredictionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChurnPredictions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChurnPredictionCountArgs} args - Arguments to filter ChurnPredictions to count.
     * @example
     * // Count the number of ChurnPredictions
     * const count = await prisma.churnPrediction.count({
     *   where: {
     *     // ... the filter for the ChurnPredictions we want to count
     *   }
     * })
    **/
    count<T extends ChurnPredictionCountArgs>(
      args?: Subset<T, ChurnPredictionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChurnPredictionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChurnPrediction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChurnPredictionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChurnPredictionAggregateArgs>(args: Subset<T, ChurnPredictionAggregateArgs>): Prisma.PrismaPromise<GetChurnPredictionAggregateType<T>>

    /**
     * Group by ChurnPrediction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChurnPredictionGroupByArgs} args - Group by arguments.
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
      T extends ChurnPredictionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChurnPredictionGroupByArgs['orderBy'] }
        : { orderBy?: ChurnPredictionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChurnPredictionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChurnPredictionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChurnPrediction model
   */
  readonly fields: ChurnPredictionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChurnPrediction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChurnPredictionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ChurnPrediction model
   */
  interface ChurnPredictionFieldRefs {
    readonly id: FieldRef<"ChurnPrediction", 'String'>
    readonly customerId: FieldRef<"ChurnPrediction", 'String'>
    readonly churnScore: FieldRef<"ChurnPrediction", 'Float'>
    readonly riskFactors: FieldRef<"ChurnPrediction", 'String[]'>
    readonly lastUpdated: FieldRef<"ChurnPrediction", 'DateTime'>
    readonly nextReviewDate: FieldRef<"ChurnPrediction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChurnPrediction findUnique
   */
  export type ChurnPredictionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChurnPrediction
     */
    select?: ChurnPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChurnPrediction
     */
    omit?: ChurnPredictionOmit<ExtArgs> | null
    /**
     * Filter, which ChurnPrediction to fetch.
     */
    where: ChurnPredictionWhereUniqueInput
  }

  /**
   * ChurnPrediction findUniqueOrThrow
   */
  export type ChurnPredictionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChurnPrediction
     */
    select?: ChurnPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChurnPrediction
     */
    omit?: ChurnPredictionOmit<ExtArgs> | null
    /**
     * Filter, which ChurnPrediction to fetch.
     */
    where: ChurnPredictionWhereUniqueInput
  }

  /**
   * ChurnPrediction findFirst
   */
  export type ChurnPredictionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChurnPrediction
     */
    select?: ChurnPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChurnPrediction
     */
    omit?: ChurnPredictionOmit<ExtArgs> | null
    /**
     * Filter, which ChurnPrediction to fetch.
     */
    where?: ChurnPredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChurnPredictions to fetch.
     */
    orderBy?: ChurnPredictionOrderByWithRelationInput | ChurnPredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChurnPredictions.
     */
    cursor?: ChurnPredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChurnPredictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChurnPredictions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChurnPredictions.
     */
    distinct?: ChurnPredictionScalarFieldEnum | ChurnPredictionScalarFieldEnum[]
  }

  /**
   * ChurnPrediction findFirstOrThrow
   */
  export type ChurnPredictionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChurnPrediction
     */
    select?: ChurnPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChurnPrediction
     */
    omit?: ChurnPredictionOmit<ExtArgs> | null
    /**
     * Filter, which ChurnPrediction to fetch.
     */
    where?: ChurnPredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChurnPredictions to fetch.
     */
    orderBy?: ChurnPredictionOrderByWithRelationInput | ChurnPredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChurnPredictions.
     */
    cursor?: ChurnPredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChurnPredictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChurnPredictions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChurnPredictions.
     */
    distinct?: ChurnPredictionScalarFieldEnum | ChurnPredictionScalarFieldEnum[]
  }

  /**
   * ChurnPrediction findMany
   */
  export type ChurnPredictionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChurnPrediction
     */
    select?: ChurnPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChurnPrediction
     */
    omit?: ChurnPredictionOmit<ExtArgs> | null
    /**
     * Filter, which ChurnPredictions to fetch.
     */
    where?: ChurnPredictionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChurnPredictions to fetch.
     */
    orderBy?: ChurnPredictionOrderByWithRelationInput | ChurnPredictionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChurnPredictions.
     */
    cursor?: ChurnPredictionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChurnPredictions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChurnPredictions.
     */
    skip?: number
    distinct?: ChurnPredictionScalarFieldEnum | ChurnPredictionScalarFieldEnum[]
  }

  /**
   * ChurnPrediction create
   */
  export type ChurnPredictionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChurnPrediction
     */
    select?: ChurnPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChurnPrediction
     */
    omit?: ChurnPredictionOmit<ExtArgs> | null
    /**
     * The data needed to create a ChurnPrediction.
     */
    data: XOR<ChurnPredictionCreateInput, ChurnPredictionUncheckedCreateInput>
  }

  /**
   * ChurnPrediction createMany
   */
  export type ChurnPredictionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChurnPredictions.
     */
    data: ChurnPredictionCreateManyInput | ChurnPredictionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChurnPrediction createManyAndReturn
   */
  export type ChurnPredictionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChurnPrediction
     */
    select?: ChurnPredictionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChurnPrediction
     */
    omit?: ChurnPredictionOmit<ExtArgs> | null
    /**
     * The data used to create many ChurnPredictions.
     */
    data: ChurnPredictionCreateManyInput | ChurnPredictionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChurnPrediction update
   */
  export type ChurnPredictionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChurnPrediction
     */
    select?: ChurnPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChurnPrediction
     */
    omit?: ChurnPredictionOmit<ExtArgs> | null
    /**
     * The data needed to update a ChurnPrediction.
     */
    data: XOR<ChurnPredictionUpdateInput, ChurnPredictionUncheckedUpdateInput>
    /**
     * Choose, which ChurnPrediction to update.
     */
    where: ChurnPredictionWhereUniqueInput
  }

  /**
   * ChurnPrediction updateMany
   */
  export type ChurnPredictionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChurnPredictions.
     */
    data: XOR<ChurnPredictionUpdateManyMutationInput, ChurnPredictionUncheckedUpdateManyInput>
    /**
     * Filter which ChurnPredictions to update
     */
    where?: ChurnPredictionWhereInput
    /**
     * Limit how many ChurnPredictions to update.
     */
    limit?: number
  }

  /**
   * ChurnPrediction updateManyAndReturn
   */
  export type ChurnPredictionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChurnPrediction
     */
    select?: ChurnPredictionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChurnPrediction
     */
    omit?: ChurnPredictionOmit<ExtArgs> | null
    /**
     * The data used to update ChurnPredictions.
     */
    data: XOR<ChurnPredictionUpdateManyMutationInput, ChurnPredictionUncheckedUpdateManyInput>
    /**
     * Filter which ChurnPredictions to update
     */
    where?: ChurnPredictionWhereInput
    /**
     * Limit how many ChurnPredictions to update.
     */
    limit?: number
  }

  /**
   * ChurnPrediction upsert
   */
  export type ChurnPredictionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChurnPrediction
     */
    select?: ChurnPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChurnPrediction
     */
    omit?: ChurnPredictionOmit<ExtArgs> | null
    /**
     * The filter to search for the ChurnPrediction to update in case it exists.
     */
    where: ChurnPredictionWhereUniqueInput
    /**
     * In case the ChurnPrediction found by the `where` argument doesn't exist, create a new ChurnPrediction with this data.
     */
    create: XOR<ChurnPredictionCreateInput, ChurnPredictionUncheckedCreateInput>
    /**
     * In case the ChurnPrediction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChurnPredictionUpdateInput, ChurnPredictionUncheckedUpdateInput>
  }

  /**
   * ChurnPrediction delete
   */
  export type ChurnPredictionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChurnPrediction
     */
    select?: ChurnPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChurnPrediction
     */
    omit?: ChurnPredictionOmit<ExtArgs> | null
    /**
     * Filter which ChurnPrediction to delete.
     */
    where: ChurnPredictionWhereUniqueInput
  }

  /**
   * ChurnPrediction deleteMany
   */
  export type ChurnPredictionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChurnPredictions to delete
     */
    where?: ChurnPredictionWhereInput
    /**
     * Limit how many ChurnPredictions to delete.
     */
    limit?: number
  }

  /**
   * ChurnPrediction without action
   */
  export type ChurnPredictionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChurnPrediction
     */
    select?: ChurnPredictionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChurnPrediction
     */
    omit?: ChurnPredictionOmit<ExtArgs> | null
  }


  /**
   * Model ProductRecommendation
   */

  export type AggregateProductRecommendation = {
    _count: ProductRecommendationCountAggregateOutputType | null
    _avg: ProductRecommendationAvgAggregateOutputType | null
    _sum: ProductRecommendationSumAggregateOutputType | null
    _min: ProductRecommendationMinAggregateOutputType | null
    _max: ProductRecommendationMaxAggregateOutputType | null
  }

  export type ProductRecommendationAvgAggregateOutputType = {
    score: number | null
  }

  export type ProductRecommendationSumAggregateOutputType = {
    score: number | null
  }

  export type ProductRecommendationMinAggregateOutputType = {
    id: string | null
    customerId: string | null
    productId: string | null
    score: number | null
    method: string | null
    clicked: boolean | null
    purchased: boolean | null
    createdAt: Date | null
  }

  export type ProductRecommendationMaxAggregateOutputType = {
    id: string | null
    customerId: string | null
    productId: string | null
    score: number | null
    method: string | null
    clicked: boolean | null
    purchased: boolean | null
    createdAt: Date | null
  }

  export type ProductRecommendationCountAggregateOutputType = {
    id: number
    customerId: number
    productId: number
    score: number
    method: number
    clicked: number
    purchased: number
    createdAt: number
    _all: number
  }


  export type ProductRecommendationAvgAggregateInputType = {
    score?: true
  }

  export type ProductRecommendationSumAggregateInputType = {
    score?: true
  }

  export type ProductRecommendationMinAggregateInputType = {
    id?: true
    customerId?: true
    productId?: true
    score?: true
    method?: true
    clicked?: true
    purchased?: true
    createdAt?: true
  }

  export type ProductRecommendationMaxAggregateInputType = {
    id?: true
    customerId?: true
    productId?: true
    score?: true
    method?: true
    clicked?: true
    purchased?: true
    createdAt?: true
  }

  export type ProductRecommendationCountAggregateInputType = {
    id?: true
    customerId?: true
    productId?: true
    score?: true
    method?: true
    clicked?: true
    purchased?: true
    createdAt?: true
    _all?: true
  }

  export type ProductRecommendationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductRecommendation to aggregate.
     */
    where?: ProductRecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductRecommendations to fetch.
     */
    orderBy?: ProductRecommendationOrderByWithRelationInput | ProductRecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductRecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductRecommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductRecommendations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductRecommendations
    **/
    _count?: true | ProductRecommendationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductRecommendationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductRecommendationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductRecommendationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductRecommendationMaxAggregateInputType
  }

  export type GetProductRecommendationAggregateType<T extends ProductRecommendationAggregateArgs> = {
        [P in keyof T & keyof AggregateProductRecommendation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductRecommendation[P]>
      : GetScalarType<T[P], AggregateProductRecommendation[P]>
  }




  export type ProductRecommendationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductRecommendationWhereInput
    orderBy?: ProductRecommendationOrderByWithAggregationInput | ProductRecommendationOrderByWithAggregationInput[]
    by: ProductRecommendationScalarFieldEnum[] | ProductRecommendationScalarFieldEnum
    having?: ProductRecommendationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductRecommendationCountAggregateInputType | true
    _avg?: ProductRecommendationAvgAggregateInputType
    _sum?: ProductRecommendationSumAggregateInputType
    _min?: ProductRecommendationMinAggregateInputType
    _max?: ProductRecommendationMaxAggregateInputType
  }

  export type ProductRecommendationGroupByOutputType = {
    id: string
    customerId: string
    productId: string
    score: number
    method: string
    clicked: boolean
    purchased: boolean
    createdAt: Date
    _count: ProductRecommendationCountAggregateOutputType | null
    _avg: ProductRecommendationAvgAggregateOutputType | null
    _sum: ProductRecommendationSumAggregateOutputType | null
    _min: ProductRecommendationMinAggregateOutputType | null
    _max: ProductRecommendationMaxAggregateOutputType | null
  }

  type GetProductRecommendationGroupByPayload<T extends ProductRecommendationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductRecommendationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductRecommendationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductRecommendationGroupByOutputType[P]>
            : GetScalarType<T[P], ProductRecommendationGroupByOutputType[P]>
        }
      >
    >


  export type ProductRecommendationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    productId?: boolean
    score?: boolean
    method?: boolean
    clicked?: boolean
    purchased?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["productRecommendation"]>

  export type ProductRecommendationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    productId?: boolean
    score?: boolean
    method?: boolean
    clicked?: boolean
    purchased?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["productRecommendation"]>

  export type ProductRecommendationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    productId?: boolean
    score?: boolean
    method?: boolean
    clicked?: boolean
    purchased?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["productRecommendation"]>

  export type ProductRecommendationSelectScalar = {
    id?: boolean
    customerId?: boolean
    productId?: boolean
    score?: boolean
    method?: boolean
    clicked?: boolean
    purchased?: boolean
    createdAt?: boolean
  }

  export type ProductRecommendationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "customerId" | "productId" | "score" | "method" | "clicked" | "purchased" | "createdAt", ExtArgs["result"]["productRecommendation"]>

  export type $ProductRecommendationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductRecommendation"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      customerId: string
      productId: string
      score: number
      method: string
      clicked: boolean
      purchased: boolean
      createdAt: Date
    }, ExtArgs["result"]["productRecommendation"]>
    composites: {}
  }

  type ProductRecommendationGetPayload<S extends boolean | null | undefined | ProductRecommendationDefaultArgs> = $Result.GetResult<Prisma.$ProductRecommendationPayload, S>

  type ProductRecommendationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductRecommendationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductRecommendationCountAggregateInputType | true
    }

  export interface ProductRecommendationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductRecommendation'], meta: { name: 'ProductRecommendation' } }
    /**
     * Find zero or one ProductRecommendation that matches the filter.
     * @param {ProductRecommendationFindUniqueArgs} args - Arguments to find a ProductRecommendation
     * @example
     * // Get one ProductRecommendation
     * const productRecommendation = await prisma.productRecommendation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductRecommendationFindUniqueArgs>(args: SelectSubset<T, ProductRecommendationFindUniqueArgs<ExtArgs>>): Prisma__ProductRecommendationClient<$Result.GetResult<Prisma.$ProductRecommendationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProductRecommendation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductRecommendationFindUniqueOrThrowArgs} args - Arguments to find a ProductRecommendation
     * @example
     * // Get one ProductRecommendation
     * const productRecommendation = await prisma.productRecommendation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductRecommendationFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductRecommendationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductRecommendationClient<$Result.GetResult<Prisma.$ProductRecommendationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductRecommendation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductRecommendationFindFirstArgs} args - Arguments to find a ProductRecommendation
     * @example
     * // Get one ProductRecommendation
     * const productRecommendation = await prisma.productRecommendation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductRecommendationFindFirstArgs>(args?: SelectSubset<T, ProductRecommendationFindFirstArgs<ExtArgs>>): Prisma__ProductRecommendationClient<$Result.GetResult<Prisma.$ProductRecommendationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductRecommendation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductRecommendationFindFirstOrThrowArgs} args - Arguments to find a ProductRecommendation
     * @example
     * // Get one ProductRecommendation
     * const productRecommendation = await prisma.productRecommendation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductRecommendationFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductRecommendationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductRecommendationClient<$Result.GetResult<Prisma.$ProductRecommendationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProductRecommendations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductRecommendationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductRecommendations
     * const productRecommendations = await prisma.productRecommendation.findMany()
     * 
     * // Get first 10 ProductRecommendations
     * const productRecommendations = await prisma.productRecommendation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productRecommendationWithIdOnly = await prisma.productRecommendation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductRecommendationFindManyArgs>(args?: SelectSubset<T, ProductRecommendationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductRecommendationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProductRecommendation.
     * @param {ProductRecommendationCreateArgs} args - Arguments to create a ProductRecommendation.
     * @example
     * // Create one ProductRecommendation
     * const ProductRecommendation = await prisma.productRecommendation.create({
     *   data: {
     *     // ... data to create a ProductRecommendation
     *   }
     * })
     * 
     */
    create<T extends ProductRecommendationCreateArgs>(args: SelectSubset<T, ProductRecommendationCreateArgs<ExtArgs>>): Prisma__ProductRecommendationClient<$Result.GetResult<Prisma.$ProductRecommendationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProductRecommendations.
     * @param {ProductRecommendationCreateManyArgs} args - Arguments to create many ProductRecommendations.
     * @example
     * // Create many ProductRecommendations
     * const productRecommendation = await prisma.productRecommendation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductRecommendationCreateManyArgs>(args?: SelectSubset<T, ProductRecommendationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProductRecommendations and returns the data saved in the database.
     * @param {ProductRecommendationCreateManyAndReturnArgs} args - Arguments to create many ProductRecommendations.
     * @example
     * // Create many ProductRecommendations
     * const productRecommendation = await prisma.productRecommendation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProductRecommendations and only return the `id`
     * const productRecommendationWithIdOnly = await prisma.productRecommendation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductRecommendationCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductRecommendationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductRecommendationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProductRecommendation.
     * @param {ProductRecommendationDeleteArgs} args - Arguments to delete one ProductRecommendation.
     * @example
     * // Delete one ProductRecommendation
     * const ProductRecommendation = await prisma.productRecommendation.delete({
     *   where: {
     *     // ... filter to delete one ProductRecommendation
     *   }
     * })
     * 
     */
    delete<T extends ProductRecommendationDeleteArgs>(args: SelectSubset<T, ProductRecommendationDeleteArgs<ExtArgs>>): Prisma__ProductRecommendationClient<$Result.GetResult<Prisma.$ProductRecommendationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProductRecommendation.
     * @param {ProductRecommendationUpdateArgs} args - Arguments to update one ProductRecommendation.
     * @example
     * // Update one ProductRecommendation
     * const productRecommendation = await prisma.productRecommendation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductRecommendationUpdateArgs>(args: SelectSubset<T, ProductRecommendationUpdateArgs<ExtArgs>>): Prisma__ProductRecommendationClient<$Result.GetResult<Prisma.$ProductRecommendationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProductRecommendations.
     * @param {ProductRecommendationDeleteManyArgs} args - Arguments to filter ProductRecommendations to delete.
     * @example
     * // Delete a few ProductRecommendations
     * const { count } = await prisma.productRecommendation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductRecommendationDeleteManyArgs>(args?: SelectSubset<T, ProductRecommendationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductRecommendations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductRecommendationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductRecommendations
     * const productRecommendation = await prisma.productRecommendation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductRecommendationUpdateManyArgs>(args: SelectSubset<T, ProductRecommendationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductRecommendations and returns the data updated in the database.
     * @param {ProductRecommendationUpdateManyAndReturnArgs} args - Arguments to update many ProductRecommendations.
     * @example
     * // Update many ProductRecommendations
     * const productRecommendation = await prisma.productRecommendation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProductRecommendations and only return the `id`
     * const productRecommendationWithIdOnly = await prisma.productRecommendation.updateManyAndReturn({
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
    updateManyAndReturn<T extends ProductRecommendationUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductRecommendationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductRecommendationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProductRecommendation.
     * @param {ProductRecommendationUpsertArgs} args - Arguments to update or create a ProductRecommendation.
     * @example
     * // Update or create a ProductRecommendation
     * const productRecommendation = await prisma.productRecommendation.upsert({
     *   create: {
     *     // ... data to create a ProductRecommendation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductRecommendation we want to update
     *   }
     * })
     */
    upsert<T extends ProductRecommendationUpsertArgs>(args: SelectSubset<T, ProductRecommendationUpsertArgs<ExtArgs>>): Prisma__ProductRecommendationClient<$Result.GetResult<Prisma.$ProductRecommendationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProductRecommendations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductRecommendationCountArgs} args - Arguments to filter ProductRecommendations to count.
     * @example
     * // Count the number of ProductRecommendations
     * const count = await prisma.productRecommendation.count({
     *   where: {
     *     // ... the filter for the ProductRecommendations we want to count
     *   }
     * })
    **/
    count<T extends ProductRecommendationCountArgs>(
      args?: Subset<T, ProductRecommendationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductRecommendationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductRecommendation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductRecommendationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProductRecommendationAggregateArgs>(args: Subset<T, ProductRecommendationAggregateArgs>): Prisma.PrismaPromise<GetProductRecommendationAggregateType<T>>

    /**
     * Group by ProductRecommendation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductRecommendationGroupByArgs} args - Group by arguments.
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
      T extends ProductRecommendationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductRecommendationGroupByArgs['orderBy'] }
        : { orderBy?: ProductRecommendationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProductRecommendationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductRecommendationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductRecommendation model
   */
  readonly fields: ProductRecommendationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductRecommendation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductRecommendationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ProductRecommendation model
   */
  interface ProductRecommendationFieldRefs {
    readonly id: FieldRef<"ProductRecommendation", 'String'>
    readonly customerId: FieldRef<"ProductRecommendation", 'String'>
    readonly productId: FieldRef<"ProductRecommendation", 'String'>
    readonly score: FieldRef<"ProductRecommendation", 'Float'>
    readonly method: FieldRef<"ProductRecommendation", 'String'>
    readonly clicked: FieldRef<"ProductRecommendation", 'Boolean'>
    readonly purchased: FieldRef<"ProductRecommendation", 'Boolean'>
    readonly createdAt: FieldRef<"ProductRecommendation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProductRecommendation findUnique
   */
  export type ProductRecommendationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductRecommendation
     */
    select?: ProductRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductRecommendation
     */
    omit?: ProductRecommendationOmit<ExtArgs> | null
    /**
     * Filter, which ProductRecommendation to fetch.
     */
    where: ProductRecommendationWhereUniqueInput
  }

  /**
   * ProductRecommendation findUniqueOrThrow
   */
  export type ProductRecommendationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductRecommendation
     */
    select?: ProductRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductRecommendation
     */
    omit?: ProductRecommendationOmit<ExtArgs> | null
    /**
     * Filter, which ProductRecommendation to fetch.
     */
    where: ProductRecommendationWhereUniqueInput
  }

  /**
   * ProductRecommendation findFirst
   */
  export type ProductRecommendationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductRecommendation
     */
    select?: ProductRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductRecommendation
     */
    omit?: ProductRecommendationOmit<ExtArgs> | null
    /**
     * Filter, which ProductRecommendation to fetch.
     */
    where?: ProductRecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductRecommendations to fetch.
     */
    orderBy?: ProductRecommendationOrderByWithRelationInput | ProductRecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductRecommendations.
     */
    cursor?: ProductRecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductRecommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductRecommendations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductRecommendations.
     */
    distinct?: ProductRecommendationScalarFieldEnum | ProductRecommendationScalarFieldEnum[]
  }

  /**
   * ProductRecommendation findFirstOrThrow
   */
  export type ProductRecommendationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductRecommendation
     */
    select?: ProductRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductRecommendation
     */
    omit?: ProductRecommendationOmit<ExtArgs> | null
    /**
     * Filter, which ProductRecommendation to fetch.
     */
    where?: ProductRecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductRecommendations to fetch.
     */
    orderBy?: ProductRecommendationOrderByWithRelationInput | ProductRecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductRecommendations.
     */
    cursor?: ProductRecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductRecommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductRecommendations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductRecommendations.
     */
    distinct?: ProductRecommendationScalarFieldEnum | ProductRecommendationScalarFieldEnum[]
  }

  /**
   * ProductRecommendation findMany
   */
  export type ProductRecommendationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductRecommendation
     */
    select?: ProductRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductRecommendation
     */
    omit?: ProductRecommendationOmit<ExtArgs> | null
    /**
     * Filter, which ProductRecommendations to fetch.
     */
    where?: ProductRecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductRecommendations to fetch.
     */
    orderBy?: ProductRecommendationOrderByWithRelationInput | ProductRecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductRecommendations.
     */
    cursor?: ProductRecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductRecommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductRecommendations.
     */
    skip?: number
    distinct?: ProductRecommendationScalarFieldEnum | ProductRecommendationScalarFieldEnum[]
  }

  /**
   * ProductRecommendation create
   */
  export type ProductRecommendationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductRecommendation
     */
    select?: ProductRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductRecommendation
     */
    omit?: ProductRecommendationOmit<ExtArgs> | null
    /**
     * The data needed to create a ProductRecommendation.
     */
    data: XOR<ProductRecommendationCreateInput, ProductRecommendationUncheckedCreateInput>
  }

  /**
   * ProductRecommendation createMany
   */
  export type ProductRecommendationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductRecommendations.
     */
    data: ProductRecommendationCreateManyInput | ProductRecommendationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductRecommendation createManyAndReturn
   */
  export type ProductRecommendationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductRecommendation
     */
    select?: ProductRecommendationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductRecommendation
     */
    omit?: ProductRecommendationOmit<ExtArgs> | null
    /**
     * The data used to create many ProductRecommendations.
     */
    data: ProductRecommendationCreateManyInput | ProductRecommendationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductRecommendation update
   */
  export type ProductRecommendationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductRecommendation
     */
    select?: ProductRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductRecommendation
     */
    omit?: ProductRecommendationOmit<ExtArgs> | null
    /**
     * The data needed to update a ProductRecommendation.
     */
    data: XOR<ProductRecommendationUpdateInput, ProductRecommendationUncheckedUpdateInput>
    /**
     * Choose, which ProductRecommendation to update.
     */
    where: ProductRecommendationWhereUniqueInput
  }

  /**
   * ProductRecommendation updateMany
   */
  export type ProductRecommendationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductRecommendations.
     */
    data: XOR<ProductRecommendationUpdateManyMutationInput, ProductRecommendationUncheckedUpdateManyInput>
    /**
     * Filter which ProductRecommendations to update
     */
    where?: ProductRecommendationWhereInput
    /**
     * Limit how many ProductRecommendations to update.
     */
    limit?: number
  }

  /**
   * ProductRecommendation updateManyAndReturn
   */
  export type ProductRecommendationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductRecommendation
     */
    select?: ProductRecommendationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductRecommendation
     */
    omit?: ProductRecommendationOmit<ExtArgs> | null
    /**
     * The data used to update ProductRecommendations.
     */
    data: XOR<ProductRecommendationUpdateManyMutationInput, ProductRecommendationUncheckedUpdateManyInput>
    /**
     * Filter which ProductRecommendations to update
     */
    where?: ProductRecommendationWhereInput
    /**
     * Limit how many ProductRecommendations to update.
     */
    limit?: number
  }

  /**
   * ProductRecommendation upsert
   */
  export type ProductRecommendationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductRecommendation
     */
    select?: ProductRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductRecommendation
     */
    omit?: ProductRecommendationOmit<ExtArgs> | null
    /**
     * The filter to search for the ProductRecommendation to update in case it exists.
     */
    where: ProductRecommendationWhereUniqueInput
    /**
     * In case the ProductRecommendation found by the `where` argument doesn't exist, create a new ProductRecommendation with this data.
     */
    create: XOR<ProductRecommendationCreateInput, ProductRecommendationUncheckedCreateInput>
    /**
     * In case the ProductRecommendation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductRecommendationUpdateInput, ProductRecommendationUncheckedUpdateInput>
  }

  /**
   * ProductRecommendation delete
   */
  export type ProductRecommendationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductRecommendation
     */
    select?: ProductRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductRecommendation
     */
    omit?: ProductRecommendationOmit<ExtArgs> | null
    /**
     * Filter which ProductRecommendation to delete.
     */
    where: ProductRecommendationWhereUniqueInput
  }

  /**
   * ProductRecommendation deleteMany
   */
  export type ProductRecommendationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductRecommendations to delete
     */
    where?: ProductRecommendationWhereInput
    /**
     * Limit how many ProductRecommendations to delete.
     */
    limit?: number
  }

  /**
   * ProductRecommendation without action
   */
  export type ProductRecommendationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductRecommendation
     */
    select?: ProductRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductRecommendation
     */
    omit?: ProductRecommendationOmit<ExtArgs> | null
  }


  /**
   * Model SentimentAnalysis
   */

  export type AggregateSentimentAnalysis = {
    _count: SentimentAnalysisCountAggregateOutputType | null
    _avg: SentimentAnalysisAvgAggregateOutputType | null
    _sum: SentimentAnalysisSumAggregateOutputType | null
    _min: SentimentAnalysisMinAggregateOutputType | null
    _max: SentimentAnalysisMaxAggregateOutputType | null
  }

  export type SentimentAnalysisAvgAggregateOutputType = {
    score: number | null
  }

  export type SentimentAnalysisSumAggregateOutputType = {
    score: number | null
  }

  export type SentimentAnalysisMinAggregateOutputType = {
    id: string | null
    productId: string | null
    customerId: string | null
    text: string | null
    sentiment: string | null
    score: number | null
    language: string | null
    model: string | null
    createdAt: Date | null
  }

  export type SentimentAnalysisMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    customerId: string | null
    text: string | null
    sentiment: string | null
    score: number | null
    language: string | null
    model: string | null
    createdAt: Date | null
  }

  export type SentimentAnalysisCountAggregateOutputType = {
    id: number
    productId: number
    customerId: number
    text: number
    sentiment: number
    score: number
    emotions: number
    language: number
    model: number
    createdAt: number
    _all: number
  }


  export type SentimentAnalysisAvgAggregateInputType = {
    score?: true
  }

  export type SentimentAnalysisSumAggregateInputType = {
    score?: true
  }

  export type SentimentAnalysisMinAggregateInputType = {
    id?: true
    productId?: true
    customerId?: true
    text?: true
    sentiment?: true
    score?: true
    language?: true
    model?: true
    createdAt?: true
  }

  export type SentimentAnalysisMaxAggregateInputType = {
    id?: true
    productId?: true
    customerId?: true
    text?: true
    sentiment?: true
    score?: true
    language?: true
    model?: true
    createdAt?: true
  }

  export type SentimentAnalysisCountAggregateInputType = {
    id?: true
    productId?: true
    customerId?: true
    text?: true
    sentiment?: true
    score?: true
    emotions?: true
    language?: true
    model?: true
    createdAt?: true
    _all?: true
  }

  export type SentimentAnalysisAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SentimentAnalysis to aggregate.
     */
    where?: SentimentAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SentimentAnalyses to fetch.
     */
    orderBy?: SentimentAnalysisOrderByWithRelationInput | SentimentAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SentimentAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SentimentAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SentimentAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SentimentAnalyses
    **/
    _count?: true | SentimentAnalysisCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SentimentAnalysisAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SentimentAnalysisSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SentimentAnalysisMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SentimentAnalysisMaxAggregateInputType
  }

  export type GetSentimentAnalysisAggregateType<T extends SentimentAnalysisAggregateArgs> = {
        [P in keyof T & keyof AggregateSentimentAnalysis]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSentimentAnalysis[P]>
      : GetScalarType<T[P], AggregateSentimentAnalysis[P]>
  }




  export type SentimentAnalysisGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SentimentAnalysisWhereInput
    orderBy?: SentimentAnalysisOrderByWithAggregationInput | SentimentAnalysisOrderByWithAggregationInput[]
    by: SentimentAnalysisScalarFieldEnum[] | SentimentAnalysisScalarFieldEnum
    having?: SentimentAnalysisScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SentimentAnalysisCountAggregateInputType | true
    _avg?: SentimentAnalysisAvgAggregateInputType
    _sum?: SentimentAnalysisSumAggregateInputType
    _min?: SentimentAnalysisMinAggregateInputType
    _max?: SentimentAnalysisMaxAggregateInputType
  }

  export type SentimentAnalysisGroupByOutputType = {
    id: string
    productId: string
    customerId: string
    text: string
    sentiment: string
    score: number
    emotions: string[]
    language: string
    model: string
    createdAt: Date
    _count: SentimentAnalysisCountAggregateOutputType | null
    _avg: SentimentAnalysisAvgAggregateOutputType | null
    _sum: SentimentAnalysisSumAggregateOutputType | null
    _min: SentimentAnalysisMinAggregateOutputType | null
    _max: SentimentAnalysisMaxAggregateOutputType | null
  }

  type GetSentimentAnalysisGroupByPayload<T extends SentimentAnalysisGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SentimentAnalysisGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SentimentAnalysisGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SentimentAnalysisGroupByOutputType[P]>
            : GetScalarType<T[P], SentimentAnalysisGroupByOutputType[P]>
        }
      >
    >


  export type SentimentAnalysisSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    customerId?: boolean
    text?: boolean
    sentiment?: boolean
    score?: boolean
    emotions?: boolean
    language?: boolean
    model?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["sentimentAnalysis"]>

  export type SentimentAnalysisSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    customerId?: boolean
    text?: boolean
    sentiment?: boolean
    score?: boolean
    emotions?: boolean
    language?: boolean
    model?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["sentimentAnalysis"]>

  export type SentimentAnalysisSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    customerId?: boolean
    text?: boolean
    sentiment?: boolean
    score?: boolean
    emotions?: boolean
    language?: boolean
    model?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["sentimentAnalysis"]>

  export type SentimentAnalysisSelectScalar = {
    id?: boolean
    productId?: boolean
    customerId?: boolean
    text?: boolean
    sentiment?: boolean
    score?: boolean
    emotions?: boolean
    language?: boolean
    model?: boolean
    createdAt?: boolean
  }

  export type SentimentAnalysisOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "customerId" | "text" | "sentiment" | "score" | "emotions" | "language" | "model" | "createdAt", ExtArgs["result"]["sentimentAnalysis"]>

  export type $SentimentAnalysisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SentimentAnalysis"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      customerId: string
      text: string
      sentiment: string
      score: number
      emotions: string[]
      language: string
      model: string
      createdAt: Date
    }, ExtArgs["result"]["sentimentAnalysis"]>
    composites: {}
  }

  type SentimentAnalysisGetPayload<S extends boolean | null | undefined | SentimentAnalysisDefaultArgs> = $Result.GetResult<Prisma.$SentimentAnalysisPayload, S>

  type SentimentAnalysisCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SentimentAnalysisFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SentimentAnalysisCountAggregateInputType | true
    }

  export interface SentimentAnalysisDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SentimentAnalysis'], meta: { name: 'SentimentAnalysis' } }
    /**
     * Find zero or one SentimentAnalysis that matches the filter.
     * @param {SentimentAnalysisFindUniqueArgs} args - Arguments to find a SentimentAnalysis
     * @example
     * // Get one SentimentAnalysis
     * const sentimentAnalysis = await prisma.sentimentAnalysis.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SentimentAnalysisFindUniqueArgs>(args: SelectSubset<T, SentimentAnalysisFindUniqueArgs<ExtArgs>>): Prisma__SentimentAnalysisClient<$Result.GetResult<Prisma.$SentimentAnalysisPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SentimentAnalysis that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SentimentAnalysisFindUniqueOrThrowArgs} args - Arguments to find a SentimentAnalysis
     * @example
     * // Get one SentimentAnalysis
     * const sentimentAnalysis = await prisma.sentimentAnalysis.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SentimentAnalysisFindUniqueOrThrowArgs>(args: SelectSubset<T, SentimentAnalysisFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SentimentAnalysisClient<$Result.GetResult<Prisma.$SentimentAnalysisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SentimentAnalysis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SentimentAnalysisFindFirstArgs} args - Arguments to find a SentimentAnalysis
     * @example
     * // Get one SentimentAnalysis
     * const sentimentAnalysis = await prisma.sentimentAnalysis.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SentimentAnalysisFindFirstArgs>(args?: SelectSubset<T, SentimentAnalysisFindFirstArgs<ExtArgs>>): Prisma__SentimentAnalysisClient<$Result.GetResult<Prisma.$SentimentAnalysisPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SentimentAnalysis that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SentimentAnalysisFindFirstOrThrowArgs} args - Arguments to find a SentimentAnalysis
     * @example
     * // Get one SentimentAnalysis
     * const sentimentAnalysis = await prisma.sentimentAnalysis.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SentimentAnalysisFindFirstOrThrowArgs>(args?: SelectSubset<T, SentimentAnalysisFindFirstOrThrowArgs<ExtArgs>>): Prisma__SentimentAnalysisClient<$Result.GetResult<Prisma.$SentimentAnalysisPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SentimentAnalyses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SentimentAnalysisFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SentimentAnalyses
     * const sentimentAnalyses = await prisma.sentimentAnalysis.findMany()
     * 
     * // Get first 10 SentimentAnalyses
     * const sentimentAnalyses = await prisma.sentimentAnalysis.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sentimentAnalysisWithIdOnly = await prisma.sentimentAnalysis.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SentimentAnalysisFindManyArgs>(args?: SelectSubset<T, SentimentAnalysisFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SentimentAnalysisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SentimentAnalysis.
     * @param {SentimentAnalysisCreateArgs} args - Arguments to create a SentimentAnalysis.
     * @example
     * // Create one SentimentAnalysis
     * const SentimentAnalysis = await prisma.sentimentAnalysis.create({
     *   data: {
     *     // ... data to create a SentimentAnalysis
     *   }
     * })
     * 
     */
    create<T extends SentimentAnalysisCreateArgs>(args: SelectSubset<T, SentimentAnalysisCreateArgs<ExtArgs>>): Prisma__SentimentAnalysisClient<$Result.GetResult<Prisma.$SentimentAnalysisPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SentimentAnalyses.
     * @param {SentimentAnalysisCreateManyArgs} args - Arguments to create many SentimentAnalyses.
     * @example
     * // Create many SentimentAnalyses
     * const sentimentAnalysis = await prisma.sentimentAnalysis.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SentimentAnalysisCreateManyArgs>(args?: SelectSubset<T, SentimentAnalysisCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SentimentAnalyses and returns the data saved in the database.
     * @param {SentimentAnalysisCreateManyAndReturnArgs} args - Arguments to create many SentimentAnalyses.
     * @example
     * // Create many SentimentAnalyses
     * const sentimentAnalysis = await prisma.sentimentAnalysis.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SentimentAnalyses and only return the `id`
     * const sentimentAnalysisWithIdOnly = await prisma.sentimentAnalysis.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SentimentAnalysisCreateManyAndReturnArgs>(args?: SelectSubset<T, SentimentAnalysisCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SentimentAnalysisPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SentimentAnalysis.
     * @param {SentimentAnalysisDeleteArgs} args - Arguments to delete one SentimentAnalysis.
     * @example
     * // Delete one SentimentAnalysis
     * const SentimentAnalysis = await prisma.sentimentAnalysis.delete({
     *   where: {
     *     // ... filter to delete one SentimentAnalysis
     *   }
     * })
     * 
     */
    delete<T extends SentimentAnalysisDeleteArgs>(args: SelectSubset<T, SentimentAnalysisDeleteArgs<ExtArgs>>): Prisma__SentimentAnalysisClient<$Result.GetResult<Prisma.$SentimentAnalysisPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SentimentAnalysis.
     * @param {SentimentAnalysisUpdateArgs} args - Arguments to update one SentimentAnalysis.
     * @example
     * // Update one SentimentAnalysis
     * const sentimentAnalysis = await prisma.sentimentAnalysis.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SentimentAnalysisUpdateArgs>(args: SelectSubset<T, SentimentAnalysisUpdateArgs<ExtArgs>>): Prisma__SentimentAnalysisClient<$Result.GetResult<Prisma.$SentimentAnalysisPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SentimentAnalyses.
     * @param {SentimentAnalysisDeleteManyArgs} args - Arguments to filter SentimentAnalyses to delete.
     * @example
     * // Delete a few SentimentAnalyses
     * const { count } = await prisma.sentimentAnalysis.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SentimentAnalysisDeleteManyArgs>(args?: SelectSubset<T, SentimentAnalysisDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SentimentAnalyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SentimentAnalysisUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SentimentAnalyses
     * const sentimentAnalysis = await prisma.sentimentAnalysis.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SentimentAnalysisUpdateManyArgs>(args: SelectSubset<T, SentimentAnalysisUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SentimentAnalyses and returns the data updated in the database.
     * @param {SentimentAnalysisUpdateManyAndReturnArgs} args - Arguments to update many SentimentAnalyses.
     * @example
     * // Update many SentimentAnalyses
     * const sentimentAnalysis = await prisma.sentimentAnalysis.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SentimentAnalyses and only return the `id`
     * const sentimentAnalysisWithIdOnly = await prisma.sentimentAnalysis.updateManyAndReturn({
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
    updateManyAndReturn<T extends SentimentAnalysisUpdateManyAndReturnArgs>(args: SelectSubset<T, SentimentAnalysisUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SentimentAnalysisPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SentimentAnalysis.
     * @param {SentimentAnalysisUpsertArgs} args - Arguments to update or create a SentimentAnalysis.
     * @example
     * // Update or create a SentimentAnalysis
     * const sentimentAnalysis = await prisma.sentimentAnalysis.upsert({
     *   create: {
     *     // ... data to create a SentimentAnalysis
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SentimentAnalysis we want to update
     *   }
     * })
     */
    upsert<T extends SentimentAnalysisUpsertArgs>(args: SelectSubset<T, SentimentAnalysisUpsertArgs<ExtArgs>>): Prisma__SentimentAnalysisClient<$Result.GetResult<Prisma.$SentimentAnalysisPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SentimentAnalyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SentimentAnalysisCountArgs} args - Arguments to filter SentimentAnalyses to count.
     * @example
     * // Count the number of SentimentAnalyses
     * const count = await prisma.sentimentAnalysis.count({
     *   where: {
     *     // ... the filter for the SentimentAnalyses we want to count
     *   }
     * })
    **/
    count<T extends SentimentAnalysisCountArgs>(
      args?: Subset<T, SentimentAnalysisCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SentimentAnalysisCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SentimentAnalysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SentimentAnalysisAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SentimentAnalysisAggregateArgs>(args: Subset<T, SentimentAnalysisAggregateArgs>): Prisma.PrismaPromise<GetSentimentAnalysisAggregateType<T>>

    /**
     * Group by SentimentAnalysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SentimentAnalysisGroupByArgs} args - Group by arguments.
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
      T extends SentimentAnalysisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SentimentAnalysisGroupByArgs['orderBy'] }
        : { orderBy?: SentimentAnalysisGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SentimentAnalysisGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSentimentAnalysisGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SentimentAnalysis model
   */
  readonly fields: SentimentAnalysisFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SentimentAnalysis.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SentimentAnalysisClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the SentimentAnalysis model
   */
  interface SentimentAnalysisFieldRefs {
    readonly id: FieldRef<"SentimentAnalysis", 'String'>
    readonly productId: FieldRef<"SentimentAnalysis", 'String'>
    readonly customerId: FieldRef<"SentimentAnalysis", 'String'>
    readonly text: FieldRef<"SentimentAnalysis", 'String'>
    readonly sentiment: FieldRef<"SentimentAnalysis", 'String'>
    readonly score: FieldRef<"SentimentAnalysis", 'Float'>
    readonly emotions: FieldRef<"SentimentAnalysis", 'String[]'>
    readonly language: FieldRef<"SentimentAnalysis", 'String'>
    readonly model: FieldRef<"SentimentAnalysis", 'String'>
    readonly createdAt: FieldRef<"SentimentAnalysis", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SentimentAnalysis findUnique
   */
  export type SentimentAnalysisFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SentimentAnalysis
     */
    select?: SentimentAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SentimentAnalysis
     */
    omit?: SentimentAnalysisOmit<ExtArgs> | null
    /**
     * Filter, which SentimentAnalysis to fetch.
     */
    where: SentimentAnalysisWhereUniqueInput
  }

  /**
   * SentimentAnalysis findUniqueOrThrow
   */
  export type SentimentAnalysisFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SentimentAnalysis
     */
    select?: SentimentAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SentimentAnalysis
     */
    omit?: SentimentAnalysisOmit<ExtArgs> | null
    /**
     * Filter, which SentimentAnalysis to fetch.
     */
    where: SentimentAnalysisWhereUniqueInput
  }

  /**
   * SentimentAnalysis findFirst
   */
  export type SentimentAnalysisFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SentimentAnalysis
     */
    select?: SentimentAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SentimentAnalysis
     */
    omit?: SentimentAnalysisOmit<ExtArgs> | null
    /**
     * Filter, which SentimentAnalysis to fetch.
     */
    where?: SentimentAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SentimentAnalyses to fetch.
     */
    orderBy?: SentimentAnalysisOrderByWithRelationInput | SentimentAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SentimentAnalyses.
     */
    cursor?: SentimentAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SentimentAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SentimentAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SentimentAnalyses.
     */
    distinct?: SentimentAnalysisScalarFieldEnum | SentimentAnalysisScalarFieldEnum[]
  }

  /**
   * SentimentAnalysis findFirstOrThrow
   */
  export type SentimentAnalysisFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SentimentAnalysis
     */
    select?: SentimentAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SentimentAnalysis
     */
    omit?: SentimentAnalysisOmit<ExtArgs> | null
    /**
     * Filter, which SentimentAnalysis to fetch.
     */
    where?: SentimentAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SentimentAnalyses to fetch.
     */
    orderBy?: SentimentAnalysisOrderByWithRelationInput | SentimentAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SentimentAnalyses.
     */
    cursor?: SentimentAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SentimentAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SentimentAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SentimentAnalyses.
     */
    distinct?: SentimentAnalysisScalarFieldEnum | SentimentAnalysisScalarFieldEnum[]
  }

  /**
   * SentimentAnalysis findMany
   */
  export type SentimentAnalysisFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SentimentAnalysis
     */
    select?: SentimentAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SentimentAnalysis
     */
    omit?: SentimentAnalysisOmit<ExtArgs> | null
    /**
     * Filter, which SentimentAnalyses to fetch.
     */
    where?: SentimentAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SentimentAnalyses to fetch.
     */
    orderBy?: SentimentAnalysisOrderByWithRelationInput | SentimentAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SentimentAnalyses.
     */
    cursor?: SentimentAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SentimentAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SentimentAnalyses.
     */
    skip?: number
    distinct?: SentimentAnalysisScalarFieldEnum | SentimentAnalysisScalarFieldEnum[]
  }

  /**
   * SentimentAnalysis create
   */
  export type SentimentAnalysisCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SentimentAnalysis
     */
    select?: SentimentAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SentimentAnalysis
     */
    omit?: SentimentAnalysisOmit<ExtArgs> | null
    /**
     * The data needed to create a SentimentAnalysis.
     */
    data: XOR<SentimentAnalysisCreateInput, SentimentAnalysisUncheckedCreateInput>
  }

  /**
   * SentimentAnalysis createMany
   */
  export type SentimentAnalysisCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SentimentAnalyses.
     */
    data: SentimentAnalysisCreateManyInput | SentimentAnalysisCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SentimentAnalysis createManyAndReturn
   */
  export type SentimentAnalysisCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SentimentAnalysis
     */
    select?: SentimentAnalysisSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SentimentAnalysis
     */
    omit?: SentimentAnalysisOmit<ExtArgs> | null
    /**
     * The data used to create many SentimentAnalyses.
     */
    data: SentimentAnalysisCreateManyInput | SentimentAnalysisCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SentimentAnalysis update
   */
  export type SentimentAnalysisUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SentimentAnalysis
     */
    select?: SentimentAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SentimentAnalysis
     */
    omit?: SentimentAnalysisOmit<ExtArgs> | null
    /**
     * The data needed to update a SentimentAnalysis.
     */
    data: XOR<SentimentAnalysisUpdateInput, SentimentAnalysisUncheckedUpdateInput>
    /**
     * Choose, which SentimentAnalysis to update.
     */
    where: SentimentAnalysisWhereUniqueInput
  }

  /**
   * SentimentAnalysis updateMany
   */
  export type SentimentAnalysisUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SentimentAnalyses.
     */
    data: XOR<SentimentAnalysisUpdateManyMutationInput, SentimentAnalysisUncheckedUpdateManyInput>
    /**
     * Filter which SentimentAnalyses to update
     */
    where?: SentimentAnalysisWhereInput
    /**
     * Limit how many SentimentAnalyses to update.
     */
    limit?: number
  }

  /**
   * SentimentAnalysis updateManyAndReturn
   */
  export type SentimentAnalysisUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SentimentAnalysis
     */
    select?: SentimentAnalysisSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SentimentAnalysis
     */
    omit?: SentimentAnalysisOmit<ExtArgs> | null
    /**
     * The data used to update SentimentAnalyses.
     */
    data: XOR<SentimentAnalysisUpdateManyMutationInput, SentimentAnalysisUncheckedUpdateManyInput>
    /**
     * Filter which SentimentAnalyses to update
     */
    where?: SentimentAnalysisWhereInput
    /**
     * Limit how many SentimentAnalyses to update.
     */
    limit?: number
  }

  /**
   * SentimentAnalysis upsert
   */
  export type SentimentAnalysisUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SentimentAnalysis
     */
    select?: SentimentAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SentimentAnalysis
     */
    omit?: SentimentAnalysisOmit<ExtArgs> | null
    /**
     * The filter to search for the SentimentAnalysis to update in case it exists.
     */
    where: SentimentAnalysisWhereUniqueInput
    /**
     * In case the SentimentAnalysis found by the `where` argument doesn't exist, create a new SentimentAnalysis with this data.
     */
    create: XOR<SentimentAnalysisCreateInput, SentimentAnalysisUncheckedCreateInput>
    /**
     * In case the SentimentAnalysis was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SentimentAnalysisUpdateInput, SentimentAnalysisUncheckedUpdateInput>
  }

  /**
   * SentimentAnalysis delete
   */
  export type SentimentAnalysisDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SentimentAnalysis
     */
    select?: SentimentAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SentimentAnalysis
     */
    omit?: SentimentAnalysisOmit<ExtArgs> | null
    /**
     * Filter which SentimentAnalysis to delete.
     */
    where: SentimentAnalysisWhereUniqueInput
  }

  /**
   * SentimentAnalysis deleteMany
   */
  export type SentimentAnalysisDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SentimentAnalyses to delete
     */
    where?: SentimentAnalysisWhereInput
    /**
     * Limit how many SentimentAnalyses to delete.
     */
    limit?: number
  }

  /**
   * SentimentAnalysis without action
   */
  export type SentimentAnalysisDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SentimentAnalysis
     */
    select?: SentimentAnalysisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SentimentAnalysis
     */
    omit?: SentimentAnalysisOmit<ExtArgs> | null
  }


  /**
   * Model PriceOptimization
   */

  export type AggregatePriceOptimization = {
    _count: PriceOptimizationCountAggregateOutputType | null
    _avg: PriceOptimizationAvgAggregateOutputType | null
    _sum: PriceOptimizationSumAggregateOutputType | null
    _min: PriceOptimizationMinAggregateOutputType | null
    _max: PriceOptimizationMaxAggregateOutputType | null
  }

  export type PriceOptimizationAvgAggregateOutputType = {
    currentPrice: number | null
    optimalPrice: number | null
    elasticity: number | null
    conversionRate: number | null
    expectedRevenue: number | null
  }

  export type PriceOptimizationSumAggregateOutputType = {
    currentPrice: number | null
    optimalPrice: number | null
    elasticity: number | null
    conversionRate: number | null
    expectedRevenue: number | null
  }

  export type PriceOptimizationMinAggregateOutputType = {
    id: string | null
    productId: string | null
    currentPrice: number | null
    optimalPrice: number | null
    elasticity: number | null
    conversionRate: number | null
    expectedRevenue: number | null
    lastOptimized: Date | null
  }

  export type PriceOptimizationMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    currentPrice: number | null
    optimalPrice: number | null
    elasticity: number | null
    conversionRate: number | null
    expectedRevenue: number | null
    lastOptimized: Date | null
  }

  export type PriceOptimizationCountAggregateOutputType = {
    id: number
    productId: number
    currentPrice: number
    optimalPrice: number
    elasticity: number
    conversionRate: number
    expectedRevenue: number
    lastOptimized: number
    _all: number
  }


  export type PriceOptimizationAvgAggregateInputType = {
    currentPrice?: true
    optimalPrice?: true
    elasticity?: true
    conversionRate?: true
    expectedRevenue?: true
  }

  export type PriceOptimizationSumAggregateInputType = {
    currentPrice?: true
    optimalPrice?: true
    elasticity?: true
    conversionRate?: true
    expectedRevenue?: true
  }

  export type PriceOptimizationMinAggregateInputType = {
    id?: true
    productId?: true
    currentPrice?: true
    optimalPrice?: true
    elasticity?: true
    conversionRate?: true
    expectedRevenue?: true
    lastOptimized?: true
  }

  export type PriceOptimizationMaxAggregateInputType = {
    id?: true
    productId?: true
    currentPrice?: true
    optimalPrice?: true
    elasticity?: true
    conversionRate?: true
    expectedRevenue?: true
    lastOptimized?: true
  }

  export type PriceOptimizationCountAggregateInputType = {
    id?: true
    productId?: true
    currentPrice?: true
    optimalPrice?: true
    elasticity?: true
    conversionRate?: true
    expectedRevenue?: true
    lastOptimized?: true
    _all?: true
  }

  export type PriceOptimizationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PriceOptimization to aggregate.
     */
    where?: PriceOptimizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriceOptimizations to fetch.
     */
    orderBy?: PriceOptimizationOrderByWithRelationInput | PriceOptimizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PriceOptimizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriceOptimizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriceOptimizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PriceOptimizations
    **/
    _count?: true | PriceOptimizationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PriceOptimizationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PriceOptimizationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PriceOptimizationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PriceOptimizationMaxAggregateInputType
  }

  export type GetPriceOptimizationAggregateType<T extends PriceOptimizationAggregateArgs> = {
        [P in keyof T & keyof AggregatePriceOptimization]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePriceOptimization[P]>
      : GetScalarType<T[P], AggregatePriceOptimization[P]>
  }




  export type PriceOptimizationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PriceOptimizationWhereInput
    orderBy?: PriceOptimizationOrderByWithAggregationInput | PriceOptimizationOrderByWithAggregationInput[]
    by: PriceOptimizationScalarFieldEnum[] | PriceOptimizationScalarFieldEnum
    having?: PriceOptimizationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PriceOptimizationCountAggregateInputType | true
    _avg?: PriceOptimizationAvgAggregateInputType
    _sum?: PriceOptimizationSumAggregateInputType
    _min?: PriceOptimizationMinAggregateInputType
    _max?: PriceOptimizationMaxAggregateInputType
  }

  export type PriceOptimizationGroupByOutputType = {
    id: string
    productId: string
    currentPrice: number
    optimalPrice: number
    elasticity: number
    conversionRate: number
    expectedRevenue: number
    lastOptimized: Date
    _count: PriceOptimizationCountAggregateOutputType | null
    _avg: PriceOptimizationAvgAggregateOutputType | null
    _sum: PriceOptimizationSumAggregateOutputType | null
    _min: PriceOptimizationMinAggregateOutputType | null
    _max: PriceOptimizationMaxAggregateOutputType | null
  }

  type GetPriceOptimizationGroupByPayload<T extends PriceOptimizationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PriceOptimizationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PriceOptimizationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PriceOptimizationGroupByOutputType[P]>
            : GetScalarType<T[P], PriceOptimizationGroupByOutputType[P]>
        }
      >
    >


  export type PriceOptimizationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    currentPrice?: boolean
    optimalPrice?: boolean
    elasticity?: boolean
    conversionRate?: boolean
    expectedRevenue?: boolean
    lastOptimized?: boolean
  }, ExtArgs["result"]["priceOptimization"]>

  export type PriceOptimizationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    currentPrice?: boolean
    optimalPrice?: boolean
    elasticity?: boolean
    conversionRate?: boolean
    expectedRevenue?: boolean
    lastOptimized?: boolean
  }, ExtArgs["result"]["priceOptimization"]>

  export type PriceOptimizationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    currentPrice?: boolean
    optimalPrice?: boolean
    elasticity?: boolean
    conversionRate?: boolean
    expectedRevenue?: boolean
    lastOptimized?: boolean
  }, ExtArgs["result"]["priceOptimization"]>

  export type PriceOptimizationSelectScalar = {
    id?: boolean
    productId?: boolean
    currentPrice?: boolean
    optimalPrice?: boolean
    elasticity?: boolean
    conversionRate?: boolean
    expectedRevenue?: boolean
    lastOptimized?: boolean
  }

  export type PriceOptimizationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "currentPrice" | "optimalPrice" | "elasticity" | "conversionRate" | "expectedRevenue" | "lastOptimized", ExtArgs["result"]["priceOptimization"]>

  export type $PriceOptimizationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PriceOptimization"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      currentPrice: number
      optimalPrice: number
      elasticity: number
      conversionRate: number
      expectedRevenue: number
      lastOptimized: Date
    }, ExtArgs["result"]["priceOptimization"]>
    composites: {}
  }

  type PriceOptimizationGetPayload<S extends boolean | null | undefined | PriceOptimizationDefaultArgs> = $Result.GetResult<Prisma.$PriceOptimizationPayload, S>

  type PriceOptimizationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PriceOptimizationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PriceOptimizationCountAggregateInputType | true
    }

  export interface PriceOptimizationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PriceOptimization'], meta: { name: 'PriceOptimization' } }
    /**
     * Find zero or one PriceOptimization that matches the filter.
     * @param {PriceOptimizationFindUniqueArgs} args - Arguments to find a PriceOptimization
     * @example
     * // Get one PriceOptimization
     * const priceOptimization = await prisma.priceOptimization.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PriceOptimizationFindUniqueArgs>(args: SelectSubset<T, PriceOptimizationFindUniqueArgs<ExtArgs>>): Prisma__PriceOptimizationClient<$Result.GetResult<Prisma.$PriceOptimizationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PriceOptimization that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PriceOptimizationFindUniqueOrThrowArgs} args - Arguments to find a PriceOptimization
     * @example
     * // Get one PriceOptimization
     * const priceOptimization = await prisma.priceOptimization.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PriceOptimizationFindUniqueOrThrowArgs>(args: SelectSubset<T, PriceOptimizationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PriceOptimizationClient<$Result.GetResult<Prisma.$PriceOptimizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PriceOptimization that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceOptimizationFindFirstArgs} args - Arguments to find a PriceOptimization
     * @example
     * // Get one PriceOptimization
     * const priceOptimization = await prisma.priceOptimization.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PriceOptimizationFindFirstArgs>(args?: SelectSubset<T, PriceOptimizationFindFirstArgs<ExtArgs>>): Prisma__PriceOptimizationClient<$Result.GetResult<Prisma.$PriceOptimizationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PriceOptimization that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceOptimizationFindFirstOrThrowArgs} args - Arguments to find a PriceOptimization
     * @example
     * // Get one PriceOptimization
     * const priceOptimization = await prisma.priceOptimization.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PriceOptimizationFindFirstOrThrowArgs>(args?: SelectSubset<T, PriceOptimizationFindFirstOrThrowArgs<ExtArgs>>): Prisma__PriceOptimizationClient<$Result.GetResult<Prisma.$PriceOptimizationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PriceOptimizations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceOptimizationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PriceOptimizations
     * const priceOptimizations = await prisma.priceOptimization.findMany()
     * 
     * // Get first 10 PriceOptimizations
     * const priceOptimizations = await prisma.priceOptimization.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const priceOptimizationWithIdOnly = await prisma.priceOptimization.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PriceOptimizationFindManyArgs>(args?: SelectSubset<T, PriceOptimizationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriceOptimizationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PriceOptimization.
     * @param {PriceOptimizationCreateArgs} args - Arguments to create a PriceOptimization.
     * @example
     * // Create one PriceOptimization
     * const PriceOptimization = await prisma.priceOptimization.create({
     *   data: {
     *     // ... data to create a PriceOptimization
     *   }
     * })
     * 
     */
    create<T extends PriceOptimizationCreateArgs>(args: SelectSubset<T, PriceOptimizationCreateArgs<ExtArgs>>): Prisma__PriceOptimizationClient<$Result.GetResult<Prisma.$PriceOptimizationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PriceOptimizations.
     * @param {PriceOptimizationCreateManyArgs} args - Arguments to create many PriceOptimizations.
     * @example
     * // Create many PriceOptimizations
     * const priceOptimization = await prisma.priceOptimization.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PriceOptimizationCreateManyArgs>(args?: SelectSubset<T, PriceOptimizationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PriceOptimizations and returns the data saved in the database.
     * @param {PriceOptimizationCreateManyAndReturnArgs} args - Arguments to create many PriceOptimizations.
     * @example
     * // Create many PriceOptimizations
     * const priceOptimization = await prisma.priceOptimization.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PriceOptimizations and only return the `id`
     * const priceOptimizationWithIdOnly = await prisma.priceOptimization.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PriceOptimizationCreateManyAndReturnArgs>(args?: SelectSubset<T, PriceOptimizationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriceOptimizationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PriceOptimization.
     * @param {PriceOptimizationDeleteArgs} args - Arguments to delete one PriceOptimization.
     * @example
     * // Delete one PriceOptimization
     * const PriceOptimization = await prisma.priceOptimization.delete({
     *   where: {
     *     // ... filter to delete one PriceOptimization
     *   }
     * })
     * 
     */
    delete<T extends PriceOptimizationDeleteArgs>(args: SelectSubset<T, PriceOptimizationDeleteArgs<ExtArgs>>): Prisma__PriceOptimizationClient<$Result.GetResult<Prisma.$PriceOptimizationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PriceOptimization.
     * @param {PriceOptimizationUpdateArgs} args - Arguments to update one PriceOptimization.
     * @example
     * // Update one PriceOptimization
     * const priceOptimization = await prisma.priceOptimization.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PriceOptimizationUpdateArgs>(args: SelectSubset<T, PriceOptimizationUpdateArgs<ExtArgs>>): Prisma__PriceOptimizationClient<$Result.GetResult<Prisma.$PriceOptimizationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PriceOptimizations.
     * @param {PriceOptimizationDeleteManyArgs} args - Arguments to filter PriceOptimizations to delete.
     * @example
     * // Delete a few PriceOptimizations
     * const { count } = await prisma.priceOptimization.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PriceOptimizationDeleteManyArgs>(args?: SelectSubset<T, PriceOptimizationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PriceOptimizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceOptimizationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PriceOptimizations
     * const priceOptimization = await prisma.priceOptimization.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PriceOptimizationUpdateManyArgs>(args: SelectSubset<T, PriceOptimizationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PriceOptimizations and returns the data updated in the database.
     * @param {PriceOptimizationUpdateManyAndReturnArgs} args - Arguments to update many PriceOptimizations.
     * @example
     * // Update many PriceOptimizations
     * const priceOptimization = await prisma.priceOptimization.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PriceOptimizations and only return the `id`
     * const priceOptimizationWithIdOnly = await prisma.priceOptimization.updateManyAndReturn({
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
    updateManyAndReturn<T extends PriceOptimizationUpdateManyAndReturnArgs>(args: SelectSubset<T, PriceOptimizationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriceOptimizationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PriceOptimization.
     * @param {PriceOptimizationUpsertArgs} args - Arguments to update or create a PriceOptimization.
     * @example
     * // Update or create a PriceOptimization
     * const priceOptimization = await prisma.priceOptimization.upsert({
     *   create: {
     *     // ... data to create a PriceOptimization
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PriceOptimization we want to update
     *   }
     * })
     */
    upsert<T extends PriceOptimizationUpsertArgs>(args: SelectSubset<T, PriceOptimizationUpsertArgs<ExtArgs>>): Prisma__PriceOptimizationClient<$Result.GetResult<Prisma.$PriceOptimizationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PriceOptimizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceOptimizationCountArgs} args - Arguments to filter PriceOptimizations to count.
     * @example
     * // Count the number of PriceOptimizations
     * const count = await prisma.priceOptimization.count({
     *   where: {
     *     // ... the filter for the PriceOptimizations we want to count
     *   }
     * })
    **/
    count<T extends PriceOptimizationCountArgs>(
      args?: Subset<T, PriceOptimizationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PriceOptimizationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PriceOptimization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceOptimizationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PriceOptimizationAggregateArgs>(args: Subset<T, PriceOptimizationAggregateArgs>): Prisma.PrismaPromise<GetPriceOptimizationAggregateType<T>>

    /**
     * Group by PriceOptimization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceOptimizationGroupByArgs} args - Group by arguments.
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
      T extends PriceOptimizationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PriceOptimizationGroupByArgs['orderBy'] }
        : { orderBy?: PriceOptimizationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PriceOptimizationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPriceOptimizationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PriceOptimization model
   */
  readonly fields: PriceOptimizationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PriceOptimization.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PriceOptimizationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the PriceOptimization model
   */
  interface PriceOptimizationFieldRefs {
    readonly id: FieldRef<"PriceOptimization", 'String'>
    readonly productId: FieldRef<"PriceOptimization", 'String'>
    readonly currentPrice: FieldRef<"PriceOptimization", 'Float'>
    readonly optimalPrice: FieldRef<"PriceOptimization", 'Float'>
    readonly elasticity: FieldRef<"PriceOptimization", 'Float'>
    readonly conversionRate: FieldRef<"PriceOptimization", 'Float'>
    readonly expectedRevenue: FieldRef<"PriceOptimization", 'Float'>
    readonly lastOptimized: FieldRef<"PriceOptimization", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PriceOptimization findUnique
   */
  export type PriceOptimizationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceOptimization
     */
    select?: PriceOptimizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceOptimization
     */
    omit?: PriceOptimizationOmit<ExtArgs> | null
    /**
     * Filter, which PriceOptimization to fetch.
     */
    where: PriceOptimizationWhereUniqueInput
  }

  /**
   * PriceOptimization findUniqueOrThrow
   */
  export type PriceOptimizationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceOptimization
     */
    select?: PriceOptimizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceOptimization
     */
    omit?: PriceOptimizationOmit<ExtArgs> | null
    /**
     * Filter, which PriceOptimization to fetch.
     */
    where: PriceOptimizationWhereUniqueInput
  }

  /**
   * PriceOptimization findFirst
   */
  export type PriceOptimizationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceOptimization
     */
    select?: PriceOptimizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceOptimization
     */
    omit?: PriceOptimizationOmit<ExtArgs> | null
    /**
     * Filter, which PriceOptimization to fetch.
     */
    where?: PriceOptimizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriceOptimizations to fetch.
     */
    orderBy?: PriceOptimizationOrderByWithRelationInput | PriceOptimizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PriceOptimizations.
     */
    cursor?: PriceOptimizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriceOptimizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriceOptimizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PriceOptimizations.
     */
    distinct?: PriceOptimizationScalarFieldEnum | PriceOptimizationScalarFieldEnum[]
  }

  /**
   * PriceOptimization findFirstOrThrow
   */
  export type PriceOptimizationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceOptimization
     */
    select?: PriceOptimizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceOptimization
     */
    omit?: PriceOptimizationOmit<ExtArgs> | null
    /**
     * Filter, which PriceOptimization to fetch.
     */
    where?: PriceOptimizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriceOptimizations to fetch.
     */
    orderBy?: PriceOptimizationOrderByWithRelationInput | PriceOptimizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PriceOptimizations.
     */
    cursor?: PriceOptimizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriceOptimizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriceOptimizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PriceOptimizations.
     */
    distinct?: PriceOptimizationScalarFieldEnum | PriceOptimizationScalarFieldEnum[]
  }

  /**
   * PriceOptimization findMany
   */
  export type PriceOptimizationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceOptimization
     */
    select?: PriceOptimizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceOptimization
     */
    omit?: PriceOptimizationOmit<ExtArgs> | null
    /**
     * Filter, which PriceOptimizations to fetch.
     */
    where?: PriceOptimizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriceOptimizations to fetch.
     */
    orderBy?: PriceOptimizationOrderByWithRelationInput | PriceOptimizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PriceOptimizations.
     */
    cursor?: PriceOptimizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriceOptimizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriceOptimizations.
     */
    skip?: number
    distinct?: PriceOptimizationScalarFieldEnum | PriceOptimizationScalarFieldEnum[]
  }

  /**
   * PriceOptimization create
   */
  export type PriceOptimizationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceOptimization
     */
    select?: PriceOptimizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceOptimization
     */
    omit?: PriceOptimizationOmit<ExtArgs> | null
    /**
     * The data needed to create a PriceOptimization.
     */
    data: XOR<PriceOptimizationCreateInput, PriceOptimizationUncheckedCreateInput>
  }

  /**
   * PriceOptimization createMany
   */
  export type PriceOptimizationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PriceOptimizations.
     */
    data: PriceOptimizationCreateManyInput | PriceOptimizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PriceOptimization createManyAndReturn
   */
  export type PriceOptimizationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceOptimization
     */
    select?: PriceOptimizationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PriceOptimization
     */
    omit?: PriceOptimizationOmit<ExtArgs> | null
    /**
     * The data used to create many PriceOptimizations.
     */
    data: PriceOptimizationCreateManyInput | PriceOptimizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PriceOptimization update
   */
  export type PriceOptimizationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceOptimization
     */
    select?: PriceOptimizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceOptimization
     */
    omit?: PriceOptimizationOmit<ExtArgs> | null
    /**
     * The data needed to update a PriceOptimization.
     */
    data: XOR<PriceOptimizationUpdateInput, PriceOptimizationUncheckedUpdateInput>
    /**
     * Choose, which PriceOptimization to update.
     */
    where: PriceOptimizationWhereUniqueInput
  }

  /**
   * PriceOptimization updateMany
   */
  export type PriceOptimizationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PriceOptimizations.
     */
    data: XOR<PriceOptimizationUpdateManyMutationInput, PriceOptimizationUncheckedUpdateManyInput>
    /**
     * Filter which PriceOptimizations to update
     */
    where?: PriceOptimizationWhereInput
    /**
     * Limit how many PriceOptimizations to update.
     */
    limit?: number
  }

  /**
   * PriceOptimization updateManyAndReturn
   */
  export type PriceOptimizationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceOptimization
     */
    select?: PriceOptimizationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PriceOptimization
     */
    omit?: PriceOptimizationOmit<ExtArgs> | null
    /**
     * The data used to update PriceOptimizations.
     */
    data: XOR<PriceOptimizationUpdateManyMutationInput, PriceOptimizationUncheckedUpdateManyInput>
    /**
     * Filter which PriceOptimizations to update
     */
    where?: PriceOptimizationWhereInput
    /**
     * Limit how many PriceOptimizations to update.
     */
    limit?: number
  }

  /**
   * PriceOptimization upsert
   */
  export type PriceOptimizationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceOptimization
     */
    select?: PriceOptimizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceOptimization
     */
    omit?: PriceOptimizationOmit<ExtArgs> | null
    /**
     * The filter to search for the PriceOptimization to update in case it exists.
     */
    where: PriceOptimizationWhereUniqueInput
    /**
     * In case the PriceOptimization found by the `where` argument doesn't exist, create a new PriceOptimization with this data.
     */
    create: XOR<PriceOptimizationCreateInput, PriceOptimizationUncheckedCreateInput>
    /**
     * In case the PriceOptimization was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PriceOptimizationUpdateInput, PriceOptimizationUncheckedUpdateInput>
  }

  /**
   * PriceOptimization delete
   */
  export type PriceOptimizationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceOptimization
     */
    select?: PriceOptimizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceOptimization
     */
    omit?: PriceOptimizationOmit<ExtArgs> | null
    /**
     * Filter which PriceOptimization to delete.
     */
    where: PriceOptimizationWhereUniqueInput
  }

  /**
   * PriceOptimization deleteMany
   */
  export type PriceOptimizationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PriceOptimizations to delete
     */
    where?: PriceOptimizationWhereInput
    /**
     * Limit how many PriceOptimizations to delete.
     */
    limit?: number
  }

  /**
   * PriceOptimization without action
   */
  export type PriceOptimizationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceOptimization
     */
    select?: PriceOptimizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceOptimization
     */
    omit?: PriceOptimizationOmit<ExtArgs> | null
  }


  /**
   * Model CustomerLTV
   */

  export type AggregateCustomerLTV = {
    _count: CustomerLTVCountAggregateOutputType | null
    _avg: CustomerLTVAvgAggregateOutputType | null
    _sum: CustomerLTVSumAggregateOutputType | null
    _min: CustomerLTVMinAggregateOutputType | null
    _max: CustomerLTVMaxAggregateOutputType | null
  }

  export type CustomerLTVAvgAggregateOutputType = {
    ltv: number | null
    clv: number | null
    roi: number | null
    predictedMonthly: number | null
  }

  export type CustomerLTVSumAggregateOutputType = {
    ltv: number | null
    clv: number | null
    roi: number | null
    predictedMonthly: number | null
  }

  export type CustomerLTVMinAggregateOutputType = {
    id: string | null
    customerId: string | null
    ltv: number | null
    clv: number | null
    segment: string | null
    roi: number | null
    predictedMonthly: number | null
    lastComputed: Date | null
  }

  export type CustomerLTVMaxAggregateOutputType = {
    id: string | null
    customerId: string | null
    ltv: number | null
    clv: number | null
    segment: string | null
    roi: number | null
    predictedMonthly: number | null
    lastComputed: Date | null
  }

  export type CustomerLTVCountAggregateOutputType = {
    id: number
    customerId: number
    ltv: number
    clv: number
    segment: number
    roi: number
    predictedMonthly: number
    lastComputed: number
    _all: number
  }


  export type CustomerLTVAvgAggregateInputType = {
    ltv?: true
    clv?: true
    roi?: true
    predictedMonthly?: true
  }

  export type CustomerLTVSumAggregateInputType = {
    ltv?: true
    clv?: true
    roi?: true
    predictedMonthly?: true
  }

  export type CustomerLTVMinAggregateInputType = {
    id?: true
    customerId?: true
    ltv?: true
    clv?: true
    segment?: true
    roi?: true
    predictedMonthly?: true
    lastComputed?: true
  }

  export type CustomerLTVMaxAggregateInputType = {
    id?: true
    customerId?: true
    ltv?: true
    clv?: true
    segment?: true
    roi?: true
    predictedMonthly?: true
    lastComputed?: true
  }

  export type CustomerLTVCountAggregateInputType = {
    id?: true
    customerId?: true
    ltv?: true
    clv?: true
    segment?: true
    roi?: true
    predictedMonthly?: true
    lastComputed?: true
    _all?: true
  }

  export type CustomerLTVAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomerLTV to aggregate.
     */
    where?: CustomerLTVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerLTVS to fetch.
     */
    orderBy?: CustomerLTVOrderByWithRelationInput | CustomerLTVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerLTVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerLTVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerLTVS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CustomerLTVS
    **/
    _count?: true | CustomerLTVCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomerLTVAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomerLTVSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerLTVMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerLTVMaxAggregateInputType
  }

  export type GetCustomerLTVAggregateType<T extends CustomerLTVAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomerLTV]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomerLTV[P]>
      : GetScalarType<T[P], AggregateCustomerLTV[P]>
  }




  export type CustomerLTVGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerLTVWhereInput
    orderBy?: CustomerLTVOrderByWithAggregationInput | CustomerLTVOrderByWithAggregationInput[]
    by: CustomerLTVScalarFieldEnum[] | CustomerLTVScalarFieldEnum
    having?: CustomerLTVScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerLTVCountAggregateInputType | true
    _avg?: CustomerLTVAvgAggregateInputType
    _sum?: CustomerLTVSumAggregateInputType
    _min?: CustomerLTVMinAggregateInputType
    _max?: CustomerLTVMaxAggregateInputType
  }

  export type CustomerLTVGroupByOutputType = {
    id: string
    customerId: string
    ltv: number
    clv: number
    segment: string
    roi: number
    predictedMonthly: number
    lastComputed: Date
    _count: CustomerLTVCountAggregateOutputType | null
    _avg: CustomerLTVAvgAggregateOutputType | null
    _sum: CustomerLTVSumAggregateOutputType | null
    _min: CustomerLTVMinAggregateOutputType | null
    _max: CustomerLTVMaxAggregateOutputType | null
  }

  type GetCustomerLTVGroupByPayload<T extends CustomerLTVGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerLTVGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerLTVGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerLTVGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerLTVGroupByOutputType[P]>
        }
      >
    >


  export type CustomerLTVSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    ltv?: boolean
    clv?: boolean
    segment?: boolean
    roi?: boolean
    predictedMonthly?: boolean
    lastComputed?: boolean
  }, ExtArgs["result"]["customerLTV"]>

  export type CustomerLTVSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    ltv?: boolean
    clv?: boolean
    segment?: boolean
    roi?: boolean
    predictedMonthly?: boolean
    lastComputed?: boolean
  }, ExtArgs["result"]["customerLTV"]>

  export type CustomerLTVSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    ltv?: boolean
    clv?: boolean
    segment?: boolean
    roi?: boolean
    predictedMonthly?: boolean
    lastComputed?: boolean
  }, ExtArgs["result"]["customerLTV"]>

  export type CustomerLTVSelectScalar = {
    id?: boolean
    customerId?: boolean
    ltv?: boolean
    clv?: boolean
    segment?: boolean
    roi?: boolean
    predictedMonthly?: boolean
    lastComputed?: boolean
  }

  export type CustomerLTVOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "customerId" | "ltv" | "clv" | "segment" | "roi" | "predictedMonthly" | "lastComputed", ExtArgs["result"]["customerLTV"]>

  export type $CustomerLTVPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CustomerLTV"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      customerId: string
      ltv: number
      clv: number
      segment: string
      roi: number
      predictedMonthly: number
      lastComputed: Date
    }, ExtArgs["result"]["customerLTV"]>
    composites: {}
  }

  type CustomerLTVGetPayload<S extends boolean | null | undefined | CustomerLTVDefaultArgs> = $Result.GetResult<Prisma.$CustomerLTVPayload, S>

  type CustomerLTVCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CustomerLTVFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomerLTVCountAggregateInputType | true
    }

  export interface CustomerLTVDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CustomerLTV'], meta: { name: 'CustomerLTV' } }
    /**
     * Find zero or one CustomerLTV that matches the filter.
     * @param {CustomerLTVFindUniqueArgs} args - Arguments to find a CustomerLTV
     * @example
     * // Get one CustomerLTV
     * const customerLTV = await prisma.customerLTV.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerLTVFindUniqueArgs>(args: SelectSubset<T, CustomerLTVFindUniqueArgs<ExtArgs>>): Prisma__CustomerLTVClient<$Result.GetResult<Prisma.$CustomerLTVPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CustomerLTV that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CustomerLTVFindUniqueOrThrowArgs} args - Arguments to find a CustomerLTV
     * @example
     * // Get one CustomerLTV
     * const customerLTV = await prisma.customerLTV.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerLTVFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerLTVFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerLTVClient<$Result.GetResult<Prisma.$CustomerLTVPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomerLTV that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerLTVFindFirstArgs} args - Arguments to find a CustomerLTV
     * @example
     * // Get one CustomerLTV
     * const customerLTV = await prisma.customerLTV.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerLTVFindFirstArgs>(args?: SelectSubset<T, CustomerLTVFindFirstArgs<ExtArgs>>): Prisma__CustomerLTVClient<$Result.GetResult<Prisma.$CustomerLTVPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomerLTV that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerLTVFindFirstOrThrowArgs} args - Arguments to find a CustomerLTV
     * @example
     * // Get one CustomerLTV
     * const customerLTV = await prisma.customerLTV.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerLTVFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerLTVFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerLTVClient<$Result.GetResult<Prisma.$CustomerLTVPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CustomerLTVS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerLTVFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CustomerLTVS
     * const customerLTVS = await prisma.customerLTV.findMany()
     * 
     * // Get first 10 CustomerLTVS
     * const customerLTVS = await prisma.customerLTV.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerLTVWithIdOnly = await prisma.customerLTV.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerLTVFindManyArgs>(args?: SelectSubset<T, CustomerLTVFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerLTVPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CustomerLTV.
     * @param {CustomerLTVCreateArgs} args - Arguments to create a CustomerLTV.
     * @example
     * // Create one CustomerLTV
     * const CustomerLTV = await prisma.customerLTV.create({
     *   data: {
     *     // ... data to create a CustomerLTV
     *   }
     * })
     * 
     */
    create<T extends CustomerLTVCreateArgs>(args: SelectSubset<T, CustomerLTVCreateArgs<ExtArgs>>): Prisma__CustomerLTVClient<$Result.GetResult<Prisma.$CustomerLTVPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CustomerLTVS.
     * @param {CustomerLTVCreateManyArgs} args - Arguments to create many CustomerLTVS.
     * @example
     * // Create many CustomerLTVS
     * const customerLTV = await prisma.customerLTV.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerLTVCreateManyArgs>(args?: SelectSubset<T, CustomerLTVCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CustomerLTVS and returns the data saved in the database.
     * @param {CustomerLTVCreateManyAndReturnArgs} args - Arguments to create many CustomerLTVS.
     * @example
     * // Create many CustomerLTVS
     * const customerLTV = await prisma.customerLTV.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CustomerLTVS and only return the `id`
     * const customerLTVWithIdOnly = await prisma.customerLTV.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomerLTVCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomerLTVCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerLTVPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CustomerLTV.
     * @param {CustomerLTVDeleteArgs} args - Arguments to delete one CustomerLTV.
     * @example
     * // Delete one CustomerLTV
     * const CustomerLTV = await prisma.customerLTV.delete({
     *   where: {
     *     // ... filter to delete one CustomerLTV
     *   }
     * })
     * 
     */
    delete<T extends CustomerLTVDeleteArgs>(args: SelectSubset<T, CustomerLTVDeleteArgs<ExtArgs>>): Prisma__CustomerLTVClient<$Result.GetResult<Prisma.$CustomerLTVPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CustomerLTV.
     * @param {CustomerLTVUpdateArgs} args - Arguments to update one CustomerLTV.
     * @example
     * // Update one CustomerLTV
     * const customerLTV = await prisma.customerLTV.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerLTVUpdateArgs>(args: SelectSubset<T, CustomerLTVUpdateArgs<ExtArgs>>): Prisma__CustomerLTVClient<$Result.GetResult<Prisma.$CustomerLTVPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CustomerLTVS.
     * @param {CustomerLTVDeleteManyArgs} args - Arguments to filter CustomerLTVS to delete.
     * @example
     * // Delete a few CustomerLTVS
     * const { count } = await prisma.customerLTV.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerLTVDeleteManyArgs>(args?: SelectSubset<T, CustomerLTVDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomerLTVS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerLTVUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CustomerLTVS
     * const customerLTV = await prisma.customerLTV.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerLTVUpdateManyArgs>(args: SelectSubset<T, CustomerLTVUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomerLTVS and returns the data updated in the database.
     * @param {CustomerLTVUpdateManyAndReturnArgs} args - Arguments to update many CustomerLTVS.
     * @example
     * // Update many CustomerLTVS
     * const customerLTV = await prisma.customerLTV.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CustomerLTVS and only return the `id`
     * const customerLTVWithIdOnly = await prisma.customerLTV.updateManyAndReturn({
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
    updateManyAndReturn<T extends CustomerLTVUpdateManyAndReturnArgs>(args: SelectSubset<T, CustomerLTVUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerLTVPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CustomerLTV.
     * @param {CustomerLTVUpsertArgs} args - Arguments to update or create a CustomerLTV.
     * @example
     * // Update or create a CustomerLTV
     * const customerLTV = await prisma.customerLTV.upsert({
     *   create: {
     *     // ... data to create a CustomerLTV
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CustomerLTV we want to update
     *   }
     * })
     */
    upsert<T extends CustomerLTVUpsertArgs>(args: SelectSubset<T, CustomerLTVUpsertArgs<ExtArgs>>): Prisma__CustomerLTVClient<$Result.GetResult<Prisma.$CustomerLTVPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CustomerLTVS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerLTVCountArgs} args - Arguments to filter CustomerLTVS to count.
     * @example
     * // Count the number of CustomerLTVS
     * const count = await prisma.customerLTV.count({
     *   where: {
     *     // ... the filter for the CustomerLTVS we want to count
     *   }
     * })
    **/
    count<T extends CustomerLTVCountArgs>(
      args?: Subset<T, CustomerLTVCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerLTVCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CustomerLTV.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerLTVAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CustomerLTVAggregateArgs>(args: Subset<T, CustomerLTVAggregateArgs>): Prisma.PrismaPromise<GetCustomerLTVAggregateType<T>>

    /**
     * Group by CustomerLTV.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerLTVGroupByArgs} args - Group by arguments.
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
      T extends CustomerLTVGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerLTVGroupByArgs['orderBy'] }
        : { orderBy?: CustomerLTVGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CustomerLTVGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerLTVGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CustomerLTV model
   */
  readonly fields: CustomerLTVFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CustomerLTV.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerLTVClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the CustomerLTV model
   */
  interface CustomerLTVFieldRefs {
    readonly id: FieldRef<"CustomerLTV", 'String'>
    readonly customerId: FieldRef<"CustomerLTV", 'String'>
    readonly ltv: FieldRef<"CustomerLTV", 'Float'>
    readonly clv: FieldRef<"CustomerLTV", 'Float'>
    readonly segment: FieldRef<"CustomerLTV", 'String'>
    readonly roi: FieldRef<"CustomerLTV", 'Float'>
    readonly predictedMonthly: FieldRef<"CustomerLTV", 'Float'>
    readonly lastComputed: FieldRef<"CustomerLTV", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CustomerLTV findUnique
   */
  export type CustomerLTVFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLTV
     */
    select?: CustomerLTVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLTV
     */
    omit?: CustomerLTVOmit<ExtArgs> | null
    /**
     * Filter, which CustomerLTV to fetch.
     */
    where: CustomerLTVWhereUniqueInput
  }

  /**
   * CustomerLTV findUniqueOrThrow
   */
  export type CustomerLTVFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLTV
     */
    select?: CustomerLTVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLTV
     */
    omit?: CustomerLTVOmit<ExtArgs> | null
    /**
     * Filter, which CustomerLTV to fetch.
     */
    where: CustomerLTVWhereUniqueInput
  }

  /**
   * CustomerLTV findFirst
   */
  export type CustomerLTVFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLTV
     */
    select?: CustomerLTVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLTV
     */
    omit?: CustomerLTVOmit<ExtArgs> | null
    /**
     * Filter, which CustomerLTV to fetch.
     */
    where?: CustomerLTVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerLTVS to fetch.
     */
    orderBy?: CustomerLTVOrderByWithRelationInput | CustomerLTVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomerLTVS.
     */
    cursor?: CustomerLTVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerLTVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerLTVS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerLTVS.
     */
    distinct?: CustomerLTVScalarFieldEnum | CustomerLTVScalarFieldEnum[]
  }

  /**
   * CustomerLTV findFirstOrThrow
   */
  export type CustomerLTVFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLTV
     */
    select?: CustomerLTVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLTV
     */
    omit?: CustomerLTVOmit<ExtArgs> | null
    /**
     * Filter, which CustomerLTV to fetch.
     */
    where?: CustomerLTVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerLTVS to fetch.
     */
    orderBy?: CustomerLTVOrderByWithRelationInput | CustomerLTVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomerLTVS.
     */
    cursor?: CustomerLTVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerLTVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerLTVS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerLTVS.
     */
    distinct?: CustomerLTVScalarFieldEnum | CustomerLTVScalarFieldEnum[]
  }

  /**
   * CustomerLTV findMany
   */
  export type CustomerLTVFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLTV
     */
    select?: CustomerLTVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLTV
     */
    omit?: CustomerLTVOmit<ExtArgs> | null
    /**
     * Filter, which CustomerLTVS to fetch.
     */
    where?: CustomerLTVWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerLTVS to fetch.
     */
    orderBy?: CustomerLTVOrderByWithRelationInput | CustomerLTVOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CustomerLTVS.
     */
    cursor?: CustomerLTVWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerLTVS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerLTVS.
     */
    skip?: number
    distinct?: CustomerLTVScalarFieldEnum | CustomerLTVScalarFieldEnum[]
  }

  /**
   * CustomerLTV create
   */
  export type CustomerLTVCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLTV
     */
    select?: CustomerLTVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLTV
     */
    omit?: CustomerLTVOmit<ExtArgs> | null
    /**
     * The data needed to create a CustomerLTV.
     */
    data: XOR<CustomerLTVCreateInput, CustomerLTVUncheckedCreateInput>
  }

  /**
   * CustomerLTV createMany
   */
  export type CustomerLTVCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CustomerLTVS.
     */
    data: CustomerLTVCreateManyInput | CustomerLTVCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CustomerLTV createManyAndReturn
   */
  export type CustomerLTVCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLTV
     */
    select?: CustomerLTVSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLTV
     */
    omit?: CustomerLTVOmit<ExtArgs> | null
    /**
     * The data used to create many CustomerLTVS.
     */
    data: CustomerLTVCreateManyInput | CustomerLTVCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CustomerLTV update
   */
  export type CustomerLTVUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLTV
     */
    select?: CustomerLTVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLTV
     */
    omit?: CustomerLTVOmit<ExtArgs> | null
    /**
     * The data needed to update a CustomerLTV.
     */
    data: XOR<CustomerLTVUpdateInput, CustomerLTVUncheckedUpdateInput>
    /**
     * Choose, which CustomerLTV to update.
     */
    where: CustomerLTVWhereUniqueInput
  }

  /**
   * CustomerLTV updateMany
   */
  export type CustomerLTVUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CustomerLTVS.
     */
    data: XOR<CustomerLTVUpdateManyMutationInput, CustomerLTVUncheckedUpdateManyInput>
    /**
     * Filter which CustomerLTVS to update
     */
    where?: CustomerLTVWhereInput
    /**
     * Limit how many CustomerLTVS to update.
     */
    limit?: number
  }

  /**
   * CustomerLTV updateManyAndReturn
   */
  export type CustomerLTVUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLTV
     */
    select?: CustomerLTVSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLTV
     */
    omit?: CustomerLTVOmit<ExtArgs> | null
    /**
     * The data used to update CustomerLTVS.
     */
    data: XOR<CustomerLTVUpdateManyMutationInput, CustomerLTVUncheckedUpdateManyInput>
    /**
     * Filter which CustomerLTVS to update
     */
    where?: CustomerLTVWhereInput
    /**
     * Limit how many CustomerLTVS to update.
     */
    limit?: number
  }

  /**
   * CustomerLTV upsert
   */
  export type CustomerLTVUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLTV
     */
    select?: CustomerLTVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLTV
     */
    omit?: CustomerLTVOmit<ExtArgs> | null
    /**
     * The filter to search for the CustomerLTV to update in case it exists.
     */
    where: CustomerLTVWhereUniqueInput
    /**
     * In case the CustomerLTV found by the `where` argument doesn't exist, create a new CustomerLTV with this data.
     */
    create: XOR<CustomerLTVCreateInput, CustomerLTVUncheckedCreateInput>
    /**
     * In case the CustomerLTV was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerLTVUpdateInput, CustomerLTVUncheckedUpdateInput>
  }

  /**
   * CustomerLTV delete
   */
  export type CustomerLTVDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLTV
     */
    select?: CustomerLTVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLTV
     */
    omit?: CustomerLTVOmit<ExtArgs> | null
    /**
     * Filter which CustomerLTV to delete.
     */
    where: CustomerLTVWhereUniqueInput
  }

  /**
   * CustomerLTV deleteMany
   */
  export type CustomerLTVDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomerLTVS to delete
     */
    where?: CustomerLTVWhereInput
    /**
     * Limit how many CustomerLTVS to delete.
     */
    limit?: number
  }

  /**
   * CustomerLTV without action
   */
  export type CustomerLTVDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerLTV
     */
    select?: CustomerLTVSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerLTV
     */
    omit?: CustomerLTVOmit<ExtArgs> | null
  }


  /**
   * Model ABTest
   */

  export type AggregateABTest = {
    _count: ABTestCountAggregateOutputType | null
    _avg: ABTestAvgAggregateOutputType | null
    _sum: ABTestSumAggregateOutputType | null
    _min: ABTestMinAggregateOutputType | null
    _max: ABTestMaxAggregateOutputType | null
  }

  export type ABTestAvgAggregateOutputType = {
    pValue: number | null
  }

  export type ABTestSumAggregateOutputType = {
    pValue: number | null
  }

  export type ABTestMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    metric: string | null
    startDate: Date | null
    endDate: Date | null
    pValue: number | null
    winner: string | null
    createdAt: Date | null
  }

  export type ABTestMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    metric: string | null
    startDate: Date | null
    endDate: Date | null
    pValue: number | null
    winner: string | null
    createdAt: Date | null
  }

  export type ABTestCountAggregateOutputType = {
    id: number
    name: number
    description: number
    variantA: number
    variantB: number
    controlGroup: number
    testGroup: number
    metric: number
    startDate: number
    endDate: number
    pValue: number
    winner: number
    createdAt: number
    _all: number
  }


  export type ABTestAvgAggregateInputType = {
    pValue?: true
  }

  export type ABTestSumAggregateInputType = {
    pValue?: true
  }

  export type ABTestMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    metric?: true
    startDate?: true
    endDate?: true
    pValue?: true
    winner?: true
    createdAt?: true
  }

  export type ABTestMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    metric?: true
    startDate?: true
    endDate?: true
    pValue?: true
    winner?: true
    createdAt?: true
  }

  export type ABTestCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    variantA?: true
    variantB?: true
    controlGroup?: true
    testGroup?: true
    metric?: true
    startDate?: true
    endDate?: true
    pValue?: true
    winner?: true
    createdAt?: true
    _all?: true
  }

  export type ABTestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ABTest to aggregate.
     */
    where?: ABTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ABTests to fetch.
     */
    orderBy?: ABTestOrderByWithRelationInput | ABTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ABTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ABTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ABTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ABTests
    **/
    _count?: true | ABTestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ABTestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ABTestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ABTestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ABTestMaxAggregateInputType
  }

  export type GetABTestAggregateType<T extends ABTestAggregateArgs> = {
        [P in keyof T & keyof AggregateABTest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateABTest[P]>
      : GetScalarType<T[P], AggregateABTest[P]>
  }




  export type ABTestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ABTestWhereInput
    orderBy?: ABTestOrderByWithAggregationInput | ABTestOrderByWithAggregationInput[]
    by: ABTestScalarFieldEnum[] | ABTestScalarFieldEnum
    having?: ABTestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ABTestCountAggregateInputType | true
    _avg?: ABTestAvgAggregateInputType
    _sum?: ABTestSumAggregateInputType
    _min?: ABTestMinAggregateInputType
    _max?: ABTestMaxAggregateInputType
  }

  export type ABTestGroupByOutputType = {
    id: string
    name: string
    description: string | null
    variantA: JsonValue
    variantB: JsonValue
    controlGroup: string[]
    testGroup: string[]
    metric: string
    startDate: Date
    endDate: Date | null
    pValue: number | null
    winner: string | null
    createdAt: Date
    _count: ABTestCountAggregateOutputType | null
    _avg: ABTestAvgAggregateOutputType | null
    _sum: ABTestSumAggregateOutputType | null
    _min: ABTestMinAggregateOutputType | null
    _max: ABTestMaxAggregateOutputType | null
  }

  type GetABTestGroupByPayload<T extends ABTestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ABTestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ABTestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ABTestGroupByOutputType[P]>
            : GetScalarType<T[P], ABTestGroupByOutputType[P]>
        }
      >
    >


  export type ABTestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    variantA?: boolean
    variantB?: boolean
    controlGroup?: boolean
    testGroup?: boolean
    metric?: boolean
    startDate?: boolean
    endDate?: boolean
    pValue?: boolean
    winner?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aBTest"]>

  export type ABTestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    variantA?: boolean
    variantB?: boolean
    controlGroup?: boolean
    testGroup?: boolean
    metric?: boolean
    startDate?: boolean
    endDate?: boolean
    pValue?: boolean
    winner?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aBTest"]>

  export type ABTestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    variantA?: boolean
    variantB?: boolean
    controlGroup?: boolean
    testGroup?: boolean
    metric?: boolean
    startDate?: boolean
    endDate?: boolean
    pValue?: boolean
    winner?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aBTest"]>

  export type ABTestSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    variantA?: boolean
    variantB?: boolean
    controlGroup?: boolean
    testGroup?: boolean
    metric?: boolean
    startDate?: boolean
    endDate?: boolean
    pValue?: boolean
    winner?: boolean
    createdAt?: boolean
  }

  export type ABTestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "variantA" | "variantB" | "controlGroup" | "testGroup" | "metric" | "startDate" | "endDate" | "pValue" | "winner" | "createdAt", ExtArgs["result"]["aBTest"]>

  export type $ABTestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ABTest"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      variantA: Prisma.JsonValue
      variantB: Prisma.JsonValue
      controlGroup: string[]
      testGroup: string[]
      metric: string
      startDate: Date
      endDate: Date | null
      pValue: number | null
      winner: string | null
      createdAt: Date
    }, ExtArgs["result"]["aBTest"]>
    composites: {}
  }

  type ABTestGetPayload<S extends boolean | null | undefined | ABTestDefaultArgs> = $Result.GetResult<Prisma.$ABTestPayload, S>

  type ABTestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ABTestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ABTestCountAggregateInputType | true
    }

  export interface ABTestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ABTest'], meta: { name: 'ABTest' } }
    /**
     * Find zero or one ABTest that matches the filter.
     * @param {ABTestFindUniqueArgs} args - Arguments to find a ABTest
     * @example
     * // Get one ABTest
     * const aBTest = await prisma.aBTest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ABTestFindUniqueArgs>(args: SelectSubset<T, ABTestFindUniqueArgs<ExtArgs>>): Prisma__ABTestClient<$Result.GetResult<Prisma.$ABTestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ABTest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ABTestFindUniqueOrThrowArgs} args - Arguments to find a ABTest
     * @example
     * // Get one ABTest
     * const aBTest = await prisma.aBTest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ABTestFindUniqueOrThrowArgs>(args: SelectSubset<T, ABTestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ABTestClient<$Result.GetResult<Prisma.$ABTestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ABTest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ABTestFindFirstArgs} args - Arguments to find a ABTest
     * @example
     * // Get one ABTest
     * const aBTest = await prisma.aBTest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ABTestFindFirstArgs>(args?: SelectSubset<T, ABTestFindFirstArgs<ExtArgs>>): Prisma__ABTestClient<$Result.GetResult<Prisma.$ABTestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ABTest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ABTestFindFirstOrThrowArgs} args - Arguments to find a ABTest
     * @example
     * // Get one ABTest
     * const aBTest = await prisma.aBTest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ABTestFindFirstOrThrowArgs>(args?: SelectSubset<T, ABTestFindFirstOrThrowArgs<ExtArgs>>): Prisma__ABTestClient<$Result.GetResult<Prisma.$ABTestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ABTests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ABTestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ABTests
     * const aBTests = await prisma.aBTest.findMany()
     * 
     * // Get first 10 ABTests
     * const aBTests = await prisma.aBTest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aBTestWithIdOnly = await prisma.aBTest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ABTestFindManyArgs>(args?: SelectSubset<T, ABTestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ABTestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ABTest.
     * @param {ABTestCreateArgs} args - Arguments to create a ABTest.
     * @example
     * // Create one ABTest
     * const ABTest = await prisma.aBTest.create({
     *   data: {
     *     // ... data to create a ABTest
     *   }
     * })
     * 
     */
    create<T extends ABTestCreateArgs>(args: SelectSubset<T, ABTestCreateArgs<ExtArgs>>): Prisma__ABTestClient<$Result.GetResult<Prisma.$ABTestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ABTests.
     * @param {ABTestCreateManyArgs} args - Arguments to create many ABTests.
     * @example
     * // Create many ABTests
     * const aBTest = await prisma.aBTest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ABTestCreateManyArgs>(args?: SelectSubset<T, ABTestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ABTests and returns the data saved in the database.
     * @param {ABTestCreateManyAndReturnArgs} args - Arguments to create many ABTests.
     * @example
     * // Create many ABTests
     * const aBTest = await prisma.aBTest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ABTests and only return the `id`
     * const aBTestWithIdOnly = await prisma.aBTest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ABTestCreateManyAndReturnArgs>(args?: SelectSubset<T, ABTestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ABTestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ABTest.
     * @param {ABTestDeleteArgs} args - Arguments to delete one ABTest.
     * @example
     * // Delete one ABTest
     * const ABTest = await prisma.aBTest.delete({
     *   where: {
     *     // ... filter to delete one ABTest
     *   }
     * })
     * 
     */
    delete<T extends ABTestDeleteArgs>(args: SelectSubset<T, ABTestDeleteArgs<ExtArgs>>): Prisma__ABTestClient<$Result.GetResult<Prisma.$ABTestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ABTest.
     * @param {ABTestUpdateArgs} args - Arguments to update one ABTest.
     * @example
     * // Update one ABTest
     * const aBTest = await prisma.aBTest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ABTestUpdateArgs>(args: SelectSubset<T, ABTestUpdateArgs<ExtArgs>>): Prisma__ABTestClient<$Result.GetResult<Prisma.$ABTestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ABTests.
     * @param {ABTestDeleteManyArgs} args - Arguments to filter ABTests to delete.
     * @example
     * // Delete a few ABTests
     * const { count } = await prisma.aBTest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ABTestDeleteManyArgs>(args?: SelectSubset<T, ABTestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ABTests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ABTestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ABTests
     * const aBTest = await prisma.aBTest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ABTestUpdateManyArgs>(args: SelectSubset<T, ABTestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ABTests and returns the data updated in the database.
     * @param {ABTestUpdateManyAndReturnArgs} args - Arguments to update many ABTests.
     * @example
     * // Update many ABTests
     * const aBTest = await prisma.aBTest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ABTests and only return the `id`
     * const aBTestWithIdOnly = await prisma.aBTest.updateManyAndReturn({
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
    updateManyAndReturn<T extends ABTestUpdateManyAndReturnArgs>(args: SelectSubset<T, ABTestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ABTestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ABTest.
     * @param {ABTestUpsertArgs} args - Arguments to update or create a ABTest.
     * @example
     * // Update or create a ABTest
     * const aBTest = await prisma.aBTest.upsert({
     *   create: {
     *     // ... data to create a ABTest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ABTest we want to update
     *   }
     * })
     */
    upsert<T extends ABTestUpsertArgs>(args: SelectSubset<T, ABTestUpsertArgs<ExtArgs>>): Prisma__ABTestClient<$Result.GetResult<Prisma.$ABTestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ABTests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ABTestCountArgs} args - Arguments to filter ABTests to count.
     * @example
     * // Count the number of ABTests
     * const count = await prisma.aBTest.count({
     *   where: {
     *     // ... the filter for the ABTests we want to count
     *   }
     * })
    **/
    count<T extends ABTestCountArgs>(
      args?: Subset<T, ABTestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ABTestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ABTest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ABTestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ABTestAggregateArgs>(args: Subset<T, ABTestAggregateArgs>): Prisma.PrismaPromise<GetABTestAggregateType<T>>

    /**
     * Group by ABTest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ABTestGroupByArgs} args - Group by arguments.
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
      T extends ABTestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ABTestGroupByArgs['orderBy'] }
        : { orderBy?: ABTestGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ABTestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetABTestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ABTest model
   */
  readonly fields: ABTestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ABTest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ABTestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ABTest model
   */
  interface ABTestFieldRefs {
    readonly id: FieldRef<"ABTest", 'String'>
    readonly name: FieldRef<"ABTest", 'String'>
    readonly description: FieldRef<"ABTest", 'String'>
    readonly variantA: FieldRef<"ABTest", 'Json'>
    readonly variantB: FieldRef<"ABTest", 'Json'>
    readonly controlGroup: FieldRef<"ABTest", 'String[]'>
    readonly testGroup: FieldRef<"ABTest", 'String[]'>
    readonly metric: FieldRef<"ABTest", 'String'>
    readonly startDate: FieldRef<"ABTest", 'DateTime'>
    readonly endDate: FieldRef<"ABTest", 'DateTime'>
    readonly pValue: FieldRef<"ABTest", 'Float'>
    readonly winner: FieldRef<"ABTest", 'String'>
    readonly createdAt: FieldRef<"ABTest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ABTest findUnique
   */
  export type ABTestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ABTest
     */
    select?: ABTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ABTest
     */
    omit?: ABTestOmit<ExtArgs> | null
    /**
     * Filter, which ABTest to fetch.
     */
    where: ABTestWhereUniqueInput
  }

  /**
   * ABTest findUniqueOrThrow
   */
  export type ABTestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ABTest
     */
    select?: ABTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ABTest
     */
    omit?: ABTestOmit<ExtArgs> | null
    /**
     * Filter, which ABTest to fetch.
     */
    where: ABTestWhereUniqueInput
  }

  /**
   * ABTest findFirst
   */
  export type ABTestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ABTest
     */
    select?: ABTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ABTest
     */
    omit?: ABTestOmit<ExtArgs> | null
    /**
     * Filter, which ABTest to fetch.
     */
    where?: ABTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ABTests to fetch.
     */
    orderBy?: ABTestOrderByWithRelationInput | ABTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ABTests.
     */
    cursor?: ABTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ABTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ABTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ABTests.
     */
    distinct?: ABTestScalarFieldEnum | ABTestScalarFieldEnum[]
  }

  /**
   * ABTest findFirstOrThrow
   */
  export type ABTestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ABTest
     */
    select?: ABTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ABTest
     */
    omit?: ABTestOmit<ExtArgs> | null
    /**
     * Filter, which ABTest to fetch.
     */
    where?: ABTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ABTests to fetch.
     */
    orderBy?: ABTestOrderByWithRelationInput | ABTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ABTests.
     */
    cursor?: ABTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ABTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ABTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ABTests.
     */
    distinct?: ABTestScalarFieldEnum | ABTestScalarFieldEnum[]
  }

  /**
   * ABTest findMany
   */
  export type ABTestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ABTest
     */
    select?: ABTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ABTest
     */
    omit?: ABTestOmit<ExtArgs> | null
    /**
     * Filter, which ABTests to fetch.
     */
    where?: ABTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ABTests to fetch.
     */
    orderBy?: ABTestOrderByWithRelationInput | ABTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ABTests.
     */
    cursor?: ABTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ABTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ABTests.
     */
    skip?: number
    distinct?: ABTestScalarFieldEnum | ABTestScalarFieldEnum[]
  }

  /**
   * ABTest create
   */
  export type ABTestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ABTest
     */
    select?: ABTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ABTest
     */
    omit?: ABTestOmit<ExtArgs> | null
    /**
     * The data needed to create a ABTest.
     */
    data: XOR<ABTestCreateInput, ABTestUncheckedCreateInput>
  }

  /**
   * ABTest createMany
   */
  export type ABTestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ABTests.
     */
    data: ABTestCreateManyInput | ABTestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ABTest createManyAndReturn
   */
  export type ABTestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ABTest
     */
    select?: ABTestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ABTest
     */
    omit?: ABTestOmit<ExtArgs> | null
    /**
     * The data used to create many ABTests.
     */
    data: ABTestCreateManyInput | ABTestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ABTest update
   */
  export type ABTestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ABTest
     */
    select?: ABTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ABTest
     */
    omit?: ABTestOmit<ExtArgs> | null
    /**
     * The data needed to update a ABTest.
     */
    data: XOR<ABTestUpdateInput, ABTestUncheckedUpdateInput>
    /**
     * Choose, which ABTest to update.
     */
    where: ABTestWhereUniqueInput
  }

  /**
   * ABTest updateMany
   */
  export type ABTestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ABTests.
     */
    data: XOR<ABTestUpdateManyMutationInput, ABTestUncheckedUpdateManyInput>
    /**
     * Filter which ABTests to update
     */
    where?: ABTestWhereInput
    /**
     * Limit how many ABTests to update.
     */
    limit?: number
  }

  /**
   * ABTest updateManyAndReturn
   */
  export type ABTestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ABTest
     */
    select?: ABTestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ABTest
     */
    omit?: ABTestOmit<ExtArgs> | null
    /**
     * The data used to update ABTests.
     */
    data: XOR<ABTestUpdateManyMutationInput, ABTestUncheckedUpdateManyInput>
    /**
     * Filter which ABTests to update
     */
    where?: ABTestWhereInput
    /**
     * Limit how many ABTests to update.
     */
    limit?: number
  }

  /**
   * ABTest upsert
   */
  export type ABTestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ABTest
     */
    select?: ABTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ABTest
     */
    omit?: ABTestOmit<ExtArgs> | null
    /**
     * The filter to search for the ABTest to update in case it exists.
     */
    where: ABTestWhereUniqueInput
    /**
     * In case the ABTest found by the `where` argument doesn't exist, create a new ABTest with this data.
     */
    create: XOR<ABTestCreateInput, ABTestUncheckedCreateInput>
    /**
     * In case the ABTest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ABTestUpdateInput, ABTestUncheckedUpdateInput>
  }

  /**
   * ABTest delete
   */
  export type ABTestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ABTest
     */
    select?: ABTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ABTest
     */
    omit?: ABTestOmit<ExtArgs> | null
    /**
     * Filter which ABTest to delete.
     */
    where: ABTestWhereUniqueInput
  }

  /**
   * ABTest deleteMany
   */
  export type ABTestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ABTests to delete
     */
    where?: ABTestWhereInput
    /**
     * Limit how many ABTests to delete.
     */
    limit?: number
  }

  /**
   * ABTest without action
   */
  export type ABTestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ABTest
     */
    select?: ABTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ABTest
     */
    omit?: ABTestOmit<ExtArgs> | null
  }


  /**
   * Model FraudScore
   */

  export type AggregateFraudScore = {
    _count: FraudScoreCountAggregateOutputType | null
    _avg: FraudScoreAvgAggregateOutputType | null
    _sum: FraudScoreSumAggregateOutputType | null
    _min: FraudScoreMinAggregateOutputType | null
    _max: FraudScoreMaxAggregateOutputType | null
  }

  export type FraudScoreAvgAggregateOutputType = {
    score: number | null
  }

  export type FraudScoreSumAggregateOutputType = {
    score: number | null
  }

  export type FraudScoreMinAggregateOutputType = {
    id: string | null
    customerId: string | null
    orderId: string | null
    score: number | null
    flagged: boolean | null
    reviewedAt: Date | null
    reviewedBy: string | null
    decision: string | null
    createdAt: Date | null
  }

  export type FraudScoreMaxAggregateOutputType = {
    id: string | null
    customerId: string | null
    orderId: string | null
    score: number | null
    flagged: boolean | null
    reviewedAt: Date | null
    reviewedBy: string | null
    decision: string | null
    createdAt: Date | null
  }

  export type FraudScoreCountAggregateOutputType = {
    id: number
    customerId: number
    orderId: number
    score: number
    riskFactors: number
    flagged: number
    reviewedAt: number
    reviewedBy: number
    decision: number
    createdAt: number
    _all: number
  }


  export type FraudScoreAvgAggregateInputType = {
    score?: true
  }

  export type FraudScoreSumAggregateInputType = {
    score?: true
  }

  export type FraudScoreMinAggregateInputType = {
    id?: true
    customerId?: true
    orderId?: true
    score?: true
    flagged?: true
    reviewedAt?: true
    reviewedBy?: true
    decision?: true
    createdAt?: true
  }

  export type FraudScoreMaxAggregateInputType = {
    id?: true
    customerId?: true
    orderId?: true
    score?: true
    flagged?: true
    reviewedAt?: true
    reviewedBy?: true
    decision?: true
    createdAt?: true
  }

  export type FraudScoreCountAggregateInputType = {
    id?: true
    customerId?: true
    orderId?: true
    score?: true
    riskFactors?: true
    flagged?: true
    reviewedAt?: true
    reviewedBy?: true
    decision?: true
    createdAt?: true
    _all?: true
  }

  export type FraudScoreAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FraudScore to aggregate.
     */
    where?: FraudScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FraudScores to fetch.
     */
    orderBy?: FraudScoreOrderByWithRelationInput | FraudScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FraudScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FraudScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FraudScores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FraudScores
    **/
    _count?: true | FraudScoreCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FraudScoreAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FraudScoreSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FraudScoreMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FraudScoreMaxAggregateInputType
  }

  export type GetFraudScoreAggregateType<T extends FraudScoreAggregateArgs> = {
        [P in keyof T & keyof AggregateFraudScore]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFraudScore[P]>
      : GetScalarType<T[P], AggregateFraudScore[P]>
  }




  export type FraudScoreGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FraudScoreWhereInput
    orderBy?: FraudScoreOrderByWithAggregationInput | FraudScoreOrderByWithAggregationInput[]
    by: FraudScoreScalarFieldEnum[] | FraudScoreScalarFieldEnum
    having?: FraudScoreScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FraudScoreCountAggregateInputType | true
    _avg?: FraudScoreAvgAggregateInputType
    _sum?: FraudScoreSumAggregateInputType
    _min?: FraudScoreMinAggregateInputType
    _max?: FraudScoreMaxAggregateInputType
  }

  export type FraudScoreGroupByOutputType = {
    id: string
    customerId: string
    orderId: string
    score: number
    riskFactors: string[]
    flagged: boolean
    reviewedAt: Date | null
    reviewedBy: string | null
    decision: string | null
    createdAt: Date
    _count: FraudScoreCountAggregateOutputType | null
    _avg: FraudScoreAvgAggregateOutputType | null
    _sum: FraudScoreSumAggregateOutputType | null
    _min: FraudScoreMinAggregateOutputType | null
    _max: FraudScoreMaxAggregateOutputType | null
  }

  type GetFraudScoreGroupByPayload<T extends FraudScoreGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FraudScoreGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FraudScoreGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FraudScoreGroupByOutputType[P]>
            : GetScalarType<T[P], FraudScoreGroupByOutputType[P]>
        }
      >
    >


  export type FraudScoreSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    orderId?: boolean
    score?: boolean
    riskFactors?: boolean
    flagged?: boolean
    reviewedAt?: boolean
    reviewedBy?: boolean
    decision?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["fraudScore"]>

  export type FraudScoreSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    orderId?: boolean
    score?: boolean
    riskFactors?: boolean
    flagged?: boolean
    reviewedAt?: boolean
    reviewedBy?: boolean
    decision?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["fraudScore"]>

  export type FraudScoreSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    orderId?: boolean
    score?: boolean
    riskFactors?: boolean
    flagged?: boolean
    reviewedAt?: boolean
    reviewedBy?: boolean
    decision?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["fraudScore"]>

  export type FraudScoreSelectScalar = {
    id?: boolean
    customerId?: boolean
    orderId?: boolean
    score?: boolean
    riskFactors?: boolean
    flagged?: boolean
    reviewedAt?: boolean
    reviewedBy?: boolean
    decision?: boolean
    createdAt?: boolean
  }

  export type FraudScoreOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "customerId" | "orderId" | "score" | "riskFactors" | "flagged" | "reviewedAt" | "reviewedBy" | "decision" | "createdAt", ExtArgs["result"]["fraudScore"]>

  export type $FraudScorePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FraudScore"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      customerId: string
      orderId: string
      score: number
      riskFactors: string[]
      flagged: boolean
      reviewedAt: Date | null
      reviewedBy: string | null
      decision: string | null
      createdAt: Date
    }, ExtArgs["result"]["fraudScore"]>
    composites: {}
  }

  type FraudScoreGetPayload<S extends boolean | null | undefined | FraudScoreDefaultArgs> = $Result.GetResult<Prisma.$FraudScorePayload, S>

  type FraudScoreCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FraudScoreFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FraudScoreCountAggregateInputType | true
    }

  export interface FraudScoreDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FraudScore'], meta: { name: 'FraudScore' } }
    /**
     * Find zero or one FraudScore that matches the filter.
     * @param {FraudScoreFindUniqueArgs} args - Arguments to find a FraudScore
     * @example
     * // Get one FraudScore
     * const fraudScore = await prisma.fraudScore.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FraudScoreFindUniqueArgs>(args: SelectSubset<T, FraudScoreFindUniqueArgs<ExtArgs>>): Prisma__FraudScoreClient<$Result.GetResult<Prisma.$FraudScorePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FraudScore that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FraudScoreFindUniqueOrThrowArgs} args - Arguments to find a FraudScore
     * @example
     * // Get one FraudScore
     * const fraudScore = await prisma.fraudScore.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FraudScoreFindUniqueOrThrowArgs>(args: SelectSubset<T, FraudScoreFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FraudScoreClient<$Result.GetResult<Prisma.$FraudScorePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FraudScore that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FraudScoreFindFirstArgs} args - Arguments to find a FraudScore
     * @example
     * // Get one FraudScore
     * const fraudScore = await prisma.fraudScore.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FraudScoreFindFirstArgs>(args?: SelectSubset<T, FraudScoreFindFirstArgs<ExtArgs>>): Prisma__FraudScoreClient<$Result.GetResult<Prisma.$FraudScorePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FraudScore that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FraudScoreFindFirstOrThrowArgs} args - Arguments to find a FraudScore
     * @example
     * // Get one FraudScore
     * const fraudScore = await prisma.fraudScore.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FraudScoreFindFirstOrThrowArgs>(args?: SelectSubset<T, FraudScoreFindFirstOrThrowArgs<ExtArgs>>): Prisma__FraudScoreClient<$Result.GetResult<Prisma.$FraudScorePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FraudScores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FraudScoreFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FraudScores
     * const fraudScores = await prisma.fraudScore.findMany()
     * 
     * // Get first 10 FraudScores
     * const fraudScores = await prisma.fraudScore.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fraudScoreWithIdOnly = await prisma.fraudScore.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FraudScoreFindManyArgs>(args?: SelectSubset<T, FraudScoreFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FraudScorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FraudScore.
     * @param {FraudScoreCreateArgs} args - Arguments to create a FraudScore.
     * @example
     * // Create one FraudScore
     * const FraudScore = await prisma.fraudScore.create({
     *   data: {
     *     // ... data to create a FraudScore
     *   }
     * })
     * 
     */
    create<T extends FraudScoreCreateArgs>(args: SelectSubset<T, FraudScoreCreateArgs<ExtArgs>>): Prisma__FraudScoreClient<$Result.GetResult<Prisma.$FraudScorePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FraudScores.
     * @param {FraudScoreCreateManyArgs} args - Arguments to create many FraudScores.
     * @example
     * // Create many FraudScores
     * const fraudScore = await prisma.fraudScore.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FraudScoreCreateManyArgs>(args?: SelectSubset<T, FraudScoreCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FraudScores and returns the data saved in the database.
     * @param {FraudScoreCreateManyAndReturnArgs} args - Arguments to create many FraudScores.
     * @example
     * // Create many FraudScores
     * const fraudScore = await prisma.fraudScore.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FraudScores and only return the `id`
     * const fraudScoreWithIdOnly = await prisma.fraudScore.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FraudScoreCreateManyAndReturnArgs>(args?: SelectSubset<T, FraudScoreCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FraudScorePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FraudScore.
     * @param {FraudScoreDeleteArgs} args - Arguments to delete one FraudScore.
     * @example
     * // Delete one FraudScore
     * const FraudScore = await prisma.fraudScore.delete({
     *   where: {
     *     // ... filter to delete one FraudScore
     *   }
     * })
     * 
     */
    delete<T extends FraudScoreDeleteArgs>(args: SelectSubset<T, FraudScoreDeleteArgs<ExtArgs>>): Prisma__FraudScoreClient<$Result.GetResult<Prisma.$FraudScorePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FraudScore.
     * @param {FraudScoreUpdateArgs} args - Arguments to update one FraudScore.
     * @example
     * // Update one FraudScore
     * const fraudScore = await prisma.fraudScore.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FraudScoreUpdateArgs>(args: SelectSubset<T, FraudScoreUpdateArgs<ExtArgs>>): Prisma__FraudScoreClient<$Result.GetResult<Prisma.$FraudScorePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FraudScores.
     * @param {FraudScoreDeleteManyArgs} args - Arguments to filter FraudScores to delete.
     * @example
     * // Delete a few FraudScores
     * const { count } = await prisma.fraudScore.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FraudScoreDeleteManyArgs>(args?: SelectSubset<T, FraudScoreDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FraudScores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FraudScoreUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FraudScores
     * const fraudScore = await prisma.fraudScore.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FraudScoreUpdateManyArgs>(args: SelectSubset<T, FraudScoreUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FraudScores and returns the data updated in the database.
     * @param {FraudScoreUpdateManyAndReturnArgs} args - Arguments to update many FraudScores.
     * @example
     * // Update many FraudScores
     * const fraudScore = await prisma.fraudScore.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FraudScores and only return the `id`
     * const fraudScoreWithIdOnly = await prisma.fraudScore.updateManyAndReturn({
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
    updateManyAndReturn<T extends FraudScoreUpdateManyAndReturnArgs>(args: SelectSubset<T, FraudScoreUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FraudScorePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FraudScore.
     * @param {FraudScoreUpsertArgs} args - Arguments to update or create a FraudScore.
     * @example
     * // Update or create a FraudScore
     * const fraudScore = await prisma.fraudScore.upsert({
     *   create: {
     *     // ... data to create a FraudScore
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FraudScore we want to update
     *   }
     * })
     */
    upsert<T extends FraudScoreUpsertArgs>(args: SelectSubset<T, FraudScoreUpsertArgs<ExtArgs>>): Prisma__FraudScoreClient<$Result.GetResult<Prisma.$FraudScorePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FraudScores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FraudScoreCountArgs} args - Arguments to filter FraudScores to count.
     * @example
     * // Count the number of FraudScores
     * const count = await prisma.fraudScore.count({
     *   where: {
     *     // ... the filter for the FraudScores we want to count
     *   }
     * })
    **/
    count<T extends FraudScoreCountArgs>(
      args?: Subset<T, FraudScoreCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FraudScoreCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FraudScore.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FraudScoreAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FraudScoreAggregateArgs>(args: Subset<T, FraudScoreAggregateArgs>): Prisma.PrismaPromise<GetFraudScoreAggregateType<T>>

    /**
     * Group by FraudScore.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FraudScoreGroupByArgs} args - Group by arguments.
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
      T extends FraudScoreGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FraudScoreGroupByArgs['orderBy'] }
        : { orderBy?: FraudScoreGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FraudScoreGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFraudScoreGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FraudScore model
   */
  readonly fields: FraudScoreFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FraudScore.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FraudScoreClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the FraudScore model
   */
  interface FraudScoreFieldRefs {
    readonly id: FieldRef<"FraudScore", 'String'>
    readonly customerId: FieldRef<"FraudScore", 'String'>
    readonly orderId: FieldRef<"FraudScore", 'String'>
    readonly score: FieldRef<"FraudScore", 'Float'>
    readonly riskFactors: FieldRef<"FraudScore", 'String[]'>
    readonly flagged: FieldRef<"FraudScore", 'Boolean'>
    readonly reviewedAt: FieldRef<"FraudScore", 'DateTime'>
    readonly reviewedBy: FieldRef<"FraudScore", 'String'>
    readonly decision: FieldRef<"FraudScore", 'String'>
    readonly createdAt: FieldRef<"FraudScore", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FraudScore findUnique
   */
  export type FraudScoreFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudScore
     */
    select?: FraudScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FraudScore
     */
    omit?: FraudScoreOmit<ExtArgs> | null
    /**
     * Filter, which FraudScore to fetch.
     */
    where: FraudScoreWhereUniqueInput
  }

  /**
   * FraudScore findUniqueOrThrow
   */
  export type FraudScoreFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudScore
     */
    select?: FraudScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FraudScore
     */
    omit?: FraudScoreOmit<ExtArgs> | null
    /**
     * Filter, which FraudScore to fetch.
     */
    where: FraudScoreWhereUniqueInput
  }

  /**
   * FraudScore findFirst
   */
  export type FraudScoreFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudScore
     */
    select?: FraudScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FraudScore
     */
    omit?: FraudScoreOmit<ExtArgs> | null
    /**
     * Filter, which FraudScore to fetch.
     */
    where?: FraudScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FraudScores to fetch.
     */
    orderBy?: FraudScoreOrderByWithRelationInput | FraudScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FraudScores.
     */
    cursor?: FraudScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FraudScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FraudScores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FraudScores.
     */
    distinct?: FraudScoreScalarFieldEnum | FraudScoreScalarFieldEnum[]
  }

  /**
   * FraudScore findFirstOrThrow
   */
  export type FraudScoreFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudScore
     */
    select?: FraudScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FraudScore
     */
    omit?: FraudScoreOmit<ExtArgs> | null
    /**
     * Filter, which FraudScore to fetch.
     */
    where?: FraudScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FraudScores to fetch.
     */
    orderBy?: FraudScoreOrderByWithRelationInput | FraudScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FraudScores.
     */
    cursor?: FraudScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FraudScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FraudScores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FraudScores.
     */
    distinct?: FraudScoreScalarFieldEnum | FraudScoreScalarFieldEnum[]
  }

  /**
   * FraudScore findMany
   */
  export type FraudScoreFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudScore
     */
    select?: FraudScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FraudScore
     */
    omit?: FraudScoreOmit<ExtArgs> | null
    /**
     * Filter, which FraudScores to fetch.
     */
    where?: FraudScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FraudScores to fetch.
     */
    orderBy?: FraudScoreOrderByWithRelationInput | FraudScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FraudScores.
     */
    cursor?: FraudScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FraudScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FraudScores.
     */
    skip?: number
    distinct?: FraudScoreScalarFieldEnum | FraudScoreScalarFieldEnum[]
  }

  /**
   * FraudScore create
   */
  export type FraudScoreCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudScore
     */
    select?: FraudScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FraudScore
     */
    omit?: FraudScoreOmit<ExtArgs> | null
    /**
     * The data needed to create a FraudScore.
     */
    data: XOR<FraudScoreCreateInput, FraudScoreUncheckedCreateInput>
  }

  /**
   * FraudScore createMany
   */
  export type FraudScoreCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FraudScores.
     */
    data: FraudScoreCreateManyInput | FraudScoreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FraudScore createManyAndReturn
   */
  export type FraudScoreCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudScore
     */
    select?: FraudScoreSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FraudScore
     */
    omit?: FraudScoreOmit<ExtArgs> | null
    /**
     * The data used to create many FraudScores.
     */
    data: FraudScoreCreateManyInput | FraudScoreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FraudScore update
   */
  export type FraudScoreUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudScore
     */
    select?: FraudScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FraudScore
     */
    omit?: FraudScoreOmit<ExtArgs> | null
    /**
     * The data needed to update a FraudScore.
     */
    data: XOR<FraudScoreUpdateInput, FraudScoreUncheckedUpdateInput>
    /**
     * Choose, which FraudScore to update.
     */
    where: FraudScoreWhereUniqueInput
  }

  /**
   * FraudScore updateMany
   */
  export type FraudScoreUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FraudScores.
     */
    data: XOR<FraudScoreUpdateManyMutationInput, FraudScoreUncheckedUpdateManyInput>
    /**
     * Filter which FraudScores to update
     */
    where?: FraudScoreWhereInput
    /**
     * Limit how many FraudScores to update.
     */
    limit?: number
  }

  /**
   * FraudScore updateManyAndReturn
   */
  export type FraudScoreUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudScore
     */
    select?: FraudScoreSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FraudScore
     */
    omit?: FraudScoreOmit<ExtArgs> | null
    /**
     * The data used to update FraudScores.
     */
    data: XOR<FraudScoreUpdateManyMutationInput, FraudScoreUncheckedUpdateManyInput>
    /**
     * Filter which FraudScores to update
     */
    where?: FraudScoreWhereInput
    /**
     * Limit how many FraudScores to update.
     */
    limit?: number
  }

  /**
   * FraudScore upsert
   */
  export type FraudScoreUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudScore
     */
    select?: FraudScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FraudScore
     */
    omit?: FraudScoreOmit<ExtArgs> | null
    /**
     * The filter to search for the FraudScore to update in case it exists.
     */
    where: FraudScoreWhereUniqueInput
    /**
     * In case the FraudScore found by the `where` argument doesn't exist, create a new FraudScore with this data.
     */
    create: XOR<FraudScoreCreateInput, FraudScoreUncheckedCreateInput>
    /**
     * In case the FraudScore was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FraudScoreUpdateInput, FraudScoreUncheckedUpdateInput>
  }

  /**
   * FraudScore delete
   */
  export type FraudScoreDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudScore
     */
    select?: FraudScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FraudScore
     */
    omit?: FraudScoreOmit<ExtArgs> | null
    /**
     * Filter which FraudScore to delete.
     */
    where: FraudScoreWhereUniqueInput
  }

  /**
   * FraudScore deleteMany
   */
  export type FraudScoreDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FraudScores to delete
     */
    where?: FraudScoreWhereInput
    /**
     * Limit how many FraudScores to delete.
     */
    limit?: number
  }

  /**
   * FraudScore without action
   */
  export type FraudScoreDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FraudScore
     */
    select?: FraudScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FraudScore
     */
    omit?: FraudScoreOmit<ExtArgs> | null
  }


  /**
   * Model MLModel
   */

  export type AggregateMLModel = {
    _count: MLModelCountAggregateOutputType | null
    _avg: MLModelAvgAggregateOutputType | null
    _sum: MLModelSumAggregateOutputType | null
    _min: MLModelMinAggregateOutputType | null
    _max: MLModelMaxAggregateOutputType | null
  }

  export type MLModelAvgAggregateOutputType = {
    accuracy: number | null
    precision: number | null
    recall: number | null
    f1Score: number | null
  }

  export type MLModelSumAggregateOutputType = {
    accuracy: number | null
    precision: number | null
    recall: number | null
    f1Score: number | null
  }

  export type MLModelMinAggregateOutputType = {
    id: string | null
    name: string | null
    version: string | null
    type: string | null
    framework: string | null
    modelPath: string | null
    accuracy: number | null
    precision: number | null
    recall: number | null
    f1Score: number | null
    deployedAt: Date | null
    lastEvaluated: Date | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MLModelMaxAggregateOutputType = {
    id: string | null
    name: string | null
    version: string | null
    type: string | null
    framework: string | null
    modelPath: string | null
    accuracy: number | null
    precision: number | null
    recall: number | null
    f1Score: number | null
    deployedAt: Date | null
    lastEvaluated: Date | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MLModelCountAggregateOutputType = {
    id: number
    name: number
    version: number
    type: number
    framework: number
    modelPath: number
    accuracy: number
    precision: number
    recall: number
    f1Score: number
    deployedAt: number
    lastEvaluated: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MLModelAvgAggregateInputType = {
    accuracy?: true
    precision?: true
    recall?: true
    f1Score?: true
  }

  export type MLModelSumAggregateInputType = {
    accuracy?: true
    precision?: true
    recall?: true
    f1Score?: true
  }

  export type MLModelMinAggregateInputType = {
    id?: true
    name?: true
    version?: true
    type?: true
    framework?: true
    modelPath?: true
    accuracy?: true
    precision?: true
    recall?: true
    f1Score?: true
    deployedAt?: true
    lastEvaluated?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MLModelMaxAggregateInputType = {
    id?: true
    name?: true
    version?: true
    type?: true
    framework?: true
    modelPath?: true
    accuracy?: true
    precision?: true
    recall?: true
    f1Score?: true
    deployedAt?: true
    lastEvaluated?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MLModelCountAggregateInputType = {
    id?: true
    name?: true
    version?: true
    type?: true
    framework?: true
    modelPath?: true
    accuracy?: true
    precision?: true
    recall?: true
    f1Score?: true
    deployedAt?: true
    lastEvaluated?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MLModelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MLModel to aggregate.
     */
    where?: MLModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MLModels to fetch.
     */
    orderBy?: MLModelOrderByWithRelationInput | MLModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MLModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MLModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MLModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MLModels
    **/
    _count?: true | MLModelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MLModelAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MLModelSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MLModelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MLModelMaxAggregateInputType
  }

  export type GetMLModelAggregateType<T extends MLModelAggregateArgs> = {
        [P in keyof T & keyof AggregateMLModel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMLModel[P]>
      : GetScalarType<T[P], AggregateMLModel[P]>
  }




  export type MLModelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MLModelWhereInput
    orderBy?: MLModelOrderByWithAggregationInput | MLModelOrderByWithAggregationInput[]
    by: MLModelScalarFieldEnum[] | MLModelScalarFieldEnum
    having?: MLModelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MLModelCountAggregateInputType | true
    _avg?: MLModelAvgAggregateInputType
    _sum?: MLModelSumAggregateInputType
    _min?: MLModelMinAggregateInputType
    _max?: MLModelMaxAggregateInputType
  }

  export type MLModelGroupByOutputType = {
    id: string
    name: string
    version: string
    type: string
    framework: string
    modelPath: string
    accuracy: number | null
    precision: number | null
    recall: number | null
    f1Score: number | null
    deployedAt: Date | null
    lastEvaluated: Date | null
    status: string
    createdAt: Date
    updatedAt: Date
    _count: MLModelCountAggregateOutputType | null
    _avg: MLModelAvgAggregateOutputType | null
    _sum: MLModelSumAggregateOutputType | null
    _min: MLModelMinAggregateOutputType | null
    _max: MLModelMaxAggregateOutputType | null
  }

  type GetMLModelGroupByPayload<T extends MLModelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MLModelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MLModelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MLModelGroupByOutputType[P]>
            : GetScalarType<T[P], MLModelGroupByOutputType[P]>
        }
      >
    >


  export type MLModelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    version?: boolean
    type?: boolean
    framework?: boolean
    modelPath?: boolean
    accuracy?: boolean
    precision?: boolean
    recall?: boolean
    f1Score?: boolean
    deployedAt?: boolean
    lastEvaluated?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mLModel"]>

  export type MLModelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    version?: boolean
    type?: boolean
    framework?: boolean
    modelPath?: boolean
    accuracy?: boolean
    precision?: boolean
    recall?: boolean
    f1Score?: boolean
    deployedAt?: boolean
    lastEvaluated?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mLModel"]>

  export type MLModelSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    version?: boolean
    type?: boolean
    framework?: boolean
    modelPath?: boolean
    accuracy?: boolean
    precision?: boolean
    recall?: boolean
    f1Score?: boolean
    deployedAt?: boolean
    lastEvaluated?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mLModel"]>

  export type MLModelSelectScalar = {
    id?: boolean
    name?: boolean
    version?: boolean
    type?: boolean
    framework?: boolean
    modelPath?: boolean
    accuracy?: boolean
    precision?: boolean
    recall?: boolean
    f1Score?: boolean
    deployedAt?: boolean
    lastEvaluated?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MLModelOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "version" | "type" | "framework" | "modelPath" | "accuracy" | "precision" | "recall" | "f1Score" | "deployedAt" | "lastEvaluated" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["mLModel"]>

  export type $MLModelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MLModel"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      version: string
      type: string
      framework: string
      modelPath: string
      accuracy: number | null
      precision: number | null
      recall: number | null
      f1Score: number | null
      deployedAt: Date | null
      lastEvaluated: Date | null
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["mLModel"]>
    composites: {}
  }

  type MLModelGetPayload<S extends boolean | null | undefined | MLModelDefaultArgs> = $Result.GetResult<Prisma.$MLModelPayload, S>

  type MLModelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MLModelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MLModelCountAggregateInputType | true
    }

  export interface MLModelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MLModel'], meta: { name: 'MLModel' } }
    /**
     * Find zero or one MLModel that matches the filter.
     * @param {MLModelFindUniqueArgs} args - Arguments to find a MLModel
     * @example
     * // Get one MLModel
     * const mLModel = await prisma.mLModel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MLModelFindUniqueArgs>(args: SelectSubset<T, MLModelFindUniqueArgs<ExtArgs>>): Prisma__MLModelClient<$Result.GetResult<Prisma.$MLModelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MLModel that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MLModelFindUniqueOrThrowArgs} args - Arguments to find a MLModel
     * @example
     * // Get one MLModel
     * const mLModel = await prisma.mLModel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MLModelFindUniqueOrThrowArgs>(args: SelectSubset<T, MLModelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MLModelClient<$Result.GetResult<Prisma.$MLModelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MLModel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MLModelFindFirstArgs} args - Arguments to find a MLModel
     * @example
     * // Get one MLModel
     * const mLModel = await prisma.mLModel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MLModelFindFirstArgs>(args?: SelectSubset<T, MLModelFindFirstArgs<ExtArgs>>): Prisma__MLModelClient<$Result.GetResult<Prisma.$MLModelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MLModel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MLModelFindFirstOrThrowArgs} args - Arguments to find a MLModel
     * @example
     * // Get one MLModel
     * const mLModel = await prisma.mLModel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MLModelFindFirstOrThrowArgs>(args?: SelectSubset<T, MLModelFindFirstOrThrowArgs<ExtArgs>>): Prisma__MLModelClient<$Result.GetResult<Prisma.$MLModelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MLModels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MLModelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MLModels
     * const mLModels = await prisma.mLModel.findMany()
     * 
     * // Get first 10 MLModels
     * const mLModels = await prisma.mLModel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mLModelWithIdOnly = await prisma.mLModel.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MLModelFindManyArgs>(args?: SelectSubset<T, MLModelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MLModelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MLModel.
     * @param {MLModelCreateArgs} args - Arguments to create a MLModel.
     * @example
     * // Create one MLModel
     * const MLModel = await prisma.mLModel.create({
     *   data: {
     *     // ... data to create a MLModel
     *   }
     * })
     * 
     */
    create<T extends MLModelCreateArgs>(args: SelectSubset<T, MLModelCreateArgs<ExtArgs>>): Prisma__MLModelClient<$Result.GetResult<Prisma.$MLModelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MLModels.
     * @param {MLModelCreateManyArgs} args - Arguments to create many MLModels.
     * @example
     * // Create many MLModels
     * const mLModel = await prisma.mLModel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MLModelCreateManyArgs>(args?: SelectSubset<T, MLModelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MLModels and returns the data saved in the database.
     * @param {MLModelCreateManyAndReturnArgs} args - Arguments to create many MLModels.
     * @example
     * // Create many MLModels
     * const mLModel = await prisma.mLModel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MLModels and only return the `id`
     * const mLModelWithIdOnly = await prisma.mLModel.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MLModelCreateManyAndReturnArgs>(args?: SelectSubset<T, MLModelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MLModelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MLModel.
     * @param {MLModelDeleteArgs} args - Arguments to delete one MLModel.
     * @example
     * // Delete one MLModel
     * const MLModel = await prisma.mLModel.delete({
     *   where: {
     *     // ... filter to delete one MLModel
     *   }
     * })
     * 
     */
    delete<T extends MLModelDeleteArgs>(args: SelectSubset<T, MLModelDeleteArgs<ExtArgs>>): Prisma__MLModelClient<$Result.GetResult<Prisma.$MLModelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MLModel.
     * @param {MLModelUpdateArgs} args - Arguments to update one MLModel.
     * @example
     * // Update one MLModel
     * const mLModel = await prisma.mLModel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MLModelUpdateArgs>(args: SelectSubset<T, MLModelUpdateArgs<ExtArgs>>): Prisma__MLModelClient<$Result.GetResult<Prisma.$MLModelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MLModels.
     * @param {MLModelDeleteManyArgs} args - Arguments to filter MLModels to delete.
     * @example
     * // Delete a few MLModels
     * const { count } = await prisma.mLModel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MLModelDeleteManyArgs>(args?: SelectSubset<T, MLModelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MLModels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MLModelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MLModels
     * const mLModel = await prisma.mLModel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MLModelUpdateManyArgs>(args: SelectSubset<T, MLModelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MLModels and returns the data updated in the database.
     * @param {MLModelUpdateManyAndReturnArgs} args - Arguments to update many MLModels.
     * @example
     * // Update many MLModels
     * const mLModel = await prisma.mLModel.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MLModels and only return the `id`
     * const mLModelWithIdOnly = await prisma.mLModel.updateManyAndReturn({
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
    updateManyAndReturn<T extends MLModelUpdateManyAndReturnArgs>(args: SelectSubset<T, MLModelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MLModelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MLModel.
     * @param {MLModelUpsertArgs} args - Arguments to update or create a MLModel.
     * @example
     * // Update or create a MLModel
     * const mLModel = await prisma.mLModel.upsert({
     *   create: {
     *     // ... data to create a MLModel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MLModel we want to update
     *   }
     * })
     */
    upsert<T extends MLModelUpsertArgs>(args: SelectSubset<T, MLModelUpsertArgs<ExtArgs>>): Prisma__MLModelClient<$Result.GetResult<Prisma.$MLModelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MLModels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MLModelCountArgs} args - Arguments to filter MLModels to count.
     * @example
     * // Count the number of MLModels
     * const count = await prisma.mLModel.count({
     *   where: {
     *     // ... the filter for the MLModels we want to count
     *   }
     * })
    **/
    count<T extends MLModelCountArgs>(
      args?: Subset<T, MLModelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MLModelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MLModel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MLModelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MLModelAggregateArgs>(args: Subset<T, MLModelAggregateArgs>): Prisma.PrismaPromise<GetMLModelAggregateType<T>>

    /**
     * Group by MLModel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MLModelGroupByArgs} args - Group by arguments.
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
      T extends MLModelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MLModelGroupByArgs['orderBy'] }
        : { orderBy?: MLModelGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MLModelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMLModelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MLModel model
   */
  readonly fields: MLModelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MLModel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MLModelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the MLModel model
   */
  interface MLModelFieldRefs {
    readonly id: FieldRef<"MLModel", 'String'>
    readonly name: FieldRef<"MLModel", 'String'>
    readonly version: FieldRef<"MLModel", 'String'>
    readonly type: FieldRef<"MLModel", 'String'>
    readonly framework: FieldRef<"MLModel", 'String'>
    readonly modelPath: FieldRef<"MLModel", 'String'>
    readonly accuracy: FieldRef<"MLModel", 'Float'>
    readonly precision: FieldRef<"MLModel", 'Float'>
    readonly recall: FieldRef<"MLModel", 'Float'>
    readonly f1Score: FieldRef<"MLModel", 'Float'>
    readonly deployedAt: FieldRef<"MLModel", 'DateTime'>
    readonly lastEvaluated: FieldRef<"MLModel", 'DateTime'>
    readonly status: FieldRef<"MLModel", 'String'>
    readonly createdAt: FieldRef<"MLModel", 'DateTime'>
    readonly updatedAt: FieldRef<"MLModel", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MLModel findUnique
   */
  export type MLModelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MLModel
     */
    select?: MLModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MLModel
     */
    omit?: MLModelOmit<ExtArgs> | null
    /**
     * Filter, which MLModel to fetch.
     */
    where: MLModelWhereUniqueInput
  }

  /**
   * MLModel findUniqueOrThrow
   */
  export type MLModelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MLModel
     */
    select?: MLModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MLModel
     */
    omit?: MLModelOmit<ExtArgs> | null
    /**
     * Filter, which MLModel to fetch.
     */
    where: MLModelWhereUniqueInput
  }

  /**
   * MLModel findFirst
   */
  export type MLModelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MLModel
     */
    select?: MLModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MLModel
     */
    omit?: MLModelOmit<ExtArgs> | null
    /**
     * Filter, which MLModel to fetch.
     */
    where?: MLModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MLModels to fetch.
     */
    orderBy?: MLModelOrderByWithRelationInput | MLModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MLModels.
     */
    cursor?: MLModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MLModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MLModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MLModels.
     */
    distinct?: MLModelScalarFieldEnum | MLModelScalarFieldEnum[]
  }

  /**
   * MLModel findFirstOrThrow
   */
  export type MLModelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MLModel
     */
    select?: MLModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MLModel
     */
    omit?: MLModelOmit<ExtArgs> | null
    /**
     * Filter, which MLModel to fetch.
     */
    where?: MLModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MLModels to fetch.
     */
    orderBy?: MLModelOrderByWithRelationInput | MLModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MLModels.
     */
    cursor?: MLModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MLModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MLModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MLModels.
     */
    distinct?: MLModelScalarFieldEnum | MLModelScalarFieldEnum[]
  }

  /**
   * MLModel findMany
   */
  export type MLModelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MLModel
     */
    select?: MLModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MLModel
     */
    omit?: MLModelOmit<ExtArgs> | null
    /**
     * Filter, which MLModels to fetch.
     */
    where?: MLModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MLModels to fetch.
     */
    orderBy?: MLModelOrderByWithRelationInput | MLModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MLModels.
     */
    cursor?: MLModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MLModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MLModels.
     */
    skip?: number
    distinct?: MLModelScalarFieldEnum | MLModelScalarFieldEnum[]
  }

  /**
   * MLModel create
   */
  export type MLModelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MLModel
     */
    select?: MLModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MLModel
     */
    omit?: MLModelOmit<ExtArgs> | null
    /**
     * The data needed to create a MLModel.
     */
    data: XOR<MLModelCreateInput, MLModelUncheckedCreateInput>
  }

  /**
   * MLModel createMany
   */
  export type MLModelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MLModels.
     */
    data: MLModelCreateManyInput | MLModelCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MLModel createManyAndReturn
   */
  export type MLModelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MLModel
     */
    select?: MLModelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MLModel
     */
    omit?: MLModelOmit<ExtArgs> | null
    /**
     * The data used to create many MLModels.
     */
    data: MLModelCreateManyInput | MLModelCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MLModel update
   */
  export type MLModelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MLModel
     */
    select?: MLModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MLModel
     */
    omit?: MLModelOmit<ExtArgs> | null
    /**
     * The data needed to update a MLModel.
     */
    data: XOR<MLModelUpdateInput, MLModelUncheckedUpdateInput>
    /**
     * Choose, which MLModel to update.
     */
    where: MLModelWhereUniqueInput
  }

  /**
   * MLModel updateMany
   */
  export type MLModelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MLModels.
     */
    data: XOR<MLModelUpdateManyMutationInput, MLModelUncheckedUpdateManyInput>
    /**
     * Filter which MLModels to update
     */
    where?: MLModelWhereInput
    /**
     * Limit how many MLModels to update.
     */
    limit?: number
  }

  /**
   * MLModel updateManyAndReturn
   */
  export type MLModelUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MLModel
     */
    select?: MLModelSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MLModel
     */
    omit?: MLModelOmit<ExtArgs> | null
    /**
     * The data used to update MLModels.
     */
    data: XOR<MLModelUpdateManyMutationInput, MLModelUncheckedUpdateManyInput>
    /**
     * Filter which MLModels to update
     */
    where?: MLModelWhereInput
    /**
     * Limit how many MLModels to update.
     */
    limit?: number
  }

  /**
   * MLModel upsert
   */
  export type MLModelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MLModel
     */
    select?: MLModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MLModel
     */
    omit?: MLModelOmit<ExtArgs> | null
    /**
     * The filter to search for the MLModel to update in case it exists.
     */
    where: MLModelWhereUniqueInput
    /**
     * In case the MLModel found by the `where` argument doesn't exist, create a new MLModel with this data.
     */
    create: XOR<MLModelCreateInput, MLModelUncheckedCreateInput>
    /**
     * In case the MLModel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MLModelUpdateInput, MLModelUncheckedUpdateInput>
  }

  /**
   * MLModel delete
   */
  export type MLModelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MLModel
     */
    select?: MLModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MLModel
     */
    omit?: MLModelOmit<ExtArgs> | null
    /**
     * Filter which MLModel to delete.
     */
    where: MLModelWhereUniqueInput
  }

  /**
   * MLModel deleteMany
   */
  export type MLModelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MLModels to delete
     */
    where?: MLModelWhereInput
    /**
     * Limit how many MLModels to delete.
     */
    limit?: number
  }

  /**
   * MLModel without action
   */
  export type MLModelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MLModel
     */
    select?: MLModelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MLModel
     */
    omit?: MLModelOmit<ExtArgs> | null
  }


  /**
   * Model ModelTrainingLog
   */

  export type AggregateModelTrainingLog = {
    _count: ModelTrainingLogCountAggregateOutputType | null
    _avg: ModelTrainingLogAvgAggregateOutputType | null
    _sum: ModelTrainingLogSumAggregateOutputType | null
    _min: ModelTrainingLogMinAggregateOutputType | null
    _max: ModelTrainingLogMaxAggregateOutputType | null
  }

  export type ModelTrainingLogAvgAggregateOutputType = {
    epoch: number | null
    loss: number | null
    accuracy: number | null
    val_loss: number | null
    val_accuracy: number | null
  }

  export type ModelTrainingLogSumAggregateOutputType = {
    epoch: number | null
    loss: number | null
    accuracy: number | null
    val_loss: number | null
    val_accuracy: number | null
  }

  export type ModelTrainingLogMinAggregateOutputType = {
    id: string | null
    modelId: string | null
    epoch: number | null
    loss: number | null
    accuracy: number | null
    val_loss: number | null
    val_accuracy: number | null
    timestamp: Date | null
  }

  export type ModelTrainingLogMaxAggregateOutputType = {
    id: string | null
    modelId: string | null
    epoch: number | null
    loss: number | null
    accuracy: number | null
    val_loss: number | null
    val_accuracy: number | null
    timestamp: Date | null
  }

  export type ModelTrainingLogCountAggregateOutputType = {
    id: number
    modelId: number
    epoch: number
    loss: number
    accuracy: number
    val_loss: number
    val_accuracy: number
    timestamp: number
    _all: number
  }


  export type ModelTrainingLogAvgAggregateInputType = {
    epoch?: true
    loss?: true
    accuracy?: true
    val_loss?: true
    val_accuracy?: true
  }

  export type ModelTrainingLogSumAggregateInputType = {
    epoch?: true
    loss?: true
    accuracy?: true
    val_loss?: true
    val_accuracy?: true
  }

  export type ModelTrainingLogMinAggregateInputType = {
    id?: true
    modelId?: true
    epoch?: true
    loss?: true
    accuracy?: true
    val_loss?: true
    val_accuracy?: true
    timestamp?: true
  }

  export type ModelTrainingLogMaxAggregateInputType = {
    id?: true
    modelId?: true
    epoch?: true
    loss?: true
    accuracy?: true
    val_loss?: true
    val_accuracy?: true
    timestamp?: true
  }

  export type ModelTrainingLogCountAggregateInputType = {
    id?: true
    modelId?: true
    epoch?: true
    loss?: true
    accuracy?: true
    val_loss?: true
    val_accuracy?: true
    timestamp?: true
    _all?: true
  }

  export type ModelTrainingLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ModelTrainingLog to aggregate.
     */
    where?: ModelTrainingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ModelTrainingLogs to fetch.
     */
    orderBy?: ModelTrainingLogOrderByWithRelationInput | ModelTrainingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ModelTrainingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ModelTrainingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ModelTrainingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ModelTrainingLogs
    **/
    _count?: true | ModelTrainingLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ModelTrainingLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ModelTrainingLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ModelTrainingLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ModelTrainingLogMaxAggregateInputType
  }

  export type GetModelTrainingLogAggregateType<T extends ModelTrainingLogAggregateArgs> = {
        [P in keyof T & keyof AggregateModelTrainingLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateModelTrainingLog[P]>
      : GetScalarType<T[P], AggregateModelTrainingLog[P]>
  }




  export type ModelTrainingLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ModelTrainingLogWhereInput
    orderBy?: ModelTrainingLogOrderByWithAggregationInput | ModelTrainingLogOrderByWithAggregationInput[]
    by: ModelTrainingLogScalarFieldEnum[] | ModelTrainingLogScalarFieldEnum
    having?: ModelTrainingLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ModelTrainingLogCountAggregateInputType | true
    _avg?: ModelTrainingLogAvgAggregateInputType
    _sum?: ModelTrainingLogSumAggregateInputType
    _min?: ModelTrainingLogMinAggregateInputType
    _max?: ModelTrainingLogMaxAggregateInputType
  }

  export type ModelTrainingLogGroupByOutputType = {
    id: string
    modelId: string
    epoch: number
    loss: number
    accuracy: number | null
    val_loss: number | null
    val_accuracy: number | null
    timestamp: Date
    _count: ModelTrainingLogCountAggregateOutputType | null
    _avg: ModelTrainingLogAvgAggregateOutputType | null
    _sum: ModelTrainingLogSumAggregateOutputType | null
    _min: ModelTrainingLogMinAggregateOutputType | null
    _max: ModelTrainingLogMaxAggregateOutputType | null
  }

  type GetModelTrainingLogGroupByPayload<T extends ModelTrainingLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ModelTrainingLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ModelTrainingLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ModelTrainingLogGroupByOutputType[P]>
            : GetScalarType<T[P], ModelTrainingLogGroupByOutputType[P]>
        }
      >
    >


  export type ModelTrainingLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    modelId?: boolean
    epoch?: boolean
    loss?: boolean
    accuracy?: boolean
    val_loss?: boolean
    val_accuracy?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["modelTrainingLog"]>

  export type ModelTrainingLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    modelId?: boolean
    epoch?: boolean
    loss?: boolean
    accuracy?: boolean
    val_loss?: boolean
    val_accuracy?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["modelTrainingLog"]>

  export type ModelTrainingLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    modelId?: boolean
    epoch?: boolean
    loss?: boolean
    accuracy?: boolean
    val_loss?: boolean
    val_accuracy?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["modelTrainingLog"]>

  export type ModelTrainingLogSelectScalar = {
    id?: boolean
    modelId?: boolean
    epoch?: boolean
    loss?: boolean
    accuracy?: boolean
    val_loss?: boolean
    val_accuracy?: boolean
    timestamp?: boolean
  }

  export type ModelTrainingLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "modelId" | "epoch" | "loss" | "accuracy" | "val_loss" | "val_accuracy" | "timestamp", ExtArgs["result"]["modelTrainingLog"]>

  export type $ModelTrainingLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ModelTrainingLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      modelId: string
      epoch: number
      loss: number
      accuracy: number | null
      val_loss: number | null
      val_accuracy: number | null
      timestamp: Date
    }, ExtArgs["result"]["modelTrainingLog"]>
    composites: {}
  }

  type ModelTrainingLogGetPayload<S extends boolean | null | undefined | ModelTrainingLogDefaultArgs> = $Result.GetResult<Prisma.$ModelTrainingLogPayload, S>

  type ModelTrainingLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ModelTrainingLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ModelTrainingLogCountAggregateInputType | true
    }

  export interface ModelTrainingLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ModelTrainingLog'], meta: { name: 'ModelTrainingLog' } }
    /**
     * Find zero or one ModelTrainingLog that matches the filter.
     * @param {ModelTrainingLogFindUniqueArgs} args - Arguments to find a ModelTrainingLog
     * @example
     * // Get one ModelTrainingLog
     * const modelTrainingLog = await prisma.modelTrainingLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ModelTrainingLogFindUniqueArgs>(args: SelectSubset<T, ModelTrainingLogFindUniqueArgs<ExtArgs>>): Prisma__ModelTrainingLogClient<$Result.GetResult<Prisma.$ModelTrainingLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ModelTrainingLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ModelTrainingLogFindUniqueOrThrowArgs} args - Arguments to find a ModelTrainingLog
     * @example
     * // Get one ModelTrainingLog
     * const modelTrainingLog = await prisma.modelTrainingLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ModelTrainingLogFindUniqueOrThrowArgs>(args: SelectSubset<T, ModelTrainingLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ModelTrainingLogClient<$Result.GetResult<Prisma.$ModelTrainingLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ModelTrainingLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModelTrainingLogFindFirstArgs} args - Arguments to find a ModelTrainingLog
     * @example
     * // Get one ModelTrainingLog
     * const modelTrainingLog = await prisma.modelTrainingLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ModelTrainingLogFindFirstArgs>(args?: SelectSubset<T, ModelTrainingLogFindFirstArgs<ExtArgs>>): Prisma__ModelTrainingLogClient<$Result.GetResult<Prisma.$ModelTrainingLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ModelTrainingLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModelTrainingLogFindFirstOrThrowArgs} args - Arguments to find a ModelTrainingLog
     * @example
     * // Get one ModelTrainingLog
     * const modelTrainingLog = await prisma.modelTrainingLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ModelTrainingLogFindFirstOrThrowArgs>(args?: SelectSubset<T, ModelTrainingLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__ModelTrainingLogClient<$Result.GetResult<Prisma.$ModelTrainingLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ModelTrainingLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModelTrainingLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ModelTrainingLogs
     * const modelTrainingLogs = await prisma.modelTrainingLog.findMany()
     * 
     * // Get first 10 ModelTrainingLogs
     * const modelTrainingLogs = await prisma.modelTrainingLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const modelTrainingLogWithIdOnly = await prisma.modelTrainingLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ModelTrainingLogFindManyArgs>(args?: SelectSubset<T, ModelTrainingLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModelTrainingLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ModelTrainingLog.
     * @param {ModelTrainingLogCreateArgs} args - Arguments to create a ModelTrainingLog.
     * @example
     * // Create one ModelTrainingLog
     * const ModelTrainingLog = await prisma.modelTrainingLog.create({
     *   data: {
     *     // ... data to create a ModelTrainingLog
     *   }
     * })
     * 
     */
    create<T extends ModelTrainingLogCreateArgs>(args: SelectSubset<T, ModelTrainingLogCreateArgs<ExtArgs>>): Prisma__ModelTrainingLogClient<$Result.GetResult<Prisma.$ModelTrainingLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ModelTrainingLogs.
     * @param {ModelTrainingLogCreateManyArgs} args - Arguments to create many ModelTrainingLogs.
     * @example
     * // Create many ModelTrainingLogs
     * const modelTrainingLog = await prisma.modelTrainingLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ModelTrainingLogCreateManyArgs>(args?: SelectSubset<T, ModelTrainingLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ModelTrainingLogs and returns the data saved in the database.
     * @param {ModelTrainingLogCreateManyAndReturnArgs} args - Arguments to create many ModelTrainingLogs.
     * @example
     * // Create many ModelTrainingLogs
     * const modelTrainingLog = await prisma.modelTrainingLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ModelTrainingLogs and only return the `id`
     * const modelTrainingLogWithIdOnly = await prisma.modelTrainingLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ModelTrainingLogCreateManyAndReturnArgs>(args?: SelectSubset<T, ModelTrainingLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModelTrainingLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ModelTrainingLog.
     * @param {ModelTrainingLogDeleteArgs} args - Arguments to delete one ModelTrainingLog.
     * @example
     * // Delete one ModelTrainingLog
     * const ModelTrainingLog = await prisma.modelTrainingLog.delete({
     *   where: {
     *     // ... filter to delete one ModelTrainingLog
     *   }
     * })
     * 
     */
    delete<T extends ModelTrainingLogDeleteArgs>(args: SelectSubset<T, ModelTrainingLogDeleteArgs<ExtArgs>>): Prisma__ModelTrainingLogClient<$Result.GetResult<Prisma.$ModelTrainingLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ModelTrainingLog.
     * @param {ModelTrainingLogUpdateArgs} args - Arguments to update one ModelTrainingLog.
     * @example
     * // Update one ModelTrainingLog
     * const modelTrainingLog = await prisma.modelTrainingLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ModelTrainingLogUpdateArgs>(args: SelectSubset<T, ModelTrainingLogUpdateArgs<ExtArgs>>): Prisma__ModelTrainingLogClient<$Result.GetResult<Prisma.$ModelTrainingLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ModelTrainingLogs.
     * @param {ModelTrainingLogDeleteManyArgs} args - Arguments to filter ModelTrainingLogs to delete.
     * @example
     * // Delete a few ModelTrainingLogs
     * const { count } = await prisma.modelTrainingLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ModelTrainingLogDeleteManyArgs>(args?: SelectSubset<T, ModelTrainingLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ModelTrainingLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModelTrainingLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ModelTrainingLogs
     * const modelTrainingLog = await prisma.modelTrainingLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ModelTrainingLogUpdateManyArgs>(args: SelectSubset<T, ModelTrainingLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ModelTrainingLogs and returns the data updated in the database.
     * @param {ModelTrainingLogUpdateManyAndReturnArgs} args - Arguments to update many ModelTrainingLogs.
     * @example
     * // Update many ModelTrainingLogs
     * const modelTrainingLog = await prisma.modelTrainingLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ModelTrainingLogs and only return the `id`
     * const modelTrainingLogWithIdOnly = await prisma.modelTrainingLog.updateManyAndReturn({
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
    updateManyAndReturn<T extends ModelTrainingLogUpdateManyAndReturnArgs>(args: SelectSubset<T, ModelTrainingLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModelTrainingLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ModelTrainingLog.
     * @param {ModelTrainingLogUpsertArgs} args - Arguments to update or create a ModelTrainingLog.
     * @example
     * // Update or create a ModelTrainingLog
     * const modelTrainingLog = await prisma.modelTrainingLog.upsert({
     *   create: {
     *     // ... data to create a ModelTrainingLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ModelTrainingLog we want to update
     *   }
     * })
     */
    upsert<T extends ModelTrainingLogUpsertArgs>(args: SelectSubset<T, ModelTrainingLogUpsertArgs<ExtArgs>>): Prisma__ModelTrainingLogClient<$Result.GetResult<Prisma.$ModelTrainingLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ModelTrainingLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModelTrainingLogCountArgs} args - Arguments to filter ModelTrainingLogs to count.
     * @example
     * // Count the number of ModelTrainingLogs
     * const count = await prisma.modelTrainingLog.count({
     *   where: {
     *     // ... the filter for the ModelTrainingLogs we want to count
     *   }
     * })
    **/
    count<T extends ModelTrainingLogCountArgs>(
      args?: Subset<T, ModelTrainingLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ModelTrainingLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ModelTrainingLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModelTrainingLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ModelTrainingLogAggregateArgs>(args: Subset<T, ModelTrainingLogAggregateArgs>): Prisma.PrismaPromise<GetModelTrainingLogAggregateType<T>>

    /**
     * Group by ModelTrainingLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModelTrainingLogGroupByArgs} args - Group by arguments.
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
      T extends ModelTrainingLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ModelTrainingLogGroupByArgs['orderBy'] }
        : { orderBy?: ModelTrainingLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ModelTrainingLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetModelTrainingLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ModelTrainingLog model
   */
  readonly fields: ModelTrainingLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ModelTrainingLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ModelTrainingLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ModelTrainingLog model
   */
  interface ModelTrainingLogFieldRefs {
    readonly id: FieldRef<"ModelTrainingLog", 'String'>
    readonly modelId: FieldRef<"ModelTrainingLog", 'String'>
    readonly epoch: FieldRef<"ModelTrainingLog", 'Int'>
    readonly loss: FieldRef<"ModelTrainingLog", 'Float'>
    readonly accuracy: FieldRef<"ModelTrainingLog", 'Float'>
    readonly val_loss: FieldRef<"ModelTrainingLog", 'Float'>
    readonly val_accuracy: FieldRef<"ModelTrainingLog", 'Float'>
    readonly timestamp: FieldRef<"ModelTrainingLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ModelTrainingLog findUnique
   */
  export type ModelTrainingLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelTrainingLog
     */
    select?: ModelTrainingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelTrainingLog
     */
    omit?: ModelTrainingLogOmit<ExtArgs> | null
    /**
     * Filter, which ModelTrainingLog to fetch.
     */
    where: ModelTrainingLogWhereUniqueInput
  }

  /**
   * ModelTrainingLog findUniqueOrThrow
   */
  export type ModelTrainingLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelTrainingLog
     */
    select?: ModelTrainingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelTrainingLog
     */
    omit?: ModelTrainingLogOmit<ExtArgs> | null
    /**
     * Filter, which ModelTrainingLog to fetch.
     */
    where: ModelTrainingLogWhereUniqueInput
  }

  /**
   * ModelTrainingLog findFirst
   */
  export type ModelTrainingLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelTrainingLog
     */
    select?: ModelTrainingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelTrainingLog
     */
    omit?: ModelTrainingLogOmit<ExtArgs> | null
    /**
     * Filter, which ModelTrainingLog to fetch.
     */
    where?: ModelTrainingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ModelTrainingLogs to fetch.
     */
    orderBy?: ModelTrainingLogOrderByWithRelationInput | ModelTrainingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ModelTrainingLogs.
     */
    cursor?: ModelTrainingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ModelTrainingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ModelTrainingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ModelTrainingLogs.
     */
    distinct?: ModelTrainingLogScalarFieldEnum | ModelTrainingLogScalarFieldEnum[]
  }

  /**
   * ModelTrainingLog findFirstOrThrow
   */
  export type ModelTrainingLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelTrainingLog
     */
    select?: ModelTrainingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelTrainingLog
     */
    omit?: ModelTrainingLogOmit<ExtArgs> | null
    /**
     * Filter, which ModelTrainingLog to fetch.
     */
    where?: ModelTrainingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ModelTrainingLogs to fetch.
     */
    orderBy?: ModelTrainingLogOrderByWithRelationInput | ModelTrainingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ModelTrainingLogs.
     */
    cursor?: ModelTrainingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ModelTrainingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ModelTrainingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ModelTrainingLogs.
     */
    distinct?: ModelTrainingLogScalarFieldEnum | ModelTrainingLogScalarFieldEnum[]
  }

  /**
   * ModelTrainingLog findMany
   */
  export type ModelTrainingLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelTrainingLog
     */
    select?: ModelTrainingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelTrainingLog
     */
    omit?: ModelTrainingLogOmit<ExtArgs> | null
    /**
     * Filter, which ModelTrainingLogs to fetch.
     */
    where?: ModelTrainingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ModelTrainingLogs to fetch.
     */
    orderBy?: ModelTrainingLogOrderByWithRelationInput | ModelTrainingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ModelTrainingLogs.
     */
    cursor?: ModelTrainingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ModelTrainingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ModelTrainingLogs.
     */
    skip?: number
    distinct?: ModelTrainingLogScalarFieldEnum | ModelTrainingLogScalarFieldEnum[]
  }

  /**
   * ModelTrainingLog create
   */
  export type ModelTrainingLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelTrainingLog
     */
    select?: ModelTrainingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelTrainingLog
     */
    omit?: ModelTrainingLogOmit<ExtArgs> | null
    /**
     * The data needed to create a ModelTrainingLog.
     */
    data: XOR<ModelTrainingLogCreateInput, ModelTrainingLogUncheckedCreateInput>
  }

  /**
   * ModelTrainingLog createMany
   */
  export type ModelTrainingLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ModelTrainingLogs.
     */
    data: ModelTrainingLogCreateManyInput | ModelTrainingLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ModelTrainingLog createManyAndReturn
   */
  export type ModelTrainingLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelTrainingLog
     */
    select?: ModelTrainingLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ModelTrainingLog
     */
    omit?: ModelTrainingLogOmit<ExtArgs> | null
    /**
     * The data used to create many ModelTrainingLogs.
     */
    data: ModelTrainingLogCreateManyInput | ModelTrainingLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ModelTrainingLog update
   */
  export type ModelTrainingLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelTrainingLog
     */
    select?: ModelTrainingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelTrainingLog
     */
    omit?: ModelTrainingLogOmit<ExtArgs> | null
    /**
     * The data needed to update a ModelTrainingLog.
     */
    data: XOR<ModelTrainingLogUpdateInput, ModelTrainingLogUncheckedUpdateInput>
    /**
     * Choose, which ModelTrainingLog to update.
     */
    where: ModelTrainingLogWhereUniqueInput
  }

  /**
   * ModelTrainingLog updateMany
   */
  export type ModelTrainingLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ModelTrainingLogs.
     */
    data: XOR<ModelTrainingLogUpdateManyMutationInput, ModelTrainingLogUncheckedUpdateManyInput>
    /**
     * Filter which ModelTrainingLogs to update
     */
    where?: ModelTrainingLogWhereInput
    /**
     * Limit how many ModelTrainingLogs to update.
     */
    limit?: number
  }

  /**
   * ModelTrainingLog updateManyAndReturn
   */
  export type ModelTrainingLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelTrainingLog
     */
    select?: ModelTrainingLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ModelTrainingLog
     */
    omit?: ModelTrainingLogOmit<ExtArgs> | null
    /**
     * The data used to update ModelTrainingLogs.
     */
    data: XOR<ModelTrainingLogUpdateManyMutationInput, ModelTrainingLogUncheckedUpdateManyInput>
    /**
     * Filter which ModelTrainingLogs to update
     */
    where?: ModelTrainingLogWhereInput
    /**
     * Limit how many ModelTrainingLogs to update.
     */
    limit?: number
  }

  /**
   * ModelTrainingLog upsert
   */
  export type ModelTrainingLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelTrainingLog
     */
    select?: ModelTrainingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelTrainingLog
     */
    omit?: ModelTrainingLogOmit<ExtArgs> | null
    /**
     * The filter to search for the ModelTrainingLog to update in case it exists.
     */
    where: ModelTrainingLogWhereUniqueInput
    /**
     * In case the ModelTrainingLog found by the `where` argument doesn't exist, create a new ModelTrainingLog with this data.
     */
    create: XOR<ModelTrainingLogCreateInput, ModelTrainingLogUncheckedCreateInput>
    /**
     * In case the ModelTrainingLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ModelTrainingLogUpdateInput, ModelTrainingLogUncheckedUpdateInput>
  }

  /**
   * ModelTrainingLog delete
   */
  export type ModelTrainingLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelTrainingLog
     */
    select?: ModelTrainingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelTrainingLog
     */
    omit?: ModelTrainingLogOmit<ExtArgs> | null
    /**
     * Filter which ModelTrainingLog to delete.
     */
    where: ModelTrainingLogWhereUniqueInput
  }

  /**
   * ModelTrainingLog deleteMany
   */
  export type ModelTrainingLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ModelTrainingLogs to delete
     */
    where?: ModelTrainingLogWhereInput
    /**
     * Limit how many ModelTrainingLogs to delete.
     */
    limit?: number
  }

  /**
   * ModelTrainingLog without action
   */
  export type ModelTrainingLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModelTrainingLog
     */
    select?: ModelTrainingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ModelTrainingLog
     */
    omit?: ModelTrainingLogOmit<ExtArgs> | null
  }


  /**
   * Model UserFeatures
   */

  export type AggregateUserFeatures = {
    _count: UserFeaturesCountAggregateOutputType | null
    _avg: UserFeaturesAvgAggregateOutputType | null
    _sum: UserFeaturesSumAggregateOutputType | null
    _min: UserFeaturesMinAggregateOutputType | null
    _max: UserFeaturesMaxAggregateOutputType | null
  }

  export type UserFeaturesAvgAggregateOutputType = {
    totalOrders: number | null
    totalSpent: number | null
    avgOrderValue: number | null
    daysSinceLastOrder: number | null
  }

  export type UserFeaturesSumAggregateOutputType = {
    totalOrders: number | null
    totalSpent: number | null
    avgOrderValue: number | null
    daysSinceLastOrder: number | null
  }

  export type UserFeaturesMinAggregateOutputType = {
    id: string | null
    customerId: string | null
    totalOrders: number | null
    totalSpent: number | null
    avgOrderValue: number | null
    daysSinceLastOrder: number | null
    deviceType: string | null
    browser: string | null
    timezone: string | null
    lastComputedAt: Date | null
  }

  export type UserFeaturesMaxAggregateOutputType = {
    id: string | null
    customerId: string | null
    totalOrders: number | null
    totalSpent: number | null
    avgOrderValue: number | null
    daysSinceLastOrder: number | null
    deviceType: string | null
    browser: string | null
    timezone: string | null
    lastComputedAt: Date | null
  }

  export type UserFeaturesCountAggregateOutputType = {
    id: number
    customerId: number
    totalOrders: number
    totalSpent: number
    avgOrderValue: number
    daysSinceLastOrder: number
    categoryPreference: number
    deviceType: number
    browser: number
    timezone: number
    lastComputedAt: number
    _all: number
  }


  export type UserFeaturesAvgAggregateInputType = {
    totalOrders?: true
    totalSpent?: true
    avgOrderValue?: true
    daysSinceLastOrder?: true
  }

  export type UserFeaturesSumAggregateInputType = {
    totalOrders?: true
    totalSpent?: true
    avgOrderValue?: true
    daysSinceLastOrder?: true
  }

  export type UserFeaturesMinAggregateInputType = {
    id?: true
    customerId?: true
    totalOrders?: true
    totalSpent?: true
    avgOrderValue?: true
    daysSinceLastOrder?: true
    deviceType?: true
    browser?: true
    timezone?: true
    lastComputedAt?: true
  }

  export type UserFeaturesMaxAggregateInputType = {
    id?: true
    customerId?: true
    totalOrders?: true
    totalSpent?: true
    avgOrderValue?: true
    daysSinceLastOrder?: true
    deviceType?: true
    browser?: true
    timezone?: true
    lastComputedAt?: true
  }

  export type UserFeaturesCountAggregateInputType = {
    id?: true
    customerId?: true
    totalOrders?: true
    totalSpent?: true
    avgOrderValue?: true
    daysSinceLastOrder?: true
    categoryPreference?: true
    deviceType?: true
    browser?: true
    timezone?: true
    lastComputedAt?: true
    _all?: true
  }

  export type UserFeaturesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserFeatures to aggregate.
     */
    where?: UserFeaturesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserFeatures to fetch.
     */
    orderBy?: UserFeaturesOrderByWithRelationInput | UserFeaturesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserFeaturesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserFeatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserFeatures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserFeatures
    **/
    _count?: true | UserFeaturesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserFeaturesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserFeaturesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserFeaturesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserFeaturesMaxAggregateInputType
  }

  export type GetUserFeaturesAggregateType<T extends UserFeaturesAggregateArgs> = {
        [P in keyof T & keyof AggregateUserFeatures]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserFeatures[P]>
      : GetScalarType<T[P], AggregateUserFeatures[P]>
  }




  export type UserFeaturesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserFeaturesWhereInput
    orderBy?: UserFeaturesOrderByWithAggregationInput | UserFeaturesOrderByWithAggregationInput[]
    by: UserFeaturesScalarFieldEnum[] | UserFeaturesScalarFieldEnum
    having?: UserFeaturesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserFeaturesCountAggregateInputType | true
    _avg?: UserFeaturesAvgAggregateInputType
    _sum?: UserFeaturesSumAggregateInputType
    _min?: UserFeaturesMinAggregateInputType
    _max?: UserFeaturesMaxAggregateInputType
  }

  export type UserFeaturesGroupByOutputType = {
    id: string
    customerId: string
    totalOrders: number
    totalSpent: number
    avgOrderValue: number
    daysSinceLastOrder: number
    categoryPreference: string[]
    deviceType: string
    browser: string
    timezone: string
    lastComputedAt: Date
    _count: UserFeaturesCountAggregateOutputType | null
    _avg: UserFeaturesAvgAggregateOutputType | null
    _sum: UserFeaturesSumAggregateOutputType | null
    _min: UserFeaturesMinAggregateOutputType | null
    _max: UserFeaturesMaxAggregateOutputType | null
  }

  type GetUserFeaturesGroupByPayload<T extends UserFeaturesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserFeaturesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserFeaturesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserFeaturesGroupByOutputType[P]>
            : GetScalarType<T[P], UserFeaturesGroupByOutputType[P]>
        }
      >
    >


  export type UserFeaturesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    totalOrders?: boolean
    totalSpent?: boolean
    avgOrderValue?: boolean
    daysSinceLastOrder?: boolean
    categoryPreference?: boolean
    deviceType?: boolean
    browser?: boolean
    timezone?: boolean
    lastComputedAt?: boolean
  }, ExtArgs["result"]["userFeatures"]>

  export type UserFeaturesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    totalOrders?: boolean
    totalSpent?: boolean
    avgOrderValue?: boolean
    daysSinceLastOrder?: boolean
    categoryPreference?: boolean
    deviceType?: boolean
    browser?: boolean
    timezone?: boolean
    lastComputedAt?: boolean
  }, ExtArgs["result"]["userFeatures"]>

  export type UserFeaturesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    totalOrders?: boolean
    totalSpent?: boolean
    avgOrderValue?: boolean
    daysSinceLastOrder?: boolean
    categoryPreference?: boolean
    deviceType?: boolean
    browser?: boolean
    timezone?: boolean
    lastComputedAt?: boolean
  }, ExtArgs["result"]["userFeatures"]>

  export type UserFeaturesSelectScalar = {
    id?: boolean
    customerId?: boolean
    totalOrders?: boolean
    totalSpent?: boolean
    avgOrderValue?: boolean
    daysSinceLastOrder?: boolean
    categoryPreference?: boolean
    deviceType?: boolean
    browser?: boolean
    timezone?: boolean
    lastComputedAt?: boolean
  }

  export type UserFeaturesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "customerId" | "totalOrders" | "totalSpent" | "avgOrderValue" | "daysSinceLastOrder" | "categoryPreference" | "deviceType" | "browser" | "timezone" | "lastComputedAt", ExtArgs["result"]["userFeatures"]>

  export type $UserFeaturesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserFeatures"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      customerId: string
      totalOrders: number
      totalSpent: number
      avgOrderValue: number
      daysSinceLastOrder: number
      categoryPreference: string[]
      deviceType: string
      browser: string
      timezone: string
      lastComputedAt: Date
    }, ExtArgs["result"]["userFeatures"]>
    composites: {}
  }

  type UserFeaturesGetPayload<S extends boolean | null | undefined | UserFeaturesDefaultArgs> = $Result.GetResult<Prisma.$UserFeaturesPayload, S>

  type UserFeaturesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFeaturesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserFeaturesCountAggregateInputType | true
    }

  export interface UserFeaturesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserFeatures'], meta: { name: 'UserFeatures' } }
    /**
     * Find zero or one UserFeatures that matches the filter.
     * @param {UserFeaturesFindUniqueArgs} args - Arguments to find a UserFeatures
     * @example
     * // Get one UserFeatures
     * const userFeatures = await prisma.userFeatures.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFeaturesFindUniqueArgs>(args: SelectSubset<T, UserFeaturesFindUniqueArgs<ExtArgs>>): Prisma__UserFeaturesClient<$Result.GetResult<Prisma.$UserFeaturesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserFeatures that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFeaturesFindUniqueOrThrowArgs} args - Arguments to find a UserFeatures
     * @example
     * // Get one UserFeatures
     * const userFeatures = await prisma.userFeatures.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFeaturesFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFeaturesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserFeaturesClient<$Result.GetResult<Prisma.$UserFeaturesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserFeatures that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFeaturesFindFirstArgs} args - Arguments to find a UserFeatures
     * @example
     * // Get one UserFeatures
     * const userFeatures = await prisma.userFeatures.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFeaturesFindFirstArgs>(args?: SelectSubset<T, UserFeaturesFindFirstArgs<ExtArgs>>): Prisma__UserFeaturesClient<$Result.GetResult<Prisma.$UserFeaturesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserFeatures that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFeaturesFindFirstOrThrowArgs} args - Arguments to find a UserFeatures
     * @example
     * // Get one UserFeatures
     * const userFeatures = await prisma.userFeatures.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFeaturesFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFeaturesFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserFeaturesClient<$Result.GetResult<Prisma.$UserFeaturesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserFeatures that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFeaturesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserFeatures
     * const userFeatures = await prisma.userFeatures.findMany()
     * 
     * // Get first 10 UserFeatures
     * const userFeatures = await prisma.userFeatures.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userFeaturesWithIdOnly = await prisma.userFeatures.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFeaturesFindManyArgs>(args?: SelectSubset<T, UserFeaturesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserFeaturesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserFeatures.
     * @param {UserFeaturesCreateArgs} args - Arguments to create a UserFeatures.
     * @example
     * // Create one UserFeatures
     * const UserFeatures = await prisma.userFeatures.create({
     *   data: {
     *     // ... data to create a UserFeatures
     *   }
     * })
     * 
     */
    create<T extends UserFeaturesCreateArgs>(args: SelectSubset<T, UserFeaturesCreateArgs<ExtArgs>>): Prisma__UserFeaturesClient<$Result.GetResult<Prisma.$UserFeaturesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserFeatures.
     * @param {UserFeaturesCreateManyArgs} args - Arguments to create many UserFeatures.
     * @example
     * // Create many UserFeatures
     * const userFeatures = await prisma.userFeatures.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserFeaturesCreateManyArgs>(args?: SelectSubset<T, UserFeaturesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserFeatures and returns the data saved in the database.
     * @param {UserFeaturesCreateManyAndReturnArgs} args - Arguments to create many UserFeatures.
     * @example
     * // Create many UserFeatures
     * const userFeatures = await prisma.userFeatures.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserFeatures and only return the `id`
     * const userFeaturesWithIdOnly = await prisma.userFeatures.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserFeaturesCreateManyAndReturnArgs>(args?: SelectSubset<T, UserFeaturesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserFeaturesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserFeatures.
     * @param {UserFeaturesDeleteArgs} args - Arguments to delete one UserFeatures.
     * @example
     * // Delete one UserFeatures
     * const UserFeatures = await prisma.userFeatures.delete({
     *   where: {
     *     // ... filter to delete one UserFeatures
     *   }
     * })
     * 
     */
    delete<T extends UserFeaturesDeleteArgs>(args: SelectSubset<T, UserFeaturesDeleteArgs<ExtArgs>>): Prisma__UserFeaturesClient<$Result.GetResult<Prisma.$UserFeaturesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserFeatures.
     * @param {UserFeaturesUpdateArgs} args - Arguments to update one UserFeatures.
     * @example
     * // Update one UserFeatures
     * const userFeatures = await prisma.userFeatures.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserFeaturesUpdateArgs>(args: SelectSubset<T, UserFeaturesUpdateArgs<ExtArgs>>): Prisma__UserFeaturesClient<$Result.GetResult<Prisma.$UserFeaturesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserFeatures.
     * @param {UserFeaturesDeleteManyArgs} args - Arguments to filter UserFeatures to delete.
     * @example
     * // Delete a few UserFeatures
     * const { count } = await prisma.userFeatures.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserFeaturesDeleteManyArgs>(args?: SelectSubset<T, UserFeaturesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserFeatures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFeaturesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserFeatures
     * const userFeatures = await prisma.userFeatures.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserFeaturesUpdateManyArgs>(args: SelectSubset<T, UserFeaturesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserFeatures and returns the data updated in the database.
     * @param {UserFeaturesUpdateManyAndReturnArgs} args - Arguments to update many UserFeatures.
     * @example
     * // Update many UserFeatures
     * const userFeatures = await prisma.userFeatures.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserFeatures and only return the `id`
     * const userFeaturesWithIdOnly = await prisma.userFeatures.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserFeaturesUpdateManyAndReturnArgs>(args: SelectSubset<T, UserFeaturesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserFeaturesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserFeatures.
     * @param {UserFeaturesUpsertArgs} args - Arguments to update or create a UserFeatures.
     * @example
     * // Update or create a UserFeatures
     * const userFeatures = await prisma.userFeatures.upsert({
     *   create: {
     *     // ... data to create a UserFeatures
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserFeatures we want to update
     *   }
     * })
     */
    upsert<T extends UserFeaturesUpsertArgs>(args: SelectSubset<T, UserFeaturesUpsertArgs<ExtArgs>>): Prisma__UserFeaturesClient<$Result.GetResult<Prisma.$UserFeaturesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserFeatures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFeaturesCountArgs} args - Arguments to filter UserFeatures to count.
     * @example
     * // Count the number of UserFeatures
     * const count = await prisma.userFeatures.count({
     *   where: {
     *     // ... the filter for the UserFeatures we want to count
     *   }
     * })
    **/
    count<T extends UserFeaturesCountArgs>(
      args?: Subset<T, UserFeaturesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserFeaturesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserFeatures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFeaturesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserFeaturesAggregateArgs>(args: Subset<T, UserFeaturesAggregateArgs>): Prisma.PrismaPromise<GetUserFeaturesAggregateType<T>>

    /**
     * Group by UserFeatures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFeaturesGroupByArgs} args - Group by arguments.
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
      T extends UserFeaturesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserFeaturesGroupByArgs['orderBy'] }
        : { orderBy?: UserFeaturesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserFeaturesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserFeaturesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserFeatures model
   */
  readonly fields: UserFeaturesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserFeatures.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserFeaturesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the UserFeatures model
   */
  interface UserFeaturesFieldRefs {
    readonly id: FieldRef<"UserFeatures", 'String'>
    readonly customerId: FieldRef<"UserFeatures", 'String'>
    readonly totalOrders: FieldRef<"UserFeatures", 'Int'>
    readonly totalSpent: FieldRef<"UserFeatures", 'Float'>
    readonly avgOrderValue: FieldRef<"UserFeatures", 'Float'>
    readonly daysSinceLastOrder: FieldRef<"UserFeatures", 'Int'>
    readonly categoryPreference: FieldRef<"UserFeatures", 'String[]'>
    readonly deviceType: FieldRef<"UserFeatures", 'String'>
    readonly browser: FieldRef<"UserFeatures", 'String'>
    readonly timezone: FieldRef<"UserFeatures", 'String'>
    readonly lastComputedAt: FieldRef<"UserFeatures", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserFeatures findUnique
   */
  export type UserFeaturesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFeatures
     */
    select?: UserFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFeatures
     */
    omit?: UserFeaturesOmit<ExtArgs> | null
    /**
     * Filter, which UserFeatures to fetch.
     */
    where: UserFeaturesWhereUniqueInput
  }

  /**
   * UserFeatures findUniqueOrThrow
   */
  export type UserFeaturesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFeatures
     */
    select?: UserFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFeatures
     */
    omit?: UserFeaturesOmit<ExtArgs> | null
    /**
     * Filter, which UserFeatures to fetch.
     */
    where: UserFeaturesWhereUniqueInput
  }

  /**
   * UserFeatures findFirst
   */
  export type UserFeaturesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFeatures
     */
    select?: UserFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFeatures
     */
    omit?: UserFeaturesOmit<ExtArgs> | null
    /**
     * Filter, which UserFeatures to fetch.
     */
    where?: UserFeaturesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserFeatures to fetch.
     */
    orderBy?: UserFeaturesOrderByWithRelationInput | UserFeaturesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserFeatures.
     */
    cursor?: UserFeaturesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserFeatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserFeatures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserFeatures.
     */
    distinct?: UserFeaturesScalarFieldEnum | UserFeaturesScalarFieldEnum[]
  }

  /**
   * UserFeatures findFirstOrThrow
   */
  export type UserFeaturesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFeatures
     */
    select?: UserFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFeatures
     */
    omit?: UserFeaturesOmit<ExtArgs> | null
    /**
     * Filter, which UserFeatures to fetch.
     */
    where?: UserFeaturesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserFeatures to fetch.
     */
    orderBy?: UserFeaturesOrderByWithRelationInput | UserFeaturesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserFeatures.
     */
    cursor?: UserFeaturesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserFeatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserFeatures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserFeatures.
     */
    distinct?: UserFeaturesScalarFieldEnum | UserFeaturesScalarFieldEnum[]
  }

  /**
   * UserFeatures findMany
   */
  export type UserFeaturesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFeatures
     */
    select?: UserFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFeatures
     */
    omit?: UserFeaturesOmit<ExtArgs> | null
    /**
     * Filter, which UserFeatures to fetch.
     */
    where?: UserFeaturesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserFeatures to fetch.
     */
    orderBy?: UserFeaturesOrderByWithRelationInput | UserFeaturesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserFeatures.
     */
    cursor?: UserFeaturesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserFeatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserFeatures.
     */
    skip?: number
    distinct?: UserFeaturesScalarFieldEnum | UserFeaturesScalarFieldEnum[]
  }

  /**
   * UserFeatures create
   */
  export type UserFeaturesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFeatures
     */
    select?: UserFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFeatures
     */
    omit?: UserFeaturesOmit<ExtArgs> | null
    /**
     * The data needed to create a UserFeatures.
     */
    data: XOR<UserFeaturesCreateInput, UserFeaturesUncheckedCreateInput>
  }

  /**
   * UserFeatures createMany
   */
  export type UserFeaturesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserFeatures.
     */
    data: UserFeaturesCreateManyInput | UserFeaturesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserFeatures createManyAndReturn
   */
  export type UserFeaturesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFeatures
     */
    select?: UserFeaturesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserFeatures
     */
    omit?: UserFeaturesOmit<ExtArgs> | null
    /**
     * The data used to create many UserFeatures.
     */
    data: UserFeaturesCreateManyInput | UserFeaturesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserFeatures update
   */
  export type UserFeaturesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFeatures
     */
    select?: UserFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFeatures
     */
    omit?: UserFeaturesOmit<ExtArgs> | null
    /**
     * The data needed to update a UserFeatures.
     */
    data: XOR<UserFeaturesUpdateInput, UserFeaturesUncheckedUpdateInput>
    /**
     * Choose, which UserFeatures to update.
     */
    where: UserFeaturesWhereUniqueInput
  }

  /**
   * UserFeatures updateMany
   */
  export type UserFeaturesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserFeatures.
     */
    data: XOR<UserFeaturesUpdateManyMutationInput, UserFeaturesUncheckedUpdateManyInput>
    /**
     * Filter which UserFeatures to update
     */
    where?: UserFeaturesWhereInput
    /**
     * Limit how many UserFeatures to update.
     */
    limit?: number
  }

  /**
   * UserFeatures updateManyAndReturn
   */
  export type UserFeaturesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFeatures
     */
    select?: UserFeaturesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserFeatures
     */
    omit?: UserFeaturesOmit<ExtArgs> | null
    /**
     * The data used to update UserFeatures.
     */
    data: XOR<UserFeaturesUpdateManyMutationInput, UserFeaturesUncheckedUpdateManyInput>
    /**
     * Filter which UserFeatures to update
     */
    where?: UserFeaturesWhereInput
    /**
     * Limit how many UserFeatures to update.
     */
    limit?: number
  }

  /**
   * UserFeatures upsert
   */
  export type UserFeaturesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFeatures
     */
    select?: UserFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFeatures
     */
    omit?: UserFeaturesOmit<ExtArgs> | null
    /**
     * The filter to search for the UserFeatures to update in case it exists.
     */
    where: UserFeaturesWhereUniqueInput
    /**
     * In case the UserFeatures found by the `where` argument doesn't exist, create a new UserFeatures with this data.
     */
    create: XOR<UserFeaturesCreateInput, UserFeaturesUncheckedCreateInput>
    /**
     * In case the UserFeatures was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserFeaturesUpdateInput, UserFeaturesUncheckedUpdateInput>
  }

  /**
   * UserFeatures delete
   */
  export type UserFeaturesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFeatures
     */
    select?: UserFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFeatures
     */
    omit?: UserFeaturesOmit<ExtArgs> | null
    /**
     * Filter which UserFeatures to delete.
     */
    where: UserFeaturesWhereUniqueInput
  }

  /**
   * UserFeatures deleteMany
   */
  export type UserFeaturesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserFeatures to delete
     */
    where?: UserFeaturesWhereInput
    /**
     * Limit how many UserFeatures to delete.
     */
    limit?: number
  }

  /**
   * UserFeatures without action
   */
  export type UserFeaturesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFeatures
     */
    select?: UserFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFeatures
     */
    omit?: UserFeaturesOmit<ExtArgs> | null
  }


  /**
   * Model ProductFeatures
   */

  export type AggregateProductFeatures = {
    _count: ProductFeaturesCountAggregateOutputType | null
    _avg: ProductFeaturesAvgAggregateOutputType | null
    _sum: ProductFeaturesSumAggregateOutputType | null
    _min: ProductFeaturesMinAggregateOutputType | null
    _max: ProductFeaturesMaxAggregateOutputType | null
  }

  export type ProductFeaturesAvgAggregateOutputType = {
    avgRating: number | null
    reviewCount: number | null
    returnRate: number | null
    profitMargin: number | null
    stockLevel: number | null
    competitorCount: number | null
  }

  export type ProductFeaturesSumAggregateOutputType = {
    avgRating: number | null
    reviewCount: number | null
    returnRate: number | null
    profitMargin: number | null
    stockLevel: number | null
    competitorCount: number | null
  }

  export type ProductFeaturesMinAggregateOutputType = {
    id: string | null
    productId: string | null
    category: string | null
    avgRating: number | null
    reviewCount: number | null
    returnRate: number | null
    profitMargin: number | null
    stockLevel: number | null
    competitorCount: number | null
    seasonality: string | null
    lastComputedAt: Date | null
  }

  export type ProductFeaturesMaxAggregateOutputType = {
    id: string | null
    productId: string | null
    category: string | null
    avgRating: number | null
    reviewCount: number | null
    returnRate: number | null
    profitMargin: number | null
    stockLevel: number | null
    competitorCount: number | null
    seasonality: string | null
    lastComputedAt: Date | null
  }

  export type ProductFeaturesCountAggregateOutputType = {
    id: number
    productId: number
    category: number
    avgRating: number
    reviewCount: number
    returnRate: number
    profitMargin: number
    stockLevel: number
    competitorCount: number
    seasonality: number
    lastComputedAt: number
    _all: number
  }


  export type ProductFeaturesAvgAggregateInputType = {
    avgRating?: true
    reviewCount?: true
    returnRate?: true
    profitMargin?: true
    stockLevel?: true
    competitorCount?: true
  }

  export type ProductFeaturesSumAggregateInputType = {
    avgRating?: true
    reviewCount?: true
    returnRate?: true
    profitMargin?: true
    stockLevel?: true
    competitorCount?: true
  }

  export type ProductFeaturesMinAggregateInputType = {
    id?: true
    productId?: true
    category?: true
    avgRating?: true
    reviewCount?: true
    returnRate?: true
    profitMargin?: true
    stockLevel?: true
    competitorCount?: true
    seasonality?: true
    lastComputedAt?: true
  }

  export type ProductFeaturesMaxAggregateInputType = {
    id?: true
    productId?: true
    category?: true
    avgRating?: true
    reviewCount?: true
    returnRate?: true
    profitMargin?: true
    stockLevel?: true
    competitorCount?: true
    seasonality?: true
    lastComputedAt?: true
  }

  export type ProductFeaturesCountAggregateInputType = {
    id?: true
    productId?: true
    category?: true
    avgRating?: true
    reviewCount?: true
    returnRate?: true
    profitMargin?: true
    stockLevel?: true
    competitorCount?: true
    seasonality?: true
    lastComputedAt?: true
    _all?: true
  }

  export type ProductFeaturesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductFeatures to aggregate.
     */
    where?: ProductFeaturesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductFeatures to fetch.
     */
    orderBy?: ProductFeaturesOrderByWithRelationInput | ProductFeaturesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductFeaturesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductFeatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductFeatures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductFeatures
    **/
    _count?: true | ProductFeaturesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductFeaturesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductFeaturesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductFeaturesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductFeaturesMaxAggregateInputType
  }

  export type GetProductFeaturesAggregateType<T extends ProductFeaturesAggregateArgs> = {
        [P in keyof T & keyof AggregateProductFeatures]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductFeatures[P]>
      : GetScalarType<T[P], AggregateProductFeatures[P]>
  }




  export type ProductFeaturesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductFeaturesWhereInput
    orderBy?: ProductFeaturesOrderByWithAggregationInput | ProductFeaturesOrderByWithAggregationInput[]
    by: ProductFeaturesScalarFieldEnum[] | ProductFeaturesScalarFieldEnum
    having?: ProductFeaturesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductFeaturesCountAggregateInputType | true
    _avg?: ProductFeaturesAvgAggregateInputType
    _sum?: ProductFeaturesSumAggregateInputType
    _min?: ProductFeaturesMinAggregateInputType
    _max?: ProductFeaturesMaxAggregateInputType
  }

  export type ProductFeaturesGroupByOutputType = {
    id: string
    productId: string
    category: string
    avgRating: number
    reviewCount: number
    returnRate: number
    profitMargin: number
    stockLevel: number
    competitorCount: number
    seasonality: string | null
    lastComputedAt: Date
    _count: ProductFeaturesCountAggregateOutputType | null
    _avg: ProductFeaturesAvgAggregateOutputType | null
    _sum: ProductFeaturesSumAggregateOutputType | null
    _min: ProductFeaturesMinAggregateOutputType | null
    _max: ProductFeaturesMaxAggregateOutputType | null
  }

  type GetProductFeaturesGroupByPayload<T extends ProductFeaturesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductFeaturesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductFeaturesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductFeaturesGroupByOutputType[P]>
            : GetScalarType<T[P], ProductFeaturesGroupByOutputType[P]>
        }
      >
    >


  export type ProductFeaturesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    category?: boolean
    avgRating?: boolean
    reviewCount?: boolean
    returnRate?: boolean
    profitMargin?: boolean
    stockLevel?: boolean
    competitorCount?: boolean
    seasonality?: boolean
    lastComputedAt?: boolean
  }, ExtArgs["result"]["productFeatures"]>

  export type ProductFeaturesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    category?: boolean
    avgRating?: boolean
    reviewCount?: boolean
    returnRate?: boolean
    profitMargin?: boolean
    stockLevel?: boolean
    competitorCount?: boolean
    seasonality?: boolean
    lastComputedAt?: boolean
  }, ExtArgs["result"]["productFeatures"]>

  export type ProductFeaturesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    category?: boolean
    avgRating?: boolean
    reviewCount?: boolean
    returnRate?: boolean
    profitMargin?: boolean
    stockLevel?: boolean
    competitorCount?: boolean
    seasonality?: boolean
    lastComputedAt?: boolean
  }, ExtArgs["result"]["productFeatures"]>

  export type ProductFeaturesSelectScalar = {
    id?: boolean
    productId?: boolean
    category?: boolean
    avgRating?: boolean
    reviewCount?: boolean
    returnRate?: boolean
    profitMargin?: boolean
    stockLevel?: boolean
    competitorCount?: boolean
    seasonality?: boolean
    lastComputedAt?: boolean
  }

  export type ProductFeaturesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "category" | "avgRating" | "reviewCount" | "returnRate" | "profitMargin" | "stockLevel" | "competitorCount" | "seasonality" | "lastComputedAt", ExtArgs["result"]["productFeatures"]>

  export type $ProductFeaturesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductFeatures"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      productId: string
      category: string
      avgRating: number
      reviewCount: number
      returnRate: number
      profitMargin: number
      stockLevel: number
      competitorCount: number
      seasonality: string | null
      lastComputedAt: Date
    }, ExtArgs["result"]["productFeatures"]>
    composites: {}
  }

  type ProductFeaturesGetPayload<S extends boolean | null | undefined | ProductFeaturesDefaultArgs> = $Result.GetResult<Prisma.$ProductFeaturesPayload, S>

  type ProductFeaturesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductFeaturesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductFeaturesCountAggregateInputType | true
    }

  export interface ProductFeaturesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductFeatures'], meta: { name: 'ProductFeatures' } }
    /**
     * Find zero or one ProductFeatures that matches the filter.
     * @param {ProductFeaturesFindUniqueArgs} args - Arguments to find a ProductFeatures
     * @example
     * // Get one ProductFeatures
     * const productFeatures = await prisma.productFeatures.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFeaturesFindUniqueArgs>(args: SelectSubset<T, ProductFeaturesFindUniqueArgs<ExtArgs>>): Prisma__ProductFeaturesClient<$Result.GetResult<Prisma.$ProductFeaturesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProductFeatures that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductFeaturesFindUniqueOrThrowArgs} args - Arguments to find a ProductFeatures
     * @example
     * // Get one ProductFeatures
     * const productFeatures = await prisma.productFeatures.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFeaturesFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFeaturesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductFeaturesClient<$Result.GetResult<Prisma.$ProductFeaturesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductFeatures that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFeaturesFindFirstArgs} args - Arguments to find a ProductFeatures
     * @example
     * // Get one ProductFeatures
     * const productFeatures = await prisma.productFeatures.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFeaturesFindFirstArgs>(args?: SelectSubset<T, ProductFeaturesFindFirstArgs<ExtArgs>>): Prisma__ProductFeaturesClient<$Result.GetResult<Prisma.$ProductFeaturesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductFeatures that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFeaturesFindFirstOrThrowArgs} args - Arguments to find a ProductFeatures
     * @example
     * // Get one ProductFeatures
     * const productFeatures = await prisma.productFeatures.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFeaturesFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFeaturesFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductFeaturesClient<$Result.GetResult<Prisma.$ProductFeaturesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProductFeatures that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFeaturesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductFeatures
     * const productFeatures = await prisma.productFeatures.findMany()
     * 
     * // Get first 10 ProductFeatures
     * const productFeatures = await prisma.productFeatures.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productFeaturesWithIdOnly = await prisma.productFeatures.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFeaturesFindManyArgs>(args?: SelectSubset<T, ProductFeaturesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductFeaturesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProductFeatures.
     * @param {ProductFeaturesCreateArgs} args - Arguments to create a ProductFeatures.
     * @example
     * // Create one ProductFeatures
     * const ProductFeatures = await prisma.productFeatures.create({
     *   data: {
     *     // ... data to create a ProductFeatures
     *   }
     * })
     * 
     */
    create<T extends ProductFeaturesCreateArgs>(args: SelectSubset<T, ProductFeaturesCreateArgs<ExtArgs>>): Prisma__ProductFeaturesClient<$Result.GetResult<Prisma.$ProductFeaturesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProductFeatures.
     * @param {ProductFeaturesCreateManyArgs} args - Arguments to create many ProductFeatures.
     * @example
     * // Create many ProductFeatures
     * const productFeatures = await prisma.productFeatures.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductFeaturesCreateManyArgs>(args?: SelectSubset<T, ProductFeaturesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProductFeatures and returns the data saved in the database.
     * @param {ProductFeaturesCreateManyAndReturnArgs} args - Arguments to create many ProductFeatures.
     * @example
     * // Create many ProductFeatures
     * const productFeatures = await prisma.productFeatures.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProductFeatures and only return the `id`
     * const productFeaturesWithIdOnly = await prisma.productFeatures.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductFeaturesCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductFeaturesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductFeaturesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProductFeatures.
     * @param {ProductFeaturesDeleteArgs} args - Arguments to delete one ProductFeatures.
     * @example
     * // Delete one ProductFeatures
     * const ProductFeatures = await prisma.productFeatures.delete({
     *   where: {
     *     // ... filter to delete one ProductFeatures
     *   }
     * })
     * 
     */
    delete<T extends ProductFeaturesDeleteArgs>(args: SelectSubset<T, ProductFeaturesDeleteArgs<ExtArgs>>): Prisma__ProductFeaturesClient<$Result.GetResult<Prisma.$ProductFeaturesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProductFeatures.
     * @param {ProductFeaturesUpdateArgs} args - Arguments to update one ProductFeatures.
     * @example
     * // Update one ProductFeatures
     * const productFeatures = await prisma.productFeatures.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductFeaturesUpdateArgs>(args: SelectSubset<T, ProductFeaturesUpdateArgs<ExtArgs>>): Prisma__ProductFeaturesClient<$Result.GetResult<Prisma.$ProductFeaturesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProductFeatures.
     * @param {ProductFeaturesDeleteManyArgs} args - Arguments to filter ProductFeatures to delete.
     * @example
     * // Delete a few ProductFeatures
     * const { count } = await prisma.productFeatures.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductFeaturesDeleteManyArgs>(args?: SelectSubset<T, ProductFeaturesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductFeatures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFeaturesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductFeatures
     * const productFeatures = await prisma.productFeatures.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductFeaturesUpdateManyArgs>(args: SelectSubset<T, ProductFeaturesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductFeatures and returns the data updated in the database.
     * @param {ProductFeaturesUpdateManyAndReturnArgs} args - Arguments to update many ProductFeatures.
     * @example
     * // Update many ProductFeatures
     * const productFeatures = await prisma.productFeatures.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProductFeatures and only return the `id`
     * const productFeaturesWithIdOnly = await prisma.productFeatures.updateManyAndReturn({
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
    updateManyAndReturn<T extends ProductFeaturesUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductFeaturesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductFeaturesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProductFeatures.
     * @param {ProductFeaturesUpsertArgs} args - Arguments to update or create a ProductFeatures.
     * @example
     * // Update or create a ProductFeatures
     * const productFeatures = await prisma.productFeatures.upsert({
     *   create: {
     *     // ... data to create a ProductFeatures
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductFeatures we want to update
     *   }
     * })
     */
    upsert<T extends ProductFeaturesUpsertArgs>(args: SelectSubset<T, ProductFeaturesUpsertArgs<ExtArgs>>): Prisma__ProductFeaturesClient<$Result.GetResult<Prisma.$ProductFeaturesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProductFeatures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFeaturesCountArgs} args - Arguments to filter ProductFeatures to count.
     * @example
     * // Count the number of ProductFeatures
     * const count = await prisma.productFeatures.count({
     *   where: {
     *     // ... the filter for the ProductFeatures we want to count
     *   }
     * })
    **/
    count<T extends ProductFeaturesCountArgs>(
      args?: Subset<T, ProductFeaturesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductFeaturesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductFeatures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFeaturesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProductFeaturesAggregateArgs>(args: Subset<T, ProductFeaturesAggregateArgs>): Prisma.PrismaPromise<GetProductFeaturesAggregateType<T>>

    /**
     * Group by ProductFeatures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFeaturesGroupByArgs} args - Group by arguments.
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
      T extends ProductFeaturesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductFeaturesGroupByArgs['orderBy'] }
        : { orderBy?: ProductFeaturesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProductFeaturesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductFeaturesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductFeatures model
   */
  readonly fields: ProductFeaturesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductFeatures.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductFeaturesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ProductFeatures model
   */
  interface ProductFeaturesFieldRefs {
    readonly id: FieldRef<"ProductFeatures", 'String'>
    readonly productId: FieldRef<"ProductFeatures", 'String'>
    readonly category: FieldRef<"ProductFeatures", 'String'>
    readonly avgRating: FieldRef<"ProductFeatures", 'Float'>
    readonly reviewCount: FieldRef<"ProductFeatures", 'Int'>
    readonly returnRate: FieldRef<"ProductFeatures", 'Float'>
    readonly profitMargin: FieldRef<"ProductFeatures", 'Float'>
    readonly stockLevel: FieldRef<"ProductFeatures", 'Int'>
    readonly competitorCount: FieldRef<"ProductFeatures", 'Int'>
    readonly seasonality: FieldRef<"ProductFeatures", 'String'>
    readonly lastComputedAt: FieldRef<"ProductFeatures", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProductFeatures findUnique
   */
  export type ProductFeaturesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductFeatures
     */
    select?: ProductFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductFeatures
     */
    omit?: ProductFeaturesOmit<ExtArgs> | null
    /**
     * Filter, which ProductFeatures to fetch.
     */
    where: ProductFeaturesWhereUniqueInput
  }

  /**
   * ProductFeatures findUniqueOrThrow
   */
  export type ProductFeaturesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductFeatures
     */
    select?: ProductFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductFeatures
     */
    omit?: ProductFeaturesOmit<ExtArgs> | null
    /**
     * Filter, which ProductFeatures to fetch.
     */
    where: ProductFeaturesWhereUniqueInput
  }

  /**
   * ProductFeatures findFirst
   */
  export type ProductFeaturesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductFeatures
     */
    select?: ProductFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductFeatures
     */
    omit?: ProductFeaturesOmit<ExtArgs> | null
    /**
     * Filter, which ProductFeatures to fetch.
     */
    where?: ProductFeaturesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductFeatures to fetch.
     */
    orderBy?: ProductFeaturesOrderByWithRelationInput | ProductFeaturesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductFeatures.
     */
    cursor?: ProductFeaturesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductFeatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductFeatures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductFeatures.
     */
    distinct?: ProductFeaturesScalarFieldEnum | ProductFeaturesScalarFieldEnum[]
  }

  /**
   * ProductFeatures findFirstOrThrow
   */
  export type ProductFeaturesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductFeatures
     */
    select?: ProductFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductFeatures
     */
    omit?: ProductFeaturesOmit<ExtArgs> | null
    /**
     * Filter, which ProductFeatures to fetch.
     */
    where?: ProductFeaturesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductFeatures to fetch.
     */
    orderBy?: ProductFeaturesOrderByWithRelationInput | ProductFeaturesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductFeatures.
     */
    cursor?: ProductFeaturesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductFeatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductFeatures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductFeatures.
     */
    distinct?: ProductFeaturesScalarFieldEnum | ProductFeaturesScalarFieldEnum[]
  }

  /**
   * ProductFeatures findMany
   */
  export type ProductFeaturesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductFeatures
     */
    select?: ProductFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductFeatures
     */
    omit?: ProductFeaturesOmit<ExtArgs> | null
    /**
     * Filter, which ProductFeatures to fetch.
     */
    where?: ProductFeaturesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductFeatures to fetch.
     */
    orderBy?: ProductFeaturesOrderByWithRelationInput | ProductFeaturesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductFeatures.
     */
    cursor?: ProductFeaturesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductFeatures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductFeatures.
     */
    skip?: number
    distinct?: ProductFeaturesScalarFieldEnum | ProductFeaturesScalarFieldEnum[]
  }

  /**
   * ProductFeatures create
   */
  export type ProductFeaturesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductFeatures
     */
    select?: ProductFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductFeatures
     */
    omit?: ProductFeaturesOmit<ExtArgs> | null
    /**
     * The data needed to create a ProductFeatures.
     */
    data: XOR<ProductFeaturesCreateInput, ProductFeaturesUncheckedCreateInput>
  }

  /**
   * ProductFeatures createMany
   */
  export type ProductFeaturesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductFeatures.
     */
    data: ProductFeaturesCreateManyInput | ProductFeaturesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductFeatures createManyAndReturn
   */
  export type ProductFeaturesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductFeatures
     */
    select?: ProductFeaturesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductFeatures
     */
    omit?: ProductFeaturesOmit<ExtArgs> | null
    /**
     * The data used to create many ProductFeatures.
     */
    data: ProductFeaturesCreateManyInput | ProductFeaturesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductFeatures update
   */
  export type ProductFeaturesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductFeatures
     */
    select?: ProductFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductFeatures
     */
    omit?: ProductFeaturesOmit<ExtArgs> | null
    /**
     * The data needed to update a ProductFeatures.
     */
    data: XOR<ProductFeaturesUpdateInput, ProductFeaturesUncheckedUpdateInput>
    /**
     * Choose, which ProductFeatures to update.
     */
    where: ProductFeaturesWhereUniqueInput
  }

  /**
   * ProductFeatures updateMany
   */
  export type ProductFeaturesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductFeatures.
     */
    data: XOR<ProductFeaturesUpdateManyMutationInput, ProductFeaturesUncheckedUpdateManyInput>
    /**
     * Filter which ProductFeatures to update
     */
    where?: ProductFeaturesWhereInput
    /**
     * Limit how many ProductFeatures to update.
     */
    limit?: number
  }

  /**
   * ProductFeatures updateManyAndReturn
   */
  export type ProductFeaturesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductFeatures
     */
    select?: ProductFeaturesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductFeatures
     */
    omit?: ProductFeaturesOmit<ExtArgs> | null
    /**
     * The data used to update ProductFeatures.
     */
    data: XOR<ProductFeaturesUpdateManyMutationInput, ProductFeaturesUncheckedUpdateManyInput>
    /**
     * Filter which ProductFeatures to update
     */
    where?: ProductFeaturesWhereInput
    /**
     * Limit how many ProductFeatures to update.
     */
    limit?: number
  }

  /**
   * ProductFeatures upsert
   */
  export type ProductFeaturesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductFeatures
     */
    select?: ProductFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductFeatures
     */
    omit?: ProductFeaturesOmit<ExtArgs> | null
    /**
     * The filter to search for the ProductFeatures to update in case it exists.
     */
    where: ProductFeaturesWhereUniqueInput
    /**
     * In case the ProductFeatures found by the `where` argument doesn't exist, create a new ProductFeatures with this data.
     */
    create: XOR<ProductFeaturesCreateInput, ProductFeaturesUncheckedCreateInput>
    /**
     * In case the ProductFeatures was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductFeaturesUpdateInput, ProductFeaturesUncheckedUpdateInput>
  }

  /**
   * ProductFeatures delete
   */
  export type ProductFeaturesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductFeatures
     */
    select?: ProductFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductFeatures
     */
    omit?: ProductFeaturesOmit<ExtArgs> | null
    /**
     * Filter which ProductFeatures to delete.
     */
    where: ProductFeaturesWhereUniqueInput
  }

  /**
   * ProductFeatures deleteMany
   */
  export type ProductFeaturesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductFeatures to delete
     */
    where?: ProductFeaturesWhereInput
    /**
     * Limit how many ProductFeatures to delete.
     */
    limit?: number
  }

  /**
   * ProductFeatures without action
   */
  export type ProductFeaturesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductFeatures
     */
    select?: ProductFeaturesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductFeatures
     */
    omit?: ProductFeaturesOmit<ExtArgs> | null
  }


  /**
   * Model AIAuditLog
   */

  export type AggregateAIAuditLog = {
    _count: AIAuditLogCountAggregateOutputType | null
    _min: AIAuditLogMinAggregateOutputType | null
    _max: AIAuditLogMaxAggregateOutputType | null
  }

  export type AIAuditLogMinAggregateOutputType = {
    id: string | null
    action: string | null
    modelName: string | null
    customerId: string | null
    productId: string | null
    result: string | null
    error: string | null
    createdAt: Date | null
  }

  export type AIAuditLogMaxAggregateOutputType = {
    id: string | null
    action: string | null
    modelName: string | null
    customerId: string | null
    productId: string | null
    result: string | null
    error: string | null
    createdAt: Date | null
  }

  export type AIAuditLogCountAggregateOutputType = {
    id: number
    action: number
    modelName: number
    customerId: number
    productId: number
    details: number
    result: number
    error: number
    createdAt: number
    _all: number
  }


  export type AIAuditLogMinAggregateInputType = {
    id?: true
    action?: true
    modelName?: true
    customerId?: true
    productId?: true
    result?: true
    error?: true
    createdAt?: true
  }

  export type AIAuditLogMaxAggregateInputType = {
    id?: true
    action?: true
    modelName?: true
    customerId?: true
    productId?: true
    result?: true
    error?: true
    createdAt?: true
  }

  export type AIAuditLogCountAggregateInputType = {
    id?: true
    action?: true
    modelName?: true
    customerId?: true
    productId?: true
    details?: true
    result?: true
    error?: true
    createdAt?: true
    _all?: true
  }

  export type AIAuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AIAuditLog to aggregate.
     */
    where?: AIAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIAuditLogs to fetch.
     */
    orderBy?: AIAuditLogOrderByWithRelationInput | AIAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AIAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AIAuditLogs
    **/
    _count?: true | AIAuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AIAuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AIAuditLogMaxAggregateInputType
  }

  export type GetAIAuditLogAggregateType<T extends AIAuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAIAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAIAuditLog[P]>
      : GetScalarType<T[P], AggregateAIAuditLog[P]>
  }




  export type AIAuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AIAuditLogWhereInput
    orderBy?: AIAuditLogOrderByWithAggregationInput | AIAuditLogOrderByWithAggregationInput[]
    by: AIAuditLogScalarFieldEnum[] | AIAuditLogScalarFieldEnum
    having?: AIAuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AIAuditLogCountAggregateInputType | true
    _min?: AIAuditLogMinAggregateInputType
    _max?: AIAuditLogMaxAggregateInputType
  }

  export type AIAuditLogGroupByOutputType = {
    id: string
    action: string
    modelName: string | null
    customerId: string | null
    productId: string | null
    details: JsonValue
    result: string
    error: string | null
    createdAt: Date
    _count: AIAuditLogCountAggregateOutputType | null
    _min: AIAuditLogMinAggregateOutputType | null
    _max: AIAuditLogMaxAggregateOutputType | null
  }

  type GetAIAuditLogGroupByPayload<T extends AIAuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AIAuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AIAuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AIAuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AIAuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AIAuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    modelName?: boolean
    customerId?: boolean
    productId?: boolean
    details?: boolean
    result?: boolean
    error?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aIAuditLog"]>

  export type AIAuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    modelName?: boolean
    customerId?: boolean
    productId?: boolean
    details?: boolean
    result?: boolean
    error?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aIAuditLog"]>

  export type AIAuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    modelName?: boolean
    customerId?: boolean
    productId?: boolean
    details?: boolean
    result?: boolean
    error?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aIAuditLog"]>

  export type AIAuditLogSelectScalar = {
    id?: boolean
    action?: boolean
    modelName?: boolean
    customerId?: boolean
    productId?: boolean
    details?: boolean
    result?: boolean
    error?: boolean
    createdAt?: boolean
  }

  export type AIAuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "action" | "modelName" | "customerId" | "productId" | "details" | "result" | "error" | "createdAt", ExtArgs["result"]["aIAuditLog"]>

  export type $AIAuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AIAuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      action: string
      modelName: string | null
      customerId: string | null
      productId: string | null
      details: Prisma.JsonValue
      result: string
      error: string | null
      createdAt: Date
    }, ExtArgs["result"]["aIAuditLog"]>
    composites: {}
  }

  type AIAuditLogGetPayload<S extends boolean | null | undefined | AIAuditLogDefaultArgs> = $Result.GetResult<Prisma.$AIAuditLogPayload, S>

  type AIAuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AIAuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AIAuditLogCountAggregateInputType | true
    }

  export interface AIAuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AIAuditLog'], meta: { name: 'AIAuditLog' } }
    /**
     * Find zero or one AIAuditLog that matches the filter.
     * @param {AIAuditLogFindUniqueArgs} args - Arguments to find a AIAuditLog
     * @example
     * // Get one AIAuditLog
     * const aIAuditLog = await prisma.aIAuditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AIAuditLogFindUniqueArgs>(args: SelectSubset<T, AIAuditLogFindUniqueArgs<ExtArgs>>): Prisma__AIAuditLogClient<$Result.GetResult<Prisma.$AIAuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AIAuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AIAuditLogFindUniqueOrThrowArgs} args - Arguments to find a AIAuditLog
     * @example
     * // Get one AIAuditLog
     * const aIAuditLog = await prisma.aIAuditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AIAuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AIAuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AIAuditLogClient<$Result.GetResult<Prisma.$AIAuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AIAuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIAuditLogFindFirstArgs} args - Arguments to find a AIAuditLog
     * @example
     * // Get one AIAuditLog
     * const aIAuditLog = await prisma.aIAuditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AIAuditLogFindFirstArgs>(args?: SelectSubset<T, AIAuditLogFindFirstArgs<ExtArgs>>): Prisma__AIAuditLogClient<$Result.GetResult<Prisma.$AIAuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AIAuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIAuditLogFindFirstOrThrowArgs} args - Arguments to find a AIAuditLog
     * @example
     * // Get one AIAuditLog
     * const aIAuditLog = await prisma.aIAuditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AIAuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AIAuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AIAuditLogClient<$Result.GetResult<Prisma.$AIAuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AIAuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIAuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AIAuditLogs
     * const aIAuditLogs = await prisma.aIAuditLog.findMany()
     * 
     * // Get first 10 AIAuditLogs
     * const aIAuditLogs = await prisma.aIAuditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aIAuditLogWithIdOnly = await prisma.aIAuditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AIAuditLogFindManyArgs>(args?: SelectSubset<T, AIAuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AIAuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AIAuditLog.
     * @param {AIAuditLogCreateArgs} args - Arguments to create a AIAuditLog.
     * @example
     * // Create one AIAuditLog
     * const AIAuditLog = await prisma.aIAuditLog.create({
     *   data: {
     *     // ... data to create a AIAuditLog
     *   }
     * })
     * 
     */
    create<T extends AIAuditLogCreateArgs>(args: SelectSubset<T, AIAuditLogCreateArgs<ExtArgs>>): Prisma__AIAuditLogClient<$Result.GetResult<Prisma.$AIAuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AIAuditLogs.
     * @param {AIAuditLogCreateManyArgs} args - Arguments to create many AIAuditLogs.
     * @example
     * // Create many AIAuditLogs
     * const aIAuditLog = await prisma.aIAuditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AIAuditLogCreateManyArgs>(args?: SelectSubset<T, AIAuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AIAuditLogs and returns the data saved in the database.
     * @param {AIAuditLogCreateManyAndReturnArgs} args - Arguments to create many AIAuditLogs.
     * @example
     * // Create many AIAuditLogs
     * const aIAuditLog = await prisma.aIAuditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AIAuditLogs and only return the `id`
     * const aIAuditLogWithIdOnly = await prisma.aIAuditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AIAuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AIAuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AIAuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AIAuditLog.
     * @param {AIAuditLogDeleteArgs} args - Arguments to delete one AIAuditLog.
     * @example
     * // Delete one AIAuditLog
     * const AIAuditLog = await prisma.aIAuditLog.delete({
     *   where: {
     *     // ... filter to delete one AIAuditLog
     *   }
     * })
     * 
     */
    delete<T extends AIAuditLogDeleteArgs>(args: SelectSubset<T, AIAuditLogDeleteArgs<ExtArgs>>): Prisma__AIAuditLogClient<$Result.GetResult<Prisma.$AIAuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AIAuditLog.
     * @param {AIAuditLogUpdateArgs} args - Arguments to update one AIAuditLog.
     * @example
     * // Update one AIAuditLog
     * const aIAuditLog = await prisma.aIAuditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AIAuditLogUpdateArgs>(args: SelectSubset<T, AIAuditLogUpdateArgs<ExtArgs>>): Prisma__AIAuditLogClient<$Result.GetResult<Prisma.$AIAuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AIAuditLogs.
     * @param {AIAuditLogDeleteManyArgs} args - Arguments to filter AIAuditLogs to delete.
     * @example
     * // Delete a few AIAuditLogs
     * const { count } = await prisma.aIAuditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AIAuditLogDeleteManyArgs>(args?: SelectSubset<T, AIAuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AIAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIAuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AIAuditLogs
     * const aIAuditLog = await prisma.aIAuditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AIAuditLogUpdateManyArgs>(args: SelectSubset<T, AIAuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AIAuditLogs and returns the data updated in the database.
     * @param {AIAuditLogUpdateManyAndReturnArgs} args - Arguments to update many AIAuditLogs.
     * @example
     * // Update many AIAuditLogs
     * const aIAuditLog = await prisma.aIAuditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AIAuditLogs and only return the `id`
     * const aIAuditLogWithIdOnly = await prisma.aIAuditLog.updateManyAndReturn({
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
    updateManyAndReturn<T extends AIAuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AIAuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AIAuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AIAuditLog.
     * @param {AIAuditLogUpsertArgs} args - Arguments to update or create a AIAuditLog.
     * @example
     * // Update or create a AIAuditLog
     * const aIAuditLog = await prisma.aIAuditLog.upsert({
     *   create: {
     *     // ... data to create a AIAuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AIAuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AIAuditLogUpsertArgs>(args: SelectSubset<T, AIAuditLogUpsertArgs<ExtArgs>>): Prisma__AIAuditLogClient<$Result.GetResult<Prisma.$AIAuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AIAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIAuditLogCountArgs} args - Arguments to filter AIAuditLogs to count.
     * @example
     * // Count the number of AIAuditLogs
     * const count = await prisma.aIAuditLog.count({
     *   where: {
     *     // ... the filter for the AIAuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AIAuditLogCountArgs>(
      args?: Subset<T, AIAuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AIAuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AIAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIAuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AIAuditLogAggregateArgs>(args: Subset<T, AIAuditLogAggregateArgs>): Prisma.PrismaPromise<GetAIAuditLogAggregateType<T>>

    /**
     * Group by AIAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIAuditLogGroupByArgs} args - Group by arguments.
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
      T extends AIAuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AIAuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AIAuditLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AIAuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAIAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AIAuditLog model
   */
  readonly fields: AIAuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AIAuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AIAuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the AIAuditLog model
   */
  interface AIAuditLogFieldRefs {
    readonly id: FieldRef<"AIAuditLog", 'String'>
    readonly action: FieldRef<"AIAuditLog", 'String'>
    readonly modelName: FieldRef<"AIAuditLog", 'String'>
    readonly customerId: FieldRef<"AIAuditLog", 'String'>
    readonly productId: FieldRef<"AIAuditLog", 'String'>
    readonly details: FieldRef<"AIAuditLog", 'Json'>
    readonly result: FieldRef<"AIAuditLog", 'String'>
    readonly error: FieldRef<"AIAuditLog", 'String'>
    readonly createdAt: FieldRef<"AIAuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AIAuditLog findUnique
   */
  export type AIAuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAuditLog
     */
    select?: AIAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIAuditLog
     */
    omit?: AIAuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AIAuditLog to fetch.
     */
    where: AIAuditLogWhereUniqueInput
  }

  /**
   * AIAuditLog findUniqueOrThrow
   */
  export type AIAuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAuditLog
     */
    select?: AIAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIAuditLog
     */
    omit?: AIAuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AIAuditLog to fetch.
     */
    where: AIAuditLogWhereUniqueInput
  }

  /**
   * AIAuditLog findFirst
   */
  export type AIAuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAuditLog
     */
    select?: AIAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIAuditLog
     */
    omit?: AIAuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AIAuditLog to fetch.
     */
    where?: AIAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIAuditLogs to fetch.
     */
    orderBy?: AIAuditLogOrderByWithRelationInput | AIAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AIAuditLogs.
     */
    cursor?: AIAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AIAuditLogs.
     */
    distinct?: AIAuditLogScalarFieldEnum | AIAuditLogScalarFieldEnum[]
  }

  /**
   * AIAuditLog findFirstOrThrow
   */
  export type AIAuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAuditLog
     */
    select?: AIAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIAuditLog
     */
    omit?: AIAuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AIAuditLog to fetch.
     */
    where?: AIAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIAuditLogs to fetch.
     */
    orderBy?: AIAuditLogOrderByWithRelationInput | AIAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AIAuditLogs.
     */
    cursor?: AIAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AIAuditLogs.
     */
    distinct?: AIAuditLogScalarFieldEnum | AIAuditLogScalarFieldEnum[]
  }

  /**
   * AIAuditLog findMany
   */
  export type AIAuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAuditLog
     */
    select?: AIAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIAuditLog
     */
    omit?: AIAuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AIAuditLogs to fetch.
     */
    where?: AIAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIAuditLogs to fetch.
     */
    orderBy?: AIAuditLogOrderByWithRelationInput | AIAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AIAuditLogs.
     */
    cursor?: AIAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIAuditLogs.
     */
    skip?: number
    distinct?: AIAuditLogScalarFieldEnum | AIAuditLogScalarFieldEnum[]
  }

  /**
   * AIAuditLog create
   */
  export type AIAuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAuditLog
     */
    select?: AIAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIAuditLog
     */
    omit?: AIAuditLogOmit<ExtArgs> | null
    /**
     * The data needed to create a AIAuditLog.
     */
    data: XOR<AIAuditLogCreateInput, AIAuditLogUncheckedCreateInput>
  }

  /**
   * AIAuditLog createMany
   */
  export type AIAuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AIAuditLogs.
     */
    data: AIAuditLogCreateManyInput | AIAuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AIAuditLog createManyAndReturn
   */
  export type AIAuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAuditLog
     */
    select?: AIAuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AIAuditLog
     */
    omit?: AIAuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AIAuditLogs.
     */
    data: AIAuditLogCreateManyInput | AIAuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AIAuditLog update
   */
  export type AIAuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAuditLog
     */
    select?: AIAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIAuditLog
     */
    omit?: AIAuditLogOmit<ExtArgs> | null
    /**
     * The data needed to update a AIAuditLog.
     */
    data: XOR<AIAuditLogUpdateInput, AIAuditLogUncheckedUpdateInput>
    /**
     * Choose, which AIAuditLog to update.
     */
    where: AIAuditLogWhereUniqueInput
  }

  /**
   * AIAuditLog updateMany
   */
  export type AIAuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AIAuditLogs.
     */
    data: XOR<AIAuditLogUpdateManyMutationInput, AIAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AIAuditLogs to update
     */
    where?: AIAuditLogWhereInput
    /**
     * Limit how many AIAuditLogs to update.
     */
    limit?: number
  }

  /**
   * AIAuditLog updateManyAndReturn
   */
  export type AIAuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAuditLog
     */
    select?: AIAuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AIAuditLog
     */
    omit?: AIAuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AIAuditLogs.
     */
    data: XOR<AIAuditLogUpdateManyMutationInput, AIAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AIAuditLogs to update
     */
    where?: AIAuditLogWhereInput
    /**
     * Limit how many AIAuditLogs to update.
     */
    limit?: number
  }

  /**
   * AIAuditLog upsert
   */
  export type AIAuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAuditLog
     */
    select?: AIAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIAuditLog
     */
    omit?: AIAuditLogOmit<ExtArgs> | null
    /**
     * The filter to search for the AIAuditLog to update in case it exists.
     */
    where: AIAuditLogWhereUniqueInput
    /**
     * In case the AIAuditLog found by the `where` argument doesn't exist, create a new AIAuditLog with this data.
     */
    create: XOR<AIAuditLogCreateInput, AIAuditLogUncheckedCreateInput>
    /**
     * In case the AIAuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AIAuditLogUpdateInput, AIAuditLogUncheckedUpdateInput>
  }

  /**
   * AIAuditLog delete
   */
  export type AIAuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAuditLog
     */
    select?: AIAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIAuditLog
     */
    omit?: AIAuditLogOmit<ExtArgs> | null
    /**
     * Filter which AIAuditLog to delete.
     */
    where: AIAuditLogWhereUniqueInput
  }

  /**
   * AIAuditLog deleteMany
   */
  export type AIAuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AIAuditLogs to delete
     */
    where?: AIAuditLogWhereInput
    /**
     * Limit how many AIAuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AIAuditLog without action
   */
  export type AIAuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAuditLog
     */
    select?: AIAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AIAuditLog
     */
    omit?: AIAuditLogOmit<ExtArgs> | null
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


  export const ProductEmbeddingScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    embedding: 'embedding',
    model: 'model',
    modelVersion: 'modelVersion',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProductEmbeddingScalarFieldEnum = (typeof ProductEmbeddingScalarFieldEnum)[keyof typeof ProductEmbeddingScalarFieldEnum]


  export const CustomerBehaviorScalarFieldEnum: {
    id: 'id',
    customerId: 'customerId',
    eventType: 'eventType',
    productId: 'productId',
    category: 'category',
    sessionId: 'sessionId',
    duration: 'duration',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type CustomerBehaviorScalarFieldEnum = (typeof CustomerBehaviorScalarFieldEnum)[keyof typeof CustomerBehaviorScalarFieldEnum]


  export const ChurnPredictionScalarFieldEnum: {
    id: 'id',
    customerId: 'customerId',
    churnScore: 'churnScore',
    riskFactors: 'riskFactors',
    lastUpdated: 'lastUpdated',
    nextReviewDate: 'nextReviewDate'
  };

  export type ChurnPredictionScalarFieldEnum = (typeof ChurnPredictionScalarFieldEnum)[keyof typeof ChurnPredictionScalarFieldEnum]


  export const ProductRecommendationScalarFieldEnum: {
    id: 'id',
    customerId: 'customerId',
    productId: 'productId',
    score: 'score',
    method: 'method',
    clicked: 'clicked',
    purchased: 'purchased',
    createdAt: 'createdAt'
  };

  export type ProductRecommendationScalarFieldEnum = (typeof ProductRecommendationScalarFieldEnum)[keyof typeof ProductRecommendationScalarFieldEnum]


  export const SentimentAnalysisScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    customerId: 'customerId',
    text: 'text',
    sentiment: 'sentiment',
    score: 'score',
    emotions: 'emotions',
    language: 'language',
    model: 'model',
    createdAt: 'createdAt'
  };

  export type SentimentAnalysisScalarFieldEnum = (typeof SentimentAnalysisScalarFieldEnum)[keyof typeof SentimentAnalysisScalarFieldEnum]


  export const PriceOptimizationScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    currentPrice: 'currentPrice',
    optimalPrice: 'optimalPrice',
    elasticity: 'elasticity',
    conversionRate: 'conversionRate',
    expectedRevenue: 'expectedRevenue',
    lastOptimized: 'lastOptimized'
  };

  export type PriceOptimizationScalarFieldEnum = (typeof PriceOptimizationScalarFieldEnum)[keyof typeof PriceOptimizationScalarFieldEnum]


  export const CustomerLTVScalarFieldEnum: {
    id: 'id',
    customerId: 'customerId',
    ltv: 'ltv',
    clv: 'clv',
    segment: 'segment',
    roi: 'roi',
    predictedMonthly: 'predictedMonthly',
    lastComputed: 'lastComputed'
  };

  export type CustomerLTVScalarFieldEnum = (typeof CustomerLTVScalarFieldEnum)[keyof typeof CustomerLTVScalarFieldEnum]


  export const ABTestScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    variantA: 'variantA',
    variantB: 'variantB',
    controlGroup: 'controlGroup',
    testGroup: 'testGroup',
    metric: 'metric',
    startDate: 'startDate',
    endDate: 'endDate',
    pValue: 'pValue',
    winner: 'winner',
    createdAt: 'createdAt'
  };

  export type ABTestScalarFieldEnum = (typeof ABTestScalarFieldEnum)[keyof typeof ABTestScalarFieldEnum]


  export const FraudScoreScalarFieldEnum: {
    id: 'id',
    customerId: 'customerId',
    orderId: 'orderId',
    score: 'score',
    riskFactors: 'riskFactors',
    flagged: 'flagged',
    reviewedAt: 'reviewedAt',
    reviewedBy: 'reviewedBy',
    decision: 'decision',
    createdAt: 'createdAt'
  };

  export type FraudScoreScalarFieldEnum = (typeof FraudScoreScalarFieldEnum)[keyof typeof FraudScoreScalarFieldEnum]


  export const MLModelScalarFieldEnum: {
    id: 'id',
    name: 'name',
    version: 'version',
    type: 'type',
    framework: 'framework',
    modelPath: 'modelPath',
    accuracy: 'accuracy',
    precision: 'precision',
    recall: 'recall',
    f1Score: 'f1Score',
    deployedAt: 'deployedAt',
    lastEvaluated: 'lastEvaluated',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MLModelScalarFieldEnum = (typeof MLModelScalarFieldEnum)[keyof typeof MLModelScalarFieldEnum]


  export const ModelTrainingLogScalarFieldEnum: {
    id: 'id',
    modelId: 'modelId',
    epoch: 'epoch',
    loss: 'loss',
    accuracy: 'accuracy',
    val_loss: 'val_loss',
    val_accuracy: 'val_accuracy',
    timestamp: 'timestamp'
  };

  export type ModelTrainingLogScalarFieldEnum = (typeof ModelTrainingLogScalarFieldEnum)[keyof typeof ModelTrainingLogScalarFieldEnum]


  export const UserFeaturesScalarFieldEnum: {
    id: 'id',
    customerId: 'customerId',
    totalOrders: 'totalOrders',
    totalSpent: 'totalSpent',
    avgOrderValue: 'avgOrderValue',
    daysSinceLastOrder: 'daysSinceLastOrder',
    categoryPreference: 'categoryPreference',
    deviceType: 'deviceType',
    browser: 'browser',
    timezone: 'timezone',
    lastComputedAt: 'lastComputedAt'
  };

  export type UserFeaturesScalarFieldEnum = (typeof UserFeaturesScalarFieldEnum)[keyof typeof UserFeaturesScalarFieldEnum]


  export const ProductFeaturesScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    category: 'category',
    avgRating: 'avgRating',
    reviewCount: 'reviewCount',
    returnRate: 'returnRate',
    profitMargin: 'profitMargin',
    stockLevel: 'stockLevel',
    competitorCount: 'competitorCount',
    seasonality: 'seasonality',
    lastComputedAt: 'lastComputedAt'
  };

  export type ProductFeaturesScalarFieldEnum = (typeof ProductFeaturesScalarFieldEnum)[keyof typeof ProductFeaturesScalarFieldEnum]


  export const AIAuditLogScalarFieldEnum: {
    id: 'id',
    action: 'action',
    modelName: 'modelName',
    customerId: 'customerId',
    productId: 'productId',
    details: 'details',
    result: 'result',
    error: 'error',
    createdAt: 'createdAt'
  };

  export type AIAuditLogScalarFieldEnum = (typeof AIAuditLogScalarFieldEnum)[keyof typeof AIAuditLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


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
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


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
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type ProductEmbeddingWhereInput = {
    AND?: ProductEmbeddingWhereInput | ProductEmbeddingWhereInput[]
    OR?: ProductEmbeddingWhereInput[]
    NOT?: ProductEmbeddingWhereInput | ProductEmbeddingWhereInput[]
    id?: StringFilter<"ProductEmbedding"> | string
    productId?: StringFilter<"ProductEmbedding"> | string
    embedding?: FloatNullableListFilter<"ProductEmbedding">
    model?: StringFilter<"ProductEmbedding"> | string
    modelVersion?: StringFilter<"ProductEmbedding"> | string
    createdAt?: DateTimeFilter<"ProductEmbedding"> | Date | string
    updatedAt?: DateTimeFilter<"ProductEmbedding"> | Date | string
  }

  export type ProductEmbeddingOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    embedding?: SortOrder
    model?: SortOrder
    modelVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductEmbeddingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    productId?: string
    AND?: ProductEmbeddingWhereInput | ProductEmbeddingWhereInput[]
    OR?: ProductEmbeddingWhereInput[]
    NOT?: ProductEmbeddingWhereInput | ProductEmbeddingWhereInput[]
    embedding?: FloatNullableListFilter<"ProductEmbedding">
    model?: StringFilter<"ProductEmbedding"> | string
    modelVersion?: StringFilter<"ProductEmbedding"> | string
    createdAt?: DateTimeFilter<"ProductEmbedding"> | Date | string
    updatedAt?: DateTimeFilter<"ProductEmbedding"> | Date | string
  }, "id" | "productId">

  export type ProductEmbeddingOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    embedding?: SortOrder
    model?: SortOrder
    modelVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProductEmbeddingCountOrderByAggregateInput
    _avg?: ProductEmbeddingAvgOrderByAggregateInput
    _max?: ProductEmbeddingMaxOrderByAggregateInput
    _min?: ProductEmbeddingMinOrderByAggregateInput
    _sum?: ProductEmbeddingSumOrderByAggregateInput
  }

  export type ProductEmbeddingScalarWhereWithAggregatesInput = {
    AND?: ProductEmbeddingScalarWhereWithAggregatesInput | ProductEmbeddingScalarWhereWithAggregatesInput[]
    OR?: ProductEmbeddingScalarWhereWithAggregatesInput[]
    NOT?: ProductEmbeddingScalarWhereWithAggregatesInput | ProductEmbeddingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProductEmbedding"> | string
    productId?: StringWithAggregatesFilter<"ProductEmbedding"> | string
    embedding?: FloatNullableListFilter<"ProductEmbedding">
    model?: StringWithAggregatesFilter<"ProductEmbedding"> | string
    modelVersion?: StringWithAggregatesFilter<"ProductEmbedding"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ProductEmbedding"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProductEmbedding"> | Date | string
  }

  export type CustomerBehaviorWhereInput = {
    AND?: CustomerBehaviorWhereInput | CustomerBehaviorWhereInput[]
    OR?: CustomerBehaviorWhereInput[]
    NOT?: CustomerBehaviorWhereInput | CustomerBehaviorWhereInput[]
    id?: StringFilter<"CustomerBehavior"> | string
    customerId?: StringFilter<"CustomerBehavior"> | string
    eventType?: StringFilter<"CustomerBehavior"> | string
    productId?: StringFilter<"CustomerBehavior"> | string
    category?: StringFilter<"CustomerBehavior"> | string
    sessionId?: StringFilter<"CustomerBehavior"> | string
    duration?: IntFilter<"CustomerBehavior"> | number
    metadata?: JsonFilter<"CustomerBehavior">
    createdAt?: DateTimeFilter<"CustomerBehavior"> | Date | string
  }

  export type CustomerBehaviorOrderByWithRelationInput = {
    id?: SortOrder
    customerId?: SortOrder
    eventType?: SortOrder
    productId?: SortOrder
    category?: SortOrder
    sessionId?: SortOrder
    duration?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type CustomerBehaviorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CustomerBehaviorWhereInput | CustomerBehaviorWhereInput[]
    OR?: CustomerBehaviorWhereInput[]
    NOT?: CustomerBehaviorWhereInput | CustomerBehaviorWhereInput[]
    customerId?: StringFilter<"CustomerBehavior"> | string
    eventType?: StringFilter<"CustomerBehavior"> | string
    productId?: StringFilter<"CustomerBehavior"> | string
    category?: StringFilter<"CustomerBehavior"> | string
    sessionId?: StringFilter<"CustomerBehavior"> | string
    duration?: IntFilter<"CustomerBehavior"> | number
    metadata?: JsonFilter<"CustomerBehavior">
    createdAt?: DateTimeFilter<"CustomerBehavior"> | Date | string
  }, "id">

  export type CustomerBehaviorOrderByWithAggregationInput = {
    id?: SortOrder
    customerId?: SortOrder
    eventType?: SortOrder
    productId?: SortOrder
    category?: SortOrder
    sessionId?: SortOrder
    duration?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    _count?: CustomerBehaviorCountOrderByAggregateInput
    _avg?: CustomerBehaviorAvgOrderByAggregateInput
    _max?: CustomerBehaviorMaxOrderByAggregateInput
    _min?: CustomerBehaviorMinOrderByAggregateInput
    _sum?: CustomerBehaviorSumOrderByAggregateInput
  }

  export type CustomerBehaviorScalarWhereWithAggregatesInput = {
    AND?: CustomerBehaviorScalarWhereWithAggregatesInput | CustomerBehaviorScalarWhereWithAggregatesInput[]
    OR?: CustomerBehaviorScalarWhereWithAggregatesInput[]
    NOT?: CustomerBehaviorScalarWhereWithAggregatesInput | CustomerBehaviorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CustomerBehavior"> | string
    customerId?: StringWithAggregatesFilter<"CustomerBehavior"> | string
    eventType?: StringWithAggregatesFilter<"CustomerBehavior"> | string
    productId?: StringWithAggregatesFilter<"CustomerBehavior"> | string
    category?: StringWithAggregatesFilter<"CustomerBehavior"> | string
    sessionId?: StringWithAggregatesFilter<"CustomerBehavior"> | string
    duration?: IntWithAggregatesFilter<"CustomerBehavior"> | number
    metadata?: JsonWithAggregatesFilter<"CustomerBehavior">
    createdAt?: DateTimeWithAggregatesFilter<"CustomerBehavior"> | Date | string
  }

  export type ChurnPredictionWhereInput = {
    AND?: ChurnPredictionWhereInput | ChurnPredictionWhereInput[]
    OR?: ChurnPredictionWhereInput[]
    NOT?: ChurnPredictionWhereInput | ChurnPredictionWhereInput[]
    id?: StringFilter<"ChurnPrediction"> | string
    customerId?: StringFilter<"ChurnPrediction"> | string
    churnScore?: FloatFilter<"ChurnPrediction"> | number
    riskFactors?: StringNullableListFilter<"ChurnPrediction">
    lastUpdated?: DateTimeFilter<"ChurnPrediction"> | Date | string
    nextReviewDate?: DateTimeFilter<"ChurnPrediction"> | Date | string
  }

  export type ChurnPredictionOrderByWithRelationInput = {
    id?: SortOrder
    customerId?: SortOrder
    churnScore?: SortOrder
    riskFactors?: SortOrder
    lastUpdated?: SortOrder
    nextReviewDate?: SortOrder
  }

  export type ChurnPredictionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    customerId?: string
    AND?: ChurnPredictionWhereInput | ChurnPredictionWhereInput[]
    OR?: ChurnPredictionWhereInput[]
    NOT?: ChurnPredictionWhereInput | ChurnPredictionWhereInput[]
    churnScore?: FloatFilter<"ChurnPrediction"> | number
    riskFactors?: StringNullableListFilter<"ChurnPrediction">
    lastUpdated?: DateTimeFilter<"ChurnPrediction"> | Date | string
    nextReviewDate?: DateTimeFilter<"ChurnPrediction"> | Date | string
  }, "id" | "customerId">

  export type ChurnPredictionOrderByWithAggregationInput = {
    id?: SortOrder
    customerId?: SortOrder
    churnScore?: SortOrder
    riskFactors?: SortOrder
    lastUpdated?: SortOrder
    nextReviewDate?: SortOrder
    _count?: ChurnPredictionCountOrderByAggregateInput
    _avg?: ChurnPredictionAvgOrderByAggregateInput
    _max?: ChurnPredictionMaxOrderByAggregateInput
    _min?: ChurnPredictionMinOrderByAggregateInput
    _sum?: ChurnPredictionSumOrderByAggregateInput
  }

  export type ChurnPredictionScalarWhereWithAggregatesInput = {
    AND?: ChurnPredictionScalarWhereWithAggregatesInput | ChurnPredictionScalarWhereWithAggregatesInput[]
    OR?: ChurnPredictionScalarWhereWithAggregatesInput[]
    NOT?: ChurnPredictionScalarWhereWithAggregatesInput | ChurnPredictionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChurnPrediction"> | string
    customerId?: StringWithAggregatesFilter<"ChurnPrediction"> | string
    churnScore?: FloatWithAggregatesFilter<"ChurnPrediction"> | number
    riskFactors?: StringNullableListFilter<"ChurnPrediction">
    lastUpdated?: DateTimeWithAggregatesFilter<"ChurnPrediction"> | Date | string
    nextReviewDate?: DateTimeWithAggregatesFilter<"ChurnPrediction"> | Date | string
  }

  export type ProductRecommendationWhereInput = {
    AND?: ProductRecommendationWhereInput | ProductRecommendationWhereInput[]
    OR?: ProductRecommendationWhereInput[]
    NOT?: ProductRecommendationWhereInput | ProductRecommendationWhereInput[]
    id?: StringFilter<"ProductRecommendation"> | string
    customerId?: StringFilter<"ProductRecommendation"> | string
    productId?: StringFilter<"ProductRecommendation"> | string
    score?: FloatFilter<"ProductRecommendation"> | number
    method?: StringFilter<"ProductRecommendation"> | string
    clicked?: BoolFilter<"ProductRecommendation"> | boolean
    purchased?: BoolFilter<"ProductRecommendation"> | boolean
    createdAt?: DateTimeFilter<"ProductRecommendation"> | Date | string
  }

  export type ProductRecommendationOrderByWithRelationInput = {
    id?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    score?: SortOrder
    method?: SortOrder
    clicked?: SortOrder
    purchased?: SortOrder
    createdAt?: SortOrder
  }

  export type ProductRecommendationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProductRecommendationWhereInput | ProductRecommendationWhereInput[]
    OR?: ProductRecommendationWhereInput[]
    NOT?: ProductRecommendationWhereInput | ProductRecommendationWhereInput[]
    customerId?: StringFilter<"ProductRecommendation"> | string
    productId?: StringFilter<"ProductRecommendation"> | string
    score?: FloatFilter<"ProductRecommendation"> | number
    method?: StringFilter<"ProductRecommendation"> | string
    clicked?: BoolFilter<"ProductRecommendation"> | boolean
    purchased?: BoolFilter<"ProductRecommendation"> | boolean
    createdAt?: DateTimeFilter<"ProductRecommendation"> | Date | string
  }, "id">

  export type ProductRecommendationOrderByWithAggregationInput = {
    id?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    score?: SortOrder
    method?: SortOrder
    clicked?: SortOrder
    purchased?: SortOrder
    createdAt?: SortOrder
    _count?: ProductRecommendationCountOrderByAggregateInput
    _avg?: ProductRecommendationAvgOrderByAggregateInput
    _max?: ProductRecommendationMaxOrderByAggregateInput
    _min?: ProductRecommendationMinOrderByAggregateInput
    _sum?: ProductRecommendationSumOrderByAggregateInput
  }

  export type ProductRecommendationScalarWhereWithAggregatesInput = {
    AND?: ProductRecommendationScalarWhereWithAggregatesInput | ProductRecommendationScalarWhereWithAggregatesInput[]
    OR?: ProductRecommendationScalarWhereWithAggregatesInput[]
    NOT?: ProductRecommendationScalarWhereWithAggregatesInput | ProductRecommendationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProductRecommendation"> | string
    customerId?: StringWithAggregatesFilter<"ProductRecommendation"> | string
    productId?: StringWithAggregatesFilter<"ProductRecommendation"> | string
    score?: FloatWithAggregatesFilter<"ProductRecommendation"> | number
    method?: StringWithAggregatesFilter<"ProductRecommendation"> | string
    clicked?: BoolWithAggregatesFilter<"ProductRecommendation"> | boolean
    purchased?: BoolWithAggregatesFilter<"ProductRecommendation"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ProductRecommendation"> | Date | string
  }

  export type SentimentAnalysisWhereInput = {
    AND?: SentimentAnalysisWhereInput | SentimentAnalysisWhereInput[]
    OR?: SentimentAnalysisWhereInput[]
    NOT?: SentimentAnalysisWhereInput | SentimentAnalysisWhereInput[]
    id?: StringFilter<"SentimentAnalysis"> | string
    productId?: StringFilter<"SentimentAnalysis"> | string
    customerId?: StringFilter<"SentimentAnalysis"> | string
    text?: StringFilter<"SentimentAnalysis"> | string
    sentiment?: StringFilter<"SentimentAnalysis"> | string
    score?: FloatFilter<"SentimentAnalysis"> | number
    emotions?: StringNullableListFilter<"SentimentAnalysis">
    language?: StringFilter<"SentimentAnalysis"> | string
    model?: StringFilter<"SentimentAnalysis"> | string
    createdAt?: DateTimeFilter<"SentimentAnalysis"> | Date | string
  }

  export type SentimentAnalysisOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    customerId?: SortOrder
    text?: SortOrder
    sentiment?: SortOrder
    score?: SortOrder
    emotions?: SortOrder
    language?: SortOrder
    model?: SortOrder
    createdAt?: SortOrder
  }

  export type SentimentAnalysisWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SentimentAnalysisWhereInput | SentimentAnalysisWhereInput[]
    OR?: SentimentAnalysisWhereInput[]
    NOT?: SentimentAnalysisWhereInput | SentimentAnalysisWhereInput[]
    productId?: StringFilter<"SentimentAnalysis"> | string
    customerId?: StringFilter<"SentimentAnalysis"> | string
    text?: StringFilter<"SentimentAnalysis"> | string
    sentiment?: StringFilter<"SentimentAnalysis"> | string
    score?: FloatFilter<"SentimentAnalysis"> | number
    emotions?: StringNullableListFilter<"SentimentAnalysis">
    language?: StringFilter<"SentimentAnalysis"> | string
    model?: StringFilter<"SentimentAnalysis"> | string
    createdAt?: DateTimeFilter<"SentimentAnalysis"> | Date | string
  }, "id">

  export type SentimentAnalysisOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    customerId?: SortOrder
    text?: SortOrder
    sentiment?: SortOrder
    score?: SortOrder
    emotions?: SortOrder
    language?: SortOrder
    model?: SortOrder
    createdAt?: SortOrder
    _count?: SentimentAnalysisCountOrderByAggregateInput
    _avg?: SentimentAnalysisAvgOrderByAggregateInput
    _max?: SentimentAnalysisMaxOrderByAggregateInput
    _min?: SentimentAnalysisMinOrderByAggregateInput
    _sum?: SentimentAnalysisSumOrderByAggregateInput
  }

  export type SentimentAnalysisScalarWhereWithAggregatesInput = {
    AND?: SentimentAnalysisScalarWhereWithAggregatesInput | SentimentAnalysisScalarWhereWithAggregatesInput[]
    OR?: SentimentAnalysisScalarWhereWithAggregatesInput[]
    NOT?: SentimentAnalysisScalarWhereWithAggregatesInput | SentimentAnalysisScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SentimentAnalysis"> | string
    productId?: StringWithAggregatesFilter<"SentimentAnalysis"> | string
    customerId?: StringWithAggregatesFilter<"SentimentAnalysis"> | string
    text?: StringWithAggregatesFilter<"SentimentAnalysis"> | string
    sentiment?: StringWithAggregatesFilter<"SentimentAnalysis"> | string
    score?: FloatWithAggregatesFilter<"SentimentAnalysis"> | number
    emotions?: StringNullableListFilter<"SentimentAnalysis">
    language?: StringWithAggregatesFilter<"SentimentAnalysis"> | string
    model?: StringWithAggregatesFilter<"SentimentAnalysis"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SentimentAnalysis"> | Date | string
  }

  export type PriceOptimizationWhereInput = {
    AND?: PriceOptimizationWhereInput | PriceOptimizationWhereInput[]
    OR?: PriceOptimizationWhereInput[]
    NOT?: PriceOptimizationWhereInput | PriceOptimizationWhereInput[]
    id?: StringFilter<"PriceOptimization"> | string
    productId?: StringFilter<"PriceOptimization"> | string
    currentPrice?: FloatFilter<"PriceOptimization"> | number
    optimalPrice?: FloatFilter<"PriceOptimization"> | number
    elasticity?: FloatFilter<"PriceOptimization"> | number
    conversionRate?: FloatFilter<"PriceOptimization"> | number
    expectedRevenue?: FloatFilter<"PriceOptimization"> | number
    lastOptimized?: DateTimeFilter<"PriceOptimization"> | Date | string
  }

  export type PriceOptimizationOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    currentPrice?: SortOrder
    optimalPrice?: SortOrder
    elasticity?: SortOrder
    conversionRate?: SortOrder
    expectedRevenue?: SortOrder
    lastOptimized?: SortOrder
  }

  export type PriceOptimizationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    productId?: string
    AND?: PriceOptimizationWhereInput | PriceOptimizationWhereInput[]
    OR?: PriceOptimizationWhereInput[]
    NOT?: PriceOptimizationWhereInput | PriceOptimizationWhereInput[]
    currentPrice?: FloatFilter<"PriceOptimization"> | number
    optimalPrice?: FloatFilter<"PriceOptimization"> | number
    elasticity?: FloatFilter<"PriceOptimization"> | number
    conversionRate?: FloatFilter<"PriceOptimization"> | number
    expectedRevenue?: FloatFilter<"PriceOptimization"> | number
    lastOptimized?: DateTimeFilter<"PriceOptimization"> | Date | string
  }, "id" | "productId">

  export type PriceOptimizationOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    currentPrice?: SortOrder
    optimalPrice?: SortOrder
    elasticity?: SortOrder
    conversionRate?: SortOrder
    expectedRevenue?: SortOrder
    lastOptimized?: SortOrder
    _count?: PriceOptimizationCountOrderByAggregateInput
    _avg?: PriceOptimizationAvgOrderByAggregateInput
    _max?: PriceOptimizationMaxOrderByAggregateInput
    _min?: PriceOptimizationMinOrderByAggregateInput
    _sum?: PriceOptimizationSumOrderByAggregateInput
  }

  export type PriceOptimizationScalarWhereWithAggregatesInput = {
    AND?: PriceOptimizationScalarWhereWithAggregatesInput | PriceOptimizationScalarWhereWithAggregatesInput[]
    OR?: PriceOptimizationScalarWhereWithAggregatesInput[]
    NOT?: PriceOptimizationScalarWhereWithAggregatesInput | PriceOptimizationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PriceOptimization"> | string
    productId?: StringWithAggregatesFilter<"PriceOptimization"> | string
    currentPrice?: FloatWithAggregatesFilter<"PriceOptimization"> | number
    optimalPrice?: FloatWithAggregatesFilter<"PriceOptimization"> | number
    elasticity?: FloatWithAggregatesFilter<"PriceOptimization"> | number
    conversionRate?: FloatWithAggregatesFilter<"PriceOptimization"> | number
    expectedRevenue?: FloatWithAggregatesFilter<"PriceOptimization"> | number
    lastOptimized?: DateTimeWithAggregatesFilter<"PriceOptimization"> | Date | string
  }

  export type CustomerLTVWhereInput = {
    AND?: CustomerLTVWhereInput | CustomerLTVWhereInput[]
    OR?: CustomerLTVWhereInput[]
    NOT?: CustomerLTVWhereInput | CustomerLTVWhereInput[]
    id?: StringFilter<"CustomerLTV"> | string
    customerId?: StringFilter<"CustomerLTV"> | string
    ltv?: FloatFilter<"CustomerLTV"> | number
    clv?: FloatFilter<"CustomerLTV"> | number
    segment?: StringFilter<"CustomerLTV"> | string
    roi?: FloatFilter<"CustomerLTV"> | number
    predictedMonthly?: FloatFilter<"CustomerLTV"> | number
    lastComputed?: DateTimeFilter<"CustomerLTV"> | Date | string
  }

  export type CustomerLTVOrderByWithRelationInput = {
    id?: SortOrder
    customerId?: SortOrder
    ltv?: SortOrder
    clv?: SortOrder
    segment?: SortOrder
    roi?: SortOrder
    predictedMonthly?: SortOrder
    lastComputed?: SortOrder
  }

  export type CustomerLTVWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    customerId?: string
    AND?: CustomerLTVWhereInput | CustomerLTVWhereInput[]
    OR?: CustomerLTVWhereInput[]
    NOT?: CustomerLTVWhereInput | CustomerLTVWhereInput[]
    ltv?: FloatFilter<"CustomerLTV"> | number
    clv?: FloatFilter<"CustomerLTV"> | number
    segment?: StringFilter<"CustomerLTV"> | string
    roi?: FloatFilter<"CustomerLTV"> | number
    predictedMonthly?: FloatFilter<"CustomerLTV"> | number
    lastComputed?: DateTimeFilter<"CustomerLTV"> | Date | string
  }, "id" | "customerId">

  export type CustomerLTVOrderByWithAggregationInput = {
    id?: SortOrder
    customerId?: SortOrder
    ltv?: SortOrder
    clv?: SortOrder
    segment?: SortOrder
    roi?: SortOrder
    predictedMonthly?: SortOrder
    lastComputed?: SortOrder
    _count?: CustomerLTVCountOrderByAggregateInput
    _avg?: CustomerLTVAvgOrderByAggregateInput
    _max?: CustomerLTVMaxOrderByAggregateInput
    _min?: CustomerLTVMinOrderByAggregateInput
    _sum?: CustomerLTVSumOrderByAggregateInput
  }

  export type CustomerLTVScalarWhereWithAggregatesInput = {
    AND?: CustomerLTVScalarWhereWithAggregatesInput | CustomerLTVScalarWhereWithAggregatesInput[]
    OR?: CustomerLTVScalarWhereWithAggregatesInput[]
    NOT?: CustomerLTVScalarWhereWithAggregatesInput | CustomerLTVScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CustomerLTV"> | string
    customerId?: StringWithAggregatesFilter<"CustomerLTV"> | string
    ltv?: FloatWithAggregatesFilter<"CustomerLTV"> | number
    clv?: FloatWithAggregatesFilter<"CustomerLTV"> | number
    segment?: StringWithAggregatesFilter<"CustomerLTV"> | string
    roi?: FloatWithAggregatesFilter<"CustomerLTV"> | number
    predictedMonthly?: FloatWithAggregatesFilter<"CustomerLTV"> | number
    lastComputed?: DateTimeWithAggregatesFilter<"CustomerLTV"> | Date | string
  }

  export type ABTestWhereInput = {
    AND?: ABTestWhereInput | ABTestWhereInput[]
    OR?: ABTestWhereInput[]
    NOT?: ABTestWhereInput | ABTestWhereInput[]
    id?: StringFilter<"ABTest"> | string
    name?: StringFilter<"ABTest"> | string
    description?: StringNullableFilter<"ABTest"> | string | null
    variantA?: JsonFilter<"ABTest">
    variantB?: JsonFilter<"ABTest">
    controlGroup?: StringNullableListFilter<"ABTest">
    testGroup?: StringNullableListFilter<"ABTest">
    metric?: StringFilter<"ABTest"> | string
    startDate?: DateTimeFilter<"ABTest"> | Date | string
    endDate?: DateTimeNullableFilter<"ABTest"> | Date | string | null
    pValue?: FloatNullableFilter<"ABTest"> | number | null
    winner?: StringNullableFilter<"ABTest"> | string | null
    createdAt?: DateTimeFilter<"ABTest"> | Date | string
  }

  export type ABTestOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    variantA?: SortOrder
    variantB?: SortOrder
    controlGroup?: SortOrder
    testGroup?: SortOrder
    metric?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    pValue?: SortOrderInput | SortOrder
    winner?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type ABTestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ABTestWhereInput | ABTestWhereInput[]
    OR?: ABTestWhereInput[]
    NOT?: ABTestWhereInput | ABTestWhereInput[]
    name?: StringFilter<"ABTest"> | string
    description?: StringNullableFilter<"ABTest"> | string | null
    variantA?: JsonFilter<"ABTest">
    variantB?: JsonFilter<"ABTest">
    controlGroup?: StringNullableListFilter<"ABTest">
    testGroup?: StringNullableListFilter<"ABTest">
    metric?: StringFilter<"ABTest"> | string
    startDate?: DateTimeFilter<"ABTest"> | Date | string
    endDate?: DateTimeNullableFilter<"ABTest"> | Date | string | null
    pValue?: FloatNullableFilter<"ABTest"> | number | null
    winner?: StringNullableFilter<"ABTest"> | string | null
    createdAt?: DateTimeFilter<"ABTest"> | Date | string
  }, "id">

  export type ABTestOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    variantA?: SortOrder
    variantB?: SortOrder
    controlGroup?: SortOrder
    testGroup?: SortOrder
    metric?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    pValue?: SortOrderInput | SortOrder
    winner?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ABTestCountOrderByAggregateInput
    _avg?: ABTestAvgOrderByAggregateInput
    _max?: ABTestMaxOrderByAggregateInput
    _min?: ABTestMinOrderByAggregateInput
    _sum?: ABTestSumOrderByAggregateInput
  }

  export type ABTestScalarWhereWithAggregatesInput = {
    AND?: ABTestScalarWhereWithAggregatesInput | ABTestScalarWhereWithAggregatesInput[]
    OR?: ABTestScalarWhereWithAggregatesInput[]
    NOT?: ABTestScalarWhereWithAggregatesInput | ABTestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ABTest"> | string
    name?: StringWithAggregatesFilter<"ABTest"> | string
    description?: StringNullableWithAggregatesFilter<"ABTest"> | string | null
    variantA?: JsonWithAggregatesFilter<"ABTest">
    variantB?: JsonWithAggregatesFilter<"ABTest">
    controlGroup?: StringNullableListFilter<"ABTest">
    testGroup?: StringNullableListFilter<"ABTest">
    metric?: StringWithAggregatesFilter<"ABTest"> | string
    startDate?: DateTimeWithAggregatesFilter<"ABTest"> | Date | string
    endDate?: DateTimeNullableWithAggregatesFilter<"ABTest"> | Date | string | null
    pValue?: FloatNullableWithAggregatesFilter<"ABTest"> | number | null
    winner?: StringNullableWithAggregatesFilter<"ABTest"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ABTest"> | Date | string
  }

  export type FraudScoreWhereInput = {
    AND?: FraudScoreWhereInput | FraudScoreWhereInput[]
    OR?: FraudScoreWhereInput[]
    NOT?: FraudScoreWhereInput | FraudScoreWhereInput[]
    id?: StringFilter<"FraudScore"> | string
    customerId?: StringFilter<"FraudScore"> | string
    orderId?: StringFilter<"FraudScore"> | string
    score?: FloatFilter<"FraudScore"> | number
    riskFactors?: StringNullableListFilter<"FraudScore">
    flagged?: BoolFilter<"FraudScore"> | boolean
    reviewedAt?: DateTimeNullableFilter<"FraudScore"> | Date | string | null
    reviewedBy?: StringNullableFilter<"FraudScore"> | string | null
    decision?: StringNullableFilter<"FraudScore"> | string | null
    createdAt?: DateTimeFilter<"FraudScore"> | Date | string
  }

  export type FraudScoreOrderByWithRelationInput = {
    id?: SortOrder
    customerId?: SortOrder
    orderId?: SortOrder
    score?: SortOrder
    riskFactors?: SortOrder
    flagged?: SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    decision?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type FraudScoreWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FraudScoreWhereInput | FraudScoreWhereInput[]
    OR?: FraudScoreWhereInput[]
    NOT?: FraudScoreWhereInput | FraudScoreWhereInput[]
    customerId?: StringFilter<"FraudScore"> | string
    orderId?: StringFilter<"FraudScore"> | string
    score?: FloatFilter<"FraudScore"> | number
    riskFactors?: StringNullableListFilter<"FraudScore">
    flagged?: BoolFilter<"FraudScore"> | boolean
    reviewedAt?: DateTimeNullableFilter<"FraudScore"> | Date | string | null
    reviewedBy?: StringNullableFilter<"FraudScore"> | string | null
    decision?: StringNullableFilter<"FraudScore"> | string | null
    createdAt?: DateTimeFilter<"FraudScore"> | Date | string
  }, "id">

  export type FraudScoreOrderByWithAggregationInput = {
    id?: SortOrder
    customerId?: SortOrder
    orderId?: SortOrder
    score?: SortOrder
    riskFactors?: SortOrder
    flagged?: SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    decision?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: FraudScoreCountOrderByAggregateInput
    _avg?: FraudScoreAvgOrderByAggregateInput
    _max?: FraudScoreMaxOrderByAggregateInput
    _min?: FraudScoreMinOrderByAggregateInput
    _sum?: FraudScoreSumOrderByAggregateInput
  }

  export type FraudScoreScalarWhereWithAggregatesInput = {
    AND?: FraudScoreScalarWhereWithAggregatesInput | FraudScoreScalarWhereWithAggregatesInput[]
    OR?: FraudScoreScalarWhereWithAggregatesInput[]
    NOT?: FraudScoreScalarWhereWithAggregatesInput | FraudScoreScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FraudScore"> | string
    customerId?: StringWithAggregatesFilter<"FraudScore"> | string
    orderId?: StringWithAggregatesFilter<"FraudScore"> | string
    score?: FloatWithAggregatesFilter<"FraudScore"> | number
    riskFactors?: StringNullableListFilter<"FraudScore">
    flagged?: BoolWithAggregatesFilter<"FraudScore"> | boolean
    reviewedAt?: DateTimeNullableWithAggregatesFilter<"FraudScore"> | Date | string | null
    reviewedBy?: StringNullableWithAggregatesFilter<"FraudScore"> | string | null
    decision?: StringNullableWithAggregatesFilter<"FraudScore"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"FraudScore"> | Date | string
  }

  export type MLModelWhereInput = {
    AND?: MLModelWhereInput | MLModelWhereInput[]
    OR?: MLModelWhereInput[]
    NOT?: MLModelWhereInput | MLModelWhereInput[]
    id?: StringFilter<"MLModel"> | string
    name?: StringFilter<"MLModel"> | string
    version?: StringFilter<"MLModel"> | string
    type?: StringFilter<"MLModel"> | string
    framework?: StringFilter<"MLModel"> | string
    modelPath?: StringFilter<"MLModel"> | string
    accuracy?: FloatNullableFilter<"MLModel"> | number | null
    precision?: FloatNullableFilter<"MLModel"> | number | null
    recall?: FloatNullableFilter<"MLModel"> | number | null
    f1Score?: FloatNullableFilter<"MLModel"> | number | null
    deployedAt?: DateTimeNullableFilter<"MLModel"> | Date | string | null
    lastEvaluated?: DateTimeNullableFilter<"MLModel"> | Date | string | null
    status?: StringFilter<"MLModel"> | string
    createdAt?: DateTimeFilter<"MLModel"> | Date | string
    updatedAt?: DateTimeFilter<"MLModel"> | Date | string
  }

  export type MLModelOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    version?: SortOrder
    type?: SortOrder
    framework?: SortOrder
    modelPath?: SortOrder
    accuracy?: SortOrderInput | SortOrder
    precision?: SortOrderInput | SortOrder
    recall?: SortOrderInput | SortOrder
    f1Score?: SortOrderInput | SortOrder
    deployedAt?: SortOrderInput | SortOrder
    lastEvaluated?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MLModelWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MLModelWhereInput | MLModelWhereInput[]
    OR?: MLModelWhereInput[]
    NOT?: MLModelWhereInput | MLModelWhereInput[]
    name?: StringFilter<"MLModel"> | string
    version?: StringFilter<"MLModel"> | string
    type?: StringFilter<"MLModel"> | string
    framework?: StringFilter<"MLModel"> | string
    modelPath?: StringFilter<"MLModel"> | string
    accuracy?: FloatNullableFilter<"MLModel"> | number | null
    precision?: FloatNullableFilter<"MLModel"> | number | null
    recall?: FloatNullableFilter<"MLModel"> | number | null
    f1Score?: FloatNullableFilter<"MLModel"> | number | null
    deployedAt?: DateTimeNullableFilter<"MLModel"> | Date | string | null
    lastEvaluated?: DateTimeNullableFilter<"MLModel"> | Date | string | null
    status?: StringFilter<"MLModel"> | string
    createdAt?: DateTimeFilter<"MLModel"> | Date | string
    updatedAt?: DateTimeFilter<"MLModel"> | Date | string
  }, "id">

  export type MLModelOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    version?: SortOrder
    type?: SortOrder
    framework?: SortOrder
    modelPath?: SortOrder
    accuracy?: SortOrderInput | SortOrder
    precision?: SortOrderInput | SortOrder
    recall?: SortOrderInput | SortOrder
    f1Score?: SortOrderInput | SortOrder
    deployedAt?: SortOrderInput | SortOrder
    lastEvaluated?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MLModelCountOrderByAggregateInput
    _avg?: MLModelAvgOrderByAggregateInput
    _max?: MLModelMaxOrderByAggregateInput
    _min?: MLModelMinOrderByAggregateInput
    _sum?: MLModelSumOrderByAggregateInput
  }

  export type MLModelScalarWhereWithAggregatesInput = {
    AND?: MLModelScalarWhereWithAggregatesInput | MLModelScalarWhereWithAggregatesInput[]
    OR?: MLModelScalarWhereWithAggregatesInput[]
    NOT?: MLModelScalarWhereWithAggregatesInput | MLModelScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MLModel"> | string
    name?: StringWithAggregatesFilter<"MLModel"> | string
    version?: StringWithAggregatesFilter<"MLModel"> | string
    type?: StringWithAggregatesFilter<"MLModel"> | string
    framework?: StringWithAggregatesFilter<"MLModel"> | string
    modelPath?: StringWithAggregatesFilter<"MLModel"> | string
    accuracy?: FloatNullableWithAggregatesFilter<"MLModel"> | number | null
    precision?: FloatNullableWithAggregatesFilter<"MLModel"> | number | null
    recall?: FloatNullableWithAggregatesFilter<"MLModel"> | number | null
    f1Score?: FloatNullableWithAggregatesFilter<"MLModel"> | number | null
    deployedAt?: DateTimeNullableWithAggregatesFilter<"MLModel"> | Date | string | null
    lastEvaluated?: DateTimeNullableWithAggregatesFilter<"MLModel"> | Date | string | null
    status?: StringWithAggregatesFilter<"MLModel"> | string
    createdAt?: DateTimeWithAggregatesFilter<"MLModel"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MLModel"> | Date | string
  }

  export type ModelTrainingLogWhereInput = {
    AND?: ModelTrainingLogWhereInput | ModelTrainingLogWhereInput[]
    OR?: ModelTrainingLogWhereInput[]
    NOT?: ModelTrainingLogWhereInput | ModelTrainingLogWhereInput[]
    id?: StringFilter<"ModelTrainingLog"> | string
    modelId?: StringFilter<"ModelTrainingLog"> | string
    epoch?: IntFilter<"ModelTrainingLog"> | number
    loss?: FloatFilter<"ModelTrainingLog"> | number
    accuracy?: FloatNullableFilter<"ModelTrainingLog"> | number | null
    val_loss?: FloatNullableFilter<"ModelTrainingLog"> | number | null
    val_accuracy?: FloatNullableFilter<"ModelTrainingLog"> | number | null
    timestamp?: DateTimeFilter<"ModelTrainingLog"> | Date | string
  }

  export type ModelTrainingLogOrderByWithRelationInput = {
    id?: SortOrder
    modelId?: SortOrder
    epoch?: SortOrder
    loss?: SortOrder
    accuracy?: SortOrderInput | SortOrder
    val_loss?: SortOrderInput | SortOrder
    val_accuracy?: SortOrderInput | SortOrder
    timestamp?: SortOrder
  }

  export type ModelTrainingLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ModelTrainingLogWhereInput | ModelTrainingLogWhereInput[]
    OR?: ModelTrainingLogWhereInput[]
    NOT?: ModelTrainingLogWhereInput | ModelTrainingLogWhereInput[]
    modelId?: StringFilter<"ModelTrainingLog"> | string
    epoch?: IntFilter<"ModelTrainingLog"> | number
    loss?: FloatFilter<"ModelTrainingLog"> | number
    accuracy?: FloatNullableFilter<"ModelTrainingLog"> | number | null
    val_loss?: FloatNullableFilter<"ModelTrainingLog"> | number | null
    val_accuracy?: FloatNullableFilter<"ModelTrainingLog"> | number | null
    timestamp?: DateTimeFilter<"ModelTrainingLog"> | Date | string
  }, "id">

  export type ModelTrainingLogOrderByWithAggregationInput = {
    id?: SortOrder
    modelId?: SortOrder
    epoch?: SortOrder
    loss?: SortOrder
    accuracy?: SortOrderInput | SortOrder
    val_loss?: SortOrderInput | SortOrder
    val_accuracy?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    _count?: ModelTrainingLogCountOrderByAggregateInput
    _avg?: ModelTrainingLogAvgOrderByAggregateInput
    _max?: ModelTrainingLogMaxOrderByAggregateInput
    _min?: ModelTrainingLogMinOrderByAggregateInput
    _sum?: ModelTrainingLogSumOrderByAggregateInput
  }

  export type ModelTrainingLogScalarWhereWithAggregatesInput = {
    AND?: ModelTrainingLogScalarWhereWithAggregatesInput | ModelTrainingLogScalarWhereWithAggregatesInput[]
    OR?: ModelTrainingLogScalarWhereWithAggregatesInput[]
    NOT?: ModelTrainingLogScalarWhereWithAggregatesInput | ModelTrainingLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ModelTrainingLog"> | string
    modelId?: StringWithAggregatesFilter<"ModelTrainingLog"> | string
    epoch?: IntWithAggregatesFilter<"ModelTrainingLog"> | number
    loss?: FloatWithAggregatesFilter<"ModelTrainingLog"> | number
    accuracy?: FloatNullableWithAggregatesFilter<"ModelTrainingLog"> | number | null
    val_loss?: FloatNullableWithAggregatesFilter<"ModelTrainingLog"> | number | null
    val_accuracy?: FloatNullableWithAggregatesFilter<"ModelTrainingLog"> | number | null
    timestamp?: DateTimeWithAggregatesFilter<"ModelTrainingLog"> | Date | string
  }

  export type UserFeaturesWhereInput = {
    AND?: UserFeaturesWhereInput | UserFeaturesWhereInput[]
    OR?: UserFeaturesWhereInput[]
    NOT?: UserFeaturesWhereInput | UserFeaturesWhereInput[]
    id?: StringFilter<"UserFeatures"> | string
    customerId?: StringFilter<"UserFeatures"> | string
    totalOrders?: IntFilter<"UserFeatures"> | number
    totalSpent?: FloatFilter<"UserFeatures"> | number
    avgOrderValue?: FloatFilter<"UserFeatures"> | number
    daysSinceLastOrder?: IntFilter<"UserFeatures"> | number
    categoryPreference?: StringNullableListFilter<"UserFeatures">
    deviceType?: StringFilter<"UserFeatures"> | string
    browser?: StringFilter<"UserFeatures"> | string
    timezone?: StringFilter<"UserFeatures"> | string
    lastComputedAt?: DateTimeFilter<"UserFeatures"> | Date | string
  }

  export type UserFeaturesOrderByWithRelationInput = {
    id?: SortOrder
    customerId?: SortOrder
    totalOrders?: SortOrder
    totalSpent?: SortOrder
    avgOrderValue?: SortOrder
    daysSinceLastOrder?: SortOrder
    categoryPreference?: SortOrder
    deviceType?: SortOrder
    browser?: SortOrder
    timezone?: SortOrder
    lastComputedAt?: SortOrder
  }

  export type UserFeaturesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    customerId?: string
    AND?: UserFeaturesWhereInput | UserFeaturesWhereInput[]
    OR?: UserFeaturesWhereInput[]
    NOT?: UserFeaturesWhereInput | UserFeaturesWhereInput[]
    totalOrders?: IntFilter<"UserFeatures"> | number
    totalSpent?: FloatFilter<"UserFeatures"> | number
    avgOrderValue?: FloatFilter<"UserFeatures"> | number
    daysSinceLastOrder?: IntFilter<"UserFeatures"> | number
    categoryPreference?: StringNullableListFilter<"UserFeatures">
    deviceType?: StringFilter<"UserFeatures"> | string
    browser?: StringFilter<"UserFeatures"> | string
    timezone?: StringFilter<"UserFeatures"> | string
    lastComputedAt?: DateTimeFilter<"UserFeatures"> | Date | string
  }, "id" | "customerId">

  export type UserFeaturesOrderByWithAggregationInput = {
    id?: SortOrder
    customerId?: SortOrder
    totalOrders?: SortOrder
    totalSpent?: SortOrder
    avgOrderValue?: SortOrder
    daysSinceLastOrder?: SortOrder
    categoryPreference?: SortOrder
    deviceType?: SortOrder
    browser?: SortOrder
    timezone?: SortOrder
    lastComputedAt?: SortOrder
    _count?: UserFeaturesCountOrderByAggregateInput
    _avg?: UserFeaturesAvgOrderByAggregateInput
    _max?: UserFeaturesMaxOrderByAggregateInput
    _min?: UserFeaturesMinOrderByAggregateInput
    _sum?: UserFeaturesSumOrderByAggregateInput
  }

  export type UserFeaturesScalarWhereWithAggregatesInput = {
    AND?: UserFeaturesScalarWhereWithAggregatesInput | UserFeaturesScalarWhereWithAggregatesInput[]
    OR?: UserFeaturesScalarWhereWithAggregatesInput[]
    NOT?: UserFeaturesScalarWhereWithAggregatesInput | UserFeaturesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserFeatures"> | string
    customerId?: StringWithAggregatesFilter<"UserFeatures"> | string
    totalOrders?: IntWithAggregatesFilter<"UserFeatures"> | number
    totalSpent?: FloatWithAggregatesFilter<"UserFeatures"> | number
    avgOrderValue?: FloatWithAggregatesFilter<"UserFeatures"> | number
    daysSinceLastOrder?: IntWithAggregatesFilter<"UserFeatures"> | number
    categoryPreference?: StringNullableListFilter<"UserFeatures">
    deviceType?: StringWithAggregatesFilter<"UserFeatures"> | string
    browser?: StringWithAggregatesFilter<"UserFeatures"> | string
    timezone?: StringWithAggregatesFilter<"UserFeatures"> | string
    lastComputedAt?: DateTimeWithAggregatesFilter<"UserFeatures"> | Date | string
  }

  export type ProductFeaturesWhereInput = {
    AND?: ProductFeaturesWhereInput | ProductFeaturesWhereInput[]
    OR?: ProductFeaturesWhereInput[]
    NOT?: ProductFeaturesWhereInput | ProductFeaturesWhereInput[]
    id?: StringFilter<"ProductFeatures"> | string
    productId?: StringFilter<"ProductFeatures"> | string
    category?: StringFilter<"ProductFeatures"> | string
    avgRating?: FloatFilter<"ProductFeatures"> | number
    reviewCount?: IntFilter<"ProductFeatures"> | number
    returnRate?: FloatFilter<"ProductFeatures"> | number
    profitMargin?: FloatFilter<"ProductFeatures"> | number
    stockLevel?: IntFilter<"ProductFeatures"> | number
    competitorCount?: IntFilter<"ProductFeatures"> | number
    seasonality?: StringNullableFilter<"ProductFeatures"> | string | null
    lastComputedAt?: DateTimeFilter<"ProductFeatures"> | Date | string
  }

  export type ProductFeaturesOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    category?: SortOrder
    avgRating?: SortOrder
    reviewCount?: SortOrder
    returnRate?: SortOrder
    profitMargin?: SortOrder
    stockLevel?: SortOrder
    competitorCount?: SortOrder
    seasonality?: SortOrderInput | SortOrder
    lastComputedAt?: SortOrder
  }

  export type ProductFeaturesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    productId?: string
    AND?: ProductFeaturesWhereInput | ProductFeaturesWhereInput[]
    OR?: ProductFeaturesWhereInput[]
    NOT?: ProductFeaturesWhereInput | ProductFeaturesWhereInput[]
    category?: StringFilter<"ProductFeatures"> | string
    avgRating?: FloatFilter<"ProductFeatures"> | number
    reviewCount?: IntFilter<"ProductFeatures"> | number
    returnRate?: FloatFilter<"ProductFeatures"> | number
    profitMargin?: FloatFilter<"ProductFeatures"> | number
    stockLevel?: IntFilter<"ProductFeatures"> | number
    competitorCount?: IntFilter<"ProductFeatures"> | number
    seasonality?: StringNullableFilter<"ProductFeatures"> | string | null
    lastComputedAt?: DateTimeFilter<"ProductFeatures"> | Date | string
  }, "id" | "productId">

  export type ProductFeaturesOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    category?: SortOrder
    avgRating?: SortOrder
    reviewCount?: SortOrder
    returnRate?: SortOrder
    profitMargin?: SortOrder
    stockLevel?: SortOrder
    competitorCount?: SortOrder
    seasonality?: SortOrderInput | SortOrder
    lastComputedAt?: SortOrder
    _count?: ProductFeaturesCountOrderByAggregateInput
    _avg?: ProductFeaturesAvgOrderByAggregateInput
    _max?: ProductFeaturesMaxOrderByAggregateInput
    _min?: ProductFeaturesMinOrderByAggregateInput
    _sum?: ProductFeaturesSumOrderByAggregateInput
  }

  export type ProductFeaturesScalarWhereWithAggregatesInput = {
    AND?: ProductFeaturesScalarWhereWithAggregatesInput | ProductFeaturesScalarWhereWithAggregatesInput[]
    OR?: ProductFeaturesScalarWhereWithAggregatesInput[]
    NOT?: ProductFeaturesScalarWhereWithAggregatesInput | ProductFeaturesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProductFeatures"> | string
    productId?: StringWithAggregatesFilter<"ProductFeatures"> | string
    category?: StringWithAggregatesFilter<"ProductFeatures"> | string
    avgRating?: FloatWithAggregatesFilter<"ProductFeatures"> | number
    reviewCount?: IntWithAggregatesFilter<"ProductFeatures"> | number
    returnRate?: FloatWithAggregatesFilter<"ProductFeatures"> | number
    profitMargin?: FloatWithAggregatesFilter<"ProductFeatures"> | number
    stockLevel?: IntWithAggregatesFilter<"ProductFeatures"> | number
    competitorCount?: IntWithAggregatesFilter<"ProductFeatures"> | number
    seasonality?: StringNullableWithAggregatesFilter<"ProductFeatures"> | string | null
    lastComputedAt?: DateTimeWithAggregatesFilter<"ProductFeatures"> | Date | string
  }

  export type AIAuditLogWhereInput = {
    AND?: AIAuditLogWhereInput | AIAuditLogWhereInput[]
    OR?: AIAuditLogWhereInput[]
    NOT?: AIAuditLogWhereInput | AIAuditLogWhereInput[]
    id?: StringFilter<"AIAuditLog"> | string
    action?: StringFilter<"AIAuditLog"> | string
    modelName?: StringNullableFilter<"AIAuditLog"> | string | null
    customerId?: StringNullableFilter<"AIAuditLog"> | string | null
    productId?: StringNullableFilter<"AIAuditLog"> | string | null
    details?: JsonFilter<"AIAuditLog">
    result?: StringFilter<"AIAuditLog"> | string
    error?: StringNullableFilter<"AIAuditLog"> | string | null
    createdAt?: DateTimeFilter<"AIAuditLog"> | Date | string
  }

  export type AIAuditLogOrderByWithRelationInput = {
    id?: SortOrder
    action?: SortOrder
    modelName?: SortOrderInput | SortOrder
    customerId?: SortOrderInput | SortOrder
    productId?: SortOrderInput | SortOrder
    details?: SortOrder
    result?: SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AIAuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AIAuditLogWhereInput | AIAuditLogWhereInput[]
    OR?: AIAuditLogWhereInput[]
    NOT?: AIAuditLogWhereInput | AIAuditLogWhereInput[]
    action?: StringFilter<"AIAuditLog"> | string
    modelName?: StringNullableFilter<"AIAuditLog"> | string | null
    customerId?: StringNullableFilter<"AIAuditLog"> | string | null
    productId?: StringNullableFilter<"AIAuditLog"> | string | null
    details?: JsonFilter<"AIAuditLog">
    result?: StringFilter<"AIAuditLog"> | string
    error?: StringNullableFilter<"AIAuditLog"> | string | null
    createdAt?: DateTimeFilter<"AIAuditLog"> | Date | string
  }, "id">

  export type AIAuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    action?: SortOrder
    modelName?: SortOrderInput | SortOrder
    customerId?: SortOrderInput | SortOrder
    productId?: SortOrderInput | SortOrder
    details?: SortOrder
    result?: SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AIAuditLogCountOrderByAggregateInput
    _max?: AIAuditLogMaxOrderByAggregateInput
    _min?: AIAuditLogMinOrderByAggregateInput
  }

  export type AIAuditLogScalarWhereWithAggregatesInput = {
    AND?: AIAuditLogScalarWhereWithAggregatesInput | AIAuditLogScalarWhereWithAggregatesInput[]
    OR?: AIAuditLogScalarWhereWithAggregatesInput[]
    NOT?: AIAuditLogScalarWhereWithAggregatesInput | AIAuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AIAuditLog"> | string
    action?: StringWithAggregatesFilter<"AIAuditLog"> | string
    modelName?: StringNullableWithAggregatesFilter<"AIAuditLog"> | string | null
    customerId?: StringNullableWithAggregatesFilter<"AIAuditLog"> | string | null
    productId?: StringNullableWithAggregatesFilter<"AIAuditLog"> | string | null
    details?: JsonWithAggregatesFilter<"AIAuditLog">
    result?: StringWithAggregatesFilter<"AIAuditLog"> | string
    error?: StringNullableWithAggregatesFilter<"AIAuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AIAuditLog"> | Date | string
  }

  export type ProductEmbeddingCreateInput = {
    id?: string
    productId: string
    embedding?: ProductEmbeddingCreateembeddingInput | number[]
    model?: string
    modelVersion?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductEmbeddingUncheckedCreateInput = {
    id?: string
    productId: string
    embedding?: ProductEmbeddingCreateembeddingInput | number[]
    model?: string
    modelVersion?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductEmbeddingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    embedding?: ProductEmbeddingUpdateembeddingInput | number[]
    model?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductEmbeddingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    embedding?: ProductEmbeddingUpdateembeddingInput | number[]
    model?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductEmbeddingCreateManyInput = {
    id?: string
    productId: string
    embedding?: ProductEmbeddingCreateembeddingInput | number[]
    model?: string
    modelVersion?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProductEmbeddingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    embedding?: ProductEmbeddingUpdateembeddingInput | number[]
    model?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductEmbeddingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    embedding?: ProductEmbeddingUpdateembeddingInput | number[]
    model?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerBehaviorCreateInput = {
    id?: string
    customerId: string
    eventType: string
    productId: string
    category: string
    sessionId: string
    duration: number
    metadata: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type CustomerBehaviorUncheckedCreateInput = {
    id?: string
    customerId: string
    eventType: string
    productId: string
    category: string
    sessionId: string
    duration: number
    metadata: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type CustomerBehaviorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerBehaviorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerBehaviorCreateManyInput = {
    id?: string
    customerId: string
    eventType: string
    productId: string
    category: string
    sessionId: string
    duration: number
    metadata: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type CustomerBehaviorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerBehaviorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChurnPredictionCreateInput = {
    id?: string
    customerId: string
    churnScore: number
    riskFactors?: ChurnPredictionCreateriskFactorsInput | string[]
    lastUpdated?: Date | string
    nextReviewDate: Date | string
  }

  export type ChurnPredictionUncheckedCreateInput = {
    id?: string
    customerId: string
    churnScore: number
    riskFactors?: ChurnPredictionCreateriskFactorsInput | string[]
    lastUpdated?: Date | string
    nextReviewDate: Date | string
  }

  export type ChurnPredictionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    churnScore?: FloatFieldUpdateOperationsInput | number
    riskFactors?: ChurnPredictionUpdateriskFactorsInput | string[]
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    nextReviewDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChurnPredictionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    churnScore?: FloatFieldUpdateOperationsInput | number
    riskFactors?: ChurnPredictionUpdateriskFactorsInput | string[]
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    nextReviewDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChurnPredictionCreateManyInput = {
    id?: string
    customerId: string
    churnScore: number
    riskFactors?: ChurnPredictionCreateriskFactorsInput | string[]
    lastUpdated?: Date | string
    nextReviewDate: Date | string
  }

  export type ChurnPredictionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    churnScore?: FloatFieldUpdateOperationsInput | number
    riskFactors?: ChurnPredictionUpdateriskFactorsInput | string[]
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    nextReviewDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChurnPredictionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    churnScore?: FloatFieldUpdateOperationsInput | number
    riskFactors?: ChurnPredictionUpdateriskFactorsInput | string[]
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    nextReviewDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductRecommendationCreateInput = {
    id?: string
    customerId: string
    productId: string
    score: number
    method: string
    clicked?: boolean
    purchased?: boolean
    createdAt?: Date | string
  }

  export type ProductRecommendationUncheckedCreateInput = {
    id?: string
    customerId: string
    productId: string
    score: number
    method: string
    clicked?: boolean
    purchased?: boolean
    createdAt?: Date | string
  }

  export type ProductRecommendationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
    clicked?: BoolFieldUpdateOperationsInput | boolean
    purchased?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductRecommendationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
    clicked?: BoolFieldUpdateOperationsInput | boolean
    purchased?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductRecommendationCreateManyInput = {
    id?: string
    customerId: string
    productId: string
    score: number
    method: string
    clicked?: boolean
    purchased?: boolean
    createdAt?: Date | string
  }

  export type ProductRecommendationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
    clicked?: BoolFieldUpdateOperationsInput | boolean
    purchased?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductRecommendationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
    clicked?: BoolFieldUpdateOperationsInput | boolean
    purchased?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SentimentAnalysisCreateInput = {
    id?: string
    productId: string
    customerId: string
    text: string
    sentiment: string
    score: number
    emotions?: SentimentAnalysisCreateemotionsInput | string[]
    language?: string
    model?: string
    createdAt?: Date | string
  }

  export type SentimentAnalysisUncheckedCreateInput = {
    id?: string
    productId: string
    customerId: string
    text: string
    sentiment: string
    score: number
    emotions?: SentimentAnalysisCreateemotionsInput | string[]
    language?: string
    model?: string
    createdAt?: Date | string
  }

  export type SentimentAnalysisUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    sentiment?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    emotions?: SentimentAnalysisUpdateemotionsInput | string[]
    language?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SentimentAnalysisUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    sentiment?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    emotions?: SentimentAnalysisUpdateemotionsInput | string[]
    language?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SentimentAnalysisCreateManyInput = {
    id?: string
    productId: string
    customerId: string
    text: string
    sentiment: string
    score: number
    emotions?: SentimentAnalysisCreateemotionsInput | string[]
    language?: string
    model?: string
    createdAt?: Date | string
  }

  export type SentimentAnalysisUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    sentiment?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    emotions?: SentimentAnalysisUpdateemotionsInput | string[]
    language?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SentimentAnalysisUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    sentiment?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    emotions?: SentimentAnalysisUpdateemotionsInput | string[]
    language?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriceOptimizationCreateInput = {
    id?: string
    productId: string
    currentPrice: number
    optimalPrice: number
    elasticity: number
    conversionRate: number
    expectedRevenue: number
    lastOptimized?: Date | string
  }

  export type PriceOptimizationUncheckedCreateInput = {
    id?: string
    productId: string
    currentPrice: number
    optimalPrice: number
    elasticity: number
    conversionRate: number
    expectedRevenue: number
    lastOptimized?: Date | string
  }

  export type PriceOptimizationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    currentPrice?: FloatFieldUpdateOperationsInput | number
    optimalPrice?: FloatFieldUpdateOperationsInput | number
    elasticity?: FloatFieldUpdateOperationsInput | number
    conversionRate?: FloatFieldUpdateOperationsInput | number
    expectedRevenue?: FloatFieldUpdateOperationsInput | number
    lastOptimized?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriceOptimizationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    currentPrice?: FloatFieldUpdateOperationsInput | number
    optimalPrice?: FloatFieldUpdateOperationsInput | number
    elasticity?: FloatFieldUpdateOperationsInput | number
    conversionRate?: FloatFieldUpdateOperationsInput | number
    expectedRevenue?: FloatFieldUpdateOperationsInput | number
    lastOptimized?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriceOptimizationCreateManyInput = {
    id?: string
    productId: string
    currentPrice: number
    optimalPrice: number
    elasticity: number
    conversionRate: number
    expectedRevenue: number
    lastOptimized?: Date | string
  }

  export type PriceOptimizationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    currentPrice?: FloatFieldUpdateOperationsInput | number
    optimalPrice?: FloatFieldUpdateOperationsInput | number
    elasticity?: FloatFieldUpdateOperationsInput | number
    conversionRate?: FloatFieldUpdateOperationsInput | number
    expectedRevenue?: FloatFieldUpdateOperationsInput | number
    lastOptimized?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriceOptimizationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    currentPrice?: FloatFieldUpdateOperationsInput | number
    optimalPrice?: FloatFieldUpdateOperationsInput | number
    elasticity?: FloatFieldUpdateOperationsInput | number
    conversionRate?: FloatFieldUpdateOperationsInput | number
    expectedRevenue?: FloatFieldUpdateOperationsInput | number
    lastOptimized?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerLTVCreateInput = {
    id?: string
    customerId: string
    ltv: number
    clv: number
    segment: string
    roi: number
    predictedMonthly: number
    lastComputed?: Date | string
  }

  export type CustomerLTVUncheckedCreateInput = {
    id?: string
    customerId: string
    ltv: number
    clv: number
    segment: string
    roi: number
    predictedMonthly: number
    lastComputed?: Date | string
  }

  export type CustomerLTVUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    ltv?: FloatFieldUpdateOperationsInput | number
    clv?: FloatFieldUpdateOperationsInput | number
    segment?: StringFieldUpdateOperationsInput | string
    roi?: FloatFieldUpdateOperationsInput | number
    predictedMonthly?: FloatFieldUpdateOperationsInput | number
    lastComputed?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerLTVUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    ltv?: FloatFieldUpdateOperationsInput | number
    clv?: FloatFieldUpdateOperationsInput | number
    segment?: StringFieldUpdateOperationsInput | string
    roi?: FloatFieldUpdateOperationsInput | number
    predictedMonthly?: FloatFieldUpdateOperationsInput | number
    lastComputed?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerLTVCreateManyInput = {
    id?: string
    customerId: string
    ltv: number
    clv: number
    segment: string
    roi: number
    predictedMonthly: number
    lastComputed?: Date | string
  }

  export type CustomerLTVUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    ltv?: FloatFieldUpdateOperationsInput | number
    clv?: FloatFieldUpdateOperationsInput | number
    segment?: StringFieldUpdateOperationsInput | string
    roi?: FloatFieldUpdateOperationsInput | number
    predictedMonthly?: FloatFieldUpdateOperationsInput | number
    lastComputed?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerLTVUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    ltv?: FloatFieldUpdateOperationsInput | number
    clv?: FloatFieldUpdateOperationsInput | number
    segment?: StringFieldUpdateOperationsInput | string
    roi?: FloatFieldUpdateOperationsInput | number
    predictedMonthly?: FloatFieldUpdateOperationsInput | number
    lastComputed?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ABTestCreateInput = {
    id?: string
    name: string
    description?: string | null
    variantA: JsonNullValueInput | InputJsonValue
    variantB: JsonNullValueInput | InputJsonValue
    controlGroup?: ABTestCreatecontrolGroupInput | string[]
    testGroup?: ABTestCreatetestGroupInput | string[]
    metric: string
    startDate: Date | string
    endDate?: Date | string | null
    pValue?: number | null
    winner?: string | null
    createdAt?: Date | string
  }

  export type ABTestUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    variantA: JsonNullValueInput | InputJsonValue
    variantB: JsonNullValueInput | InputJsonValue
    controlGroup?: ABTestCreatecontrolGroupInput | string[]
    testGroup?: ABTestCreatetestGroupInput | string[]
    metric: string
    startDate: Date | string
    endDate?: Date | string | null
    pValue?: number | null
    winner?: string | null
    createdAt?: Date | string
  }

  export type ABTestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    variantA?: JsonNullValueInput | InputJsonValue
    variantB?: JsonNullValueInput | InputJsonValue
    controlGroup?: ABTestUpdatecontrolGroupInput | string[]
    testGroup?: ABTestUpdatetestGroupInput | string[]
    metric?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pValue?: NullableFloatFieldUpdateOperationsInput | number | null
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ABTestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    variantA?: JsonNullValueInput | InputJsonValue
    variantB?: JsonNullValueInput | InputJsonValue
    controlGroup?: ABTestUpdatecontrolGroupInput | string[]
    testGroup?: ABTestUpdatetestGroupInput | string[]
    metric?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pValue?: NullableFloatFieldUpdateOperationsInput | number | null
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ABTestCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    variantA: JsonNullValueInput | InputJsonValue
    variantB: JsonNullValueInput | InputJsonValue
    controlGroup?: ABTestCreatecontrolGroupInput | string[]
    testGroup?: ABTestCreatetestGroupInput | string[]
    metric: string
    startDate: Date | string
    endDate?: Date | string | null
    pValue?: number | null
    winner?: string | null
    createdAt?: Date | string
  }

  export type ABTestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    variantA?: JsonNullValueInput | InputJsonValue
    variantB?: JsonNullValueInput | InputJsonValue
    controlGroup?: ABTestUpdatecontrolGroupInput | string[]
    testGroup?: ABTestUpdatetestGroupInput | string[]
    metric?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pValue?: NullableFloatFieldUpdateOperationsInput | number | null
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ABTestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    variantA?: JsonNullValueInput | InputJsonValue
    variantB?: JsonNullValueInput | InputJsonValue
    controlGroup?: ABTestUpdatecontrolGroupInput | string[]
    testGroup?: ABTestUpdatetestGroupInput | string[]
    metric?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pValue?: NullableFloatFieldUpdateOperationsInput | number | null
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FraudScoreCreateInput = {
    id?: string
    customerId: string
    orderId: string
    score: number
    riskFactors?: FraudScoreCreateriskFactorsInput | string[]
    flagged?: boolean
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
    decision?: string | null
    createdAt?: Date | string
  }

  export type FraudScoreUncheckedCreateInput = {
    id?: string
    customerId: string
    orderId: string
    score: number
    riskFactors?: FraudScoreCreateriskFactorsInput | string[]
    flagged?: boolean
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
    decision?: string | null
    createdAt?: Date | string
  }

  export type FraudScoreUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    riskFactors?: FraudScoreUpdateriskFactorsInput | string[]
    flagged?: BoolFieldUpdateOperationsInput | boolean
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    decision?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FraudScoreUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    riskFactors?: FraudScoreUpdateriskFactorsInput | string[]
    flagged?: BoolFieldUpdateOperationsInput | boolean
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    decision?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FraudScoreCreateManyInput = {
    id?: string
    customerId: string
    orderId: string
    score: number
    riskFactors?: FraudScoreCreateriskFactorsInput | string[]
    flagged?: boolean
    reviewedAt?: Date | string | null
    reviewedBy?: string | null
    decision?: string | null
    createdAt?: Date | string
  }

  export type FraudScoreUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    riskFactors?: FraudScoreUpdateriskFactorsInput | string[]
    flagged?: BoolFieldUpdateOperationsInput | boolean
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    decision?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FraudScoreUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    riskFactors?: FraudScoreUpdateriskFactorsInput | string[]
    flagged?: BoolFieldUpdateOperationsInput | boolean
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    decision?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MLModelCreateInput = {
    id?: string
    name: string
    version: string
    type: string
    framework: string
    modelPath: string
    accuracy?: number | null
    precision?: number | null
    recall?: number | null
    f1Score?: number | null
    deployedAt?: Date | string | null
    lastEvaluated?: Date | string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MLModelUncheckedCreateInput = {
    id?: string
    name: string
    version: string
    type: string
    framework: string
    modelPath: string
    accuracy?: number | null
    precision?: number | null
    recall?: number | null
    f1Score?: number | null
    deployedAt?: Date | string | null
    lastEvaluated?: Date | string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MLModelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    framework?: StringFieldUpdateOperationsInput | string
    modelPath?: StringFieldUpdateOperationsInput | string
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    precision?: NullableFloatFieldUpdateOperationsInput | number | null
    recall?: NullableFloatFieldUpdateOperationsInput | number | null
    f1Score?: NullableFloatFieldUpdateOperationsInput | number | null
    deployedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastEvaluated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MLModelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    framework?: StringFieldUpdateOperationsInput | string
    modelPath?: StringFieldUpdateOperationsInput | string
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    precision?: NullableFloatFieldUpdateOperationsInput | number | null
    recall?: NullableFloatFieldUpdateOperationsInput | number | null
    f1Score?: NullableFloatFieldUpdateOperationsInput | number | null
    deployedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastEvaluated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MLModelCreateManyInput = {
    id?: string
    name: string
    version: string
    type: string
    framework: string
    modelPath: string
    accuracy?: number | null
    precision?: number | null
    recall?: number | null
    f1Score?: number | null
    deployedAt?: Date | string | null
    lastEvaluated?: Date | string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MLModelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    framework?: StringFieldUpdateOperationsInput | string
    modelPath?: StringFieldUpdateOperationsInput | string
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    precision?: NullableFloatFieldUpdateOperationsInput | number | null
    recall?: NullableFloatFieldUpdateOperationsInput | number | null
    f1Score?: NullableFloatFieldUpdateOperationsInput | number | null
    deployedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastEvaluated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MLModelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    framework?: StringFieldUpdateOperationsInput | string
    modelPath?: StringFieldUpdateOperationsInput | string
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    precision?: NullableFloatFieldUpdateOperationsInput | number | null
    recall?: NullableFloatFieldUpdateOperationsInput | number | null
    f1Score?: NullableFloatFieldUpdateOperationsInput | number | null
    deployedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastEvaluated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModelTrainingLogCreateInput = {
    id?: string
    modelId: string
    epoch: number
    loss: number
    accuracy?: number | null
    val_loss?: number | null
    val_accuracy?: number | null
    timestamp?: Date | string
  }

  export type ModelTrainingLogUncheckedCreateInput = {
    id?: string
    modelId: string
    epoch: number
    loss: number
    accuracy?: number | null
    val_loss?: number | null
    val_accuracy?: number | null
    timestamp?: Date | string
  }

  export type ModelTrainingLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelId?: StringFieldUpdateOperationsInput | string
    epoch?: IntFieldUpdateOperationsInput | number
    loss?: FloatFieldUpdateOperationsInput | number
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    val_loss?: NullableFloatFieldUpdateOperationsInput | number | null
    val_accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModelTrainingLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelId?: StringFieldUpdateOperationsInput | string
    epoch?: IntFieldUpdateOperationsInput | number
    loss?: FloatFieldUpdateOperationsInput | number
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    val_loss?: NullableFloatFieldUpdateOperationsInput | number | null
    val_accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModelTrainingLogCreateManyInput = {
    id?: string
    modelId: string
    epoch: number
    loss: number
    accuracy?: number | null
    val_loss?: number | null
    val_accuracy?: number | null
    timestamp?: Date | string
  }

  export type ModelTrainingLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelId?: StringFieldUpdateOperationsInput | string
    epoch?: IntFieldUpdateOperationsInput | number
    loss?: FloatFieldUpdateOperationsInput | number
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    val_loss?: NullableFloatFieldUpdateOperationsInput | number | null
    val_accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModelTrainingLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    modelId?: StringFieldUpdateOperationsInput | string
    epoch?: IntFieldUpdateOperationsInput | number
    loss?: FloatFieldUpdateOperationsInput | number
    accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    val_loss?: NullableFloatFieldUpdateOperationsInput | number | null
    val_accuracy?: NullableFloatFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserFeaturesCreateInput = {
    id?: string
    customerId: string
    totalOrders: number
    totalSpent: number
    avgOrderValue: number
    daysSinceLastOrder: number
    categoryPreference?: UserFeaturesCreatecategoryPreferenceInput | string[]
    deviceType: string
    browser: string
    timezone: string
    lastComputedAt?: Date | string
  }

  export type UserFeaturesUncheckedCreateInput = {
    id?: string
    customerId: string
    totalOrders: number
    totalSpent: number
    avgOrderValue: number
    daysSinceLastOrder: number
    categoryPreference?: UserFeaturesCreatecategoryPreferenceInput | string[]
    deviceType: string
    browser: string
    timezone: string
    lastComputedAt?: Date | string
  }

  export type UserFeaturesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalSpent?: FloatFieldUpdateOperationsInput | number
    avgOrderValue?: FloatFieldUpdateOperationsInput | number
    daysSinceLastOrder?: IntFieldUpdateOperationsInput | number
    categoryPreference?: UserFeaturesUpdatecategoryPreferenceInput | string[]
    deviceType?: StringFieldUpdateOperationsInput | string
    browser?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    lastComputedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserFeaturesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalSpent?: FloatFieldUpdateOperationsInput | number
    avgOrderValue?: FloatFieldUpdateOperationsInput | number
    daysSinceLastOrder?: IntFieldUpdateOperationsInput | number
    categoryPreference?: UserFeaturesUpdatecategoryPreferenceInput | string[]
    deviceType?: StringFieldUpdateOperationsInput | string
    browser?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    lastComputedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserFeaturesCreateManyInput = {
    id?: string
    customerId: string
    totalOrders: number
    totalSpent: number
    avgOrderValue: number
    daysSinceLastOrder: number
    categoryPreference?: UserFeaturesCreatecategoryPreferenceInput | string[]
    deviceType: string
    browser: string
    timezone: string
    lastComputedAt?: Date | string
  }

  export type UserFeaturesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalSpent?: FloatFieldUpdateOperationsInput | number
    avgOrderValue?: FloatFieldUpdateOperationsInput | number
    daysSinceLastOrder?: IntFieldUpdateOperationsInput | number
    categoryPreference?: UserFeaturesUpdatecategoryPreferenceInput | string[]
    deviceType?: StringFieldUpdateOperationsInput | string
    browser?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    lastComputedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserFeaturesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    totalOrders?: IntFieldUpdateOperationsInput | number
    totalSpent?: FloatFieldUpdateOperationsInput | number
    avgOrderValue?: FloatFieldUpdateOperationsInput | number
    daysSinceLastOrder?: IntFieldUpdateOperationsInput | number
    categoryPreference?: UserFeaturesUpdatecategoryPreferenceInput | string[]
    deviceType?: StringFieldUpdateOperationsInput | string
    browser?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    lastComputedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductFeaturesCreateInput = {
    id?: string
    productId: string
    category: string
    avgRating: number
    reviewCount: number
    returnRate: number
    profitMargin: number
    stockLevel: number
    competitorCount: number
    seasonality?: string | null
    lastComputedAt?: Date | string
  }

  export type ProductFeaturesUncheckedCreateInput = {
    id?: string
    productId: string
    category: string
    avgRating: number
    reviewCount: number
    returnRate: number
    profitMargin: number
    stockLevel: number
    competitorCount: number
    seasonality?: string | null
    lastComputedAt?: Date | string
  }

  export type ProductFeaturesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    avgRating?: FloatFieldUpdateOperationsInput | number
    reviewCount?: IntFieldUpdateOperationsInput | number
    returnRate?: FloatFieldUpdateOperationsInput | number
    profitMargin?: FloatFieldUpdateOperationsInput | number
    stockLevel?: IntFieldUpdateOperationsInput | number
    competitorCount?: IntFieldUpdateOperationsInput | number
    seasonality?: NullableStringFieldUpdateOperationsInput | string | null
    lastComputedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductFeaturesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    avgRating?: FloatFieldUpdateOperationsInput | number
    reviewCount?: IntFieldUpdateOperationsInput | number
    returnRate?: FloatFieldUpdateOperationsInput | number
    profitMargin?: FloatFieldUpdateOperationsInput | number
    stockLevel?: IntFieldUpdateOperationsInput | number
    competitorCount?: IntFieldUpdateOperationsInput | number
    seasonality?: NullableStringFieldUpdateOperationsInput | string | null
    lastComputedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductFeaturesCreateManyInput = {
    id?: string
    productId: string
    category: string
    avgRating: number
    reviewCount: number
    returnRate: number
    profitMargin: number
    stockLevel: number
    competitorCount: number
    seasonality?: string | null
    lastComputedAt?: Date | string
  }

  export type ProductFeaturesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    avgRating?: FloatFieldUpdateOperationsInput | number
    reviewCount?: IntFieldUpdateOperationsInput | number
    returnRate?: FloatFieldUpdateOperationsInput | number
    profitMargin?: FloatFieldUpdateOperationsInput | number
    stockLevel?: IntFieldUpdateOperationsInput | number
    competitorCount?: IntFieldUpdateOperationsInput | number
    seasonality?: NullableStringFieldUpdateOperationsInput | string | null
    lastComputedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductFeaturesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    avgRating?: FloatFieldUpdateOperationsInput | number
    reviewCount?: IntFieldUpdateOperationsInput | number
    returnRate?: FloatFieldUpdateOperationsInput | number
    profitMargin?: FloatFieldUpdateOperationsInput | number
    stockLevel?: IntFieldUpdateOperationsInput | number
    competitorCount?: IntFieldUpdateOperationsInput | number
    seasonality?: NullableStringFieldUpdateOperationsInput | string | null
    lastComputedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AIAuditLogCreateInput = {
    id?: string
    action: string
    modelName?: string | null
    customerId?: string | null
    productId?: string | null
    details: JsonNullValueInput | InputJsonValue
    result: string
    error?: string | null
    createdAt?: Date | string
  }

  export type AIAuditLogUncheckedCreateInput = {
    id?: string
    action: string
    modelName?: string | null
    customerId?: string | null
    productId?: string | null
    details: JsonNullValueInput | InputJsonValue
    result: string
    error?: string | null
    createdAt?: Date | string
  }

  export type AIAuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    modelName?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: JsonNullValueInput | InputJsonValue
    result?: StringFieldUpdateOperationsInput | string
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AIAuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    modelName?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: JsonNullValueInput | InputJsonValue
    result?: StringFieldUpdateOperationsInput | string
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AIAuditLogCreateManyInput = {
    id?: string
    action: string
    modelName?: string | null
    customerId?: string | null
    productId?: string | null
    details: JsonNullValueInput | InputJsonValue
    result: string
    error?: string | null
    createdAt?: Date | string
  }

  export type AIAuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    modelName?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: JsonNullValueInput | InputJsonValue
    result?: StringFieldUpdateOperationsInput | string
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AIAuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    modelName?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    productId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: JsonNullValueInput | InputJsonValue
    result?: StringFieldUpdateOperationsInput | string
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type FloatNullableListFilter<$PrismaModel = never> = {
    equals?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    has?: number | FloatFieldRefInput<$PrismaModel> | null
    hasEvery?: number[] | ListFloatFieldRefInput<$PrismaModel>
    hasSome?: number[] | ListFloatFieldRefInput<$PrismaModel>
    isEmpty?: boolean
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

  export type ProductEmbeddingCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    embedding?: SortOrder
    model?: SortOrder
    modelVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductEmbeddingAvgOrderByAggregateInput = {
    embedding?: SortOrder
  }

  export type ProductEmbeddingMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    model?: SortOrder
    modelVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductEmbeddingMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    model?: SortOrder
    modelVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductEmbeddingSumOrderByAggregateInput = {
    embedding?: SortOrder
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

  export type CustomerBehaviorCountOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    eventType?: SortOrder
    productId?: SortOrder
    category?: SortOrder
    sessionId?: SortOrder
    duration?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type CustomerBehaviorAvgOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type CustomerBehaviorMaxOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    eventType?: SortOrder
    productId?: SortOrder
    category?: SortOrder
    sessionId?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
  }

  export type CustomerBehaviorMinOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    eventType?: SortOrder
    productId?: SortOrder
    category?: SortOrder
    sessionId?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
  }

  export type CustomerBehaviorSumOrderByAggregateInput = {
    duration?: SortOrder
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

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type ChurnPredictionCountOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    churnScore?: SortOrder
    riskFactors?: SortOrder
    lastUpdated?: SortOrder
    nextReviewDate?: SortOrder
  }

  export type ChurnPredictionAvgOrderByAggregateInput = {
    churnScore?: SortOrder
  }

  export type ChurnPredictionMaxOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    churnScore?: SortOrder
    lastUpdated?: SortOrder
    nextReviewDate?: SortOrder
  }

  export type ChurnPredictionMinOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    churnScore?: SortOrder
    lastUpdated?: SortOrder
    nextReviewDate?: SortOrder
  }

  export type ChurnPredictionSumOrderByAggregateInput = {
    churnScore?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ProductRecommendationCountOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    score?: SortOrder
    method?: SortOrder
    clicked?: SortOrder
    purchased?: SortOrder
    createdAt?: SortOrder
  }

  export type ProductRecommendationAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type ProductRecommendationMaxOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    score?: SortOrder
    method?: SortOrder
    clicked?: SortOrder
    purchased?: SortOrder
    createdAt?: SortOrder
  }

  export type ProductRecommendationMinOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    score?: SortOrder
    method?: SortOrder
    clicked?: SortOrder
    purchased?: SortOrder
    createdAt?: SortOrder
  }

  export type ProductRecommendationSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type SentimentAnalysisCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    customerId?: SortOrder
    text?: SortOrder
    sentiment?: SortOrder
    score?: SortOrder
    emotions?: SortOrder
    language?: SortOrder
    model?: SortOrder
    createdAt?: SortOrder
  }

  export type SentimentAnalysisAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type SentimentAnalysisMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    customerId?: SortOrder
    text?: SortOrder
    sentiment?: SortOrder
    score?: SortOrder
    language?: SortOrder
    model?: SortOrder
    createdAt?: SortOrder
  }

  export type SentimentAnalysisMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    customerId?: SortOrder
    text?: SortOrder
    sentiment?: SortOrder
    score?: SortOrder
    language?: SortOrder
    model?: SortOrder
    createdAt?: SortOrder
  }

  export type SentimentAnalysisSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type PriceOptimizationCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    currentPrice?: SortOrder
    optimalPrice?: SortOrder
    elasticity?: SortOrder
    conversionRate?: SortOrder
    expectedRevenue?: SortOrder
    lastOptimized?: SortOrder
  }

  export type PriceOptimizationAvgOrderByAggregateInput = {
    currentPrice?: SortOrder
    optimalPrice?: SortOrder
    elasticity?: SortOrder
    conversionRate?: SortOrder
    expectedRevenue?: SortOrder
  }

  export type PriceOptimizationMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    currentPrice?: SortOrder
    optimalPrice?: SortOrder
    elasticity?: SortOrder
    conversionRate?: SortOrder
    expectedRevenue?: SortOrder
    lastOptimized?: SortOrder
  }

  export type PriceOptimizationMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    currentPrice?: SortOrder
    optimalPrice?: SortOrder
    elasticity?: SortOrder
    conversionRate?: SortOrder
    expectedRevenue?: SortOrder
    lastOptimized?: SortOrder
  }

  export type PriceOptimizationSumOrderByAggregateInput = {
    currentPrice?: SortOrder
    optimalPrice?: SortOrder
    elasticity?: SortOrder
    conversionRate?: SortOrder
    expectedRevenue?: SortOrder
  }

  export type CustomerLTVCountOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    ltv?: SortOrder
    clv?: SortOrder
    segment?: SortOrder
    roi?: SortOrder
    predictedMonthly?: SortOrder
    lastComputed?: SortOrder
  }

  export type CustomerLTVAvgOrderByAggregateInput = {
    ltv?: SortOrder
    clv?: SortOrder
    roi?: SortOrder
    predictedMonthly?: SortOrder
  }

  export type CustomerLTVMaxOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    ltv?: SortOrder
    clv?: SortOrder
    segment?: SortOrder
    roi?: SortOrder
    predictedMonthly?: SortOrder
    lastComputed?: SortOrder
  }

  export type CustomerLTVMinOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    ltv?: SortOrder
    clv?: SortOrder
    segment?: SortOrder
    roi?: SortOrder
    predictedMonthly?: SortOrder
    lastComputed?: SortOrder
  }

  export type CustomerLTVSumOrderByAggregateInput = {
    ltv?: SortOrder
    clv?: SortOrder
    roi?: SortOrder
    predictedMonthly?: SortOrder
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

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ABTestCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    variantA?: SortOrder
    variantB?: SortOrder
    controlGroup?: SortOrder
    testGroup?: SortOrder
    metric?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    pValue?: SortOrder
    winner?: SortOrder
    createdAt?: SortOrder
  }

  export type ABTestAvgOrderByAggregateInput = {
    pValue?: SortOrder
  }

  export type ABTestMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    metric?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    pValue?: SortOrder
    winner?: SortOrder
    createdAt?: SortOrder
  }

  export type ABTestMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    metric?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    pValue?: SortOrder
    winner?: SortOrder
    createdAt?: SortOrder
  }

  export type ABTestSumOrderByAggregateInput = {
    pValue?: SortOrder
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

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type FraudScoreCountOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    orderId?: SortOrder
    score?: SortOrder
    riskFactors?: SortOrder
    flagged?: SortOrder
    reviewedAt?: SortOrder
    reviewedBy?: SortOrder
    decision?: SortOrder
    createdAt?: SortOrder
  }

  export type FraudScoreAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type FraudScoreMaxOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    orderId?: SortOrder
    score?: SortOrder
    flagged?: SortOrder
    reviewedAt?: SortOrder
    reviewedBy?: SortOrder
    decision?: SortOrder
    createdAt?: SortOrder
  }

  export type FraudScoreMinOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    orderId?: SortOrder
    score?: SortOrder
    flagged?: SortOrder
    reviewedAt?: SortOrder
    reviewedBy?: SortOrder
    decision?: SortOrder
    createdAt?: SortOrder
  }

  export type FraudScoreSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type MLModelCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    version?: SortOrder
    type?: SortOrder
    framework?: SortOrder
    modelPath?: SortOrder
    accuracy?: SortOrder
    precision?: SortOrder
    recall?: SortOrder
    f1Score?: SortOrder
    deployedAt?: SortOrder
    lastEvaluated?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MLModelAvgOrderByAggregateInput = {
    accuracy?: SortOrder
    precision?: SortOrder
    recall?: SortOrder
    f1Score?: SortOrder
  }

  export type MLModelMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    version?: SortOrder
    type?: SortOrder
    framework?: SortOrder
    modelPath?: SortOrder
    accuracy?: SortOrder
    precision?: SortOrder
    recall?: SortOrder
    f1Score?: SortOrder
    deployedAt?: SortOrder
    lastEvaluated?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MLModelMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    version?: SortOrder
    type?: SortOrder
    framework?: SortOrder
    modelPath?: SortOrder
    accuracy?: SortOrder
    precision?: SortOrder
    recall?: SortOrder
    f1Score?: SortOrder
    deployedAt?: SortOrder
    lastEvaluated?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MLModelSumOrderByAggregateInput = {
    accuracy?: SortOrder
    precision?: SortOrder
    recall?: SortOrder
    f1Score?: SortOrder
  }

  export type ModelTrainingLogCountOrderByAggregateInput = {
    id?: SortOrder
    modelId?: SortOrder
    epoch?: SortOrder
    loss?: SortOrder
    accuracy?: SortOrder
    val_loss?: SortOrder
    val_accuracy?: SortOrder
    timestamp?: SortOrder
  }

  export type ModelTrainingLogAvgOrderByAggregateInput = {
    epoch?: SortOrder
    loss?: SortOrder
    accuracy?: SortOrder
    val_loss?: SortOrder
    val_accuracy?: SortOrder
  }

  export type ModelTrainingLogMaxOrderByAggregateInput = {
    id?: SortOrder
    modelId?: SortOrder
    epoch?: SortOrder
    loss?: SortOrder
    accuracy?: SortOrder
    val_loss?: SortOrder
    val_accuracy?: SortOrder
    timestamp?: SortOrder
  }

  export type ModelTrainingLogMinOrderByAggregateInput = {
    id?: SortOrder
    modelId?: SortOrder
    epoch?: SortOrder
    loss?: SortOrder
    accuracy?: SortOrder
    val_loss?: SortOrder
    val_accuracy?: SortOrder
    timestamp?: SortOrder
  }

  export type ModelTrainingLogSumOrderByAggregateInput = {
    epoch?: SortOrder
    loss?: SortOrder
    accuracy?: SortOrder
    val_loss?: SortOrder
    val_accuracy?: SortOrder
  }

  export type UserFeaturesCountOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    totalOrders?: SortOrder
    totalSpent?: SortOrder
    avgOrderValue?: SortOrder
    daysSinceLastOrder?: SortOrder
    categoryPreference?: SortOrder
    deviceType?: SortOrder
    browser?: SortOrder
    timezone?: SortOrder
    lastComputedAt?: SortOrder
  }

  export type UserFeaturesAvgOrderByAggregateInput = {
    totalOrders?: SortOrder
    totalSpent?: SortOrder
    avgOrderValue?: SortOrder
    daysSinceLastOrder?: SortOrder
  }

  export type UserFeaturesMaxOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    totalOrders?: SortOrder
    totalSpent?: SortOrder
    avgOrderValue?: SortOrder
    daysSinceLastOrder?: SortOrder
    deviceType?: SortOrder
    browser?: SortOrder
    timezone?: SortOrder
    lastComputedAt?: SortOrder
  }

  export type UserFeaturesMinOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    totalOrders?: SortOrder
    totalSpent?: SortOrder
    avgOrderValue?: SortOrder
    daysSinceLastOrder?: SortOrder
    deviceType?: SortOrder
    browser?: SortOrder
    timezone?: SortOrder
    lastComputedAt?: SortOrder
  }

  export type UserFeaturesSumOrderByAggregateInput = {
    totalOrders?: SortOrder
    totalSpent?: SortOrder
    avgOrderValue?: SortOrder
    daysSinceLastOrder?: SortOrder
  }

  export type ProductFeaturesCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    category?: SortOrder
    avgRating?: SortOrder
    reviewCount?: SortOrder
    returnRate?: SortOrder
    profitMargin?: SortOrder
    stockLevel?: SortOrder
    competitorCount?: SortOrder
    seasonality?: SortOrder
    lastComputedAt?: SortOrder
  }

  export type ProductFeaturesAvgOrderByAggregateInput = {
    avgRating?: SortOrder
    reviewCount?: SortOrder
    returnRate?: SortOrder
    profitMargin?: SortOrder
    stockLevel?: SortOrder
    competitorCount?: SortOrder
  }

  export type ProductFeaturesMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    category?: SortOrder
    avgRating?: SortOrder
    reviewCount?: SortOrder
    returnRate?: SortOrder
    profitMargin?: SortOrder
    stockLevel?: SortOrder
    competitorCount?: SortOrder
    seasonality?: SortOrder
    lastComputedAt?: SortOrder
  }

  export type ProductFeaturesMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    category?: SortOrder
    avgRating?: SortOrder
    reviewCount?: SortOrder
    returnRate?: SortOrder
    profitMargin?: SortOrder
    stockLevel?: SortOrder
    competitorCount?: SortOrder
    seasonality?: SortOrder
    lastComputedAt?: SortOrder
  }

  export type ProductFeaturesSumOrderByAggregateInput = {
    avgRating?: SortOrder
    reviewCount?: SortOrder
    returnRate?: SortOrder
    profitMargin?: SortOrder
    stockLevel?: SortOrder
    competitorCount?: SortOrder
  }

  export type AIAuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    modelName?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    details?: SortOrder
    result?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type AIAuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    modelName?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    result?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type AIAuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    modelName?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    result?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type ProductEmbeddingCreateembeddingInput = {
    set: number[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type ProductEmbeddingUpdateembeddingInput = {
    set?: number[]
    push?: number | number[]
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

  export type ChurnPredictionCreateriskFactorsInput = {
    set: string[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ChurnPredictionUpdateriskFactorsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type SentimentAnalysisCreateemotionsInput = {
    set: string[]
  }

  export type SentimentAnalysisUpdateemotionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ABTestCreatecontrolGroupInput = {
    set: string[]
  }

  export type ABTestCreatetestGroupInput = {
    set: string[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type ABTestUpdatecontrolGroupInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ABTestUpdatetestGroupInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FraudScoreCreateriskFactorsInput = {
    set: string[]
  }

  export type FraudScoreUpdateriskFactorsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserFeaturesCreatecategoryPreferenceInput = {
    set: string[]
  }

  export type UserFeaturesUpdatecategoryPreferenceInput = {
    set?: string[]
    push?: string | string[]
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

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
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