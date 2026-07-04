import { Link, Outlet } from "react-router";
import logo from "@/assets/logo.png";
import ProfileButton from "./header/profile-button";
import ThemeButton from "./header/theme-button";
import NotificationButton from "./header/notification-button";

export default function GlobalLayout() {
  return (
    <div className="flex min-h-[100vh] flex-col">
      <header className="h-15 border-b">
        <div className="m-auto flex h-full w-full max-w-175 justify-between px-4">
          <Link to={"/"} className="flex items-center gap-2">
            <img
              className="h-5"
              src={logo}
              alt="애니멀 로그의 로고 강아지 발바닥 모양을 하고있다."
            />
            <div className="font-bold">Animal Log</div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-5">
            <ThemeButton />
            <NotificationButton />
            <ProfileButton />
          </div>
        </div>
      </header>
      <main className="m-auto w-full max-w-175 flex-1 border-x px-4 py-6">
        <Outlet />
      </main>
      <footer className="text-muted-foreground border-t py-10 text-center">
        @hatso
      </footer>
    </div>
  );
}
