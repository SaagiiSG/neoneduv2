import React from 'react'
import Image from 'next/image'

const Teamcard = ({name, image, position, ditem1, ditem2, ditem3}:any) => {
  return (
    <div className='w-full flex flex-col md:flex-row lg:flex-row gap-3 md:gap-4 items-start md:border-r-2 border-[#BBBBBB]/40 p-3 md:p-4  hover:bg-gray-50/50 transition-colors duration-300'>
      <Image 
        src={image} 
        alt={name} 
        width={200} 
        height={250} 
        className='rounded-2xl flex-shrink-0 w-full md:w-[180px] lg:w-[160px] xl:w-[180px] h-auto md:h-[220px] lg:h-[190px] xl:h-[210px] object-cover' 
      />
      <div className='flex flex-col justify-start gap-3 md:gap-4 lg:gap-6 min-w-0 w-full md:w-auto'>
        <div className='flex flex-col justify-start'>
            <h3 className='text-[20px] md:text-[18px] font-clash font-medium text-[#333333] leading-tight'>{name}</h3>
            <p className='text-[16px] md:text-[14px] font-clash font-medium text-[#707070] mt-1'>{position}</p>
        </div>
        {/* Mobile separator */}
        <div className='block md:hidden w-full h-px bg-[#BBBBBB]/40'></div>
        <div className='w-full flex flex-col gap-2 md:gap-3 lg:gap-4 text-left font-montserrat text-[13px] md:text-[10px] text-[#333333] leading-relaxed'>
            {ditem1 && <p>{ditem1}</p>}
            {ditem2 && <p>{ditem2}</p>}
            {ditem3 && <p>{ditem3}</p>}
        </div>
      </div>
    </div>
  )
}

export default Teamcard
