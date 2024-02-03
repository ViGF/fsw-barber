"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Service } from "@prisma/client";
import { signIn } from "next-auth/react";
import Image from "next/image";

interface ServiceItemProps {
  service: Service;
  isAuthenticated: boolean;
}

export function ServiceItem({ service, isAuthenticated }: ServiceItemProps) {
  const handleBookingClick = () => {
    if (!isAuthenticated) {
      return signIn("google")
    }
  } 

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex gap-4 items-center">
          <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
            <Image
              fill
              sizes="110px"
              alt={service.name}
              src={service.imageUrl}
              className="object-contain rounded-lg"
            />
          </div>

          <div className="flex flex-col w-full">
            <h2 className="font-bold text-sm">{service.name}</h2>
            <p className="text-xs text-gray-400">{service.description}</p>

            <div className="flex items-center justify-between mt-3">
              <p className="text-primary text-sm font-bold">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>
              <Button variant="secondary" onClick={handleBookingClick}>Reservar</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
