import { Heading } from "@/components/atoms/heading";
import { Section } from "@/components/sections";
import { Clock3, Telephone, Video } from "@mynaui/icons-react";
import { BookingForm } from "./form";

interface BookingSectionProps {
  heading: string;
  description: string;
  bookingConfig: BookingConfig;
  showMessageInput?: boolean;
}

export const BookingSection = ({ heading, description, bookingConfig, showMessageInput = false }: BookingSectionProps) => {
  return (
    <Section horizontalPadding="none" verticalPadding="none" id="buchung">
      <BookingForm bookingConfig={bookingConfig} showMessageInput={showMessageInput}>
        <Heading as="h2">{heading}</Heading>
        <p className="mt-4">{description}</p>
        <ul className="mt-4 flex items-center gap-4">
          <li className="flex items-center gap-1 text-sm">
            <Clock3 strokeWidth={1.5} className="size-4 text-black dark:text-white" />
            <span>{bookingConfig.slotDuration} Min.</span>
          </li>
          <li className="flex items-center gap-1 text-sm">
            {bookingConfig.type.includes('online') ? (
              <Video strokeWidth={1.5} className="size-4 text-black dark:text-white" />
            ) : (
              <Telephone strokeWidth={1.5} className="size-4 text-black dark:text-white" />
            )}
            <span>{bookingConfig.type.length > 1 ? "Online oder am Telefon" : bookingConfig.type[0] === "phone" ? "Am Telefon" : "Online-Meeting"}</span>
          </li>
        </ul>
      </BookingForm>
    </Section>
  )
}