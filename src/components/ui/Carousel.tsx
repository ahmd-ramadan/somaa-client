'use client';

import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import Image from 'next/image';
import { useRef, useState } from 'react';
import PrevIcon from '../icons/Prev';
import NextIcon from '../icons/Next';
import { useLocale } from 'next-intl';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ICard {
    image: string;
    alt: string;
    link: string;
}

interface IProps {
    cards?: ICard[];
    autoplayDelay?: number;
}

const Carousel = ({ autoplayDelay = 3000 }: IProps) => {
    const locale= useLocale();
    const router = useRouter();
    const carouselRef = useRef<AliceCarousel | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const Cards = [
        { image: 'banner-1', alt: 'Banner 1', link: `${locale}/c/best-selling-products` },
        { image: 'banner-2', alt: "Banner 2", link: `${locale}/c/ramadan-discount`},
    ];

    const items = Cards.map((card, index) => (
        <div 
            // href={card.link}
            onClick={ () => { router.push(card.link) }}
            key={index} 
            className="relative w-full h-[125px] sm:h-[180px] md:h-[250px] lg:h-[400px] xl:h-[450px] cursor-pointer"
        >
            <Image 
                src={`/banners/${card.image}-${locale}.png`}
                alt={card.alt} 
                fill
                className="rounded-lg object-cover" 
            />
        </div>
    ));

    const handleSlideChange = (e: any) => {
        setActiveIndex(e.slide);
    };

    return (
        <div className="relative mx-auto w-full">
            <AliceCarousel
                ref={carouselRef}
                mouseTracking
                items={items}
                autoPlay
                autoPlayInterval={autoplayDelay}
                infinite
                controlsStrategy="alternate"
                disableButtonsControls={true}
                onSlideChanged={handleSlideChange}
            />

            {/* Custom navigation buttons */}
            { locale === 'ar' ?
                <>
                    <ArrowLeft 
                        width="20px" 
                        height="20px" 
                        onClick={() => carouselRef.current?.slidePrev()}
                        className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-100 -left-8 transition hidden lg:block absolute top-1/2 transform -translate-y-1/2"
                    />
                    <ArrowRight
                        width="20px"
                        height="20px"
                        onClick={() => carouselRef.current?.slideNext()}
                        className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-100 -right-8 transition hidden md:block absolute top-1/2 transform -translate-y-1/2"
                    />
                </>
                : 
                <>
                    <ArrowRight 
                        width="20px" 
                        height="20px" 
                        onClick={() => carouselRef.current?.slidePrev()}
                        className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-100 -right-8 transition hidden lg:block absolute top-1/2 transform -translate-y-1/2"
                        />
                    <ArrowLeft
                        width="20px"
                        height="20px"
                        onClick={() => carouselRef.current?.slideNext()}
                        className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-100 -left-8 transition hidden md:block absolute top-1/2 transform -translate-y-1/2"
                    />
                </>
            }

            {/* Custom dots overlayed on images */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {Cards.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full ${activeIndex === index ? 'bg-primary' : 'bg-white opacity-50'} hover:opacity-100 transition`}
                        onClick={() => carouselRef.current?.slideTo(index)}
                    />
                ))}
            </div>
        </div>
        
    );
};

export default Carousel;