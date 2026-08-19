import useSWR from 'swr'

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())

export const useAvailability = (bookingType: string) => {
  const {data, error, isLoading} = useSWR(`/api/booking/availability?type=${bookingType}`, fetcher)

  return {
    availability: data?.availability,
    loading: isLoading,
    error
  }
}
