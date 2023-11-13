import zavala from './zavala.webp';
import './loading-spinner.css';

const LoadingSpinner = () => {
  return (
    <div>
      <img src={zavala} alt='loading' className='loading-spinner'/>
    </div>
  );
}

export default LoadingSpinner;
