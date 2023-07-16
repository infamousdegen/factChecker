export const idlFactory = ({ IDL }) => {
  const ManualReply = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  const _AzleResult = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  const _AzleResult_1 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  return IDL.Service({
    'createRequest' : IDL.Func([IDL.Text, IDL.Text], [ManualReply], []),
    'deRegister' : IDL.Func([], [_AzleResult], []),
    'isRegistered' : IDL.Func([IDL.Principal], [_AzleResult], []),
    'queryFactoOrNot' : IDL.Func([IDL.Nat], [_AzleResult_1], ['query']),
    'registerYourself' : IDL.Func([], [_AzleResult], []),
    'updateData' : IDL.Func([IDL.Nat], [_AzleResult], []),
    'vote' : IDL.Func([IDL.Nat, IDL.Text], [_AzleResult], []),
  });
};
export const init = ({ IDL }) => { return []; };
