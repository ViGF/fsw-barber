"use client";

import { Button } from "@/components/ui/button";
import { Barbershop } from "@prisma/client";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BarbershopInfoProps {
  barbershop: Barbershop;
}

export function BarbershopInfo({ barbershop }: BarbershopInfoProps) {
  const router = useRouter()

  const handleBackClick = () => {
    router.back()
  }

  const handleMenuClick = () => {
    
  }

  return (
    <div>
      <div className="h-[250px] w-full relative">
        <Button
          size="icon"
          variant="outline"
          onClick={handleBackClick}
          className="z-10 top-4 left-4 absolute"
        >
          <ChevronLeftIcon />
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={handleMenuClick}
          className="z-10 top-4 right-4 absolute"
        >
          <MenuIcon />
        </Button>

        <Image
          src={barbershop.imageUrl}
          fill
          alt={`Capa ${barbershop.name}`}
          className="object-cover opacity-75"
        />
      </div>
      <div className="px-5 pt-3 pb-6 border-b border-secondary">
        <h1 className="font-bold text-xl">{barbershop.name}</h1>
        <div className="flex items-center gap-1 mt-2">
          <MapPinIcon className="text-primary" size={18} />
          <p className="text-sm">{barbershop.address}</p>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <StarIcon className="text-primary" size={18} />
          <p className="text-sm">5,0 (889 avaliações)</p>
        </div>
      </div>
    </div>
  );
}