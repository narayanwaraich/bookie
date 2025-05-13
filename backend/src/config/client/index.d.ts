
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
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Bookmark
 * 
 */
export type Bookmark = $Result.DefaultSelection<Prisma.$BookmarkPayload>
/**
 * Model Folder
 * 
 */
export type Folder = $Result.DefaultSelection<Prisma.$FolderPayload>
/**
 * Model FolderBookmark
 * 
 */
export type FolderBookmark = $Result.DefaultSelection<Prisma.$FolderBookmarkPayload>
/**
 * Model FolderCollaborator
 * 
 */
export type FolderCollaborator = $Result.DefaultSelection<Prisma.$FolderCollaboratorPayload>
/**
 * Model Tag
 * 
 */
export type Tag = $Result.DefaultSelection<Prisma.$TagPayload>
/**
 * Model BookmarkTag
 * 
 */
export type BookmarkTag = $Result.DefaultSelection<Prisma.$BookmarkTagPayload>
/**
 * Model Collection
 * 
 */
export type Collection = $Result.DefaultSelection<Prisma.$CollectionPayload>
/**
 * Model BookmarkCollection
 * 
 */
export type BookmarkCollection = $Result.DefaultSelection<Prisma.$BookmarkCollectionPayload>
/**
 * Model CollectionCollaborator
 * 
 */
export type CollectionCollaborator = $Result.DefaultSelection<Prisma.$CollectionCollaboratorPayload>
/**
 * Model Device
 * 
 */
export type Device = $Result.DefaultSelection<Prisma.$DevicePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  VIEW: 'VIEW',
  EDIT: 'EDIT',
  ADMIN: 'ADMIN'
};

export type Role = (typeof Role)[keyof typeof Role]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
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
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

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
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bookmark`: Exposes CRUD operations for the **Bookmark** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bookmarks
    * const bookmarks = await prisma.bookmark.findMany()
    * ```
    */
  get bookmark(): Prisma.BookmarkDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.folder`: Exposes CRUD operations for the **Folder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Folders
    * const folders = await prisma.folder.findMany()
    * ```
    */
  get folder(): Prisma.FolderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.folderBookmark`: Exposes CRUD operations for the **FolderBookmark** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FolderBookmarks
    * const folderBookmarks = await prisma.folderBookmark.findMany()
    * ```
    */
  get folderBookmark(): Prisma.FolderBookmarkDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.folderCollaborator`: Exposes CRUD operations for the **FolderCollaborator** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FolderCollaborators
    * const folderCollaborators = await prisma.folderCollaborator.findMany()
    * ```
    */
  get folderCollaborator(): Prisma.FolderCollaboratorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tag`: Exposes CRUD operations for the **Tag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tags
    * const tags = await prisma.tag.findMany()
    * ```
    */
  get tag(): Prisma.TagDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bookmarkTag`: Exposes CRUD operations for the **BookmarkTag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BookmarkTags
    * const bookmarkTags = await prisma.bookmarkTag.findMany()
    * ```
    */
  get bookmarkTag(): Prisma.BookmarkTagDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.collection`: Exposes CRUD operations for the **Collection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Collections
    * const collections = await prisma.collection.findMany()
    * ```
    */
  get collection(): Prisma.CollectionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bookmarkCollection`: Exposes CRUD operations for the **BookmarkCollection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BookmarkCollections
    * const bookmarkCollections = await prisma.bookmarkCollection.findMany()
    * ```
    */
  get bookmarkCollection(): Prisma.BookmarkCollectionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.collectionCollaborator`: Exposes CRUD operations for the **CollectionCollaborator** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CollectionCollaborators
    * const collectionCollaborators = await prisma.collectionCollaborator.findMany()
    * ```
    */
  get collectionCollaborator(): Prisma.CollectionCollaboratorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.device`: Exposes CRUD operations for the **Device** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Devices
    * const devices = await prisma.device.findMany()
    * ```
    */
  get device(): Prisma.DeviceDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


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
    User: 'User',
    Bookmark: 'Bookmark',
    Folder: 'Folder',
    FolderBookmark: 'FolderBookmark',
    FolderCollaborator: 'FolderCollaborator',
    Tag: 'Tag',
    BookmarkTag: 'BookmarkTag',
    Collection: 'Collection',
    BookmarkCollection: 'BookmarkCollection',
    CollectionCollaborator: 'CollectionCollaborator',
    Device: 'Device'
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
      modelProps: "user" | "bookmark" | "folder" | "folderBookmark" | "folderCollaborator" | "tag" | "bookmarkTag" | "collection" | "bookmarkCollection" | "collectionCollaborator" | "device"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Bookmark: {
        payload: Prisma.$BookmarkPayload<ExtArgs>
        fields: Prisma.BookmarkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookmarkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookmarkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          findFirst: {
            args: Prisma.BookmarkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookmarkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          findMany: {
            args: Prisma.BookmarkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>[]
          }
          create: {
            args: Prisma.BookmarkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          createMany: {
            args: Prisma.BookmarkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookmarkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>[]
          }
          delete: {
            args: Prisma.BookmarkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          update: {
            args: Prisma.BookmarkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          deleteMany: {
            args: Prisma.BookmarkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookmarkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BookmarkUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>[]
          }
          upsert: {
            args: Prisma.BookmarkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkPayload>
          }
          aggregate: {
            args: Prisma.BookmarkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookmark>
          }
          groupBy: {
            args: Prisma.BookmarkGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookmarkGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookmarkCountArgs<ExtArgs>
            result: $Utils.Optional<BookmarkCountAggregateOutputType> | number
          }
        }
      }
      Folder: {
        payload: Prisma.$FolderPayload<ExtArgs>
        fields: Prisma.FolderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FolderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FolderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderPayload>
          }
          findFirst: {
            args: Prisma.FolderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FolderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderPayload>
          }
          findMany: {
            args: Prisma.FolderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderPayload>[]
          }
          create: {
            args: Prisma.FolderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderPayload>
          }
          createMany: {
            args: Prisma.FolderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FolderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderPayload>[]
          }
          delete: {
            args: Prisma.FolderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderPayload>
          }
          update: {
            args: Prisma.FolderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderPayload>
          }
          deleteMany: {
            args: Prisma.FolderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FolderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FolderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderPayload>[]
          }
          upsert: {
            args: Prisma.FolderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderPayload>
          }
          aggregate: {
            args: Prisma.FolderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFolder>
          }
          groupBy: {
            args: Prisma.FolderGroupByArgs<ExtArgs>
            result: $Utils.Optional<FolderGroupByOutputType>[]
          }
          count: {
            args: Prisma.FolderCountArgs<ExtArgs>
            result: $Utils.Optional<FolderCountAggregateOutputType> | number
          }
        }
      }
      FolderBookmark: {
        payload: Prisma.$FolderBookmarkPayload<ExtArgs>
        fields: Prisma.FolderBookmarkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FolderBookmarkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderBookmarkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FolderBookmarkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderBookmarkPayload>
          }
          findFirst: {
            args: Prisma.FolderBookmarkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderBookmarkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FolderBookmarkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderBookmarkPayload>
          }
          findMany: {
            args: Prisma.FolderBookmarkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderBookmarkPayload>[]
          }
          create: {
            args: Prisma.FolderBookmarkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderBookmarkPayload>
          }
          createMany: {
            args: Prisma.FolderBookmarkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FolderBookmarkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderBookmarkPayload>[]
          }
          delete: {
            args: Prisma.FolderBookmarkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderBookmarkPayload>
          }
          update: {
            args: Prisma.FolderBookmarkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderBookmarkPayload>
          }
          deleteMany: {
            args: Prisma.FolderBookmarkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FolderBookmarkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FolderBookmarkUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderBookmarkPayload>[]
          }
          upsert: {
            args: Prisma.FolderBookmarkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderBookmarkPayload>
          }
          aggregate: {
            args: Prisma.FolderBookmarkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFolderBookmark>
          }
          groupBy: {
            args: Prisma.FolderBookmarkGroupByArgs<ExtArgs>
            result: $Utils.Optional<FolderBookmarkGroupByOutputType>[]
          }
          count: {
            args: Prisma.FolderBookmarkCountArgs<ExtArgs>
            result: $Utils.Optional<FolderBookmarkCountAggregateOutputType> | number
          }
        }
      }
      FolderCollaborator: {
        payload: Prisma.$FolderCollaboratorPayload<ExtArgs>
        fields: Prisma.FolderCollaboratorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FolderCollaboratorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderCollaboratorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FolderCollaboratorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderCollaboratorPayload>
          }
          findFirst: {
            args: Prisma.FolderCollaboratorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderCollaboratorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FolderCollaboratorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderCollaboratorPayload>
          }
          findMany: {
            args: Prisma.FolderCollaboratorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderCollaboratorPayload>[]
          }
          create: {
            args: Prisma.FolderCollaboratorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderCollaboratorPayload>
          }
          createMany: {
            args: Prisma.FolderCollaboratorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FolderCollaboratorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderCollaboratorPayload>[]
          }
          delete: {
            args: Prisma.FolderCollaboratorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderCollaboratorPayload>
          }
          update: {
            args: Prisma.FolderCollaboratorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderCollaboratorPayload>
          }
          deleteMany: {
            args: Prisma.FolderCollaboratorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FolderCollaboratorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FolderCollaboratorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderCollaboratorPayload>[]
          }
          upsert: {
            args: Prisma.FolderCollaboratorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FolderCollaboratorPayload>
          }
          aggregate: {
            args: Prisma.FolderCollaboratorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFolderCollaborator>
          }
          groupBy: {
            args: Prisma.FolderCollaboratorGroupByArgs<ExtArgs>
            result: $Utils.Optional<FolderCollaboratorGroupByOutputType>[]
          }
          count: {
            args: Prisma.FolderCollaboratorCountArgs<ExtArgs>
            result: $Utils.Optional<FolderCollaboratorCountAggregateOutputType> | number
          }
        }
      }
      Tag: {
        payload: Prisma.$TagPayload<ExtArgs>
        fields: Prisma.TagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findFirst: {
            args: Prisma.TagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findMany: {
            args: Prisma.TagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          create: {
            args: Prisma.TagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          createMany: {
            args: Prisma.TagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TagCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          delete: {
            args: Prisma.TagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          update: {
            args: Prisma.TagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          deleteMany: {
            args: Prisma.TagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TagUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          upsert: {
            args: Prisma.TagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          aggregate: {
            args: Prisma.TagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTag>
          }
          groupBy: {
            args: Prisma.TagGroupByArgs<ExtArgs>
            result: $Utils.Optional<TagGroupByOutputType>[]
          }
          count: {
            args: Prisma.TagCountArgs<ExtArgs>
            result: $Utils.Optional<TagCountAggregateOutputType> | number
          }
        }
      }
      BookmarkTag: {
        payload: Prisma.$BookmarkTagPayload<ExtArgs>
        fields: Prisma.BookmarkTagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookmarkTagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkTagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookmarkTagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkTagPayload>
          }
          findFirst: {
            args: Prisma.BookmarkTagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkTagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookmarkTagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkTagPayload>
          }
          findMany: {
            args: Prisma.BookmarkTagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkTagPayload>[]
          }
          create: {
            args: Prisma.BookmarkTagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkTagPayload>
          }
          createMany: {
            args: Prisma.BookmarkTagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookmarkTagCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkTagPayload>[]
          }
          delete: {
            args: Prisma.BookmarkTagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkTagPayload>
          }
          update: {
            args: Prisma.BookmarkTagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkTagPayload>
          }
          deleteMany: {
            args: Prisma.BookmarkTagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookmarkTagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BookmarkTagUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkTagPayload>[]
          }
          upsert: {
            args: Prisma.BookmarkTagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkTagPayload>
          }
          aggregate: {
            args: Prisma.BookmarkTagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookmarkTag>
          }
          groupBy: {
            args: Prisma.BookmarkTagGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookmarkTagGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookmarkTagCountArgs<ExtArgs>
            result: $Utils.Optional<BookmarkTagCountAggregateOutputType> | number
          }
        }
      }
      Collection: {
        payload: Prisma.$CollectionPayload<ExtArgs>
        fields: Prisma.CollectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CollectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CollectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>
          }
          findFirst: {
            args: Prisma.CollectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CollectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>
          }
          findMany: {
            args: Prisma.CollectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>[]
          }
          create: {
            args: Prisma.CollectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>
          }
          createMany: {
            args: Prisma.CollectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CollectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>[]
          }
          delete: {
            args: Prisma.CollectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>
          }
          update: {
            args: Prisma.CollectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>
          }
          deleteMany: {
            args: Prisma.CollectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CollectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CollectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>[]
          }
          upsert: {
            args: Prisma.CollectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>
          }
          aggregate: {
            args: Prisma.CollectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCollection>
          }
          groupBy: {
            args: Prisma.CollectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CollectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CollectionCountArgs<ExtArgs>
            result: $Utils.Optional<CollectionCountAggregateOutputType> | number
          }
        }
      }
      BookmarkCollection: {
        payload: Prisma.$BookmarkCollectionPayload<ExtArgs>
        fields: Prisma.BookmarkCollectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookmarkCollectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkCollectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookmarkCollectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkCollectionPayload>
          }
          findFirst: {
            args: Prisma.BookmarkCollectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkCollectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookmarkCollectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkCollectionPayload>
          }
          findMany: {
            args: Prisma.BookmarkCollectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkCollectionPayload>[]
          }
          create: {
            args: Prisma.BookmarkCollectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkCollectionPayload>
          }
          createMany: {
            args: Prisma.BookmarkCollectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookmarkCollectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkCollectionPayload>[]
          }
          delete: {
            args: Prisma.BookmarkCollectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkCollectionPayload>
          }
          update: {
            args: Prisma.BookmarkCollectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkCollectionPayload>
          }
          deleteMany: {
            args: Prisma.BookmarkCollectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookmarkCollectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BookmarkCollectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkCollectionPayload>[]
          }
          upsert: {
            args: Prisma.BookmarkCollectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookmarkCollectionPayload>
          }
          aggregate: {
            args: Prisma.BookmarkCollectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookmarkCollection>
          }
          groupBy: {
            args: Prisma.BookmarkCollectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookmarkCollectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookmarkCollectionCountArgs<ExtArgs>
            result: $Utils.Optional<BookmarkCollectionCountAggregateOutputType> | number
          }
        }
      }
      CollectionCollaborator: {
        payload: Prisma.$CollectionCollaboratorPayload<ExtArgs>
        fields: Prisma.CollectionCollaboratorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CollectionCollaboratorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionCollaboratorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CollectionCollaboratorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionCollaboratorPayload>
          }
          findFirst: {
            args: Prisma.CollectionCollaboratorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionCollaboratorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CollectionCollaboratorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionCollaboratorPayload>
          }
          findMany: {
            args: Prisma.CollectionCollaboratorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionCollaboratorPayload>[]
          }
          create: {
            args: Prisma.CollectionCollaboratorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionCollaboratorPayload>
          }
          createMany: {
            args: Prisma.CollectionCollaboratorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CollectionCollaboratorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionCollaboratorPayload>[]
          }
          delete: {
            args: Prisma.CollectionCollaboratorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionCollaboratorPayload>
          }
          update: {
            args: Prisma.CollectionCollaboratorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionCollaboratorPayload>
          }
          deleteMany: {
            args: Prisma.CollectionCollaboratorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CollectionCollaboratorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CollectionCollaboratorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionCollaboratorPayload>[]
          }
          upsert: {
            args: Prisma.CollectionCollaboratorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionCollaboratorPayload>
          }
          aggregate: {
            args: Prisma.CollectionCollaboratorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCollectionCollaborator>
          }
          groupBy: {
            args: Prisma.CollectionCollaboratorGroupByArgs<ExtArgs>
            result: $Utils.Optional<CollectionCollaboratorGroupByOutputType>[]
          }
          count: {
            args: Prisma.CollectionCollaboratorCountArgs<ExtArgs>
            result: $Utils.Optional<CollectionCollaboratorCountAggregateOutputType> | number
          }
        }
      }
      Device: {
        payload: Prisma.$DevicePayload<ExtArgs>
        fields: Prisma.DeviceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeviceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeviceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          findFirst: {
            args: Prisma.DeviceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeviceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          findMany: {
            args: Prisma.DeviceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>[]
          }
          create: {
            args: Prisma.DeviceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          createMany: {
            args: Prisma.DeviceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeviceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>[]
          }
          delete: {
            args: Prisma.DeviceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          update: {
            args: Prisma.DeviceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          deleteMany: {
            args: Prisma.DeviceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeviceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DeviceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>[]
          }
          upsert: {
            args: Prisma.DeviceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          aggregate: {
            args: Prisma.DeviceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDevice>
          }
          groupBy: {
            args: Prisma.DeviceGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeviceGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeviceCountArgs<ExtArgs>
            result: $Utils.Optional<DeviceCountAggregateOutputType> | number
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
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
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
    user?: UserOmit
    bookmark?: BookmarkOmit
    folder?: FolderOmit
    folderBookmark?: FolderBookmarkOmit
    folderCollaborator?: FolderCollaboratorOmit
    tag?: TagOmit
    bookmarkTag?: BookmarkTagOmit
    collection?: CollectionOmit
    bookmarkCollection?: BookmarkCollectionOmit
    collectionCollaborator?: CollectionCollaboratorOmit
    device?: DeviceOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

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

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    bookmarks: number
    folders: number
    tags: number
    collections: number
    ownedCollections: number
    collabFolders: number
    collabCollections: number
    devices: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookmarks?: boolean | UserCountOutputTypeCountBookmarksArgs
    folders?: boolean | UserCountOutputTypeCountFoldersArgs
    tags?: boolean | UserCountOutputTypeCountTagsArgs
    collections?: boolean | UserCountOutputTypeCountCollectionsArgs
    ownedCollections?: boolean | UserCountOutputTypeCountOwnedCollectionsArgs
    collabFolders?: boolean | UserCountOutputTypeCountCollabFoldersArgs
    collabCollections?: boolean | UserCountOutputTypeCountCollabCollectionsArgs
    devices?: boolean | UserCountOutputTypeCountDevicesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBookmarksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookmarkWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFoldersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FolderWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCollectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CollectionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOwnedCollectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CollectionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCollabFoldersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FolderCollaboratorWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCollabCollectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CollectionCollaboratorWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeviceWhereInput
  }


  /**
   * Count Type BookmarkCountOutputType
   */

  export type BookmarkCountOutputType = {
    folders: number
    tags: number
    collections: number
  }

  export type BookmarkCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    folders?: boolean | BookmarkCountOutputTypeCountFoldersArgs
    tags?: boolean | BookmarkCountOutputTypeCountTagsArgs
    collections?: boolean | BookmarkCountOutputTypeCountCollectionsArgs
  }

  // Custom InputTypes
  /**
   * BookmarkCountOutputType without action
   */
  export type BookmarkCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkCountOutputType
     */
    select?: BookmarkCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BookmarkCountOutputType without action
   */
  export type BookmarkCountOutputTypeCountFoldersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FolderBookmarkWhereInput
  }

  /**
   * BookmarkCountOutputType without action
   */
  export type BookmarkCountOutputTypeCountTagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookmarkTagWhereInput
  }

  /**
   * BookmarkCountOutputType without action
   */
  export type BookmarkCountOutputTypeCountCollectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookmarkCollectionWhereInput
  }


  /**
   * Count Type FolderCountOutputType
   */

  export type FolderCountOutputType = {
    children: number
    bookmarks: number
    collaborators: number
  }

  export type FolderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    children?: boolean | FolderCountOutputTypeCountChildrenArgs
    bookmarks?: boolean | FolderCountOutputTypeCountBookmarksArgs
    collaborators?: boolean | FolderCountOutputTypeCountCollaboratorsArgs
  }

  // Custom InputTypes
  /**
   * FolderCountOutputType without action
   */
  export type FolderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderCountOutputType
     */
    select?: FolderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FolderCountOutputType without action
   */
  export type FolderCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FolderWhereInput
  }

  /**
   * FolderCountOutputType without action
   */
  export type FolderCountOutputTypeCountBookmarksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FolderBookmarkWhereInput
  }

  /**
   * FolderCountOutputType without action
   */
  export type FolderCountOutputTypeCountCollaboratorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FolderCollaboratorWhereInput
  }


  /**
   * Count Type TagCountOutputType
   */

  export type TagCountOutputType = {
    bookmarks: number
  }

  export type TagCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookmarks?: boolean | TagCountOutputTypeCountBookmarksArgs
  }

  // Custom InputTypes
  /**
   * TagCountOutputType without action
   */
  export type TagCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TagCountOutputType
     */
    select?: TagCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TagCountOutputType without action
   */
  export type TagCountOutputTypeCountBookmarksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookmarkTagWhereInput
  }


  /**
   * Count Type CollectionCountOutputType
   */

  export type CollectionCountOutputType = {
    bookmarks: number
    collaborators: number
  }

  export type CollectionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookmarks?: boolean | CollectionCountOutputTypeCountBookmarksArgs
    collaborators?: boolean | CollectionCountOutputTypeCountCollaboratorsArgs
  }

  // Custom InputTypes
  /**
   * CollectionCountOutputType without action
   */
  export type CollectionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionCountOutputType
     */
    select?: CollectionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CollectionCountOutputType without action
   */
  export type CollectionCountOutputTypeCountBookmarksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookmarkCollectionWhereInput
  }

  /**
   * CollectionCountOutputType without action
   */
  export type CollectionCountOutputTypeCountCollaboratorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CollectionCollaboratorWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    password: string | null
    name: string | null
    profileImage: string | null
    createdAt: Date | null
    updatedAt: Date | null
    isActive: boolean | null
    lastLogin: Date | null
    refreshToken: string | null
    passwordResetToken: string | null
    passwordResetExpires: Date | null
    isVerified: boolean | null
    verificationToken: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    password: string | null
    name: string | null
    profileImage: string | null
    createdAt: Date | null
    updatedAt: Date | null
    isActive: boolean | null
    lastLogin: Date | null
    refreshToken: string | null
    passwordResetToken: string | null
    passwordResetExpires: Date | null
    isVerified: boolean | null
    verificationToken: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    username: number
    password: number
    name: number
    profileImage: number
    createdAt: number
    updatedAt: number
    isActive: number
    lastLogin: number
    refreshToken: number
    passwordResetToken: number
    passwordResetExpires: number
    isVerified: number
    verificationToken: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    username?: true
    password?: true
    name?: true
    profileImage?: true
    createdAt?: true
    updatedAt?: true
    isActive?: true
    lastLogin?: true
    refreshToken?: true
    passwordResetToken?: true
    passwordResetExpires?: true
    isVerified?: true
    verificationToken?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    username?: true
    password?: true
    name?: true
    profileImage?: true
    createdAt?: true
    updatedAt?: true
    isActive?: true
    lastLogin?: true
    refreshToken?: true
    passwordResetToken?: true
    passwordResetExpires?: true
    isVerified?: true
    verificationToken?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    username?: true
    password?: true
    name?: true
    profileImage?: true
    createdAt?: true
    updatedAt?: true
    isActive?: true
    lastLogin?: true
    refreshToken?: true
    passwordResetToken?: true
    passwordResetExpires?: true
    isVerified?: true
    verificationToken?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    username: string
    password: string
    name: string | null
    profileImage: string | null
    createdAt: Date
    updatedAt: Date
    isActive: boolean
    lastLogin: Date | null
    refreshToken: string | null
    passwordResetToken: string | null
    passwordResetExpires: Date | null
    isVerified: boolean
    verificationToken: string | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    password?: boolean
    name?: boolean
    profileImage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isActive?: boolean
    lastLogin?: boolean
    refreshToken?: boolean
    passwordResetToken?: boolean
    passwordResetExpires?: boolean
    isVerified?: boolean
    verificationToken?: boolean
    bookmarks?: boolean | User$bookmarksArgs<ExtArgs>
    folders?: boolean | User$foldersArgs<ExtArgs>
    tags?: boolean | User$tagsArgs<ExtArgs>
    collections?: boolean | User$collectionsArgs<ExtArgs>
    ownedCollections?: boolean | User$ownedCollectionsArgs<ExtArgs>
    collabFolders?: boolean | User$collabFoldersArgs<ExtArgs>
    collabCollections?: boolean | User$collabCollectionsArgs<ExtArgs>
    devices?: boolean | User$devicesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    password?: boolean
    name?: boolean
    profileImage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isActive?: boolean
    lastLogin?: boolean
    refreshToken?: boolean
    passwordResetToken?: boolean
    passwordResetExpires?: boolean
    isVerified?: boolean
    verificationToken?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    password?: boolean
    name?: boolean
    profileImage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isActive?: boolean
    lastLogin?: boolean
    refreshToken?: boolean
    passwordResetToken?: boolean
    passwordResetExpires?: boolean
    isVerified?: boolean
    verificationToken?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    username?: boolean
    password?: boolean
    name?: boolean
    profileImage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isActive?: boolean
    lastLogin?: boolean
    refreshToken?: boolean
    passwordResetToken?: boolean
    passwordResetExpires?: boolean
    isVerified?: boolean
    verificationToken?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "username" | "password" | "name" | "profileImage" | "createdAt" | "updatedAt" | "isActive" | "lastLogin" | "refreshToken" | "passwordResetToken" | "passwordResetExpires" | "isVerified" | "verificationToken", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookmarks?: boolean | User$bookmarksArgs<ExtArgs>
    folders?: boolean | User$foldersArgs<ExtArgs>
    tags?: boolean | User$tagsArgs<ExtArgs>
    collections?: boolean | User$collectionsArgs<ExtArgs>
    ownedCollections?: boolean | User$ownedCollectionsArgs<ExtArgs>
    collabFolders?: boolean | User$collabFoldersArgs<ExtArgs>
    collabCollections?: boolean | User$collabCollectionsArgs<ExtArgs>
    devices?: boolean | User$devicesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      bookmarks: Prisma.$BookmarkPayload<ExtArgs>[]
      folders: Prisma.$FolderPayload<ExtArgs>[]
      tags: Prisma.$TagPayload<ExtArgs>[]
      collections: Prisma.$CollectionPayload<ExtArgs>[]
      ownedCollections: Prisma.$CollectionPayload<ExtArgs>[]
      collabFolders: Prisma.$FolderCollaboratorPayload<ExtArgs>[]
      collabCollections: Prisma.$CollectionCollaboratorPayload<ExtArgs>[]
      devices: Prisma.$DevicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      username: string
      password: string
      name: string | null
      profileImage: string | null
      createdAt: Date
      updatedAt: Date
      isActive: boolean
      lastLogin: Date | null
      refreshToken: string | null
      passwordResetToken: string | null
      passwordResetExpires: Date | null
      isVerified: boolean
      verificationToken: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bookmarks<T extends User$bookmarksArgs<ExtArgs> = {}>(args?: Subset<T, User$bookmarksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    folders<T extends User$foldersArgs<ExtArgs> = {}>(args?: Subset<T, User$foldersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FolderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tags<T extends User$tagsArgs<ExtArgs> = {}>(args?: Subset<T, User$tagsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    collections<T extends User$collectionsArgs<ExtArgs> = {}>(args?: Subset<T, User$collectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ownedCollections<T extends User$ownedCollectionsArgs<ExtArgs> = {}>(args?: Subset<T, User$ownedCollectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    collabFolders<T extends User$collabFoldersArgs<ExtArgs> = {}>(args?: Subset<T, User$collabFoldersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FolderCollaboratorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    collabCollections<T extends User$collabCollectionsArgs<ExtArgs> = {}>(args?: Subset<T, User$collabCollectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionCollaboratorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    devices<T extends User$devicesArgs<ExtArgs> = {}>(args?: Subset<T, User$devicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly profileImage: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly lastLogin: FieldRef<"User", 'DateTime'>
    readonly refreshToken: FieldRef<"User", 'String'>
    readonly passwordResetToken: FieldRef<"User", 'String'>
    readonly passwordResetExpires: FieldRef<"User", 'DateTime'>
    readonly isVerified: FieldRef<"User", 'Boolean'>
    readonly verificationToken: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.bookmarks
   */
  export type User$bookmarksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    where?: BookmarkWhereInput
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    cursor?: BookmarkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * User.folders
   */
  export type User$foldersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Folder
     */
    select?: FolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Folder
     */
    omit?: FolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderInclude<ExtArgs> | null
    where?: FolderWhereInput
    orderBy?: FolderOrderByWithRelationInput | FolderOrderByWithRelationInput[]
    cursor?: FolderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FolderScalarFieldEnum | FolderScalarFieldEnum[]
  }

  /**
   * User.tags
   */
  export type User$tagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    where?: TagWhereInput
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    cursor?: TagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * User.collections
   */
  export type User$collectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    where?: CollectionWhereInput
    orderBy?: CollectionOrderByWithRelationInput | CollectionOrderByWithRelationInput[]
    cursor?: CollectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CollectionScalarFieldEnum | CollectionScalarFieldEnum[]
  }

  /**
   * User.ownedCollections
   */
  export type User$ownedCollectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    where?: CollectionWhereInput
    orderBy?: CollectionOrderByWithRelationInput | CollectionOrderByWithRelationInput[]
    cursor?: CollectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CollectionScalarFieldEnum | CollectionScalarFieldEnum[]
  }

  /**
   * User.collabFolders
   */
  export type User$collabFoldersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderCollaborator
     */
    select?: FolderCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderCollaborator
     */
    omit?: FolderCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderCollaboratorInclude<ExtArgs> | null
    where?: FolderCollaboratorWhereInput
    orderBy?: FolderCollaboratorOrderByWithRelationInput | FolderCollaboratorOrderByWithRelationInput[]
    cursor?: FolderCollaboratorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FolderCollaboratorScalarFieldEnum | FolderCollaboratorScalarFieldEnum[]
  }

  /**
   * User.collabCollections
   */
  export type User$collabCollectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionCollaborator
     */
    select?: CollectionCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectionCollaborator
     */
    omit?: CollectionCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionCollaboratorInclude<ExtArgs> | null
    where?: CollectionCollaboratorWhereInput
    orderBy?: CollectionCollaboratorOrderByWithRelationInput | CollectionCollaboratorOrderByWithRelationInput[]
    cursor?: CollectionCollaboratorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CollectionCollaboratorScalarFieldEnum | CollectionCollaboratorScalarFieldEnum[]
  }

  /**
   * User.devices
   */
  export type User$devicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    where?: DeviceWhereInput
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    cursor?: DeviceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Bookmark
   */

  export type AggregateBookmark = {
    _count: BookmarkCountAggregateOutputType | null
    _avg: BookmarkAvgAggregateOutputType | null
    _sum: BookmarkSumAggregateOutputType | null
    _min: BookmarkMinAggregateOutputType | null
    _max: BookmarkMaxAggregateOutputType | null
  }

  export type BookmarkAvgAggregateOutputType = {
    visitCount: number | null
  }

  export type BookmarkSumAggregateOutputType = {
    visitCount: number | null
  }

  export type BookmarkMinAggregateOutputType = {
    id: string | null
    url: string | null
    title: string | null
    description: string | null
    favicon: string | null
    previewImage: string | null
    createdAt: Date | null
    updatedAt: Date | null
    lastVisited: Date | null
    visitCount: number | null
    notes: string | null
    userId: string | null
    isDeleted: boolean | null
    deletedAt: Date | null
  }

  export type BookmarkMaxAggregateOutputType = {
    id: string | null
    url: string | null
    title: string | null
    description: string | null
    favicon: string | null
    previewImage: string | null
    createdAt: Date | null
    updatedAt: Date | null
    lastVisited: Date | null
    visitCount: number | null
    notes: string | null
    userId: string | null
    isDeleted: boolean | null
    deletedAt: Date | null
  }

  export type BookmarkCountAggregateOutputType = {
    id: number
    url: number
    title: number
    description: number
    favicon: number
    previewImage: number
    createdAt: number
    updatedAt: number
    lastVisited: number
    visitCount: number
    notes: number
    userId: number
    isDeleted: number
    deletedAt: number
    _all: number
  }


  export type BookmarkAvgAggregateInputType = {
    visitCount?: true
  }

  export type BookmarkSumAggregateInputType = {
    visitCount?: true
  }

  export type BookmarkMinAggregateInputType = {
    id?: true
    url?: true
    title?: true
    description?: true
    favicon?: true
    previewImage?: true
    createdAt?: true
    updatedAt?: true
    lastVisited?: true
    visitCount?: true
    notes?: true
    userId?: true
    isDeleted?: true
    deletedAt?: true
  }

  export type BookmarkMaxAggregateInputType = {
    id?: true
    url?: true
    title?: true
    description?: true
    favicon?: true
    previewImage?: true
    createdAt?: true
    updatedAt?: true
    lastVisited?: true
    visitCount?: true
    notes?: true
    userId?: true
    isDeleted?: true
    deletedAt?: true
  }

  export type BookmarkCountAggregateInputType = {
    id?: true
    url?: true
    title?: true
    description?: true
    favicon?: true
    previewImage?: true
    createdAt?: true
    updatedAt?: true
    lastVisited?: true
    visitCount?: true
    notes?: true
    userId?: true
    isDeleted?: true
    deletedAt?: true
    _all?: true
  }

  export type BookmarkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bookmark to aggregate.
     */
    where?: BookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookmarks to fetch.
     */
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bookmarks
    **/
    _count?: true | BookmarkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookmarkAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookmarkSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookmarkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookmarkMaxAggregateInputType
  }

  export type GetBookmarkAggregateType<T extends BookmarkAggregateArgs> = {
        [P in keyof T & keyof AggregateBookmark]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookmark[P]>
      : GetScalarType<T[P], AggregateBookmark[P]>
  }




  export type BookmarkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookmarkWhereInput
    orderBy?: BookmarkOrderByWithAggregationInput | BookmarkOrderByWithAggregationInput[]
    by: BookmarkScalarFieldEnum[] | BookmarkScalarFieldEnum
    having?: BookmarkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookmarkCountAggregateInputType | true
    _avg?: BookmarkAvgAggregateInputType
    _sum?: BookmarkSumAggregateInputType
    _min?: BookmarkMinAggregateInputType
    _max?: BookmarkMaxAggregateInputType
  }

  export type BookmarkGroupByOutputType = {
    id: string
    url: string
    title: string
    description: string | null
    favicon: string | null
    previewImage: string | null
    createdAt: Date
    updatedAt: Date
    lastVisited: Date | null
    visitCount: number
    notes: string | null
    userId: string
    isDeleted: boolean
    deletedAt: Date | null
    _count: BookmarkCountAggregateOutputType | null
    _avg: BookmarkAvgAggregateOutputType | null
    _sum: BookmarkSumAggregateOutputType | null
    _min: BookmarkMinAggregateOutputType | null
    _max: BookmarkMaxAggregateOutputType | null
  }

  type GetBookmarkGroupByPayload<T extends BookmarkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookmarkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookmarkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookmarkGroupByOutputType[P]>
            : GetScalarType<T[P], BookmarkGroupByOutputType[P]>
        }
      >
    >


  export type BookmarkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    title?: boolean
    description?: boolean
    favicon?: boolean
    previewImage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastVisited?: boolean
    visitCount?: boolean
    notes?: boolean
    userId?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    folders?: boolean | Bookmark$foldersArgs<ExtArgs>
    tags?: boolean | Bookmark$tagsArgs<ExtArgs>
    collections?: boolean | Bookmark$collectionsArgs<ExtArgs>
    _count?: boolean | BookmarkCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookmark"]>

  export type BookmarkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    title?: boolean
    description?: boolean
    favicon?: boolean
    previewImage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastVisited?: boolean
    visitCount?: boolean
    notes?: boolean
    userId?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookmark"]>

  export type BookmarkSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    title?: boolean
    description?: boolean
    favicon?: boolean
    previewImage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastVisited?: boolean
    visitCount?: boolean
    notes?: boolean
    userId?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookmark"]>

  export type BookmarkSelectScalar = {
    id?: boolean
    url?: boolean
    title?: boolean
    description?: boolean
    favicon?: boolean
    previewImage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastVisited?: boolean
    visitCount?: boolean
    notes?: boolean
    userId?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
  }

  export type BookmarkOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "url" | "title" | "description" | "favicon" | "previewImage" | "createdAt" | "updatedAt" | "lastVisited" | "visitCount" | "notes" | "userId" | "isDeleted" | "deletedAt", ExtArgs["result"]["bookmark"]>
  export type BookmarkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    folders?: boolean | Bookmark$foldersArgs<ExtArgs>
    tags?: boolean | Bookmark$tagsArgs<ExtArgs>
    collections?: boolean | Bookmark$collectionsArgs<ExtArgs>
    _count?: boolean | BookmarkCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BookmarkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type BookmarkIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $BookmarkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Bookmark"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      folders: Prisma.$FolderBookmarkPayload<ExtArgs>[]
      tags: Prisma.$BookmarkTagPayload<ExtArgs>[]
      collections: Prisma.$BookmarkCollectionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      url: string
      title: string
      description: string | null
      favicon: string | null
      previewImage: string | null
      createdAt: Date
      updatedAt: Date
      lastVisited: Date | null
      visitCount: number
      notes: string | null
      userId: string
      isDeleted: boolean
      deletedAt: Date | null
    }, ExtArgs["result"]["bookmark"]>
    composites: {}
  }

  type BookmarkGetPayload<S extends boolean | null | undefined | BookmarkDefaultArgs> = $Result.GetResult<Prisma.$BookmarkPayload, S>

  type BookmarkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BookmarkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookmarkCountAggregateInputType | true
    }

  export interface BookmarkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Bookmark'], meta: { name: 'Bookmark' } }
    /**
     * Find zero or one Bookmark that matches the filter.
     * @param {BookmarkFindUniqueArgs} args - Arguments to find a Bookmark
     * @example
     * // Get one Bookmark
     * const bookmark = await prisma.bookmark.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookmarkFindUniqueArgs>(args: SelectSubset<T, BookmarkFindUniqueArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Bookmark that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookmarkFindUniqueOrThrowArgs} args - Arguments to find a Bookmark
     * @example
     * // Get one Bookmark
     * const bookmark = await prisma.bookmark.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookmarkFindUniqueOrThrowArgs>(args: SelectSubset<T, BookmarkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bookmark that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkFindFirstArgs} args - Arguments to find a Bookmark
     * @example
     * // Get one Bookmark
     * const bookmark = await prisma.bookmark.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookmarkFindFirstArgs>(args?: SelectSubset<T, BookmarkFindFirstArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bookmark that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkFindFirstOrThrowArgs} args - Arguments to find a Bookmark
     * @example
     * // Get one Bookmark
     * const bookmark = await prisma.bookmark.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookmarkFindFirstOrThrowArgs>(args?: SelectSubset<T, BookmarkFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bookmarks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bookmarks
     * const bookmarks = await prisma.bookmark.findMany()
     * 
     * // Get first 10 Bookmarks
     * const bookmarks = await prisma.bookmark.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookmarkWithIdOnly = await prisma.bookmark.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookmarkFindManyArgs>(args?: SelectSubset<T, BookmarkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Bookmark.
     * @param {BookmarkCreateArgs} args - Arguments to create a Bookmark.
     * @example
     * // Create one Bookmark
     * const Bookmark = await prisma.bookmark.create({
     *   data: {
     *     // ... data to create a Bookmark
     *   }
     * })
     * 
     */
    create<T extends BookmarkCreateArgs>(args: SelectSubset<T, BookmarkCreateArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bookmarks.
     * @param {BookmarkCreateManyArgs} args - Arguments to create many Bookmarks.
     * @example
     * // Create many Bookmarks
     * const bookmark = await prisma.bookmark.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookmarkCreateManyArgs>(args?: SelectSubset<T, BookmarkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bookmarks and returns the data saved in the database.
     * @param {BookmarkCreateManyAndReturnArgs} args - Arguments to create many Bookmarks.
     * @example
     * // Create many Bookmarks
     * const bookmark = await prisma.bookmark.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bookmarks and only return the `id`
     * const bookmarkWithIdOnly = await prisma.bookmark.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookmarkCreateManyAndReturnArgs>(args?: SelectSubset<T, BookmarkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Bookmark.
     * @param {BookmarkDeleteArgs} args - Arguments to delete one Bookmark.
     * @example
     * // Delete one Bookmark
     * const Bookmark = await prisma.bookmark.delete({
     *   where: {
     *     // ... filter to delete one Bookmark
     *   }
     * })
     * 
     */
    delete<T extends BookmarkDeleteArgs>(args: SelectSubset<T, BookmarkDeleteArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Bookmark.
     * @param {BookmarkUpdateArgs} args - Arguments to update one Bookmark.
     * @example
     * // Update one Bookmark
     * const bookmark = await prisma.bookmark.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookmarkUpdateArgs>(args: SelectSubset<T, BookmarkUpdateArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bookmarks.
     * @param {BookmarkDeleteManyArgs} args - Arguments to filter Bookmarks to delete.
     * @example
     * // Delete a few Bookmarks
     * const { count } = await prisma.bookmark.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookmarkDeleteManyArgs>(args?: SelectSubset<T, BookmarkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookmarks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bookmarks
     * const bookmark = await prisma.bookmark.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookmarkUpdateManyArgs>(args: SelectSubset<T, BookmarkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookmarks and returns the data updated in the database.
     * @param {BookmarkUpdateManyAndReturnArgs} args - Arguments to update many Bookmarks.
     * @example
     * // Update many Bookmarks
     * const bookmark = await prisma.bookmark.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Bookmarks and only return the `id`
     * const bookmarkWithIdOnly = await prisma.bookmark.updateManyAndReturn({
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
    updateManyAndReturn<T extends BookmarkUpdateManyAndReturnArgs>(args: SelectSubset<T, BookmarkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Bookmark.
     * @param {BookmarkUpsertArgs} args - Arguments to update or create a Bookmark.
     * @example
     * // Update or create a Bookmark
     * const bookmark = await prisma.bookmark.upsert({
     *   create: {
     *     // ... data to create a Bookmark
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bookmark we want to update
     *   }
     * })
     */
    upsert<T extends BookmarkUpsertArgs>(args: SelectSubset<T, BookmarkUpsertArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bookmarks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkCountArgs} args - Arguments to filter Bookmarks to count.
     * @example
     * // Count the number of Bookmarks
     * const count = await prisma.bookmark.count({
     *   where: {
     *     // ... the filter for the Bookmarks we want to count
     *   }
     * })
    **/
    count<T extends BookmarkCountArgs>(
      args?: Subset<T, BookmarkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookmarkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bookmark.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BookmarkAggregateArgs>(args: Subset<T, BookmarkAggregateArgs>): Prisma.PrismaPromise<GetBookmarkAggregateType<T>>

    /**
     * Group by Bookmark.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkGroupByArgs} args - Group by arguments.
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
      T extends BookmarkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookmarkGroupByArgs['orderBy'] }
        : { orderBy?: BookmarkGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BookmarkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookmarkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Bookmark model
   */
  readonly fields: BookmarkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Bookmark.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookmarkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    folders<T extends Bookmark$foldersArgs<ExtArgs> = {}>(args?: Subset<T, Bookmark$foldersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FolderBookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tags<T extends Bookmark$tagsArgs<ExtArgs> = {}>(args?: Subset<T, Bookmark$tagsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    collections<T extends Bookmark$collectionsArgs<ExtArgs> = {}>(args?: Subset<T, Bookmark$collectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkCollectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Bookmark model
   */
  interface BookmarkFieldRefs {
    readonly id: FieldRef<"Bookmark", 'String'>
    readonly url: FieldRef<"Bookmark", 'String'>
    readonly title: FieldRef<"Bookmark", 'String'>
    readonly description: FieldRef<"Bookmark", 'String'>
    readonly favicon: FieldRef<"Bookmark", 'String'>
    readonly previewImage: FieldRef<"Bookmark", 'String'>
    readonly createdAt: FieldRef<"Bookmark", 'DateTime'>
    readonly updatedAt: FieldRef<"Bookmark", 'DateTime'>
    readonly lastVisited: FieldRef<"Bookmark", 'DateTime'>
    readonly visitCount: FieldRef<"Bookmark", 'Int'>
    readonly notes: FieldRef<"Bookmark", 'String'>
    readonly userId: FieldRef<"Bookmark", 'String'>
    readonly isDeleted: FieldRef<"Bookmark", 'Boolean'>
    readonly deletedAt: FieldRef<"Bookmark", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Bookmark findUnique
   */
  export type BookmarkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmark to fetch.
     */
    where: BookmarkWhereUniqueInput
  }

  /**
   * Bookmark findUniqueOrThrow
   */
  export type BookmarkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmark to fetch.
     */
    where: BookmarkWhereUniqueInput
  }

  /**
   * Bookmark findFirst
   */
  export type BookmarkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmark to fetch.
     */
    where?: BookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookmarks to fetch.
     */
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookmarks.
     */
    cursor?: BookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookmarks.
     */
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * Bookmark findFirstOrThrow
   */
  export type BookmarkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmark to fetch.
     */
    where?: BookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookmarks to fetch.
     */
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookmarks.
     */
    cursor?: BookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookmarks.
     */
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * Bookmark findMany
   */
  export type BookmarkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter, which Bookmarks to fetch.
     */
    where?: BookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookmarks to fetch.
     */
    orderBy?: BookmarkOrderByWithRelationInput | BookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bookmarks.
     */
    cursor?: BookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookmarks.
     */
    skip?: number
    distinct?: BookmarkScalarFieldEnum | BookmarkScalarFieldEnum[]
  }

  /**
   * Bookmark create
   */
  export type BookmarkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * The data needed to create a Bookmark.
     */
    data: XOR<BookmarkCreateInput, BookmarkUncheckedCreateInput>
  }

  /**
   * Bookmark createMany
   */
  export type BookmarkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bookmarks.
     */
    data: BookmarkCreateManyInput | BookmarkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Bookmark createManyAndReturn
   */
  export type BookmarkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * The data used to create many Bookmarks.
     */
    data: BookmarkCreateManyInput | BookmarkCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bookmark update
   */
  export type BookmarkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * The data needed to update a Bookmark.
     */
    data: XOR<BookmarkUpdateInput, BookmarkUncheckedUpdateInput>
    /**
     * Choose, which Bookmark to update.
     */
    where: BookmarkWhereUniqueInput
  }

  /**
   * Bookmark updateMany
   */
  export type BookmarkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bookmarks.
     */
    data: XOR<BookmarkUpdateManyMutationInput, BookmarkUncheckedUpdateManyInput>
    /**
     * Filter which Bookmarks to update
     */
    where?: BookmarkWhereInput
    /**
     * Limit how many Bookmarks to update.
     */
    limit?: number
  }

  /**
   * Bookmark updateManyAndReturn
   */
  export type BookmarkUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * The data used to update Bookmarks.
     */
    data: XOR<BookmarkUpdateManyMutationInput, BookmarkUncheckedUpdateManyInput>
    /**
     * Filter which Bookmarks to update
     */
    where?: BookmarkWhereInput
    /**
     * Limit how many Bookmarks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bookmark upsert
   */
  export type BookmarkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * The filter to search for the Bookmark to update in case it exists.
     */
    where: BookmarkWhereUniqueInput
    /**
     * In case the Bookmark found by the `where` argument doesn't exist, create a new Bookmark with this data.
     */
    create: XOR<BookmarkCreateInput, BookmarkUncheckedCreateInput>
    /**
     * In case the Bookmark was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookmarkUpdateInput, BookmarkUncheckedUpdateInput>
  }

  /**
   * Bookmark delete
   */
  export type BookmarkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
    /**
     * Filter which Bookmark to delete.
     */
    where: BookmarkWhereUniqueInput
  }

  /**
   * Bookmark deleteMany
   */
  export type BookmarkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bookmarks to delete
     */
    where?: BookmarkWhereInput
    /**
     * Limit how many Bookmarks to delete.
     */
    limit?: number
  }

  /**
   * Bookmark.folders
   */
  export type Bookmark$foldersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderBookmark
     */
    select?: FolderBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderBookmark
     */
    omit?: FolderBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderBookmarkInclude<ExtArgs> | null
    where?: FolderBookmarkWhereInput
    orderBy?: FolderBookmarkOrderByWithRelationInput | FolderBookmarkOrderByWithRelationInput[]
    cursor?: FolderBookmarkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FolderBookmarkScalarFieldEnum | FolderBookmarkScalarFieldEnum[]
  }

  /**
   * Bookmark.tags
   */
  export type Bookmark$tagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkTag
     */
    select?: BookmarkTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkTag
     */
    omit?: BookmarkTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkTagInclude<ExtArgs> | null
    where?: BookmarkTagWhereInput
    orderBy?: BookmarkTagOrderByWithRelationInput | BookmarkTagOrderByWithRelationInput[]
    cursor?: BookmarkTagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookmarkTagScalarFieldEnum | BookmarkTagScalarFieldEnum[]
  }

  /**
   * Bookmark.collections
   */
  export type Bookmark$collectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkCollection
     */
    select?: BookmarkCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkCollection
     */
    omit?: BookmarkCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkCollectionInclude<ExtArgs> | null
    where?: BookmarkCollectionWhereInput
    orderBy?: BookmarkCollectionOrderByWithRelationInput | BookmarkCollectionOrderByWithRelationInput[]
    cursor?: BookmarkCollectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookmarkCollectionScalarFieldEnum | BookmarkCollectionScalarFieldEnum[]
  }

  /**
   * Bookmark without action
   */
  export type BookmarkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bookmark
     */
    select?: BookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bookmark
     */
    omit?: BookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkInclude<ExtArgs> | null
  }


  /**
   * Model Folder
   */

  export type AggregateFolder = {
    _count: FolderCountAggregateOutputType | null
    _min: FolderMinAggregateOutputType | null
    _max: FolderMaxAggregateOutputType | null
  }

  export type FolderMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    icon: string | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    parentId: string | null
    isDeleted: boolean | null
    deletedAt: Date | null
  }

  export type FolderMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    icon: string | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    parentId: string | null
    isDeleted: boolean | null
    deletedAt: Date | null
  }

  export type FolderCountAggregateOutputType = {
    id: number
    name: number
    description: number
    icon: number
    color: number
    createdAt: number
    updatedAt: number
    userId: number
    parentId: number
    isDeleted: number
    deletedAt: number
    _all: number
  }


  export type FolderMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    icon?: true
    color?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    parentId?: true
    isDeleted?: true
    deletedAt?: true
  }

  export type FolderMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    icon?: true
    color?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    parentId?: true
    isDeleted?: true
    deletedAt?: true
  }

  export type FolderCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    icon?: true
    color?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    parentId?: true
    isDeleted?: true
    deletedAt?: true
    _all?: true
  }

  export type FolderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Folder to aggregate.
     */
    where?: FolderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Folders to fetch.
     */
    orderBy?: FolderOrderByWithRelationInput | FolderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FolderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Folders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Folders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Folders
    **/
    _count?: true | FolderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FolderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FolderMaxAggregateInputType
  }

  export type GetFolderAggregateType<T extends FolderAggregateArgs> = {
        [P in keyof T & keyof AggregateFolder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFolder[P]>
      : GetScalarType<T[P], AggregateFolder[P]>
  }




  export type FolderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FolderWhereInput
    orderBy?: FolderOrderByWithAggregationInput | FolderOrderByWithAggregationInput[]
    by: FolderScalarFieldEnum[] | FolderScalarFieldEnum
    having?: FolderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FolderCountAggregateInputType | true
    _min?: FolderMinAggregateInputType
    _max?: FolderMaxAggregateInputType
  }

  export type FolderGroupByOutputType = {
    id: string
    name: string
    description: string | null
    icon: string | null
    color: string | null
    createdAt: Date
    updatedAt: Date
    userId: string
    parentId: string | null
    isDeleted: boolean
    deletedAt: Date | null
    _count: FolderCountAggregateOutputType | null
    _min: FolderMinAggregateOutputType | null
    _max: FolderMaxAggregateOutputType | null
  }

  type GetFolderGroupByPayload<T extends FolderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FolderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FolderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FolderGroupByOutputType[P]>
            : GetScalarType<T[P], FolderGroupByOutputType[P]>
        }
      >
    >


  export type FolderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    icon?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    parentId?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    parent?: boolean | Folder$parentArgs<ExtArgs>
    children?: boolean | Folder$childrenArgs<ExtArgs>
    bookmarks?: boolean | Folder$bookmarksArgs<ExtArgs>
    collaborators?: boolean | Folder$collaboratorsArgs<ExtArgs>
    _count?: boolean | FolderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["folder"]>

  export type FolderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    icon?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    parentId?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    parent?: boolean | Folder$parentArgs<ExtArgs>
  }, ExtArgs["result"]["folder"]>

  export type FolderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    icon?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    parentId?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    parent?: boolean | Folder$parentArgs<ExtArgs>
  }, ExtArgs["result"]["folder"]>

  export type FolderSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    icon?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    parentId?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
  }

  export type FolderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "icon" | "color" | "createdAt" | "updatedAt" | "userId" | "parentId" | "isDeleted" | "deletedAt", ExtArgs["result"]["folder"]>
  export type FolderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    parent?: boolean | Folder$parentArgs<ExtArgs>
    children?: boolean | Folder$childrenArgs<ExtArgs>
    bookmarks?: boolean | Folder$bookmarksArgs<ExtArgs>
    collaborators?: boolean | Folder$collaboratorsArgs<ExtArgs>
    _count?: boolean | FolderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FolderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    parent?: boolean | Folder$parentArgs<ExtArgs>
  }
  export type FolderIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    parent?: boolean | Folder$parentArgs<ExtArgs>
  }

  export type $FolderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Folder"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      parent: Prisma.$FolderPayload<ExtArgs> | null
      children: Prisma.$FolderPayload<ExtArgs>[]
      bookmarks: Prisma.$FolderBookmarkPayload<ExtArgs>[]
      collaborators: Prisma.$FolderCollaboratorPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      icon: string | null
      color: string | null
      createdAt: Date
      updatedAt: Date
      userId: string
      parentId: string | null
      isDeleted: boolean
      deletedAt: Date | null
    }, ExtArgs["result"]["folder"]>
    composites: {}
  }

  type FolderGetPayload<S extends boolean | null | undefined | FolderDefaultArgs> = $Result.GetResult<Prisma.$FolderPayload, S>

  type FolderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FolderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FolderCountAggregateInputType | true
    }

  export interface FolderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Folder'], meta: { name: 'Folder' } }
    /**
     * Find zero or one Folder that matches the filter.
     * @param {FolderFindUniqueArgs} args - Arguments to find a Folder
     * @example
     * // Get one Folder
     * const folder = await prisma.folder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FolderFindUniqueArgs>(args: SelectSubset<T, FolderFindUniqueArgs<ExtArgs>>): Prisma__FolderClient<$Result.GetResult<Prisma.$FolderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Folder that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FolderFindUniqueOrThrowArgs} args - Arguments to find a Folder
     * @example
     * // Get one Folder
     * const folder = await prisma.folder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FolderFindUniqueOrThrowArgs>(args: SelectSubset<T, FolderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FolderClient<$Result.GetResult<Prisma.$FolderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Folder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderFindFirstArgs} args - Arguments to find a Folder
     * @example
     * // Get one Folder
     * const folder = await prisma.folder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FolderFindFirstArgs>(args?: SelectSubset<T, FolderFindFirstArgs<ExtArgs>>): Prisma__FolderClient<$Result.GetResult<Prisma.$FolderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Folder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderFindFirstOrThrowArgs} args - Arguments to find a Folder
     * @example
     * // Get one Folder
     * const folder = await prisma.folder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FolderFindFirstOrThrowArgs>(args?: SelectSubset<T, FolderFindFirstOrThrowArgs<ExtArgs>>): Prisma__FolderClient<$Result.GetResult<Prisma.$FolderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Folders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Folders
     * const folders = await prisma.folder.findMany()
     * 
     * // Get first 10 Folders
     * const folders = await prisma.folder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const folderWithIdOnly = await prisma.folder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FolderFindManyArgs>(args?: SelectSubset<T, FolderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FolderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Folder.
     * @param {FolderCreateArgs} args - Arguments to create a Folder.
     * @example
     * // Create one Folder
     * const Folder = await prisma.folder.create({
     *   data: {
     *     // ... data to create a Folder
     *   }
     * })
     * 
     */
    create<T extends FolderCreateArgs>(args: SelectSubset<T, FolderCreateArgs<ExtArgs>>): Prisma__FolderClient<$Result.GetResult<Prisma.$FolderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Folders.
     * @param {FolderCreateManyArgs} args - Arguments to create many Folders.
     * @example
     * // Create many Folders
     * const folder = await prisma.folder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FolderCreateManyArgs>(args?: SelectSubset<T, FolderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Folders and returns the data saved in the database.
     * @param {FolderCreateManyAndReturnArgs} args - Arguments to create many Folders.
     * @example
     * // Create many Folders
     * const folder = await prisma.folder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Folders and only return the `id`
     * const folderWithIdOnly = await prisma.folder.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FolderCreateManyAndReturnArgs>(args?: SelectSubset<T, FolderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FolderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Folder.
     * @param {FolderDeleteArgs} args - Arguments to delete one Folder.
     * @example
     * // Delete one Folder
     * const Folder = await prisma.folder.delete({
     *   where: {
     *     // ... filter to delete one Folder
     *   }
     * })
     * 
     */
    delete<T extends FolderDeleteArgs>(args: SelectSubset<T, FolderDeleteArgs<ExtArgs>>): Prisma__FolderClient<$Result.GetResult<Prisma.$FolderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Folder.
     * @param {FolderUpdateArgs} args - Arguments to update one Folder.
     * @example
     * // Update one Folder
     * const folder = await prisma.folder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FolderUpdateArgs>(args: SelectSubset<T, FolderUpdateArgs<ExtArgs>>): Prisma__FolderClient<$Result.GetResult<Prisma.$FolderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Folders.
     * @param {FolderDeleteManyArgs} args - Arguments to filter Folders to delete.
     * @example
     * // Delete a few Folders
     * const { count } = await prisma.folder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FolderDeleteManyArgs>(args?: SelectSubset<T, FolderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Folders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Folders
     * const folder = await prisma.folder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FolderUpdateManyArgs>(args: SelectSubset<T, FolderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Folders and returns the data updated in the database.
     * @param {FolderUpdateManyAndReturnArgs} args - Arguments to update many Folders.
     * @example
     * // Update many Folders
     * const folder = await prisma.folder.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Folders and only return the `id`
     * const folderWithIdOnly = await prisma.folder.updateManyAndReturn({
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
    updateManyAndReturn<T extends FolderUpdateManyAndReturnArgs>(args: SelectSubset<T, FolderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FolderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Folder.
     * @param {FolderUpsertArgs} args - Arguments to update or create a Folder.
     * @example
     * // Update or create a Folder
     * const folder = await prisma.folder.upsert({
     *   create: {
     *     // ... data to create a Folder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Folder we want to update
     *   }
     * })
     */
    upsert<T extends FolderUpsertArgs>(args: SelectSubset<T, FolderUpsertArgs<ExtArgs>>): Prisma__FolderClient<$Result.GetResult<Prisma.$FolderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Folders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderCountArgs} args - Arguments to filter Folders to count.
     * @example
     * // Count the number of Folders
     * const count = await prisma.folder.count({
     *   where: {
     *     // ... the filter for the Folders we want to count
     *   }
     * })
    **/
    count<T extends FolderCountArgs>(
      args?: Subset<T, FolderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FolderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Folder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FolderAggregateArgs>(args: Subset<T, FolderAggregateArgs>): Prisma.PrismaPromise<GetFolderAggregateType<T>>

    /**
     * Group by Folder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderGroupByArgs} args - Group by arguments.
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
      T extends FolderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FolderGroupByArgs['orderBy'] }
        : { orderBy?: FolderGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FolderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFolderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Folder model
   */
  readonly fields: FolderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Folder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FolderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    parent<T extends Folder$parentArgs<ExtArgs> = {}>(args?: Subset<T, Folder$parentArgs<ExtArgs>>): Prisma__FolderClient<$Result.GetResult<Prisma.$FolderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    children<T extends Folder$childrenArgs<ExtArgs> = {}>(args?: Subset<T, Folder$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FolderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    bookmarks<T extends Folder$bookmarksArgs<ExtArgs> = {}>(args?: Subset<T, Folder$bookmarksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FolderBookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    collaborators<T extends Folder$collaboratorsArgs<ExtArgs> = {}>(args?: Subset<T, Folder$collaboratorsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FolderCollaboratorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Folder model
   */
  interface FolderFieldRefs {
    readonly id: FieldRef<"Folder", 'String'>
    readonly name: FieldRef<"Folder", 'String'>
    readonly description: FieldRef<"Folder", 'String'>
    readonly icon: FieldRef<"Folder", 'String'>
    readonly color: FieldRef<"Folder", 'String'>
    readonly createdAt: FieldRef<"Folder", 'DateTime'>
    readonly updatedAt: FieldRef<"Folder", 'DateTime'>
    readonly userId: FieldRef<"Folder", 'String'>
    readonly parentId: FieldRef<"Folder", 'String'>
    readonly isDeleted: FieldRef<"Folder", 'Boolean'>
    readonly deletedAt: FieldRef<"Folder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Folder findUnique
   */
  export type FolderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Folder
     */
    select?: FolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Folder
     */
    omit?: FolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderInclude<ExtArgs> | null
    /**
     * Filter, which Folder to fetch.
     */
    where: FolderWhereUniqueInput
  }

  /**
   * Folder findUniqueOrThrow
   */
  export type FolderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Folder
     */
    select?: FolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Folder
     */
    omit?: FolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderInclude<ExtArgs> | null
    /**
     * Filter, which Folder to fetch.
     */
    where: FolderWhereUniqueInput
  }

  /**
   * Folder findFirst
   */
  export type FolderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Folder
     */
    select?: FolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Folder
     */
    omit?: FolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderInclude<ExtArgs> | null
    /**
     * Filter, which Folder to fetch.
     */
    where?: FolderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Folders to fetch.
     */
    orderBy?: FolderOrderByWithRelationInput | FolderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Folders.
     */
    cursor?: FolderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Folders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Folders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Folders.
     */
    distinct?: FolderScalarFieldEnum | FolderScalarFieldEnum[]
  }

  /**
   * Folder findFirstOrThrow
   */
  export type FolderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Folder
     */
    select?: FolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Folder
     */
    omit?: FolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderInclude<ExtArgs> | null
    /**
     * Filter, which Folder to fetch.
     */
    where?: FolderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Folders to fetch.
     */
    orderBy?: FolderOrderByWithRelationInput | FolderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Folders.
     */
    cursor?: FolderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Folders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Folders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Folders.
     */
    distinct?: FolderScalarFieldEnum | FolderScalarFieldEnum[]
  }

  /**
   * Folder findMany
   */
  export type FolderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Folder
     */
    select?: FolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Folder
     */
    omit?: FolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderInclude<ExtArgs> | null
    /**
     * Filter, which Folders to fetch.
     */
    where?: FolderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Folders to fetch.
     */
    orderBy?: FolderOrderByWithRelationInput | FolderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Folders.
     */
    cursor?: FolderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Folders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Folders.
     */
    skip?: number
    distinct?: FolderScalarFieldEnum | FolderScalarFieldEnum[]
  }

  /**
   * Folder create
   */
  export type FolderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Folder
     */
    select?: FolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Folder
     */
    omit?: FolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderInclude<ExtArgs> | null
    /**
     * The data needed to create a Folder.
     */
    data: XOR<FolderCreateInput, FolderUncheckedCreateInput>
  }

  /**
   * Folder createMany
   */
  export type FolderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Folders.
     */
    data: FolderCreateManyInput | FolderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Folder createManyAndReturn
   */
  export type FolderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Folder
     */
    select?: FolderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Folder
     */
    omit?: FolderOmit<ExtArgs> | null
    /**
     * The data used to create many Folders.
     */
    data: FolderCreateManyInput | FolderCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Folder update
   */
  export type FolderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Folder
     */
    select?: FolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Folder
     */
    omit?: FolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderInclude<ExtArgs> | null
    /**
     * The data needed to update a Folder.
     */
    data: XOR<FolderUpdateInput, FolderUncheckedUpdateInput>
    /**
     * Choose, which Folder to update.
     */
    where: FolderWhereUniqueInput
  }

  /**
   * Folder updateMany
   */
  export type FolderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Folders.
     */
    data: XOR<FolderUpdateManyMutationInput, FolderUncheckedUpdateManyInput>
    /**
     * Filter which Folders to update
     */
    where?: FolderWhereInput
    /**
     * Limit how many Folders to update.
     */
    limit?: number
  }

  /**
   * Folder updateManyAndReturn
   */
  export type FolderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Folder
     */
    select?: FolderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Folder
     */
    omit?: FolderOmit<ExtArgs> | null
    /**
     * The data used to update Folders.
     */
    data: XOR<FolderUpdateManyMutationInput, FolderUncheckedUpdateManyInput>
    /**
     * Filter which Folders to update
     */
    where?: FolderWhereInput
    /**
     * Limit how many Folders to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Folder upsert
   */
  export type FolderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Folder
     */
    select?: FolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Folder
     */
    omit?: FolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderInclude<ExtArgs> | null
    /**
     * The filter to search for the Folder to update in case it exists.
     */
    where: FolderWhereUniqueInput
    /**
     * In case the Folder found by the `where` argument doesn't exist, create a new Folder with this data.
     */
    create: XOR<FolderCreateInput, FolderUncheckedCreateInput>
    /**
     * In case the Folder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FolderUpdateInput, FolderUncheckedUpdateInput>
  }

  /**
   * Folder delete
   */
  export type FolderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Folder
     */
    select?: FolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Folder
     */
    omit?: FolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderInclude<ExtArgs> | null
    /**
     * Filter which Folder to delete.
     */
    where: FolderWhereUniqueInput
  }

  /**
   * Folder deleteMany
   */
  export type FolderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Folders to delete
     */
    where?: FolderWhereInput
    /**
     * Limit how many Folders to delete.
     */
    limit?: number
  }

  /**
   * Folder.parent
   */
  export type Folder$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Folder
     */
    select?: FolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Folder
     */
    omit?: FolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderInclude<ExtArgs> | null
    where?: FolderWhereInput
  }

  /**
   * Folder.children
   */
  export type Folder$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Folder
     */
    select?: FolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Folder
     */
    omit?: FolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderInclude<ExtArgs> | null
    where?: FolderWhereInput
    orderBy?: FolderOrderByWithRelationInput | FolderOrderByWithRelationInput[]
    cursor?: FolderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FolderScalarFieldEnum | FolderScalarFieldEnum[]
  }

  /**
   * Folder.bookmarks
   */
  export type Folder$bookmarksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderBookmark
     */
    select?: FolderBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderBookmark
     */
    omit?: FolderBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderBookmarkInclude<ExtArgs> | null
    where?: FolderBookmarkWhereInput
    orderBy?: FolderBookmarkOrderByWithRelationInput | FolderBookmarkOrderByWithRelationInput[]
    cursor?: FolderBookmarkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FolderBookmarkScalarFieldEnum | FolderBookmarkScalarFieldEnum[]
  }

  /**
   * Folder.collaborators
   */
  export type Folder$collaboratorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderCollaborator
     */
    select?: FolderCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderCollaborator
     */
    omit?: FolderCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderCollaboratorInclude<ExtArgs> | null
    where?: FolderCollaboratorWhereInput
    orderBy?: FolderCollaboratorOrderByWithRelationInput | FolderCollaboratorOrderByWithRelationInput[]
    cursor?: FolderCollaboratorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FolderCollaboratorScalarFieldEnum | FolderCollaboratorScalarFieldEnum[]
  }

  /**
   * Folder without action
   */
  export type FolderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Folder
     */
    select?: FolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Folder
     */
    omit?: FolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderInclude<ExtArgs> | null
  }


  /**
   * Model FolderBookmark
   */

  export type AggregateFolderBookmark = {
    _count: FolderBookmarkCountAggregateOutputType | null
    _min: FolderBookmarkMinAggregateOutputType | null
    _max: FolderBookmarkMaxAggregateOutputType | null
  }

  export type FolderBookmarkMinAggregateOutputType = {
    folderId: string | null
    bookmarkId: string | null
    addedAt: Date | null
  }

  export type FolderBookmarkMaxAggregateOutputType = {
    folderId: string | null
    bookmarkId: string | null
    addedAt: Date | null
  }

  export type FolderBookmarkCountAggregateOutputType = {
    folderId: number
    bookmarkId: number
    addedAt: number
    _all: number
  }


  export type FolderBookmarkMinAggregateInputType = {
    folderId?: true
    bookmarkId?: true
    addedAt?: true
  }

  export type FolderBookmarkMaxAggregateInputType = {
    folderId?: true
    bookmarkId?: true
    addedAt?: true
  }

  export type FolderBookmarkCountAggregateInputType = {
    folderId?: true
    bookmarkId?: true
    addedAt?: true
    _all?: true
  }

  export type FolderBookmarkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FolderBookmark to aggregate.
     */
    where?: FolderBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FolderBookmarks to fetch.
     */
    orderBy?: FolderBookmarkOrderByWithRelationInput | FolderBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FolderBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FolderBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FolderBookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FolderBookmarks
    **/
    _count?: true | FolderBookmarkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FolderBookmarkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FolderBookmarkMaxAggregateInputType
  }

  export type GetFolderBookmarkAggregateType<T extends FolderBookmarkAggregateArgs> = {
        [P in keyof T & keyof AggregateFolderBookmark]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFolderBookmark[P]>
      : GetScalarType<T[P], AggregateFolderBookmark[P]>
  }




  export type FolderBookmarkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FolderBookmarkWhereInput
    orderBy?: FolderBookmarkOrderByWithAggregationInput | FolderBookmarkOrderByWithAggregationInput[]
    by: FolderBookmarkScalarFieldEnum[] | FolderBookmarkScalarFieldEnum
    having?: FolderBookmarkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FolderBookmarkCountAggregateInputType | true
    _min?: FolderBookmarkMinAggregateInputType
    _max?: FolderBookmarkMaxAggregateInputType
  }

  export type FolderBookmarkGroupByOutputType = {
    folderId: string
    bookmarkId: string
    addedAt: Date
    _count: FolderBookmarkCountAggregateOutputType | null
    _min: FolderBookmarkMinAggregateOutputType | null
    _max: FolderBookmarkMaxAggregateOutputType | null
  }

  type GetFolderBookmarkGroupByPayload<T extends FolderBookmarkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FolderBookmarkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FolderBookmarkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FolderBookmarkGroupByOutputType[P]>
            : GetScalarType<T[P], FolderBookmarkGroupByOutputType[P]>
        }
      >
    >


  export type FolderBookmarkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    folderId?: boolean
    bookmarkId?: boolean
    addedAt?: boolean
    folder?: boolean | FolderDefaultArgs<ExtArgs>
    bookmark?: boolean | BookmarkDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["folderBookmark"]>

  export type FolderBookmarkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    folderId?: boolean
    bookmarkId?: boolean
    addedAt?: boolean
    folder?: boolean | FolderDefaultArgs<ExtArgs>
    bookmark?: boolean | BookmarkDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["folderBookmark"]>

  export type FolderBookmarkSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    folderId?: boolean
    bookmarkId?: boolean
    addedAt?: boolean
    folder?: boolean | FolderDefaultArgs<ExtArgs>
    bookmark?: boolean | BookmarkDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["folderBookmark"]>

  export type FolderBookmarkSelectScalar = {
    folderId?: boolean
    bookmarkId?: boolean
    addedAt?: boolean
  }

  export type FolderBookmarkOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"folderId" | "bookmarkId" | "addedAt", ExtArgs["result"]["folderBookmark"]>
  export type FolderBookmarkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    folder?: boolean | FolderDefaultArgs<ExtArgs>
    bookmark?: boolean | BookmarkDefaultArgs<ExtArgs>
  }
  export type FolderBookmarkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    folder?: boolean | FolderDefaultArgs<ExtArgs>
    bookmark?: boolean | BookmarkDefaultArgs<ExtArgs>
  }
  export type FolderBookmarkIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    folder?: boolean | FolderDefaultArgs<ExtArgs>
    bookmark?: boolean | BookmarkDefaultArgs<ExtArgs>
  }

  export type $FolderBookmarkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FolderBookmark"
    objects: {
      folder: Prisma.$FolderPayload<ExtArgs>
      bookmark: Prisma.$BookmarkPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      folderId: string
      bookmarkId: string
      addedAt: Date
    }, ExtArgs["result"]["folderBookmark"]>
    composites: {}
  }

  type FolderBookmarkGetPayload<S extends boolean | null | undefined | FolderBookmarkDefaultArgs> = $Result.GetResult<Prisma.$FolderBookmarkPayload, S>

  type FolderBookmarkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FolderBookmarkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FolderBookmarkCountAggregateInputType | true
    }

  export interface FolderBookmarkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FolderBookmark'], meta: { name: 'FolderBookmark' } }
    /**
     * Find zero or one FolderBookmark that matches the filter.
     * @param {FolderBookmarkFindUniqueArgs} args - Arguments to find a FolderBookmark
     * @example
     * // Get one FolderBookmark
     * const folderBookmark = await prisma.folderBookmark.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FolderBookmarkFindUniqueArgs>(args: SelectSubset<T, FolderBookmarkFindUniqueArgs<ExtArgs>>): Prisma__FolderBookmarkClient<$Result.GetResult<Prisma.$FolderBookmarkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FolderBookmark that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FolderBookmarkFindUniqueOrThrowArgs} args - Arguments to find a FolderBookmark
     * @example
     * // Get one FolderBookmark
     * const folderBookmark = await prisma.folderBookmark.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FolderBookmarkFindUniqueOrThrowArgs>(args: SelectSubset<T, FolderBookmarkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FolderBookmarkClient<$Result.GetResult<Prisma.$FolderBookmarkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FolderBookmark that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderBookmarkFindFirstArgs} args - Arguments to find a FolderBookmark
     * @example
     * // Get one FolderBookmark
     * const folderBookmark = await prisma.folderBookmark.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FolderBookmarkFindFirstArgs>(args?: SelectSubset<T, FolderBookmarkFindFirstArgs<ExtArgs>>): Prisma__FolderBookmarkClient<$Result.GetResult<Prisma.$FolderBookmarkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FolderBookmark that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderBookmarkFindFirstOrThrowArgs} args - Arguments to find a FolderBookmark
     * @example
     * // Get one FolderBookmark
     * const folderBookmark = await prisma.folderBookmark.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FolderBookmarkFindFirstOrThrowArgs>(args?: SelectSubset<T, FolderBookmarkFindFirstOrThrowArgs<ExtArgs>>): Prisma__FolderBookmarkClient<$Result.GetResult<Prisma.$FolderBookmarkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FolderBookmarks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderBookmarkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FolderBookmarks
     * const folderBookmarks = await prisma.folderBookmark.findMany()
     * 
     * // Get first 10 FolderBookmarks
     * const folderBookmarks = await prisma.folderBookmark.findMany({ take: 10 })
     * 
     * // Only select the `folderId`
     * const folderBookmarkWithFolderIdOnly = await prisma.folderBookmark.findMany({ select: { folderId: true } })
     * 
     */
    findMany<T extends FolderBookmarkFindManyArgs>(args?: SelectSubset<T, FolderBookmarkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FolderBookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FolderBookmark.
     * @param {FolderBookmarkCreateArgs} args - Arguments to create a FolderBookmark.
     * @example
     * // Create one FolderBookmark
     * const FolderBookmark = await prisma.folderBookmark.create({
     *   data: {
     *     // ... data to create a FolderBookmark
     *   }
     * })
     * 
     */
    create<T extends FolderBookmarkCreateArgs>(args: SelectSubset<T, FolderBookmarkCreateArgs<ExtArgs>>): Prisma__FolderBookmarkClient<$Result.GetResult<Prisma.$FolderBookmarkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FolderBookmarks.
     * @param {FolderBookmarkCreateManyArgs} args - Arguments to create many FolderBookmarks.
     * @example
     * // Create many FolderBookmarks
     * const folderBookmark = await prisma.folderBookmark.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FolderBookmarkCreateManyArgs>(args?: SelectSubset<T, FolderBookmarkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FolderBookmarks and returns the data saved in the database.
     * @param {FolderBookmarkCreateManyAndReturnArgs} args - Arguments to create many FolderBookmarks.
     * @example
     * // Create many FolderBookmarks
     * const folderBookmark = await prisma.folderBookmark.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FolderBookmarks and only return the `folderId`
     * const folderBookmarkWithFolderIdOnly = await prisma.folderBookmark.createManyAndReturn({
     *   select: { folderId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FolderBookmarkCreateManyAndReturnArgs>(args?: SelectSubset<T, FolderBookmarkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FolderBookmarkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FolderBookmark.
     * @param {FolderBookmarkDeleteArgs} args - Arguments to delete one FolderBookmark.
     * @example
     * // Delete one FolderBookmark
     * const FolderBookmark = await prisma.folderBookmark.delete({
     *   where: {
     *     // ... filter to delete one FolderBookmark
     *   }
     * })
     * 
     */
    delete<T extends FolderBookmarkDeleteArgs>(args: SelectSubset<T, FolderBookmarkDeleteArgs<ExtArgs>>): Prisma__FolderBookmarkClient<$Result.GetResult<Prisma.$FolderBookmarkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FolderBookmark.
     * @param {FolderBookmarkUpdateArgs} args - Arguments to update one FolderBookmark.
     * @example
     * // Update one FolderBookmark
     * const folderBookmark = await prisma.folderBookmark.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FolderBookmarkUpdateArgs>(args: SelectSubset<T, FolderBookmarkUpdateArgs<ExtArgs>>): Prisma__FolderBookmarkClient<$Result.GetResult<Prisma.$FolderBookmarkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FolderBookmarks.
     * @param {FolderBookmarkDeleteManyArgs} args - Arguments to filter FolderBookmarks to delete.
     * @example
     * // Delete a few FolderBookmarks
     * const { count } = await prisma.folderBookmark.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FolderBookmarkDeleteManyArgs>(args?: SelectSubset<T, FolderBookmarkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FolderBookmarks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderBookmarkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FolderBookmarks
     * const folderBookmark = await prisma.folderBookmark.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FolderBookmarkUpdateManyArgs>(args: SelectSubset<T, FolderBookmarkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FolderBookmarks and returns the data updated in the database.
     * @param {FolderBookmarkUpdateManyAndReturnArgs} args - Arguments to update many FolderBookmarks.
     * @example
     * // Update many FolderBookmarks
     * const folderBookmark = await prisma.folderBookmark.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FolderBookmarks and only return the `folderId`
     * const folderBookmarkWithFolderIdOnly = await prisma.folderBookmark.updateManyAndReturn({
     *   select: { folderId: true },
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
    updateManyAndReturn<T extends FolderBookmarkUpdateManyAndReturnArgs>(args: SelectSubset<T, FolderBookmarkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FolderBookmarkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FolderBookmark.
     * @param {FolderBookmarkUpsertArgs} args - Arguments to update or create a FolderBookmark.
     * @example
     * // Update or create a FolderBookmark
     * const folderBookmark = await prisma.folderBookmark.upsert({
     *   create: {
     *     // ... data to create a FolderBookmark
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FolderBookmark we want to update
     *   }
     * })
     */
    upsert<T extends FolderBookmarkUpsertArgs>(args: SelectSubset<T, FolderBookmarkUpsertArgs<ExtArgs>>): Prisma__FolderBookmarkClient<$Result.GetResult<Prisma.$FolderBookmarkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FolderBookmarks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderBookmarkCountArgs} args - Arguments to filter FolderBookmarks to count.
     * @example
     * // Count the number of FolderBookmarks
     * const count = await prisma.folderBookmark.count({
     *   where: {
     *     // ... the filter for the FolderBookmarks we want to count
     *   }
     * })
    **/
    count<T extends FolderBookmarkCountArgs>(
      args?: Subset<T, FolderBookmarkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FolderBookmarkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FolderBookmark.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderBookmarkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FolderBookmarkAggregateArgs>(args: Subset<T, FolderBookmarkAggregateArgs>): Prisma.PrismaPromise<GetFolderBookmarkAggregateType<T>>

    /**
     * Group by FolderBookmark.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderBookmarkGroupByArgs} args - Group by arguments.
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
      T extends FolderBookmarkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FolderBookmarkGroupByArgs['orderBy'] }
        : { orderBy?: FolderBookmarkGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FolderBookmarkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFolderBookmarkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FolderBookmark model
   */
  readonly fields: FolderBookmarkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FolderBookmark.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FolderBookmarkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    folder<T extends FolderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FolderDefaultArgs<ExtArgs>>): Prisma__FolderClient<$Result.GetResult<Prisma.$FolderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    bookmark<T extends BookmarkDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BookmarkDefaultArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the FolderBookmark model
   */
  interface FolderBookmarkFieldRefs {
    readonly folderId: FieldRef<"FolderBookmark", 'String'>
    readonly bookmarkId: FieldRef<"FolderBookmark", 'String'>
    readonly addedAt: FieldRef<"FolderBookmark", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FolderBookmark findUnique
   */
  export type FolderBookmarkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderBookmark
     */
    select?: FolderBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderBookmark
     */
    omit?: FolderBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderBookmarkInclude<ExtArgs> | null
    /**
     * Filter, which FolderBookmark to fetch.
     */
    where: FolderBookmarkWhereUniqueInput
  }

  /**
   * FolderBookmark findUniqueOrThrow
   */
  export type FolderBookmarkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderBookmark
     */
    select?: FolderBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderBookmark
     */
    omit?: FolderBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderBookmarkInclude<ExtArgs> | null
    /**
     * Filter, which FolderBookmark to fetch.
     */
    where: FolderBookmarkWhereUniqueInput
  }

  /**
   * FolderBookmark findFirst
   */
  export type FolderBookmarkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderBookmark
     */
    select?: FolderBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderBookmark
     */
    omit?: FolderBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderBookmarkInclude<ExtArgs> | null
    /**
     * Filter, which FolderBookmark to fetch.
     */
    where?: FolderBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FolderBookmarks to fetch.
     */
    orderBy?: FolderBookmarkOrderByWithRelationInput | FolderBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FolderBookmarks.
     */
    cursor?: FolderBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FolderBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FolderBookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FolderBookmarks.
     */
    distinct?: FolderBookmarkScalarFieldEnum | FolderBookmarkScalarFieldEnum[]
  }

  /**
   * FolderBookmark findFirstOrThrow
   */
  export type FolderBookmarkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderBookmark
     */
    select?: FolderBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderBookmark
     */
    omit?: FolderBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderBookmarkInclude<ExtArgs> | null
    /**
     * Filter, which FolderBookmark to fetch.
     */
    where?: FolderBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FolderBookmarks to fetch.
     */
    orderBy?: FolderBookmarkOrderByWithRelationInput | FolderBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FolderBookmarks.
     */
    cursor?: FolderBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FolderBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FolderBookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FolderBookmarks.
     */
    distinct?: FolderBookmarkScalarFieldEnum | FolderBookmarkScalarFieldEnum[]
  }

  /**
   * FolderBookmark findMany
   */
  export type FolderBookmarkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderBookmark
     */
    select?: FolderBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderBookmark
     */
    omit?: FolderBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderBookmarkInclude<ExtArgs> | null
    /**
     * Filter, which FolderBookmarks to fetch.
     */
    where?: FolderBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FolderBookmarks to fetch.
     */
    orderBy?: FolderBookmarkOrderByWithRelationInput | FolderBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FolderBookmarks.
     */
    cursor?: FolderBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FolderBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FolderBookmarks.
     */
    skip?: number
    distinct?: FolderBookmarkScalarFieldEnum | FolderBookmarkScalarFieldEnum[]
  }

  /**
   * FolderBookmark create
   */
  export type FolderBookmarkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderBookmark
     */
    select?: FolderBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderBookmark
     */
    omit?: FolderBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderBookmarkInclude<ExtArgs> | null
    /**
     * The data needed to create a FolderBookmark.
     */
    data: XOR<FolderBookmarkCreateInput, FolderBookmarkUncheckedCreateInput>
  }

  /**
   * FolderBookmark createMany
   */
  export type FolderBookmarkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FolderBookmarks.
     */
    data: FolderBookmarkCreateManyInput | FolderBookmarkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FolderBookmark createManyAndReturn
   */
  export type FolderBookmarkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderBookmark
     */
    select?: FolderBookmarkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FolderBookmark
     */
    omit?: FolderBookmarkOmit<ExtArgs> | null
    /**
     * The data used to create many FolderBookmarks.
     */
    data: FolderBookmarkCreateManyInput | FolderBookmarkCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderBookmarkIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FolderBookmark update
   */
  export type FolderBookmarkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderBookmark
     */
    select?: FolderBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderBookmark
     */
    omit?: FolderBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderBookmarkInclude<ExtArgs> | null
    /**
     * The data needed to update a FolderBookmark.
     */
    data: XOR<FolderBookmarkUpdateInput, FolderBookmarkUncheckedUpdateInput>
    /**
     * Choose, which FolderBookmark to update.
     */
    where: FolderBookmarkWhereUniqueInput
  }

  /**
   * FolderBookmark updateMany
   */
  export type FolderBookmarkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FolderBookmarks.
     */
    data: XOR<FolderBookmarkUpdateManyMutationInput, FolderBookmarkUncheckedUpdateManyInput>
    /**
     * Filter which FolderBookmarks to update
     */
    where?: FolderBookmarkWhereInput
    /**
     * Limit how many FolderBookmarks to update.
     */
    limit?: number
  }

  /**
   * FolderBookmark updateManyAndReturn
   */
  export type FolderBookmarkUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderBookmark
     */
    select?: FolderBookmarkSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FolderBookmark
     */
    omit?: FolderBookmarkOmit<ExtArgs> | null
    /**
     * The data used to update FolderBookmarks.
     */
    data: XOR<FolderBookmarkUpdateManyMutationInput, FolderBookmarkUncheckedUpdateManyInput>
    /**
     * Filter which FolderBookmarks to update
     */
    where?: FolderBookmarkWhereInput
    /**
     * Limit how many FolderBookmarks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderBookmarkIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FolderBookmark upsert
   */
  export type FolderBookmarkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderBookmark
     */
    select?: FolderBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderBookmark
     */
    omit?: FolderBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderBookmarkInclude<ExtArgs> | null
    /**
     * The filter to search for the FolderBookmark to update in case it exists.
     */
    where: FolderBookmarkWhereUniqueInput
    /**
     * In case the FolderBookmark found by the `where` argument doesn't exist, create a new FolderBookmark with this data.
     */
    create: XOR<FolderBookmarkCreateInput, FolderBookmarkUncheckedCreateInput>
    /**
     * In case the FolderBookmark was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FolderBookmarkUpdateInput, FolderBookmarkUncheckedUpdateInput>
  }

  /**
   * FolderBookmark delete
   */
  export type FolderBookmarkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderBookmark
     */
    select?: FolderBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderBookmark
     */
    omit?: FolderBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderBookmarkInclude<ExtArgs> | null
    /**
     * Filter which FolderBookmark to delete.
     */
    where: FolderBookmarkWhereUniqueInput
  }

  /**
   * FolderBookmark deleteMany
   */
  export type FolderBookmarkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FolderBookmarks to delete
     */
    where?: FolderBookmarkWhereInput
    /**
     * Limit how many FolderBookmarks to delete.
     */
    limit?: number
  }

  /**
   * FolderBookmark without action
   */
  export type FolderBookmarkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderBookmark
     */
    select?: FolderBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderBookmark
     */
    omit?: FolderBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderBookmarkInclude<ExtArgs> | null
  }


  /**
   * Model FolderCollaborator
   */

  export type AggregateFolderCollaborator = {
    _count: FolderCollaboratorCountAggregateOutputType | null
    _min: FolderCollaboratorMinAggregateOutputType | null
    _max: FolderCollaboratorMaxAggregateOutputType | null
  }

  export type FolderCollaboratorMinAggregateOutputType = {
    folderId: string | null
    userId: string | null
    permission: $Enums.Role | null
    addedAt: Date | null
  }

  export type FolderCollaboratorMaxAggregateOutputType = {
    folderId: string | null
    userId: string | null
    permission: $Enums.Role | null
    addedAt: Date | null
  }

  export type FolderCollaboratorCountAggregateOutputType = {
    folderId: number
    userId: number
    permission: number
    addedAt: number
    _all: number
  }


  export type FolderCollaboratorMinAggregateInputType = {
    folderId?: true
    userId?: true
    permission?: true
    addedAt?: true
  }

  export type FolderCollaboratorMaxAggregateInputType = {
    folderId?: true
    userId?: true
    permission?: true
    addedAt?: true
  }

  export type FolderCollaboratorCountAggregateInputType = {
    folderId?: true
    userId?: true
    permission?: true
    addedAt?: true
    _all?: true
  }

  export type FolderCollaboratorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FolderCollaborator to aggregate.
     */
    where?: FolderCollaboratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FolderCollaborators to fetch.
     */
    orderBy?: FolderCollaboratorOrderByWithRelationInput | FolderCollaboratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FolderCollaboratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FolderCollaborators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FolderCollaborators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FolderCollaborators
    **/
    _count?: true | FolderCollaboratorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FolderCollaboratorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FolderCollaboratorMaxAggregateInputType
  }

  export type GetFolderCollaboratorAggregateType<T extends FolderCollaboratorAggregateArgs> = {
        [P in keyof T & keyof AggregateFolderCollaborator]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFolderCollaborator[P]>
      : GetScalarType<T[P], AggregateFolderCollaborator[P]>
  }




  export type FolderCollaboratorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FolderCollaboratorWhereInput
    orderBy?: FolderCollaboratorOrderByWithAggregationInput | FolderCollaboratorOrderByWithAggregationInput[]
    by: FolderCollaboratorScalarFieldEnum[] | FolderCollaboratorScalarFieldEnum
    having?: FolderCollaboratorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FolderCollaboratorCountAggregateInputType | true
    _min?: FolderCollaboratorMinAggregateInputType
    _max?: FolderCollaboratorMaxAggregateInputType
  }

  export type FolderCollaboratorGroupByOutputType = {
    folderId: string
    userId: string
    permission: $Enums.Role
    addedAt: Date
    _count: FolderCollaboratorCountAggregateOutputType | null
    _min: FolderCollaboratorMinAggregateOutputType | null
    _max: FolderCollaboratorMaxAggregateOutputType | null
  }

  type GetFolderCollaboratorGroupByPayload<T extends FolderCollaboratorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FolderCollaboratorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FolderCollaboratorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FolderCollaboratorGroupByOutputType[P]>
            : GetScalarType<T[P], FolderCollaboratorGroupByOutputType[P]>
        }
      >
    >


  export type FolderCollaboratorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    folderId?: boolean
    userId?: boolean
    permission?: boolean
    addedAt?: boolean
    folder?: boolean | FolderDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["folderCollaborator"]>

  export type FolderCollaboratorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    folderId?: boolean
    userId?: boolean
    permission?: boolean
    addedAt?: boolean
    folder?: boolean | FolderDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["folderCollaborator"]>

  export type FolderCollaboratorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    folderId?: boolean
    userId?: boolean
    permission?: boolean
    addedAt?: boolean
    folder?: boolean | FolderDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["folderCollaborator"]>

  export type FolderCollaboratorSelectScalar = {
    folderId?: boolean
    userId?: boolean
    permission?: boolean
    addedAt?: boolean
  }

  export type FolderCollaboratorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"folderId" | "userId" | "permission" | "addedAt", ExtArgs["result"]["folderCollaborator"]>
  export type FolderCollaboratorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    folder?: boolean | FolderDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FolderCollaboratorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    folder?: boolean | FolderDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FolderCollaboratorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    folder?: boolean | FolderDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FolderCollaboratorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FolderCollaborator"
    objects: {
      folder: Prisma.$FolderPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      folderId: string
      userId: string
      permission: $Enums.Role
      addedAt: Date
    }, ExtArgs["result"]["folderCollaborator"]>
    composites: {}
  }

  type FolderCollaboratorGetPayload<S extends boolean | null | undefined | FolderCollaboratorDefaultArgs> = $Result.GetResult<Prisma.$FolderCollaboratorPayload, S>

  type FolderCollaboratorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FolderCollaboratorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FolderCollaboratorCountAggregateInputType | true
    }

  export interface FolderCollaboratorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FolderCollaborator'], meta: { name: 'FolderCollaborator' } }
    /**
     * Find zero or one FolderCollaborator that matches the filter.
     * @param {FolderCollaboratorFindUniqueArgs} args - Arguments to find a FolderCollaborator
     * @example
     * // Get one FolderCollaborator
     * const folderCollaborator = await prisma.folderCollaborator.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FolderCollaboratorFindUniqueArgs>(args: SelectSubset<T, FolderCollaboratorFindUniqueArgs<ExtArgs>>): Prisma__FolderCollaboratorClient<$Result.GetResult<Prisma.$FolderCollaboratorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FolderCollaborator that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FolderCollaboratorFindUniqueOrThrowArgs} args - Arguments to find a FolderCollaborator
     * @example
     * // Get one FolderCollaborator
     * const folderCollaborator = await prisma.folderCollaborator.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FolderCollaboratorFindUniqueOrThrowArgs>(args: SelectSubset<T, FolderCollaboratorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FolderCollaboratorClient<$Result.GetResult<Prisma.$FolderCollaboratorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FolderCollaborator that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderCollaboratorFindFirstArgs} args - Arguments to find a FolderCollaborator
     * @example
     * // Get one FolderCollaborator
     * const folderCollaborator = await prisma.folderCollaborator.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FolderCollaboratorFindFirstArgs>(args?: SelectSubset<T, FolderCollaboratorFindFirstArgs<ExtArgs>>): Prisma__FolderCollaboratorClient<$Result.GetResult<Prisma.$FolderCollaboratorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FolderCollaborator that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderCollaboratorFindFirstOrThrowArgs} args - Arguments to find a FolderCollaborator
     * @example
     * // Get one FolderCollaborator
     * const folderCollaborator = await prisma.folderCollaborator.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FolderCollaboratorFindFirstOrThrowArgs>(args?: SelectSubset<T, FolderCollaboratorFindFirstOrThrowArgs<ExtArgs>>): Prisma__FolderCollaboratorClient<$Result.GetResult<Prisma.$FolderCollaboratorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FolderCollaborators that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderCollaboratorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FolderCollaborators
     * const folderCollaborators = await prisma.folderCollaborator.findMany()
     * 
     * // Get first 10 FolderCollaborators
     * const folderCollaborators = await prisma.folderCollaborator.findMany({ take: 10 })
     * 
     * // Only select the `folderId`
     * const folderCollaboratorWithFolderIdOnly = await prisma.folderCollaborator.findMany({ select: { folderId: true } })
     * 
     */
    findMany<T extends FolderCollaboratorFindManyArgs>(args?: SelectSubset<T, FolderCollaboratorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FolderCollaboratorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FolderCollaborator.
     * @param {FolderCollaboratorCreateArgs} args - Arguments to create a FolderCollaborator.
     * @example
     * // Create one FolderCollaborator
     * const FolderCollaborator = await prisma.folderCollaborator.create({
     *   data: {
     *     // ... data to create a FolderCollaborator
     *   }
     * })
     * 
     */
    create<T extends FolderCollaboratorCreateArgs>(args: SelectSubset<T, FolderCollaboratorCreateArgs<ExtArgs>>): Prisma__FolderCollaboratorClient<$Result.GetResult<Prisma.$FolderCollaboratorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FolderCollaborators.
     * @param {FolderCollaboratorCreateManyArgs} args - Arguments to create many FolderCollaborators.
     * @example
     * // Create many FolderCollaborators
     * const folderCollaborator = await prisma.folderCollaborator.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FolderCollaboratorCreateManyArgs>(args?: SelectSubset<T, FolderCollaboratorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FolderCollaborators and returns the data saved in the database.
     * @param {FolderCollaboratorCreateManyAndReturnArgs} args - Arguments to create many FolderCollaborators.
     * @example
     * // Create many FolderCollaborators
     * const folderCollaborator = await prisma.folderCollaborator.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FolderCollaborators and only return the `folderId`
     * const folderCollaboratorWithFolderIdOnly = await prisma.folderCollaborator.createManyAndReturn({
     *   select: { folderId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FolderCollaboratorCreateManyAndReturnArgs>(args?: SelectSubset<T, FolderCollaboratorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FolderCollaboratorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FolderCollaborator.
     * @param {FolderCollaboratorDeleteArgs} args - Arguments to delete one FolderCollaborator.
     * @example
     * // Delete one FolderCollaborator
     * const FolderCollaborator = await prisma.folderCollaborator.delete({
     *   where: {
     *     // ... filter to delete one FolderCollaborator
     *   }
     * })
     * 
     */
    delete<T extends FolderCollaboratorDeleteArgs>(args: SelectSubset<T, FolderCollaboratorDeleteArgs<ExtArgs>>): Prisma__FolderCollaboratorClient<$Result.GetResult<Prisma.$FolderCollaboratorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FolderCollaborator.
     * @param {FolderCollaboratorUpdateArgs} args - Arguments to update one FolderCollaborator.
     * @example
     * // Update one FolderCollaborator
     * const folderCollaborator = await prisma.folderCollaborator.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FolderCollaboratorUpdateArgs>(args: SelectSubset<T, FolderCollaboratorUpdateArgs<ExtArgs>>): Prisma__FolderCollaboratorClient<$Result.GetResult<Prisma.$FolderCollaboratorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FolderCollaborators.
     * @param {FolderCollaboratorDeleteManyArgs} args - Arguments to filter FolderCollaborators to delete.
     * @example
     * // Delete a few FolderCollaborators
     * const { count } = await prisma.folderCollaborator.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FolderCollaboratorDeleteManyArgs>(args?: SelectSubset<T, FolderCollaboratorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FolderCollaborators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderCollaboratorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FolderCollaborators
     * const folderCollaborator = await prisma.folderCollaborator.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FolderCollaboratorUpdateManyArgs>(args: SelectSubset<T, FolderCollaboratorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FolderCollaborators and returns the data updated in the database.
     * @param {FolderCollaboratorUpdateManyAndReturnArgs} args - Arguments to update many FolderCollaborators.
     * @example
     * // Update many FolderCollaborators
     * const folderCollaborator = await prisma.folderCollaborator.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FolderCollaborators and only return the `folderId`
     * const folderCollaboratorWithFolderIdOnly = await prisma.folderCollaborator.updateManyAndReturn({
     *   select: { folderId: true },
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
    updateManyAndReturn<T extends FolderCollaboratorUpdateManyAndReturnArgs>(args: SelectSubset<T, FolderCollaboratorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FolderCollaboratorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FolderCollaborator.
     * @param {FolderCollaboratorUpsertArgs} args - Arguments to update or create a FolderCollaborator.
     * @example
     * // Update or create a FolderCollaborator
     * const folderCollaborator = await prisma.folderCollaborator.upsert({
     *   create: {
     *     // ... data to create a FolderCollaborator
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FolderCollaborator we want to update
     *   }
     * })
     */
    upsert<T extends FolderCollaboratorUpsertArgs>(args: SelectSubset<T, FolderCollaboratorUpsertArgs<ExtArgs>>): Prisma__FolderCollaboratorClient<$Result.GetResult<Prisma.$FolderCollaboratorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FolderCollaborators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderCollaboratorCountArgs} args - Arguments to filter FolderCollaborators to count.
     * @example
     * // Count the number of FolderCollaborators
     * const count = await prisma.folderCollaborator.count({
     *   where: {
     *     // ... the filter for the FolderCollaborators we want to count
     *   }
     * })
    **/
    count<T extends FolderCollaboratorCountArgs>(
      args?: Subset<T, FolderCollaboratorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FolderCollaboratorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FolderCollaborator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderCollaboratorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FolderCollaboratorAggregateArgs>(args: Subset<T, FolderCollaboratorAggregateArgs>): Prisma.PrismaPromise<GetFolderCollaboratorAggregateType<T>>

    /**
     * Group by FolderCollaborator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FolderCollaboratorGroupByArgs} args - Group by arguments.
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
      T extends FolderCollaboratorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FolderCollaboratorGroupByArgs['orderBy'] }
        : { orderBy?: FolderCollaboratorGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FolderCollaboratorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFolderCollaboratorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FolderCollaborator model
   */
  readonly fields: FolderCollaboratorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FolderCollaborator.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FolderCollaboratorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    folder<T extends FolderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FolderDefaultArgs<ExtArgs>>): Prisma__FolderClient<$Result.GetResult<Prisma.$FolderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the FolderCollaborator model
   */
  interface FolderCollaboratorFieldRefs {
    readonly folderId: FieldRef<"FolderCollaborator", 'String'>
    readonly userId: FieldRef<"FolderCollaborator", 'String'>
    readonly permission: FieldRef<"FolderCollaborator", 'Role'>
    readonly addedAt: FieldRef<"FolderCollaborator", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FolderCollaborator findUnique
   */
  export type FolderCollaboratorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderCollaborator
     */
    select?: FolderCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderCollaborator
     */
    omit?: FolderCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderCollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which FolderCollaborator to fetch.
     */
    where: FolderCollaboratorWhereUniqueInput
  }

  /**
   * FolderCollaborator findUniqueOrThrow
   */
  export type FolderCollaboratorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderCollaborator
     */
    select?: FolderCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderCollaborator
     */
    omit?: FolderCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderCollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which FolderCollaborator to fetch.
     */
    where: FolderCollaboratorWhereUniqueInput
  }

  /**
   * FolderCollaborator findFirst
   */
  export type FolderCollaboratorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderCollaborator
     */
    select?: FolderCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderCollaborator
     */
    omit?: FolderCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderCollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which FolderCollaborator to fetch.
     */
    where?: FolderCollaboratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FolderCollaborators to fetch.
     */
    orderBy?: FolderCollaboratorOrderByWithRelationInput | FolderCollaboratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FolderCollaborators.
     */
    cursor?: FolderCollaboratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FolderCollaborators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FolderCollaborators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FolderCollaborators.
     */
    distinct?: FolderCollaboratorScalarFieldEnum | FolderCollaboratorScalarFieldEnum[]
  }

  /**
   * FolderCollaborator findFirstOrThrow
   */
  export type FolderCollaboratorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderCollaborator
     */
    select?: FolderCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderCollaborator
     */
    omit?: FolderCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderCollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which FolderCollaborator to fetch.
     */
    where?: FolderCollaboratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FolderCollaborators to fetch.
     */
    orderBy?: FolderCollaboratorOrderByWithRelationInput | FolderCollaboratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FolderCollaborators.
     */
    cursor?: FolderCollaboratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FolderCollaborators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FolderCollaborators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FolderCollaborators.
     */
    distinct?: FolderCollaboratorScalarFieldEnum | FolderCollaboratorScalarFieldEnum[]
  }

  /**
   * FolderCollaborator findMany
   */
  export type FolderCollaboratorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderCollaborator
     */
    select?: FolderCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderCollaborator
     */
    omit?: FolderCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderCollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which FolderCollaborators to fetch.
     */
    where?: FolderCollaboratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FolderCollaborators to fetch.
     */
    orderBy?: FolderCollaboratorOrderByWithRelationInput | FolderCollaboratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FolderCollaborators.
     */
    cursor?: FolderCollaboratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FolderCollaborators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FolderCollaborators.
     */
    skip?: number
    distinct?: FolderCollaboratorScalarFieldEnum | FolderCollaboratorScalarFieldEnum[]
  }

  /**
   * FolderCollaborator create
   */
  export type FolderCollaboratorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderCollaborator
     */
    select?: FolderCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderCollaborator
     */
    omit?: FolderCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderCollaboratorInclude<ExtArgs> | null
    /**
     * The data needed to create a FolderCollaborator.
     */
    data: XOR<FolderCollaboratorCreateInput, FolderCollaboratorUncheckedCreateInput>
  }

  /**
   * FolderCollaborator createMany
   */
  export type FolderCollaboratorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FolderCollaborators.
     */
    data: FolderCollaboratorCreateManyInput | FolderCollaboratorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FolderCollaborator createManyAndReturn
   */
  export type FolderCollaboratorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderCollaborator
     */
    select?: FolderCollaboratorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FolderCollaborator
     */
    omit?: FolderCollaboratorOmit<ExtArgs> | null
    /**
     * The data used to create many FolderCollaborators.
     */
    data: FolderCollaboratorCreateManyInput | FolderCollaboratorCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderCollaboratorIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FolderCollaborator update
   */
  export type FolderCollaboratorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderCollaborator
     */
    select?: FolderCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderCollaborator
     */
    omit?: FolderCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderCollaboratorInclude<ExtArgs> | null
    /**
     * The data needed to update a FolderCollaborator.
     */
    data: XOR<FolderCollaboratorUpdateInput, FolderCollaboratorUncheckedUpdateInput>
    /**
     * Choose, which FolderCollaborator to update.
     */
    where: FolderCollaboratorWhereUniqueInput
  }

  /**
   * FolderCollaborator updateMany
   */
  export type FolderCollaboratorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FolderCollaborators.
     */
    data: XOR<FolderCollaboratorUpdateManyMutationInput, FolderCollaboratorUncheckedUpdateManyInput>
    /**
     * Filter which FolderCollaborators to update
     */
    where?: FolderCollaboratorWhereInput
    /**
     * Limit how many FolderCollaborators to update.
     */
    limit?: number
  }

  /**
   * FolderCollaborator updateManyAndReturn
   */
  export type FolderCollaboratorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderCollaborator
     */
    select?: FolderCollaboratorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FolderCollaborator
     */
    omit?: FolderCollaboratorOmit<ExtArgs> | null
    /**
     * The data used to update FolderCollaborators.
     */
    data: XOR<FolderCollaboratorUpdateManyMutationInput, FolderCollaboratorUncheckedUpdateManyInput>
    /**
     * Filter which FolderCollaborators to update
     */
    where?: FolderCollaboratorWhereInput
    /**
     * Limit how many FolderCollaborators to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderCollaboratorIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FolderCollaborator upsert
   */
  export type FolderCollaboratorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderCollaborator
     */
    select?: FolderCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderCollaborator
     */
    omit?: FolderCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderCollaboratorInclude<ExtArgs> | null
    /**
     * The filter to search for the FolderCollaborator to update in case it exists.
     */
    where: FolderCollaboratorWhereUniqueInput
    /**
     * In case the FolderCollaborator found by the `where` argument doesn't exist, create a new FolderCollaborator with this data.
     */
    create: XOR<FolderCollaboratorCreateInput, FolderCollaboratorUncheckedCreateInput>
    /**
     * In case the FolderCollaborator was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FolderCollaboratorUpdateInput, FolderCollaboratorUncheckedUpdateInput>
  }

  /**
   * FolderCollaborator delete
   */
  export type FolderCollaboratorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderCollaborator
     */
    select?: FolderCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderCollaborator
     */
    omit?: FolderCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderCollaboratorInclude<ExtArgs> | null
    /**
     * Filter which FolderCollaborator to delete.
     */
    where: FolderCollaboratorWhereUniqueInput
  }

  /**
   * FolderCollaborator deleteMany
   */
  export type FolderCollaboratorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FolderCollaborators to delete
     */
    where?: FolderCollaboratorWhereInput
    /**
     * Limit how many FolderCollaborators to delete.
     */
    limit?: number
  }

  /**
   * FolderCollaborator without action
   */
  export type FolderCollaboratorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FolderCollaborator
     */
    select?: FolderCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FolderCollaborator
     */
    omit?: FolderCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FolderCollaboratorInclude<ExtArgs> | null
  }


  /**
   * Model Tag
   */

  export type AggregateTag = {
    _count: TagCountAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  export type TagMinAggregateOutputType = {
    id: string | null
    name: string | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    isDeleted: boolean | null
    deletedAt: Date | null
  }

  export type TagMaxAggregateOutputType = {
    id: string | null
    name: string | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    isDeleted: boolean | null
    deletedAt: Date | null
  }

  export type TagCountAggregateOutputType = {
    id: number
    name: number
    color: number
    createdAt: number
    updatedAt: number
    userId: number
    isDeleted: number
    deletedAt: number
    _all: number
  }


  export type TagMinAggregateInputType = {
    id?: true
    name?: true
    color?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    isDeleted?: true
    deletedAt?: true
  }

  export type TagMaxAggregateInputType = {
    id?: true
    name?: true
    color?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    isDeleted?: true
    deletedAt?: true
  }

  export type TagCountAggregateInputType = {
    id?: true
    name?: true
    color?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    isDeleted?: true
    deletedAt?: true
    _all?: true
  }

  export type TagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tag to aggregate.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tags
    **/
    _count?: true | TagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TagMaxAggregateInputType
  }

  export type GetTagAggregateType<T extends TagAggregateArgs> = {
        [P in keyof T & keyof AggregateTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTag[P]>
      : GetScalarType<T[P], AggregateTag[P]>
  }




  export type TagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagWhereInput
    orderBy?: TagOrderByWithAggregationInput | TagOrderByWithAggregationInput[]
    by: TagScalarFieldEnum[] | TagScalarFieldEnum
    having?: TagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TagCountAggregateInputType | true
    _min?: TagMinAggregateInputType
    _max?: TagMaxAggregateInputType
  }

  export type TagGroupByOutputType = {
    id: string
    name: string
    color: string | null
    createdAt: Date
    updatedAt: Date
    userId: string
    isDeleted: boolean
    deletedAt: Date | null
    _count: TagCountAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  type GetTagGroupByPayload<T extends TagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TagGroupByOutputType[P]>
            : GetScalarType<T[P], TagGroupByOutputType[P]>
        }
      >
    >


  export type TagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    bookmarks?: boolean | Tag$bookmarksArgs<ExtArgs>
    _count?: boolean | TagCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tag"]>

  export type TagSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tag"]>

  export type TagSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tag"]>

  export type TagSelectScalar = {
    id?: boolean
    name?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
  }

  export type TagOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "color" | "createdAt" | "updatedAt" | "userId" | "isDeleted" | "deletedAt", ExtArgs["result"]["tag"]>
  export type TagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    bookmarks?: boolean | Tag$bookmarksArgs<ExtArgs>
    _count?: boolean | TagCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TagIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TagIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tag"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      bookmarks: Prisma.$BookmarkTagPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      color: string | null
      createdAt: Date
      updatedAt: Date
      userId: string
      isDeleted: boolean
      deletedAt: Date | null
    }, ExtArgs["result"]["tag"]>
    composites: {}
  }

  type TagGetPayload<S extends boolean | null | undefined | TagDefaultArgs> = $Result.GetResult<Prisma.$TagPayload, S>

  type TagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TagCountAggregateInputType | true
    }

  export interface TagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tag'], meta: { name: 'Tag' } }
    /**
     * Find zero or one Tag that matches the filter.
     * @param {TagFindUniqueArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TagFindUniqueArgs>(args: SelectSubset<T, TagFindUniqueArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TagFindUniqueOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TagFindUniqueOrThrowArgs>(args: SelectSubset<T, TagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TagFindFirstArgs>(args?: SelectSubset<T, TagFindFirstArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TagFindFirstOrThrowArgs>(args?: SelectSubset<T, TagFindFirstOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tags
     * const tags = await prisma.tag.findMany()
     * 
     * // Get first 10 Tags
     * const tags = await prisma.tag.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tagWithIdOnly = await prisma.tag.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TagFindManyArgs>(args?: SelectSubset<T, TagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tag.
     * @param {TagCreateArgs} args - Arguments to create a Tag.
     * @example
     * // Create one Tag
     * const Tag = await prisma.tag.create({
     *   data: {
     *     // ... data to create a Tag
     *   }
     * })
     * 
     */
    create<T extends TagCreateArgs>(args: SelectSubset<T, TagCreateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tags.
     * @param {TagCreateManyArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TagCreateManyArgs>(args?: SelectSubset<T, TagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tags and returns the data saved in the database.
     * @param {TagCreateManyAndReturnArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tags and only return the `id`
     * const tagWithIdOnly = await prisma.tag.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TagCreateManyAndReturnArgs>(args?: SelectSubset<T, TagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tag.
     * @param {TagDeleteArgs} args - Arguments to delete one Tag.
     * @example
     * // Delete one Tag
     * const Tag = await prisma.tag.delete({
     *   where: {
     *     // ... filter to delete one Tag
     *   }
     * })
     * 
     */
    delete<T extends TagDeleteArgs>(args: SelectSubset<T, TagDeleteArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tag.
     * @param {TagUpdateArgs} args - Arguments to update one Tag.
     * @example
     * // Update one Tag
     * const tag = await prisma.tag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TagUpdateArgs>(args: SelectSubset<T, TagUpdateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tags.
     * @param {TagDeleteManyArgs} args - Arguments to filter Tags to delete.
     * @example
     * // Delete a few Tags
     * const { count } = await prisma.tag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TagDeleteManyArgs>(args?: SelectSubset<T, TagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TagUpdateManyArgs>(args: SelectSubset<T, TagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags and returns the data updated in the database.
     * @param {TagUpdateManyAndReturnArgs} args - Arguments to update many Tags.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tags and only return the `id`
     * const tagWithIdOnly = await prisma.tag.updateManyAndReturn({
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
    updateManyAndReturn<T extends TagUpdateManyAndReturnArgs>(args: SelectSubset<T, TagUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tag.
     * @param {TagUpsertArgs} args - Arguments to update or create a Tag.
     * @example
     * // Update or create a Tag
     * const tag = await prisma.tag.upsert({
     *   create: {
     *     // ... data to create a Tag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tag we want to update
     *   }
     * })
     */
    upsert<T extends TagUpsertArgs>(args: SelectSubset<T, TagUpsertArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagCountArgs} args - Arguments to filter Tags to count.
     * @example
     * // Count the number of Tags
     * const count = await prisma.tag.count({
     *   where: {
     *     // ... the filter for the Tags we want to count
     *   }
     * })
    **/
    count<T extends TagCountArgs>(
      args?: Subset<T, TagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TagAggregateArgs>(args: Subset<T, TagAggregateArgs>): Prisma.PrismaPromise<GetTagAggregateType<T>>

    /**
     * Group by Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagGroupByArgs} args - Group by arguments.
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
      T extends TagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TagGroupByArgs['orderBy'] }
        : { orderBy?: TagGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tag model
   */
  readonly fields: TagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    bookmarks<T extends Tag$bookmarksArgs<ExtArgs> = {}>(args?: Subset<T, Tag$bookmarksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Tag model
   */
  interface TagFieldRefs {
    readonly id: FieldRef<"Tag", 'String'>
    readonly name: FieldRef<"Tag", 'String'>
    readonly color: FieldRef<"Tag", 'String'>
    readonly createdAt: FieldRef<"Tag", 'DateTime'>
    readonly updatedAt: FieldRef<"Tag", 'DateTime'>
    readonly userId: FieldRef<"Tag", 'String'>
    readonly isDeleted: FieldRef<"Tag", 'Boolean'>
    readonly deletedAt: FieldRef<"Tag", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tag findUnique
   */
  export type TagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findUniqueOrThrow
   */
  export type TagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findFirst
   */
  export type TagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findFirstOrThrow
   */
  export type TagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findMany
   */
  export type TagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tags to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag create
   */
  export type TagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The data needed to create a Tag.
     */
    data: XOR<TagCreateInput, TagUncheckedCreateInput>
  }

  /**
   * Tag createMany
   */
  export type TagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tag createManyAndReturn
   */
  export type TagCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Tag update
   */
  export type TagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The data needed to update a Tag.
     */
    data: XOR<TagUpdateInput, TagUncheckedUpdateInput>
    /**
     * Choose, which Tag to update.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag updateMany
   */
  export type TagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to update.
     */
    limit?: number
  }

  /**
   * Tag updateManyAndReturn
   */
  export type TagUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Tag upsert
   */
  export type TagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The filter to search for the Tag to update in case it exists.
     */
    where: TagWhereUniqueInput
    /**
     * In case the Tag found by the `where` argument doesn't exist, create a new Tag with this data.
     */
    create: XOR<TagCreateInput, TagUncheckedCreateInput>
    /**
     * In case the Tag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TagUpdateInput, TagUncheckedUpdateInput>
  }

  /**
   * Tag delete
   */
  export type TagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter which Tag to delete.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag deleteMany
   */
  export type TagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tags to delete
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to delete.
     */
    limit?: number
  }

  /**
   * Tag.bookmarks
   */
  export type Tag$bookmarksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkTag
     */
    select?: BookmarkTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkTag
     */
    omit?: BookmarkTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkTagInclude<ExtArgs> | null
    where?: BookmarkTagWhereInput
    orderBy?: BookmarkTagOrderByWithRelationInput | BookmarkTagOrderByWithRelationInput[]
    cursor?: BookmarkTagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookmarkTagScalarFieldEnum | BookmarkTagScalarFieldEnum[]
  }

  /**
   * Tag without action
   */
  export type TagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
  }


  /**
   * Model BookmarkTag
   */

  export type AggregateBookmarkTag = {
    _count: BookmarkTagCountAggregateOutputType | null
    _min: BookmarkTagMinAggregateOutputType | null
    _max: BookmarkTagMaxAggregateOutputType | null
  }

  export type BookmarkTagMinAggregateOutputType = {
    tagId: string | null
    bookmarkId: string | null
    addedAt: Date | null
  }

  export type BookmarkTagMaxAggregateOutputType = {
    tagId: string | null
    bookmarkId: string | null
    addedAt: Date | null
  }

  export type BookmarkTagCountAggregateOutputType = {
    tagId: number
    bookmarkId: number
    addedAt: number
    _all: number
  }


  export type BookmarkTagMinAggregateInputType = {
    tagId?: true
    bookmarkId?: true
    addedAt?: true
  }

  export type BookmarkTagMaxAggregateInputType = {
    tagId?: true
    bookmarkId?: true
    addedAt?: true
  }

  export type BookmarkTagCountAggregateInputType = {
    tagId?: true
    bookmarkId?: true
    addedAt?: true
    _all?: true
  }

  export type BookmarkTagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookmarkTag to aggregate.
     */
    where?: BookmarkTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookmarkTags to fetch.
     */
    orderBy?: BookmarkTagOrderByWithRelationInput | BookmarkTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookmarkTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookmarkTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookmarkTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BookmarkTags
    **/
    _count?: true | BookmarkTagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookmarkTagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookmarkTagMaxAggregateInputType
  }

  export type GetBookmarkTagAggregateType<T extends BookmarkTagAggregateArgs> = {
        [P in keyof T & keyof AggregateBookmarkTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookmarkTag[P]>
      : GetScalarType<T[P], AggregateBookmarkTag[P]>
  }




  export type BookmarkTagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookmarkTagWhereInput
    orderBy?: BookmarkTagOrderByWithAggregationInput | BookmarkTagOrderByWithAggregationInput[]
    by: BookmarkTagScalarFieldEnum[] | BookmarkTagScalarFieldEnum
    having?: BookmarkTagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookmarkTagCountAggregateInputType | true
    _min?: BookmarkTagMinAggregateInputType
    _max?: BookmarkTagMaxAggregateInputType
  }

  export type BookmarkTagGroupByOutputType = {
    tagId: string
    bookmarkId: string
    addedAt: Date
    _count: BookmarkTagCountAggregateOutputType | null
    _min: BookmarkTagMinAggregateOutputType | null
    _max: BookmarkTagMaxAggregateOutputType | null
  }

  type GetBookmarkTagGroupByPayload<T extends BookmarkTagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookmarkTagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookmarkTagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookmarkTagGroupByOutputType[P]>
            : GetScalarType<T[P], BookmarkTagGroupByOutputType[P]>
        }
      >
    >


  export type BookmarkTagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    tagId?: boolean
    bookmarkId?: boolean
    addedAt?: boolean
    tag?: boolean | TagDefaultArgs<ExtArgs>
    bookmark?: boolean | BookmarkDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookmarkTag"]>

  export type BookmarkTagSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    tagId?: boolean
    bookmarkId?: boolean
    addedAt?: boolean
    tag?: boolean | TagDefaultArgs<ExtArgs>
    bookmark?: boolean | BookmarkDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookmarkTag"]>

  export type BookmarkTagSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    tagId?: boolean
    bookmarkId?: boolean
    addedAt?: boolean
    tag?: boolean | TagDefaultArgs<ExtArgs>
    bookmark?: boolean | BookmarkDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookmarkTag"]>

  export type BookmarkTagSelectScalar = {
    tagId?: boolean
    bookmarkId?: boolean
    addedAt?: boolean
  }

  export type BookmarkTagOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"tagId" | "bookmarkId" | "addedAt", ExtArgs["result"]["bookmarkTag"]>
  export type BookmarkTagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tag?: boolean | TagDefaultArgs<ExtArgs>
    bookmark?: boolean | BookmarkDefaultArgs<ExtArgs>
  }
  export type BookmarkTagIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tag?: boolean | TagDefaultArgs<ExtArgs>
    bookmark?: boolean | BookmarkDefaultArgs<ExtArgs>
  }
  export type BookmarkTagIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tag?: boolean | TagDefaultArgs<ExtArgs>
    bookmark?: boolean | BookmarkDefaultArgs<ExtArgs>
  }

  export type $BookmarkTagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BookmarkTag"
    objects: {
      tag: Prisma.$TagPayload<ExtArgs>
      bookmark: Prisma.$BookmarkPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      tagId: string
      bookmarkId: string
      addedAt: Date
    }, ExtArgs["result"]["bookmarkTag"]>
    composites: {}
  }

  type BookmarkTagGetPayload<S extends boolean | null | undefined | BookmarkTagDefaultArgs> = $Result.GetResult<Prisma.$BookmarkTagPayload, S>

  type BookmarkTagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BookmarkTagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookmarkTagCountAggregateInputType | true
    }

  export interface BookmarkTagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BookmarkTag'], meta: { name: 'BookmarkTag' } }
    /**
     * Find zero or one BookmarkTag that matches the filter.
     * @param {BookmarkTagFindUniqueArgs} args - Arguments to find a BookmarkTag
     * @example
     * // Get one BookmarkTag
     * const bookmarkTag = await prisma.bookmarkTag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookmarkTagFindUniqueArgs>(args: SelectSubset<T, BookmarkTagFindUniqueArgs<ExtArgs>>): Prisma__BookmarkTagClient<$Result.GetResult<Prisma.$BookmarkTagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BookmarkTag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookmarkTagFindUniqueOrThrowArgs} args - Arguments to find a BookmarkTag
     * @example
     * // Get one BookmarkTag
     * const bookmarkTag = await prisma.bookmarkTag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookmarkTagFindUniqueOrThrowArgs>(args: SelectSubset<T, BookmarkTagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookmarkTagClient<$Result.GetResult<Prisma.$BookmarkTagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BookmarkTag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkTagFindFirstArgs} args - Arguments to find a BookmarkTag
     * @example
     * // Get one BookmarkTag
     * const bookmarkTag = await prisma.bookmarkTag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookmarkTagFindFirstArgs>(args?: SelectSubset<T, BookmarkTagFindFirstArgs<ExtArgs>>): Prisma__BookmarkTagClient<$Result.GetResult<Prisma.$BookmarkTagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BookmarkTag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkTagFindFirstOrThrowArgs} args - Arguments to find a BookmarkTag
     * @example
     * // Get one BookmarkTag
     * const bookmarkTag = await prisma.bookmarkTag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookmarkTagFindFirstOrThrowArgs>(args?: SelectSubset<T, BookmarkTagFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookmarkTagClient<$Result.GetResult<Prisma.$BookmarkTagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BookmarkTags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkTagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BookmarkTags
     * const bookmarkTags = await prisma.bookmarkTag.findMany()
     * 
     * // Get first 10 BookmarkTags
     * const bookmarkTags = await prisma.bookmarkTag.findMany({ take: 10 })
     * 
     * // Only select the `tagId`
     * const bookmarkTagWithTagIdOnly = await prisma.bookmarkTag.findMany({ select: { tagId: true } })
     * 
     */
    findMany<T extends BookmarkTagFindManyArgs>(args?: SelectSubset<T, BookmarkTagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BookmarkTag.
     * @param {BookmarkTagCreateArgs} args - Arguments to create a BookmarkTag.
     * @example
     * // Create one BookmarkTag
     * const BookmarkTag = await prisma.bookmarkTag.create({
     *   data: {
     *     // ... data to create a BookmarkTag
     *   }
     * })
     * 
     */
    create<T extends BookmarkTagCreateArgs>(args: SelectSubset<T, BookmarkTagCreateArgs<ExtArgs>>): Prisma__BookmarkTagClient<$Result.GetResult<Prisma.$BookmarkTagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BookmarkTags.
     * @param {BookmarkTagCreateManyArgs} args - Arguments to create many BookmarkTags.
     * @example
     * // Create many BookmarkTags
     * const bookmarkTag = await prisma.bookmarkTag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookmarkTagCreateManyArgs>(args?: SelectSubset<T, BookmarkTagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BookmarkTags and returns the data saved in the database.
     * @param {BookmarkTagCreateManyAndReturnArgs} args - Arguments to create many BookmarkTags.
     * @example
     * // Create many BookmarkTags
     * const bookmarkTag = await prisma.bookmarkTag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BookmarkTags and only return the `tagId`
     * const bookmarkTagWithTagIdOnly = await prisma.bookmarkTag.createManyAndReturn({
     *   select: { tagId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookmarkTagCreateManyAndReturnArgs>(args?: SelectSubset<T, BookmarkTagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkTagPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BookmarkTag.
     * @param {BookmarkTagDeleteArgs} args - Arguments to delete one BookmarkTag.
     * @example
     * // Delete one BookmarkTag
     * const BookmarkTag = await prisma.bookmarkTag.delete({
     *   where: {
     *     // ... filter to delete one BookmarkTag
     *   }
     * })
     * 
     */
    delete<T extends BookmarkTagDeleteArgs>(args: SelectSubset<T, BookmarkTagDeleteArgs<ExtArgs>>): Prisma__BookmarkTagClient<$Result.GetResult<Prisma.$BookmarkTagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BookmarkTag.
     * @param {BookmarkTagUpdateArgs} args - Arguments to update one BookmarkTag.
     * @example
     * // Update one BookmarkTag
     * const bookmarkTag = await prisma.bookmarkTag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookmarkTagUpdateArgs>(args: SelectSubset<T, BookmarkTagUpdateArgs<ExtArgs>>): Prisma__BookmarkTagClient<$Result.GetResult<Prisma.$BookmarkTagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BookmarkTags.
     * @param {BookmarkTagDeleteManyArgs} args - Arguments to filter BookmarkTags to delete.
     * @example
     * // Delete a few BookmarkTags
     * const { count } = await prisma.bookmarkTag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookmarkTagDeleteManyArgs>(args?: SelectSubset<T, BookmarkTagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookmarkTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkTagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BookmarkTags
     * const bookmarkTag = await prisma.bookmarkTag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookmarkTagUpdateManyArgs>(args: SelectSubset<T, BookmarkTagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookmarkTags and returns the data updated in the database.
     * @param {BookmarkTagUpdateManyAndReturnArgs} args - Arguments to update many BookmarkTags.
     * @example
     * // Update many BookmarkTags
     * const bookmarkTag = await prisma.bookmarkTag.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BookmarkTags and only return the `tagId`
     * const bookmarkTagWithTagIdOnly = await prisma.bookmarkTag.updateManyAndReturn({
     *   select: { tagId: true },
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
    updateManyAndReturn<T extends BookmarkTagUpdateManyAndReturnArgs>(args: SelectSubset<T, BookmarkTagUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkTagPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BookmarkTag.
     * @param {BookmarkTagUpsertArgs} args - Arguments to update or create a BookmarkTag.
     * @example
     * // Update or create a BookmarkTag
     * const bookmarkTag = await prisma.bookmarkTag.upsert({
     *   create: {
     *     // ... data to create a BookmarkTag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BookmarkTag we want to update
     *   }
     * })
     */
    upsert<T extends BookmarkTagUpsertArgs>(args: SelectSubset<T, BookmarkTagUpsertArgs<ExtArgs>>): Prisma__BookmarkTagClient<$Result.GetResult<Prisma.$BookmarkTagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BookmarkTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkTagCountArgs} args - Arguments to filter BookmarkTags to count.
     * @example
     * // Count the number of BookmarkTags
     * const count = await prisma.bookmarkTag.count({
     *   where: {
     *     // ... the filter for the BookmarkTags we want to count
     *   }
     * })
    **/
    count<T extends BookmarkTagCountArgs>(
      args?: Subset<T, BookmarkTagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookmarkTagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BookmarkTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkTagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BookmarkTagAggregateArgs>(args: Subset<T, BookmarkTagAggregateArgs>): Prisma.PrismaPromise<GetBookmarkTagAggregateType<T>>

    /**
     * Group by BookmarkTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkTagGroupByArgs} args - Group by arguments.
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
      T extends BookmarkTagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookmarkTagGroupByArgs['orderBy'] }
        : { orderBy?: BookmarkTagGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BookmarkTagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookmarkTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BookmarkTag model
   */
  readonly fields: BookmarkTagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BookmarkTag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookmarkTagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tag<T extends TagDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TagDefaultArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    bookmark<T extends BookmarkDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BookmarkDefaultArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the BookmarkTag model
   */
  interface BookmarkTagFieldRefs {
    readonly tagId: FieldRef<"BookmarkTag", 'String'>
    readonly bookmarkId: FieldRef<"BookmarkTag", 'String'>
    readonly addedAt: FieldRef<"BookmarkTag", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BookmarkTag findUnique
   */
  export type BookmarkTagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkTag
     */
    select?: BookmarkTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkTag
     */
    omit?: BookmarkTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkTagInclude<ExtArgs> | null
    /**
     * Filter, which BookmarkTag to fetch.
     */
    where: BookmarkTagWhereUniqueInput
  }

  /**
   * BookmarkTag findUniqueOrThrow
   */
  export type BookmarkTagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkTag
     */
    select?: BookmarkTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkTag
     */
    omit?: BookmarkTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkTagInclude<ExtArgs> | null
    /**
     * Filter, which BookmarkTag to fetch.
     */
    where: BookmarkTagWhereUniqueInput
  }

  /**
   * BookmarkTag findFirst
   */
  export type BookmarkTagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkTag
     */
    select?: BookmarkTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkTag
     */
    omit?: BookmarkTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkTagInclude<ExtArgs> | null
    /**
     * Filter, which BookmarkTag to fetch.
     */
    where?: BookmarkTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookmarkTags to fetch.
     */
    orderBy?: BookmarkTagOrderByWithRelationInput | BookmarkTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookmarkTags.
     */
    cursor?: BookmarkTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookmarkTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookmarkTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookmarkTags.
     */
    distinct?: BookmarkTagScalarFieldEnum | BookmarkTagScalarFieldEnum[]
  }

  /**
   * BookmarkTag findFirstOrThrow
   */
  export type BookmarkTagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkTag
     */
    select?: BookmarkTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkTag
     */
    omit?: BookmarkTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkTagInclude<ExtArgs> | null
    /**
     * Filter, which BookmarkTag to fetch.
     */
    where?: BookmarkTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookmarkTags to fetch.
     */
    orderBy?: BookmarkTagOrderByWithRelationInput | BookmarkTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookmarkTags.
     */
    cursor?: BookmarkTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookmarkTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookmarkTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookmarkTags.
     */
    distinct?: BookmarkTagScalarFieldEnum | BookmarkTagScalarFieldEnum[]
  }

  /**
   * BookmarkTag findMany
   */
  export type BookmarkTagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkTag
     */
    select?: BookmarkTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkTag
     */
    omit?: BookmarkTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkTagInclude<ExtArgs> | null
    /**
     * Filter, which BookmarkTags to fetch.
     */
    where?: BookmarkTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookmarkTags to fetch.
     */
    orderBy?: BookmarkTagOrderByWithRelationInput | BookmarkTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BookmarkTags.
     */
    cursor?: BookmarkTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookmarkTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookmarkTags.
     */
    skip?: number
    distinct?: BookmarkTagScalarFieldEnum | BookmarkTagScalarFieldEnum[]
  }

  /**
   * BookmarkTag create
   */
  export type BookmarkTagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkTag
     */
    select?: BookmarkTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkTag
     */
    omit?: BookmarkTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkTagInclude<ExtArgs> | null
    /**
     * The data needed to create a BookmarkTag.
     */
    data: XOR<BookmarkTagCreateInput, BookmarkTagUncheckedCreateInput>
  }

  /**
   * BookmarkTag createMany
   */
  export type BookmarkTagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BookmarkTags.
     */
    data: BookmarkTagCreateManyInput | BookmarkTagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BookmarkTag createManyAndReturn
   */
  export type BookmarkTagCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkTag
     */
    select?: BookmarkTagSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkTag
     */
    omit?: BookmarkTagOmit<ExtArgs> | null
    /**
     * The data used to create many BookmarkTags.
     */
    data: BookmarkTagCreateManyInput | BookmarkTagCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkTagIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BookmarkTag update
   */
  export type BookmarkTagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkTag
     */
    select?: BookmarkTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkTag
     */
    omit?: BookmarkTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkTagInclude<ExtArgs> | null
    /**
     * The data needed to update a BookmarkTag.
     */
    data: XOR<BookmarkTagUpdateInput, BookmarkTagUncheckedUpdateInput>
    /**
     * Choose, which BookmarkTag to update.
     */
    where: BookmarkTagWhereUniqueInput
  }

  /**
   * BookmarkTag updateMany
   */
  export type BookmarkTagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BookmarkTags.
     */
    data: XOR<BookmarkTagUpdateManyMutationInput, BookmarkTagUncheckedUpdateManyInput>
    /**
     * Filter which BookmarkTags to update
     */
    where?: BookmarkTagWhereInput
    /**
     * Limit how many BookmarkTags to update.
     */
    limit?: number
  }

  /**
   * BookmarkTag updateManyAndReturn
   */
  export type BookmarkTagUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkTag
     */
    select?: BookmarkTagSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkTag
     */
    omit?: BookmarkTagOmit<ExtArgs> | null
    /**
     * The data used to update BookmarkTags.
     */
    data: XOR<BookmarkTagUpdateManyMutationInput, BookmarkTagUncheckedUpdateManyInput>
    /**
     * Filter which BookmarkTags to update
     */
    where?: BookmarkTagWhereInput
    /**
     * Limit how many BookmarkTags to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkTagIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BookmarkTag upsert
   */
  export type BookmarkTagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkTag
     */
    select?: BookmarkTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkTag
     */
    omit?: BookmarkTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkTagInclude<ExtArgs> | null
    /**
     * The filter to search for the BookmarkTag to update in case it exists.
     */
    where: BookmarkTagWhereUniqueInput
    /**
     * In case the BookmarkTag found by the `where` argument doesn't exist, create a new BookmarkTag with this data.
     */
    create: XOR<BookmarkTagCreateInput, BookmarkTagUncheckedCreateInput>
    /**
     * In case the BookmarkTag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookmarkTagUpdateInput, BookmarkTagUncheckedUpdateInput>
  }

  /**
   * BookmarkTag delete
   */
  export type BookmarkTagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkTag
     */
    select?: BookmarkTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkTag
     */
    omit?: BookmarkTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkTagInclude<ExtArgs> | null
    /**
     * Filter which BookmarkTag to delete.
     */
    where: BookmarkTagWhereUniqueInput
  }

  /**
   * BookmarkTag deleteMany
   */
  export type BookmarkTagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookmarkTags to delete
     */
    where?: BookmarkTagWhereInput
    /**
     * Limit how many BookmarkTags to delete.
     */
    limit?: number
  }

  /**
   * BookmarkTag without action
   */
  export type BookmarkTagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkTag
     */
    select?: BookmarkTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkTag
     */
    omit?: BookmarkTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkTagInclude<ExtArgs> | null
  }


  /**
   * Model Collection
   */

  export type AggregateCollection = {
    _count: CollectionCountAggregateOutputType | null
    _min: CollectionMinAggregateOutputType | null
    _max: CollectionMaxAggregateOutputType | null
  }

  export type CollectionMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    isPublic: boolean | null
    publicLink: string | null
    thumbnail: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    ownerId: string | null
    isDeleted: boolean | null
    deletedAt: Date | null
  }

  export type CollectionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    isPublic: boolean | null
    publicLink: string | null
    thumbnail: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    ownerId: string | null
    isDeleted: boolean | null
    deletedAt: Date | null
  }

  export type CollectionCountAggregateOutputType = {
    id: number
    name: number
    description: number
    isPublic: number
    publicLink: number
    thumbnail: number
    createdAt: number
    updatedAt: number
    userId: number
    ownerId: number
    isDeleted: number
    deletedAt: number
    _all: number
  }


  export type CollectionMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    isPublic?: true
    publicLink?: true
    thumbnail?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    ownerId?: true
    isDeleted?: true
    deletedAt?: true
  }

  export type CollectionMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    isPublic?: true
    publicLink?: true
    thumbnail?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    ownerId?: true
    isDeleted?: true
    deletedAt?: true
  }

  export type CollectionCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    isPublic?: true
    publicLink?: true
    thumbnail?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    ownerId?: true
    isDeleted?: true
    deletedAt?: true
    _all?: true
  }

  export type CollectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Collection to aggregate.
     */
    where?: CollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Collections to fetch.
     */
    orderBy?: CollectionOrderByWithRelationInput | CollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Collections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Collections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Collections
    **/
    _count?: true | CollectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CollectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CollectionMaxAggregateInputType
  }

  export type GetCollectionAggregateType<T extends CollectionAggregateArgs> = {
        [P in keyof T & keyof AggregateCollection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCollection[P]>
      : GetScalarType<T[P], AggregateCollection[P]>
  }




  export type CollectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CollectionWhereInput
    orderBy?: CollectionOrderByWithAggregationInput | CollectionOrderByWithAggregationInput[]
    by: CollectionScalarFieldEnum[] | CollectionScalarFieldEnum
    having?: CollectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CollectionCountAggregateInputType | true
    _min?: CollectionMinAggregateInputType
    _max?: CollectionMaxAggregateInputType
  }

  export type CollectionGroupByOutputType = {
    id: string
    name: string
    description: string | null
    isPublic: boolean
    publicLink: string | null
    thumbnail: string | null
    createdAt: Date
    updatedAt: Date
    userId: string
    ownerId: string
    isDeleted: boolean
    deletedAt: Date | null
    _count: CollectionCountAggregateOutputType | null
    _min: CollectionMinAggregateOutputType | null
    _max: CollectionMaxAggregateOutputType | null
  }

  type GetCollectionGroupByPayload<T extends CollectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CollectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CollectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CollectionGroupByOutputType[P]>
            : GetScalarType<T[P], CollectionGroupByOutputType[P]>
        }
      >
    >


  export type CollectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    isPublic?: boolean
    publicLink?: boolean
    thumbnail?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    ownerId?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    owner?: boolean | UserDefaultArgs<ExtArgs>
    bookmarks?: boolean | Collection$bookmarksArgs<ExtArgs>
    collaborators?: boolean | Collection$collaboratorsArgs<ExtArgs>
    _count?: boolean | CollectionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collection"]>

  export type CollectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    isPublic?: boolean
    publicLink?: boolean
    thumbnail?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    ownerId?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collection"]>

  export type CollectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    isPublic?: boolean
    publicLink?: boolean
    thumbnail?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    ownerId?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collection"]>

  export type CollectionSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    isPublic?: boolean
    publicLink?: boolean
    thumbnail?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    ownerId?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
  }

  export type CollectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "isPublic" | "publicLink" | "thumbnail" | "createdAt" | "updatedAt" | "userId" | "ownerId" | "isDeleted" | "deletedAt", ExtArgs["result"]["collection"]>
  export type CollectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    owner?: boolean | UserDefaultArgs<ExtArgs>
    bookmarks?: boolean | Collection$bookmarksArgs<ExtArgs>
    collaborators?: boolean | Collection$collaboratorsArgs<ExtArgs>
    _count?: boolean | CollectionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CollectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CollectionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CollectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Collection"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      owner: Prisma.$UserPayload<ExtArgs>
      bookmarks: Prisma.$BookmarkCollectionPayload<ExtArgs>[]
      collaborators: Prisma.$CollectionCollaboratorPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      isPublic: boolean
      publicLink: string | null
      thumbnail: string | null
      createdAt: Date
      updatedAt: Date
      userId: string
      ownerId: string
      isDeleted: boolean
      deletedAt: Date | null
    }, ExtArgs["result"]["collection"]>
    composites: {}
  }

  type CollectionGetPayload<S extends boolean | null | undefined | CollectionDefaultArgs> = $Result.GetResult<Prisma.$CollectionPayload, S>

  type CollectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CollectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CollectionCountAggregateInputType | true
    }

  export interface CollectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Collection'], meta: { name: 'Collection' } }
    /**
     * Find zero or one Collection that matches the filter.
     * @param {CollectionFindUniqueArgs} args - Arguments to find a Collection
     * @example
     * // Get one Collection
     * const collection = await prisma.collection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CollectionFindUniqueArgs>(args: SelectSubset<T, CollectionFindUniqueArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Collection that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CollectionFindUniqueOrThrowArgs} args - Arguments to find a Collection
     * @example
     * // Get one Collection
     * const collection = await prisma.collection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CollectionFindUniqueOrThrowArgs>(args: SelectSubset<T, CollectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Collection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionFindFirstArgs} args - Arguments to find a Collection
     * @example
     * // Get one Collection
     * const collection = await prisma.collection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CollectionFindFirstArgs>(args?: SelectSubset<T, CollectionFindFirstArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Collection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionFindFirstOrThrowArgs} args - Arguments to find a Collection
     * @example
     * // Get one Collection
     * const collection = await prisma.collection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CollectionFindFirstOrThrowArgs>(args?: SelectSubset<T, CollectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Collections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Collections
     * const collections = await prisma.collection.findMany()
     * 
     * // Get first 10 Collections
     * const collections = await prisma.collection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const collectionWithIdOnly = await prisma.collection.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CollectionFindManyArgs>(args?: SelectSubset<T, CollectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Collection.
     * @param {CollectionCreateArgs} args - Arguments to create a Collection.
     * @example
     * // Create one Collection
     * const Collection = await prisma.collection.create({
     *   data: {
     *     // ... data to create a Collection
     *   }
     * })
     * 
     */
    create<T extends CollectionCreateArgs>(args: SelectSubset<T, CollectionCreateArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Collections.
     * @param {CollectionCreateManyArgs} args - Arguments to create many Collections.
     * @example
     * // Create many Collections
     * const collection = await prisma.collection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CollectionCreateManyArgs>(args?: SelectSubset<T, CollectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Collections and returns the data saved in the database.
     * @param {CollectionCreateManyAndReturnArgs} args - Arguments to create many Collections.
     * @example
     * // Create many Collections
     * const collection = await prisma.collection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Collections and only return the `id`
     * const collectionWithIdOnly = await prisma.collection.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CollectionCreateManyAndReturnArgs>(args?: SelectSubset<T, CollectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Collection.
     * @param {CollectionDeleteArgs} args - Arguments to delete one Collection.
     * @example
     * // Delete one Collection
     * const Collection = await prisma.collection.delete({
     *   where: {
     *     // ... filter to delete one Collection
     *   }
     * })
     * 
     */
    delete<T extends CollectionDeleteArgs>(args: SelectSubset<T, CollectionDeleteArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Collection.
     * @param {CollectionUpdateArgs} args - Arguments to update one Collection.
     * @example
     * // Update one Collection
     * const collection = await prisma.collection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CollectionUpdateArgs>(args: SelectSubset<T, CollectionUpdateArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Collections.
     * @param {CollectionDeleteManyArgs} args - Arguments to filter Collections to delete.
     * @example
     * // Delete a few Collections
     * const { count } = await prisma.collection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CollectionDeleteManyArgs>(args?: SelectSubset<T, CollectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Collections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Collections
     * const collection = await prisma.collection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CollectionUpdateManyArgs>(args: SelectSubset<T, CollectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Collections and returns the data updated in the database.
     * @param {CollectionUpdateManyAndReturnArgs} args - Arguments to update many Collections.
     * @example
     * // Update many Collections
     * const collection = await prisma.collection.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Collections and only return the `id`
     * const collectionWithIdOnly = await prisma.collection.updateManyAndReturn({
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
    updateManyAndReturn<T extends CollectionUpdateManyAndReturnArgs>(args: SelectSubset<T, CollectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Collection.
     * @param {CollectionUpsertArgs} args - Arguments to update or create a Collection.
     * @example
     * // Update or create a Collection
     * const collection = await prisma.collection.upsert({
     *   create: {
     *     // ... data to create a Collection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Collection we want to update
     *   }
     * })
     */
    upsert<T extends CollectionUpsertArgs>(args: SelectSubset<T, CollectionUpsertArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Collections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionCountArgs} args - Arguments to filter Collections to count.
     * @example
     * // Count the number of Collections
     * const count = await prisma.collection.count({
     *   where: {
     *     // ... the filter for the Collections we want to count
     *   }
     * })
    **/
    count<T extends CollectionCountArgs>(
      args?: Subset<T, CollectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CollectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Collection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CollectionAggregateArgs>(args: Subset<T, CollectionAggregateArgs>): Prisma.PrismaPromise<GetCollectionAggregateType<T>>

    /**
     * Group by Collection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionGroupByArgs} args - Group by arguments.
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
      T extends CollectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CollectionGroupByArgs['orderBy'] }
        : { orderBy?: CollectionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CollectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCollectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Collection model
   */
  readonly fields: CollectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Collection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CollectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    bookmarks<T extends Collection$bookmarksArgs<ExtArgs> = {}>(args?: Subset<T, Collection$bookmarksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkCollectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    collaborators<T extends Collection$collaboratorsArgs<ExtArgs> = {}>(args?: Subset<T, Collection$collaboratorsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionCollaboratorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Collection model
   */
  interface CollectionFieldRefs {
    readonly id: FieldRef<"Collection", 'String'>
    readonly name: FieldRef<"Collection", 'String'>
    readonly description: FieldRef<"Collection", 'String'>
    readonly isPublic: FieldRef<"Collection", 'Boolean'>
    readonly publicLink: FieldRef<"Collection", 'String'>
    readonly thumbnail: FieldRef<"Collection", 'String'>
    readonly createdAt: FieldRef<"Collection", 'DateTime'>
    readonly updatedAt: FieldRef<"Collection", 'DateTime'>
    readonly userId: FieldRef<"Collection", 'String'>
    readonly ownerId: FieldRef<"Collection", 'String'>
    readonly isDeleted: FieldRef<"Collection", 'Boolean'>
    readonly deletedAt: FieldRef<"Collection", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Collection findUnique
   */
  export type CollectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * Filter, which Collection to fetch.
     */
    where: CollectionWhereUniqueInput
  }

  /**
   * Collection findUniqueOrThrow
   */
  export type CollectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * Filter, which Collection to fetch.
     */
    where: CollectionWhereUniqueInput
  }

  /**
   * Collection findFirst
   */
  export type CollectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * Filter, which Collection to fetch.
     */
    where?: CollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Collections to fetch.
     */
    orderBy?: CollectionOrderByWithRelationInput | CollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Collections.
     */
    cursor?: CollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Collections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Collections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Collections.
     */
    distinct?: CollectionScalarFieldEnum | CollectionScalarFieldEnum[]
  }

  /**
   * Collection findFirstOrThrow
   */
  export type CollectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * Filter, which Collection to fetch.
     */
    where?: CollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Collections to fetch.
     */
    orderBy?: CollectionOrderByWithRelationInput | CollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Collections.
     */
    cursor?: CollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Collections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Collections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Collections.
     */
    distinct?: CollectionScalarFieldEnum | CollectionScalarFieldEnum[]
  }

  /**
   * Collection findMany
   */
  export type CollectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * Filter, which Collections to fetch.
     */
    where?: CollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Collections to fetch.
     */
    orderBy?: CollectionOrderByWithRelationInput | CollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Collections.
     */
    cursor?: CollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Collections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Collections.
     */
    skip?: number
    distinct?: CollectionScalarFieldEnum | CollectionScalarFieldEnum[]
  }

  /**
   * Collection create
   */
  export type CollectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * The data needed to create a Collection.
     */
    data: XOR<CollectionCreateInput, CollectionUncheckedCreateInput>
  }

  /**
   * Collection createMany
   */
  export type CollectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Collections.
     */
    data: CollectionCreateManyInput | CollectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Collection createManyAndReturn
   */
  export type CollectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * The data used to create many Collections.
     */
    data: CollectionCreateManyInput | CollectionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Collection update
   */
  export type CollectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * The data needed to update a Collection.
     */
    data: XOR<CollectionUpdateInput, CollectionUncheckedUpdateInput>
    /**
     * Choose, which Collection to update.
     */
    where: CollectionWhereUniqueInput
  }

  /**
   * Collection updateMany
   */
  export type CollectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Collections.
     */
    data: XOR<CollectionUpdateManyMutationInput, CollectionUncheckedUpdateManyInput>
    /**
     * Filter which Collections to update
     */
    where?: CollectionWhereInput
    /**
     * Limit how many Collections to update.
     */
    limit?: number
  }

  /**
   * Collection updateManyAndReturn
   */
  export type CollectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * The data used to update Collections.
     */
    data: XOR<CollectionUpdateManyMutationInput, CollectionUncheckedUpdateManyInput>
    /**
     * Filter which Collections to update
     */
    where?: CollectionWhereInput
    /**
     * Limit how many Collections to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Collection upsert
   */
  export type CollectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * The filter to search for the Collection to update in case it exists.
     */
    where: CollectionWhereUniqueInput
    /**
     * In case the Collection found by the `where` argument doesn't exist, create a new Collection with this data.
     */
    create: XOR<CollectionCreateInput, CollectionUncheckedCreateInput>
    /**
     * In case the Collection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CollectionUpdateInput, CollectionUncheckedUpdateInput>
  }

  /**
   * Collection delete
   */
  export type CollectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * Filter which Collection to delete.
     */
    where: CollectionWhereUniqueInput
  }

  /**
   * Collection deleteMany
   */
  export type CollectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Collections to delete
     */
    where?: CollectionWhereInput
    /**
     * Limit how many Collections to delete.
     */
    limit?: number
  }

  /**
   * Collection.bookmarks
   */
  export type Collection$bookmarksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkCollection
     */
    select?: BookmarkCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkCollection
     */
    omit?: BookmarkCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkCollectionInclude<ExtArgs> | null
    where?: BookmarkCollectionWhereInput
    orderBy?: BookmarkCollectionOrderByWithRelationInput | BookmarkCollectionOrderByWithRelationInput[]
    cursor?: BookmarkCollectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookmarkCollectionScalarFieldEnum | BookmarkCollectionScalarFieldEnum[]
  }

  /**
   * Collection.collaborators
   */
  export type Collection$collaboratorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionCollaborator
     */
    select?: CollectionCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectionCollaborator
     */
    omit?: CollectionCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionCollaboratorInclude<ExtArgs> | null
    where?: CollectionCollaboratorWhereInput
    orderBy?: CollectionCollaboratorOrderByWithRelationInput | CollectionCollaboratorOrderByWithRelationInput[]
    cursor?: CollectionCollaboratorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CollectionCollaboratorScalarFieldEnum | CollectionCollaboratorScalarFieldEnum[]
  }

  /**
   * Collection without action
   */
  export type CollectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collection
     */
    omit?: CollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
  }


  /**
   * Model BookmarkCollection
   */

  export type AggregateBookmarkCollection = {
    _count: BookmarkCollectionCountAggregateOutputType | null
    _avg: BookmarkCollectionAvgAggregateOutputType | null
    _sum: BookmarkCollectionSumAggregateOutputType | null
    _min: BookmarkCollectionMinAggregateOutputType | null
    _max: BookmarkCollectionMaxAggregateOutputType | null
  }

  export type BookmarkCollectionAvgAggregateOutputType = {
    order: number | null
  }

  export type BookmarkCollectionSumAggregateOutputType = {
    order: number | null
  }

  export type BookmarkCollectionMinAggregateOutputType = {
    collectionId: string | null
    bookmarkId: string | null
    addedAt: Date | null
    order: number | null
  }

  export type BookmarkCollectionMaxAggregateOutputType = {
    collectionId: string | null
    bookmarkId: string | null
    addedAt: Date | null
    order: number | null
  }

  export type BookmarkCollectionCountAggregateOutputType = {
    collectionId: number
    bookmarkId: number
    addedAt: number
    order: number
    _all: number
  }


  export type BookmarkCollectionAvgAggregateInputType = {
    order?: true
  }

  export type BookmarkCollectionSumAggregateInputType = {
    order?: true
  }

  export type BookmarkCollectionMinAggregateInputType = {
    collectionId?: true
    bookmarkId?: true
    addedAt?: true
    order?: true
  }

  export type BookmarkCollectionMaxAggregateInputType = {
    collectionId?: true
    bookmarkId?: true
    addedAt?: true
    order?: true
  }

  export type BookmarkCollectionCountAggregateInputType = {
    collectionId?: true
    bookmarkId?: true
    addedAt?: true
    order?: true
    _all?: true
  }

  export type BookmarkCollectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookmarkCollection to aggregate.
     */
    where?: BookmarkCollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookmarkCollections to fetch.
     */
    orderBy?: BookmarkCollectionOrderByWithRelationInput | BookmarkCollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookmarkCollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookmarkCollections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookmarkCollections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BookmarkCollections
    **/
    _count?: true | BookmarkCollectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookmarkCollectionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookmarkCollectionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookmarkCollectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookmarkCollectionMaxAggregateInputType
  }

  export type GetBookmarkCollectionAggregateType<T extends BookmarkCollectionAggregateArgs> = {
        [P in keyof T & keyof AggregateBookmarkCollection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookmarkCollection[P]>
      : GetScalarType<T[P], AggregateBookmarkCollection[P]>
  }




  export type BookmarkCollectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookmarkCollectionWhereInput
    orderBy?: BookmarkCollectionOrderByWithAggregationInput | BookmarkCollectionOrderByWithAggregationInput[]
    by: BookmarkCollectionScalarFieldEnum[] | BookmarkCollectionScalarFieldEnum
    having?: BookmarkCollectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookmarkCollectionCountAggregateInputType | true
    _avg?: BookmarkCollectionAvgAggregateInputType
    _sum?: BookmarkCollectionSumAggregateInputType
    _min?: BookmarkCollectionMinAggregateInputType
    _max?: BookmarkCollectionMaxAggregateInputType
  }

  export type BookmarkCollectionGroupByOutputType = {
    collectionId: string
    bookmarkId: string
    addedAt: Date
    order: number
    _count: BookmarkCollectionCountAggregateOutputType | null
    _avg: BookmarkCollectionAvgAggregateOutputType | null
    _sum: BookmarkCollectionSumAggregateOutputType | null
    _min: BookmarkCollectionMinAggregateOutputType | null
    _max: BookmarkCollectionMaxAggregateOutputType | null
  }

  type GetBookmarkCollectionGroupByPayload<T extends BookmarkCollectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookmarkCollectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookmarkCollectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookmarkCollectionGroupByOutputType[P]>
            : GetScalarType<T[P], BookmarkCollectionGroupByOutputType[P]>
        }
      >
    >


  export type BookmarkCollectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    collectionId?: boolean
    bookmarkId?: boolean
    addedAt?: boolean
    order?: boolean
    collection?: boolean | CollectionDefaultArgs<ExtArgs>
    bookmark?: boolean | BookmarkDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookmarkCollection"]>

  export type BookmarkCollectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    collectionId?: boolean
    bookmarkId?: boolean
    addedAt?: boolean
    order?: boolean
    collection?: boolean | CollectionDefaultArgs<ExtArgs>
    bookmark?: boolean | BookmarkDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookmarkCollection"]>

  export type BookmarkCollectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    collectionId?: boolean
    bookmarkId?: boolean
    addedAt?: boolean
    order?: boolean
    collection?: boolean | CollectionDefaultArgs<ExtArgs>
    bookmark?: boolean | BookmarkDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookmarkCollection"]>

  export type BookmarkCollectionSelectScalar = {
    collectionId?: boolean
    bookmarkId?: boolean
    addedAt?: boolean
    order?: boolean
  }

  export type BookmarkCollectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"collectionId" | "bookmarkId" | "addedAt" | "order", ExtArgs["result"]["bookmarkCollection"]>
  export type BookmarkCollectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    collection?: boolean | CollectionDefaultArgs<ExtArgs>
    bookmark?: boolean | BookmarkDefaultArgs<ExtArgs>
  }
  export type BookmarkCollectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    collection?: boolean | CollectionDefaultArgs<ExtArgs>
    bookmark?: boolean | BookmarkDefaultArgs<ExtArgs>
  }
  export type BookmarkCollectionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    collection?: boolean | CollectionDefaultArgs<ExtArgs>
    bookmark?: boolean | BookmarkDefaultArgs<ExtArgs>
  }

  export type $BookmarkCollectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BookmarkCollection"
    objects: {
      collection: Prisma.$CollectionPayload<ExtArgs>
      bookmark: Prisma.$BookmarkPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      collectionId: string
      bookmarkId: string
      addedAt: Date
      order: number
    }, ExtArgs["result"]["bookmarkCollection"]>
    composites: {}
  }

  type BookmarkCollectionGetPayload<S extends boolean | null | undefined | BookmarkCollectionDefaultArgs> = $Result.GetResult<Prisma.$BookmarkCollectionPayload, S>

  type BookmarkCollectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BookmarkCollectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookmarkCollectionCountAggregateInputType | true
    }

  export interface BookmarkCollectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BookmarkCollection'], meta: { name: 'BookmarkCollection' } }
    /**
     * Find zero or one BookmarkCollection that matches the filter.
     * @param {BookmarkCollectionFindUniqueArgs} args - Arguments to find a BookmarkCollection
     * @example
     * // Get one BookmarkCollection
     * const bookmarkCollection = await prisma.bookmarkCollection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookmarkCollectionFindUniqueArgs>(args: SelectSubset<T, BookmarkCollectionFindUniqueArgs<ExtArgs>>): Prisma__BookmarkCollectionClient<$Result.GetResult<Prisma.$BookmarkCollectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BookmarkCollection that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookmarkCollectionFindUniqueOrThrowArgs} args - Arguments to find a BookmarkCollection
     * @example
     * // Get one BookmarkCollection
     * const bookmarkCollection = await prisma.bookmarkCollection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookmarkCollectionFindUniqueOrThrowArgs>(args: SelectSubset<T, BookmarkCollectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookmarkCollectionClient<$Result.GetResult<Prisma.$BookmarkCollectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BookmarkCollection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkCollectionFindFirstArgs} args - Arguments to find a BookmarkCollection
     * @example
     * // Get one BookmarkCollection
     * const bookmarkCollection = await prisma.bookmarkCollection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookmarkCollectionFindFirstArgs>(args?: SelectSubset<T, BookmarkCollectionFindFirstArgs<ExtArgs>>): Prisma__BookmarkCollectionClient<$Result.GetResult<Prisma.$BookmarkCollectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BookmarkCollection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkCollectionFindFirstOrThrowArgs} args - Arguments to find a BookmarkCollection
     * @example
     * // Get one BookmarkCollection
     * const bookmarkCollection = await prisma.bookmarkCollection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookmarkCollectionFindFirstOrThrowArgs>(args?: SelectSubset<T, BookmarkCollectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookmarkCollectionClient<$Result.GetResult<Prisma.$BookmarkCollectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BookmarkCollections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkCollectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BookmarkCollections
     * const bookmarkCollections = await prisma.bookmarkCollection.findMany()
     * 
     * // Get first 10 BookmarkCollections
     * const bookmarkCollections = await prisma.bookmarkCollection.findMany({ take: 10 })
     * 
     * // Only select the `collectionId`
     * const bookmarkCollectionWithCollectionIdOnly = await prisma.bookmarkCollection.findMany({ select: { collectionId: true } })
     * 
     */
    findMany<T extends BookmarkCollectionFindManyArgs>(args?: SelectSubset<T, BookmarkCollectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkCollectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BookmarkCollection.
     * @param {BookmarkCollectionCreateArgs} args - Arguments to create a BookmarkCollection.
     * @example
     * // Create one BookmarkCollection
     * const BookmarkCollection = await prisma.bookmarkCollection.create({
     *   data: {
     *     // ... data to create a BookmarkCollection
     *   }
     * })
     * 
     */
    create<T extends BookmarkCollectionCreateArgs>(args: SelectSubset<T, BookmarkCollectionCreateArgs<ExtArgs>>): Prisma__BookmarkCollectionClient<$Result.GetResult<Prisma.$BookmarkCollectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BookmarkCollections.
     * @param {BookmarkCollectionCreateManyArgs} args - Arguments to create many BookmarkCollections.
     * @example
     * // Create many BookmarkCollections
     * const bookmarkCollection = await prisma.bookmarkCollection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookmarkCollectionCreateManyArgs>(args?: SelectSubset<T, BookmarkCollectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BookmarkCollections and returns the data saved in the database.
     * @param {BookmarkCollectionCreateManyAndReturnArgs} args - Arguments to create many BookmarkCollections.
     * @example
     * // Create many BookmarkCollections
     * const bookmarkCollection = await prisma.bookmarkCollection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BookmarkCollections and only return the `collectionId`
     * const bookmarkCollectionWithCollectionIdOnly = await prisma.bookmarkCollection.createManyAndReturn({
     *   select: { collectionId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookmarkCollectionCreateManyAndReturnArgs>(args?: SelectSubset<T, BookmarkCollectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkCollectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BookmarkCollection.
     * @param {BookmarkCollectionDeleteArgs} args - Arguments to delete one BookmarkCollection.
     * @example
     * // Delete one BookmarkCollection
     * const BookmarkCollection = await prisma.bookmarkCollection.delete({
     *   where: {
     *     // ... filter to delete one BookmarkCollection
     *   }
     * })
     * 
     */
    delete<T extends BookmarkCollectionDeleteArgs>(args: SelectSubset<T, BookmarkCollectionDeleteArgs<ExtArgs>>): Prisma__BookmarkCollectionClient<$Result.GetResult<Prisma.$BookmarkCollectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BookmarkCollection.
     * @param {BookmarkCollectionUpdateArgs} args - Arguments to update one BookmarkCollection.
     * @example
     * // Update one BookmarkCollection
     * const bookmarkCollection = await prisma.bookmarkCollection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookmarkCollectionUpdateArgs>(args: SelectSubset<T, BookmarkCollectionUpdateArgs<ExtArgs>>): Prisma__BookmarkCollectionClient<$Result.GetResult<Prisma.$BookmarkCollectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BookmarkCollections.
     * @param {BookmarkCollectionDeleteManyArgs} args - Arguments to filter BookmarkCollections to delete.
     * @example
     * // Delete a few BookmarkCollections
     * const { count } = await prisma.bookmarkCollection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookmarkCollectionDeleteManyArgs>(args?: SelectSubset<T, BookmarkCollectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookmarkCollections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkCollectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BookmarkCollections
     * const bookmarkCollection = await prisma.bookmarkCollection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookmarkCollectionUpdateManyArgs>(args: SelectSubset<T, BookmarkCollectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookmarkCollections and returns the data updated in the database.
     * @param {BookmarkCollectionUpdateManyAndReturnArgs} args - Arguments to update many BookmarkCollections.
     * @example
     * // Update many BookmarkCollections
     * const bookmarkCollection = await prisma.bookmarkCollection.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BookmarkCollections and only return the `collectionId`
     * const bookmarkCollectionWithCollectionIdOnly = await prisma.bookmarkCollection.updateManyAndReturn({
     *   select: { collectionId: true },
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
    updateManyAndReturn<T extends BookmarkCollectionUpdateManyAndReturnArgs>(args: SelectSubset<T, BookmarkCollectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookmarkCollectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BookmarkCollection.
     * @param {BookmarkCollectionUpsertArgs} args - Arguments to update or create a BookmarkCollection.
     * @example
     * // Update or create a BookmarkCollection
     * const bookmarkCollection = await prisma.bookmarkCollection.upsert({
     *   create: {
     *     // ... data to create a BookmarkCollection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BookmarkCollection we want to update
     *   }
     * })
     */
    upsert<T extends BookmarkCollectionUpsertArgs>(args: SelectSubset<T, BookmarkCollectionUpsertArgs<ExtArgs>>): Prisma__BookmarkCollectionClient<$Result.GetResult<Prisma.$BookmarkCollectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BookmarkCollections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkCollectionCountArgs} args - Arguments to filter BookmarkCollections to count.
     * @example
     * // Count the number of BookmarkCollections
     * const count = await prisma.bookmarkCollection.count({
     *   where: {
     *     // ... the filter for the BookmarkCollections we want to count
     *   }
     * })
    **/
    count<T extends BookmarkCollectionCountArgs>(
      args?: Subset<T, BookmarkCollectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookmarkCollectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BookmarkCollection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkCollectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BookmarkCollectionAggregateArgs>(args: Subset<T, BookmarkCollectionAggregateArgs>): Prisma.PrismaPromise<GetBookmarkCollectionAggregateType<T>>

    /**
     * Group by BookmarkCollection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookmarkCollectionGroupByArgs} args - Group by arguments.
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
      T extends BookmarkCollectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookmarkCollectionGroupByArgs['orderBy'] }
        : { orderBy?: BookmarkCollectionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BookmarkCollectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookmarkCollectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BookmarkCollection model
   */
  readonly fields: BookmarkCollectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BookmarkCollection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookmarkCollectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    collection<T extends CollectionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CollectionDefaultArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    bookmark<T extends BookmarkDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BookmarkDefaultArgs<ExtArgs>>): Prisma__BookmarkClient<$Result.GetResult<Prisma.$BookmarkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the BookmarkCollection model
   */
  interface BookmarkCollectionFieldRefs {
    readonly collectionId: FieldRef<"BookmarkCollection", 'String'>
    readonly bookmarkId: FieldRef<"BookmarkCollection", 'String'>
    readonly addedAt: FieldRef<"BookmarkCollection", 'DateTime'>
    readonly order: FieldRef<"BookmarkCollection", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * BookmarkCollection findUnique
   */
  export type BookmarkCollectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkCollection
     */
    select?: BookmarkCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkCollection
     */
    omit?: BookmarkCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkCollectionInclude<ExtArgs> | null
    /**
     * Filter, which BookmarkCollection to fetch.
     */
    where: BookmarkCollectionWhereUniqueInput
  }

  /**
   * BookmarkCollection findUniqueOrThrow
   */
  export type BookmarkCollectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkCollection
     */
    select?: BookmarkCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkCollection
     */
    omit?: BookmarkCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkCollectionInclude<ExtArgs> | null
    /**
     * Filter, which BookmarkCollection to fetch.
     */
    where: BookmarkCollectionWhereUniqueInput
  }

  /**
   * BookmarkCollection findFirst
   */
  export type BookmarkCollectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkCollection
     */
    select?: BookmarkCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkCollection
     */
    omit?: BookmarkCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkCollectionInclude<ExtArgs> | null
    /**
     * Filter, which BookmarkCollection to fetch.
     */
    where?: BookmarkCollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookmarkCollections to fetch.
     */
    orderBy?: BookmarkCollectionOrderByWithRelationInput | BookmarkCollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookmarkCollections.
     */
    cursor?: BookmarkCollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookmarkCollections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookmarkCollections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookmarkCollections.
     */
    distinct?: BookmarkCollectionScalarFieldEnum | BookmarkCollectionScalarFieldEnum[]
  }

  /**
   * BookmarkCollection findFirstOrThrow
   */
  export type BookmarkCollectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkCollection
     */
    select?: BookmarkCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkCollection
     */
    omit?: BookmarkCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkCollectionInclude<ExtArgs> | null
    /**
     * Filter, which BookmarkCollection to fetch.
     */
    where?: BookmarkCollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookmarkCollections to fetch.
     */
    orderBy?: BookmarkCollectionOrderByWithRelationInput | BookmarkCollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookmarkCollections.
     */
    cursor?: BookmarkCollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookmarkCollections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookmarkCollections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookmarkCollections.
     */
    distinct?: BookmarkCollectionScalarFieldEnum | BookmarkCollectionScalarFieldEnum[]
  }

  /**
   * BookmarkCollection findMany
   */
  export type BookmarkCollectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkCollection
     */
    select?: BookmarkCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkCollection
     */
    omit?: BookmarkCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkCollectionInclude<ExtArgs> | null
    /**
     * Filter, which BookmarkCollections to fetch.
     */
    where?: BookmarkCollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookmarkCollections to fetch.
     */
    orderBy?: BookmarkCollectionOrderByWithRelationInput | BookmarkCollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BookmarkCollections.
     */
    cursor?: BookmarkCollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookmarkCollections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookmarkCollections.
     */
    skip?: number
    distinct?: BookmarkCollectionScalarFieldEnum | BookmarkCollectionScalarFieldEnum[]
  }

  /**
   * BookmarkCollection create
   */
  export type BookmarkCollectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkCollection
     */
    select?: BookmarkCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkCollection
     */
    omit?: BookmarkCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkCollectionInclude<ExtArgs> | null
    /**
     * The data needed to create a BookmarkCollection.
     */
    data: XOR<BookmarkCollectionCreateInput, BookmarkCollectionUncheckedCreateInput>
  }

  /**
   * BookmarkCollection createMany
   */
  export type BookmarkCollectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BookmarkCollections.
     */
    data: BookmarkCollectionCreateManyInput | BookmarkCollectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BookmarkCollection createManyAndReturn
   */
  export type BookmarkCollectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkCollection
     */
    select?: BookmarkCollectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkCollection
     */
    omit?: BookmarkCollectionOmit<ExtArgs> | null
    /**
     * The data used to create many BookmarkCollections.
     */
    data: BookmarkCollectionCreateManyInput | BookmarkCollectionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkCollectionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BookmarkCollection update
   */
  export type BookmarkCollectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkCollection
     */
    select?: BookmarkCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkCollection
     */
    omit?: BookmarkCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkCollectionInclude<ExtArgs> | null
    /**
     * The data needed to update a BookmarkCollection.
     */
    data: XOR<BookmarkCollectionUpdateInput, BookmarkCollectionUncheckedUpdateInput>
    /**
     * Choose, which BookmarkCollection to update.
     */
    where: BookmarkCollectionWhereUniqueInput
  }

  /**
   * BookmarkCollection updateMany
   */
  export type BookmarkCollectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BookmarkCollections.
     */
    data: XOR<BookmarkCollectionUpdateManyMutationInput, BookmarkCollectionUncheckedUpdateManyInput>
    /**
     * Filter which BookmarkCollections to update
     */
    where?: BookmarkCollectionWhereInput
    /**
     * Limit how many BookmarkCollections to update.
     */
    limit?: number
  }

  /**
   * BookmarkCollection updateManyAndReturn
   */
  export type BookmarkCollectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkCollection
     */
    select?: BookmarkCollectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkCollection
     */
    omit?: BookmarkCollectionOmit<ExtArgs> | null
    /**
     * The data used to update BookmarkCollections.
     */
    data: XOR<BookmarkCollectionUpdateManyMutationInput, BookmarkCollectionUncheckedUpdateManyInput>
    /**
     * Filter which BookmarkCollections to update
     */
    where?: BookmarkCollectionWhereInput
    /**
     * Limit how many BookmarkCollections to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkCollectionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BookmarkCollection upsert
   */
  export type BookmarkCollectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkCollection
     */
    select?: BookmarkCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkCollection
     */
    omit?: BookmarkCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkCollectionInclude<ExtArgs> | null
    /**
     * The filter to search for the BookmarkCollection to update in case it exists.
     */
    where: BookmarkCollectionWhereUniqueInput
    /**
     * In case the BookmarkCollection found by the `where` argument doesn't exist, create a new BookmarkCollection with this data.
     */
    create: XOR<BookmarkCollectionCreateInput, BookmarkCollectionUncheckedCreateInput>
    /**
     * In case the BookmarkCollection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookmarkCollectionUpdateInput, BookmarkCollectionUncheckedUpdateInput>
  }

  /**
   * BookmarkCollection delete
   */
  export type BookmarkCollectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkCollection
     */
    select?: BookmarkCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkCollection
     */
    omit?: BookmarkCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkCollectionInclude<ExtArgs> | null
    /**
     * Filter which BookmarkCollection to delete.
     */
    where: BookmarkCollectionWhereUniqueInput
  }

  /**
   * BookmarkCollection deleteMany
   */
  export type BookmarkCollectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookmarkCollections to delete
     */
    where?: BookmarkCollectionWhereInput
    /**
     * Limit how many BookmarkCollections to delete.
     */
    limit?: number
  }

  /**
   * BookmarkCollection without action
   */
  export type BookmarkCollectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookmarkCollection
     */
    select?: BookmarkCollectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookmarkCollection
     */
    omit?: BookmarkCollectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookmarkCollectionInclude<ExtArgs> | null
  }


  /**
   * Model CollectionCollaborator
   */

  export type AggregateCollectionCollaborator = {
    _count: CollectionCollaboratorCountAggregateOutputType | null
    _min: CollectionCollaboratorMinAggregateOutputType | null
    _max: CollectionCollaboratorMaxAggregateOutputType | null
  }

  export type CollectionCollaboratorMinAggregateOutputType = {
    collectionId: string | null
    userId: string | null
    permission: $Enums.Role | null
    addedAt: Date | null
  }

  export type CollectionCollaboratorMaxAggregateOutputType = {
    collectionId: string | null
    userId: string | null
    permission: $Enums.Role | null
    addedAt: Date | null
  }

  export type CollectionCollaboratorCountAggregateOutputType = {
    collectionId: number
    userId: number
    permission: number
    addedAt: number
    _all: number
  }


  export type CollectionCollaboratorMinAggregateInputType = {
    collectionId?: true
    userId?: true
    permission?: true
    addedAt?: true
  }

  export type CollectionCollaboratorMaxAggregateInputType = {
    collectionId?: true
    userId?: true
    permission?: true
    addedAt?: true
  }

  export type CollectionCollaboratorCountAggregateInputType = {
    collectionId?: true
    userId?: true
    permission?: true
    addedAt?: true
    _all?: true
  }

  export type CollectionCollaboratorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CollectionCollaborator to aggregate.
     */
    where?: CollectionCollaboratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CollectionCollaborators to fetch.
     */
    orderBy?: CollectionCollaboratorOrderByWithRelationInput | CollectionCollaboratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CollectionCollaboratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CollectionCollaborators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CollectionCollaborators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CollectionCollaborators
    **/
    _count?: true | CollectionCollaboratorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CollectionCollaboratorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CollectionCollaboratorMaxAggregateInputType
  }

  export type GetCollectionCollaboratorAggregateType<T extends CollectionCollaboratorAggregateArgs> = {
        [P in keyof T & keyof AggregateCollectionCollaborator]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCollectionCollaborator[P]>
      : GetScalarType<T[P], AggregateCollectionCollaborator[P]>
  }




  export type CollectionCollaboratorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CollectionCollaboratorWhereInput
    orderBy?: CollectionCollaboratorOrderByWithAggregationInput | CollectionCollaboratorOrderByWithAggregationInput[]
    by: CollectionCollaboratorScalarFieldEnum[] | CollectionCollaboratorScalarFieldEnum
    having?: CollectionCollaboratorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CollectionCollaboratorCountAggregateInputType | true
    _min?: CollectionCollaboratorMinAggregateInputType
    _max?: CollectionCollaboratorMaxAggregateInputType
  }

  export type CollectionCollaboratorGroupByOutputType = {
    collectionId: string
    userId: string
    permission: $Enums.Role
    addedAt: Date
    _count: CollectionCollaboratorCountAggregateOutputType | null
    _min: CollectionCollaboratorMinAggregateOutputType | null
    _max: CollectionCollaboratorMaxAggregateOutputType | null
  }

  type GetCollectionCollaboratorGroupByPayload<T extends CollectionCollaboratorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CollectionCollaboratorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CollectionCollaboratorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CollectionCollaboratorGroupByOutputType[P]>
            : GetScalarType<T[P], CollectionCollaboratorGroupByOutputType[P]>
        }
      >
    >


  export type CollectionCollaboratorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    collectionId?: boolean
    userId?: boolean
    permission?: boolean
    addedAt?: boolean
    collection?: boolean | CollectionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collectionCollaborator"]>

  export type CollectionCollaboratorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    collectionId?: boolean
    userId?: boolean
    permission?: boolean
    addedAt?: boolean
    collection?: boolean | CollectionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collectionCollaborator"]>

  export type CollectionCollaboratorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    collectionId?: boolean
    userId?: boolean
    permission?: boolean
    addedAt?: boolean
    collection?: boolean | CollectionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collectionCollaborator"]>

  export type CollectionCollaboratorSelectScalar = {
    collectionId?: boolean
    userId?: boolean
    permission?: boolean
    addedAt?: boolean
  }

  export type CollectionCollaboratorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"collectionId" | "userId" | "permission" | "addedAt", ExtArgs["result"]["collectionCollaborator"]>
  export type CollectionCollaboratorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    collection?: boolean | CollectionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CollectionCollaboratorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    collection?: boolean | CollectionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CollectionCollaboratorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    collection?: boolean | CollectionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CollectionCollaboratorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CollectionCollaborator"
    objects: {
      collection: Prisma.$CollectionPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      collectionId: string
      userId: string
      permission: $Enums.Role
      addedAt: Date
    }, ExtArgs["result"]["collectionCollaborator"]>
    composites: {}
  }

  type CollectionCollaboratorGetPayload<S extends boolean | null | undefined | CollectionCollaboratorDefaultArgs> = $Result.GetResult<Prisma.$CollectionCollaboratorPayload, S>

  type CollectionCollaboratorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CollectionCollaboratorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CollectionCollaboratorCountAggregateInputType | true
    }

  export interface CollectionCollaboratorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CollectionCollaborator'], meta: { name: 'CollectionCollaborator' } }
    /**
     * Find zero or one CollectionCollaborator that matches the filter.
     * @param {CollectionCollaboratorFindUniqueArgs} args - Arguments to find a CollectionCollaborator
     * @example
     * // Get one CollectionCollaborator
     * const collectionCollaborator = await prisma.collectionCollaborator.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CollectionCollaboratorFindUniqueArgs>(args: SelectSubset<T, CollectionCollaboratorFindUniqueArgs<ExtArgs>>): Prisma__CollectionCollaboratorClient<$Result.GetResult<Prisma.$CollectionCollaboratorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CollectionCollaborator that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CollectionCollaboratorFindUniqueOrThrowArgs} args - Arguments to find a CollectionCollaborator
     * @example
     * // Get one CollectionCollaborator
     * const collectionCollaborator = await prisma.collectionCollaborator.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CollectionCollaboratorFindUniqueOrThrowArgs>(args: SelectSubset<T, CollectionCollaboratorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CollectionCollaboratorClient<$Result.GetResult<Prisma.$CollectionCollaboratorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CollectionCollaborator that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionCollaboratorFindFirstArgs} args - Arguments to find a CollectionCollaborator
     * @example
     * // Get one CollectionCollaborator
     * const collectionCollaborator = await prisma.collectionCollaborator.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CollectionCollaboratorFindFirstArgs>(args?: SelectSubset<T, CollectionCollaboratorFindFirstArgs<ExtArgs>>): Prisma__CollectionCollaboratorClient<$Result.GetResult<Prisma.$CollectionCollaboratorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CollectionCollaborator that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionCollaboratorFindFirstOrThrowArgs} args - Arguments to find a CollectionCollaborator
     * @example
     * // Get one CollectionCollaborator
     * const collectionCollaborator = await prisma.collectionCollaborator.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CollectionCollaboratorFindFirstOrThrowArgs>(args?: SelectSubset<T, CollectionCollaboratorFindFirstOrThrowArgs<ExtArgs>>): Prisma__CollectionCollaboratorClient<$Result.GetResult<Prisma.$CollectionCollaboratorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CollectionCollaborators that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionCollaboratorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CollectionCollaborators
     * const collectionCollaborators = await prisma.collectionCollaborator.findMany()
     * 
     * // Get first 10 CollectionCollaborators
     * const collectionCollaborators = await prisma.collectionCollaborator.findMany({ take: 10 })
     * 
     * // Only select the `collectionId`
     * const collectionCollaboratorWithCollectionIdOnly = await prisma.collectionCollaborator.findMany({ select: { collectionId: true } })
     * 
     */
    findMany<T extends CollectionCollaboratorFindManyArgs>(args?: SelectSubset<T, CollectionCollaboratorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionCollaboratorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CollectionCollaborator.
     * @param {CollectionCollaboratorCreateArgs} args - Arguments to create a CollectionCollaborator.
     * @example
     * // Create one CollectionCollaborator
     * const CollectionCollaborator = await prisma.collectionCollaborator.create({
     *   data: {
     *     // ... data to create a CollectionCollaborator
     *   }
     * })
     * 
     */
    create<T extends CollectionCollaboratorCreateArgs>(args: SelectSubset<T, CollectionCollaboratorCreateArgs<ExtArgs>>): Prisma__CollectionCollaboratorClient<$Result.GetResult<Prisma.$CollectionCollaboratorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CollectionCollaborators.
     * @param {CollectionCollaboratorCreateManyArgs} args - Arguments to create many CollectionCollaborators.
     * @example
     * // Create many CollectionCollaborators
     * const collectionCollaborator = await prisma.collectionCollaborator.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CollectionCollaboratorCreateManyArgs>(args?: SelectSubset<T, CollectionCollaboratorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CollectionCollaborators and returns the data saved in the database.
     * @param {CollectionCollaboratorCreateManyAndReturnArgs} args - Arguments to create many CollectionCollaborators.
     * @example
     * // Create many CollectionCollaborators
     * const collectionCollaborator = await prisma.collectionCollaborator.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CollectionCollaborators and only return the `collectionId`
     * const collectionCollaboratorWithCollectionIdOnly = await prisma.collectionCollaborator.createManyAndReturn({
     *   select: { collectionId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CollectionCollaboratorCreateManyAndReturnArgs>(args?: SelectSubset<T, CollectionCollaboratorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionCollaboratorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CollectionCollaborator.
     * @param {CollectionCollaboratorDeleteArgs} args - Arguments to delete one CollectionCollaborator.
     * @example
     * // Delete one CollectionCollaborator
     * const CollectionCollaborator = await prisma.collectionCollaborator.delete({
     *   where: {
     *     // ... filter to delete one CollectionCollaborator
     *   }
     * })
     * 
     */
    delete<T extends CollectionCollaboratorDeleteArgs>(args: SelectSubset<T, CollectionCollaboratorDeleteArgs<ExtArgs>>): Prisma__CollectionCollaboratorClient<$Result.GetResult<Prisma.$CollectionCollaboratorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CollectionCollaborator.
     * @param {CollectionCollaboratorUpdateArgs} args - Arguments to update one CollectionCollaborator.
     * @example
     * // Update one CollectionCollaborator
     * const collectionCollaborator = await prisma.collectionCollaborator.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CollectionCollaboratorUpdateArgs>(args: SelectSubset<T, CollectionCollaboratorUpdateArgs<ExtArgs>>): Prisma__CollectionCollaboratorClient<$Result.GetResult<Prisma.$CollectionCollaboratorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CollectionCollaborators.
     * @param {CollectionCollaboratorDeleteManyArgs} args - Arguments to filter CollectionCollaborators to delete.
     * @example
     * // Delete a few CollectionCollaborators
     * const { count } = await prisma.collectionCollaborator.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CollectionCollaboratorDeleteManyArgs>(args?: SelectSubset<T, CollectionCollaboratorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CollectionCollaborators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionCollaboratorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CollectionCollaborators
     * const collectionCollaborator = await prisma.collectionCollaborator.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CollectionCollaboratorUpdateManyArgs>(args: SelectSubset<T, CollectionCollaboratorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CollectionCollaborators and returns the data updated in the database.
     * @param {CollectionCollaboratorUpdateManyAndReturnArgs} args - Arguments to update many CollectionCollaborators.
     * @example
     * // Update many CollectionCollaborators
     * const collectionCollaborator = await prisma.collectionCollaborator.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CollectionCollaborators and only return the `collectionId`
     * const collectionCollaboratorWithCollectionIdOnly = await prisma.collectionCollaborator.updateManyAndReturn({
     *   select: { collectionId: true },
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
    updateManyAndReturn<T extends CollectionCollaboratorUpdateManyAndReturnArgs>(args: SelectSubset<T, CollectionCollaboratorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionCollaboratorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CollectionCollaborator.
     * @param {CollectionCollaboratorUpsertArgs} args - Arguments to update or create a CollectionCollaborator.
     * @example
     * // Update or create a CollectionCollaborator
     * const collectionCollaborator = await prisma.collectionCollaborator.upsert({
     *   create: {
     *     // ... data to create a CollectionCollaborator
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CollectionCollaborator we want to update
     *   }
     * })
     */
    upsert<T extends CollectionCollaboratorUpsertArgs>(args: SelectSubset<T, CollectionCollaboratorUpsertArgs<ExtArgs>>): Prisma__CollectionCollaboratorClient<$Result.GetResult<Prisma.$CollectionCollaboratorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CollectionCollaborators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionCollaboratorCountArgs} args - Arguments to filter CollectionCollaborators to count.
     * @example
     * // Count the number of CollectionCollaborators
     * const count = await prisma.collectionCollaborator.count({
     *   where: {
     *     // ... the filter for the CollectionCollaborators we want to count
     *   }
     * })
    **/
    count<T extends CollectionCollaboratorCountArgs>(
      args?: Subset<T, CollectionCollaboratorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CollectionCollaboratorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CollectionCollaborator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionCollaboratorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CollectionCollaboratorAggregateArgs>(args: Subset<T, CollectionCollaboratorAggregateArgs>): Prisma.PrismaPromise<GetCollectionCollaboratorAggregateType<T>>

    /**
     * Group by CollectionCollaborator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionCollaboratorGroupByArgs} args - Group by arguments.
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
      T extends CollectionCollaboratorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CollectionCollaboratorGroupByArgs['orderBy'] }
        : { orderBy?: CollectionCollaboratorGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CollectionCollaboratorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCollectionCollaboratorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CollectionCollaborator model
   */
  readonly fields: CollectionCollaboratorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CollectionCollaborator.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CollectionCollaboratorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    collection<T extends CollectionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CollectionDefaultArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the CollectionCollaborator model
   */
  interface CollectionCollaboratorFieldRefs {
    readonly collectionId: FieldRef<"CollectionCollaborator", 'String'>
    readonly userId: FieldRef<"CollectionCollaborator", 'String'>
    readonly permission: FieldRef<"CollectionCollaborator", 'Role'>
    readonly addedAt: FieldRef<"CollectionCollaborator", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CollectionCollaborator findUnique
   */
  export type CollectionCollaboratorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionCollaborator
     */
    select?: CollectionCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectionCollaborator
     */
    omit?: CollectionCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionCollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which CollectionCollaborator to fetch.
     */
    where: CollectionCollaboratorWhereUniqueInput
  }

  /**
   * CollectionCollaborator findUniqueOrThrow
   */
  export type CollectionCollaboratorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionCollaborator
     */
    select?: CollectionCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectionCollaborator
     */
    omit?: CollectionCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionCollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which CollectionCollaborator to fetch.
     */
    where: CollectionCollaboratorWhereUniqueInput
  }

  /**
   * CollectionCollaborator findFirst
   */
  export type CollectionCollaboratorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionCollaborator
     */
    select?: CollectionCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectionCollaborator
     */
    omit?: CollectionCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionCollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which CollectionCollaborator to fetch.
     */
    where?: CollectionCollaboratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CollectionCollaborators to fetch.
     */
    orderBy?: CollectionCollaboratorOrderByWithRelationInput | CollectionCollaboratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CollectionCollaborators.
     */
    cursor?: CollectionCollaboratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CollectionCollaborators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CollectionCollaborators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CollectionCollaborators.
     */
    distinct?: CollectionCollaboratorScalarFieldEnum | CollectionCollaboratorScalarFieldEnum[]
  }

  /**
   * CollectionCollaborator findFirstOrThrow
   */
  export type CollectionCollaboratorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionCollaborator
     */
    select?: CollectionCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectionCollaborator
     */
    omit?: CollectionCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionCollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which CollectionCollaborator to fetch.
     */
    where?: CollectionCollaboratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CollectionCollaborators to fetch.
     */
    orderBy?: CollectionCollaboratorOrderByWithRelationInput | CollectionCollaboratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CollectionCollaborators.
     */
    cursor?: CollectionCollaboratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CollectionCollaborators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CollectionCollaborators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CollectionCollaborators.
     */
    distinct?: CollectionCollaboratorScalarFieldEnum | CollectionCollaboratorScalarFieldEnum[]
  }

  /**
   * CollectionCollaborator findMany
   */
  export type CollectionCollaboratorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionCollaborator
     */
    select?: CollectionCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectionCollaborator
     */
    omit?: CollectionCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionCollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which CollectionCollaborators to fetch.
     */
    where?: CollectionCollaboratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CollectionCollaborators to fetch.
     */
    orderBy?: CollectionCollaboratorOrderByWithRelationInput | CollectionCollaboratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CollectionCollaborators.
     */
    cursor?: CollectionCollaboratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CollectionCollaborators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CollectionCollaborators.
     */
    skip?: number
    distinct?: CollectionCollaboratorScalarFieldEnum | CollectionCollaboratorScalarFieldEnum[]
  }

  /**
   * CollectionCollaborator create
   */
  export type CollectionCollaboratorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionCollaborator
     */
    select?: CollectionCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectionCollaborator
     */
    omit?: CollectionCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionCollaboratorInclude<ExtArgs> | null
    /**
     * The data needed to create a CollectionCollaborator.
     */
    data: XOR<CollectionCollaboratorCreateInput, CollectionCollaboratorUncheckedCreateInput>
  }

  /**
   * CollectionCollaborator createMany
   */
  export type CollectionCollaboratorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CollectionCollaborators.
     */
    data: CollectionCollaboratorCreateManyInput | CollectionCollaboratorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CollectionCollaborator createManyAndReturn
   */
  export type CollectionCollaboratorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionCollaborator
     */
    select?: CollectionCollaboratorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CollectionCollaborator
     */
    omit?: CollectionCollaboratorOmit<ExtArgs> | null
    /**
     * The data used to create many CollectionCollaborators.
     */
    data: CollectionCollaboratorCreateManyInput | CollectionCollaboratorCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionCollaboratorIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CollectionCollaborator update
   */
  export type CollectionCollaboratorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionCollaborator
     */
    select?: CollectionCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectionCollaborator
     */
    omit?: CollectionCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionCollaboratorInclude<ExtArgs> | null
    /**
     * The data needed to update a CollectionCollaborator.
     */
    data: XOR<CollectionCollaboratorUpdateInput, CollectionCollaboratorUncheckedUpdateInput>
    /**
     * Choose, which CollectionCollaborator to update.
     */
    where: CollectionCollaboratorWhereUniqueInput
  }

  /**
   * CollectionCollaborator updateMany
   */
  export type CollectionCollaboratorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CollectionCollaborators.
     */
    data: XOR<CollectionCollaboratorUpdateManyMutationInput, CollectionCollaboratorUncheckedUpdateManyInput>
    /**
     * Filter which CollectionCollaborators to update
     */
    where?: CollectionCollaboratorWhereInput
    /**
     * Limit how many CollectionCollaborators to update.
     */
    limit?: number
  }

  /**
   * CollectionCollaborator updateManyAndReturn
   */
  export type CollectionCollaboratorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionCollaborator
     */
    select?: CollectionCollaboratorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CollectionCollaborator
     */
    omit?: CollectionCollaboratorOmit<ExtArgs> | null
    /**
     * The data used to update CollectionCollaborators.
     */
    data: XOR<CollectionCollaboratorUpdateManyMutationInput, CollectionCollaboratorUncheckedUpdateManyInput>
    /**
     * Filter which CollectionCollaborators to update
     */
    where?: CollectionCollaboratorWhereInput
    /**
     * Limit how many CollectionCollaborators to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionCollaboratorIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CollectionCollaborator upsert
   */
  export type CollectionCollaboratorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionCollaborator
     */
    select?: CollectionCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectionCollaborator
     */
    omit?: CollectionCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionCollaboratorInclude<ExtArgs> | null
    /**
     * The filter to search for the CollectionCollaborator to update in case it exists.
     */
    where: CollectionCollaboratorWhereUniqueInput
    /**
     * In case the CollectionCollaborator found by the `where` argument doesn't exist, create a new CollectionCollaborator with this data.
     */
    create: XOR<CollectionCollaboratorCreateInput, CollectionCollaboratorUncheckedCreateInput>
    /**
     * In case the CollectionCollaborator was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CollectionCollaboratorUpdateInput, CollectionCollaboratorUncheckedUpdateInput>
  }

  /**
   * CollectionCollaborator delete
   */
  export type CollectionCollaboratorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionCollaborator
     */
    select?: CollectionCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectionCollaborator
     */
    omit?: CollectionCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionCollaboratorInclude<ExtArgs> | null
    /**
     * Filter which CollectionCollaborator to delete.
     */
    where: CollectionCollaboratorWhereUniqueInput
  }

  /**
   * CollectionCollaborator deleteMany
   */
  export type CollectionCollaboratorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CollectionCollaborators to delete
     */
    where?: CollectionCollaboratorWhereInput
    /**
     * Limit how many CollectionCollaborators to delete.
     */
    limit?: number
  }

  /**
   * CollectionCollaborator without action
   */
  export type CollectionCollaboratorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionCollaborator
     */
    select?: CollectionCollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollectionCollaborator
     */
    omit?: CollectionCollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionCollaboratorInclude<ExtArgs> | null
  }


  /**
   * Model Device
   */

  export type AggregateDevice = {
    _count: DeviceCountAggregateOutputType | null
    _min: DeviceMinAggregateOutputType | null
    _max: DeviceMaxAggregateOutputType | null
  }

  export type DeviceMinAggregateOutputType = {
    id: string | null
    userId: string | null
    deviceName: string | null
    deviceType: string | null
    lastSynced: Date | null
    lastActive: Date | null
  }

  export type DeviceMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    deviceName: string | null
    deviceType: string | null
    lastSynced: Date | null
    lastActive: Date | null
  }

  export type DeviceCountAggregateOutputType = {
    id: number
    userId: number
    deviceName: number
    deviceType: number
    lastSynced: number
    lastActive: number
    _all: number
  }


  export type DeviceMinAggregateInputType = {
    id?: true
    userId?: true
    deviceName?: true
    deviceType?: true
    lastSynced?: true
    lastActive?: true
  }

  export type DeviceMaxAggregateInputType = {
    id?: true
    userId?: true
    deviceName?: true
    deviceType?: true
    lastSynced?: true
    lastActive?: true
  }

  export type DeviceCountAggregateInputType = {
    id?: true
    userId?: true
    deviceName?: true
    deviceType?: true
    lastSynced?: true
    lastActive?: true
    _all?: true
  }

  export type DeviceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Device to aggregate.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Devices
    **/
    _count?: true | DeviceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeviceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeviceMaxAggregateInputType
  }

  export type GetDeviceAggregateType<T extends DeviceAggregateArgs> = {
        [P in keyof T & keyof AggregateDevice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDevice[P]>
      : GetScalarType<T[P], AggregateDevice[P]>
  }




  export type DeviceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeviceWhereInput
    orderBy?: DeviceOrderByWithAggregationInput | DeviceOrderByWithAggregationInput[]
    by: DeviceScalarFieldEnum[] | DeviceScalarFieldEnum
    having?: DeviceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeviceCountAggregateInputType | true
    _min?: DeviceMinAggregateInputType
    _max?: DeviceMaxAggregateInputType
  }

  export type DeviceGroupByOutputType = {
    id: string
    userId: string
    deviceName: string
    deviceType: string
    lastSynced: Date
    lastActive: Date
    _count: DeviceCountAggregateOutputType | null
    _min: DeviceMinAggregateOutputType | null
    _max: DeviceMaxAggregateOutputType | null
  }

  type GetDeviceGroupByPayload<T extends DeviceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeviceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeviceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeviceGroupByOutputType[P]>
            : GetScalarType<T[P], DeviceGroupByOutputType[P]>
        }
      >
    >


  export type DeviceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    deviceName?: boolean
    deviceType?: boolean
    lastSynced?: boolean
    lastActive?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["device"]>

  export type DeviceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    deviceName?: boolean
    deviceType?: boolean
    lastSynced?: boolean
    lastActive?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["device"]>

  export type DeviceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    deviceName?: boolean
    deviceType?: boolean
    lastSynced?: boolean
    lastActive?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["device"]>

  export type DeviceSelectScalar = {
    id?: boolean
    userId?: boolean
    deviceName?: boolean
    deviceType?: boolean
    lastSynced?: boolean
    lastActive?: boolean
  }

  export type DeviceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "deviceName" | "deviceType" | "lastSynced" | "lastActive", ExtArgs["result"]["device"]>
  export type DeviceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DeviceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DeviceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $DevicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Device"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      deviceName: string
      deviceType: string
      lastSynced: Date
      lastActive: Date
    }, ExtArgs["result"]["device"]>
    composites: {}
  }

  type DeviceGetPayload<S extends boolean | null | undefined | DeviceDefaultArgs> = $Result.GetResult<Prisma.$DevicePayload, S>

  type DeviceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DeviceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DeviceCountAggregateInputType | true
    }

  export interface DeviceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Device'], meta: { name: 'Device' } }
    /**
     * Find zero or one Device that matches the filter.
     * @param {DeviceFindUniqueArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeviceFindUniqueArgs>(args: SelectSubset<T, DeviceFindUniqueArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Device that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DeviceFindUniqueOrThrowArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeviceFindUniqueOrThrowArgs>(args: SelectSubset<T, DeviceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Device that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceFindFirstArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeviceFindFirstArgs>(args?: SelectSubset<T, DeviceFindFirstArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Device that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceFindFirstOrThrowArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeviceFindFirstOrThrowArgs>(args?: SelectSubset<T, DeviceFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Devices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Devices
     * const devices = await prisma.device.findMany()
     * 
     * // Get first 10 Devices
     * const devices = await prisma.device.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const deviceWithIdOnly = await prisma.device.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DeviceFindManyArgs>(args?: SelectSubset<T, DeviceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Device.
     * @param {DeviceCreateArgs} args - Arguments to create a Device.
     * @example
     * // Create one Device
     * const Device = await prisma.device.create({
     *   data: {
     *     // ... data to create a Device
     *   }
     * })
     * 
     */
    create<T extends DeviceCreateArgs>(args: SelectSubset<T, DeviceCreateArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Devices.
     * @param {DeviceCreateManyArgs} args - Arguments to create many Devices.
     * @example
     * // Create many Devices
     * const device = await prisma.device.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeviceCreateManyArgs>(args?: SelectSubset<T, DeviceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Devices and returns the data saved in the database.
     * @param {DeviceCreateManyAndReturnArgs} args - Arguments to create many Devices.
     * @example
     * // Create many Devices
     * const device = await prisma.device.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Devices and only return the `id`
     * const deviceWithIdOnly = await prisma.device.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeviceCreateManyAndReturnArgs>(args?: SelectSubset<T, DeviceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Device.
     * @param {DeviceDeleteArgs} args - Arguments to delete one Device.
     * @example
     * // Delete one Device
     * const Device = await prisma.device.delete({
     *   where: {
     *     // ... filter to delete one Device
     *   }
     * })
     * 
     */
    delete<T extends DeviceDeleteArgs>(args: SelectSubset<T, DeviceDeleteArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Device.
     * @param {DeviceUpdateArgs} args - Arguments to update one Device.
     * @example
     * // Update one Device
     * const device = await prisma.device.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeviceUpdateArgs>(args: SelectSubset<T, DeviceUpdateArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Devices.
     * @param {DeviceDeleteManyArgs} args - Arguments to filter Devices to delete.
     * @example
     * // Delete a few Devices
     * const { count } = await prisma.device.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeviceDeleteManyArgs>(args?: SelectSubset<T, DeviceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Devices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Devices
     * const device = await prisma.device.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeviceUpdateManyArgs>(args: SelectSubset<T, DeviceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Devices and returns the data updated in the database.
     * @param {DeviceUpdateManyAndReturnArgs} args - Arguments to update many Devices.
     * @example
     * // Update many Devices
     * const device = await prisma.device.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Devices and only return the `id`
     * const deviceWithIdOnly = await prisma.device.updateManyAndReturn({
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
    updateManyAndReturn<T extends DeviceUpdateManyAndReturnArgs>(args: SelectSubset<T, DeviceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Device.
     * @param {DeviceUpsertArgs} args - Arguments to update or create a Device.
     * @example
     * // Update or create a Device
     * const device = await prisma.device.upsert({
     *   create: {
     *     // ... data to create a Device
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Device we want to update
     *   }
     * })
     */
    upsert<T extends DeviceUpsertArgs>(args: SelectSubset<T, DeviceUpsertArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Devices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceCountArgs} args - Arguments to filter Devices to count.
     * @example
     * // Count the number of Devices
     * const count = await prisma.device.count({
     *   where: {
     *     // ... the filter for the Devices we want to count
     *   }
     * })
    **/
    count<T extends DeviceCountArgs>(
      args?: Subset<T, DeviceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeviceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Device.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DeviceAggregateArgs>(args: Subset<T, DeviceAggregateArgs>): Prisma.PrismaPromise<GetDeviceAggregateType<T>>

    /**
     * Group by Device.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceGroupByArgs} args - Group by arguments.
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
      T extends DeviceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeviceGroupByArgs['orderBy'] }
        : { orderBy?: DeviceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DeviceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeviceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Device model
   */
  readonly fields: DeviceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Device.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeviceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Device model
   */
  interface DeviceFieldRefs {
    readonly id: FieldRef<"Device", 'String'>
    readonly userId: FieldRef<"Device", 'String'>
    readonly deviceName: FieldRef<"Device", 'String'>
    readonly deviceType: FieldRef<"Device", 'String'>
    readonly lastSynced: FieldRef<"Device", 'DateTime'>
    readonly lastActive: FieldRef<"Device", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Device findUnique
   */
  export type DeviceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device findUniqueOrThrow
   */
  export type DeviceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device findFirst
   */
  export type DeviceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Devices.
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Devices.
     */
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * Device findFirstOrThrow
   */
  export type DeviceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Devices.
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Devices.
     */
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * Device findMany
   */
  export type DeviceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Devices to fetch.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Devices.
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * Device create
   */
  export type DeviceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * The data needed to create a Device.
     */
    data: XOR<DeviceCreateInput, DeviceUncheckedCreateInput>
  }

  /**
   * Device createMany
   */
  export type DeviceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Devices.
     */
    data: DeviceCreateManyInput | DeviceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Device createManyAndReturn
   */
  export type DeviceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * The data used to create many Devices.
     */
    data: DeviceCreateManyInput | DeviceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Device update
   */
  export type DeviceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * The data needed to update a Device.
     */
    data: XOR<DeviceUpdateInput, DeviceUncheckedUpdateInput>
    /**
     * Choose, which Device to update.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device updateMany
   */
  export type DeviceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Devices.
     */
    data: XOR<DeviceUpdateManyMutationInput, DeviceUncheckedUpdateManyInput>
    /**
     * Filter which Devices to update
     */
    where?: DeviceWhereInput
    /**
     * Limit how many Devices to update.
     */
    limit?: number
  }

  /**
   * Device updateManyAndReturn
   */
  export type DeviceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * The data used to update Devices.
     */
    data: XOR<DeviceUpdateManyMutationInput, DeviceUncheckedUpdateManyInput>
    /**
     * Filter which Devices to update
     */
    where?: DeviceWhereInput
    /**
     * Limit how many Devices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Device upsert
   */
  export type DeviceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * The filter to search for the Device to update in case it exists.
     */
    where: DeviceWhereUniqueInput
    /**
     * In case the Device found by the `where` argument doesn't exist, create a new Device with this data.
     */
    create: XOR<DeviceCreateInput, DeviceUncheckedCreateInput>
    /**
     * In case the Device was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeviceUpdateInput, DeviceUncheckedUpdateInput>
  }

  /**
   * Device delete
   */
  export type DeviceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter which Device to delete.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device deleteMany
   */
  export type DeviceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Devices to delete
     */
    where?: DeviceWhereInput
    /**
     * Limit how many Devices to delete.
     */
    limit?: number
  }

  /**
   * Device without action
   */
  export type DeviceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
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


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    username: 'username',
    password: 'password',
    name: 'name',
    profileImage: 'profileImage',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    isActive: 'isActive',
    lastLogin: 'lastLogin',
    refreshToken: 'refreshToken',
    passwordResetToken: 'passwordResetToken',
    passwordResetExpires: 'passwordResetExpires',
    isVerified: 'isVerified',
    verificationToken: 'verificationToken'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const BookmarkScalarFieldEnum: {
    id: 'id',
    url: 'url',
    title: 'title',
    description: 'description',
    favicon: 'favicon',
    previewImage: 'previewImage',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastVisited: 'lastVisited',
    visitCount: 'visitCount',
    notes: 'notes',
    userId: 'userId',
    isDeleted: 'isDeleted',
    deletedAt: 'deletedAt'
  };

  export type BookmarkScalarFieldEnum = (typeof BookmarkScalarFieldEnum)[keyof typeof BookmarkScalarFieldEnum]


  export const FolderScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    icon: 'icon',
    color: 'color',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    parentId: 'parentId',
    isDeleted: 'isDeleted',
    deletedAt: 'deletedAt'
  };

  export type FolderScalarFieldEnum = (typeof FolderScalarFieldEnum)[keyof typeof FolderScalarFieldEnum]


  export const FolderBookmarkScalarFieldEnum: {
    folderId: 'folderId',
    bookmarkId: 'bookmarkId',
    addedAt: 'addedAt'
  };

  export type FolderBookmarkScalarFieldEnum = (typeof FolderBookmarkScalarFieldEnum)[keyof typeof FolderBookmarkScalarFieldEnum]


  export const FolderCollaboratorScalarFieldEnum: {
    folderId: 'folderId',
    userId: 'userId',
    permission: 'permission',
    addedAt: 'addedAt'
  };

  export type FolderCollaboratorScalarFieldEnum = (typeof FolderCollaboratorScalarFieldEnum)[keyof typeof FolderCollaboratorScalarFieldEnum]


  export const TagScalarFieldEnum: {
    id: 'id',
    name: 'name',
    color: 'color',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    isDeleted: 'isDeleted',
    deletedAt: 'deletedAt'
  };

  export type TagScalarFieldEnum = (typeof TagScalarFieldEnum)[keyof typeof TagScalarFieldEnum]


  export const BookmarkTagScalarFieldEnum: {
    tagId: 'tagId',
    bookmarkId: 'bookmarkId',
    addedAt: 'addedAt'
  };

  export type BookmarkTagScalarFieldEnum = (typeof BookmarkTagScalarFieldEnum)[keyof typeof BookmarkTagScalarFieldEnum]


  export const CollectionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    isPublic: 'isPublic',
    publicLink: 'publicLink',
    thumbnail: 'thumbnail',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    ownerId: 'ownerId',
    isDeleted: 'isDeleted',
    deletedAt: 'deletedAt'
  };

  export type CollectionScalarFieldEnum = (typeof CollectionScalarFieldEnum)[keyof typeof CollectionScalarFieldEnum]


  export const BookmarkCollectionScalarFieldEnum: {
    collectionId: 'collectionId',
    bookmarkId: 'bookmarkId',
    addedAt: 'addedAt',
    order: 'order'
  };

  export type BookmarkCollectionScalarFieldEnum = (typeof BookmarkCollectionScalarFieldEnum)[keyof typeof BookmarkCollectionScalarFieldEnum]


  export const CollectionCollaboratorScalarFieldEnum: {
    collectionId: 'collectionId',
    userId: 'userId',
    permission: 'permission',
    addedAt: 'addedAt'
  };

  export type CollectionCollaboratorScalarFieldEnum = (typeof CollectionCollaboratorScalarFieldEnum)[keyof typeof CollectionCollaboratorScalarFieldEnum]


  export const DeviceScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    deviceName: 'deviceName',
    deviceType: 'deviceType',
    lastSynced: 'lastSynced',
    lastActive: 'lastActive'
  };

  export type DeviceScalarFieldEnum = (typeof DeviceScalarFieldEnum)[keyof typeof DeviceScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


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


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    profileImage?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    isActive?: BoolFilter<"User"> | boolean
    lastLogin?: DateTimeNullableFilter<"User"> | Date | string | null
    refreshToken?: StringNullableFilter<"User"> | string | null
    passwordResetToken?: StringNullableFilter<"User"> | string | null
    passwordResetExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    isVerified?: BoolFilter<"User"> | boolean
    verificationToken?: StringNullableFilter<"User"> | string | null
    bookmarks?: BookmarkListRelationFilter
    folders?: FolderListRelationFilter
    tags?: TagListRelationFilter
    collections?: CollectionListRelationFilter
    ownedCollections?: CollectionListRelationFilter
    collabFolders?: FolderCollaboratorListRelationFilter
    collabCollections?: CollectionCollaboratorListRelationFilter
    devices?: DeviceListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrder
    name?: SortOrderInput | SortOrder
    profileImage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
    lastLogin?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    passwordResetToken?: SortOrderInput | SortOrder
    passwordResetExpires?: SortOrderInput | SortOrder
    isVerified?: SortOrder
    verificationToken?: SortOrderInput | SortOrder
    bookmarks?: BookmarkOrderByRelationAggregateInput
    folders?: FolderOrderByRelationAggregateInput
    tags?: TagOrderByRelationAggregateInput
    collections?: CollectionOrderByRelationAggregateInput
    ownedCollections?: CollectionOrderByRelationAggregateInput
    collabFolders?: FolderCollaboratorOrderByRelationAggregateInput
    collabCollections?: CollectionCollaboratorOrderByRelationAggregateInput
    devices?: DeviceOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    verificationToken?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    profileImage?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    isActive?: BoolFilter<"User"> | boolean
    lastLogin?: DateTimeNullableFilter<"User"> | Date | string | null
    refreshToken?: StringNullableFilter<"User"> | string | null
    passwordResetToken?: StringNullableFilter<"User"> | string | null
    passwordResetExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    isVerified?: BoolFilter<"User"> | boolean
    bookmarks?: BookmarkListRelationFilter
    folders?: FolderListRelationFilter
    tags?: TagListRelationFilter
    collections?: CollectionListRelationFilter
    ownedCollections?: CollectionListRelationFilter
    collabFolders?: FolderCollaboratorListRelationFilter
    collabCollections?: CollectionCollaboratorListRelationFilter
    devices?: DeviceListRelationFilter
  }, "id" | "email" | "username" | "verificationToken">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrder
    name?: SortOrderInput | SortOrder
    profileImage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
    lastLogin?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    passwordResetToken?: SortOrderInput | SortOrder
    passwordResetExpires?: SortOrderInput | SortOrder
    isVerified?: SortOrder
    verificationToken?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    profileImage?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    lastLogin?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    refreshToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    passwordResetToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    passwordResetExpires?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    isVerified?: BoolWithAggregatesFilter<"User"> | boolean
    verificationToken?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type BookmarkWhereInput = {
    AND?: BookmarkWhereInput | BookmarkWhereInput[]
    OR?: BookmarkWhereInput[]
    NOT?: BookmarkWhereInput | BookmarkWhereInput[]
    id?: StringFilter<"Bookmark"> | string
    url?: StringFilter<"Bookmark"> | string
    title?: StringFilter<"Bookmark"> | string
    description?: StringNullableFilter<"Bookmark"> | string | null
    favicon?: StringNullableFilter<"Bookmark"> | string | null
    previewImage?: StringNullableFilter<"Bookmark"> | string | null
    createdAt?: DateTimeFilter<"Bookmark"> | Date | string
    updatedAt?: DateTimeFilter<"Bookmark"> | Date | string
    lastVisited?: DateTimeNullableFilter<"Bookmark"> | Date | string | null
    visitCount?: IntFilter<"Bookmark"> | number
    notes?: StringNullableFilter<"Bookmark"> | string | null
    userId?: StringFilter<"Bookmark"> | string
    isDeleted?: BoolFilter<"Bookmark"> | boolean
    deletedAt?: DateTimeNullableFilter<"Bookmark"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    folders?: FolderBookmarkListRelationFilter
    tags?: BookmarkTagListRelationFilter
    collections?: BookmarkCollectionListRelationFilter
  }

  export type BookmarkOrderByWithRelationInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    favicon?: SortOrderInput | SortOrder
    previewImage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastVisited?: SortOrderInput | SortOrder
    visitCount?: SortOrder
    notes?: SortOrderInput | SortOrder
    userId?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    folders?: FolderBookmarkOrderByRelationAggregateInput
    tags?: BookmarkTagOrderByRelationAggregateInput
    collections?: BookmarkCollectionOrderByRelationAggregateInput
  }

  export type BookmarkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BookmarkWhereInput | BookmarkWhereInput[]
    OR?: BookmarkWhereInput[]
    NOT?: BookmarkWhereInput | BookmarkWhereInput[]
    url?: StringFilter<"Bookmark"> | string
    title?: StringFilter<"Bookmark"> | string
    description?: StringNullableFilter<"Bookmark"> | string | null
    favicon?: StringNullableFilter<"Bookmark"> | string | null
    previewImage?: StringNullableFilter<"Bookmark"> | string | null
    createdAt?: DateTimeFilter<"Bookmark"> | Date | string
    updatedAt?: DateTimeFilter<"Bookmark"> | Date | string
    lastVisited?: DateTimeNullableFilter<"Bookmark"> | Date | string | null
    visitCount?: IntFilter<"Bookmark"> | number
    notes?: StringNullableFilter<"Bookmark"> | string | null
    userId?: StringFilter<"Bookmark"> | string
    isDeleted?: BoolFilter<"Bookmark"> | boolean
    deletedAt?: DateTimeNullableFilter<"Bookmark"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    folders?: FolderBookmarkListRelationFilter
    tags?: BookmarkTagListRelationFilter
    collections?: BookmarkCollectionListRelationFilter
  }, "id">

  export type BookmarkOrderByWithAggregationInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    favicon?: SortOrderInput | SortOrder
    previewImage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastVisited?: SortOrderInput | SortOrder
    visitCount?: SortOrder
    notes?: SortOrderInput | SortOrder
    userId?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: BookmarkCountOrderByAggregateInput
    _avg?: BookmarkAvgOrderByAggregateInput
    _max?: BookmarkMaxOrderByAggregateInput
    _min?: BookmarkMinOrderByAggregateInput
    _sum?: BookmarkSumOrderByAggregateInput
  }

  export type BookmarkScalarWhereWithAggregatesInput = {
    AND?: BookmarkScalarWhereWithAggregatesInput | BookmarkScalarWhereWithAggregatesInput[]
    OR?: BookmarkScalarWhereWithAggregatesInput[]
    NOT?: BookmarkScalarWhereWithAggregatesInput | BookmarkScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Bookmark"> | string
    url?: StringWithAggregatesFilter<"Bookmark"> | string
    title?: StringWithAggregatesFilter<"Bookmark"> | string
    description?: StringNullableWithAggregatesFilter<"Bookmark"> | string | null
    favicon?: StringNullableWithAggregatesFilter<"Bookmark"> | string | null
    previewImage?: StringNullableWithAggregatesFilter<"Bookmark"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Bookmark"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Bookmark"> | Date | string
    lastVisited?: DateTimeNullableWithAggregatesFilter<"Bookmark"> | Date | string | null
    visitCount?: IntWithAggregatesFilter<"Bookmark"> | number
    notes?: StringNullableWithAggregatesFilter<"Bookmark"> | string | null
    userId?: StringWithAggregatesFilter<"Bookmark"> | string
    isDeleted?: BoolWithAggregatesFilter<"Bookmark"> | boolean
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Bookmark"> | Date | string | null
  }

  export type FolderWhereInput = {
    AND?: FolderWhereInput | FolderWhereInput[]
    OR?: FolderWhereInput[]
    NOT?: FolderWhereInput | FolderWhereInput[]
    id?: StringFilter<"Folder"> | string
    name?: StringFilter<"Folder"> | string
    description?: StringNullableFilter<"Folder"> | string | null
    icon?: StringNullableFilter<"Folder"> | string | null
    color?: StringNullableFilter<"Folder"> | string | null
    createdAt?: DateTimeFilter<"Folder"> | Date | string
    updatedAt?: DateTimeFilter<"Folder"> | Date | string
    userId?: StringFilter<"Folder"> | string
    parentId?: StringNullableFilter<"Folder"> | string | null
    isDeleted?: BoolFilter<"Folder"> | boolean
    deletedAt?: DateTimeNullableFilter<"Folder"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    parent?: XOR<FolderNullableScalarRelationFilter, FolderWhereInput> | null
    children?: FolderListRelationFilter
    bookmarks?: FolderBookmarkListRelationFilter
    collaborators?: FolderCollaboratorListRelationFilter
  }

  export type FolderOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    icon?: SortOrderInput | SortOrder
    color?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    parentId?: SortOrderInput | SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    parent?: FolderOrderByWithRelationInput
    children?: FolderOrderByRelationAggregateInput
    bookmarks?: FolderBookmarkOrderByRelationAggregateInput
    collaborators?: FolderCollaboratorOrderByRelationAggregateInput
  }

  export type FolderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_name_parentId?: FolderUserIdNameParentIdCompoundUniqueInput
    AND?: FolderWhereInput | FolderWhereInput[]
    OR?: FolderWhereInput[]
    NOT?: FolderWhereInput | FolderWhereInput[]
    name?: StringFilter<"Folder"> | string
    description?: StringNullableFilter<"Folder"> | string | null
    icon?: StringNullableFilter<"Folder"> | string | null
    color?: StringNullableFilter<"Folder"> | string | null
    createdAt?: DateTimeFilter<"Folder"> | Date | string
    updatedAt?: DateTimeFilter<"Folder"> | Date | string
    userId?: StringFilter<"Folder"> | string
    parentId?: StringNullableFilter<"Folder"> | string | null
    isDeleted?: BoolFilter<"Folder"> | boolean
    deletedAt?: DateTimeNullableFilter<"Folder"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    parent?: XOR<FolderNullableScalarRelationFilter, FolderWhereInput> | null
    children?: FolderListRelationFilter
    bookmarks?: FolderBookmarkListRelationFilter
    collaborators?: FolderCollaboratorListRelationFilter
  }, "id" | "userId_name_parentId">

  export type FolderOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    icon?: SortOrderInput | SortOrder
    color?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    parentId?: SortOrderInput | SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: FolderCountOrderByAggregateInput
    _max?: FolderMaxOrderByAggregateInput
    _min?: FolderMinOrderByAggregateInput
  }

  export type FolderScalarWhereWithAggregatesInput = {
    AND?: FolderScalarWhereWithAggregatesInput | FolderScalarWhereWithAggregatesInput[]
    OR?: FolderScalarWhereWithAggregatesInput[]
    NOT?: FolderScalarWhereWithAggregatesInput | FolderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Folder"> | string
    name?: StringWithAggregatesFilter<"Folder"> | string
    description?: StringNullableWithAggregatesFilter<"Folder"> | string | null
    icon?: StringNullableWithAggregatesFilter<"Folder"> | string | null
    color?: StringNullableWithAggregatesFilter<"Folder"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Folder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Folder"> | Date | string
    userId?: StringWithAggregatesFilter<"Folder"> | string
    parentId?: StringNullableWithAggregatesFilter<"Folder"> | string | null
    isDeleted?: BoolWithAggregatesFilter<"Folder"> | boolean
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Folder"> | Date | string | null
  }

  export type FolderBookmarkWhereInput = {
    AND?: FolderBookmarkWhereInput | FolderBookmarkWhereInput[]
    OR?: FolderBookmarkWhereInput[]
    NOT?: FolderBookmarkWhereInput | FolderBookmarkWhereInput[]
    folderId?: StringFilter<"FolderBookmark"> | string
    bookmarkId?: StringFilter<"FolderBookmark"> | string
    addedAt?: DateTimeFilter<"FolderBookmark"> | Date | string
    folder?: XOR<FolderScalarRelationFilter, FolderWhereInput>
    bookmark?: XOR<BookmarkScalarRelationFilter, BookmarkWhereInput>
  }

  export type FolderBookmarkOrderByWithRelationInput = {
    folderId?: SortOrder
    bookmarkId?: SortOrder
    addedAt?: SortOrder
    folder?: FolderOrderByWithRelationInput
    bookmark?: BookmarkOrderByWithRelationInput
  }

  export type FolderBookmarkWhereUniqueInput = Prisma.AtLeast<{
    folderId_bookmarkId?: FolderBookmarkFolderIdBookmarkIdCompoundUniqueInput
    AND?: FolderBookmarkWhereInput | FolderBookmarkWhereInput[]
    OR?: FolderBookmarkWhereInput[]
    NOT?: FolderBookmarkWhereInput | FolderBookmarkWhereInput[]
    folderId?: StringFilter<"FolderBookmark"> | string
    bookmarkId?: StringFilter<"FolderBookmark"> | string
    addedAt?: DateTimeFilter<"FolderBookmark"> | Date | string
    folder?: XOR<FolderScalarRelationFilter, FolderWhereInput>
    bookmark?: XOR<BookmarkScalarRelationFilter, BookmarkWhereInput>
  }, "folderId_bookmarkId">

  export type FolderBookmarkOrderByWithAggregationInput = {
    folderId?: SortOrder
    bookmarkId?: SortOrder
    addedAt?: SortOrder
    _count?: FolderBookmarkCountOrderByAggregateInput
    _max?: FolderBookmarkMaxOrderByAggregateInput
    _min?: FolderBookmarkMinOrderByAggregateInput
  }

  export type FolderBookmarkScalarWhereWithAggregatesInput = {
    AND?: FolderBookmarkScalarWhereWithAggregatesInput | FolderBookmarkScalarWhereWithAggregatesInput[]
    OR?: FolderBookmarkScalarWhereWithAggregatesInput[]
    NOT?: FolderBookmarkScalarWhereWithAggregatesInput | FolderBookmarkScalarWhereWithAggregatesInput[]
    folderId?: StringWithAggregatesFilter<"FolderBookmark"> | string
    bookmarkId?: StringWithAggregatesFilter<"FolderBookmark"> | string
    addedAt?: DateTimeWithAggregatesFilter<"FolderBookmark"> | Date | string
  }

  export type FolderCollaboratorWhereInput = {
    AND?: FolderCollaboratorWhereInput | FolderCollaboratorWhereInput[]
    OR?: FolderCollaboratorWhereInput[]
    NOT?: FolderCollaboratorWhereInput | FolderCollaboratorWhereInput[]
    folderId?: StringFilter<"FolderCollaborator"> | string
    userId?: StringFilter<"FolderCollaborator"> | string
    permission?: EnumRoleFilter<"FolderCollaborator"> | $Enums.Role
    addedAt?: DateTimeFilter<"FolderCollaborator"> | Date | string
    folder?: XOR<FolderScalarRelationFilter, FolderWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type FolderCollaboratorOrderByWithRelationInput = {
    folderId?: SortOrder
    userId?: SortOrder
    permission?: SortOrder
    addedAt?: SortOrder
    folder?: FolderOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type FolderCollaboratorWhereUniqueInput = Prisma.AtLeast<{
    folderId_userId?: FolderCollaboratorFolderIdUserIdCompoundUniqueInput
    AND?: FolderCollaboratorWhereInput | FolderCollaboratorWhereInput[]
    OR?: FolderCollaboratorWhereInput[]
    NOT?: FolderCollaboratorWhereInput | FolderCollaboratorWhereInput[]
    folderId?: StringFilter<"FolderCollaborator"> | string
    userId?: StringFilter<"FolderCollaborator"> | string
    permission?: EnumRoleFilter<"FolderCollaborator"> | $Enums.Role
    addedAt?: DateTimeFilter<"FolderCollaborator"> | Date | string
    folder?: XOR<FolderScalarRelationFilter, FolderWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "folderId_userId">

  export type FolderCollaboratorOrderByWithAggregationInput = {
    folderId?: SortOrder
    userId?: SortOrder
    permission?: SortOrder
    addedAt?: SortOrder
    _count?: FolderCollaboratorCountOrderByAggregateInput
    _max?: FolderCollaboratorMaxOrderByAggregateInput
    _min?: FolderCollaboratorMinOrderByAggregateInput
  }

  export type FolderCollaboratorScalarWhereWithAggregatesInput = {
    AND?: FolderCollaboratorScalarWhereWithAggregatesInput | FolderCollaboratorScalarWhereWithAggregatesInput[]
    OR?: FolderCollaboratorScalarWhereWithAggregatesInput[]
    NOT?: FolderCollaboratorScalarWhereWithAggregatesInput | FolderCollaboratorScalarWhereWithAggregatesInput[]
    folderId?: StringWithAggregatesFilter<"FolderCollaborator"> | string
    userId?: StringWithAggregatesFilter<"FolderCollaborator"> | string
    permission?: EnumRoleWithAggregatesFilter<"FolderCollaborator"> | $Enums.Role
    addedAt?: DateTimeWithAggregatesFilter<"FolderCollaborator"> | Date | string
  }

  export type TagWhereInput = {
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    id?: StringFilter<"Tag"> | string
    name?: StringFilter<"Tag"> | string
    color?: StringNullableFilter<"Tag"> | string | null
    createdAt?: DateTimeFilter<"Tag"> | Date | string
    updatedAt?: DateTimeFilter<"Tag"> | Date | string
    userId?: StringFilter<"Tag"> | string
    isDeleted?: BoolFilter<"Tag"> | boolean
    deletedAt?: DateTimeNullableFilter<"Tag"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    bookmarks?: BookmarkTagListRelationFilter
  }

  export type TagOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    bookmarks?: BookmarkTagOrderByRelationAggregateInput
  }

  export type TagWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_name?: TagUserIdNameCompoundUniqueInput
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    name?: StringFilter<"Tag"> | string
    color?: StringNullableFilter<"Tag"> | string | null
    createdAt?: DateTimeFilter<"Tag"> | Date | string
    updatedAt?: DateTimeFilter<"Tag"> | Date | string
    userId?: StringFilter<"Tag"> | string
    isDeleted?: BoolFilter<"Tag"> | boolean
    deletedAt?: DateTimeNullableFilter<"Tag"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    bookmarks?: BookmarkTagListRelationFilter
  }, "id" | "userId_name">

  export type TagOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: TagCountOrderByAggregateInput
    _max?: TagMaxOrderByAggregateInput
    _min?: TagMinOrderByAggregateInput
  }

  export type TagScalarWhereWithAggregatesInput = {
    AND?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    OR?: TagScalarWhereWithAggregatesInput[]
    NOT?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tag"> | string
    name?: StringWithAggregatesFilter<"Tag"> | string
    color?: StringNullableWithAggregatesFilter<"Tag"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Tag"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Tag"> | Date | string
    userId?: StringWithAggregatesFilter<"Tag"> | string
    isDeleted?: BoolWithAggregatesFilter<"Tag"> | boolean
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Tag"> | Date | string | null
  }

  export type BookmarkTagWhereInput = {
    AND?: BookmarkTagWhereInput | BookmarkTagWhereInput[]
    OR?: BookmarkTagWhereInput[]
    NOT?: BookmarkTagWhereInput | BookmarkTagWhereInput[]
    tagId?: StringFilter<"BookmarkTag"> | string
    bookmarkId?: StringFilter<"BookmarkTag"> | string
    addedAt?: DateTimeFilter<"BookmarkTag"> | Date | string
    tag?: XOR<TagScalarRelationFilter, TagWhereInput>
    bookmark?: XOR<BookmarkScalarRelationFilter, BookmarkWhereInput>
  }

  export type BookmarkTagOrderByWithRelationInput = {
    tagId?: SortOrder
    bookmarkId?: SortOrder
    addedAt?: SortOrder
    tag?: TagOrderByWithRelationInput
    bookmark?: BookmarkOrderByWithRelationInput
  }

  export type BookmarkTagWhereUniqueInput = Prisma.AtLeast<{
    tagId_bookmarkId?: BookmarkTagTagIdBookmarkIdCompoundUniqueInput
    AND?: BookmarkTagWhereInput | BookmarkTagWhereInput[]
    OR?: BookmarkTagWhereInput[]
    NOT?: BookmarkTagWhereInput | BookmarkTagWhereInput[]
    tagId?: StringFilter<"BookmarkTag"> | string
    bookmarkId?: StringFilter<"BookmarkTag"> | string
    addedAt?: DateTimeFilter<"BookmarkTag"> | Date | string
    tag?: XOR<TagScalarRelationFilter, TagWhereInput>
    bookmark?: XOR<BookmarkScalarRelationFilter, BookmarkWhereInput>
  }, "tagId_bookmarkId">

  export type BookmarkTagOrderByWithAggregationInput = {
    tagId?: SortOrder
    bookmarkId?: SortOrder
    addedAt?: SortOrder
    _count?: BookmarkTagCountOrderByAggregateInput
    _max?: BookmarkTagMaxOrderByAggregateInput
    _min?: BookmarkTagMinOrderByAggregateInput
  }

  export type BookmarkTagScalarWhereWithAggregatesInput = {
    AND?: BookmarkTagScalarWhereWithAggregatesInput | BookmarkTagScalarWhereWithAggregatesInput[]
    OR?: BookmarkTagScalarWhereWithAggregatesInput[]
    NOT?: BookmarkTagScalarWhereWithAggregatesInput | BookmarkTagScalarWhereWithAggregatesInput[]
    tagId?: StringWithAggregatesFilter<"BookmarkTag"> | string
    bookmarkId?: StringWithAggregatesFilter<"BookmarkTag"> | string
    addedAt?: DateTimeWithAggregatesFilter<"BookmarkTag"> | Date | string
  }

  export type CollectionWhereInput = {
    AND?: CollectionWhereInput | CollectionWhereInput[]
    OR?: CollectionWhereInput[]
    NOT?: CollectionWhereInput | CollectionWhereInput[]
    id?: StringFilter<"Collection"> | string
    name?: StringFilter<"Collection"> | string
    description?: StringNullableFilter<"Collection"> | string | null
    isPublic?: BoolFilter<"Collection"> | boolean
    publicLink?: StringNullableFilter<"Collection"> | string | null
    thumbnail?: StringNullableFilter<"Collection"> | string | null
    createdAt?: DateTimeFilter<"Collection"> | Date | string
    updatedAt?: DateTimeFilter<"Collection"> | Date | string
    userId?: StringFilter<"Collection"> | string
    ownerId?: StringFilter<"Collection"> | string
    isDeleted?: BoolFilter<"Collection"> | boolean
    deletedAt?: DateTimeNullableFilter<"Collection"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    bookmarks?: BookmarkCollectionListRelationFilter
    collaborators?: CollectionCollaboratorListRelationFilter
  }

  export type CollectionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    isPublic?: SortOrder
    publicLink?: SortOrderInput | SortOrder
    thumbnail?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    ownerId?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    owner?: UserOrderByWithRelationInput
    bookmarks?: BookmarkCollectionOrderByRelationAggregateInput
    collaborators?: CollectionCollaboratorOrderByRelationAggregateInput
  }

  export type CollectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    publicLink?: string
    userId_name?: CollectionUserIdNameCompoundUniqueInput
    AND?: CollectionWhereInput | CollectionWhereInput[]
    OR?: CollectionWhereInput[]
    NOT?: CollectionWhereInput | CollectionWhereInput[]
    name?: StringFilter<"Collection"> | string
    description?: StringNullableFilter<"Collection"> | string | null
    isPublic?: BoolFilter<"Collection"> | boolean
    thumbnail?: StringNullableFilter<"Collection"> | string | null
    createdAt?: DateTimeFilter<"Collection"> | Date | string
    updatedAt?: DateTimeFilter<"Collection"> | Date | string
    userId?: StringFilter<"Collection"> | string
    ownerId?: StringFilter<"Collection"> | string
    isDeleted?: BoolFilter<"Collection"> | boolean
    deletedAt?: DateTimeNullableFilter<"Collection"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    bookmarks?: BookmarkCollectionListRelationFilter
    collaborators?: CollectionCollaboratorListRelationFilter
  }, "id" | "publicLink" | "userId_name">

  export type CollectionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    isPublic?: SortOrder
    publicLink?: SortOrderInput | SortOrder
    thumbnail?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    ownerId?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: CollectionCountOrderByAggregateInput
    _max?: CollectionMaxOrderByAggregateInput
    _min?: CollectionMinOrderByAggregateInput
  }

  export type CollectionScalarWhereWithAggregatesInput = {
    AND?: CollectionScalarWhereWithAggregatesInput | CollectionScalarWhereWithAggregatesInput[]
    OR?: CollectionScalarWhereWithAggregatesInput[]
    NOT?: CollectionScalarWhereWithAggregatesInput | CollectionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Collection"> | string
    name?: StringWithAggregatesFilter<"Collection"> | string
    description?: StringNullableWithAggregatesFilter<"Collection"> | string | null
    isPublic?: BoolWithAggregatesFilter<"Collection"> | boolean
    publicLink?: StringNullableWithAggregatesFilter<"Collection"> | string | null
    thumbnail?: StringNullableWithAggregatesFilter<"Collection"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Collection"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Collection"> | Date | string
    userId?: StringWithAggregatesFilter<"Collection"> | string
    ownerId?: StringWithAggregatesFilter<"Collection"> | string
    isDeleted?: BoolWithAggregatesFilter<"Collection"> | boolean
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Collection"> | Date | string | null
  }

  export type BookmarkCollectionWhereInput = {
    AND?: BookmarkCollectionWhereInput | BookmarkCollectionWhereInput[]
    OR?: BookmarkCollectionWhereInput[]
    NOT?: BookmarkCollectionWhereInput | BookmarkCollectionWhereInput[]
    collectionId?: StringFilter<"BookmarkCollection"> | string
    bookmarkId?: StringFilter<"BookmarkCollection"> | string
    addedAt?: DateTimeFilter<"BookmarkCollection"> | Date | string
    order?: IntFilter<"BookmarkCollection"> | number
    collection?: XOR<CollectionScalarRelationFilter, CollectionWhereInput>
    bookmark?: XOR<BookmarkScalarRelationFilter, BookmarkWhereInput>
  }

  export type BookmarkCollectionOrderByWithRelationInput = {
    collectionId?: SortOrder
    bookmarkId?: SortOrder
    addedAt?: SortOrder
    order?: SortOrder
    collection?: CollectionOrderByWithRelationInput
    bookmark?: BookmarkOrderByWithRelationInput
  }

  export type BookmarkCollectionWhereUniqueInput = Prisma.AtLeast<{
    collectionId_bookmarkId?: BookmarkCollectionCollectionIdBookmarkIdCompoundUniqueInput
    AND?: BookmarkCollectionWhereInput | BookmarkCollectionWhereInput[]
    OR?: BookmarkCollectionWhereInput[]
    NOT?: BookmarkCollectionWhereInput | BookmarkCollectionWhereInput[]
    collectionId?: StringFilter<"BookmarkCollection"> | string
    bookmarkId?: StringFilter<"BookmarkCollection"> | string
    addedAt?: DateTimeFilter<"BookmarkCollection"> | Date | string
    order?: IntFilter<"BookmarkCollection"> | number
    collection?: XOR<CollectionScalarRelationFilter, CollectionWhereInput>
    bookmark?: XOR<BookmarkScalarRelationFilter, BookmarkWhereInput>
  }, "collectionId_bookmarkId">

  export type BookmarkCollectionOrderByWithAggregationInput = {
    collectionId?: SortOrder
    bookmarkId?: SortOrder
    addedAt?: SortOrder
    order?: SortOrder
    _count?: BookmarkCollectionCountOrderByAggregateInput
    _avg?: BookmarkCollectionAvgOrderByAggregateInput
    _max?: BookmarkCollectionMaxOrderByAggregateInput
    _min?: BookmarkCollectionMinOrderByAggregateInput
    _sum?: BookmarkCollectionSumOrderByAggregateInput
  }

  export type BookmarkCollectionScalarWhereWithAggregatesInput = {
    AND?: BookmarkCollectionScalarWhereWithAggregatesInput | BookmarkCollectionScalarWhereWithAggregatesInput[]
    OR?: BookmarkCollectionScalarWhereWithAggregatesInput[]
    NOT?: BookmarkCollectionScalarWhereWithAggregatesInput | BookmarkCollectionScalarWhereWithAggregatesInput[]
    collectionId?: StringWithAggregatesFilter<"BookmarkCollection"> | string
    bookmarkId?: StringWithAggregatesFilter<"BookmarkCollection"> | string
    addedAt?: DateTimeWithAggregatesFilter<"BookmarkCollection"> | Date | string
    order?: IntWithAggregatesFilter<"BookmarkCollection"> | number
  }

  export type CollectionCollaboratorWhereInput = {
    AND?: CollectionCollaboratorWhereInput | CollectionCollaboratorWhereInput[]
    OR?: CollectionCollaboratorWhereInput[]
    NOT?: CollectionCollaboratorWhereInput | CollectionCollaboratorWhereInput[]
    collectionId?: StringFilter<"CollectionCollaborator"> | string
    userId?: StringFilter<"CollectionCollaborator"> | string
    permission?: EnumRoleFilter<"CollectionCollaborator"> | $Enums.Role
    addedAt?: DateTimeFilter<"CollectionCollaborator"> | Date | string
    collection?: XOR<CollectionScalarRelationFilter, CollectionWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type CollectionCollaboratorOrderByWithRelationInput = {
    collectionId?: SortOrder
    userId?: SortOrder
    permission?: SortOrder
    addedAt?: SortOrder
    collection?: CollectionOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type CollectionCollaboratorWhereUniqueInput = Prisma.AtLeast<{
    collectionId_userId?: CollectionCollaboratorCollectionIdUserIdCompoundUniqueInput
    AND?: CollectionCollaboratorWhereInput | CollectionCollaboratorWhereInput[]
    OR?: CollectionCollaboratorWhereInput[]
    NOT?: CollectionCollaboratorWhereInput | CollectionCollaboratorWhereInput[]
    collectionId?: StringFilter<"CollectionCollaborator"> | string
    userId?: StringFilter<"CollectionCollaborator"> | string
    permission?: EnumRoleFilter<"CollectionCollaborator"> | $Enums.Role
    addedAt?: DateTimeFilter<"CollectionCollaborator"> | Date | string
    collection?: XOR<CollectionScalarRelationFilter, CollectionWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "collectionId_userId">

  export type CollectionCollaboratorOrderByWithAggregationInput = {
    collectionId?: SortOrder
    userId?: SortOrder
    permission?: SortOrder
    addedAt?: SortOrder
    _count?: CollectionCollaboratorCountOrderByAggregateInput
    _max?: CollectionCollaboratorMaxOrderByAggregateInput
    _min?: CollectionCollaboratorMinOrderByAggregateInput
  }

  export type CollectionCollaboratorScalarWhereWithAggregatesInput = {
    AND?: CollectionCollaboratorScalarWhereWithAggregatesInput | CollectionCollaboratorScalarWhereWithAggregatesInput[]
    OR?: CollectionCollaboratorScalarWhereWithAggregatesInput[]
    NOT?: CollectionCollaboratorScalarWhereWithAggregatesInput | CollectionCollaboratorScalarWhereWithAggregatesInput[]
    collectionId?: StringWithAggregatesFilter<"CollectionCollaborator"> | string
    userId?: StringWithAggregatesFilter<"CollectionCollaborator"> | string
    permission?: EnumRoleWithAggregatesFilter<"CollectionCollaborator"> | $Enums.Role
    addedAt?: DateTimeWithAggregatesFilter<"CollectionCollaborator"> | Date | string
  }

  export type DeviceWhereInput = {
    AND?: DeviceWhereInput | DeviceWhereInput[]
    OR?: DeviceWhereInput[]
    NOT?: DeviceWhereInput | DeviceWhereInput[]
    id?: StringFilter<"Device"> | string
    userId?: StringFilter<"Device"> | string
    deviceName?: StringFilter<"Device"> | string
    deviceType?: StringFilter<"Device"> | string
    lastSynced?: DateTimeFilter<"Device"> | Date | string
    lastActive?: DateTimeFilter<"Device"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type DeviceOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    deviceName?: SortOrder
    deviceType?: SortOrder
    lastSynced?: SortOrder
    lastActive?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type DeviceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DeviceWhereInput | DeviceWhereInput[]
    OR?: DeviceWhereInput[]
    NOT?: DeviceWhereInput | DeviceWhereInput[]
    userId?: StringFilter<"Device"> | string
    deviceName?: StringFilter<"Device"> | string
    deviceType?: StringFilter<"Device"> | string
    lastSynced?: DateTimeFilter<"Device"> | Date | string
    lastActive?: DateTimeFilter<"Device"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type DeviceOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    deviceName?: SortOrder
    deviceType?: SortOrder
    lastSynced?: SortOrder
    lastActive?: SortOrder
    _count?: DeviceCountOrderByAggregateInput
    _max?: DeviceMaxOrderByAggregateInput
    _min?: DeviceMinOrderByAggregateInput
  }

  export type DeviceScalarWhereWithAggregatesInput = {
    AND?: DeviceScalarWhereWithAggregatesInput | DeviceScalarWhereWithAggregatesInput[]
    OR?: DeviceScalarWhereWithAggregatesInput[]
    NOT?: DeviceScalarWhereWithAggregatesInput | DeviceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Device"> | string
    userId?: StringWithAggregatesFilter<"Device"> | string
    deviceName?: StringWithAggregatesFilter<"Device"> | string
    deviceType?: StringWithAggregatesFilter<"Device"> | string
    lastSynced?: DateTimeWithAggregatesFilter<"Device"> | Date | string
    lastActive?: DateTimeWithAggregatesFilter<"Device"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
    bookmarks?: BookmarkCreateNestedManyWithoutUserInput
    folders?: FolderCreateNestedManyWithoutUserInput
    tags?: TagCreateNestedManyWithoutUserInput
    collections?: CollectionCreateNestedManyWithoutUserInput
    ownedCollections?: CollectionCreateNestedManyWithoutOwnerInput
    collabFolders?: FolderCollaboratorCreateNestedManyWithoutUserInput
    collabCollections?: CollectionCollaboratorCreateNestedManyWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    folders?: FolderUncheckedCreateNestedManyWithoutUserInput
    tags?: TagUncheckedCreateNestedManyWithoutUserInput
    collections?: CollectionUncheckedCreateNestedManyWithoutUserInput
    ownedCollections?: CollectionUncheckedCreateNestedManyWithoutOwnerInput
    collabFolders?: FolderCollaboratorUncheckedCreateNestedManyWithoutUserInput
    collabCollections?: CollectionCollaboratorUncheckedCreateNestedManyWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarks?: BookmarkUpdateManyWithoutUserNestedInput
    folders?: FolderUpdateManyWithoutUserNestedInput
    tags?: TagUpdateManyWithoutUserNestedInput
    collections?: CollectionUpdateManyWithoutUserNestedInput
    ownedCollections?: CollectionUpdateManyWithoutOwnerNestedInput
    collabFolders?: FolderCollaboratorUpdateManyWithoutUserNestedInput
    collabCollections?: CollectionCollaboratorUpdateManyWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarks?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    folders?: FolderUncheckedUpdateManyWithoutUserNestedInput
    tags?: TagUncheckedUpdateManyWithoutUserNestedInput
    collections?: CollectionUncheckedUpdateManyWithoutUserNestedInput
    ownedCollections?: CollectionUncheckedUpdateManyWithoutOwnerNestedInput
    collabFolders?: FolderCollaboratorUncheckedUpdateManyWithoutUserNestedInput
    collabCollections?: CollectionCollaboratorUncheckedUpdateManyWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BookmarkCreateInput = {
    id?: string
    url: string
    title: string
    description?: string | null
    favicon?: string | null
    previewImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastVisited?: Date | string | null
    visitCount?: number
    notes?: string | null
    isDeleted?: boolean
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutBookmarksInput
    folders?: FolderBookmarkCreateNestedManyWithoutBookmarkInput
    tags?: BookmarkTagCreateNestedManyWithoutBookmarkInput
    collections?: BookmarkCollectionCreateNestedManyWithoutBookmarkInput
  }

  export type BookmarkUncheckedCreateInput = {
    id?: string
    url: string
    title: string
    description?: string | null
    favicon?: string | null
    previewImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastVisited?: Date | string | null
    visitCount?: number
    notes?: string | null
    userId: string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    folders?: FolderBookmarkUncheckedCreateNestedManyWithoutBookmarkInput
    tags?: BookmarkTagUncheckedCreateNestedManyWithoutBookmarkInput
    collections?: BookmarkCollectionUncheckedCreateNestedManyWithoutBookmarkInput
  }

  export type BookmarkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    favicon?: NullableStringFieldUpdateOperationsInput | string | null
    previewImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisited?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutBookmarksNestedInput
    folders?: FolderBookmarkUpdateManyWithoutBookmarkNestedInput
    tags?: BookmarkTagUpdateManyWithoutBookmarkNestedInput
    collections?: BookmarkCollectionUpdateManyWithoutBookmarkNestedInput
  }

  export type BookmarkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    favicon?: NullableStringFieldUpdateOperationsInput | string | null
    previewImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisited?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    folders?: FolderBookmarkUncheckedUpdateManyWithoutBookmarkNestedInput
    tags?: BookmarkTagUncheckedUpdateManyWithoutBookmarkNestedInput
    collections?: BookmarkCollectionUncheckedUpdateManyWithoutBookmarkNestedInput
  }

  export type BookmarkCreateManyInput = {
    id?: string
    url: string
    title: string
    description?: string | null
    favicon?: string | null
    previewImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastVisited?: Date | string | null
    visitCount?: number
    notes?: string | null
    userId: string
    isDeleted?: boolean
    deletedAt?: Date | string | null
  }

  export type BookmarkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    favicon?: NullableStringFieldUpdateOperationsInput | string | null
    previewImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisited?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BookmarkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    favicon?: NullableStringFieldUpdateOperationsInput | string | null
    previewImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisited?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FolderCreateInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutFoldersInput
    parent?: FolderCreateNestedOneWithoutChildrenInput
    children?: FolderCreateNestedManyWithoutParentInput
    bookmarks?: FolderBookmarkCreateNestedManyWithoutFolderInput
    collaborators?: FolderCollaboratorCreateNestedManyWithoutFolderInput
  }

  export type FolderUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    parentId?: string | null
    isDeleted?: boolean
    deletedAt?: Date | string | null
    children?: FolderUncheckedCreateNestedManyWithoutParentInput
    bookmarks?: FolderBookmarkUncheckedCreateNestedManyWithoutFolderInput
    collaborators?: FolderCollaboratorUncheckedCreateNestedManyWithoutFolderInput
  }

  export type FolderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutFoldersNestedInput
    parent?: FolderUpdateOneWithoutChildrenNestedInput
    children?: FolderUpdateManyWithoutParentNestedInput
    bookmarks?: FolderBookmarkUpdateManyWithoutFolderNestedInput
    collaborators?: FolderCollaboratorUpdateManyWithoutFolderNestedInput
  }

  export type FolderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    children?: FolderUncheckedUpdateManyWithoutParentNestedInput
    bookmarks?: FolderBookmarkUncheckedUpdateManyWithoutFolderNestedInput
    collaborators?: FolderCollaboratorUncheckedUpdateManyWithoutFolderNestedInput
  }

  export type FolderCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    parentId?: string | null
    isDeleted?: boolean
    deletedAt?: Date | string | null
  }

  export type FolderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FolderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FolderBookmarkCreateInput = {
    addedAt?: Date | string
    folder: FolderCreateNestedOneWithoutBookmarksInput
    bookmark: BookmarkCreateNestedOneWithoutFoldersInput
  }

  export type FolderBookmarkUncheckedCreateInput = {
    folderId: string
    bookmarkId: string
    addedAt?: Date | string
  }

  export type FolderBookmarkUpdateInput = {
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    folder?: FolderUpdateOneRequiredWithoutBookmarksNestedInput
    bookmark?: BookmarkUpdateOneRequiredWithoutFoldersNestedInput
  }

  export type FolderBookmarkUncheckedUpdateInput = {
    folderId?: StringFieldUpdateOperationsInput | string
    bookmarkId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FolderBookmarkCreateManyInput = {
    folderId: string
    bookmarkId: string
    addedAt?: Date | string
  }

  export type FolderBookmarkUpdateManyMutationInput = {
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FolderBookmarkUncheckedUpdateManyInput = {
    folderId?: StringFieldUpdateOperationsInput | string
    bookmarkId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FolderCollaboratorCreateInput = {
    permission?: $Enums.Role
    addedAt?: Date | string
    folder: FolderCreateNestedOneWithoutCollaboratorsInput
    user: UserCreateNestedOneWithoutCollabFoldersInput
  }

  export type FolderCollaboratorUncheckedCreateInput = {
    folderId: string
    userId: string
    permission?: $Enums.Role
    addedAt?: Date | string
  }

  export type FolderCollaboratorUpdateInput = {
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    folder?: FolderUpdateOneRequiredWithoutCollaboratorsNestedInput
    user?: UserUpdateOneRequiredWithoutCollabFoldersNestedInput
  }

  export type FolderCollaboratorUncheckedUpdateInput = {
    folderId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FolderCollaboratorCreateManyInput = {
    folderId: string
    userId: string
    permission?: $Enums.Role
    addedAt?: Date | string
  }

  export type FolderCollaboratorUpdateManyMutationInput = {
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FolderCollaboratorUncheckedUpdateManyInput = {
    folderId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagCreateInput = {
    id?: string
    name: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutTagsInput
    bookmarks?: BookmarkTagCreateNestedManyWithoutTagInput
  }

  export type TagUncheckedCreateInput = {
    id?: string
    name: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    bookmarks?: BookmarkTagUncheckedCreateNestedManyWithoutTagInput
  }

  export type TagUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutTagsNestedInput
    bookmarks?: BookmarkTagUpdateManyWithoutTagNestedInput
  }

  export type TagUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bookmarks?: BookmarkTagUncheckedUpdateManyWithoutTagNestedInput
  }

  export type TagCreateManyInput = {
    id?: string
    name: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    isDeleted?: boolean
    deletedAt?: Date | string | null
  }

  export type TagUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TagUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BookmarkTagCreateInput = {
    addedAt?: Date | string
    tag: TagCreateNestedOneWithoutBookmarksInput
    bookmark: BookmarkCreateNestedOneWithoutTagsInput
  }

  export type BookmarkTagUncheckedCreateInput = {
    tagId: string
    bookmarkId: string
    addedAt?: Date | string
  }

  export type BookmarkTagUpdateInput = {
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tag?: TagUpdateOneRequiredWithoutBookmarksNestedInput
    bookmark?: BookmarkUpdateOneRequiredWithoutTagsNestedInput
  }

  export type BookmarkTagUncheckedUpdateInput = {
    tagId?: StringFieldUpdateOperationsInput | string
    bookmarkId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkTagCreateManyInput = {
    tagId: string
    bookmarkId: string
    addedAt?: Date | string
  }

  export type BookmarkTagUpdateManyMutationInput = {
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkTagUncheckedUpdateManyInput = {
    tagId?: StringFieldUpdateOperationsInput | string
    bookmarkId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollectionCreateInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    publicLink?: string | null
    thumbnail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutCollectionsInput
    owner: UserCreateNestedOneWithoutOwnedCollectionsInput
    bookmarks?: BookmarkCollectionCreateNestedManyWithoutCollectionInput
    collaborators?: CollectionCollaboratorCreateNestedManyWithoutCollectionInput
  }

  export type CollectionUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    publicLink?: string | null
    thumbnail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    ownerId: string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    bookmarks?: BookmarkCollectionUncheckedCreateNestedManyWithoutCollectionInput
    collaborators?: CollectionCollaboratorUncheckedCreateNestedManyWithoutCollectionInput
  }

  export type CollectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publicLink?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutCollectionsNestedInput
    owner?: UserUpdateOneRequiredWithoutOwnedCollectionsNestedInput
    bookmarks?: BookmarkCollectionUpdateManyWithoutCollectionNestedInput
    collaborators?: CollectionCollaboratorUpdateManyWithoutCollectionNestedInput
  }

  export type CollectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publicLink?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bookmarks?: BookmarkCollectionUncheckedUpdateManyWithoutCollectionNestedInput
    collaborators?: CollectionCollaboratorUncheckedUpdateManyWithoutCollectionNestedInput
  }

  export type CollectionCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    publicLink?: string | null
    thumbnail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    ownerId: string
    isDeleted?: boolean
    deletedAt?: Date | string | null
  }

  export type CollectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publicLink?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CollectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publicLink?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BookmarkCollectionCreateInput = {
    addedAt?: Date | string
    order?: number
    collection: CollectionCreateNestedOneWithoutBookmarksInput
    bookmark: BookmarkCreateNestedOneWithoutCollectionsInput
  }

  export type BookmarkCollectionUncheckedCreateInput = {
    collectionId: string
    bookmarkId: string
    addedAt?: Date | string
    order?: number
  }

  export type BookmarkCollectionUpdateInput = {
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: IntFieldUpdateOperationsInput | number
    collection?: CollectionUpdateOneRequiredWithoutBookmarksNestedInput
    bookmark?: BookmarkUpdateOneRequiredWithoutCollectionsNestedInput
  }

  export type BookmarkCollectionUncheckedUpdateInput = {
    collectionId?: StringFieldUpdateOperationsInput | string
    bookmarkId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type BookmarkCollectionCreateManyInput = {
    collectionId: string
    bookmarkId: string
    addedAt?: Date | string
    order?: number
  }

  export type BookmarkCollectionUpdateManyMutationInput = {
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type BookmarkCollectionUncheckedUpdateManyInput = {
    collectionId?: StringFieldUpdateOperationsInput | string
    bookmarkId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type CollectionCollaboratorCreateInput = {
    permission?: $Enums.Role
    addedAt?: Date | string
    collection: CollectionCreateNestedOneWithoutCollaboratorsInput
    user: UserCreateNestedOneWithoutCollabCollectionsInput
  }

  export type CollectionCollaboratorUncheckedCreateInput = {
    collectionId: string
    userId: string
    permission?: $Enums.Role
    addedAt?: Date | string
  }

  export type CollectionCollaboratorUpdateInput = {
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collection?: CollectionUpdateOneRequiredWithoutCollaboratorsNestedInput
    user?: UserUpdateOneRequiredWithoutCollabCollectionsNestedInput
  }

  export type CollectionCollaboratorUncheckedUpdateInput = {
    collectionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollectionCollaboratorCreateManyInput = {
    collectionId: string
    userId: string
    permission?: $Enums.Role
    addedAt?: Date | string
  }

  export type CollectionCollaboratorUpdateManyMutationInput = {
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollectionCollaboratorUncheckedUpdateManyInput = {
    collectionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceCreateInput = {
    id?: string
    deviceName: string
    deviceType: string
    lastSynced?: Date | string
    lastActive?: Date | string
    user: UserCreateNestedOneWithoutDevicesInput
  }

  export type DeviceUncheckedCreateInput = {
    id?: string
    userId: string
    deviceName: string
    deviceType: string
    lastSynced?: Date | string
    lastActive?: Date | string
  }

  export type DeviceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceName?: StringFieldUpdateOperationsInput | string
    deviceType?: StringFieldUpdateOperationsInput | string
    lastSynced?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDevicesNestedInput
  }

  export type DeviceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    deviceName?: StringFieldUpdateOperationsInput | string
    deviceType?: StringFieldUpdateOperationsInput | string
    lastSynced?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceCreateManyInput = {
    id?: string
    userId: string
    deviceName: string
    deviceType: string
    lastSynced?: Date | string
    lastActive?: Date | string
  }

  export type DeviceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceName?: StringFieldUpdateOperationsInput | string
    deviceType?: StringFieldUpdateOperationsInput | string
    lastSynced?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    deviceName?: StringFieldUpdateOperationsInput | string
    deviceType?: StringFieldUpdateOperationsInput | string
    lastSynced?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type BookmarkListRelationFilter = {
    every?: BookmarkWhereInput
    some?: BookmarkWhereInput
    none?: BookmarkWhereInput
  }

  export type FolderListRelationFilter = {
    every?: FolderWhereInput
    some?: FolderWhereInput
    none?: FolderWhereInput
  }

  export type TagListRelationFilter = {
    every?: TagWhereInput
    some?: TagWhereInput
    none?: TagWhereInput
  }

  export type CollectionListRelationFilter = {
    every?: CollectionWhereInput
    some?: CollectionWhereInput
    none?: CollectionWhereInput
  }

  export type FolderCollaboratorListRelationFilter = {
    every?: FolderCollaboratorWhereInput
    some?: FolderCollaboratorWhereInput
    none?: FolderCollaboratorWhereInput
  }

  export type CollectionCollaboratorListRelationFilter = {
    every?: CollectionCollaboratorWhereInput
    some?: CollectionCollaboratorWhereInput
    none?: CollectionCollaboratorWhereInput
  }

  export type DeviceListRelationFilter = {
    every?: DeviceWhereInput
    some?: DeviceWhereInput
    none?: DeviceWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type BookmarkOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FolderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TagOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CollectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FolderCollaboratorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CollectionCollaboratorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DeviceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrder
    name?: SortOrder
    profileImage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
    lastLogin?: SortOrder
    refreshToken?: SortOrder
    passwordResetToken?: SortOrder
    passwordResetExpires?: SortOrder
    isVerified?: SortOrder
    verificationToken?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrder
    name?: SortOrder
    profileImage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
    lastLogin?: SortOrder
    refreshToken?: SortOrder
    passwordResetToken?: SortOrder
    passwordResetExpires?: SortOrder
    isVerified?: SortOrder
    verificationToken?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    password?: SortOrder
    name?: SortOrder
    profileImage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
    lastLogin?: SortOrder
    refreshToken?: SortOrder
    passwordResetToken?: SortOrder
    passwordResetExpires?: SortOrder
    isVerified?: SortOrder
    verificationToken?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type FolderBookmarkListRelationFilter = {
    every?: FolderBookmarkWhereInput
    some?: FolderBookmarkWhereInput
    none?: FolderBookmarkWhereInput
  }

  export type BookmarkTagListRelationFilter = {
    every?: BookmarkTagWhereInput
    some?: BookmarkTagWhereInput
    none?: BookmarkTagWhereInput
  }

  export type BookmarkCollectionListRelationFilter = {
    every?: BookmarkCollectionWhereInput
    some?: BookmarkCollectionWhereInput
    none?: BookmarkCollectionWhereInput
  }

  export type FolderBookmarkOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BookmarkTagOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BookmarkCollectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BookmarkCountOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrder
    description?: SortOrder
    favicon?: SortOrder
    previewImage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastVisited?: SortOrder
    visitCount?: SortOrder
    notes?: SortOrder
    userId?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
  }

  export type BookmarkAvgOrderByAggregateInput = {
    visitCount?: SortOrder
  }

  export type BookmarkMaxOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrder
    description?: SortOrder
    favicon?: SortOrder
    previewImage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastVisited?: SortOrder
    visitCount?: SortOrder
    notes?: SortOrder
    userId?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
  }

  export type BookmarkMinOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrder
    description?: SortOrder
    favicon?: SortOrder
    previewImage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastVisited?: SortOrder
    visitCount?: SortOrder
    notes?: SortOrder
    userId?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
  }

  export type BookmarkSumOrderByAggregateInput = {
    visitCount?: SortOrder
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

  export type FolderNullableScalarRelationFilter = {
    is?: FolderWhereInput | null
    isNot?: FolderWhereInput | null
  }

  export type FolderUserIdNameParentIdCompoundUniqueInput = {
    userId: string
    name: string
    parentId: string
  }

  export type FolderCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    parentId?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
  }

  export type FolderMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    parentId?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
  }

  export type FolderMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    parentId?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
  }

  export type FolderScalarRelationFilter = {
    is?: FolderWhereInput
    isNot?: FolderWhereInput
  }

  export type BookmarkScalarRelationFilter = {
    is?: BookmarkWhereInput
    isNot?: BookmarkWhereInput
  }

  export type FolderBookmarkFolderIdBookmarkIdCompoundUniqueInput = {
    folderId: string
    bookmarkId: string
  }

  export type FolderBookmarkCountOrderByAggregateInput = {
    folderId?: SortOrder
    bookmarkId?: SortOrder
    addedAt?: SortOrder
  }

  export type FolderBookmarkMaxOrderByAggregateInput = {
    folderId?: SortOrder
    bookmarkId?: SortOrder
    addedAt?: SortOrder
  }

  export type FolderBookmarkMinOrderByAggregateInput = {
    folderId?: SortOrder
    bookmarkId?: SortOrder
    addedAt?: SortOrder
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type FolderCollaboratorFolderIdUserIdCompoundUniqueInput = {
    folderId: string
    userId: string
  }

  export type FolderCollaboratorCountOrderByAggregateInput = {
    folderId?: SortOrder
    userId?: SortOrder
    permission?: SortOrder
    addedAt?: SortOrder
  }

  export type FolderCollaboratorMaxOrderByAggregateInput = {
    folderId?: SortOrder
    userId?: SortOrder
    permission?: SortOrder
    addedAt?: SortOrder
  }

  export type FolderCollaboratorMinOrderByAggregateInput = {
    folderId?: SortOrder
    userId?: SortOrder
    permission?: SortOrder
    addedAt?: SortOrder
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type TagUserIdNameCompoundUniqueInput = {
    userId: string
    name: string
  }

  export type TagCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
  }

  export type TagMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
  }

  export type TagMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
  }

  export type TagScalarRelationFilter = {
    is?: TagWhereInput
    isNot?: TagWhereInput
  }

  export type BookmarkTagTagIdBookmarkIdCompoundUniqueInput = {
    tagId: string
    bookmarkId: string
  }

  export type BookmarkTagCountOrderByAggregateInput = {
    tagId?: SortOrder
    bookmarkId?: SortOrder
    addedAt?: SortOrder
  }

  export type BookmarkTagMaxOrderByAggregateInput = {
    tagId?: SortOrder
    bookmarkId?: SortOrder
    addedAt?: SortOrder
  }

  export type BookmarkTagMinOrderByAggregateInput = {
    tagId?: SortOrder
    bookmarkId?: SortOrder
    addedAt?: SortOrder
  }

  export type CollectionUserIdNameCompoundUniqueInput = {
    userId: string
    name: string
  }

  export type CollectionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isPublic?: SortOrder
    publicLink?: SortOrder
    thumbnail?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    ownerId?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
  }

  export type CollectionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isPublic?: SortOrder
    publicLink?: SortOrder
    thumbnail?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    ownerId?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
  }

  export type CollectionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    isPublic?: SortOrder
    publicLink?: SortOrder
    thumbnail?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    ownerId?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
  }

  export type CollectionScalarRelationFilter = {
    is?: CollectionWhereInput
    isNot?: CollectionWhereInput
  }

  export type BookmarkCollectionCollectionIdBookmarkIdCompoundUniqueInput = {
    collectionId: string
    bookmarkId: string
  }

  export type BookmarkCollectionCountOrderByAggregateInput = {
    collectionId?: SortOrder
    bookmarkId?: SortOrder
    addedAt?: SortOrder
    order?: SortOrder
  }

  export type BookmarkCollectionAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type BookmarkCollectionMaxOrderByAggregateInput = {
    collectionId?: SortOrder
    bookmarkId?: SortOrder
    addedAt?: SortOrder
    order?: SortOrder
  }

  export type BookmarkCollectionMinOrderByAggregateInput = {
    collectionId?: SortOrder
    bookmarkId?: SortOrder
    addedAt?: SortOrder
    order?: SortOrder
  }

  export type BookmarkCollectionSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type CollectionCollaboratorCollectionIdUserIdCompoundUniqueInput = {
    collectionId: string
    userId: string
  }

  export type CollectionCollaboratorCountOrderByAggregateInput = {
    collectionId?: SortOrder
    userId?: SortOrder
    permission?: SortOrder
    addedAt?: SortOrder
  }

  export type CollectionCollaboratorMaxOrderByAggregateInput = {
    collectionId?: SortOrder
    userId?: SortOrder
    permission?: SortOrder
    addedAt?: SortOrder
  }

  export type CollectionCollaboratorMinOrderByAggregateInput = {
    collectionId?: SortOrder
    userId?: SortOrder
    permission?: SortOrder
    addedAt?: SortOrder
  }

  export type DeviceCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    deviceName?: SortOrder
    deviceType?: SortOrder
    lastSynced?: SortOrder
    lastActive?: SortOrder
  }

  export type DeviceMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    deviceName?: SortOrder
    deviceType?: SortOrder
    lastSynced?: SortOrder
    lastActive?: SortOrder
  }

  export type DeviceMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    deviceName?: SortOrder
    deviceType?: SortOrder
    lastSynced?: SortOrder
    lastActive?: SortOrder
  }

  export type BookmarkCreateNestedManyWithoutUserInput = {
    create?: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput> | BookmarkCreateWithoutUserInput[] | BookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutUserInput | BookmarkCreateOrConnectWithoutUserInput[]
    createMany?: BookmarkCreateManyUserInputEnvelope
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
  }

  export type FolderCreateNestedManyWithoutUserInput = {
    create?: XOR<FolderCreateWithoutUserInput, FolderUncheckedCreateWithoutUserInput> | FolderCreateWithoutUserInput[] | FolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FolderCreateOrConnectWithoutUserInput | FolderCreateOrConnectWithoutUserInput[]
    createMany?: FolderCreateManyUserInputEnvelope
    connect?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
  }

  export type TagCreateNestedManyWithoutUserInput = {
    create?: XOR<TagCreateWithoutUserInput, TagUncheckedCreateWithoutUserInput> | TagCreateWithoutUserInput[] | TagUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TagCreateOrConnectWithoutUserInput | TagCreateOrConnectWithoutUserInput[]
    createMany?: TagCreateManyUserInputEnvelope
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
  }

  export type CollectionCreateNestedManyWithoutUserInput = {
    create?: XOR<CollectionCreateWithoutUserInput, CollectionUncheckedCreateWithoutUserInput> | CollectionCreateWithoutUserInput[] | CollectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CollectionCreateOrConnectWithoutUserInput | CollectionCreateOrConnectWithoutUserInput[]
    createMany?: CollectionCreateManyUserInputEnvelope
    connect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
  }

  export type CollectionCreateNestedManyWithoutOwnerInput = {
    create?: XOR<CollectionCreateWithoutOwnerInput, CollectionUncheckedCreateWithoutOwnerInput> | CollectionCreateWithoutOwnerInput[] | CollectionUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: CollectionCreateOrConnectWithoutOwnerInput | CollectionCreateOrConnectWithoutOwnerInput[]
    createMany?: CollectionCreateManyOwnerInputEnvelope
    connect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
  }

  export type FolderCollaboratorCreateNestedManyWithoutUserInput = {
    create?: XOR<FolderCollaboratorCreateWithoutUserInput, FolderCollaboratorUncheckedCreateWithoutUserInput> | FolderCollaboratorCreateWithoutUserInput[] | FolderCollaboratorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FolderCollaboratorCreateOrConnectWithoutUserInput | FolderCollaboratorCreateOrConnectWithoutUserInput[]
    createMany?: FolderCollaboratorCreateManyUserInputEnvelope
    connect?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
  }

  export type CollectionCollaboratorCreateNestedManyWithoutUserInput = {
    create?: XOR<CollectionCollaboratorCreateWithoutUserInput, CollectionCollaboratorUncheckedCreateWithoutUserInput> | CollectionCollaboratorCreateWithoutUserInput[] | CollectionCollaboratorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CollectionCollaboratorCreateOrConnectWithoutUserInput | CollectionCollaboratorCreateOrConnectWithoutUserInput[]
    createMany?: CollectionCollaboratorCreateManyUserInputEnvelope
    connect?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
  }

  export type DeviceCreateNestedManyWithoutUserInput = {
    create?: XOR<DeviceCreateWithoutUserInput, DeviceUncheckedCreateWithoutUserInput> | DeviceCreateWithoutUserInput[] | DeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutUserInput | DeviceCreateOrConnectWithoutUserInput[]
    createMany?: DeviceCreateManyUserInputEnvelope
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
  }

  export type BookmarkUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput> | BookmarkCreateWithoutUserInput[] | BookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutUserInput | BookmarkCreateOrConnectWithoutUserInput[]
    createMany?: BookmarkCreateManyUserInputEnvelope
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
  }

  export type FolderUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<FolderCreateWithoutUserInput, FolderUncheckedCreateWithoutUserInput> | FolderCreateWithoutUserInput[] | FolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FolderCreateOrConnectWithoutUserInput | FolderCreateOrConnectWithoutUserInput[]
    createMany?: FolderCreateManyUserInputEnvelope
    connect?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
  }

  export type TagUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TagCreateWithoutUserInput, TagUncheckedCreateWithoutUserInput> | TagCreateWithoutUserInput[] | TagUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TagCreateOrConnectWithoutUserInput | TagCreateOrConnectWithoutUserInput[]
    createMany?: TagCreateManyUserInputEnvelope
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
  }

  export type CollectionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CollectionCreateWithoutUserInput, CollectionUncheckedCreateWithoutUserInput> | CollectionCreateWithoutUserInput[] | CollectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CollectionCreateOrConnectWithoutUserInput | CollectionCreateOrConnectWithoutUserInput[]
    createMany?: CollectionCreateManyUserInputEnvelope
    connect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
  }

  export type CollectionUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<CollectionCreateWithoutOwnerInput, CollectionUncheckedCreateWithoutOwnerInput> | CollectionCreateWithoutOwnerInput[] | CollectionUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: CollectionCreateOrConnectWithoutOwnerInput | CollectionCreateOrConnectWithoutOwnerInput[]
    createMany?: CollectionCreateManyOwnerInputEnvelope
    connect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
  }

  export type FolderCollaboratorUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<FolderCollaboratorCreateWithoutUserInput, FolderCollaboratorUncheckedCreateWithoutUserInput> | FolderCollaboratorCreateWithoutUserInput[] | FolderCollaboratorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FolderCollaboratorCreateOrConnectWithoutUserInput | FolderCollaboratorCreateOrConnectWithoutUserInput[]
    createMany?: FolderCollaboratorCreateManyUserInputEnvelope
    connect?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
  }

  export type CollectionCollaboratorUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CollectionCollaboratorCreateWithoutUserInput, CollectionCollaboratorUncheckedCreateWithoutUserInput> | CollectionCollaboratorCreateWithoutUserInput[] | CollectionCollaboratorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CollectionCollaboratorCreateOrConnectWithoutUserInput | CollectionCollaboratorCreateOrConnectWithoutUserInput[]
    createMany?: CollectionCollaboratorCreateManyUserInputEnvelope
    connect?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
  }

  export type DeviceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DeviceCreateWithoutUserInput, DeviceUncheckedCreateWithoutUserInput> | DeviceCreateWithoutUserInput[] | DeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutUserInput | DeviceCreateOrConnectWithoutUserInput[]
    createMany?: DeviceCreateManyUserInputEnvelope
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BookmarkUpdateManyWithoutUserNestedInput = {
    create?: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput> | BookmarkCreateWithoutUserInput[] | BookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutUserInput | BookmarkCreateOrConnectWithoutUserInput[]
    upsert?: BookmarkUpsertWithWhereUniqueWithoutUserInput | BookmarkUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BookmarkCreateManyUserInputEnvelope
    set?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    disconnect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    delete?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    update?: BookmarkUpdateWithWhereUniqueWithoutUserInput | BookmarkUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BookmarkUpdateManyWithWhereWithoutUserInput | BookmarkUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
  }

  export type FolderUpdateManyWithoutUserNestedInput = {
    create?: XOR<FolderCreateWithoutUserInput, FolderUncheckedCreateWithoutUserInput> | FolderCreateWithoutUserInput[] | FolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FolderCreateOrConnectWithoutUserInput | FolderCreateOrConnectWithoutUserInput[]
    upsert?: FolderUpsertWithWhereUniqueWithoutUserInput | FolderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FolderCreateManyUserInputEnvelope
    set?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
    disconnect?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
    delete?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
    connect?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
    update?: FolderUpdateWithWhereUniqueWithoutUserInput | FolderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FolderUpdateManyWithWhereWithoutUserInput | FolderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FolderScalarWhereInput | FolderScalarWhereInput[]
  }

  export type TagUpdateManyWithoutUserNestedInput = {
    create?: XOR<TagCreateWithoutUserInput, TagUncheckedCreateWithoutUserInput> | TagCreateWithoutUserInput[] | TagUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TagCreateOrConnectWithoutUserInput | TagCreateOrConnectWithoutUserInput[]
    upsert?: TagUpsertWithWhereUniqueWithoutUserInput | TagUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TagCreateManyUserInputEnvelope
    set?: TagWhereUniqueInput | TagWhereUniqueInput[]
    disconnect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    delete?: TagWhereUniqueInput | TagWhereUniqueInput[]
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    update?: TagUpdateWithWhereUniqueWithoutUserInput | TagUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TagUpdateManyWithWhereWithoutUserInput | TagUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TagScalarWhereInput | TagScalarWhereInput[]
  }

  export type CollectionUpdateManyWithoutUserNestedInput = {
    create?: XOR<CollectionCreateWithoutUserInput, CollectionUncheckedCreateWithoutUserInput> | CollectionCreateWithoutUserInput[] | CollectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CollectionCreateOrConnectWithoutUserInput | CollectionCreateOrConnectWithoutUserInput[]
    upsert?: CollectionUpsertWithWhereUniqueWithoutUserInput | CollectionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CollectionCreateManyUserInputEnvelope
    set?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    disconnect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    delete?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    connect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    update?: CollectionUpdateWithWhereUniqueWithoutUserInput | CollectionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CollectionUpdateManyWithWhereWithoutUserInput | CollectionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CollectionScalarWhereInput | CollectionScalarWhereInput[]
  }

  export type CollectionUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<CollectionCreateWithoutOwnerInput, CollectionUncheckedCreateWithoutOwnerInput> | CollectionCreateWithoutOwnerInput[] | CollectionUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: CollectionCreateOrConnectWithoutOwnerInput | CollectionCreateOrConnectWithoutOwnerInput[]
    upsert?: CollectionUpsertWithWhereUniqueWithoutOwnerInput | CollectionUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: CollectionCreateManyOwnerInputEnvelope
    set?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    disconnect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    delete?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    connect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    update?: CollectionUpdateWithWhereUniqueWithoutOwnerInput | CollectionUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: CollectionUpdateManyWithWhereWithoutOwnerInput | CollectionUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: CollectionScalarWhereInput | CollectionScalarWhereInput[]
  }

  export type FolderCollaboratorUpdateManyWithoutUserNestedInput = {
    create?: XOR<FolderCollaboratorCreateWithoutUserInput, FolderCollaboratorUncheckedCreateWithoutUserInput> | FolderCollaboratorCreateWithoutUserInput[] | FolderCollaboratorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FolderCollaboratorCreateOrConnectWithoutUserInput | FolderCollaboratorCreateOrConnectWithoutUserInput[]
    upsert?: FolderCollaboratorUpsertWithWhereUniqueWithoutUserInput | FolderCollaboratorUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FolderCollaboratorCreateManyUserInputEnvelope
    set?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
    disconnect?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
    delete?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
    connect?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
    update?: FolderCollaboratorUpdateWithWhereUniqueWithoutUserInput | FolderCollaboratorUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FolderCollaboratorUpdateManyWithWhereWithoutUserInput | FolderCollaboratorUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FolderCollaboratorScalarWhereInput | FolderCollaboratorScalarWhereInput[]
  }

  export type CollectionCollaboratorUpdateManyWithoutUserNestedInput = {
    create?: XOR<CollectionCollaboratorCreateWithoutUserInput, CollectionCollaboratorUncheckedCreateWithoutUserInput> | CollectionCollaboratorCreateWithoutUserInput[] | CollectionCollaboratorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CollectionCollaboratorCreateOrConnectWithoutUserInput | CollectionCollaboratorCreateOrConnectWithoutUserInput[]
    upsert?: CollectionCollaboratorUpsertWithWhereUniqueWithoutUserInput | CollectionCollaboratorUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CollectionCollaboratorCreateManyUserInputEnvelope
    set?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
    disconnect?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
    delete?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
    connect?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
    update?: CollectionCollaboratorUpdateWithWhereUniqueWithoutUserInput | CollectionCollaboratorUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CollectionCollaboratorUpdateManyWithWhereWithoutUserInput | CollectionCollaboratorUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CollectionCollaboratorScalarWhereInput | CollectionCollaboratorScalarWhereInput[]
  }

  export type DeviceUpdateManyWithoutUserNestedInput = {
    create?: XOR<DeviceCreateWithoutUserInput, DeviceUncheckedCreateWithoutUserInput> | DeviceCreateWithoutUserInput[] | DeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutUserInput | DeviceCreateOrConnectWithoutUserInput[]
    upsert?: DeviceUpsertWithWhereUniqueWithoutUserInput | DeviceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DeviceCreateManyUserInputEnvelope
    set?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    disconnect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    delete?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    update?: DeviceUpdateWithWhereUniqueWithoutUserInput | DeviceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DeviceUpdateManyWithWhereWithoutUserInput | DeviceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
  }

  export type BookmarkUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput> | BookmarkCreateWithoutUserInput[] | BookmarkUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookmarkCreateOrConnectWithoutUserInput | BookmarkCreateOrConnectWithoutUserInput[]
    upsert?: BookmarkUpsertWithWhereUniqueWithoutUserInput | BookmarkUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BookmarkCreateManyUserInputEnvelope
    set?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    disconnect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    delete?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    connect?: BookmarkWhereUniqueInput | BookmarkWhereUniqueInput[]
    update?: BookmarkUpdateWithWhereUniqueWithoutUserInput | BookmarkUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BookmarkUpdateManyWithWhereWithoutUserInput | BookmarkUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
  }

  export type FolderUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<FolderCreateWithoutUserInput, FolderUncheckedCreateWithoutUserInput> | FolderCreateWithoutUserInput[] | FolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FolderCreateOrConnectWithoutUserInput | FolderCreateOrConnectWithoutUserInput[]
    upsert?: FolderUpsertWithWhereUniqueWithoutUserInput | FolderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FolderCreateManyUserInputEnvelope
    set?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
    disconnect?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
    delete?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
    connect?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
    update?: FolderUpdateWithWhereUniqueWithoutUserInput | FolderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FolderUpdateManyWithWhereWithoutUserInput | FolderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FolderScalarWhereInput | FolderScalarWhereInput[]
  }

  export type TagUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TagCreateWithoutUserInput, TagUncheckedCreateWithoutUserInput> | TagCreateWithoutUserInput[] | TagUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TagCreateOrConnectWithoutUserInput | TagCreateOrConnectWithoutUserInput[]
    upsert?: TagUpsertWithWhereUniqueWithoutUserInput | TagUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TagCreateManyUserInputEnvelope
    set?: TagWhereUniqueInput | TagWhereUniqueInput[]
    disconnect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    delete?: TagWhereUniqueInput | TagWhereUniqueInput[]
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    update?: TagUpdateWithWhereUniqueWithoutUserInput | TagUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TagUpdateManyWithWhereWithoutUserInput | TagUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TagScalarWhereInput | TagScalarWhereInput[]
  }

  export type CollectionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CollectionCreateWithoutUserInput, CollectionUncheckedCreateWithoutUserInput> | CollectionCreateWithoutUserInput[] | CollectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CollectionCreateOrConnectWithoutUserInput | CollectionCreateOrConnectWithoutUserInput[]
    upsert?: CollectionUpsertWithWhereUniqueWithoutUserInput | CollectionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CollectionCreateManyUserInputEnvelope
    set?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    disconnect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    delete?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    connect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    update?: CollectionUpdateWithWhereUniqueWithoutUserInput | CollectionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CollectionUpdateManyWithWhereWithoutUserInput | CollectionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CollectionScalarWhereInput | CollectionScalarWhereInput[]
  }

  export type CollectionUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<CollectionCreateWithoutOwnerInput, CollectionUncheckedCreateWithoutOwnerInput> | CollectionCreateWithoutOwnerInput[] | CollectionUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: CollectionCreateOrConnectWithoutOwnerInput | CollectionCreateOrConnectWithoutOwnerInput[]
    upsert?: CollectionUpsertWithWhereUniqueWithoutOwnerInput | CollectionUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: CollectionCreateManyOwnerInputEnvelope
    set?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    disconnect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    delete?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    connect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    update?: CollectionUpdateWithWhereUniqueWithoutOwnerInput | CollectionUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: CollectionUpdateManyWithWhereWithoutOwnerInput | CollectionUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: CollectionScalarWhereInput | CollectionScalarWhereInput[]
  }

  export type FolderCollaboratorUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<FolderCollaboratorCreateWithoutUserInput, FolderCollaboratorUncheckedCreateWithoutUserInput> | FolderCollaboratorCreateWithoutUserInput[] | FolderCollaboratorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FolderCollaboratorCreateOrConnectWithoutUserInput | FolderCollaboratorCreateOrConnectWithoutUserInput[]
    upsert?: FolderCollaboratorUpsertWithWhereUniqueWithoutUserInput | FolderCollaboratorUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FolderCollaboratorCreateManyUserInputEnvelope
    set?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
    disconnect?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
    delete?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
    connect?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
    update?: FolderCollaboratorUpdateWithWhereUniqueWithoutUserInput | FolderCollaboratorUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FolderCollaboratorUpdateManyWithWhereWithoutUserInput | FolderCollaboratorUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FolderCollaboratorScalarWhereInput | FolderCollaboratorScalarWhereInput[]
  }

  export type CollectionCollaboratorUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CollectionCollaboratorCreateWithoutUserInput, CollectionCollaboratorUncheckedCreateWithoutUserInput> | CollectionCollaboratorCreateWithoutUserInput[] | CollectionCollaboratorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CollectionCollaboratorCreateOrConnectWithoutUserInput | CollectionCollaboratorCreateOrConnectWithoutUserInput[]
    upsert?: CollectionCollaboratorUpsertWithWhereUniqueWithoutUserInput | CollectionCollaboratorUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CollectionCollaboratorCreateManyUserInputEnvelope
    set?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
    disconnect?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
    delete?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
    connect?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
    update?: CollectionCollaboratorUpdateWithWhereUniqueWithoutUserInput | CollectionCollaboratorUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CollectionCollaboratorUpdateManyWithWhereWithoutUserInput | CollectionCollaboratorUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CollectionCollaboratorScalarWhereInput | CollectionCollaboratorScalarWhereInput[]
  }

  export type DeviceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DeviceCreateWithoutUserInput, DeviceUncheckedCreateWithoutUserInput> | DeviceCreateWithoutUserInput[] | DeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutUserInput | DeviceCreateOrConnectWithoutUserInput[]
    upsert?: DeviceUpsertWithWhereUniqueWithoutUserInput | DeviceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DeviceCreateManyUserInputEnvelope
    set?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    disconnect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    delete?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    update?: DeviceUpdateWithWhereUniqueWithoutUserInput | DeviceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DeviceUpdateManyWithWhereWithoutUserInput | DeviceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutBookmarksInput = {
    create?: XOR<UserCreateWithoutBookmarksInput, UserUncheckedCreateWithoutBookmarksInput>
    connectOrCreate?: UserCreateOrConnectWithoutBookmarksInput
    connect?: UserWhereUniqueInput
  }

  export type FolderBookmarkCreateNestedManyWithoutBookmarkInput = {
    create?: XOR<FolderBookmarkCreateWithoutBookmarkInput, FolderBookmarkUncheckedCreateWithoutBookmarkInput> | FolderBookmarkCreateWithoutBookmarkInput[] | FolderBookmarkUncheckedCreateWithoutBookmarkInput[]
    connectOrCreate?: FolderBookmarkCreateOrConnectWithoutBookmarkInput | FolderBookmarkCreateOrConnectWithoutBookmarkInput[]
    createMany?: FolderBookmarkCreateManyBookmarkInputEnvelope
    connect?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
  }

  export type BookmarkTagCreateNestedManyWithoutBookmarkInput = {
    create?: XOR<BookmarkTagCreateWithoutBookmarkInput, BookmarkTagUncheckedCreateWithoutBookmarkInput> | BookmarkTagCreateWithoutBookmarkInput[] | BookmarkTagUncheckedCreateWithoutBookmarkInput[]
    connectOrCreate?: BookmarkTagCreateOrConnectWithoutBookmarkInput | BookmarkTagCreateOrConnectWithoutBookmarkInput[]
    createMany?: BookmarkTagCreateManyBookmarkInputEnvelope
    connect?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
  }

  export type BookmarkCollectionCreateNestedManyWithoutBookmarkInput = {
    create?: XOR<BookmarkCollectionCreateWithoutBookmarkInput, BookmarkCollectionUncheckedCreateWithoutBookmarkInput> | BookmarkCollectionCreateWithoutBookmarkInput[] | BookmarkCollectionUncheckedCreateWithoutBookmarkInput[]
    connectOrCreate?: BookmarkCollectionCreateOrConnectWithoutBookmarkInput | BookmarkCollectionCreateOrConnectWithoutBookmarkInput[]
    createMany?: BookmarkCollectionCreateManyBookmarkInputEnvelope
    connect?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
  }

  export type FolderBookmarkUncheckedCreateNestedManyWithoutBookmarkInput = {
    create?: XOR<FolderBookmarkCreateWithoutBookmarkInput, FolderBookmarkUncheckedCreateWithoutBookmarkInput> | FolderBookmarkCreateWithoutBookmarkInput[] | FolderBookmarkUncheckedCreateWithoutBookmarkInput[]
    connectOrCreate?: FolderBookmarkCreateOrConnectWithoutBookmarkInput | FolderBookmarkCreateOrConnectWithoutBookmarkInput[]
    createMany?: FolderBookmarkCreateManyBookmarkInputEnvelope
    connect?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
  }

  export type BookmarkTagUncheckedCreateNestedManyWithoutBookmarkInput = {
    create?: XOR<BookmarkTagCreateWithoutBookmarkInput, BookmarkTagUncheckedCreateWithoutBookmarkInput> | BookmarkTagCreateWithoutBookmarkInput[] | BookmarkTagUncheckedCreateWithoutBookmarkInput[]
    connectOrCreate?: BookmarkTagCreateOrConnectWithoutBookmarkInput | BookmarkTagCreateOrConnectWithoutBookmarkInput[]
    createMany?: BookmarkTagCreateManyBookmarkInputEnvelope
    connect?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
  }

  export type BookmarkCollectionUncheckedCreateNestedManyWithoutBookmarkInput = {
    create?: XOR<BookmarkCollectionCreateWithoutBookmarkInput, BookmarkCollectionUncheckedCreateWithoutBookmarkInput> | BookmarkCollectionCreateWithoutBookmarkInput[] | BookmarkCollectionUncheckedCreateWithoutBookmarkInput[]
    connectOrCreate?: BookmarkCollectionCreateOrConnectWithoutBookmarkInput | BookmarkCollectionCreateOrConnectWithoutBookmarkInput[]
    createMany?: BookmarkCollectionCreateManyBookmarkInputEnvelope
    connect?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutBookmarksNestedInput = {
    create?: XOR<UserCreateWithoutBookmarksInput, UserUncheckedCreateWithoutBookmarksInput>
    connectOrCreate?: UserCreateOrConnectWithoutBookmarksInput
    upsert?: UserUpsertWithoutBookmarksInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBookmarksInput, UserUpdateWithoutBookmarksInput>, UserUncheckedUpdateWithoutBookmarksInput>
  }

  export type FolderBookmarkUpdateManyWithoutBookmarkNestedInput = {
    create?: XOR<FolderBookmarkCreateWithoutBookmarkInput, FolderBookmarkUncheckedCreateWithoutBookmarkInput> | FolderBookmarkCreateWithoutBookmarkInput[] | FolderBookmarkUncheckedCreateWithoutBookmarkInput[]
    connectOrCreate?: FolderBookmarkCreateOrConnectWithoutBookmarkInput | FolderBookmarkCreateOrConnectWithoutBookmarkInput[]
    upsert?: FolderBookmarkUpsertWithWhereUniqueWithoutBookmarkInput | FolderBookmarkUpsertWithWhereUniqueWithoutBookmarkInput[]
    createMany?: FolderBookmarkCreateManyBookmarkInputEnvelope
    set?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
    disconnect?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
    delete?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
    connect?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
    update?: FolderBookmarkUpdateWithWhereUniqueWithoutBookmarkInput | FolderBookmarkUpdateWithWhereUniqueWithoutBookmarkInput[]
    updateMany?: FolderBookmarkUpdateManyWithWhereWithoutBookmarkInput | FolderBookmarkUpdateManyWithWhereWithoutBookmarkInput[]
    deleteMany?: FolderBookmarkScalarWhereInput | FolderBookmarkScalarWhereInput[]
  }

  export type BookmarkTagUpdateManyWithoutBookmarkNestedInput = {
    create?: XOR<BookmarkTagCreateWithoutBookmarkInput, BookmarkTagUncheckedCreateWithoutBookmarkInput> | BookmarkTagCreateWithoutBookmarkInput[] | BookmarkTagUncheckedCreateWithoutBookmarkInput[]
    connectOrCreate?: BookmarkTagCreateOrConnectWithoutBookmarkInput | BookmarkTagCreateOrConnectWithoutBookmarkInput[]
    upsert?: BookmarkTagUpsertWithWhereUniqueWithoutBookmarkInput | BookmarkTagUpsertWithWhereUniqueWithoutBookmarkInput[]
    createMany?: BookmarkTagCreateManyBookmarkInputEnvelope
    set?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
    disconnect?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
    delete?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
    connect?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
    update?: BookmarkTagUpdateWithWhereUniqueWithoutBookmarkInput | BookmarkTagUpdateWithWhereUniqueWithoutBookmarkInput[]
    updateMany?: BookmarkTagUpdateManyWithWhereWithoutBookmarkInput | BookmarkTagUpdateManyWithWhereWithoutBookmarkInput[]
    deleteMany?: BookmarkTagScalarWhereInput | BookmarkTagScalarWhereInput[]
  }

  export type BookmarkCollectionUpdateManyWithoutBookmarkNestedInput = {
    create?: XOR<BookmarkCollectionCreateWithoutBookmarkInput, BookmarkCollectionUncheckedCreateWithoutBookmarkInput> | BookmarkCollectionCreateWithoutBookmarkInput[] | BookmarkCollectionUncheckedCreateWithoutBookmarkInput[]
    connectOrCreate?: BookmarkCollectionCreateOrConnectWithoutBookmarkInput | BookmarkCollectionCreateOrConnectWithoutBookmarkInput[]
    upsert?: BookmarkCollectionUpsertWithWhereUniqueWithoutBookmarkInput | BookmarkCollectionUpsertWithWhereUniqueWithoutBookmarkInput[]
    createMany?: BookmarkCollectionCreateManyBookmarkInputEnvelope
    set?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
    disconnect?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
    delete?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
    connect?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
    update?: BookmarkCollectionUpdateWithWhereUniqueWithoutBookmarkInput | BookmarkCollectionUpdateWithWhereUniqueWithoutBookmarkInput[]
    updateMany?: BookmarkCollectionUpdateManyWithWhereWithoutBookmarkInput | BookmarkCollectionUpdateManyWithWhereWithoutBookmarkInput[]
    deleteMany?: BookmarkCollectionScalarWhereInput | BookmarkCollectionScalarWhereInput[]
  }

  export type FolderBookmarkUncheckedUpdateManyWithoutBookmarkNestedInput = {
    create?: XOR<FolderBookmarkCreateWithoutBookmarkInput, FolderBookmarkUncheckedCreateWithoutBookmarkInput> | FolderBookmarkCreateWithoutBookmarkInput[] | FolderBookmarkUncheckedCreateWithoutBookmarkInput[]
    connectOrCreate?: FolderBookmarkCreateOrConnectWithoutBookmarkInput | FolderBookmarkCreateOrConnectWithoutBookmarkInput[]
    upsert?: FolderBookmarkUpsertWithWhereUniqueWithoutBookmarkInput | FolderBookmarkUpsertWithWhereUniqueWithoutBookmarkInput[]
    createMany?: FolderBookmarkCreateManyBookmarkInputEnvelope
    set?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
    disconnect?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
    delete?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
    connect?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
    update?: FolderBookmarkUpdateWithWhereUniqueWithoutBookmarkInput | FolderBookmarkUpdateWithWhereUniqueWithoutBookmarkInput[]
    updateMany?: FolderBookmarkUpdateManyWithWhereWithoutBookmarkInput | FolderBookmarkUpdateManyWithWhereWithoutBookmarkInput[]
    deleteMany?: FolderBookmarkScalarWhereInput | FolderBookmarkScalarWhereInput[]
  }

  export type BookmarkTagUncheckedUpdateManyWithoutBookmarkNestedInput = {
    create?: XOR<BookmarkTagCreateWithoutBookmarkInput, BookmarkTagUncheckedCreateWithoutBookmarkInput> | BookmarkTagCreateWithoutBookmarkInput[] | BookmarkTagUncheckedCreateWithoutBookmarkInput[]
    connectOrCreate?: BookmarkTagCreateOrConnectWithoutBookmarkInput | BookmarkTagCreateOrConnectWithoutBookmarkInput[]
    upsert?: BookmarkTagUpsertWithWhereUniqueWithoutBookmarkInput | BookmarkTagUpsertWithWhereUniqueWithoutBookmarkInput[]
    createMany?: BookmarkTagCreateManyBookmarkInputEnvelope
    set?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
    disconnect?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
    delete?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
    connect?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
    update?: BookmarkTagUpdateWithWhereUniqueWithoutBookmarkInput | BookmarkTagUpdateWithWhereUniqueWithoutBookmarkInput[]
    updateMany?: BookmarkTagUpdateManyWithWhereWithoutBookmarkInput | BookmarkTagUpdateManyWithWhereWithoutBookmarkInput[]
    deleteMany?: BookmarkTagScalarWhereInput | BookmarkTagScalarWhereInput[]
  }

  export type BookmarkCollectionUncheckedUpdateManyWithoutBookmarkNestedInput = {
    create?: XOR<BookmarkCollectionCreateWithoutBookmarkInput, BookmarkCollectionUncheckedCreateWithoutBookmarkInput> | BookmarkCollectionCreateWithoutBookmarkInput[] | BookmarkCollectionUncheckedCreateWithoutBookmarkInput[]
    connectOrCreate?: BookmarkCollectionCreateOrConnectWithoutBookmarkInput | BookmarkCollectionCreateOrConnectWithoutBookmarkInput[]
    upsert?: BookmarkCollectionUpsertWithWhereUniqueWithoutBookmarkInput | BookmarkCollectionUpsertWithWhereUniqueWithoutBookmarkInput[]
    createMany?: BookmarkCollectionCreateManyBookmarkInputEnvelope
    set?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
    disconnect?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
    delete?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
    connect?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
    update?: BookmarkCollectionUpdateWithWhereUniqueWithoutBookmarkInput | BookmarkCollectionUpdateWithWhereUniqueWithoutBookmarkInput[]
    updateMany?: BookmarkCollectionUpdateManyWithWhereWithoutBookmarkInput | BookmarkCollectionUpdateManyWithWhereWithoutBookmarkInput[]
    deleteMany?: BookmarkCollectionScalarWhereInput | BookmarkCollectionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutFoldersInput = {
    create?: XOR<UserCreateWithoutFoldersInput, UserUncheckedCreateWithoutFoldersInput>
    connectOrCreate?: UserCreateOrConnectWithoutFoldersInput
    connect?: UserWhereUniqueInput
  }

  export type FolderCreateNestedOneWithoutChildrenInput = {
    create?: XOR<FolderCreateWithoutChildrenInput, FolderUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: FolderCreateOrConnectWithoutChildrenInput
    connect?: FolderWhereUniqueInput
  }

  export type FolderCreateNestedManyWithoutParentInput = {
    create?: XOR<FolderCreateWithoutParentInput, FolderUncheckedCreateWithoutParentInput> | FolderCreateWithoutParentInput[] | FolderUncheckedCreateWithoutParentInput[]
    connectOrCreate?: FolderCreateOrConnectWithoutParentInput | FolderCreateOrConnectWithoutParentInput[]
    createMany?: FolderCreateManyParentInputEnvelope
    connect?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
  }

  export type FolderBookmarkCreateNestedManyWithoutFolderInput = {
    create?: XOR<FolderBookmarkCreateWithoutFolderInput, FolderBookmarkUncheckedCreateWithoutFolderInput> | FolderBookmarkCreateWithoutFolderInput[] | FolderBookmarkUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: FolderBookmarkCreateOrConnectWithoutFolderInput | FolderBookmarkCreateOrConnectWithoutFolderInput[]
    createMany?: FolderBookmarkCreateManyFolderInputEnvelope
    connect?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
  }

  export type FolderCollaboratorCreateNestedManyWithoutFolderInput = {
    create?: XOR<FolderCollaboratorCreateWithoutFolderInput, FolderCollaboratorUncheckedCreateWithoutFolderInput> | FolderCollaboratorCreateWithoutFolderInput[] | FolderCollaboratorUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: FolderCollaboratorCreateOrConnectWithoutFolderInput | FolderCollaboratorCreateOrConnectWithoutFolderInput[]
    createMany?: FolderCollaboratorCreateManyFolderInputEnvelope
    connect?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
  }

  export type FolderUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<FolderCreateWithoutParentInput, FolderUncheckedCreateWithoutParentInput> | FolderCreateWithoutParentInput[] | FolderUncheckedCreateWithoutParentInput[]
    connectOrCreate?: FolderCreateOrConnectWithoutParentInput | FolderCreateOrConnectWithoutParentInput[]
    createMany?: FolderCreateManyParentInputEnvelope
    connect?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
  }

  export type FolderBookmarkUncheckedCreateNestedManyWithoutFolderInput = {
    create?: XOR<FolderBookmarkCreateWithoutFolderInput, FolderBookmarkUncheckedCreateWithoutFolderInput> | FolderBookmarkCreateWithoutFolderInput[] | FolderBookmarkUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: FolderBookmarkCreateOrConnectWithoutFolderInput | FolderBookmarkCreateOrConnectWithoutFolderInput[]
    createMany?: FolderBookmarkCreateManyFolderInputEnvelope
    connect?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
  }

  export type FolderCollaboratorUncheckedCreateNestedManyWithoutFolderInput = {
    create?: XOR<FolderCollaboratorCreateWithoutFolderInput, FolderCollaboratorUncheckedCreateWithoutFolderInput> | FolderCollaboratorCreateWithoutFolderInput[] | FolderCollaboratorUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: FolderCollaboratorCreateOrConnectWithoutFolderInput | FolderCollaboratorCreateOrConnectWithoutFolderInput[]
    createMany?: FolderCollaboratorCreateManyFolderInputEnvelope
    connect?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutFoldersNestedInput = {
    create?: XOR<UserCreateWithoutFoldersInput, UserUncheckedCreateWithoutFoldersInput>
    connectOrCreate?: UserCreateOrConnectWithoutFoldersInput
    upsert?: UserUpsertWithoutFoldersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFoldersInput, UserUpdateWithoutFoldersInput>, UserUncheckedUpdateWithoutFoldersInput>
  }

  export type FolderUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<FolderCreateWithoutChildrenInput, FolderUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: FolderCreateOrConnectWithoutChildrenInput
    upsert?: FolderUpsertWithoutChildrenInput
    disconnect?: FolderWhereInput | boolean
    delete?: FolderWhereInput | boolean
    connect?: FolderWhereUniqueInput
    update?: XOR<XOR<FolderUpdateToOneWithWhereWithoutChildrenInput, FolderUpdateWithoutChildrenInput>, FolderUncheckedUpdateWithoutChildrenInput>
  }

  export type FolderUpdateManyWithoutParentNestedInput = {
    create?: XOR<FolderCreateWithoutParentInput, FolderUncheckedCreateWithoutParentInput> | FolderCreateWithoutParentInput[] | FolderUncheckedCreateWithoutParentInput[]
    connectOrCreate?: FolderCreateOrConnectWithoutParentInput | FolderCreateOrConnectWithoutParentInput[]
    upsert?: FolderUpsertWithWhereUniqueWithoutParentInput | FolderUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: FolderCreateManyParentInputEnvelope
    set?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
    disconnect?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
    delete?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
    connect?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
    update?: FolderUpdateWithWhereUniqueWithoutParentInput | FolderUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: FolderUpdateManyWithWhereWithoutParentInput | FolderUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: FolderScalarWhereInput | FolderScalarWhereInput[]
  }

  export type FolderBookmarkUpdateManyWithoutFolderNestedInput = {
    create?: XOR<FolderBookmarkCreateWithoutFolderInput, FolderBookmarkUncheckedCreateWithoutFolderInput> | FolderBookmarkCreateWithoutFolderInput[] | FolderBookmarkUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: FolderBookmarkCreateOrConnectWithoutFolderInput | FolderBookmarkCreateOrConnectWithoutFolderInput[]
    upsert?: FolderBookmarkUpsertWithWhereUniqueWithoutFolderInput | FolderBookmarkUpsertWithWhereUniqueWithoutFolderInput[]
    createMany?: FolderBookmarkCreateManyFolderInputEnvelope
    set?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
    disconnect?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
    delete?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
    connect?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
    update?: FolderBookmarkUpdateWithWhereUniqueWithoutFolderInput | FolderBookmarkUpdateWithWhereUniqueWithoutFolderInput[]
    updateMany?: FolderBookmarkUpdateManyWithWhereWithoutFolderInput | FolderBookmarkUpdateManyWithWhereWithoutFolderInput[]
    deleteMany?: FolderBookmarkScalarWhereInput | FolderBookmarkScalarWhereInput[]
  }

  export type FolderCollaboratorUpdateManyWithoutFolderNestedInput = {
    create?: XOR<FolderCollaboratorCreateWithoutFolderInput, FolderCollaboratorUncheckedCreateWithoutFolderInput> | FolderCollaboratorCreateWithoutFolderInput[] | FolderCollaboratorUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: FolderCollaboratorCreateOrConnectWithoutFolderInput | FolderCollaboratorCreateOrConnectWithoutFolderInput[]
    upsert?: FolderCollaboratorUpsertWithWhereUniqueWithoutFolderInput | FolderCollaboratorUpsertWithWhereUniqueWithoutFolderInput[]
    createMany?: FolderCollaboratorCreateManyFolderInputEnvelope
    set?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
    disconnect?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
    delete?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
    connect?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
    update?: FolderCollaboratorUpdateWithWhereUniqueWithoutFolderInput | FolderCollaboratorUpdateWithWhereUniqueWithoutFolderInput[]
    updateMany?: FolderCollaboratorUpdateManyWithWhereWithoutFolderInput | FolderCollaboratorUpdateManyWithWhereWithoutFolderInput[]
    deleteMany?: FolderCollaboratorScalarWhereInput | FolderCollaboratorScalarWhereInput[]
  }

  export type FolderUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<FolderCreateWithoutParentInput, FolderUncheckedCreateWithoutParentInput> | FolderCreateWithoutParentInput[] | FolderUncheckedCreateWithoutParentInput[]
    connectOrCreate?: FolderCreateOrConnectWithoutParentInput | FolderCreateOrConnectWithoutParentInput[]
    upsert?: FolderUpsertWithWhereUniqueWithoutParentInput | FolderUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: FolderCreateManyParentInputEnvelope
    set?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
    disconnect?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
    delete?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
    connect?: FolderWhereUniqueInput | FolderWhereUniqueInput[]
    update?: FolderUpdateWithWhereUniqueWithoutParentInput | FolderUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: FolderUpdateManyWithWhereWithoutParentInput | FolderUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: FolderScalarWhereInput | FolderScalarWhereInput[]
  }

  export type FolderBookmarkUncheckedUpdateManyWithoutFolderNestedInput = {
    create?: XOR<FolderBookmarkCreateWithoutFolderInput, FolderBookmarkUncheckedCreateWithoutFolderInput> | FolderBookmarkCreateWithoutFolderInput[] | FolderBookmarkUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: FolderBookmarkCreateOrConnectWithoutFolderInput | FolderBookmarkCreateOrConnectWithoutFolderInput[]
    upsert?: FolderBookmarkUpsertWithWhereUniqueWithoutFolderInput | FolderBookmarkUpsertWithWhereUniqueWithoutFolderInput[]
    createMany?: FolderBookmarkCreateManyFolderInputEnvelope
    set?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
    disconnect?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
    delete?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
    connect?: FolderBookmarkWhereUniqueInput | FolderBookmarkWhereUniqueInput[]
    update?: FolderBookmarkUpdateWithWhereUniqueWithoutFolderInput | FolderBookmarkUpdateWithWhereUniqueWithoutFolderInput[]
    updateMany?: FolderBookmarkUpdateManyWithWhereWithoutFolderInput | FolderBookmarkUpdateManyWithWhereWithoutFolderInput[]
    deleteMany?: FolderBookmarkScalarWhereInput | FolderBookmarkScalarWhereInput[]
  }

  export type FolderCollaboratorUncheckedUpdateManyWithoutFolderNestedInput = {
    create?: XOR<FolderCollaboratorCreateWithoutFolderInput, FolderCollaboratorUncheckedCreateWithoutFolderInput> | FolderCollaboratorCreateWithoutFolderInput[] | FolderCollaboratorUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: FolderCollaboratorCreateOrConnectWithoutFolderInput | FolderCollaboratorCreateOrConnectWithoutFolderInput[]
    upsert?: FolderCollaboratorUpsertWithWhereUniqueWithoutFolderInput | FolderCollaboratorUpsertWithWhereUniqueWithoutFolderInput[]
    createMany?: FolderCollaboratorCreateManyFolderInputEnvelope
    set?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
    disconnect?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
    delete?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
    connect?: FolderCollaboratorWhereUniqueInput | FolderCollaboratorWhereUniqueInput[]
    update?: FolderCollaboratorUpdateWithWhereUniqueWithoutFolderInput | FolderCollaboratorUpdateWithWhereUniqueWithoutFolderInput[]
    updateMany?: FolderCollaboratorUpdateManyWithWhereWithoutFolderInput | FolderCollaboratorUpdateManyWithWhereWithoutFolderInput[]
    deleteMany?: FolderCollaboratorScalarWhereInput | FolderCollaboratorScalarWhereInput[]
  }

  export type FolderCreateNestedOneWithoutBookmarksInput = {
    create?: XOR<FolderCreateWithoutBookmarksInput, FolderUncheckedCreateWithoutBookmarksInput>
    connectOrCreate?: FolderCreateOrConnectWithoutBookmarksInput
    connect?: FolderWhereUniqueInput
  }

  export type BookmarkCreateNestedOneWithoutFoldersInput = {
    create?: XOR<BookmarkCreateWithoutFoldersInput, BookmarkUncheckedCreateWithoutFoldersInput>
    connectOrCreate?: BookmarkCreateOrConnectWithoutFoldersInput
    connect?: BookmarkWhereUniqueInput
  }

  export type FolderUpdateOneRequiredWithoutBookmarksNestedInput = {
    create?: XOR<FolderCreateWithoutBookmarksInput, FolderUncheckedCreateWithoutBookmarksInput>
    connectOrCreate?: FolderCreateOrConnectWithoutBookmarksInput
    upsert?: FolderUpsertWithoutBookmarksInput
    connect?: FolderWhereUniqueInput
    update?: XOR<XOR<FolderUpdateToOneWithWhereWithoutBookmarksInput, FolderUpdateWithoutBookmarksInput>, FolderUncheckedUpdateWithoutBookmarksInput>
  }

  export type BookmarkUpdateOneRequiredWithoutFoldersNestedInput = {
    create?: XOR<BookmarkCreateWithoutFoldersInput, BookmarkUncheckedCreateWithoutFoldersInput>
    connectOrCreate?: BookmarkCreateOrConnectWithoutFoldersInput
    upsert?: BookmarkUpsertWithoutFoldersInput
    connect?: BookmarkWhereUniqueInput
    update?: XOR<XOR<BookmarkUpdateToOneWithWhereWithoutFoldersInput, BookmarkUpdateWithoutFoldersInput>, BookmarkUncheckedUpdateWithoutFoldersInput>
  }

  export type FolderCreateNestedOneWithoutCollaboratorsInput = {
    create?: XOR<FolderCreateWithoutCollaboratorsInput, FolderUncheckedCreateWithoutCollaboratorsInput>
    connectOrCreate?: FolderCreateOrConnectWithoutCollaboratorsInput
    connect?: FolderWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCollabFoldersInput = {
    create?: XOR<UserCreateWithoutCollabFoldersInput, UserUncheckedCreateWithoutCollabFoldersInput>
    connectOrCreate?: UserCreateOrConnectWithoutCollabFoldersInput
    connect?: UserWhereUniqueInput
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type FolderUpdateOneRequiredWithoutCollaboratorsNestedInput = {
    create?: XOR<FolderCreateWithoutCollaboratorsInput, FolderUncheckedCreateWithoutCollaboratorsInput>
    connectOrCreate?: FolderCreateOrConnectWithoutCollaboratorsInput
    upsert?: FolderUpsertWithoutCollaboratorsInput
    connect?: FolderWhereUniqueInput
    update?: XOR<XOR<FolderUpdateToOneWithWhereWithoutCollaboratorsInput, FolderUpdateWithoutCollaboratorsInput>, FolderUncheckedUpdateWithoutCollaboratorsInput>
  }

  export type UserUpdateOneRequiredWithoutCollabFoldersNestedInput = {
    create?: XOR<UserCreateWithoutCollabFoldersInput, UserUncheckedCreateWithoutCollabFoldersInput>
    connectOrCreate?: UserCreateOrConnectWithoutCollabFoldersInput
    upsert?: UserUpsertWithoutCollabFoldersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCollabFoldersInput, UserUpdateWithoutCollabFoldersInput>, UserUncheckedUpdateWithoutCollabFoldersInput>
  }

  export type UserCreateNestedOneWithoutTagsInput = {
    create?: XOR<UserCreateWithoutTagsInput, UserUncheckedCreateWithoutTagsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTagsInput
    connect?: UserWhereUniqueInput
  }

  export type BookmarkTagCreateNestedManyWithoutTagInput = {
    create?: XOR<BookmarkTagCreateWithoutTagInput, BookmarkTagUncheckedCreateWithoutTagInput> | BookmarkTagCreateWithoutTagInput[] | BookmarkTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: BookmarkTagCreateOrConnectWithoutTagInput | BookmarkTagCreateOrConnectWithoutTagInput[]
    createMany?: BookmarkTagCreateManyTagInputEnvelope
    connect?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
  }

  export type BookmarkTagUncheckedCreateNestedManyWithoutTagInput = {
    create?: XOR<BookmarkTagCreateWithoutTagInput, BookmarkTagUncheckedCreateWithoutTagInput> | BookmarkTagCreateWithoutTagInput[] | BookmarkTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: BookmarkTagCreateOrConnectWithoutTagInput | BookmarkTagCreateOrConnectWithoutTagInput[]
    createMany?: BookmarkTagCreateManyTagInputEnvelope
    connect?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutTagsNestedInput = {
    create?: XOR<UserCreateWithoutTagsInput, UserUncheckedCreateWithoutTagsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTagsInput
    upsert?: UserUpsertWithoutTagsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTagsInput, UserUpdateWithoutTagsInput>, UserUncheckedUpdateWithoutTagsInput>
  }

  export type BookmarkTagUpdateManyWithoutTagNestedInput = {
    create?: XOR<BookmarkTagCreateWithoutTagInput, BookmarkTagUncheckedCreateWithoutTagInput> | BookmarkTagCreateWithoutTagInput[] | BookmarkTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: BookmarkTagCreateOrConnectWithoutTagInput | BookmarkTagCreateOrConnectWithoutTagInput[]
    upsert?: BookmarkTagUpsertWithWhereUniqueWithoutTagInput | BookmarkTagUpsertWithWhereUniqueWithoutTagInput[]
    createMany?: BookmarkTagCreateManyTagInputEnvelope
    set?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
    disconnect?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
    delete?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
    connect?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
    update?: BookmarkTagUpdateWithWhereUniqueWithoutTagInput | BookmarkTagUpdateWithWhereUniqueWithoutTagInput[]
    updateMany?: BookmarkTagUpdateManyWithWhereWithoutTagInput | BookmarkTagUpdateManyWithWhereWithoutTagInput[]
    deleteMany?: BookmarkTagScalarWhereInput | BookmarkTagScalarWhereInput[]
  }

  export type BookmarkTagUncheckedUpdateManyWithoutTagNestedInput = {
    create?: XOR<BookmarkTagCreateWithoutTagInput, BookmarkTagUncheckedCreateWithoutTagInput> | BookmarkTagCreateWithoutTagInput[] | BookmarkTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: BookmarkTagCreateOrConnectWithoutTagInput | BookmarkTagCreateOrConnectWithoutTagInput[]
    upsert?: BookmarkTagUpsertWithWhereUniqueWithoutTagInput | BookmarkTagUpsertWithWhereUniqueWithoutTagInput[]
    createMany?: BookmarkTagCreateManyTagInputEnvelope
    set?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
    disconnect?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
    delete?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
    connect?: BookmarkTagWhereUniqueInput | BookmarkTagWhereUniqueInput[]
    update?: BookmarkTagUpdateWithWhereUniqueWithoutTagInput | BookmarkTagUpdateWithWhereUniqueWithoutTagInput[]
    updateMany?: BookmarkTagUpdateManyWithWhereWithoutTagInput | BookmarkTagUpdateManyWithWhereWithoutTagInput[]
    deleteMany?: BookmarkTagScalarWhereInput | BookmarkTagScalarWhereInput[]
  }

  export type TagCreateNestedOneWithoutBookmarksInput = {
    create?: XOR<TagCreateWithoutBookmarksInput, TagUncheckedCreateWithoutBookmarksInput>
    connectOrCreate?: TagCreateOrConnectWithoutBookmarksInput
    connect?: TagWhereUniqueInput
  }

  export type BookmarkCreateNestedOneWithoutTagsInput = {
    create?: XOR<BookmarkCreateWithoutTagsInput, BookmarkUncheckedCreateWithoutTagsInput>
    connectOrCreate?: BookmarkCreateOrConnectWithoutTagsInput
    connect?: BookmarkWhereUniqueInput
  }

  export type TagUpdateOneRequiredWithoutBookmarksNestedInput = {
    create?: XOR<TagCreateWithoutBookmarksInput, TagUncheckedCreateWithoutBookmarksInput>
    connectOrCreate?: TagCreateOrConnectWithoutBookmarksInput
    upsert?: TagUpsertWithoutBookmarksInput
    connect?: TagWhereUniqueInput
    update?: XOR<XOR<TagUpdateToOneWithWhereWithoutBookmarksInput, TagUpdateWithoutBookmarksInput>, TagUncheckedUpdateWithoutBookmarksInput>
  }

  export type BookmarkUpdateOneRequiredWithoutTagsNestedInput = {
    create?: XOR<BookmarkCreateWithoutTagsInput, BookmarkUncheckedCreateWithoutTagsInput>
    connectOrCreate?: BookmarkCreateOrConnectWithoutTagsInput
    upsert?: BookmarkUpsertWithoutTagsInput
    connect?: BookmarkWhereUniqueInput
    update?: XOR<XOR<BookmarkUpdateToOneWithWhereWithoutTagsInput, BookmarkUpdateWithoutTagsInput>, BookmarkUncheckedUpdateWithoutTagsInput>
  }

  export type UserCreateNestedOneWithoutCollectionsInput = {
    create?: XOR<UserCreateWithoutCollectionsInput, UserUncheckedCreateWithoutCollectionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCollectionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutOwnedCollectionsInput = {
    create?: XOR<UserCreateWithoutOwnedCollectionsInput, UserUncheckedCreateWithoutOwnedCollectionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedCollectionsInput
    connect?: UserWhereUniqueInput
  }

  export type BookmarkCollectionCreateNestedManyWithoutCollectionInput = {
    create?: XOR<BookmarkCollectionCreateWithoutCollectionInput, BookmarkCollectionUncheckedCreateWithoutCollectionInput> | BookmarkCollectionCreateWithoutCollectionInput[] | BookmarkCollectionUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: BookmarkCollectionCreateOrConnectWithoutCollectionInput | BookmarkCollectionCreateOrConnectWithoutCollectionInput[]
    createMany?: BookmarkCollectionCreateManyCollectionInputEnvelope
    connect?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
  }

  export type CollectionCollaboratorCreateNestedManyWithoutCollectionInput = {
    create?: XOR<CollectionCollaboratorCreateWithoutCollectionInput, CollectionCollaboratorUncheckedCreateWithoutCollectionInput> | CollectionCollaboratorCreateWithoutCollectionInput[] | CollectionCollaboratorUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: CollectionCollaboratorCreateOrConnectWithoutCollectionInput | CollectionCollaboratorCreateOrConnectWithoutCollectionInput[]
    createMany?: CollectionCollaboratorCreateManyCollectionInputEnvelope
    connect?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
  }

  export type BookmarkCollectionUncheckedCreateNestedManyWithoutCollectionInput = {
    create?: XOR<BookmarkCollectionCreateWithoutCollectionInput, BookmarkCollectionUncheckedCreateWithoutCollectionInput> | BookmarkCollectionCreateWithoutCollectionInput[] | BookmarkCollectionUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: BookmarkCollectionCreateOrConnectWithoutCollectionInput | BookmarkCollectionCreateOrConnectWithoutCollectionInput[]
    createMany?: BookmarkCollectionCreateManyCollectionInputEnvelope
    connect?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
  }

  export type CollectionCollaboratorUncheckedCreateNestedManyWithoutCollectionInput = {
    create?: XOR<CollectionCollaboratorCreateWithoutCollectionInput, CollectionCollaboratorUncheckedCreateWithoutCollectionInput> | CollectionCollaboratorCreateWithoutCollectionInput[] | CollectionCollaboratorUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: CollectionCollaboratorCreateOrConnectWithoutCollectionInput | CollectionCollaboratorCreateOrConnectWithoutCollectionInput[]
    createMany?: CollectionCollaboratorCreateManyCollectionInputEnvelope
    connect?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutCollectionsNestedInput = {
    create?: XOR<UserCreateWithoutCollectionsInput, UserUncheckedCreateWithoutCollectionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCollectionsInput
    upsert?: UserUpsertWithoutCollectionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCollectionsInput, UserUpdateWithoutCollectionsInput>, UserUncheckedUpdateWithoutCollectionsInput>
  }

  export type UserUpdateOneRequiredWithoutOwnedCollectionsNestedInput = {
    create?: XOR<UserCreateWithoutOwnedCollectionsInput, UserUncheckedCreateWithoutOwnedCollectionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedCollectionsInput
    upsert?: UserUpsertWithoutOwnedCollectionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOwnedCollectionsInput, UserUpdateWithoutOwnedCollectionsInput>, UserUncheckedUpdateWithoutOwnedCollectionsInput>
  }

  export type BookmarkCollectionUpdateManyWithoutCollectionNestedInput = {
    create?: XOR<BookmarkCollectionCreateWithoutCollectionInput, BookmarkCollectionUncheckedCreateWithoutCollectionInput> | BookmarkCollectionCreateWithoutCollectionInput[] | BookmarkCollectionUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: BookmarkCollectionCreateOrConnectWithoutCollectionInput | BookmarkCollectionCreateOrConnectWithoutCollectionInput[]
    upsert?: BookmarkCollectionUpsertWithWhereUniqueWithoutCollectionInput | BookmarkCollectionUpsertWithWhereUniqueWithoutCollectionInput[]
    createMany?: BookmarkCollectionCreateManyCollectionInputEnvelope
    set?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
    disconnect?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
    delete?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
    connect?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
    update?: BookmarkCollectionUpdateWithWhereUniqueWithoutCollectionInput | BookmarkCollectionUpdateWithWhereUniqueWithoutCollectionInput[]
    updateMany?: BookmarkCollectionUpdateManyWithWhereWithoutCollectionInput | BookmarkCollectionUpdateManyWithWhereWithoutCollectionInput[]
    deleteMany?: BookmarkCollectionScalarWhereInput | BookmarkCollectionScalarWhereInput[]
  }

  export type CollectionCollaboratorUpdateManyWithoutCollectionNestedInput = {
    create?: XOR<CollectionCollaboratorCreateWithoutCollectionInput, CollectionCollaboratorUncheckedCreateWithoutCollectionInput> | CollectionCollaboratorCreateWithoutCollectionInput[] | CollectionCollaboratorUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: CollectionCollaboratorCreateOrConnectWithoutCollectionInput | CollectionCollaboratorCreateOrConnectWithoutCollectionInput[]
    upsert?: CollectionCollaboratorUpsertWithWhereUniqueWithoutCollectionInput | CollectionCollaboratorUpsertWithWhereUniqueWithoutCollectionInput[]
    createMany?: CollectionCollaboratorCreateManyCollectionInputEnvelope
    set?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
    disconnect?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
    delete?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
    connect?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
    update?: CollectionCollaboratorUpdateWithWhereUniqueWithoutCollectionInput | CollectionCollaboratorUpdateWithWhereUniqueWithoutCollectionInput[]
    updateMany?: CollectionCollaboratorUpdateManyWithWhereWithoutCollectionInput | CollectionCollaboratorUpdateManyWithWhereWithoutCollectionInput[]
    deleteMany?: CollectionCollaboratorScalarWhereInput | CollectionCollaboratorScalarWhereInput[]
  }

  export type BookmarkCollectionUncheckedUpdateManyWithoutCollectionNestedInput = {
    create?: XOR<BookmarkCollectionCreateWithoutCollectionInput, BookmarkCollectionUncheckedCreateWithoutCollectionInput> | BookmarkCollectionCreateWithoutCollectionInput[] | BookmarkCollectionUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: BookmarkCollectionCreateOrConnectWithoutCollectionInput | BookmarkCollectionCreateOrConnectWithoutCollectionInput[]
    upsert?: BookmarkCollectionUpsertWithWhereUniqueWithoutCollectionInput | BookmarkCollectionUpsertWithWhereUniqueWithoutCollectionInput[]
    createMany?: BookmarkCollectionCreateManyCollectionInputEnvelope
    set?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
    disconnect?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
    delete?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
    connect?: BookmarkCollectionWhereUniqueInput | BookmarkCollectionWhereUniqueInput[]
    update?: BookmarkCollectionUpdateWithWhereUniqueWithoutCollectionInput | BookmarkCollectionUpdateWithWhereUniqueWithoutCollectionInput[]
    updateMany?: BookmarkCollectionUpdateManyWithWhereWithoutCollectionInput | BookmarkCollectionUpdateManyWithWhereWithoutCollectionInput[]
    deleteMany?: BookmarkCollectionScalarWhereInput | BookmarkCollectionScalarWhereInput[]
  }

  export type CollectionCollaboratorUncheckedUpdateManyWithoutCollectionNestedInput = {
    create?: XOR<CollectionCollaboratorCreateWithoutCollectionInput, CollectionCollaboratorUncheckedCreateWithoutCollectionInput> | CollectionCollaboratorCreateWithoutCollectionInput[] | CollectionCollaboratorUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: CollectionCollaboratorCreateOrConnectWithoutCollectionInput | CollectionCollaboratorCreateOrConnectWithoutCollectionInput[]
    upsert?: CollectionCollaboratorUpsertWithWhereUniqueWithoutCollectionInput | CollectionCollaboratorUpsertWithWhereUniqueWithoutCollectionInput[]
    createMany?: CollectionCollaboratorCreateManyCollectionInputEnvelope
    set?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
    disconnect?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
    delete?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
    connect?: CollectionCollaboratorWhereUniqueInput | CollectionCollaboratorWhereUniqueInput[]
    update?: CollectionCollaboratorUpdateWithWhereUniqueWithoutCollectionInput | CollectionCollaboratorUpdateWithWhereUniqueWithoutCollectionInput[]
    updateMany?: CollectionCollaboratorUpdateManyWithWhereWithoutCollectionInput | CollectionCollaboratorUpdateManyWithWhereWithoutCollectionInput[]
    deleteMany?: CollectionCollaboratorScalarWhereInput | CollectionCollaboratorScalarWhereInput[]
  }

  export type CollectionCreateNestedOneWithoutBookmarksInput = {
    create?: XOR<CollectionCreateWithoutBookmarksInput, CollectionUncheckedCreateWithoutBookmarksInput>
    connectOrCreate?: CollectionCreateOrConnectWithoutBookmarksInput
    connect?: CollectionWhereUniqueInput
  }

  export type BookmarkCreateNestedOneWithoutCollectionsInput = {
    create?: XOR<BookmarkCreateWithoutCollectionsInput, BookmarkUncheckedCreateWithoutCollectionsInput>
    connectOrCreate?: BookmarkCreateOrConnectWithoutCollectionsInput
    connect?: BookmarkWhereUniqueInput
  }

  export type CollectionUpdateOneRequiredWithoutBookmarksNestedInput = {
    create?: XOR<CollectionCreateWithoutBookmarksInput, CollectionUncheckedCreateWithoutBookmarksInput>
    connectOrCreate?: CollectionCreateOrConnectWithoutBookmarksInput
    upsert?: CollectionUpsertWithoutBookmarksInput
    connect?: CollectionWhereUniqueInput
    update?: XOR<XOR<CollectionUpdateToOneWithWhereWithoutBookmarksInput, CollectionUpdateWithoutBookmarksInput>, CollectionUncheckedUpdateWithoutBookmarksInput>
  }

  export type BookmarkUpdateOneRequiredWithoutCollectionsNestedInput = {
    create?: XOR<BookmarkCreateWithoutCollectionsInput, BookmarkUncheckedCreateWithoutCollectionsInput>
    connectOrCreate?: BookmarkCreateOrConnectWithoutCollectionsInput
    upsert?: BookmarkUpsertWithoutCollectionsInput
    connect?: BookmarkWhereUniqueInput
    update?: XOR<XOR<BookmarkUpdateToOneWithWhereWithoutCollectionsInput, BookmarkUpdateWithoutCollectionsInput>, BookmarkUncheckedUpdateWithoutCollectionsInput>
  }

  export type CollectionCreateNestedOneWithoutCollaboratorsInput = {
    create?: XOR<CollectionCreateWithoutCollaboratorsInput, CollectionUncheckedCreateWithoutCollaboratorsInput>
    connectOrCreate?: CollectionCreateOrConnectWithoutCollaboratorsInput
    connect?: CollectionWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCollabCollectionsInput = {
    create?: XOR<UserCreateWithoutCollabCollectionsInput, UserUncheckedCreateWithoutCollabCollectionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCollabCollectionsInput
    connect?: UserWhereUniqueInput
  }

  export type CollectionUpdateOneRequiredWithoutCollaboratorsNestedInput = {
    create?: XOR<CollectionCreateWithoutCollaboratorsInput, CollectionUncheckedCreateWithoutCollaboratorsInput>
    connectOrCreate?: CollectionCreateOrConnectWithoutCollaboratorsInput
    upsert?: CollectionUpsertWithoutCollaboratorsInput
    connect?: CollectionWhereUniqueInput
    update?: XOR<XOR<CollectionUpdateToOneWithWhereWithoutCollaboratorsInput, CollectionUpdateWithoutCollaboratorsInput>, CollectionUncheckedUpdateWithoutCollaboratorsInput>
  }

  export type UserUpdateOneRequiredWithoutCollabCollectionsNestedInput = {
    create?: XOR<UserCreateWithoutCollabCollectionsInput, UserUncheckedCreateWithoutCollabCollectionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCollabCollectionsInput
    upsert?: UserUpsertWithoutCollabCollectionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCollabCollectionsInput, UserUpdateWithoutCollabCollectionsInput>, UserUncheckedUpdateWithoutCollabCollectionsInput>
  }

  export type UserCreateNestedOneWithoutDevicesInput = {
    create?: XOR<UserCreateWithoutDevicesInput, UserUncheckedCreateWithoutDevicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutDevicesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutDevicesNestedInput = {
    create?: XOR<UserCreateWithoutDevicesInput, UserUncheckedCreateWithoutDevicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutDevicesInput
    upsert?: UserUpsertWithoutDevicesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDevicesInput, UserUpdateWithoutDevicesInput>, UserUncheckedUpdateWithoutDevicesInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type BookmarkCreateWithoutUserInput = {
    id?: string
    url: string
    title: string
    description?: string | null
    favicon?: string | null
    previewImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastVisited?: Date | string | null
    visitCount?: number
    notes?: string | null
    isDeleted?: boolean
    deletedAt?: Date | string | null
    folders?: FolderBookmarkCreateNestedManyWithoutBookmarkInput
    tags?: BookmarkTagCreateNestedManyWithoutBookmarkInput
    collections?: BookmarkCollectionCreateNestedManyWithoutBookmarkInput
  }

  export type BookmarkUncheckedCreateWithoutUserInput = {
    id?: string
    url: string
    title: string
    description?: string | null
    favicon?: string | null
    previewImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastVisited?: Date | string | null
    visitCount?: number
    notes?: string | null
    isDeleted?: boolean
    deletedAt?: Date | string | null
    folders?: FolderBookmarkUncheckedCreateNestedManyWithoutBookmarkInput
    tags?: BookmarkTagUncheckedCreateNestedManyWithoutBookmarkInput
    collections?: BookmarkCollectionUncheckedCreateNestedManyWithoutBookmarkInput
  }

  export type BookmarkCreateOrConnectWithoutUserInput = {
    where: BookmarkWhereUniqueInput
    create: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput>
  }

  export type BookmarkCreateManyUserInputEnvelope = {
    data: BookmarkCreateManyUserInput | BookmarkCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FolderCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    parent?: FolderCreateNestedOneWithoutChildrenInput
    children?: FolderCreateNestedManyWithoutParentInput
    bookmarks?: FolderBookmarkCreateNestedManyWithoutFolderInput
    collaborators?: FolderCollaboratorCreateNestedManyWithoutFolderInput
  }

  export type FolderUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    parentId?: string | null
    isDeleted?: boolean
    deletedAt?: Date | string | null
    children?: FolderUncheckedCreateNestedManyWithoutParentInput
    bookmarks?: FolderBookmarkUncheckedCreateNestedManyWithoutFolderInput
    collaborators?: FolderCollaboratorUncheckedCreateNestedManyWithoutFolderInput
  }

  export type FolderCreateOrConnectWithoutUserInput = {
    where: FolderWhereUniqueInput
    create: XOR<FolderCreateWithoutUserInput, FolderUncheckedCreateWithoutUserInput>
  }

  export type FolderCreateManyUserInputEnvelope = {
    data: FolderCreateManyUserInput | FolderCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TagCreateWithoutUserInput = {
    id?: string
    name: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    bookmarks?: BookmarkTagCreateNestedManyWithoutTagInput
  }

  export type TagUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    bookmarks?: BookmarkTagUncheckedCreateNestedManyWithoutTagInput
  }

  export type TagCreateOrConnectWithoutUserInput = {
    where: TagWhereUniqueInput
    create: XOR<TagCreateWithoutUserInput, TagUncheckedCreateWithoutUserInput>
  }

  export type TagCreateManyUserInputEnvelope = {
    data: TagCreateManyUserInput | TagCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CollectionCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    publicLink?: string | null
    thumbnail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    owner: UserCreateNestedOneWithoutOwnedCollectionsInput
    bookmarks?: BookmarkCollectionCreateNestedManyWithoutCollectionInput
    collaborators?: CollectionCollaboratorCreateNestedManyWithoutCollectionInput
  }

  export type CollectionUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    publicLink?: string | null
    thumbnail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ownerId: string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    bookmarks?: BookmarkCollectionUncheckedCreateNestedManyWithoutCollectionInput
    collaborators?: CollectionCollaboratorUncheckedCreateNestedManyWithoutCollectionInput
  }

  export type CollectionCreateOrConnectWithoutUserInput = {
    where: CollectionWhereUniqueInput
    create: XOR<CollectionCreateWithoutUserInput, CollectionUncheckedCreateWithoutUserInput>
  }

  export type CollectionCreateManyUserInputEnvelope = {
    data: CollectionCreateManyUserInput | CollectionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CollectionCreateWithoutOwnerInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    publicLink?: string | null
    thumbnail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutCollectionsInput
    bookmarks?: BookmarkCollectionCreateNestedManyWithoutCollectionInput
    collaborators?: CollectionCollaboratorCreateNestedManyWithoutCollectionInput
  }

  export type CollectionUncheckedCreateWithoutOwnerInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    publicLink?: string | null
    thumbnail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    bookmarks?: BookmarkCollectionUncheckedCreateNestedManyWithoutCollectionInput
    collaborators?: CollectionCollaboratorUncheckedCreateNestedManyWithoutCollectionInput
  }

  export type CollectionCreateOrConnectWithoutOwnerInput = {
    where: CollectionWhereUniqueInput
    create: XOR<CollectionCreateWithoutOwnerInput, CollectionUncheckedCreateWithoutOwnerInput>
  }

  export type CollectionCreateManyOwnerInputEnvelope = {
    data: CollectionCreateManyOwnerInput | CollectionCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type FolderCollaboratorCreateWithoutUserInput = {
    permission?: $Enums.Role
    addedAt?: Date | string
    folder: FolderCreateNestedOneWithoutCollaboratorsInput
  }

  export type FolderCollaboratorUncheckedCreateWithoutUserInput = {
    folderId: string
    permission?: $Enums.Role
    addedAt?: Date | string
  }

  export type FolderCollaboratorCreateOrConnectWithoutUserInput = {
    where: FolderCollaboratorWhereUniqueInput
    create: XOR<FolderCollaboratorCreateWithoutUserInput, FolderCollaboratorUncheckedCreateWithoutUserInput>
  }

  export type FolderCollaboratorCreateManyUserInputEnvelope = {
    data: FolderCollaboratorCreateManyUserInput | FolderCollaboratorCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CollectionCollaboratorCreateWithoutUserInput = {
    permission?: $Enums.Role
    addedAt?: Date | string
    collection: CollectionCreateNestedOneWithoutCollaboratorsInput
  }

  export type CollectionCollaboratorUncheckedCreateWithoutUserInput = {
    collectionId: string
    permission?: $Enums.Role
    addedAt?: Date | string
  }

  export type CollectionCollaboratorCreateOrConnectWithoutUserInput = {
    where: CollectionCollaboratorWhereUniqueInput
    create: XOR<CollectionCollaboratorCreateWithoutUserInput, CollectionCollaboratorUncheckedCreateWithoutUserInput>
  }

  export type CollectionCollaboratorCreateManyUserInputEnvelope = {
    data: CollectionCollaboratorCreateManyUserInput | CollectionCollaboratorCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type DeviceCreateWithoutUserInput = {
    id?: string
    deviceName: string
    deviceType: string
    lastSynced?: Date | string
    lastActive?: Date | string
  }

  export type DeviceUncheckedCreateWithoutUserInput = {
    id?: string
    deviceName: string
    deviceType: string
    lastSynced?: Date | string
    lastActive?: Date | string
  }

  export type DeviceCreateOrConnectWithoutUserInput = {
    where: DeviceWhereUniqueInput
    create: XOR<DeviceCreateWithoutUserInput, DeviceUncheckedCreateWithoutUserInput>
  }

  export type DeviceCreateManyUserInputEnvelope = {
    data: DeviceCreateManyUserInput | DeviceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type BookmarkUpsertWithWhereUniqueWithoutUserInput = {
    where: BookmarkWhereUniqueInput
    update: XOR<BookmarkUpdateWithoutUserInput, BookmarkUncheckedUpdateWithoutUserInput>
    create: XOR<BookmarkCreateWithoutUserInput, BookmarkUncheckedCreateWithoutUserInput>
  }

  export type BookmarkUpdateWithWhereUniqueWithoutUserInput = {
    where: BookmarkWhereUniqueInput
    data: XOR<BookmarkUpdateWithoutUserInput, BookmarkUncheckedUpdateWithoutUserInput>
  }

  export type BookmarkUpdateManyWithWhereWithoutUserInput = {
    where: BookmarkScalarWhereInput
    data: XOR<BookmarkUpdateManyMutationInput, BookmarkUncheckedUpdateManyWithoutUserInput>
  }

  export type BookmarkScalarWhereInput = {
    AND?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
    OR?: BookmarkScalarWhereInput[]
    NOT?: BookmarkScalarWhereInput | BookmarkScalarWhereInput[]
    id?: StringFilter<"Bookmark"> | string
    url?: StringFilter<"Bookmark"> | string
    title?: StringFilter<"Bookmark"> | string
    description?: StringNullableFilter<"Bookmark"> | string | null
    favicon?: StringNullableFilter<"Bookmark"> | string | null
    previewImage?: StringNullableFilter<"Bookmark"> | string | null
    createdAt?: DateTimeFilter<"Bookmark"> | Date | string
    updatedAt?: DateTimeFilter<"Bookmark"> | Date | string
    lastVisited?: DateTimeNullableFilter<"Bookmark"> | Date | string | null
    visitCount?: IntFilter<"Bookmark"> | number
    notes?: StringNullableFilter<"Bookmark"> | string | null
    userId?: StringFilter<"Bookmark"> | string
    isDeleted?: BoolFilter<"Bookmark"> | boolean
    deletedAt?: DateTimeNullableFilter<"Bookmark"> | Date | string | null
  }

  export type FolderUpsertWithWhereUniqueWithoutUserInput = {
    where: FolderWhereUniqueInput
    update: XOR<FolderUpdateWithoutUserInput, FolderUncheckedUpdateWithoutUserInput>
    create: XOR<FolderCreateWithoutUserInput, FolderUncheckedCreateWithoutUserInput>
  }

  export type FolderUpdateWithWhereUniqueWithoutUserInput = {
    where: FolderWhereUniqueInput
    data: XOR<FolderUpdateWithoutUserInput, FolderUncheckedUpdateWithoutUserInput>
  }

  export type FolderUpdateManyWithWhereWithoutUserInput = {
    where: FolderScalarWhereInput
    data: XOR<FolderUpdateManyMutationInput, FolderUncheckedUpdateManyWithoutUserInput>
  }

  export type FolderScalarWhereInput = {
    AND?: FolderScalarWhereInput | FolderScalarWhereInput[]
    OR?: FolderScalarWhereInput[]
    NOT?: FolderScalarWhereInput | FolderScalarWhereInput[]
    id?: StringFilter<"Folder"> | string
    name?: StringFilter<"Folder"> | string
    description?: StringNullableFilter<"Folder"> | string | null
    icon?: StringNullableFilter<"Folder"> | string | null
    color?: StringNullableFilter<"Folder"> | string | null
    createdAt?: DateTimeFilter<"Folder"> | Date | string
    updatedAt?: DateTimeFilter<"Folder"> | Date | string
    userId?: StringFilter<"Folder"> | string
    parentId?: StringNullableFilter<"Folder"> | string | null
    isDeleted?: BoolFilter<"Folder"> | boolean
    deletedAt?: DateTimeNullableFilter<"Folder"> | Date | string | null
  }

  export type TagUpsertWithWhereUniqueWithoutUserInput = {
    where: TagWhereUniqueInput
    update: XOR<TagUpdateWithoutUserInput, TagUncheckedUpdateWithoutUserInput>
    create: XOR<TagCreateWithoutUserInput, TagUncheckedCreateWithoutUserInput>
  }

  export type TagUpdateWithWhereUniqueWithoutUserInput = {
    where: TagWhereUniqueInput
    data: XOR<TagUpdateWithoutUserInput, TagUncheckedUpdateWithoutUserInput>
  }

  export type TagUpdateManyWithWhereWithoutUserInput = {
    where: TagScalarWhereInput
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyWithoutUserInput>
  }

  export type TagScalarWhereInput = {
    AND?: TagScalarWhereInput | TagScalarWhereInput[]
    OR?: TagScalarWhereInput[]
    NOT?: TagScalarWhereInput | TagScalarWhereInput[]
    id?: StringFilter<"Tag"> | string
    name?: StringFilter<"Tag"> | string
    color?: StringNullableFilter<"Tag"> | string | null
    createdAt?: DateTimeFilter<"Tag"> | Date | string
    updatedAt?: DateTimeFilter<"Tag"> | Date | string
    userId?: StringFilter<"Tag"> | string
    isDeleted?: BoolFilter<"Tag"> | boolean
    deletedAt?: DateTimeNullableFilter<"Tag"> | Date | string | null
  }

  export type CollectionUpsertWithWhereUniqueWithoutUserInput = {
    where: CollectionWhereUniqueInput
    update: XOR<CollectionUpdateWithoutUserInput, CollectionUncheckedUpdateWithoutUserInput>
    create: XOR<CollectionCreateWithoutUserInput, CollectionUncheckedCreateWithoutUserInput>
  }

  export type CollectionUpdateWithWhereUniqueWithoutUserInput = {
    where: CollectionWhereUniqueInput
    data: XOR<CollectionUpdateWithoutUserInput, CollectionUncheckedUpdateWithoutUserInput>
  }

  export type CollectionUpdateManyWithWhereWithoutUserInput = {
    where: CollectionScalarWhereInput
    data: XOR<CollectionUpdateManyMutationInput, CollectionUncheckedUpdateManyWithoutUserInput>
  }

  export type CollectionScalarWhereInput = {
    AND?: CollectionScalarWhereInput | CollectionScalarWhereInput[]
    OR?: CollectionScalarWhereInput[]
    NOT?: CollectionScalarWhereInput | CollectionScalarWhereInput[]
    id?: StringFilter<"Collection"> | string
    name?: StringFilter<"Collection"> | string
    description?: StringNullableFilter<"Collection"> | string | null
    isPublic?: BoolFilter<"Collection"> | boolean
    publicLink?: StringNullableFilter<"Collection"> | string | null
    thumbnail?: StringNullableFilter<"Collection"> | string | null
    createdAt?: DateTimeFilter<"Collection"> | Date | string
    updatedAt?: DateTimeFilter<"Collection"> | Date | string
    userId?: StringFilter<"Collection"> | string
    ownerId?: StringFilter<"Collection"> | string
    isDeleted?: BoolFilter<"Collection"> | boolean
    deletedAt?: DateTimeNullableFilter<"Collection"> | Date | string | null
  }

  export type CollectionUpsertWithWhereUniqueWithoutOwnerInput = {
    where: CollectionWhereUniqueInput
    update: XOR<CollectionUpdateWithoutOwnerInput, CollectionUncheckedUpdateWithoutOwnerInput>
    create: XOR<CollectionCreateWithoutOwnerInput, CollectionUncheckedCreateWithoutOwnerInput>
  }

  export type CollectionUpdateWithWhereUniqueWithoutOwnerInput = {
    where: CollectionWhereUniqueInput
    data: XOR<CollectionUpdateWithoutOwnerInput, CollectionUncheckedUpdateWithoutOwnerInput>
  }

  export type CollectionUpdateManyWithWhereWithoutOwnerInput = {
    where: CollectionScalarWhereInput
    data: XOR<CollectionUpdateManyMutationInput, CollectionUncheckedUpdateManyWithoutOwnerInput>
  }

  export type FolderCollaboratorUpsertWithWhereUniqueWithoutUserInput = {
    where: FolderCollaboratorWhereUniqueInput
    update: XOR<FolderCollaboratorUpdateWithoutUserInput, FolderCollaboratorUncheckedUpdateWithoutUserInput>
    create: XOR<FolderCollaboratorCreateWithoutUserInput, FolderCollaboratorUncheckedCreateWithoutUserInput>
  }

  export type FolderCollaboratorUpdateWithWhereUniqueWithoutUserInput = {
    where: FolderCollaboratorWhereUniqueInput
    data: XOR<FolderCollaboratorUpdateWithoutUserInput, FolderCollaboratorUncheckedUpdateWithoutUserInput>
  }

  export type FolderCollaboratorUpdateManyWithWhereWithoutUserInput = {
    where: FolderCollaboratorScalarWhereInput
    data: XOR<FolderCollaboratorUpdateManyMutationInput, FolderCollaboratorUncheckedUpdateManyWithoutUserInput>
  }

  export type FolderCollaboratorScalarWhereInput = {
    AND?: FolderCollaboratorScalarWhereInput | FolderCollaboratorScalarWhereInput[]
    OR?: FolderCollaboratorScalarWhereInput[]
    NOT?: FolderCollaboratorScalarWhereInput | FolderCollaboratorScalarWhereInput[]
    folderId?: StringFilter<"FolderCollaborator"> | string
    userId?: StringFilter<"FolderCollaborator"> | string
    permission?: EnumRoleFilter<"FolderCollaborator"> | $Enums.Role
    addedAt?: DateTimeFilter<"FolderCollaborator"> | Date | string
  }

  export type CollectionCollaboratorUpsertWithWhereUniqueWithoutUserInput = {
    where: CollectionCollaboratorWhereUniqueInput
    update: XOR<CollectionCollaboratorUpdateWithoutUserInput, CollectionCollaboratorUncheckedUpdateWithoutUserInput>
    create: XOR<CollectionCollaboratorCreateWithoutUserInput, CollectionCollaboratorUncheckedCreateWithoutUserInput>
  }

  export type CollectionCollaboratorUpdateWithWhereUniqueWithoutUserInput = {
    where: CollectionCollaboratorWhereUniqueInput
    data: XOR<CollectionCollaboratorUpdateWithoutUserInput, CollectionCollaboratorUncheckedUpdateWithoutUserInput>
  }

  export type CollectionCollaboratorUpdateManyWithWhereWithoutUserInput = {
    where: CollectionCollaboratorScalarWhereInput
    data: XOR<CollectionCollaboratorUpdateManyMutationInput, CollectionCollaboratorUncheckedUpdateManyWithoutUserInput>
  }

  export type CollectionCollaboratorScalarWhereInput = {
    AND?: CollectionCollaboratorScalarWhereInput | CollectionCollaboratorScalarWhereInput[]
    OR?: CollectionCollaboratorScalarWhereInput[]
    NOT?: CollectionCollaboratorScalarWhereInput | CollectionCollaboratorScalarWhereInput[]
    collectionId?: StringFilter<"CollectionCollaborator"> | string
    userId?: StringFilter<"CollectionCollaborator"> | string
    permission?: EnumRoleFilter<"CollectionCollaborator"> | $Enums.Role
    addedAt?: DateTimeFilter<"CollectionCollaborator"> | Date | string
  }

  export type DeviceUpsertWithWhereUniqueWithoutUserInput = {
    where: DeviceWhereUniqueInput
    update: XOR<DeviceUpdateWithoutUserInput, DeviceUncheckedUpdateWithoutUserInput>
    create: XOR<DeviceCreateWithoutUserInput, DeviceUncheckedCreateWithoutUserInput>
  }

  export type DeviceUpdateWithWhereUniqueWithoutUserInput = {
    where: DeviceWhereUniqueInput
    data: XOR<DeviceUpdateWithoutUserInput, DeviceUncheckedUpdateWithoutUserInput>
  }

  export type DeviceUpdateManyWithWhereWithoutUserInput = {
    where: DeviceScalarWhereInput
    data: XOR<DeviceUpdateManyMutationInput, DeviceUncheckedUpdateManyWithoutUserInput>
  }

  export type DeviceScalarWhereInput = {
    AND?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
    OR?: DeviceScalarWhereInput[]
    NOT?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
    id?: StringFilter<"Device"> | string
    userId?: StringFilter<"Device"> | string
    deviceName?: StringFilter<"Device"> | string
    deviceType?: StringFilter<"Device"> | string
    lastSynced?: DateTimeFilter<"Device"> | Date | string
    lastActive?: DateTimeFilter<"Device"> | Date | string
  }

  export type UserCreateWithoutBookmarksInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
    folders?: FolderCreateNestedManyWithoutUserInput
    tags?: TagCreateNestedManyWithoutUserInput
    collections?: CollectionCreateNestedManyWithoutUserInput
    ownedCollections?: CollectionCreateNestedManyWithoutOwnerInput
    collabFolders?: FolderCollaboratorCreateNestedManyWithoutUserInput
    collabCollections?: CollectionCollaboratorCreateNestedManyWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBookmarksInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
    folders?: FolderUncheckedCreateNestedManyWithoutUserInput
    tags?: TagUncheckedCreateNestedManyWithoutUserInput
    collections?: CollectionUncheckedCreateNestedManyWithoutUserInput
    ownedCollections?: CollectionUncheckedCreateNestedManyWithoutOwnerInput
    collabFolders?: FolderCollaboratorUncheckedCreateNestedManyWithoutUserInput
    collabCollections?: CollectionCollaboratorUncheckedCreateNestedManyWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBookmarksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBookmarksInput, UserUncheckedCreateWithoutBookmarksInput>
  }

  export type FolderBookmarkCreateWithoutBookmarkInput = {
    addedAt?: Date | string
    folder: FolderCreateNestedOneWithoutBookmarksInput
  }

  export type FolderBookmarkUncheckedCreateWithoutBookmarkInput = {
    folderId: string
    addedAt?: Date | string
  }

  export type FolderBookmarkCreateOrConnectWithoutBookmarkInput = {
    where: FolderBookmarkWhereUniqueInput
    create: XOR<FolderBookmarkCreateWithoutBookmarkInput, FolderBookmarkUncheckedCreateWithoutBookmarkInput>
  }

  export type FolderBookmarkCreateManyBookmarkInputEnvelope = {
    data: FolderBookmarkCreateManyBookmarkInput | FolderBookmarkCreateManyBookmarkInput[]
    skipDuplicates?: boolean
  }

  export type BookmarkTagCreateWithoutBookmarkInput = {
    addedAt?: Date | string
    tag: TagCreateNestedOneWithoutBookmarksInput
  }

  export type BookmarkTagUncheckedCreateWithoutBookmarkInput = {
    tagId: string
    addedAt?: Date | string
  }

  export type BookmarkTagCreateOrConnectWithoutBookmarkInput = {
    where: BookmarkTagWhereUniqueInput
    create: XOR<BookmarkTagCreateWithoutBookmarkInput, BookmarkTagUncheckedCreateWithoutBookmarkInput>
  }

  export type BookmarkTagCreateManyBookmarkInputEnvelope = {
    data: BookmarkTagCreateManyBookmarkInput | BookmarkTagCreateManyBookmarkInput[]
    skipDuplicates?: boolean
  }

  export type BookmarkCollectionCreateWithoutBookmarkInput = {
    addedAt?: Date | string
    order?: number
    collection: CollectionCreateNestedOneWithoutBookmarksInput
  }

  export type BookmarkCollectionUncheckedCreateWithoutBookmarkInput = {
    collectionId: string
    addedAt?: Date | string
    order?: number
  }

  export type BookmarkCollectionCreateOrConnectWithoutBookmarkInput = {
    where: BookmarkCollectionWhereUniqueInput
    create: XOR<BookmarkCollectionCreateWithoutBookmarkInput, BookmarkCollectionUncheckedCreateWithoutBookmarkInput>
  }

  export type BookmarkCollectionCreateManyBookmarkInputEnvelope = {
    data: BookmarkCollectionCreateManyBookmarkInput | BookmarkCollectionCreateManyBookmarkInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutBookmarksInput = {
    update: XOR<UserUpdateWithoutBookmarksInput, UserUncheckedUpdateWithoutBookmarksInput>
    create: XOR<UserCreateWithoutBookmarksInput, UserUncheckedCreateWithoutBookmarksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBookmarksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBookmarksInput, UserUncheckedUpdateWithoutBookmarksInput>
  }

  export type UserUpdateWithoutBookmarksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    folders?: FolderUpdateManyWithoutUserNestedInput
    tags?: TagUpdateManyWithoutUserNestedInput
    collections?: CollectionUpdateManyWithoutUserNestedInput
    ownedCollections?: CollectionUpdateManyWithoutOwnerNestedInput
    collabFolders?: FolderCollaboratorUpdateManyWithoutUserNestedInput
    collabCollections?: CollectionCollaboratorUpdateManyWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBookmarksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    folders?: FolderUncheckedUpdateManyWithoutUserNestedInput
    tags?: TagUncheckedUpdateManyWithoutUserNestedInput
    collections?: CollectionUncheckedUpdateManyWithoutUserNestedInput
    ownedCollections?: CollectionUncheckedUpdateManyWithoutOwnerNestedInput
    collabFolders?: FolderCollaboratorUncheckedUpdateManyWithoutUserNestedInput
    collabCollections?: CollectionCollaboratorUncheckedUpdateManyWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type FolderBookmarkUpsertWithWhereUniqueWithoutBookmarkInput = {
    where: FolderBookmarkWhereUniqueInput
    update: XOR<FolderBookmarkUpdateWithoutBookmarkInput, FolderBookmarkUncheckedUpdateWithoutBookmarkInput>
    create: XOR<FolderBookmarkCreateWithoutBookmarkInput, FolderBookmarkUncheckedCreateWithoutBookmarkInput>
  }

  export type FolderBookmarkUpdateWithWhereUniqueWithoutBookmarkInput = {
    where: FolderBookmarkWhereUniqueInput
    data: XOR<FolderBookmarkUpdateWithoutBookmarkInput, FolderBookmarkUncheckedUpdateWithoutBookmarkInput>
  }

  export type FolderBookmarkUpdateManyWithWhereWithoutBookmarkInput = {
    where: FolderBookmarkScalarWhereInput
    data: XOR<FolderBookmarkUpdateManyMutationInput, FolderBookmarkUncheckedUpdateManyWithoutBookmarkInput>
  }

  export type FolderBookmarkScalarWhereInput = {
    AND?: FolderBookmarkScalarWhereInput | FolderBookmarkScalarWhereInput[]
    OR?: FolderBookmarkScalarWhereInput[]
    NOT?: FolderBookmarkScalarWhereInput | FolderBookmarkScalarWhereInput[]
    folderId?: StringFilter<"FolderBookmark"> | string
    bookmarkId?: StringFilter<"FolderBookmark"> | string
    addedAt?: DateTimeFilter<"FolderBookmark"> | Date | string
  }

  export type BookmarkTagUpsertWithWhereUniqueWithoutBookmarkInput = {
    where: BookmarkTagWhereUniqueInput
    update: XOR<BookmarkTagUpdateWithoutBookmarkInput, BookmarkTagUncheckedUpdateWithoutBookmarkInput>
    create: XOR<BookmarkTagCreateWithoutBookmarkInput, BookmarkTagUncheckedCreateWithoutBookmarkInput>
  }

  export type BookmarkTagUpdateWithWhereUniqueWithoutBookmarkInput = {
    where: BookmarkTagWhereUniqueInput
    data: XOR<BookmarkTagUpdateWithoutBookmarkInput, BookmarkTagUncheckedUpdateWithoutBookmarkInput>
  }

  export type BookmarkTagUpdateManyWithWhereWithoutBookmarkInput = {
    where: BookmarkTagScalarWhereInput
    data: XOR<BookmarkTagUpdateManyMutationInput, BookmarkTagUncheckedUpdateManyWithoutBookmarkInput>
  }

  export type BookmarkTagScalarWhereInput = {
    AND?: BookmarkTagScalarWhereInput | BookmarkTagScalarWhereInput[]
    OR?: BookmarkTagScalarWhereInput[]
    NOT?: BookmarkTagScalarWhereInput | BookmarkTagScalarWhereInput[]
    tagId?: StringFilter<"BookmarkTag"> | string
    bookmarkId?: StringFilter<"BookmarkTag"> | string
    addedAt?: DateTimeFilter<"BookmarkTag"> | Date | string
  }

  export type BookmarkCollectionUpsertWithWhereUniqueWithoutBookmarkInput = {
    where: BookmarkCollectionWhereUniqueInput
    update: XOR<BookmarkCollectionUpdateWithoutBookmarkInput, BookmarkCollectionUncheckedUpdateWithoutBookmarkInput>
    create: XOR<BookmarkCollectionCreateWithoutBookmarkInput, BookmarkCollectionUncheckedCreateWithoutBookmarkInput>
  }

  export type BookmarkCollectionUpdateWithWhereUniqueWithoutBookmarkInput = {
    where: BookmarkCollectionWhereUniqueInput
    data: XOR<BookmarkCollectionUpdateWithoutBookmarkInput, BookmarkCollectionUncheckedUpdateWithoutBookmarkInput>
  }

  export type BookmarkCollectionUpdateManyWithWhereWithoutBookmarkInput = {
    where: BookmarkCollectionScalarWhereInput
    data: XOR<BookmarkCollectionUpdateManyMutationInput, BookmarkCollectionUncheckedUpdateManyWithoutBookmarkInput>
  }

  export type BookmarkCollectionScalarWhereInput = {
    AND?: BookmarkCollectionScalarWhereInput | BookmarkCollectionScalarWhereInput[]
    OR?: BookmarkCollectionScalarWhereInput[]
    NOT?: BookmarkCollectionScalarWhereInput | BookmarkCollectionScalarWhereInput[]
    collectionId?: StringFilter<"BookmarkCollection"> | string
    bookmarkId?: StringFilter<"BookmarkCollection"> | string
    addedAt?: DateTimeFilter<"BookmarkCollection"> | Date | string
    order?: IntFilter<"BookmarkCollection"> | number
  }

  export type UserCreateWithoutFoldersInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
    bookmarks?: BookmarkCreateNestedManyWithoutUserInput
    tags?: TagCreateNestedManyWithoutUserInput
    collections?: CollectionCreateNestedManyWithoutUserInput
    ownedCollections?: CollectionCreateNestedManyWithoutOwnerInput
    collabFolders?: FolderCollaboratorCreateNestedManyWithoutUserInput
    collabCollections?: CollectionCollaboratorCreateNestedManyWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFoldersInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    tags?: TagUncheckedCreateNestedManyWithoutUserInput
    collections?: CollectionUncheckedCreateNestedManyWithoutUserInput
    ownedCollections?: CollectionUncheckedCreateNestedManyWithoutOwnerInput
    collabFolders?: FolderCollaboratorUncheckedCreateNestedManyWithoutUserInput
    collabCollections?: CollectionCollaboratorUncheckedCreateNestedManyWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFoldersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFoldersInput, UserUncheckedCreateWithoutFoldersInput>
  }

  export type FolderCreateWithoutChildrenInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutFoldersInput
    parent?: FolderCreateNestedOneWithoutChildrenInput
    bookmarks?: FolderBookmarkCreateNestedManyWithoutFolderInput
    collaborators?: FolderCollaboratorCreateNestedManyWithoutFolderInput
  }

  export type FolderUncheckedCreateWithoutChildrenInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    parentId?: string | null
    isDeleted?: boolean
    deletedAt?: Date | string | null
    bookmarks?: FolderBookmarkUncheckedCreateNestedManyWithoutFolderInput
    collaborators?: FolderCollaboratorUncheckedCreateNestedManyWithoutFolderInput
  }

  export type FolderCreateOrConnectWithoutChildrenInput = {
    where: FolderWhereUniqueInput
    create: XOR<FolderCreateWithoutChildrenInput, FolderUncheckedCreateWithoutChildrenInput>
  }

  export type FolderCreateWithoutParentInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutFoldersInput
    children?: FolderCreateNestedManyWithoutParentInput
    bookmarks?: FolderBookmarkCreateNestedManyWithoutFolderInput
    collaborators?: FolderCollaboratorCreateNestedManyWithoutFolderInput
  }

  export type FolderUncheckedCreateWithoutParentInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    children?: FolderUncheckedCreateNestedManyWithoutParentInput
    bookmarks?: FolderBookmarkUncheckedCreateNestedManyWithoutFolderInput
    collaborators?: FolderCollaboratorUncheckedCreateNestedManyWithoutFolderInput
  }

  export type FolderCreateOrConnectWithoutParentInput = {
    where: FolderWhereUniqueInput
    create: XOR<FolderCreateWithoutParentInput, FolderUncheckedCreateWithoutParentInput>
  }

  export type FolderCreateManyParentInputEnvelope = {
    data: FolderCreateManyParentInput | FolderCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type FolderBookmarkCreateWithoutFolderInput = {
    addedAt?: Date | string
    bookmark: BookmarkCreateNestedOneWithoutFoldersInput
  }

  export type FolderBookmarkUncheckedCreateWithoutFolderInput = {
    bookmarkId: string
    addedAt?: Date | string
  }

  export type FolderBookmarkCreateOrConnectWithoutFolderInput = {
    where: FolderBookmarkWhereUniqueInput
    create: XOR<FolderBookmarkCreateWithoutFolderInput, FolderBookmarkUncheckedCreateWithoutFolderInput>
  }

  export type FolderBookmarkCreateManyFolderInputEnvelope = {
    data: FolderBookmarkCreateManyFolderInput | FolderBookmarkCreateManyFolderInput[]
    skipDuplicates?: boolean
  }

  export type FolderCollaboratorCreateWithoutFolderInput = {
    permission?: $Enums.Role
    addedAt?: Date | string
    user: UserCreateNestedOneWithoutCollabFoldersInput
  }

  export type FolderCollaboratorUncheckedCreateWithoutFolderInput = {
    userId: string
    permission?: $Enums.Role
    addedAt?: Date | string
  }

  export type FolderCollaboratorCreateOrConnectWithoutFolderInput = {
    where: FolderCollaboratorWhereUniqueInput
    create: XOR<FolderCollaboratorCreateWithoutFolderInput, FolderCollaboratorUncheckedCreateWithoutFolderInput>
  }

  export type FolderCollaboratorCreateManyFolderInputEnvelope = {
    data: FolderCollaboratorCreateManyFolderInput | FolderCollaboratorCreateManyFolderInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutFoldersInput = {
    update: XOR<UserUpdateWithoutFoldersInput, UserUncheckedUpdateWithoutFoldersInput>
    create: XOR<UserCreateWithoutFoldersInput, UserUncheckedCreateWithoutFoldersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFoldersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFoldersInput, UserUncheckedUpdateWithoutFoldersInput>
  }

  export type UserUpdateWithoutFoldersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarks?: BookmarkUpdateManyWithoutUserNestedInput
    tags?: TagUpdateManyWithoutUserNestedInput
    collections?: CollectionUpdateManyWithoutUserNestedInput
    ownedCollections?: CollectionUpdateManyWithoutOwnerNestedInput
    collabFolders?: FolderCollaboratorUpdateManyWithoutUserNestedInput
    collabCollections?: CollectionCollaboratorUpdateManyWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFoldersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarks?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    tags?: TagUncheckedUpdateManyWithoutUserNestedInput
    collections?: CollectionUncheckedUpdateManyWithoutUserNestedInput
    ownedCollections?: CollectionUncheckedUpdateManyWithoutOwnerNestedInput
    collabFolders?: FolderCollaboratorUncheckedUpdateManyWithoutUserNestedInput
    collabCollections?: CollectionCollaboratorUncheckedUpdateManyWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type FolderUpsertWithoutChildrenInput = {
    update: XOR<FolderUpdateWithoutChildrenInput, FolderUncheckedUpdateWithoutChildrenInput>
    create: XOR<FolderCreateWithoutChildrenInput, FolderUncheckedCreateWithoutChildrenInput>
    where?: FolderWhereInput
  }

  export type FolderUpdateToOneWithWhereWithoutChildrenInput = {
    where?: FolderWhereInput
    data: XOR<FolderUpdateWithoutChildrenInput, FolderUncheckedUpdateWithoutChildrenInput>
  }

  export type FolderUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutFoldersNestedInput
    parent?: FolderUpdateOneWithoutChildrenNestedInput
    bookmarks?: FolderBookmarkUpdateManyWithoutFolderNestedInput
    collaborators?: FolderCollaboratorUpdateManyWithoutFolderNestedInput
  }

  export type FolderUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bookmarks?: FolderBookmarkUncheckedUpdateManyWithoutFolderNestedInput
    collaborators?: FolderCollaboratorUncheckedUpdateManyWithoutFolderNestedInput
  }

  export type FolderUpsertWithWhereUniqueWithoutParentInput = {
    where: FolderWhereUniqueInput
    update: XOR<FolderUpdateWithoutParentInput, FolderUncheckedUpdateWithoutParentInput>
    create: XOR<FolderCreateWithoutParentInput, FolderUncheckedCreateWithoutParentInput>
  }

  export type FolderUpdateWithWhereUniqueWithoutParentInput = {
    where: FolderWhereUniqueInput
    data: XOR<FolderUpdateWithoutParentInput, FolderUncheckedUpdateWithoutParentInput>
  }

  export type FolderUpdateManyWithWhereWithoutParentInput = {
    where: FolderScalarWhereInput
    data: XOR<FolderUpdateManyMutationInput, FolderUncheckedUpdateManyWithoutParentInput>
  }

  export type FolderBookmarkUpsertWithWhereUniqueWithoutFolderInput = {
    where: FolderBookmarkWhereUniqueInput
    update: XOR<FolderBookmarkUpdateWithoutFolderInput, FolderBookmarkUncheckedUpdateWithoutFolderInput>
    create: XOR<FolderBookmarkCreateWithoutFolderInput, FolderBookmarkUncheckedCreateWithoutFolderInput>
  }

  export type FolderBookmarkUpdateWithWhereUniqueWithoutFolderInput = {
    where: FolderBookmarkWhereUniqueInput
    data: XOR<FolderBookmarkUpdateWithoutFolderInput, FolderBookmarkUncheckedUpdateWithoutFolderInput>
  }

  export type FolderBookmarkUpdateManyWithWhereWithoutFolderInput = {
    where: FolderBookmarkScalarWhereInput
    data: XOR<FolderBookmarkUpdateManyMutationInput, FolderBookmarkUncheckedUpdateManyWithoutFolderInput>
  }

  export type FolderCollaboratorUpsertWithWhereUniqueWithoutFolderInput = {
    where: FolderCollaboratorWhereUniqueInput
    update: XOR<FolderCollaboratorUpdateWithoutFolderInput, FolderCollaboratorUncheckedUpdateWithoutFolderInput>
    create: XOR<FolderCollaboratorCreateWithoutFolderInput, FolderCollaboratorUncheckedCreateWithoutFolderInput>
  }

  export type FolderCollaboratorUpdateWithWhereUniqueWithoutFolderInput = {
    where: FolderCollaboratorWhereUniqueInput
    data: XOR<FolderCollaboratorUpdateWithoutFolderInput, FolderCollaboratorUncheckedUpdateWithoutFolderInput>
  }

  export type FolderCollaboratorUpdateManyWithWhereWithoutFolderInput = {
    where: FolderCollaboratorScalarWhereInput
    data: XOR<FolderCollaboratorUpdateManyMutationInput, FolderCollaboratorUncheckedUpdateManyWithoutFolderInput>
  }

  export type FolderCreateWithoutBookmarksInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutFoldersInput
    parent?: FolderCreateNestedOneWithoutChildrenInput
    children?: FolderCreateNestedManyWithoutParentInput
    collaborators?: FolderCollaboratorCreateNestedManyWithoutFolderInput
  }

  export type FolderUncheckedCreateWithoutBookmarksInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    parentId?: string | null
    isDeleted?: boolean
    deletedAt?: Date | string | null
    children?: FolderUncheckedCreateNestedManyWithoutParentInput
    collaborators?: FolderCollaboratorUncheckedCreateNestedManyWithoutFolderInput
  }

  export type FolderCreateOrConnectWithoutBookmarksInput = {
    where: FolderWhereUniqueInput
    create: XOR<FolderCreateWithoutBookmarksInput, FolderUncheckedCreateWithoutBookmarksInput>
  }

  export type BookmarkCreateWithoutFoldersInput = {
    id?: string
    url: string
    title: string
    description?: string | null
    favicon?: string | null
    previewImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastVisited?: Date | string | null
    visitCount?: number
    notes?: string | null
    isDeleted?: boolean
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutBookmarksInput
    tags?: BookmarkTagCreateNestedManyWithoutBookmarkInput
    collections?: BookmarkCollectionCreateNestedManyWithoutBookmarkInput
  }

  export type BookmarkUncheckedCreateWithoutFoldersInput = {
    id?: string
    url: string
    title: string
    description?: string | null
    favicon?: string | null
    previewImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastVisited?: Date | string | null
    visitCount?: number
    notes?: string | null
    userId: string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    tags?: BookmarkTagUncheckedCreateNestedManyWithoutBookmarkInput
    collections?: BookmarkCollectionUncheckedCreateNestedManyWithoutBookmarkInput
  }

  export type BookmarkCreateOrConnectWithoutFoldersInput = {
    where: BookmarkWhereUniqueInput
    create: XOR<BookmarkCreateWithoutFoldersInput, BookmarkUncheckedCreateWithoutFoldersInput>
  }

  export type FolderUpsertWithoutBookmarksInput = {
    update: XOR<FolderUpdateWithoutBookmarksInput, FolderUncheckedUpdateWithoutBookmarksInput>
    create: XOR<FolderCreateWithoutBookmarksInput, FolderUncheckedCreateWithoutBookmarksInput>
    where?: FolderWhereInput
  }

  export type FolderUpdateToOneWithWhereWithoutBookmarksInput = {
    where?: FolderWhereInput
    data: XOR<FolderUpdateWithoutBookmarksInput, FolderUncheckedUpdateWithoutBookmarksInput>
  }

  export type FolderUpdateWithoutBookmarksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutFoldersNestedInput
    parent?: FolderUpdateOneWithoutChildrenNestedInput
    children?: FolderUpdateManyWithoutParentNestedInput
    collaborators?: FolderCollaboratorUpdateManyWithoutFolderNestedInput
  }

  export type FolderUncheckedUpdateWithoutBookmarksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    children?: FolderUncheckedUpdateManyWithoutParentNestedInput
    collaborators?: FolderCollaboratorUncheckedUpdateManyWithoutFolderNestedInput
  }

  export type BookmarkUpsertWithoutFoldersInput = {
    update: XOR<BookmarkUpdateWithoutFoldersInput, BookmarkUncheckedUpdateWithoutFoldersInput>
    create: XOR<BookmarkCreateWithoutFoldersInput, BookmarkUncheckedCreateWithoutFoldersInput>
    where?: BookmarkWhereInput
  }

  export type BookmarkUpdateToOneWithWhereWithoutFoldersInput = {
    where?: BookmarkWhereInput
    data: XOR<BookmarkUpdateWithoutFoldersInput, BookmarkUncheckedUpdateWithoutFoldersInput>
  }

  export type BookmarkUpdateWithoutFoldersInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    favicon?: NullableStringFieldUpdateOperationsInput | string | null
    previewImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisited?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutBookmarksNestedInput
    tags?: BookmarkTagUpdateManyWithoutBookmarkNestedInput
    collections?: BookmarkCollectionUpdateManyWithoutBookmarkNestedInput
  }

  export type BookmarkUncheckedUpdateWithoutFoldersInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    favicon?: NullableStringFieldUpdateOperationsInput | string | null
    previewImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisited?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tags?: BookmarkTagUncheckedUpdateManyWithoutBookmarkNestedInput
    collections?: BookmarkCollectionUncheckedUpdateManyWithoutBookmarkNestedInput
  }

  export type FolderCreateWithoutCollaboratorsInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutFoldersInput
    parent?: FolderCreateNestedOneWithoutChildrenInput
    children?: FolderCreateNestedManyWithoutParentInput
    bookmarks?: FolderBookmarkCreateNestedManyWithoutFolderInput
  }

  export type FolderUncheckedCreateWithoutCollaboratorsInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    parentId?: string | null
    isDeleted?: boolean
    deletedAt?: Date | string | null
    children?: FolderUncheckedCreateNestedManyWithoutParentInput
    bookmarks?: FolderBookmarkUncheckedCreateNestedManyWithoutFolderInput
  }

  export type FolderCreateOrConnectWithoutCollaboratorsInput = {
    where: FolderWhereUniqueInput
    create: XOR<FolderCreateWithoutCollaboratorsInput, FolderUncheckedCreateWithoutCollaboratorsInput>
  }

  export type UserCreateWithoutCollabFoldersInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
    bookmarks?: BookmarkCreateNestedManyWithoutUserInput
    folders?: FolderCreateNestedManyWithoutUserInput
    tags?: TagCreateNestedManyWithoutUserInput
    collections?: CollectionCreateNestedManyWithoutUserInput
    ownedCollections?: CollectionCreateNestedManyWithoutOwnerInput
    collabCollections?: CollectionCollaboratorCreateNestedManyWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCollabFoldersInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    folders?: FolderUncheckedCreateNestedManyWithoutUserInput
    tags?: TagUncheckedCreateNestedManyWithoutUserInput
    collections?: CollectionUncheckedCreateNestedManyWithoutUserInput
    ownedCollections?: CollectionUncheckedCreateNestedManyWithoutOwnerInput
    collabCollections?: CollectionCollaboratorUncheckedCreateNestedManyWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCollabFoldersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCollabFoldersInput, UserUncheckedCreateWithoutCollabFoldersInput>
  }

  export type FolderUpsertWithoutCollaboratorsInput = {
    update: XOR<FolderUpdateWithoutCollaboratorsInput, FolderUncheckedUpdateWithoutCollaboratorsInput>
    create: XOR<FolderCreateWithoutCollaboratorsInput, FolderUncheckedCreateWithoutCollaboratorsInput>
    where?: FolderWhereInput
  }

  export type FolderUpdateToOneWithWhereWithoutCollaboratorsInput = {
    where?: FolderWhereInput
    data: XOR<FolderUpdateWithoutCollaboratorsInput, FolderUncheckedUpdateWithoutCollaboratorsInput>
  }

  export type FolderUpdateWithoutCollaboratorsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutFoldersNestedInput
    parent?: FolderUpdateOneWithoutChildrenNestedInput
    children?: FolderUpdateManyWithoutParentNestedInput
    bookmarks?: FolderBookmarkUpdateManyWithoutFolderNestedInput
  }

  export type FolderUncheckedUpdateWithoutCollaboratorsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    children?: FolderUncheckedUpdateManyWithoutParentNestedInput
    bookmarks?: FolderBookmarkUncheckedUpdateManyWithoutFolderNestedInput
  }

  export type UserUpsertWithoutCollabFoldersInput = {
    update: XOR<UserUpdateWithoutCollabFoldersInput, UserUncheckedUpdateWithoutCollabFoldersInput>
    create: XOR<UserCreateWithoutCollabFoldersInput, UserUncheckedCreateWithoutCollabFoldersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCollabFoldersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCollabFoldersInput, UserUncheckedUpdateWithoutCollabFoldersInput>
  }

  export type UserUpdateWithoutCollabFoldersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarks?: BookmarkUpdateManyWithoutUserNestedInput
    folders?: FolderUpdateManyWithoutUserNestedInput
    tags?: TagUpdateManyWithoutUserNestedInput
    collections?: CollectionUpdateManyWithoutUserNestedInput
    ownedCollections?: CollectionUpdateManyWithoutOwnerNestedInput
    collabCollections?: CollectionCollaboratorUpdateManyWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCollabFoldersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarks?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    folders?: FolderUncheckedUpdateManyWithoutUserNestedInput
    tags?: TagUncheckedUpdateManyWithoutUserNestedInput
    collections?: CollectionUncheckedUpdateManyWithoutUserNestedInput
    ownedCollections?: CollectionUncheckedUpdateManyWithoutOwnerNestedInput
    collabCollections?: CollectionCollaboratorUncheckedUpdateManyWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutTagsInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
    bookmarks?: BookmarkCreateNestedManyWithoutUserInput
    folders?: FolderCreateNestedManyWithoutUserInput
    collections?: CollectionCreateNestedManyWithoutUserInput
    ownedCollections?: CollectionCreateNestedManyWithoutOwnerInput
    collabFolders?: FolderCollaboratorCreateNestedManyWithoutUserInput
    collabCollections?: CollectionCollaboratorCreateNestedManyWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTagsInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    folders?: FolderUncheckedCreateNestedManyWithoutUserInput
    collections?: CollectionUncheckedCreateNestedManyWithoutUserInput
    ownedCollections?: CollectionUncheckedCreateNestedManyWithoutOwnerInput
    collabFolders?: FolderCollaboratorUncheckedCreateNestedManyWithoutUserInput
    collabCollections?: CollectionCollaboratorUncheckedCreateNestedManyWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTagsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTagsInput, UserUncheckedCreateWithoutTagsInput>
  }

  export type BookmarkTagCreateWithoutTagInput = {
    addedAt?: Date | string
    bookmark: BookmarkCreateNestedOneWithoutTagsInput
  }

  export type BookmarkTagUncheckedCreateWithoutTagInput = {
    bookmarkId: string
    addedAt?: Date | string
  }

  export type BookmarkTagCreateOrConnectWithoutTagInput = {
    where: BookmarkTagWhereUniqueInput
    create: XOR<BookmarkTagCreateWithoutTagInput, BookmarkTagUncheckedCreateWithoutTagInput>
  }

  export type BookmarkTagCreateManyTagInputEnvelope = {
    data: BookmarkTagCreateManyTagInput | BookmarkTagCreateManyTagInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutTagsInput = {
    update: XOR<UserUpdateWithoutTagsInput, UserUncheckedUpdateWithoutTagsInput>
    create: XOR<UserCreateWithoutTagsInput, UserUncheckedCreateWithoutTagsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTagsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTagsInput, UserUncheckedUpdateWithoutTagsInput>
  }

  export type UserUpdateWithoutTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarks?: BookmarkUpdateManyWithoutUserNestedInput
    folders?: FolderUpdateManyWithoutUserNestedInput
    collections?: CollectionUpdateManyWithoutUserNestedInput
    ownedCollections?: CollectionUpdateManyWithoutOwnerNestedInput
    collabFolders?: FolderCollaboratorUpdateManyWithoutUserNestedInput
    collabCollections?: CollectionCollaboratorUpdateManyWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarks?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    folders?: FolderUncheckedUpdateManyWithoutUserNestedInput
    collections?: CollectionUncheckedUpdateManyWithoutUserNestedInput
    ownedCollections?: CollectionUncheckedUpdateManyWithoutOwnerNestedInput
    collabFolders?: FolderCollaboratorUncheckedUpdateManyWithoutUserNestedInput
    collabCollections?: CollectionCollaboratorUncheckedUpdateManyWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type BookmarkTagUpsertWithWhereUniqueWithoutTagInput = {
    where: BookmarkTagWhereUniqueInput
    update: XOR<BookmarkTagUpdateWithoutTagInput, BookmarkTagUncheckedUpdateWithoutTagInput>
    create: XOR<BookmarkTagCreateWithoutTagInput, BookmarkTagUncheckedCreateWithoutTagInput>
  }

  export type BookmarkTagUpdateWithWhereUniqueWithoutTagInput = {
    where: BookmarkTagWhereUniqueInput
    data: XOR<BookmarkTagUpdateWithoutTagInput, BookmarkTagUncheckedUpdateWithoutTagInput>
  }

  export type BookmarkTagUpdateManyWithWhereWithoutTagInput = {
    where: BookmarkTagScalarWhereInput
    data: XOR<BookmarkTagUpdateManyMutationInput, BookmarkTagUncheckedUpdateManyWithoutTagInput>
  }

  export type TagCreateWithoutBookmarksInput = {
    id?: string
    name: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutTagsInput
  }

  export type TagUncheckedCreateWithoutBookmarksInput = {
    id?: string
    name: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    isDeleted?: boolean
    deletedAt?: Date | string | null
  }

  export type TagCreateOrConnectWithoutBookmarksInput = {
    where: TagWhereUniqueInput
    create: XOR<TagCreateWithoutBookmarksInput, TagUncheckedCreateWithoutBookmarksInput>
  }

  export type BookmarkCreateWithoutTagsInput = {
    id?: string
    url: string
    title: string
    description?: string | null
    favicon?: string | null
    previewImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastVisited?: Date | string | null
    visitCount?: number
    notes?: string | null
    isDeleted?: boolean
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutBookmarksInput
    folders?: FolderBookmarkCreateNestedManyWithoutBookmarkInput
    collections?: BookmarkCollectionCreateNestedManyWithoutBookmarkInput
  }

  export type BookmarkUncheckedCreateWithoutTagsInput = {
    id?: string
    url: string
    title: string
    description?: string | null
    favicon?: string | null
    previewImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastVisited?: Date | string | null
    visitCount?: number
    notes?: string | null
    userId: string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    folders?: FolderBookmarkUncheckedCreateNestedManyWithoutBookmarkInput
    collections?: BookmarkCollectionUncheckedCreateNestedManyWithoutBookmarkInput
  }

  export type BookmarkCreateOrConnectWithoutTagsInput = {
    where: BookmarkWhereUniqueInput
    create: XOR<BookmarkCreateWithoutTagsInput, BookmarkUncheckedCreateWithoutTagsInput>
  }

  export type TagUpsertWithoutBookmarksInput = {
    update: XOR<TagUpdateWithoutBookmarksInput, TagUncheckedUpdateWithoutBookmarksInput>
    create: XOR<TagCreateWithoutBookmarksInput, TagUncheckedCreateWithoutBookmarksInput>
    where?: TagWhereInput
  }

  export type TagUpdateToOneWithWhereWithoutBookmarksInput = {
    where?: TagWhereInput
    data: XOR<TagUpdateWithoutBookmarksInput, TagUncheckedUpdateWithoutBookmarksInput>
  }

  export type TagUpdateWithoutBookmarksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutTagsNestedInput
  }

  export type TagUncheckedUpdateWithoutBookmarksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BookmarkUpsertWithoutTagsInput = {
    update: XOR<BookmarkUpdateWithoutTagsInput, BookmarkUncheckedUpdateWithoutTagsInput>
    create: XOR<BookmarkCreateWithoutTagsInput, BookmarkUncheckedCreateWithoutTagsInput>
    where?: BookmarkWhereInput
  }

  export type BookmarkUpdateToOneWithWhereWithoutTagsInput = {
    where?: BookmarkWhereInput
    data: XOR<BookmarkUpdateWithoutTagsInput, BookmarkUncheckedUpdateWithoutTagsInput>
  }

  export type BookmarkUpdateWithoutTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    favicon?: NullableStringFieldUpdateOperationsInput | string | null
    previewImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisited?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutBookmarksNestedInput
    folders?: FolderBookmarkUpdateManyWithoutBookmarkNestedInput
    collections?: BookmarkCollectionUpdateManyWithoutBookmarkNestedInput
  }

  export type BookmarkUncheckedUpdateWithoutTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    favicon?: NullableStringFieldUpdateOperationsInput | string | null
    previewImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisited?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    folders?: FolderBookmarkUncheckedUpdateManyWithoutBookmarkNestedInput
    collections?: BookmarkCollectionUncheckedUpdateManyWithoutBookmarkNestedInput
  }

  export type UserCreateWithoutCollectionsInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
    bookmarks?: BookmarkCreateNestedManyWithoutUserInput
    folders?: FolderCreateNestedManyWithoutUserInput
    tags?: TagCreateNestedManyWithoutUserInput
    ownedCollections?: CollectionCreateNestedManyWithoutOwnerInput
    collabFolders?: FolderCollaboratorCreateNestedManyWithoutUserInput
    collabCollections?: CollectionCollaboratorCreateNestedManyWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCollectionsInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    folders?: FolderUncheckedCreateNestedManyWithoutUserInput
    tags?: TagUncheckedCreateNestedManyWithoutUserInput
    ownedCollections?: CollectionUncheckedCreateNestedManyWithoutOwnerInput
    collabFolders?: FolderCollaboratorUncheckedCreateNestedManyWithoutUserInput
    collabCollections?: CollectionCollaboratorUncheckedCreateNestedManyWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCollectionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCollectionsInput, UserUncheckedCreateWithoutCollectionsInput>
  }

  export type UserCreateWithoutOwnedCollectionsInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
    bookmarks?: BookmarkCreateNestedManyWithoutUserInput
    folders?: FolderCreateNestedManyWithoutUserInput
    tags?: TagCreateNestedManyWithoutUserInput
    collections?: CollectionCreateNestedManyWithoutUserInput
    collabFolders?: FolderCollaboratorCreateNestedManyWithoutUserInput
    collabCollections?: CollectionCollaboratorCreateNestedManyWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOwnedCollectionsInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    folders?: FolderUncheckedCreateNestedManyWithoutUserInput
    tags?: TagUncheckedCreateNestedManyWithoutUserInput
    collections?: CollectionUncheckedCreateNestedManyWithoutUserInput
    collabFolders?: FolderCollaboratorUncheckedCreateNestedManyWithoutUserInput
    collabCollections?: CollectionCollaboratorUncheckedCreateNestedManyWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOwnedCollectionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOwnedCollectionsInput, UserUncheckedCreateWithoutOwnedCollectionsInput>
  }

  export type BookmarkCollectionCreateWithoutCollectionInput = {
    addedAt?: Date | string
    order?: number
    bookmark: BookmarkCreateNestedOneWithoutCollectionsInput
  }

  export type BookmarkCollectionUncheckedCreateWithoutCollectionInput = {
    bookmarkId: string
    addedAt?: Date | string
    order?: number
  }

  export type BookmarkCollectionCreateOrConnectWithoutCollectionInput = {
    where: BookmarkCollectionWhereUniqueInput
    create: XOR<BookmarkCollectionCreateWithoutCollectionInput, BookmarkCollectionUncheckedCreateWithoutCollectionInput>
  }

  export type BookmarkCollectionCreateManyCollectionInputEnvelope = {
    data: BookmarkCollectionCreateManyCollectionInput | BookmarkCollectionCreateManyCollectionInput[]
    skipDuplicates?: boolean
  }

  export type CollectionCollaboratorCreateWithoutCollectionInput = {
    permission?: $Enums.Role
    addedAt?: Date | string
    user: UserCreateNestedOneWithoutCollabCollectionsInput
  }

  export type CollectionCollaboratorUncheckedCreateWithoutCollectionInput = {
    userId: string
    permission?: $Enums.Role
    addedAt?: Date | string
  }

  export type CollectionCollaboratorCreateOrConnectWithoutCollectionInput = {
    where: CollectionCollaboratorWhereUniqueInput
    create: XOR<CollectionCollaboratorCreateWithoutCollectionInput, CollectionCollaboratorUncheckedCreateWithoutCollectionInput>
  }

  export type CollectionCollaboratorCreateManyCollectionInputEnvelope = {
    data: CollectionCollaboratorCreateManyCollectionInput | CollectionCollaboratorCreateManyCollectionInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutCollectionsInput = {
    update: XOR<UserUpdateWithoutCollectionsInput, UserUncheckedUpdateWithoutCollectionsInput>
    create: XOR<UserCreateWithoutCollectionsInput, UserUncheckedCreateWithoutCollectionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCollectionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCollectionsInput, UserUncheckedUpdateWithoutCollectionsInput>
  }

  export type UserUpdateWithoutCollectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarks?: BookmarkUpdateManyWithoutUserNestedInput
    folders?: FolderUpdateManyWithoutUserNestedInput
    tags?: TagUpdateManyWithoutUserNestedInput
    ownedCollections?: CollectionUpdateManyWithoutOwnerNestedInput
    collabFolders?: FolderCollaboratorUpdateManyWithoutUserNestedInput
    collabCollections?: CollectionCollaboratorUpdateManyWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCollectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarks?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    folders?: FolderUncheckedUpdateManyWithoutUserNestedInput
    tags?: TagUncheckedUpdateManyWithoutUserNestedInput
    ownedCollections?: CollectionUncheckedUpdateManyWithoutOwnerNestedInput
    collabFolders?: FolderCollaboratorUncheckedUpdateManyWithoutUserNestedInput
    collabCollections?: CollectionCollaboratorUncheckedUpdateManyWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutOwnedCollectionsInput = {
    update: XOR<UserUpdateWithoutOwnedCollectionsInput, UserUncheckedUpdateWithoutOwnedCollectionsInput>
    create: XOR<UserCreateWithoutOwnedCollectionsInput, UserUncheckedCreateWithoutOwnedCollectionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOwnedCollectionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOwnedCollectionsInput, UserUncheckedUpdateWithoutOwnedCollectionsInput>
  }

  export type UserUpdateWithoutOwnedCollectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarks?: BookmarkUpdateManyWithoutUserNestedInput
    folders?: FolderUpdateManyWithoutUserNestedInput
    tags?: TagUpdateManyWithoutUserNestedInput
    collections?: CollectionUpdateManyWithoutUserNestedInput
    collabFolders?: FolderCollaboratorUpdateManyWithoutUserNestedInput
    collabCollections?: CollectionCollaboratorUpdateManyWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOwnedCollectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarks?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    folders?: FolderUncheckedUpdateManyWithoutUserNestedInput
    tags?: TagUncheckedUpdateManyWithoutUserNestedInput
    collections?: CollectionUncheckedUpdateManyWithoutUserNestedInput
    collabFolders?: FolderCollaboratorUncheckedUpdateManyWithoutUserNestedInput
    collabCollections?: CollectionCollaboratorUncheckedUpdateManyWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type BookmarkCollectionUpsertWithWhereUniqueWithoutCollectionInput = {
    where: BookmarkCollectionWhereUniqueInput
    update: XOR<BookmarkCollectionUpdateWithoutCollectionInput, BookmarkCollectionUncheckedUpdateWithoutCollectionInput>
    create: XOR<BookmarkCollectionCreateWithoutCollectionInput, BookmarkCollectionUncheckedCreateWithoutCollectionInput>
  }

  export type BookmarkCollectionUpdateWithWhereUniqueWithoutCollectionInput = {
    where: BookmarkCollectionWhereUniqueInput
    data: XOR<BookmarkCollectionUpdateWithoutCollectionInput, BookmarkCollectionUncheckedUpdateWithoutCollectionInput>
  }

  export type BookmarkCollectionUpdateManyWithWhereWithoutCollectionInput = {
    where: BookmarkCollectionScalarWhereInput
    data: XOR<BookmarkCollectionUpdateManyMutationInput, BookmarkCollectionUncheckedUpdateManyWithoutCollectionInput>
  }

  export type CollectionCollaboratorUpsertWithWhereUniqueWithoutCollectionInput = {
    where: CollectionCollaboratorWhereUniqueInput
    update: XOR<CollectionCollaboratorUpdateWithoutCollectionInput, CollectionCollaboratorUncheckedUpdateWithoutCollectionInput>
    create: XOR<CollectionCollaboratorCreateWithoutCollectionInput, CollectionCollaboratorUncheckedCreateWithoutCollectionInput>
  }

  export type CollectionCollaboratorUpdateWithWhereUniqueWithoutCollectionInput = {
    where: CollectionCollaboratorWhereUniqueInput
    data: XOR<CollectionCollaboratorUpdateWithoutCollectionInput, CollectionCollaboratorUncheckedUpdateWithoutCollectionInput>
  }

  export type CollectionCollaboratorUpdateManyWithWhereWithoutCollectionInput = {
    where: CollectionCollaboratorScalarWhereInput
    data: XOR<CollectionCollaboratorUpdateManyMutationInput, CollectionCollaboratorUncheckedUpdateManyWithoutCollectionInput>
  }

  export type CollectionCreateWithoutBookmarksInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    publicLink?: string | null
    thumbnail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutCollectionsInput
    owner: UserCreateNestedOneWithoutOwnedCollectionsInput
    collaborators?: CollectionCollaboratorCreateNestedManyWithoutCollectionInput
  }

  export type CollectionUncheckedCreateWithoutBookmarksInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    publicLink?: string | null
    thumbnail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    ownerId: string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    collaborators?: CollectionCollaboratorUncheckedCreateNestedManyWithoutCollectionInput
  }

  export type CollectionCreateOrConnectWithoutBookmarksInput = {
    where: CollectionWhereUniqueInput
    create: XOR<CollectionCreateWithoutBookmarksInput, CollectionUncheckedCreateWithoutBookmarksInput>
  }

  export type BookmarkCreateWithoutCollectionsInput = {
    id?: string
    url: string
    title: string
    description?: string | null
    favicon?: string | null
    previewImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastVisited?: Date | string | null
    visitCount?: number
    notes?: string | null
    isDeleted?: boolean
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutBookmarksInput
    folders?: FolderBookmarkCreateNestedManyWithoutBookmarkInput
    tags?: BookmarkTagCreateNestedManyWithoutBookmarkInput
  }

  export type BookmarkUncheckedCreateWithoutCollectionsInput = {
    id?: string
    url: string
    title: string
    description?: string | null
    favicon?: string | null
    previewImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastVisited?: Date | string | null
    visitCount?: number
    notes?: string | null
    userId: string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    folders?: FolderBookmarkUncheckedCreateNestedManyWithoutBookmarkInput
    tags?: BookmarkTagUncheckedCreateNestedManyWithoutBookmarkInput
  }

  export type BookmarkCreateOrConnectWithoutCollectionsInput = {
    where: BookmarkWhereUniqueInput
    create: XOR<BookmarkCreateWithoutCollectionsInput, BookmarkUncheckedCreateWithoutCollectionsInput>
  }

  export type CollectionUpsertWithoutBookmarksInput = {
    update: XOR<CollectionUpdateWithoutBookmarksInput, CollectionUncheckedUpdateWithoutBookmarksInput>
    create: XOR<CollectionCreateWithoutBookmarksInput, CollectionUncheckedCreateWithoutBookmarksInput>
    where?: CollectionWhereInput
  }

  export type CollectionUpdateToOneWithWhereWithoutBookmarksInput = {
    where?: CollectionWhereInput
    data: XOR<CollectionUpdateWithoutBookmarksInput, CollectionUncheckedUpdateWithoutBookmarksInput>
  }

  export type CollectionUpdateWithoutBookmarksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publicLink?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutCollectionsNestedInput
    owner?: UserUpdateOneRequiredWithoutOwnedCollectionsNestedInput
    collaborators?: CollectionCollaboratorUpdateManyWithoutCollectionNestedInput
  }

  export type CollectionUncheckedUpdateWithoutBookmarksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publicLink?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    collaborators?: CollectionCollaboratorUncheckedUpdateManyWithoutCollectionNestedInput
  }

  export type BookmarkUpsertWithoutCollectionsInput = {
    update: XOR<BookmarkUpdateWithoutCollectionsInput, BookmarkUncheckedUpdateWithoutCollectionsInput>
    create: XOR<BookmarkCreateWithoutCollectionsInput, BookmarkUncheckedCreateWithoutCollectionsInput>
    where?: BookmarkWhereInput
  }

  export type BookmarkUpdateToOneWithWhereWithoutCollectionsInput = {
    where?: BookmarkWhereInput
    data: XOR<BookmarkUpdateWithoutCollectionsInput, BookmarkUncheckedUpdateWithoutCollectionsInput>
  }

  export type BookmarkUpdateWithoutCollectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    favicon?: NullableStringFieldUpdateOperationsInput | string | null
    previewImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisited?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutBookmarksNestedInput
    folders?: FolderBookmarkUpdateManyWithoutBookmarkNestedInput
    tags?: BookmarkTagUpdateManyWithoutBookmarkNestedInput
  }

  export type BookmarkUncheckedUpdateWithoutCollectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    favicon?: NullableStringFieldUpdateOperationsInput | string | null
    previewImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisited?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    folders?: FolderBookmarkUncheckedUpdateManyWithoutBookmarkNestedInput
    tags?: BookmarkTagUncheckedUpdateManyWithoutBookmarkNestedInput
  }

  export type CollectionCreateWithoutCollaboratorsInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    publicLink?: string | null
    thumbnail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    user: UserCreateNestedOneWithoutCollectionsInput
    owner: UserCreateNestedOneWithoutOwnedCollectionsInput
    bookmarks?: BookmarkCollectionCreateNestedManyWithoutCollectionInput
  }

  export type CollectionUncheckedCreateWithoutCollaboratorsInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    publicLink?: string | null
    thumbnail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    ownerId: string
    isDeleted?: boolean
    deletedAt?: Date | string | null
    bookmarks?: BookmarkCollectionUncheckedCreateNestedManyWithoutCollectionInput
  }

  export type CollectionCreateOrConnectWithoutCollaboratorsInput = {
    where: CollectionWhereUniqueInput
    create: XOR<CollectionCreateWithoutCollaboratorsInput, CollectionUncheckedCreateWithoutCollaboratorsInput>
  }

  export type UserCreateWithoutCollabCollectionsInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
    bookmarks?: BookmarkCreateNestedManyWithoutUserInput
    folders?: FolderCreateNestedManyWithoutUserInput
    tags?: TagCreateNestedManyWithoutUserInput
    collections?: CollectionCreateNestedManyWithoutUserInput
    ownedCollections?: CollectionCreateNestedManyWithoutOwnerInput
    collabFolders?: FolderCollaboratorCreateNestedManyWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCollabCollectionsInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    folders?: FolderUncheckedCreateNestedManyWithoutUserInput
    tags?: TagUncheckedCreateNestedManyWithoutUserInput
    collections?: CollectionUncheckedCreateNestedManyWithoutUserInput
    ownedCollections?: CollectionUncheckedCreateNestedManyWithoutOwnerInput
    collabFolders?: FolderCollaboratorUncheckedCreateNestedManyWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCollabCollectionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCollabCollectionsInput, UserUncheckedCreateWithoutCollabCollectionsInput>
  }

  export type CollectionUpsertWithoutCollaboratorsInput = {
    update: XOR<CollectionUpdateWithoutCollaboratorsInput, CollectionUncheckedUpdateWithoutCollaboratorsInput>
    create: XOR<CollectionCreateWithoutCollaboratorsInput, CollectionUncheckedCreateWithoutCollaboratorsInput>
    where?: CollectionWhereInput
  }

  export type CollectionUpdateToOneWithWhereWithoutCollaboratorsInput = {
    where?: CollectionWhereInput
    data: XOR<CollectionUpdateWithoutCollaboratorsInput, CollectionUncheckedUpdateWithoutCollaboratorsInput>
  }

  export type CollectionUpdateWithoutCollaboratorsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publicLink?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutCollectionsNestedInput
    owner?: UserUpdateOneRequiredWithoutOwnedCollectionsNestedInput
    bookmarks?: BookmarkCollectionUpdateManyWithoutCollectionNestedInput
  }

  export type CollectionUncheckedUpdateWithoutCollaboratorsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publicLink?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bookmarks?: BookmarkCollectionUncheckedUpdateManyWithoutCollectionNestedInput
  }

  export type UserUpsertWithoutCollabCollectionsInput = {
    update: XOR<UserUpdateWithoutCollabCollectionsInput, UserUncheckedUpdateWithoutCollabCollectionsInput>
    create: XOR<UserCreateWithoutCollabCollectionsInput, UserUncheckedCreateWithoutCollabCollectionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCollabCollectionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCollabCollectionsInput, UserUncheckedUpdateWithoutCollabCollectionsInput>
  }

  export type UserUpdateWithoutCollabCollectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarks?: BookmarkUpdateManyWithoutUserNestedInput
    folders?: FolderUpdateManyWithoutUserNestedInput
    tags?: TagUpdateManyWithoutUserNestedInput
    collections?: CollectionUpdateManyWithoutUserNestedInput
    ownedCollections?: CollectionUpdateManyWithoutOwnerNestedInput
    collabFolders?: FolderCollaboratorUpdateManyWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCollabCollectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarks?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    folders?: FolderUncheckedUpdateManyWithoutUserNestedInput
    tags?: TagUncheckedUpdateManyWithoutUserNestedInput
    collections?: CollectionUncheckedUpdateManyWithoutUserNestedInput
    ownedCollections?: CollectionUncheckedUpdateManyWithoutOwnerNestedInput
    collabFolders?: FolderCollaboratorUncheckedUpdateManyWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutDevicesInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
    bookmarks?: BookmarkCreateNestedManyWithoutUserInput
    folders?: FolderCreateNestedManyWithoutUserInput
    tags?: TagCreateNestedManyWithoutUserInput
    collections?: CollectionCreateNestedManyWithoutUserInput
    ownedCollections?: CollectionCreateNestedManyWithoutOwnerInput
    collabFolders?: FolderCollaboratorCreateNestedManyWithoutUserInput
    collabCollections?: CollectionCollaboratorCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDevicesInput = {
    id?: string
    email: string
    username: string
    password: string
    name?: string | null
    profileImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    lastLogin?: Date | string | null
    refreshToken?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    isVerified?: boolean
    verificationToken?: string | null
    bookmarks?: BookmarkUncheckedCreateNestedManyWithoutUserInput
    folders?: FolderUncheckedCreateNestedManyWithoutUserInput
    tags?: TagUncheckedCreateNestedManyWithoutUserInput
    collections?: CollectionUncheckedCreateNestedManyWithoutUserInput
    ownedCollections?: CollectionUncheckedCreateNestedManyWithoutOwnerInput
    collabFolders?: FolderCollaboratorUncheckedCreateNestedManyWithoutUserInput
    collabCollections?: CollectionCollaboratorUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDevicesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDevicesInput, UserUncheckedCreateWithoutDevicesInput>
  }

  export type UserUpsertWithoutDevicesInput = {
    update: XOR<UserUpdateWithoutDevicesInput, UserUncheckedUpdateWithoutDevicesInput>
    create: XOR<UserCreateWithoutDevicesInput, UserUncheckedCreateWithoutDevicesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDevicesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDevicesInput, UserUncheckedUpdateWithoutDevicesInput>
  }

  export type UserUpdateWithoutDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarks?: BookmarkUpdateManyWithoutUserNestedInput
    folders?: FolderUpdateManyWithoutUserNestedInput
    tags?: TagUpdateManyWithoutUserNestedInput
    collections?: CollectionUpdateManyWithoutUserNestedInput
    ownedCollections?: CollectionUpdateManyWithoutOwnerNestedInput
    collabFolders?: FolderCollaboratorUpdateManyWithoutUserNestedInput
    collabCollections?: CollectionCollaboratorUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    profileImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    bookmarks?: BookmarkUncheckedUpdateManyWithoutUserNestedInput
    folders?: FolderUncheckedUpdateManyWithoutUserNestedInput
    tags?: TagUncheckedUpdateManyWithoutUserNestedInput
    collections?: CollectionUncheckedUpdateManyWithoutUserNestedInput
    ownedCollections?: CollectionUncheckedUpdateManyWithoutOwnerNestedInput
    collabFolders?: FolderCollaboratorUncheckedUpdateManyWithoutUserNestedInput
    collabCollections?: CollectionCollaboratorUncheckedUpdateManyWithoutUserNestedInput
  }

  export type BookmarkCreateManyUserInput = {
    id?: string
    url: string
    title: string
    description?: string | null
    favicon?: string | null
    previewImage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastVisited?: Date | string | null
    visitCount?: number
    notes?: string | null
    isDeleted?: boolean
    deletedAt?: Date | string | null
  }

  export type FolderCreateManyUserInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    parentId?: string | null
    isDeleted?: boolean
    deletedAt?: Date | string | null
  }

  export type TagCreateManyUserInput = {
    id?: string
    name: string
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    deletedAt?: Date | string | null
  }

  export type CollectionCreateManyUserInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    publicLink?: string | null
    thumbnail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ownerId: string
    isDeleted?: boolean
    deletedAt?: Date | string | null
  }

  export type CollectionCreateManyOwnerInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    publicLink?: string | null
    thumbnail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    isDeleted?: boolean
    deletedAt?: Date | string | null
  }

  export type FolderCollaboratorCreateManyUserInput = {
    folderId: string
    permission?: $Enums.Role
    addedAt?: Date | string
  }

  export type CollectionCollaboratorCreateManyUserInput = {
    collectionId: string
    permission?: $Enums.Role
    addedAt?: Date | string
  }

  export type DeviceCreateManyUserInput = {
    id?: string
    deviceName: string
    deviceType: string
    lastSynced?: Date | string
    lastActive?: Date | string
  }

  export type BookmarkUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    favicon?: NullableStringFieldUpdateOperationsInput | string | null
    previewImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisited?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    folders?: FolderBookmarkUpdateManyWithoutBookmarkNestedInput
    tags?: BookmarkTagUpdateManyWithoutBookmarkNestedInput
    collections?: BookmarkCollectionUpdateManyWithoutBookmarkNestedInput
  }

  export type BookmarkUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    favicon?: NullableStringFieldUpdateOperationsInput | string | null
    previewImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisited?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    folders?: FolderBookmarkUncheckedUpdateManyWithoutBookmarkNestedInput
    tags?: BookmarkTagUncheckedUpdateManyWithoutBookmarkNestedInput
    collections?: BookmarkCollectionUncheckedUpdateManyWithoutBookmarkNestedInput
  }

  export type BookmarkUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    favicon?: NullableStringFieldUpdateOperationsInput | string | null
    previewImage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisited?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitCount?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FolderUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parent?: FolderUpdateOneWithoutChildrenNestedInput
    children?: FolderUpdateManyWithoutParentNestedInput
    bookmarks?: FolderBookmarkUpdateManyWithoutFolderNestedInput
    collaborators?: FolderCollaboratorUpdateManyWithoutFolderNestedInput
  }

  export type FolderUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    children?: FolderUncheckedUpdateManyWithoutParentNestedInput
    bookmarks?: FolderBookmarkUncheckedUpdateManyWithoutFolderNestedInput
    collaborators?: FolderCollaboratorUncheckedUpdateManyWithoutFolderNestedInput
  }

  export type FolderUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TagUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bookmarks?: BookmarkTagUpdateManyWithoutTagNestedInput
  }

  export type TagUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bookmarks?: BookmarkTagUncheckedUpdateManyWithoutTagNestedInput
  }

  export type TagUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CollectionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publicLink?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    owner?: UserUpdateOneRequiredWithoutOwnedCollectionsNestedInput
    bookmarks?: BookmarkCollectionUpdateManyWithoutCollectionNestedInput
    collaborators?: CollectionCollaboratorUpdateManyWithoutCollectionNestedInput
  }

  export type CollectionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publicLink?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bookmarks?: BookmarkCollectionUncheckedUpdateManyWithoutCollectionNestedInput
    collaborators?: CollectionCollaboratorUncheckedUpdateManyWithoutCollectionNestedInput
  }

  export type CollectionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publicLink?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownerId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CollectionUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publicLink?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutCollectionsNestedInput
    bookmarks?: BookmarkCollectionUpdateManyWithoutCollectionNestedInput
    collaborators?: CollectionCollaboratorUpdateManyWithoutCollectionNestedInput
  }

  export type CollectionUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publicLink?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bookmarks?: BookmarkCollectionUncheckedUpdateManyWithoutCollectionNestedInput
    collaborators?: CollectionCollaboratorUncheckedUpdateManyWithoutCollectionNestedInput
  }

  export type CollectionUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    publicLink?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FolderCollaboratorUpdateWithoutUserInput = {
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    folder?: FolderUpdateOneRequiredWithoutCollaboratorsNestedInput
  }

  export type FolderCollaboratorUncheckedUpdateWithoutUserInput = {
    folderId?: StringFieldUpdateOperationsInput | string
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FolderCollaboratorUncheckedUpdateManyWithoutUserInput = {
    folderId?: StringFieldUpdateOperationsInput | string
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollectionCollaboratorUpdateWithoutUserInput = {
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collection?: CollectionUpdateOneRequiredWithoutCollaboratorsNestedInput
  }

  export type CollectionCollaboratorUncheckedUpdateWithoutUserInput = {
    collectionId?: StringFieldUpdateOperationsInput | string
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollectionCollaboratorUncheckedUpdateManyWithoutUserInput = {
    collectionId?: StringFieldUpdateOperationsInput | string
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceName?: StringFieldUpdateOperationsInput | string
    deviceType?: StringFieldUpdateOperationsInput | string
    lastSynced?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceName?: StringFieldUpdateOperationsInput | string
    deviceType?: StringFieldUpdateOperationsInput | string
    lastSynced?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceName?: StringFieldUpdateOperationsInput | string
    deviceType?: StringFieldUpdateOperationsInput | string
    lastSynced?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FolderBookmarkCreateManyBookmarkInput = {
    folderId: string
    addedAt?: Date | string
  }

  export type BookmarkTagCreateManyBookmarkInput = {
    tagId: string
    addedAt?: Date | string
  }

  export type BookmarkCollectionCreateManyBookmarkInput = {
    collectionId: string
    addedAt?: Date | string
    order?: number
  }

  export type FolderBookmarkUpdateWithoutBookmarkInput = {
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    folder?: FolderUpdateOneRequiredWithoutBookmarksNestedInput
  }

  export type FolderBookmarkUncheckedUpdateWithoutBookmarkInput = {
    folderId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FolderBookmarkUncheckedUpdateManyWithoutBookmarkInput = {
    folderId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkTagUpdateWithoutBookmarkInput = {
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tag?: TagUpdateOneRequiredWithoutBookmarksNestedInput
  }

  export type BookmarkTagUncheckedUpdateWithoutBookmarkInput = {
    tagId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkTagUncheckedUpdateManyWithoutBookmarkInput = {
    tagId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkCollectionUpdateWithoutBookmarkInput = {
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: IntFieldUpdateOperationsInput | number
    collection?: CollectionUpdateOneRequiredWithoutBookmarksNestedInput
  }

  export type BookmarkCollectionUncheckedUpdateWithoutBookmarkInput = {
    collectionId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type BookmarkCollectionUncheckedUpdateManyWithoutBookmarkInput = {
    collectionId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type FolderCreateManyParentInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    isDeleted?: boolean
    deletedAt?: Date | string | null
  }

  export type FolderBookmarkCreateManyFolderInput = {
    bookmarkId: string
    addedAt?: Date | string
  }

  export type FolderCollaboratorCreateManyFolderInput = {
    userId: string
    permission?: $Enums.Role
    addedAt?: Date | string
  }

  export type FolderUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutFoldersNestedInput
    children?: FolderUpdateManyWithoutParentNestedInput
    bookmarks?: FolderBookmarkUpdateManyWithoutFolderNestedInput
    collaborators?: FolderCollaboratorUpdateManyWithoutFolderNestedInput
  }

  export type FolderUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    children?: FolderUncheckedUpdateManyWithoutParentNestedInput
    bookmarks?: FolderBookmarkUncheckedUpdateManyWithoutFolderNestedInput
    collaborators?: FolderCollaboratorUncheckedUpdateManyWithoutFolderNestedInput
  }

  export type FolderUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FolderBookmarkUpdateWithoutFolderInput = {
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookmark?: BookmarkUpdateOneRequiredWithoutFoldersNestedInput
  }

  export type FolderBookmarkUncheckedUpdateWithoutFolderInput = {
    bookmarkId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FolderBookmarkUncheckedUpdateManyWithoutFolderInput = {
    bookmarkId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FolderCollaboratorUpdateWithoutFolderInput = {
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCollabFoldersNestedInput
  }

  export type FolderCollaboratorUncheckedUpdateWithoutFolderInput = {
    userId?: StringFieldUpdateOperationsInput | string
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FolderCollaboratorUncheckedUpdateManyWithoutFolderInput = {
    userId?: StringFieldUpdateOperationsInput | string
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkTagCreateManyTagInput = {
    bookmarkId: string
    addedAt?: Date | string
  }

  export type BookmarkTagUpdateWithoutTagInput = {
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookmark?: BookmarkUpdateOneRequiredWithoutTagsNestedInput
  }

  export type BookmarkTagUncheckedUpdateWithoutTagInput = {
    bookmarkId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkTagUncheckedUpdateManyWithoutTagInput = {
    bookmarkId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookmarkCollectionCreateManyCollectionInput = {
    bookmarkId: string
    addedAt?: Date | string
    order?: number
  }

  export type CollectionCollaboratorCreateManyCollectionInput = {
    userId: string
    permission?: $Enums.Role
    addedAt?: Date | string
  }

  export type BookmarkCollectionUpdateWithoutCollectionInput = {
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: IntFieldUpdateOperationsInput | number
    bookmark?: BookmarkUpdateOneRequiredWithoutCollectionsNestedInput
  }

  export type BookmarkCollectionUncheckedUpdateWithoutCollectionInput = {
    bookmarkId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type BookmarkCollectionUncheckedUpdateManyWithoutCollectionInput = {
    bookmarkId?: StringFieldUpdateOperationsInput | string
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type CollectionCollaboratorUpdateWithoutCollectionInput = {
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCollabCollectionsNestedInput
  }

  export type CollectionCollaboratorUncheckedUpdateWithoutCollectionInput = {
    userId?: StringFieldUpdateOperationsInput | string
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollectionCollaboratorUncheckedUpdateManyWithoutCollectionInput = {
    userId?: StringFieldUpdateOperationsInput | string
    permission?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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