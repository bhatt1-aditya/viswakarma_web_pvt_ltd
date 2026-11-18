import React from "react";

const HeadingTexts = ({ label, text, bluetext, position }) => {
  return (
    <article
      className={`familjen-font ${position === "center" && "text-center xl:w-[50%] lg:w-[60%] lg:mx-auto"} flex flex-col gap-y-1 mb-3`}
    >
      <h3
        data-aos="fade-up"
        data-aos-duration="700"
        className="font-semibold uppercase text-primaryColor"
      >
        {label}
      </h3>
      <h1
        data-aos="fade-up"
        data-aos-duration="700"
        className="md:text-5xl text-3xl font-semibold capitalize"
      >
        {text} <span className="text-primaryColor">{bluetext}</span>
      </h1>
    </article>
  );
};

export default HeadingTexts;
