import PropTypes from 'prop-types';
import { CheckCircle, Home,  } from 'lucide-react';
import { Link } from './Link';

export function SuccessCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
        <p className="text-gray-600 mb-6">Your donation was successful</p>
        
     
       
    
        
        <div className="flex flex-col w-full gap-3">
         
        
          <Link href="/" variant="ghost" icon={Home}>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

SuccessCard.propTypes = {
  amount: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
  transactionId: PropTypes.string.isRequired
};