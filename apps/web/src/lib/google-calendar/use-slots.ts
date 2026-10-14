import useSWR from 'swr'

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())

export const useSlots = (bookingType: string) => {
  const {data, error, isLoading} = useSWR(`/api/booking/slots?type=${bookingType}`, fetcher)

  return {
    slots: data?.slots,
    loading: isLoading,
    error
  }
}
