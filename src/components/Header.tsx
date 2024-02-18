"use client";

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  MenuIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";
import { SideMenu } from "./SideMenu";
import Link from "next/link";

export function Header() {
  return (
    <header>
      <Card>
        <CardContent className="p-5 justify-between flex items-center flex-row">
          <Link href="/">
            <Image src="/logo.png" alt="FSW Barber" height={22} width={130} />
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <MenuIcon />
              </Button>
            </SheetTrigger>

            <SheetContent className="p-0">
              <SideMenu />
            </SheetContent>
          </Sheet>
        </CardContent>
      </Card>
    </header>
  );
}
