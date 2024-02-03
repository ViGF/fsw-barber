import { Button } from "@/components/ui/button";
import { db } from "@/lib/prisma";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { BarbershopInfo } from "./components/BarbershopInfo";
import { ServiceItem } from "./components/ServiceItem";

interface BarbershopDetailsPageProps {
  params: {
    id?: string;
  };
}

export default async function BarbershopDetailsPage({
  params,
}: BarbershopDetailsPageProps) {
  if (!params.id) {
    return null;
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      Service: true
    }
  });

  if (!barbershop) {
    return null;
  }

  return (
    <div>
      <BarbershopInfo barbershop={barbershop} />

      <div className="px-5 flex flex-col gap-4 py-6">
        {barbershop.Service.map((service) => (
          <ServiceItem key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
