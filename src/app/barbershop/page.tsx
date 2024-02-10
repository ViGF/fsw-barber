import { Header } from "@/components/Header";
import { db } from "@/lib/prisma";
import { BarbershopItem } from "../(home)/components/BarbershopItem";
import { redirect } from "next/navigation";
import { Search } from "../(home)/components/Search";

interface BarbershopPageSearchProps {
  searchParams: {
    search: string;
  };
}

export default async function BarbershopPageSearch({
  searchParams,
}: BarbershopPageSearchProps) {
  if (!searchParams.search) {
    return redirect("/")
  }

  const barbershops = await db.barbershop.findMany({
    where: {
      name: {
        contains: searchParams.search,
        mode: "insensitive",
      },
    },
  });

  return (
    <>
      <Header />

      <div className="px-5 mt-6">
        <Search defaultValues={{ search: searchParams.search }} />
      </div>

      <div className="px-5 py-6">
        <h1 className="text-gray-400 font-bold text-xs">
          Resultados para: {searchParams.search}
        </h1>
        <div className="grid grid-cols-2 mt-3 gap-4">
          {barbershops.map((barbershop) => (
            <div key={barbershop.id} className="w-full">
              <BarbershopItem barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
