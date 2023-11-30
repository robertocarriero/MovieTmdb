import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Swiper, SwiperSlide} from 'swiper/react';
import { Navigation, Pagination, Autoplay  } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';


const API_KEY_TMDB = import.meta.env.VITE_APP_TMDB_API_KEY


const Movies = () => {
    const [data,setData] = useState([]);
    const[isLoading,setIsLoading] = useState(false);
    const[error, setError] = useState(null);

    useEffect(() =>{
        const getTmdb = async () => {
            setError(null);
            setIsLoading(true);
            try {
              const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY_TMDB }&language=es-ES`;
              const response = await axios.get(url);
              response.data
              setData(response.data.results);
            } catch (error) {
              setError(error);
            } finally{
                setIsLoading(false)
            }
            };
            getTmdb();
    },[]);

    return (
      <>
        <div className='title'>
          <h1>REACTFLIX</h1>
        </div>
      
        <div className="swiper">
            
          <Swiper
            spaceBetween={0}
            slidesPerView={3}
            centeredSlides={true}
            loop={true}
            speed={1200}
            autoplay={{delay: 2500, disableOnInteraction: false,}}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
           
          >
            {data.map((movie) => (
                <SwiperSlide key={movie.id} className='swiper-slide'>
                   <div className="slide-content">
                   <h2 className="movie-title">{movie.original_title}</h2>
                   <img
                    src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                    alt={movie.title}
                    width={400}
                    height={480}
                    className="movie-poster"
                  />
                  
                  </div>  
                  
                </SwiperSlide>
             
            ))}
            
          </Swiper>
        </div>
        
      </>
      );
    };
    
export default Movies