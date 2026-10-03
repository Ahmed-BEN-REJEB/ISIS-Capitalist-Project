import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type RatioType =
  | 'gain'
  | 'vitesse'
  | 'ange';

export type Palier = {
  __typename?: 'Palier';
  name: Scalars['String']['output'];
  logo: Scalars['String']['output'];
  seuil: Scalars['Float']['output'];
  idcible: Scalars['Int']['output'];
  ratio: Scalars['Int']['output'];
  typeratio: RatioType;
  unlocked: Scalars['Boolean']['output'];
};

export type Product = {
  __typename?: 'Product';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  logo: Scalars['String']['output'];
  cout: Scalars['Float']['output'];
  croissance: Scalars['Float']['output'];
  revenu: Scalars['Float']['output'];
  vitesse: Scalars['Int']['output'];
  quantite: Scalars['Int']['output'];
  timeleft: Scalars['Int']['output'];
  managerUnlocked: Scalars['Boolean']['output'];
  paliers: Array<Palier>;
};

export type World = {
  __typename?: 'World';
  name: Scalars['String']['output'];
  logo: Scalars['String']['output'];
  money: Scalars['Float']['output'];
  score: Scalars['Float']['output'];
  totalangels: Scalars['Int']['output'];
  activeangels: Scalars['Int']['output'];
  angelbonus: Scalars['Int']['output'];
  lastupdate: Scalars['Float']['output'];
  products: Array<Product>;
  allunlocks: Array<Palier>;
  upgrades: Array<Palier>;
  angelupgrades: Array<Palier>;
  managers: Array<Palier>;
};

export type Query = {
  __typename?: 'Query';
  getWorld?: Maybe<World>;
};


export type QueryGetWorldArgs = {
  user: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acheterQtProduit?: Maybe<Product>;
  lancerProductionProduit?: Maybe<Product>;
  engagerManager?: Maybe<Palier>;
  acheterCashUpgrade?: Maybe<Palier>;
  acheterAngelUpgrade?: Maybe<Palier>;
  resetWorld?: Maybe<World>;
};


export type MutationAcheterQtProduitArgs = {
  user: Scalars['String']['input'];
  id: Scalars['Int']['input'];
  quantite: Scalars['Int']['input'];
};


export type MutationLancerProductionProduitArgs = {
  user: Scalars['String']['input'];
  id: Scalars['Int']['input'];
};


export type MutationEngagerManagerArgs = {
  user: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationAcheterCashUpgradeArgs = {
  user: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationAcheterAngelUpgradeArgs = {
  user: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationResetWorldArgs = {
  user: Scalars['String']['input'];
};

export type RewardFragment = { __typename?: 'Palier', name: string, logo: string, seuil: number, idcible: number, ratio: number, typeratio: RatioType, unlocked: boolean };

export type KingdomFragment = { __typename?: 'World', name: string, logo: string, money: number, score: number, totalangels: number, activeangels: number, angelbonus: number, lastupdate: number, products: Array<{ __typename?: 'Product', id: number, name: string, logo: string, cout: number, croissance: number, revenu: number, vitesse: number, quantite: number, timeleft: number, managerUnlocked: boolean, paliers: Array<{ __typename?: 'Palier', name: string, logo: string, seuil: number, idcible: number, ratio: number, typeratio: RatioType, unlocked: boolean }> }>, managers: Array<{ __typename?: 'Palier', name: string, logo: string, seuil: number, idcible: number, ratio: number, typeratio: RatioType, unlocked: boolean }>, upgrades: Array<{ __typename?: 'Palier', name: string, logo: string, seuil: number, idcible: number, ratio: number, typeratio: RatioType, unlocked: boolean }>, angelupgrades: Array<{ __typename?: 'Palier', name: string, logo: string, seuil: number, idcible: number, ratio: number, typeratio: RatioType, unlocked: boolean }>, allunlocks: Array<{ __typename?: 'Palier', name: string, logo: string, seuil: number, idcible: number, ratio: number, typeratio: RatioType, unlocked: boolean }> };

export type GetWorldQueryVariables = Exact<{
  user: Scalars['String']['input'];
}>;


export type GetWorldQuery = { __typename?: 'Query', getWorld?: { __typename?: 'World', name: string, logo: string, money: number, score: number, totalangels: number, activeangels: number, angelbonus: number, lastupdate: number, products: Array<{ __typename?: 'Product', id: number, name: string, logo: string, cout: number, croissance: number, revenu: number, vitesse: number, quantite: number, timeleft: number, managerUnlocked: boolean, paliers: Array<{ __typename?: 'Palier', name: string, logo: string, seuil: number, idcible: number, ratio: number, typeratio: RatioType, unlocked: boolean }> }>, managers: Array<{ __typename?: 'Palier', name: string, logo: string, seuil: number, idcible: number, ratio: number, typeratio: RatioType, unlocked: boolean }>, upgrades: Array<{ __typename?: 'Palier', name: string, logo: string, seuil: number, idcible: number, ratio: number, typeratio: RatioType, unlocked: boolean }>, angelupgrades: Array<{ __typename?: 'Palier', name: string, logo: string, seuil: number, idcible: number, ratio: number, typeratio: RatioType, unlocked: boolean }>, allunlocks: Array<{ __typename?: 'Palier', name: string, logo: string, seuil: number, idcible: number, ratio: number, typeratio: RatioType, unlocked: boolean }> } | null };

export type BuyMutationVariables = Exact<{
  user: Scalars['String']['input'];
  id: Scalars['Int']['input'];
  quantite: Scalars['Int']['input'];
}>;


export type BuyMutation = { __typename?: 'Mutation', acheterQtProduit?: { __typename?: 'Product', id: number } | null };

export type LaunchMutationVariables = Exact<{
  user: Scalars['String']['input'];
  id: Scalars['Int']['input'];
}>;


export type LaunchMutation = { __typename?: 'Mutation', lancerProductionProduit?: { __typename?: 'Product', id: number } | null };

export type HireMutationVariables = Exact<{
  user: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type HireMutation = { __typename?: 'Mutation', engagerManager?: { __typename?: 'Palier', name: string } | null };

export type CashMutationVariables = Exact<{
  user: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type CashMutation = { __typename?: 'Mutation', acheterCashUpgrade?: { __typename?: 'Palier', name: string } | null };

export type AngelMutationVariables = Exact<{
  user: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type AngelMutation = { __typename?: 'Mutation', acheterAngelUpgrade?: { __typename?: 'Palier', name: string } | null };

export type ResetMutationVariables = Exact<{
  user: Scalars['String']['input'];
}>;


export type ResetMutation = { __typename?: 'Mutation', resetWorld?: { __typename?: 'World', name: string, logo: string, money: number, score: number, totalangels: number, activeangels: number, angelbonus: number, lastupdate: number, products: Array<{ __typename?: 'Product', id: number, name: string, logo: string, cout: number, croissance: number, revenu: number, vitesse: number, quantite: number, timeleft: number, managerUnlocked: boolean, paliers: Array<{ __typename?: 'Palier', name: string, logo: string, seuil: number, idcible: number, ratio: number, typeratio: RatioType, unlocked: boolean }> }>, managers: Array<{ __typename?: 'Palier', name: string, logo: string, seuil: number, idcible: number, ratio: number, typeratio: RatioType, unlocked: boolean }>, upgrades: Array<{ __typename?: 'Palier', name: string, logo: string, seuil: number, idcible: number, ratio: number, typeratio: RatioType, unlocked: boolean }>, angelupgrades: Array<{ __typename?: 'Palier', name: string, logo: string, seuil: number, idcible: number, ratio: number, typeratio: RatioType, unlocked: boolean }>, allunlocks: Array<{ __typename?: 'Palier', name: string, logo: string, seuil: number, idcible: number, ratio: number, typeratio: RatioType, unlocked: boolean }> } | null };

export const RewardFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Reward"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Palier"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"seuil"}},{"kind":"Field","name":{"kind":"Name","value":"idcible"}},{"kind":"Field","name":{"kind":"Name","value":"ratio"}},{"kind":"Field","name":{"kind":"Name","value":"typeratio"}},{"kind":"Field","name":{"kind":"Name","value":"unlocked"}}]}}]} as unknown as DocumentNode<RewardFragment, unknown>;
export const KingdomFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Kingdom"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"World"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"money"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"totalangels"}},{"kind":"Field","name":{"kind":"Name","value":"activeangels"}},{"kind":"Field","name":{"kind":"Name","value":"angelbonus"}},{"kind":"Field","name":{"kind":"Name","value":"lastupdate"}},{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"cout"}},{"kind":"Field","name":{"kind":"Name","value":"croissance"}},{"kind":"Field","name":{"kind":"Name","value":"revenu"}},{"kind":"Field","name":{"kind":"Name","value":"vitesse"}},{"kind":"Field","name":{"kind":"Name","value":"quantite"}},{"kind":"Field","name":{"kind":"Name","value":"timeleft"}},{"kind":"Field","name":{"kind":"Name","value":"managerUnlocked"}},{"kind":"Field","name":{"kind":"Name","value":"paliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reward"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"managers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reward"}}]}},{"kind":"Field","name":{"kind":"Name","value":"upgrades"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reward"}}]}},{"kind":"Field","name":{"kind":"Name","value":"angelupgrades"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reward"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allunlocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reward"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Reward"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Palier"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"seuil"}},{"kind":"Field","name":{"kind":"Name","value":"idcible"}},{"kind":"Field","name":{"kind":"Name","value":"ratio"}},{"kind":"Field","name":{"kind":"Name","value":"typeratio"}},{"kind":"Field","name":{"kind":"Name","value":"unlocked"}}]}}]} as unknown as DocumentNode<KingdomFragment, unknown>;
export const GetWorldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWorld"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWorld"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Kingdom"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Reward"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Palier"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"seuil"}},{"kind":"Field","name":{"kind":"Name","value":"idcible"}},{"kind":"Field","name":{"kind":"Name","value":"ratio"}},{"kind":"Field","name":{"kind":"Name","value":"typeratio"}},{"kind":"Field","name":{"kind":"Name","value":"unlocked"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Kingdom"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"World"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"money"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"totalangels"}},{"kind":"Field","name":{"kind":"Name","value":"activeangels"}},{"kind":"Field","name":{"kind":"Name","value":"angelbonus"}},{"kind":"Field","name":{"kind":"Name","value":"lastupdate"}},{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"cout"}},{"kind":"Field","name":{"kind":"Name","value":"croissance"}},{"kind":"Field","name":{"kind":"Name","value":"revenu"}},{"kind":"Field","name":{"kind":"Name","value":"vitesse"}},{"kind":"Field","name":{"kind":"Name","value":"quantite"}},{"kind":"Field","name":{"kind":"Name","value":"timeleft"}},{"kind":"Field","name":{"kind":"Name","value":"managerUnlocked"}},{"kind":"Field","name":{"kind":"Name","value":"paliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reward"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"managers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reward"}}]}},{"kind":"Field","name":{"kind":"Name","value":"upgrades"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reward"}}]}},{"kind":"Field","name":{"kind":"Name","value":"angelupgrades"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reward"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allunlocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reward"}}]}}]}}]} as unknown as DocumentNode<GetWorldQuery, GetWorldQueryVariables>;
export const BuyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Buy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"quantite"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acheterQtProduit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"quantite"},"value":{"kind":"Variable","name":{"kind":"Name","value":"quantite"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<BuyMutation, BuyMutationVariables>;
export const LaunchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Launch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lancerProductionProduit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<LaunchMutation, LaunchMutationVariables>;
export const HireDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Hire"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"engagerManager"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<HireMutation, HireMutationVariables>;
export const CashDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Cash"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acheterCashUpgrade"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CashMutation, CashMutationVariables>;
export const AngelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Angel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acheterAngelUpgrade"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AngelMutation, AngelMutationVariables>;
export const ResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Reset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetWorld"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Kingdom"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Reward"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Palier"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"seuil"}},{"kind":"Field","name":{"kind":"Name","value":"idcible"}},{"kind":"Field","name":{"kind":"Name","value":"ratio"}},{"kind":"Field","name":{"kind":"Name","value":"typeratio"}},{"kind":"Field","name":{"kind":"Name","value":"unlocked"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Kingdom"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"World"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"money"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"totalangels"}},{"kind":"Field","name":{"kind":"Name","value":"activeangels"}},{"kind":"Field","name":{"kind":"Name","value":"angelbonus"}},{"kind":"Field","name":{"kind":"Name","value":"lastupdate"}},{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"cout"}},{"kind":"Field","name":{"kind":"Name","value":"croissance"}},{"kind":"Field","name":{"kind":"Name","value":"revenu"}},{"kind":"Field","name":{"kind":"Name","value":"vitesse"}},{"kind":"Field","name":{"kind":"Name","value":"quantite"}},{"kind":"Field","name":{"kind":"Name","value":"timeleft"}},{"kind":"Field","name":{"kind":"Name","value":"managerUnlocked"}},{"kind":"Field","name":{"kind":"Name","value":"paliers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reward"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"managers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reward"}}]}},{"kind":"Field","name":{"kind":"Name","value":"upgrades"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reward"}}]}},{"kind":"Field","name":{"kind":"Name","value":"angelupgrades"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reward"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allunlocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Reward"}}]}}]}}]} as unknown as DocumentNode<ResetMutation, ResetMutationVariables>;