import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ManualReply = { 'Ok' : boolean } |
  { 'Err' : string };
export type _AzleResult = { 'Ok' : boolean } |
  { 'Err' : string };
export type _AzleResult_1 = { 'Ok' : string } |
  { 'Err' : string };
export interface _SERVICE {
  'createRequest' : ActorMethod<[string, string], ManualReply>,
  'deRegister' : ActorMethod<[], _AzleResult>,
  'isRegistered' : ActorMethod<[Principal], _AzleResult>,
  'queryFactoOrNot' : ActorMethod<[bigint], _AzleResult_1>,
  'registerYourself' : ActorMethod<[], _AzleResult>,
  'updateData' : ActorMethod<[bigint], _AzleResult>,
  'vote' : ActorMethod<[bigint, string], _AzleResult>,
}
