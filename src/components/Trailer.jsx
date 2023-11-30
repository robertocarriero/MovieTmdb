import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';


const API_KEY_TMDB = import.meta.env.VITE_APP_TMDB_API_KEY

const Trailer = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [trailerUrl, setTrailerUrl] = useState('');
    const [actors, setActors] = useState([]);
    const [detailedDescription, setDetailedDescription] = useState('');
    const trailerRef = useRef(null);


    useEffect(() => {
        const getTmdb = async (pageNumber) => {
            setError(null);
            setIsLoading(true);
            try {
                const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY_TMDB}&language=es-ES&page=${pageNumber}`;
                const response = await axios.get(url);
                setData(response.data.results);

            
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        getTmdb(page);
    }, [page]);

    const handleIncrement = () => {
        setPage(page + 1);
    };

    const handleDecrement = () => {
        if (page > 1) {
            setPage(page - 1);
    }
    
    };

    //Logica para conectar al trailer de youtube
    const getTrailerUrl = async (idMovie) => {
        try {
            const url = `https://api.themoviedb.org/3/movie/${idMovie}/videos?api_key=${API_KEY_TMDB}&language=es-ES`;
            const response = await axios.get(url);
            const key = extractTrailerKey(response.data);

            if (key) {
                const trailerUrl = `https://www.youtube.com/embed/${key}`;
                setTrailerUrl(trailerUrl);

                if (trailerRef.current) {
                    trailerRef.current.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                setTrailerUrl(''); // Establecemos trailerUrl como una cadena vacía 
                console.error('No se encontró un trailer para esta película.');
            }
        } catch (error) {
            console.error(error);
        }
        
    };

    const extractTrailerKey = (videos) => {
        for (const video of videos.results) {
            if ((video.type === 'Trailer' || video.type === 'Teaser') && video.site === 'YouTube') {
                return video.key;
            }
        }
        return null;
    };

    // Lógica llamada a renderizar las Cards
    const renderCards = () => {
        return (
            <div className='cards-conteiner'>
                {data.map((dato) => (
                    <div key={dato.id} className='card' style={{ cursor: 'pointer' }}>
                        <div className='card-content' onClick={() => getTrailerUrl(dato.id)}>
                            <img
                                src={`https://image.tmdb.org/t/p/w300${dato.poster_path}`}
                                alt={dato.title}
                                width={290}
                                height={380}
                                className='cards-radius'
                            />
                        </div>
                        <button onClick={() => getTrailerUrl(dato.id)}>Buscar Trailer</button>
                        <br />
                        
                    </div>
                ))}
            </div>
        );
    };
    
    // Lógica llamada arenderizar trailer
    const renderTrailer = () => {
        return (
            <div className='trailer' ref={trailerRef}>
                 {trailerUrl !== '' ? (
                    <iframe 
                        title='Trailer'
                        width='90%'
                        height='440px'
                        src={trailerUrl}
                        frameBorder='0'
                        allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div className='no-teaser'><h1>No hay trailer disponible</h1></div>
                ) 
                }
            </div>
        );
    };
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
     // Funcion que se usa para cerrar el trailer
  const closeTrailer = () => {
    setTrailerUrl('')
  }

    return (
        <div>
            <div className='peli-title'>
                <h1>Películas</h1>
            </div>
            {renderCards()}
            {renderTrailer()}
            <div className='button'>
                <button onClick={handleDecrement}>Página Anterior</button>
                <button onClick={handleIncrement}>Página Siguiente</button>
                <button onClick={scrollToTop}>Ir al inicio</button>
                <button onClick={closeTrailer}>Cerrar Trailer</button>
            </div>
            
        </div>
    );
};

export default Trailer;
