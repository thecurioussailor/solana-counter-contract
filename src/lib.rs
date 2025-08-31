use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    program_error::ProgramError,
    entrypoint
};

#[derive(BorshDeserialize, BorshSerialize)]
enum InstructionType {
    Increment(u32),
    Decrement(u32),
}

#[derive(BorshDeserialize, BorshSerialize)]
struct Counter {
    count: u32,
}

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let acc = next_account_info(&mut accounts.iter())?;
    let mut counter_data = Counter::try_from_slice(&acc.data.borrow())?;
    let instruction_type = InstructionType::try_from_slice(instruction_data)
    .map_err(|_| ProgramError::InvalidInstructionData)?;
    match instruction_type {
        InstructionType::Increment(value) => {
            msg!("Incrementing counter by: {}", value);
           counter_data.count += value;
        }
        InstructionType::Decrement(value) => { 
            msg!("Decrementing counter by: {}", value);
            counter_data.count -= value;
        }
    }
    counter_data.serialize(&mut *acc.data.borrow_mut())?;
    msg!("Counter updated: {}", counter_data.count);
    Ok(())
}