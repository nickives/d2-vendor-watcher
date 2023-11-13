interface HeaderProps {
  userName?: string;
}

const loginLinkClassName = "inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 sm:mt-0";

const Header = ({ userName }: HeaderProps) => {
  return (
    <nav className="flex w-screen justify-between flex-wrap bg-indigo-600 p-6">
      <div className="flex w-1/2 items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">Destiny 2 Vendor Watcher</span>
      </div>
      <div className="w-1/4">
        { userName }
      </div>
      <div className="block flex-grow sm:flex sm:items-end sm:w-1/6">
        <div>
          {
            userName
              ? <a href="/logout" className={loginLinkClassName}>Logout</a>
              : <a href="/login" className={loginLinkClassName}>Login</a>
          }
        </div>
      </div>
    </nav>
  );
}

export default Header;