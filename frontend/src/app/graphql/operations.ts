import { gql } from '@apollo-orbit/angular';
import { TypedDocumentNode as DocumentNode } from '@apollo-orbit/angular';
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

export const RewardFragmentDoc = gql`
    fragment Reward on Palier {
  name
  logo
  seuil
  idcible
  ratio
  typeratio
  unlocked
}
    ` as DocumentNode<RewardFragment, unknown>;
export const KingdomFragmentDoc = gql`
    fragment Kingdom on World {
  name
  logo
  money
  score
  totalangels
  activeangels
  angelbonus
  lastupdate
  products {
    id
    name
    logo
    cout
    croissance
    revenu
    vitesse
    quantite
    timeleft
    managerUnlocked
    paliers {
      ...Reward
    }
  }
  managers {
    ...Reward
  }
  upgrades {
    ...Reward
  }
  angelupgrades {
    ...Reward
  }
  allunlocks {
    ...Reward
  }
}
    ${RewardFragmentDoc}` as DocumentNode<KingdomFragment, unknown>;
export const GET_WORLD_QUERY = gql`
    query GetWorld($user: String!) {
  getWorld(user: $user) {
    ...Kingdom
  }
}
    ${KingdomFragmentDoc}` as DocumentNode<GetWorldQuery, GetWorldQueryVariables>;
export const BUY_MUTATION = gql`
    mutation Buy($user: String!, $id: Int!, $quantite: Int!) {
  acheterQtProduit(user: $user, id: $id, quantite: $quantite) {
    id
  }
}
    ` as DocumentNode<BuyMutation, BuyMutationVariables>;
export const LAUNCH_MUTATION = gql`
    mutation Launch($user: String!, $id: Int!) {
  lancerProductionProduit(user: $user, id: $id) {
    id
  }
}
    ` as DocumentNode<LaunchMutation, LaunchMutationVariables>;
export const HIRE_MUTATION = gql`
    mutation Hire($user: String!, $name: String!) {
  engagerManager(user: $user, name: $name) {
    name
  }
}
    ` as DocumentNode<HireMutation, HireMutationVariables>;
export const CASH_MUTATION = gql`
    mutation Cash($user: String!, $name: String!) {
  acheterCashUpgrade(user: $user, name: $name) {
    name
  }
}
    ` as DocumentNode<CashMutation, CashMutationVariables>;
export const ANGEL_MUTATION = gql`
    mutation Angel($user: String!, $name: String!) {
  acheterAngelUpgrade(user: $user, name: $name) {
    name
  }
}
    ` as DocumentNode<AngelMutation, AngelMutationVariables>;
export const RESET_MUTATION = gql`
    mutation Reset($user: String!) {
  resetWorld(user: $user) {
    ...Kingdom
  }
}
    ${KingdomFragmentDoc}` as DocumentNode<ResetMutation, ResetMutationVariables>;