import React, { useContext } from "react";
import { Navbar, Button, Dropdown } from "flowbite-react";
import { LRContext } from "../context/LRContext";
import { useRouter } from "next/router";

const NavbarComponent = () => {
  const router = useRouter();
  return (
    <Navbar fluid={true} rounded={true}>
      <Navbar.Brand>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          HeptagonLR
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Button onClick={() => router.push('/login')} gradientDuoTone="cyanToBlue">Login / Register</Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/login" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="/about">About Us</Navbar.Link>
        <Navbar.Link href="/contact">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
