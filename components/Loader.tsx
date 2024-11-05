'use client';

import { PuffLoader, } from "react-spinners";



const Loader = () => {
  return (
    <div
      className="
      h-[90vh]
      flex 
      flex-col 
      justify-center 
      items-center 
    "
    >
      <PuffLoader
        size={100}
        color="#0d9488"
      />
    </div>
  );
}

export default Loader;