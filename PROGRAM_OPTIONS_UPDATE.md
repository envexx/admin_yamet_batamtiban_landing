# Program Options Update - Main Dropdown Implementation

## Summary
Updated the program therapy feature to add "CBT", "Neurosenso", and "Hidroterapi" as main program options in the program dropdown, instead of implementing them as sub-programs.

## Changes Made

### 1. Type Definitions (`src/types/index.ts`)
- **Removed** `sub_program?: string;` from:
  - `ProgramTerapi` interface
  - `CreateProgramTerapiData` interface  
  - `UpdateProgramTerapiData` interface

### 2. Component Updates (`src/components/Patients/ProgramTerapiList.tsx`)

#### Removed Sub-Program Functionality:
- **Removed** `getSubProgramOptions()` function
- **Removed** `isSubProgramRequired()` function
- **Removed** all `sub_program` field references from form states
- **Removed** sub-program dropdown sections from both add and edit forms
- **Removed** sub-program display in program cards
- **Removed** sub-program validation logic

#### Updated Program Options:
- **Added** new program options to main dropdown:
  - `NEUROSENSO` - "Neurosenso"
  - `HIDROTERAPI` - "Hidroterapi"
- **Updated** both add and edit form dropdowns to include the new options
- **Simplified** form change handlers to remove sub-program logic

### 3. Program Options Available
The main program dropdown now includes:
- `BT` - Behavioral Therapy
- `OT` - Occupational Therapy  
- `TW` - Terapi Wicara
- `SI` - Sensory Integration
- `CBT` - Cognitive Behavioral Therapy
- `NEUROSENSO` - Neurosenso
- `HIDROTERAPI` - Hidroterapi

## Implementation Details

### Form Structure
- **Before**: Had conditional sub-program dropdown that appeared for OT, BT, SI
- **After**: Single main program dropdown with all options including the new ones

### Data Flow
- **Before**: `program_name` + `sub_program` fields
- **After**: Only `program_name` field with expanded options

### User Experience
- **Simplified**: Users now select from a single dropdown with all available program types
- **Consistent**: All program types are treated equally in the interface
- **Cleaner**: No conditional dropdowns or complex validation logic

## Benefits
1. **Simplified UI**: Single dropdown instead of conditional sub-dropdowns
2. **Better UX**: All program options visible at once
3. **Easier Maintenance**: No complex conditional logic
4. **Consistent Data**: All programs stored in the same field
5. **Future-Proof**: Easy to add more program types

## Files Modified
- `src/types/index.ts` - Removed sub_program from interfaces
- `src/components/Patients/ProgramTerapiList.tsx` - Updated component logic and UI

## Testing Required
- Verify new program options appear in dropdown
- Test adding programs with new options
- Test editing programs with new options
- Ensure existing programs still work correctly
- Verify form validation works properly 