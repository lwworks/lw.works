import {bookCalendarSlot} from '@/utils/amie/book-calendar-slot'
import {NextApiHandler} from 'next'

export const bookCall: NextApiHandler = async (req, res) => {
  try {
    const data = req.body
    const bookResponse = await bookCalendarSlot(data)
    if (!bookResponse.success) throw {message: bookResponse.error || 'Bei der Slot-Buchung ist ein Fehler aufgetreten.'}
    res.status(200).json({success: true})
  } catch (error) {
    res.status(500).json({success: false, error})
  }
}

export default bookCall
