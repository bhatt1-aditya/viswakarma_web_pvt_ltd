import React, { useState, useEffect } from "react";
import MainNavbar from "../userNavbar/MainNavbar";

const UserNavbar = () => {
  const [showBottom, setShowBottom] = useState(true);
  let scrollTimeout = null;

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        setShowBottom(window.scrollY === 0);
      }, 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-0 w-full z-50">
      <MainNavbar />
    </div>
  );
};

export default UserNavbar;
