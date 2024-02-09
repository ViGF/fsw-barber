"use client"

import { Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Image from "next/image";
import { Button } from "./ui/button";
import { cancelBooking } from "@/app/actions/cancel-button";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true;
      barbershop: true;
    };
  }>;
}

export function BookingItem({ booking }: BookingItemProps) {
  const isBookingConfirmed = isFuture(booking.date);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  const handleCancelClick = async () => {
    setIsDeleteLoading(true)
    
    try {
      await cancelBooking(booking.id)

      toast.success("Reserva cancelada com sucesso")
    } catch (error) {
      console.log(error)
    } finally {
      setIsDeleteLoading(false)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="min-w-full">
          <CardContent className="flex py-0 px-0">
            <div className="flex flex-[3] flex-col gap-3 py-5 pl-5">
              <Badge
                variant={isBookingConfirmed ? "default" : "secondary"}
                className="text-primary w-fit"
              >
                {isBookingConfirmed ? "Confirmado" : "Finalizado"}
              </Badge>
              <h2 className="font-bold">{booking.service.name}</h2>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={booking.barbershop.imageUrl} />
                  <AvatarFallback>{booking.barbershop.name[0]}</AvatarFallback>
                </Avatar>

                <h3 className="text-sm">{booking.barbershop.name}</h3>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center border-l border-secondary p-6">
              <p className="text-sm capitalize">
                {format(booking.date, "MMMM", { locale: ptBR })}
              </p>
              <p className="text-2xl">{format(booking.date, "dd")}</p>
              <p className="text-sm">{format(booking.date, "HH:mm")}</p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent className="px-0">
        <SheetHeader className="text-left pb-6 border-b border-secondary px-5">
          <SheetTitle>Informações da reserva</SheetTitle>
        </SheetHeader>

        <div className="px-5">
          <div className="relative h-[180px] w-full mt-6">
            <Image
              src="/barbershop-map.png"
              fill
              alt="Localização da barbearia no mapa"
            />

            <div className="px-5">
              <div className="w-full absolute bottom-4 left-0 px-5">
                <Card>
                  <CardContent className="p-3 flex gap-2">
                    <Avatar>
                      <AvatarImage src={booking.barbershop.imageUrl} />
                      <AvatarFallback>
                        {booking.barbershop.name[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h2 className="font-bold">{booking.barbershop.name}</h2>
                      <h3 className="text-xs overflow-hidden text-nowrap text-ellipsis">
                        {booking.barbershop.address}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <Badge
            variant={isBookingConfirmed ? "default" : "secondary"}
            className="text-primary w-fit my-3"
          >
            {isBookingConfirmed ? "Confirmado" : "Finalizado"}
          </Badge>

          <Card>
            <CardContent className="flex flex-col p-3 gap-2">
              <div className="flex justify-between">
                <h2 className="font-bold">{booking.service.name}</h2>
                <h3 className="font-bold text-sm">
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(booking.service.price))}
                </h3>
              </div>

              <div className="flex justify-between capitalize">
                <h3 className="text-gray-400 text-sm">Dia</h3>
                <h4 className="text-sm font-extralight">
                  {format(booking.date, "dd 'de' MMMM", { locale: ptBR })}
                </h4>
              </div>

              <div className="flex justify-between">
                <h3 className="text-gray-400 text-sm">Horário</h3>
                <h4 className="text-sm font-extralight">
                  {format(booking.date, "HH:mm")}
                </h4>
              </div>

              <div className="flex justify-between">
                <h3 className="text-gray-400 text-sm">Barbearia</h3>
                <h4 className="text-sm font-extralight">
                  {booking.barbershop.name}
                </h4>
              </div>
            </CardContent>
          </Card>

          <SheetFooter className="flex flex-row gap-3 mt-6">
            <SheetClose asChild>
              <Button className="w-full" variant="secondary">
                Voltar
              </Button>
            </SheetClose>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full"
                  variant="destructive"
                  disabled={!isBookingConfirmed || isDeleteLoading}
                >
                  {isDeleteLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Cancelar reserva
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[90%]">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Deseja cancelar a reserva?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Uma vez cancelada, não será possível reverter essa ação
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row gap-3">
                  <AlertDialogCancel className="w-full mt-0">
                    Voltar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="w-full"
                    onClick={handleCancelClick}
                    disabled={isDeleteLoading}
                  >
                    {isDeleteLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}