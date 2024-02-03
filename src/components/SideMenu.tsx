"use client"

import { Avatar, AvatarImage } from "./ui/avatar";
import {
  LogOutIcon,
  UserIcon,
  LogInIcon,
  HomeIcon,
  CalendarIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { SheetHeader, SheetTitle } from "./ui/sheet";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function SideMenu() {
  const { data, status } = useSession();

  const handleLoginClick = () => signIn("google");
  const handleLogoutClick = () => signOut();
  
  return (
    <>
      <SheetHeader className="text-left p-5 border-b border-secondary">
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>

      {status == "authenticated" ? (
        <div className="flex justify-between px-5 py-6 items-center">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={data.user?.image ?? ""} />
            </Avatar>

            <h2 className="font-bold">{data.user?.name}</h2>
          </div>

          <Button variant="secondary" size="icon" onClick={handleLogoutClick}>
            <LogOutIcon />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col px-5 py-6 gap-3">
          <div className="flex items-center gap-2">
            <UserIcon size={32} />
            <h2 className="font-bold">Olá, faça seu login!</h2>
          </div>
          <Button
            variant="secondary"
            className="w-full justify-start"
            onClick={handleLoginClick}
          >
            <LogInIcon className="mr-3" size={18} />
            Fazer login com o Google
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3 px-5">
        <Button variant="outline" className="justify-start" asChild>
          <Link href="/">
            <HomeIcon size={18} className="mr-2" />
            Início
          </Link>
        </Button>

        {data?.user && (
          <Button variant="outline" className="justify-start" asChild>
            <Link href="/bookings">
              <CalendarIcon size={18} className="mr-2" />
              Agendamentos
            </Link>
          </Button>
        )}
      </div>
    </>
  );
}
