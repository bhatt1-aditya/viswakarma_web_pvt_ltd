import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../utils/apiConfig";
// import logo from "../../Assets/Logos/logo.svg";
import { VscCallIncoming } from "react-icons/vsc";
import { RxCross2 } from "react-icons/rx";
import { CiMenuFries } from "react-icons/ci";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const MainNavbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showServicesMobile, setShowServicesMobile] = useState(false);
  const [categories, setCategories] = useState([]);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [subcategories, setSubcategories] = useState({});
  const [loadingSubcategories, setLoadingSubcategories] = useState({});
  const [expandedCategoryMobile, setExpandedCategoryMobile] = useState(null);
  const [subServiceLoading, setSubServiceLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/category/fetch-all`,
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    setSubServiceLoading(true);
    if (subcategories[categoryId]) return;

    setLoadingSubcategories((prev) => ({ ...prev, [categoryId]: true }));

    try {
      const response = await axios.get(
        `${API_BASE_URL}/subcategory/get-by-id/${categoryId}`,
      );

      setSubcategories((prev) => ({
        ...prev,
        [categoryId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories((prev) => ({
        ...prev,
        [categoryId]: [],
      }));
    } finally {
      setSubServiceLoading(false);
      setLoadingSubcategories((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
    setIsOpen(false);
    setShowServices(false);
    setShowServicesMobile(false);
    setExpandedCategoryMobile(null);
  };
  const handleServiceNavigation = (category, subcategory = null) => {
    const idToSend = subcategory ? subcategory._id : category._id;
    navigate(`/service/${idToSend}`);
    window.scrollTo(0, 0);
    setIsOpen(false);
    setShowServices(false);
    setShowServicesMobile(false);
    setExpandedCategoryMobile(null);
  };
  const handleCategoryHover = (categoryId) => {
    setHoveredCategoryId(categoryId);
    fetchSubcategories(categoryId);
  };

  const handleCategoryClickMobile = (categoryId) => {
    if (expandedCategoryMobile === categoryId) {
      setExpandedCategoryMobile(null);
    } else {
      setExpandedCategoryMobile(categoryId);
      fetchSubcategories(categoryId);
    }
  };

  return (
    <div className="md:px-10 px-6 py-4 border-t border-b border-gray-100 relative bg-white">
      <div className="flex gap-2 justify-between items-center">
        {/* Logo */}
        {/* <img
          src={logo}
          className="h-auto xl:w-auto lg:w-[12%] w-auto object-contain cursor-pointer"
          alt="Logo"
          onClick={() => handleNavigation("/")}
        /> */}

        {/* Desktop Menu */}
        <ul className="lg:flex text-[#4f4f4f] familjen-font hidden xl:gap-10 gap-6 uppercase relative">
          <li
            className="text-[1rem] font-medium cursor-pointer hover:text-primaryColor transition-colors"
            onClick={() => handleNavigation("/about")}
          >
            About
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="lg:flex hidden gap-2">
          <button
            className="uppercase xl:px-10 xl:py-4 px-6 py-2 bg-[#EA2D4D] text-white text-sm font-bold rounded-md hover:bg-red-600 transition-colors"
            onClick={() => handleNavigation("/login")}
          >
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-2xl p-2">
            <CiMenuFries />
          </button>
        </div>

        {/* Mobile Overlay */}
        <div
          className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          onClick={() => {
            setIsOpen(false);
            setShowServicesMobile(false);
            setExpandedCategoryMobile(null);
          }}
        ></div>

        {/* Mobile Sidebar */}
        <div
          className={`fixed right-0 overflow-y-auto top-0 h-full w-64 bg-white z-50 p-6 transform transition-transform duration-300 ease-in-out lg:hidden shadow-xl ${isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex flex-col h-full">
            {/* Header with Close Button */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="h-10 w-10 bg-primatext-primaryColor rounded-md flex items-center justify-center">
                  <VscCallIncoming className="text-white" size={20} />
                </span>
                <div className="flex flex-col">
                  <a href="tel:+917008156600" className="text-sm font-medium">
                    +91 7008156600
                  </a>
                  <p className="text-sm text-[#4f4f4f]">Call Us Today</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowServicesMobile(false);
                  setExpandedCategoryMobile(null);
                }}
                className="text-2xl p-2 hover:text-primaryColor transition-colors"
              >
                <RxCross2 />
              </button>
            </div>

            {/* Navigation List */}
            <ul className="flex flex-col gap-3 flex-1 mb-6">
              <li
                className="text-[1rem] font-medium cursor-pointer hover:text-primaryColor transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                onClick={() => handleNavigation("/about")}
              >
                About
              </li>

              {/* Dynamic Services Mobile */}
              <li className="text-[1rem] font-medium cursor-pointer transition-colors py-2 px-4 rounded-md">
                <span
                  onClick={() => setShowServicesMobile((prev) => !prev)}
                  className="flex items-center hover:text-primaryColor justify-between"
                >
                  Services
                  <FaAngleDown
                    size={16}
                    className={`transition-all duration-500 ${showServicesMobile ? "rotate-180" : "rotate-0"
                      }`}
                  />
                </span>
                {showServicesMobile && (
                  <ul
                    className={`text-[.9rem] transition-all mt-3 duration-500 overflow-hidden shadow-lg w-full`}
                  >
                    {categories.map((category, index) => {
                      const categorySubcategories =
                        subcategories[category._id] || [];
                      const hasSubcategories = categorySubcategories.length > 0;
                      const isExpanded =
                        expandedCategoryMobile === category._id;
                      return (
                        <li
                          key={category._id}
                          className="border-b last:border-b-0"
                        >
                          <div
                            className="px-4 py-2 cursor-pointer hover:text-primaryColor flex justify-between items-center"
                            onClick={() => {
                              if (
                                hasSubcategories ||
                                loadingSubcategories[category._id]
                              ) {
                                handleCategoryClickMobile(category._id);
                              } else {
                                index !== 1 &&
                                  handleServiceNavigation(category);
                              }
                            }}
                          >
                            <span
                              onClick={() => fetchSubcategories(category._id)}
                            >
                              {category.title}
                            </span>
                            {loadingSubcategories[category._id] ? (
                              <span className="text-xs">...</span>
                            ) : hasSubcategories ? (
                              <FaAngleUp
                                size={16}
                                className={`transition-all duration-500 ${isExpanded ? "rotate-0" : "rotate-180"
                                  }`}
                              />
                            ) : null}
                          </div>

                          {/* Subcategories Mobile */}
                          {isExpanded && hasSubcategories && (
                            <ul className="pl-4 text-sm">
                              {categorySubcategories.map((subcategory) => (
                                <li
                                  key={subcategory._id}
                                  className="px-4 py-2 hover:text-primaryColor cursor-pointer"
                                  onClick={() =>
                                    handleServiceNavigation(
                                      category,
                                      subcategory,
                                    )
                                  }
                                >
                                  {subcategory.title}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>

              <li
                className="text-[1rem] font-medium cursor-pointer hover:text-primaryColor transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                onClick={() => handleNavigation("/package")}
              >
                Packages
              </li>
              <li
                className="text-[1rem] font-medium cursor-pointer hover:text-primaryColor transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                onClick={() => handleNavigation("/blog")}
              >
                Blogs
              </li>
              <li
                onClick={() => handleNavigation("/gallery")}
                className="text-[1rem] font-medium cursor-pointer hover:text-primaryColor transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
              >
                Gallery
              </li>
              <li
                className="text-[1rem] font-medium cursor-pointer hover:text-primaryColor transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                onClick={() => handleNavigation("/career")}
              >
                Career
              </li>
              <li
                className="text-[1rem] font-medium cursor-pointer hover:text-primaryColor transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                onClick={() => handleNavigation("/contact")}
              >
                Contact
              </li>
            </ul>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                className="bg-primaryColor hover:bg-[#069ab7] uppercase w-full px-10 py-4 text-white text-sm font-bold rounded-md transition-colors"
                onClick={() => handleNavigation("/book-inquiry")}
              >
                MAKE APPOINTMENT
              </button>
              <button
                className="uppercase w-full px-10 py-4 bg-[#EA2D4D] text-white text-sm font-bold rounded-md hover:bg-red-600 transition-colors"
                onClick={() => handleNavigation("/login")}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNavbar;
