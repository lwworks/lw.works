import { Heading } from "../atoms/heading";
import { Navigation } from "../atoms/navigation";
import { Card } from "../ui/card";

type HeroProps = {
  title: string;
  description: string;
  withNav?: boolean;
}

export const HeroSection = ({ title, description, withNav = false }: HeroProps) => {
  return (
    <Card className="w-full max-w-5xl mx-auto rounded-3xl p-8 gap-0">
      {withNav && <Navigation />}
      <Heading level={1} size="xl">{title}</Heading>
    </Card>
  )
}