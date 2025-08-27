import React from 'react';
import { SchemeData } from '../types';

interface SchemeDetailsProps {
  data: SchemeData;
}

const SchemeDetails: React.FC<SchemeDetailsProps> = ({ data }) => {
  if (!data) return null;
  
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
      <h3 className="font-semibold text-blue-800 mb-2">Scheme Details: {data.scheme_name}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <p className="text-sm"><span className="font-medium">Issuer:</span> {data.issuer}</p>
          <p className="text-sm"><span className="font-medium">State:</span> {data.state}</p>
          <p className="text-sm"><span className="font-medium">Categories:</span> {data.category?.join(', ')}</p>
        </div>
        
        <div>
          <p className="text-sm"><span className="font-medium">Confidence:</span> {(data.confidence * 100).toFixed(0)}%</p>
          <p className="text-sm"><span className="font-medium">Last Updated:</span> {data.last_checked}</p>
        </div>
      </div>
      
      <div className="mt-3">
        <h4 className="font-medium text-blue-700">Eligibility</h4>
        <p className="text-sm">{data.eligibility_summary}</p>
      </div>
      
      <div className="mt-3">
        <h4 className="font-medium text-blue-700">Benefits</h4>
        <p className="text-sm">{data.benefits_summary}</p>
      </div>
      
      {data.required_documents && data.required_documents.length > 0 && (
        <div className="mt-3">
          <h4 className="font-medium text-blue-700">Required Documents</h4>
          <ul className="text-sm list-disc list-inside">
            {data.required_documents.map((doc, index) => (
              <li key={index}>{doc}</li>
            ))}
          </ul>
        </div>
      )}
      
      {data.how_to_apply && (
        <div className="mt-3">
          <h4 className="font-medium text-blue-700">How to Apply</h4>
          <p className="text-sm"><span className="font-medium">Modes:</span> {data.how_to_apply.mode?.join(', ')}</p>
          {data.how_to_apply.steps && data.how_to_apply.steps.length > 0 && (
            <>
              <p className="text-sm font-medium mt-1">Steps:</p>
              <ol className="text-sm list-decimal list-inside">
                {data.how_to_apply.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </>
          )}
          {data.how_to_apply.deadline && (
            <p className="text-sm mt-1"><span className="font-medium">Deadline:</span> {data.how_to_apply.deadline}</p>
          )}
          {data.how_to_apply.official_portal && (
            <p className="text-sm mt-1">
              <span className="font-medium">Portal:</span>{' '}
              <a href={data.how_to_apply.official_portal} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {data.how_to_apply.official_portal}
              </a>
            </p>
          )}
        </div>
      )}
      
      {data.latest_updates && (
        <div className="mt-3">
          <h4 className="font-medium text-blue-700">Latest Updates</h4>
          <p className="text-sm">{data.latest_updates}</p>
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-3">{data.disclaimer}</p>
    </div>
  );
};

export default SchemeDetails;