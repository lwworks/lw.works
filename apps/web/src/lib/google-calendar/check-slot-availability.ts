import {queryFreeBusy} from './query-freebusy'

export const checkSlotAvailability = async (config: BookingConfig, startTime: string, endTime: string): Promise<boolean> => {
  const busy = await queryFreeBusy(config, startTime, endTime)
  return busy.length === 0
}
