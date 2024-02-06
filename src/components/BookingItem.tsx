import { Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true,
      barbershop: true,
    }
  }>
}

export function BookingItem({ booking }: BookingItemProps) {
  const isBookingConfirmed = isFuture(booking.date)

  return (
    <Card className="min-w-full">
      <CardContent className="flex py-0 px-0">
        <div className="flex flex-[3] flex-col gap-3 py-5 pl-5">
          <Badge variant={isBookingConfirmed ? "default": "secondary"} className="text-primary w-fit">
            {isBookingConfirmed ? "Confirmado": "Finalizado"}
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
          <p className="text-sm capitalize">{format(booking.date, 'MMMM', { locale: ptBR })}</p>
          <p className="text-2xl">{format(booking.date, 'dd')}</p>
          <p className="text-sm">{format(booking.date, 'HH:mm')}</p>
        </div>
      </CardContent>
    </Card>
  )
}