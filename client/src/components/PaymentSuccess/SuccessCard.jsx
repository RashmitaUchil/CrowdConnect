import PropTypes from 'prop-types';
import { CheckCircle, Share2, Home, ArrowLeft } from 'lucide-react';
import { Link } from './Link';

export function SuccessCard({ amount, projectName, transactionId }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
        <p className="text-gray-600 mb-6">Your donation was successful</p>
        
        <div className="bg-gray-50 rounded-lg p-4 w-full mb-6">
          <p className="text-gray-600 text-sm mb-2">Amount Donated</p>
          <p className="text-3xl font-bold text-gray-900">{amount}</p>
        </div>
        
        <div className="w-full space-y-4 mb-8">
          <div className="flex justify-between">
            <span className="text-gray-600">Project</span>
            <span className="text-gray-900 font-medium">{projectName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID</span>
            <span className="text-gray-900 font-medium">{transactionId}</span>
          </div>
        </div>
        
        <div className="flex flex-col w-full gap-3">
          <Link href="/share" variant="secondary" icon={Share2}>
            Share with friends
          </Link>
          <Link href="/projects" variant="primary" icon={ArrowLeft}>
            Back to Projects
          </Link>
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