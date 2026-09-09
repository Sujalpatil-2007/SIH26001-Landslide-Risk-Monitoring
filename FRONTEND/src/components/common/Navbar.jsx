import { Link, NavLink } from "react-router-dom";
import {
  Mountain,
  LayoutDashboard,
  Map,
  BrainCircuit,
  Bell,
  Info,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Risk Map",
      path: "/risk-map",
      icon: Map,
    },
    {
      name: "Prediction",
      path: "/prediction",
      icon: BrainCircuit,
    },
    {
      name: "Alerts",
      path: "/alerts",
      icon: Bell,
    },
    {
      name: "About",
      path: "/about",
      icon: Info,
    },
  ];

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07110e]/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-19 w-[calc(100%-28px)] max-w-300 items-center justify-between md:w-[calc(100%-40px)]">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-3"
        >
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#b8e986] text-[#07110e]">
            <Mountain size={22} />
          </div>

          <div>
            <div className="font-display text-base font-bold">
              LandslideGuard
            </div>

            <div className="text-[11px] text-[#7f918a]">
              NER Early Warning System
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#b8e986]/10 text-[#c8f69d]"
                      : "text-[#91a09b] hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={17} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile Button */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-lg p-2 text-[#dce5e0] transition hover:bg-white/5 md:hidden"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-white/10 px-4 pb-4 md:hidden">
          <nav className="mx-auto flex max-w-300 flex-col gap-1 pt-3">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#b8e986]/10 text-[#b8e986]"
                        : "text-[#91a09b] hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;