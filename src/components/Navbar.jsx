// Creating a navbar consiting of logo and logout option
import { ClerkProvider } from "@clerk/clerk-react";
import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const Navbar = () => {
  return (
    <>
      <header className="w-full shadow-sm mb-6 bg-white">
        <div className="w-[85%] mx-auto flex py-4 justify-between items-center">
          <h1 className="text-2xl font-bold text-[#675efb]">NOTES</h1>
          <div className="buttons flex gap-4">
            <SignedOut>
              <SignInButton className="hover:border-black hover:text-black px-4 py-2 border-black/60 border-2 rounded-md text-black/60 bg-white font-medium">
                LogIn
              </SignInButton>
            </SignedOut>
            <SignedIn>
            <UserButton className="">
            </UserButton>
            </SignedIn>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
