"use server";

import { db } from "@/lib/prisma";
import { endOfDay, startOfDay } from "date-fns";

export const getDayBookings = async (barbershopId: string, date: Date) => {
  const bookings = await db.booking.findMany({
    where: {
      barbershopId,
      date: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
    },
  });

  return bookings
};
