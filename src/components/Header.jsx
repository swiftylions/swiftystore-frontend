import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBasket,
  faSun,
  faMoon,
  faAngleDown,
  faUser,
  faHome,
  faInfoCircle,
  faEnvelope,
  faUserCircle,
  faClipboardList,
  faUserShield,
  faBoxOpen,
  faComments,
  faSignOutAlt,
  faSignInAlt,
  faShieldCat,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { selectTotalQuantity } from "../store/cart-slice";
import { selectIsAuthenticated, selectUser, logout } from "../store/auth-slice";

export default function Header() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") === "dark" ? "dark" : "light";
  });

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isAdminMenuOpen, setAdminMenuOpen] = useState(false);
  const [isBurgerOpen, setBurgerOpen] = useState(false);

  const location = useLocation();
  const mobileUserMenuRef = useRef(null);
  const desktopUserMenuRef = useRef(null);
  const burgerMenuRef = useRef();
  const navigate = useNavigate();

  const toggleAdminMenu = (e) => {
    e.stopPropagation();
    setAdminMenuOpen((prev) => !prev);
  };

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setUserMenuOpen((prev) => !prev);
  };

  const toggleBurger = () => {
    setBurgerOpen((prev) => !prev);
    if (isBurgerOpen) {
      setUserMenuOpen(false);
      setAdminMenuOpen(false);
    }
  };

  const totalQuantity = useSelector(selectTotalQuantity);

  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // بستن منوها هنگام تغییر مسیر
    setBurgerOpen(false);
    setAdminMenuOpen(false);
    setUserMenuOpen(false);

    const handleClickOutside = (event) => {
      const insideDesktop = desktopUserMenuRef.current?.contains(event.target);

      const insideMobile = mobileUserMenuRef.current?.contains(event.target);

      const insideBurger = burgerMenuRef.current?.contains(event.target);

      // اگر خارج از هر دو user menu بود → ببند
      if (!insideDesktop && !insideMobile) {
        setAdminMenuOpen(false);
        setUserMenuOpen(false);
      }

      // اگر خارج از drawer بود → کل burger بسته شود
      if (!insideBurger && !event.target.closest(".burger-button")) {
        setBurgerOpen(false);
        setUserMenuOpen(false);
        setAdminMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [theme, location.pathname]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/home");
    setBurgerOpen(false);
  };

  const navLinkClass =
    "text-center text-lg font-primary font-semibold text-primary py-2 dark:text-light hover:text-blue-400 dark:hover:text-blue-100 transition duration-300 ease-in";
  const dropdownLinkClass =
    "block w-full text-left px-4 py-2 text-lg font-primary font-semibold text-primary transition duration-100 ease-in dark:text-light hover:bg-gray-100 dark:hover:bg-gray-600 hover:rounded-3xl";
  const activeLinkClass =
    "xl:shadow-m rounded-full hover:text-blue-100 dark:hover:text-gray-900 bg-primary dark:bg-light dark:text-primary text-white px-3";

  return (
    <header className="sticky md:top-0 top-0 xl:top-3 z-20">
      <div className="xl:mx-50 2xl:mx-75 md:mx-0 mx-0 xl:rounded-full md:bg-normalbg md:dark:bg-darkbg bg-normalbg dark:bg-darkbg xl:bg-transparent xl:dark:bg-transparent xl:shadow-s xl:backdrop-blur-xs xl:backdrop-brightness-130 xl:dark:backdrop-brightness-80 border-gray-300 dark:border-gray-600 transition duration-300 ease-in-out">
        <div className="flex items-center justify-between mx-auto max-w-[1152px] px-6 py-1.5">
          <Link to="/" className={navLinkClass}>
            <FontAwesomeIcon icon={faShieldCat} className="h-8 w-8" />
            <span className="font-bold">Swifty Store</span>
          </Link>

          {/* Burger Menu (Mobile) */}
          <div className="gap-4 mt-2 inline-flex md:hidden">
            <button
              className="w-8 h-8 rounded-full border border-primary dark:border-light transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              <FontAwesomeIcon
                icon={theme === "dark" ? faMoon : faSun}
                className="w-4 h-4 text-primary dark:text-light"
              />
            </button>

            <div className="mt-2">
              <Link
                to="/cart"
                className="text-primary relative dark:text-light hover:text-blue-400 dark:hover:text-blue-100 transition duration-300 ease-in-out"
              >
                <FontAwesomeIcon icon={faShoppingBasket} className="w-6" />
                <div className="absolute -top-2 -right-3 text-[0.70rem] bg-primary dark:bg-yellow-200 dark:text-black text-white font-semibold rounded-full px-1 py-0.5 shadow-s leading-none">
                  {totalQuantity}
                </div>
              </Link>
            </div>

            <button
              className={`${navLinkClass} h-12 w-8 burger-button`}
              onClick={toggleBurger}
            >
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
          </div>

          {/* Mobile Drawer */}
          <div
            ref={burgerMenuRef}
            className={`block md:hidden fixed top-13 right-6 min-w-60 h-auto rounded-4xl p-1 backdrop-blur-xl dark:backdrop-brightness-90 backdrop-brightness-125 shadow-l z-50 transform transition-transform duration-200 ease-in-out ${
              isBurgerOpen
                ? "translate-y-0 opacity-100 visible"
                : "-translate-y-2 opacity-0 invisible"
            }`}
          >
            <div className="p-6 text-sm">
              <nav className="flex flex-col justify-center z-10">
                <ul className="space-y-4">
                  <li>
                    {isAuthenticated ? (
                      <div className="relative" ref={mobileUserMenuRef}>
                        <button
                          onClick={toggleUserMenu}
                          className="w-full text-left px-2 flex items-center justify-between"
                        >
                          <span className={navLinkClass}>
                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                            {`Hello ${
                              user.name.length > 7
                                ? `${user.name.slice(0, 5)}...`
                                : user.name
                            }`}
                          </span>
                          <FontAwesomeIcon
                            icon={faAngleDown}
                            className={`text-primary dark:text-light w-4 h-4 transition-transform ${
                              isUserMenuOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isUserMenuOpen && (
                          <ul className="mt-2 ml-4 space-y-2">
                            <li>
                              <Link
                                to="/profile"
                                className={dropdownLinkClass}
                                onClick={() => setBurgerOpen(false)}
                              >
                                <FontAwesomeIcon
                                  icon={faUserCircle}
                                  className="mr-2"
                                />
                                Profile
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/orders"
                                className={dropdownLinkClass}
                                onClick={() => setBurgerOpen(false)}
                              >
                                <FontAwesomeIcon
                                  icon={faClipboardList}
                                  className="mr-2"
                                />
                                Orders
                              </Link>
                            </li>

                            {isAdmin && (
                              <>
                                <hr className="border-light" />
                                <li>
                                  <button
                                    onClick={toggleAdminMenu}
                                    className={`${dropdownLinkClass} flex items-center justify-between w-full`}
                                  >
                                    <span>
                                      <FontAwesomeIcon
                                        icon={faUserShield}
                                        className="mr-2"
                                      />
                                      Admin
                                    </span>
                                    <FontAwesomeIcon
                                      icon={faAngleDown}
                                      className={`transition-transform ${
                                        isAdminMenuOpen ? "rotate-180" : ""
                                      }`}
                                    />
                                  </button>

                                  {isAdminMenuOpen && (
                                    <ul className="ml-6 mt-2 space-y-2">
                                      <li>
                                        <Link
                                          to="/admin/products/create"
                                          className={dropdownLinkClass}
                                          onClick={() => setBurgerOpen(false)}
                                        >
                                          <FontAwesomeIcon
                                            icon={faBoxOpen}
                                            className="mr-2"
                                          />
                                          Create Product
                                        </Link>
                                      </li>
                                      <li>
                                        <Link
                                          to="/admin/orders"
                                          className={dropdownLinkClass}
                                          onClick={() => setBurgerOpen(false)}
                                        >
                                          <FontAwesomeIcon
                                            icon={faClipboardList}
                                            className="mr-2"
                                          />
                                          Orders
                                        </Link>
                                      </li>
                                      <li>
                                        <Link
                                          to="/admin/messages"
                                          className={dropdownLinkClass}
                                          onClick={() => setBurgerOpen(false)}
                                        >
                                          <FontAwesomeIcon
                                            icon={faComments}
                                            className="mr-2"
                                          />
                                          Messages
                                        </Link>
                                      </li>
                                    </ul>
                                  )}
                                </li>
                                <hr className="border-light" />
                              </>
                            )}

                            <li>
                              <Link
                                to="/home"
                                onClick={handleLogout}
                                className={dropdownLinkClass}
                              >
                                <FontAwesomeIcon
                                  icon={faSignOutAlt}
                                  className="mr-2"
                                />
                                Logout
                              </Link>
                            </li>
                          </ul>
                        )}
                      </div>
                    ) : (
                      <NavLink
                        to="/login"
                        className={`${navLinkClass} flex items-center`}
                        onClick={() => setBurgerOpen(false)}
                      >
                        <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                        Login
                      </NavLink>
                    )}
                  </li>
                  <hr className="border-light" />

                  <li onClick={() => setBurgerOpen(false)}>
                    <NavLink
                      to="/home"
                      className={({ isActive }) =>
                        `flex items-center ${
                          isActive
                            ? `xl:shadow-m rounded-full bg-primary dark:bg-light dark:text-primary text-white px-3 ${navLinkClass}`
                            : navLinkClass
                        }`
                      }
                    >
                      <FontAwesomeIcon icon={faHome} className="mr-2" />
                      Home
                    </NavLink>
                  </li>

                  <li onClick={() => setBurgerOpen(false)}>
                    <NavLink
                      to="/about"
                      className={({ isActive }) =>
                        isActive
                          ? `${activeLinkClass} ${navLinkClass}`
                          : navLinkClass
                      }
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                      About
                    </NavLink>
                  </li>

                  <li onClick={() => setBurgerOpen(false)}>
                    <NavLink
                      to="/contact"
                      className={({ isActive }) =>
                        isActive
                          ? `${activeLinkClass} ${navLinkClass}`
                          : navLinkClass
                      }
                    >
                      <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                      Contact
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="bg-normalbg min-w-40 dark:bg-darkbg hidden md:block xl:shadow-depth-s xl:dark:shadow-depth-l rounded-full pr-3 pl-0.5 py-0.5">
            <nav className="flex items-center py-1.5 z-10">
              <button
                className="flex items-center justify-center mx-3 w-8 h-8 rounded-full border border-primary dark:border-light transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label="Toggle theme"
                onClick={toggleTheme}
              >
                <FontAwesomeIcon
                  icon={theme === "dark" ? faMoon : faSun}
                  className="w-4 h-4 text-primary dark:text-light"
                />
              </button>

              <ul className="flex space-x-6">
                <li>
                  <NavLink
                    to="/home"
                    className={({ isActive }) =>
                      isActive
                        ? `${activeLinkClass} ${navLinkClass}`
                        : navLinkClass
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      isActive
                        ? `${activeLinkClass} ${navLinkClass}`
                        : navLinkClass
                    }
                  >
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      isActive
                        ? `${activeLinkClass} ${navLinkClass}`
                        : navLinkClass
                    }
                  >
                    Contact
                  </NavLink>
                </li>
                <li>
                  {isAuthenticated ? (
                    <div className="relative" ref={desktopUserMenuRef}>
                      <button
                        onClick={toggleUserMenu}
                        className="relative text-primary"
                      >
                        <span className={navLinkClass}>
                          {`Hello ${
                            user.name.length > 7
                              ? `${user.name.slice(0, 5)}...`
                              : user.name
                          }`}
                        </span>
                        <FontAwesomeIcon
                          icon={faAngleDown}
                          className="text-primary dark:text-light w-6 h-6"
                        />
                      </button>

                      {isUserMenuOpen && (
                        <div className="absolute p-3 top-[-6] right-0 w-48 bg-normalbg dark:bg-darkbg z-20 transition ease-in-out duration-200 rounded-2xl shadow-l dark:shadow-gray-700">
                          <ul className="py-2">
                            <li>
                              <Link to="/profile" className={dropdownLinkClass}>
                                <FontAwesomeIcon
                                  icon={faUserCircle}
                                  className="mr-2"
                                />
                                Profile
                              </Link>
                            </li>
                            <li>
                              <Link to="/orders" className={dropdownLinkClass}>
                                <FontAwesomeIcon
                                  icon={faClipboardList}
                                  className="mr-2"
                                />
                                Orders
                              </Link>
                            </li>

                            {isAdmin && (
                              <li>
                                <button
                                  onClick={toggleAdminMenu}
                                  className={`${dropdownLinkClass} flex items-center justify-between w-full`}
                                >
                                  <span>
                                    <FontAwesomeIcon
                                      icon={faUserShield}
                                      className="mr-2"
                                    />
                                    Admin
                                  </span>
                                  <FontAwesomeIcon icon={faAngleDown} />
                                </button>

                                {isAdminMenuOpen && (
                                  <ul className="ml-4 mt-2 space-y-2">
                                    <li>
                                      <Link
                                        to="/admin/products/create"
                                        className={dropdownLinkClass}
                                      >
                                        <FontAwesomeIcon
                                          icon={faBoxOpen}
                                          className="mr-2"
                                        />
                                        Create Product
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        to="/admin/orders"
                                        className={dropdownLinkClass}
                                      >
                                        <FontAwesomeIcon
                                          icon={faClipboardList}
                                          className="mr-2"
                                        />
                                        Orders
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        to="/admin/messages"
                                        className={dropdownLinkClass}
                                      >
                                        <FontAwesomeIcon
                                          icon={faComments}
                                          className="mr-2"
                                        />
                                        Messages
                                      </Link>
                                    </li>
                                  </ul>
                                )}
                              </li>
                            )}

                            <li>
                              <Link
                                to="/home"
                                onClick={handleLogout}
                                className={dropdownLinkClass}
                              >
                                <FontAwesomeIcon
                                  icon={faSignOutAlt}
                                  className="mr-2"
                                />
                                Logout
                              </Link>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        isActive
                          ? `${activeLinkClass} ${navLinkClass}`
                          : navLinkClass
                      }
                    >
                      Login
                    </NavLink>
                  )}
                </li>
                <li>
                  <Link
                    to="/cart"
                    className="text-primary relative dark:text-light pr-6 hover:text-blue-400 dark:hover:text-blue-100 transition duration-300 ease-in-out"
                  >
                    <FontAwesomeIcon icon={faShoppingBasket} className="w-6" />
                    <div className="absolute -top-1.5 right-3 text-[0.70rem] bg-primary dark:bg-yellow-200 dark:text-black text-white font-semibold rounded-full px-1 py-0.5 shadow-s leading-none">
                      {totalQuantity}
                    </div>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
