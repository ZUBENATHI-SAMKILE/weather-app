import React, {useEffect, useState} from 'react';
import image from './images/image.png';

const App = () => {

  const[city, setCity] = useState('')
  const[weather, setWeather] = useState(null)
  const[locationAllowed, setLocationAllowed] = useState(false)
  
  {/* background based on weather condtion */ }
  const getWeatherBackground = (condition) => {
  if (!condition) return 'default-bg';

  const desc = condition.toLowerCase();
  if (desc.includes('clear')) return 'sunny-bg';
  if (desc.includes('cloud')) return 'cloudy-bg';
  if (desc.includes('rain')) return 'rainy-bg';
  if (desc.includes('thunder')) return 'stormy-bg';
  if (desc.includes('snow')) return 'snowy-bg';
  if (desc.includes('mist') || desc.includes('fog')) return 'foggy-bg';

  return 'default-bg';
  }


  const handleChange =(e) => {
    setCity(e.target.value)
  };

  const fetchWeather = async () => {
    if(!city.trim()) return;

    try{
       const apiKey = 'a1bc4e6a5def842d9f314f37c04c3774';
       const response = await 
       fetch( 
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

       const data = await response.json();
       if (response.ok) {
        setWeather(data);
       } else{

        setWeather(null);
        alert(data.message || 'city not found');
       }
    }
    catch (error){
      console.error('Error fetching weather:', error);
      alert('Error fetching weather');
    }
  };

  const getUserLocation = () => {
    if(!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(async(position) =>{
      const {latitude, longitude } = position.coords;
      setLocationAllowed(true);

      try{
        const apiKey = 'a1bc4e6a5def842d9f314f37c04c3774'
        const response = await fetch(
           `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        if(response.ok){
          setWeather(data);
          setCity(data.name);
        }

      }
      catch (error) {
        console.error('Error using location:', error)
      }
    }, () => {
      alert('Location access denied.')

    })
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (


    <div className='home_con'>
      <div className={`card ${getWeatherBackground(weather?.weather?.[0]?.main)}`}>
        <h1 className='title'>Weather App</h1>

        <div className='input_con'>
         <input className='input_p' type='text' value={city} onChange={handleChange} placeholder='Enter city name' />
         <button className='butto' onClick={fetchWeather}>Search</button>
        </div>
        

        {weather && (
          
          <div className='display_con'>

            <h2 className='title2'><img className='image_img' src={image} alt='' /> {weather.name}</h2>
            <h3 className='title2'>{Math.round(weather.main.temp)}°C</h3>
            <h4 className='title2'>{weather.weather[0].description}</h4>

            <div className='weather_grid'>
              <div className='circle_box'>
                <div className='circle_label'>Wind</div>
                <div className='circle_value'>{weather.wind.speed} km/h </div>
              </div>

              <div className='circle_box'>
                <div className='circle_label'> Humidity </div>
                <div className='circle_value'>{weather.main.humidity}% </div>
              </div>

              <div className='circle_box'>
                <div className='circle_label'> Pressure </div>
                <div className='circle_value'>{weather.main.pressure} mb</div>
              </div>

              <div className='circle_box'>
                <div className='circle_label'> Visibility </div>
                <div className='circle_value'>{weather.visibility / 1000} km</div>
              </div>
            </div>
          </div>

        )}
    </div>
  </div>
  )
}

export default App