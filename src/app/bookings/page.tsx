import { Header } from "@/components/Header";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { BookingItem } from "@/components/BookingItem";

export default async function BookingsPage() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  const [confirmedBookings, finishedBookings] = await Promise.all([
    await db.booking.findMany({
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
    }),
    await db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          lt: new Date(),
        },
      },
      include: {
        service: true,
        barbershop: true,
      },
    }),
  ]);

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h1 className="text-xl font-bold mb-6">Agendamentos</h1>

        {confirmedBookings.length > 0 && (
          <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">
            Confirmados
          </h2>
        )}

        <div className="flex flex-col gap-3">
          {confirmedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>

        {confirmedBookings.length > 0 && (
          <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">
            Finalizados
          </h2>
        )}

        <div className="flex flex-col gap-3">
          {finishedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </>
  );
}
