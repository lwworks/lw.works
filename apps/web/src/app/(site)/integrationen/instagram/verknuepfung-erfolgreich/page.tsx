import { InstagramSuccessPage } from "@/components/pages/instagram/success";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: 'Instagram-Verknüpfung erfolgreich',
  description: '',
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { username } = await searchParams
  if (!username || Array.isArray(username)) notFound()

  return (
    <InstagramSuccessPage username={username} />
  )
}