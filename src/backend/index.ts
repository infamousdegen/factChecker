import { hashValue } from '@dfinity/agent';
import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt,nat, Variant,Service,serviceUpdate,Principal,CallResult } from 'azle';
import { validate } from 'uuid';



type registerMetadata = Record<{
    id:nat,
    Address:Principal,
    deactivated:boolean
    voteHistory:Vec<Record<{
        _marketId:nat
        _voteHistory:Opt<string>
    }>>
}>


type payload = Record<{
    id:nat,
    url:string,
    description:string,
    isFact:Opt<string>,
    isResolved:boolean,
    trueCounter:nat,
    falseCounter:nat,
    undeterminedCounter:nat,
    created_at:nat,
    justifications:Vec<string>


}>


class DepositModule extends Service{
    @serviceUpdate
    transferToMarket:(from:Principal,to:Principal,ckbtcAmount:nat) =>CallResult<boolean>
    @serviceUpdate
    transferOutOfMarket:(from:Principal,to:Principal,ckbtcAmount:nat) =>CallResult<boolean>
}

let ID:nat = 0n

const storageValue = new StableBTreeMap<nat, payload>(0, 44, 1024);
const registerUsers = new StableBTreeMap<Principal, registerMetadata>(1, 44, 1024);




const depositModuleCanister = new DepositModule(
    Principal.fromText("bkyz2-fmaaa-aaaaa-qaaaq-cai")
)


$update;
export async function withdrawForUser(__marketId:nat64) :Promise<Result<boolean,string>>{
    let caller = ic.caller();

    const value:registerMetadata = match(registerUsers.get(caller),{
        Some:(arg) =>{
            return arg
        },
        None:() => {
            ic.trap("No user found")
        }

    
    })

    const foundElemtn = value.voteHistory.find(item => item._marketId === __marketId)
    const finalString = foundElemtn?._voteHistory.Some
    if(finalString !== undefined){
        const marketMetadata = match(storageValue.get(__marketId),{
            Some:(arg) =>{
                return arg
            },
            None:() => {
                ic.trap("No user found")
            }
    
        
        })
        if(marketMetadata.isFact.Some !== undefined){
            if(marketMetadata.isFact.Some ===finalString){
                const result = await depositModuleCanister.transferOutOfMarket(ic.caller(),ic.id(),BigInt(10000)).call()

            }
            else{
                ic.trap("You have voted for a different outcome")
            }
        }
        else{
            ic.trap("You have not voted for this ")
        }
    }
    return Result.Ok<boolean,string>(true)
}
//@require: User to deposit some btc to create request

$update;
export async function createRequest(_url:string,_description:string) :Promise<Result<boolean,string>> {

    const result = await depositModuleCanister.transferToMarket(ic.id(),ic.caller(),BigInt(10000)).call()

    match(result,{
        Ok: (ok) => {
            if(ok.valueOf() !==true){
                ic.trap("Error occured with created new market ")
            }
            Result.Ok<boolean,string>(true)
        },
        Err:() => Result.Err<boolean,string>("Error occured here")
    })

    let updatedMessage: payload = {id:ID,url:_url,description:_description,isFact:Opt.None,isResolved:false,trueCounter:0n,falseCounter:0n,undeterminedCounter:0n,created_at:ic.time(),
        justifications:[]}
        

    storageValue.insert(ID,updatedMessage)

    ID = ID + 1n
    return Result.Ok<boolean,string>(true)
}


$update;
export async function updateData(_marketId:nat) :Promise<Result<boolean,string>>{


    return(match(storageValue.get(_marketId),{
        Some:(arg) => {
            const trueCounter_value = arg.trueCounter
            const falseCounter_value = arg.falseCounter
            const undeterminedCounter_value = arg.undeterminedCounter
            const returnValue = findGreatestBigInt(trueCounter_value,falseCounter_value,undeterminedCounter_value)
            let resolvedValue
            if(returnValue === trueCounter_value){
                resolvedValue = 'TRUE'

            }
            else if(returnValue === falseCounter_value){
                resolvedValue = 'FALSE'
            }
            else{
                resolvedValue = 'UNDETERMINED'
            }

            let updatedMessage:payload = {...arg,isFact:Opt.Some(resolvedValue),isResolved:true}
            storageValue.insert(_marketId,updatedMessage)

            return Result.Ok<boolean,string>(true)
        },
        None: () => Result.Err<boolean,string>("No id found ")
    }))

}

$query;
export function queryFactoOrNot(_marketId:nat) :Result<string,string> {
    return(match(storageValue.get(_marketId),{
        Some:(arg) =>{
            match(arg.isFact,{
                Some:(value) => {
                    return Result.Ok<string,string>(value)
                },
                None:() => Result.Err<string,string>("Error occured")
            })

            return Result.Err<string,string>("Occure error")
            
        },
        None:() => Result.Err<string,string>("No id found ")
    }))
}

//@todo: deposit 

$update;
export function registerYourself():Result<boolean,string>{
    let updatedMessage = {id:ID,deactivated:false,Address:ic.caller(),voteHistory:[]}
    registerUsers.insert(ic.caller(),updatedMessage)
    return Result.Ok<boolean,string>(true)
}

$update;
export function deRegister():Result<boolean,string>{
    return(match(registerUsers.get(ic.caller()),{
        Some: (arg) => {
            let updatedMessage:registerMetadata = {...arg,deactivated:false}
            registerUsers.insert(ic.caller(),updatedMessage)
            return Result.Ok<boolean,string>(true)
        },
        None:() => {
            return Result.Err<boolean,string>("Error occured")
        }
    }))
}


$update;
export function isRegistered(user: Principal) :Result<boolean,string> {
    
    return(match(registerUsers.get(user),{
        Some: (arg) => {

            return Result.Ok<boolean,string>(!(arg.deactivated))
        },
        None:() => {
            return Result.Err<boolean,string>("Error occured")
        }
    }))
}


$update;
export function vote(_marketId:nat,factType:string,justiFication:string):Result<boolean,string> {
    const isRegister = isRegistered(ic.caller());

    const value = match(isRegister,{
        Ok:(arg) => {
            return arg
        },
        Err: () => "False"
    })

    const currentMessage = match(storageValue.get(_marketId),{
        Some:(arg) => {
            return arg
        },
        None:() => ic.trap("Market id is invalid")
        
    })

    if(value === true){
        const registerValue = match(registerUsers.get(ic.caller()),{
            Some: (arg) => {
    
                return arg
            },
            None:() => {
                ic.trap("registed user not found")
            }
        })
        
        if(factType === 'TRUE'){
            let currentvalue = currentMessage.trueCounter + 1n
            currentMessage.justifications.push(justiFication)
            let updatedMessage:payload = {...currentMessage,trueCounter:currentvalue,justifications:currentMessage.justifications}

            storageValue.insert(_marketId,updatedMessage)
            registerValue.voteHistory.push({_marketId:_marketId,_voteHistory:Opt.Some('TRUE')})

            let userUpdatedMessage = {...registerValue,voteHistory:registerValue.voteHistory}
            registerUsers.insert(ic.caller(),userUpdatedMessage)
            return Result.Ok<boolean,string>(true)
        }
        else if(factType === 'FALSE'){
            let currentvalue = currentMessage.falseCounter + 1n
            let updatedMessage:payload = {...currentMessage,falseCounter:currentvalue}
            storageValue.insert(_marketId,updatedMessage)
            registerValue.voteHistory.push({_marketId:_marketId,_voteHistory:Opt.Some('FALSE')})

            let userUpdatedMessage = {...registerValue,voteHistory:registerValue.voteHistory}
            registerUsers.insert(ic.caller(),userUpdatedMessage)
            return Result.Ok<boolean,string>(true)
        }
        else if(factType === 'UNDETERMINED'){
            let currentvalue = currentMessage.undeterminedCounter + 1n
            let updatedMessage:payload = {...currentMessage,undeterminedCounter:currentvalue}
            storageValue.insert(_marketId,updatedMessage)
            registerValue.voteHistory.push({_marketId:_marketId,_voteHistory:Opt.Some('UNDETERMINED')})

            let userUpdatedMessage = {...registerValue,voteHistory:registerValue.voteHistory}
            registerUsers.insert(ic.caller(),userUpdatedMessage)
            return Result.Ok<boolean,string>(true)
        }
        else{
            ic.trap("Enter a valid input")
        }

    }
    else{
        ic.trap("You are not a registers user")
        
    }

}


function findGreatestBigInt(a: BigInt, b: BigInt, c: BigInt): BigInt {
    if (a > b) {
      if (a > c) {
        return a;
      } else {
        return c;
      }
    } else {
      if (b > c) {
        return b;
      } else {
        return c;
      }
    }
  }
  



