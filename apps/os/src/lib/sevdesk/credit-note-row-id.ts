/** Local ID of a credit note: SevDesk keeps them in their own table, so their IDs may clash with invoice IDs. */
export const creditNoteRowId = (sevdeskId: string) => `cn-${sevdeskId}`
