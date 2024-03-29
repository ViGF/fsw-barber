import { Header } from "@/components/Header";
import { format } from 'date-fns'
import { ptBR } from "date-fns/locale";
import { Search } from "./components/Search";
import { BookingItem } from "@/components/BookingItem";
import { db } from "@/lib/prisma";
import { BarbershopItem } from "./components/BarbershopItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const [barbershop, recommendedBarbershops, confirmedBookings] = await Promise.all([
    db.barbershop.findMany(),
    db.barbershop.findMany({
      orderBy: {
        id: 'asc'
      }
    }),
    session?.user
      ? db.booking.findMany({
          where: {
            userId: (session.user as any).id,
            date: {
              gte: new Date(),
            },
          },
          include: {
            service: true,
            barbershop: true,
          },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div>
      <Header />

      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">
          {session?.user ? `Olá, ${(session.user as any).name.split()[0]}!` : 'Olá, vamos agendar um corte hoje?'}
        </h2>
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE',' dd 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      <div className="px-5 mt-6">
        <Search defaultValues={{ search: '' }} />
      </div>

      {confirmedBookings.length > 0 && (
        <div className="mt-6">
          <h2 className="pl-5 text-xs uppercase text-gray-400 font-bold mb-3">
            Agendamentos
          </h2>
          <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden px-5">
            {confirmedBookings.map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">
          Recomendados
        </h2>
        <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden px-5 mb-4">
          {recommendedBarbershops.map((barbershop) => (
            <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">
              <BarbershopItem barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">
          Populares
        </h2>
        <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden px-5 mb-4">
          {barbershop.map((barbershop) => (
            <div key={barbershop.id} className="min-w-[167px] max-w-[167px]">
              <BarbershopItem barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
