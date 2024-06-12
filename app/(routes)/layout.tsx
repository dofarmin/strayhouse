import { Nunito } from "next/font/google";
import Navbar from "@/app/layout/navbar";
import RegisterModel from "@/app/layout/models/register";
import ToasterProvider from "@/app/providers/ToasterProvider";
import LoginModel from "@/app/layout/models/login";
import getCurrentUser from "@/app/actions/getCurrentUser";
import RentModel from "@/app/layout/models/rent";
import ClientOnly from "@/app/components/client-only";
import SearchModel from "@/app/layout/models/search";
import "../globals.css";

export const metadata = {
  title: "StrayHouse",
  description: "Stray House",
};

const font = Nunito({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body className={font.className} suppressHydrationWarning={true}>
        <ClientOnly>
          <ToasterProvider />
          <LoginModel />
          <RegisterModel />
          <RentModel />
          <SearchModel />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className="pb-20 pt-28">{children}</div>
      </body>
    </html>
  );
}
