"use client"

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Barbershop, Service } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { generateDayTimeList } from "../helpers/hours";
import { format } from "date-fns";

interface ServiceItemProps {
  service: Service;
  isAuthenticated: boolean;
  barbershop: Barbershop;
}

export function ServiceItem({
  service,
  isAuthenticated,
  barbershop,
}: ServiceItemProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hour, setHour] = useState<string | undefined>();

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      return signIn("google");
    }
  };

  const timeList = useMemo(() => {
    return date ? generateDayTimeList(date) : [];
  }, [date]);

  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined);
  };

  const handleHourClick = (time: string) => {
    setHour(time);
  };

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
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary" onClick={handleBookingClick}>
                    Reservar
                  </Button>
                </SheetTrigger>
                <SheetContent className="p-0">
                  <SheetHeader className="text-left px-5 py-6 border-b border-secondary">
                    <SheetTitle>Fazer reserva</SheetTitle>
                  </SheetHeader>

                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateClick}
                    fromDate={new Date()}
                    className="px-0"
                    locale={ptBR}
                    styles={{
                      head_cell: {
                        width: "100%",
                        textTransform: "capitalize",
                      },
                      cell: {
                        width: "100%",
                      },
                      button: {
                        width: "100%",
                      },
                      nav_button_previous: {
                        width: "32px",
                        height: "32px",
                      },
                      nav_button_next: {
                        width: "32px",
                        height: "32px",
                      },
                      caption: {
                        textTransform: "capitalize",
                      },
                    }}
                  />

                  {date && (
                    <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden gap-3 py-3 px-5 border-t border-secondary scroll">
                      {timeList.map((time) => (
                        <Button
                          key={time}
                          variant={hour == time ? "default" : "outline"}
                          className="rounded-full border border-secondary"
                          onClick={() => handleHourClick(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="py-3 px-5 border-t border-secondary">
                    <Card>
                      <CardContent className="flex flex-col p-3 gap-2">
                        <div className="flex justify-between">
                          <h2 className="font-bold">{service.name}</h2>
                          <h3 className="font-bold text-sm">
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(service.price))}
                          </h3>
                        </div>

                        {date && (
                          <div className="flex justify-between capitalize">
                            <h3 className="text-gray-400 text-sm">Dia</h3>
                            <h4 className="text-sm font-extralight">
                              {format(date, "dd 'de' MMMM", { locale: ptBR })}
                            </h4>
                          </div>
                        )}

                        {hour && (
                          <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm">Horário</h3>
                            <h4 className="text-sm font-extralight">{hour}</h4>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <h3 className="text-gray-400 text-sm">Barbearia</h3>
                          <h4 className="text-sm font-extralight">
                            {barbershop.name}
                          </h4>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <SheetFooter className="px-5">
                    <Button disabled={!hour || !date}>Confirmar reserva</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
